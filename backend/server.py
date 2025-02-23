# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import jwt
# from pymongo import MongoClient
# from imapclient import IMAPClient
# import os
# from dotenv import load_dotenv
# import datetime

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app)


# try:
#     client = MongoClient(os.getenv("MONGO_URI"))
#     db = client['assessment']
#     users_collection = db.users
#     emails_collection = db.emails
# except Exception as e:
#     print("Error")





# @app.route('/register', methods=['POST'])
# def register():
#     data = request.json
#     if users_collection.find_one({"email": data['email']}):
#         return jsonify({"message": "User already exists"}), 400

#     users_collection.insert_one({"email": data['email'], "password": data['password']})
#     return jsonify({"message": "User registered successfully"}), 201

# # Login user
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     user = users_collection.find_one({"email": data['email']})
    
#     if not user:
#         return jsonify({"message": "Invalid credentials"}), 401

#     access_token = jwt.encode({"email":data['email'],"password":data['password'],"exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},os.getenv("SECRET_KEY"),algorithm="HS256")
#     return jsonify({"message":"Logged in successfully","token": access_token}), 200


# @app.route('/emails', methods=["POST"])
# def get_emails():
#     token = request.headers["Authorization"]
#     data = request.json
#     #print(data)
#     #return jsonify({"msg":"success"}),200
    
#     if not token:
#         return jsonify({"message":"Invalid request"}), 401
#     try:
#         token = jwt.decode(token,os.getenv("SECRET_KEY"), algorithms=["HS256"])
#         email = data['email']
#         password = data['password']
#     except Exception as e:
#         return jsonify({"message":"invalid token/Token expired"}), 401

#     try:
#         with IMAPClient(os.getenv("IMAP_HOST")) as client:
#             client.login(email, password)
#             client.select_folder('INBOX')

#             messages = client.search(['ALL'])
#             email_list = []

#             for msgid in messages[:10]: #set email limit here
#                 data = client.fetch([msgid], ['ENVELOPE'])
#                 envelope = data[msgid][b'ENVELOPE']

#                 email_list.append({
#                     "from": envelope.from_[0].mailbox.decode() + "@" + envelope.from_[0].host.decode(),
#                     "subject": envelope.subject.decode(),
#                     "date": envelope.date.isoformat()
#                 })

#             return jsonify(email_list), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from pymongo import MongoClient
from imapclient import IMAPClient
import os
from dotenv import load_dotenv
import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

try:
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client['assessment']
    users_collection = db.users
    emails_collection = db.emails
except Exception as e:
    print("Error")

def get_imap_host(email):
    if email.endswith('@yahoo.com'):
        return os.getenv("IMAP_HOST_YAHOO")
    elif email.endswith('@gmail.com'):
        return os.getenv("IMAP_HOST_GMAIL")
    elif email.endswith('@outlook.com') or email.endswith('@hotmail.com'):
        return os.getenv("IMAP_HOST_OUTLOOK")
    else:
        return None

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"message": "User already exists"}), 400

    users_collection.insert_one({"email": data['email'], "password": data['password']})
    return jsonify({"message": "User registered successfully"}), 201

# Login user
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    #user = users_collection.find_one({"email": data['email']})
    user = users_collection.find_one({
    "email": data["email"],
    "password": data["password"]
})


    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = jwt.encode({"email": data['email'], "password": data['password'], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, os.getenv("SECRET_KEY"), algorithm="HS256")
    return jsonify({"message": "Logged in successfully", "token": access_token}), 200

@app.route('/emails', methods=["POST"])
def get_emails():
    token = request.headers.get("Authorization")
    data = request.json

    if not token:
        return jsonify({"message": "Invalid request"}), 401
    try:
        token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        email = data['email']
        password = data['password']
    except Exception as e:
        return jsonify({"message": "Invalid token/Token expired"}), 401

    imap_host = get_imap_host(email)
    if not imap_host:
        return jsonify({"message": "Unsupported email provider"}), 400

    try:
        with IMAPClient(imap_host) as client:
            client.login(email, password)
            client.select_folder('INBOX')

            messages = client.search(['ALL'])
            email_list = []

            for msgid in messages[:10]:  # set email limit here
                data = client.fetch([msgid], ['ENVELOPE'])
                envelope = data[msgid][b'ENVELOPE']

                email_list.append({
                    "from": envelope.from_[0].mailbox.decode() + "@" + envelope.from_[0].host.decode(),
                    "subject": envelope.subject.decode(),
                    "date": envelope.date.isoformat()
                })

            return jsonify(email_list), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)