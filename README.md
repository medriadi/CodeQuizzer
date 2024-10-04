# CodeQuizzer

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contact](#contact)

## Project Overview

CodeQuizzer is an interactive quiz platform designed to help users test and enhance their programming knowledge. Built as a full-stack application, it leverages modern technologies to provide a seamless user experience, robust back-end functionalities, and real-time data interactions.

## Features

1. **User Authentication**
    - **Registration**: Users can create an account by providing a username, email, and password.
    - **Login**: Registered users can log in using their email and password.
    - **Protected Routes**: Certain pages like Quiz, Leaderboard, and Profile are accessible only to authenticated users.
    - **JWT Authentication**: Secure token-based authentication using JSON Web Tokens.

2. **Quiz Functionality**
    - **Dynamic Quizzes**: Fetches quizzes from the database, allowing for a variety of programming language questions.
    - **Answer Submission**: Users can submit answers and receive immediate feedback.
    - **Score Calculation**: Automatically calculates and stores user scores based on quiz performance.

3. **Leaderboard**
    - **Top Performers**: Displays a leaderboard showcasing the top users based on their quiz scores.
    - **Real-Time Updates**: Leaderboard updates in real-time as users complete quizzes.

4. **User Profiles**
    - **Profile Management**: Users can view and edit their profile information.
    - **Quiz History**: Displays a history of quizzes taken and scores achieved.

5. **Answer Explanations and Learning Prompts**
    - **Detailed Explanations**: Provides explanations for correct answers to enhance learning.
    - **Learning Resources**: Offers prompts or links to resources for incorrect answers to encourage further study.

## Live Demo

[View CodeQuizzer Live Demo](#)

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **npm**: Comes bundled with Node.js. Alternatively, you can use yarn if preferred.
- **MongoDB**: Set up a MongoDB database. You can use MongoDB Atlas for a cloud-based solution.

### Clone the Repository

```bash
git clone https://github.com/medriadi/CodeQuizzer.git
cd CodeQuizzer
```

### Install Dependencies

#### Back-end (Server)

```bash
cd server
npm install
```

#### Front-end (Client)

```bash
cd ../client
npm install
```

### Run the Application

Navigate back to the root directory and start both the server and client concurrently:

```bash
cd ..
npm run dev
```

- **Server**: Runs on [http://localhost:5000](http://localhost:5000)
- **Client**: Runs on [http://localhost:3000](http://localhost:3000)

## Usage

- **Register a New User**:
    - Navigate to [http://localhost:3000/register](http://localhost:3000/register).
    - Fill out the registration form and submit.

- **Login**:
    - Navigate to [http://localhost:3000/login](http://localhost:3000/login).
    - Enter your credentials and log in.

- **Take a Quiz**:
    - After logging in, navigate to the Quiz page.
    - Answer the questions and submit to view your score.

- **View Leaderboard**:
    - Access the Leaderboard to see top performers.

- **Manage Profile**:
    - Visit your Profile page to view or edit your information and quiz history.

## API Documentation

### Authentication Routes

#### Register User

- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:

    ```json
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "password123"
    }
    ```

- **Response**:
    - **Success**: Returns a JWT token.

    ```json
    {
      "token": "your_jwt_token"
    }
    ```

    - **Error**: Returns an error message.

    ```json
    {
      "msg": "User already exists"
    }
    ```

#### Login User

- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:

    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```

- **Response**:
    - **Success**: Returns a JWT token.

    ```json
    {
      "token": "your_jwt_token"
    }
    ```

    - **Error**: Returns an error message.

    ```json
    {
      "msg": "Invalid Credentials"
    }
    ```

#### Get Authenticated User

- **Endpoint**: `/api/auth/user`
- **Method**: `GET`
- **Headers**: `x-auth-token: your_jwt_token`
- **Response**:
    - **Success**: Returns user data without the password.

    ```json
    {
      "_id": "user_id",
      "username": "testuser",
      "email": "test@example.com",
      "date": "2023-10-01T00:00:00.000Z",
      "scores": []
    }
    ```

    - **Error**: Returns an error message.

    ```json
    {
      "msg": "No token, authorization denied"
    }
    ```

### Quiz Routes

(To be updated as you implement quiz functionalities)

## Technologies Used

- **Front-end**:
    - React
    - React Router DOM
    - Axios
    - Bootstrap
    - Create React App

- **Back-end**:
    - Node.js
    - Express.js
    - MongoDB
    - Mongoose
    - bcryptjs
    - JSON Web Tokens (JWT)
    - CORS
    - dotenv

- **Development Tools**:
    - Visual Studio Code
    - Git
    - GitHub
    - Nodemon
    - Concurrently

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or feedback, please contact:

- **Mohamed Riadi**: [mohamedriadi@outlook.com](mailto:your.email@medriadi)
- **GitHub**: [https://github.com/medriadi](https://github.com/medriadi)