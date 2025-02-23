############ NOTE: USE APP PASSWORDS TO LOGIN ############
## Important Notice on Google and Outlook IMAP Access
As of **January 2025**, Google (Gmail) and Outlook no longer support app passwords and less secure apps for IMAP authentication. Users must use OAuth authentication instead.

More details:
- [Google Support](https://support.google.com/a/answer/6260879?hl=en)

## License
This project is licensed under the MIT License.

# Email Authentication and Listing API

This project is a Flask-based backend for handling user authentication and retrieving emails via IMAP. The API supports registration, login, and fetching emails from different email providers.

## Features
- **User Authentication:** Register and login users with email and password.
- **JWT Token-Based Authentication:** Secure API endpoints with JWT tokens.
- **Fetch Emails via IMAP:** Retrieve emails from Yahoo, Gmail, and Outlook.
- **MongoDB Integration:** Store user data securely in MongoDB.
- **CORS Support:** Enables communication with frontend applications.

## Setup and Installation

### Prerequisites
- Python 3.x
- MongoDB
- An IMAP email account (Yahoo, Gmail, Outlook, etc.)
- Environment variables configured in a `.env` file

### Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/email-auth-listing.git
   cd email-auth-listing
   ```

2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

4. Create a `.env` file and add the following environment variables:
   ```ini
   SECRET_KEY=your_secret_key
   MONGO_URI=your_mongodb_connection_string
   IMAP_HOST_YAHOO=imap.mail.yahoo.com
   IMAP_HOST_GMAIL=imap.gmail.com
   IMAP_HOST_OUTLOOK=outlook.office365.com
   ```

5. Run the application:
   ```sh
   python app.py
   ```

## API Endpoints

### Register User
**POST /register**
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- Response:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### Login User
**POST /login**
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- Response:
  ```json
  {
    "message": "Logged in successfully",
    "token": "your_jwt_token"
  }
  ```

### Fetch Emails
**POST /emails**
- Headers:
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "emailpassword"
  }
  ```
- Response:
  ```json
  [
    {
      "from": "sender@example.com",
      "subject": "Email Subject",
      "date": "2025-02-23T12:34:56"
    }
  ]
  ```

