# MERN Real-Time Chat Application

A real-time chat application built with the MERN stack. Users can register, log in, view other users, and exchange messages in real time.

## Features

* User registration and login
* JWT authentication
* Persistent login
* Real-time messaging with Socket.IO
* Chat history
* Online/offline user status
* Logout functionality

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Socket.IO

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/blax99/Chat-App.git
cd Chat-App
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the values with your own MongoDB credentials and JWT secret.

Start the backend:

```bash
npm run dev
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The application should now be available at the URL shown in your terminal, typically:

```text
http://localhost:5173
```

## Usage

1. Open the application in your browser.
2. Create a new account.
3. Log in with your credentials.
4. Select another user.
5. Start chatting in real time.

## Testing Real-Time Messaging

To test the Socket.IO real-time messaging feature:

1. Create two different user accounts.
2. Open the application in two separate browser windows or different browsers.
3. Log in with a different account in each browser.
4. Select the other user from the user list.
5. Send messages between the two accounts.

Messages should appear instantly in both browsers without refreshing the page.

## Important

Do not commit your `.env` file or expose your MongoDB credentials and JWT secret.

## License

This project is created for educational purposes.
