# CodeQuizzer

![GitHub issues](https://img.shields.io/github/issues/medriadi/CodeQuizzer)
![GitHub stars](https://img.shields.io/github/stars/medriadi/CodeQuizzer)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Demo Video](#demo-video)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Project Overview

**CodeQuizzer** is an interactive quiz platform designed to help users test and enhance their programming knowledge. Built as a full-stack application, it leverages modern technologies to provide a seamless user experience, robust back-end functionalities, and real-time data interactions. This project is a solo effort by **Mohamed RIADI** and is part of the ALX portfolio project for **Cohort-1-Blended**.

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
   - **Quiz History**: Users can view their past quiz attempts and scores.

3. **Leaderboard**
   - **Top Performers**: Displays a leaderboard showcasing the top users based on their average quiz scores.
   - **Average Percentage**: Shows each user's average percentage across all quizzes taken.
   - **Quizzes Taken**: Indicates the number of quizzes each user has attempted.
   - **Real-Time Updates**: Leaderboard updates in real-time as users complete quizzes.

4. **User Profiles**
   - **Profile Management**: Users can view and edit their profile information.
   - **Quiz History**: Displays a history of quizzes taken and scores achieved.

5. **Answer Explanations**
   - **Detailed Explanations**: Provides explanations for correct answers to enhance learning.

## Live Demo

[View CodeQuizzer Live Demo](https://codequizzer.onrender.com)

## Demo Video

[![Watch the Demo Video](https://img.youtube.com/vi/J_g-W4szBXA/0.jpg)](https://www.youtube.com/watch?v=J_g-W4szBXA)

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **npm**: Comes bundled with Node.js. Alternatively, you can use Yarn if preferred.
- **MongoDB**: Set up a MongoDB database. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based solution.

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

### Set Up Environment Variables

#### Back-end Configuration

Create a `.env` file inside the `server` directory:

```bash
cd ../server
touch .env
```

Add the following environment variables to the `.env` file:

```dotenv
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

- Replace `your_mongodb_connection_string` with your actual MongoDB connection string.
- Replace `your_jwt_secret_key` with a secure secret key for JWT.

#### Front-end Configuration

Create a `.env` file inside the `client` directory:

```bash
cd ../client
touch .env
```

Add the following environment variable:

```dotenv
REACT_APP_BACKEND_URL=http://localhost:5000
```

- If the backend is deployed and you want to connect to the live backend, set `REACT_APP_BACKEND_URL` to `https://codequizzer-backend.onrender.com`.
- Ensure that the backend is accessible at the provided URL.

**Note:** After modifying `.env` files, you must restart your development servers for changes to take effect.

### Seed the Database

Before running the application, seed the database with initial quiz data.

Navigate to the `server` directory:

```bash
cd ../server
```

Run the Seeder Script:

```bash
node seeder.js
```

- This script will populate the database with predefined quizzes and questions.
- Ensure your MongoDB server is running before executing the seeder.

### Run the Application Locally

Navigate back to the root directory and start both the server and client concurrently:

```bash
cd ..
npm run dev
```

- **Note:** Ensure you have the `concurrently` package installed in the root `package.json`. If not, install it using:

  ```bash
  npm install concurrently --save-dev
  ```

- **Server:** Runs on `http://localhost:5000`
- **Client:** Runs on `http://localhost:3000`

## Usage

### Register a New User

- Navigate to `http://localhost:3000/register`.
- Fill out the registration form and submit.

### Login

- Navigate to `http://localhost:3000/login`.
- Enter your credentials and log in.

### Take a Quiz

- After logging in, navigate to the Quizzes page via the "Get Started" button or the navigation menu.
- Select a quiz from the available list.
- Answer the questions and submit to view your score and detailed feedback.

### View Leaderboard

- Access the Leaderboard to see top performers based on average quiz scores and the number of quizzes taken.

### Manage Profile

- Visit your Profile page to view or edit your information and quiz history.

## API Documentation

### Authentication Routes

#### Register User

- **Endpoint:** `/api/auth/register`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

- **Response:**
  - **Success:** Returns a JWT token.

    ```json
    {
      "token": "your_jwt_token"
    }
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "User already exists"
    }
    ```

#### Login User

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

- **Response:**
  - **Success:** Returns a JWT token.

    ```json
    {
      "token": "your_jwt_token"
    }
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "Invalid Credentials"
    }
    ```

#### Get Authenticated User

- **Endpoint:** `/api/auth/user`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Response:**
  - **Success:** Returns user data without the password.

    ```json
    {
      "_id": "user_id",
      "username": "testuser",
      "email": "test@example.com",
      "date": "2023-10-01T00:00:00.000Z",
      "quizAttempts": []
    }
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "No token, authorization denied"
    }
    ```

### Quiz Routes

#### Get All Quizzes

- **Endpoint:** `/api/quizzes`
- **Method:** `GET`
- **Description:** Retrieves a list of all available quizzes.
- **Response:**
  - **Success:** Returns an array of quizzes.

    ```json
    [
      {
        "_id": "quiz_id",
        "title": "JavaScript Basics",
        "description": "Test your knowledge on basic JavaScript concepts."
      },
      // ... more quizzes
    ]
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "Server error"
    }
    ```

#### Get Single Quiz

- **Endpoint:** `/api/quizzes/:id`
- **Method:** `GET`
- **Description:** Retrieves a single quiz along with its questions.
- **Response:**
  - **Success:** Returns the quiz object with populated questions.

    ```json
    {
      "_id": "quiz_id",
      "title": "JavaScript Basics",
      "description": "Test your knowledge on basic JavaScript concepts.",
      "questions": [
        {
          "_id": "question_id_1",
          "questionText": "What is the output of `typeof null` in JavaScript?",
          "options": ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""],
          "correctAnswer": "\"object\"",
          "explanation": "In JavaScript, typeof null returns \"object\". This is a long-standing bug in the language."
        },
        // ... more questions
      ]
    }
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "Quiz not found"
    }
    ```

#### Submit Quiz Answers

- **Endpoint:** `/api/quizzes/:id/submit`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Body:**

  ```json
  {
    "answers": [
      {
        "questionId": "question_id_1",
        "selectedOption": "\"object\""
      },
      {
        "questionId": "question_id_2",
        "selectedOption": "Netscape"
      }
      // ... more answers
    ]
  }
  ```

- **Response:**
  - **Success:** Returns the quiz result with detailed feedback.

    ```json
    {
      "score": 8,
      "total": 10,
      "percentage": 80,
      "results": [
        {
          "questionText": "What is the output of `typeof null` in JavaScript?",
          "selectedOption": "\"object\"",
          "correctAnswer": "\"object\"",
          "explanation": "In JavaScript, typeof null returns \"object\". This is a long-standing bug in the language.",
          "isCorrect": true
        }
        // ... more results
      ]
    }
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "Please answer all questions before submitting."
    }
    ```

### Leaderboard Routes

#### Get Leaderboard

- **Endpoint:** `/api/leaderboard`
- **Method:** `GET`
- **Description:** Retrieves the top 10 users based on their average quiz scores and the number of quizzes taken.
- **Response:**
  - **Success:** Returns an array of top users.

    ```json
    [
      {
        "username": "topuser1",
        "averagePercentage": "95.50",
        "numQuizzes": 20
      },
      {
        "username": "topuser2",
        "averagePercentage": "90.75",
        "numQuizzes": 15
      }
      // ... up to top 10 users
    ]
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "Server error"
    }
    ```

### Profile Routes

#### Get User Profile

- **Endpoint:** `/api/profile`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer your_jwt_token`
- **Description:** Retrieves the authenticated user's profile information, including quiz attempts.
- **Response:**
  - **Success:** Returns the user's profile data.

    ```json
    {
      "_id": "user_id",
      "username": "testuser",
      "email": "test@example.com",
      "date": "2023-10-01T00:00:00.000Z",
      "quizAttempts": [
        {
          "quizId": "quiz_id",
          "score": 8,
          "total": 10,
          "percentage": 80,
          "date": "2023-10-16T12:00:00.000Z"
        }
        // ... more attempts
      ]
    }
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "No token, authorization denied"
    }
    ```

#### Update User Profile

- **Endpoint:** `/api/profile`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer your_jwt_token`, `Content-Type: application/json`
- **Body:**

  ```json
  {
    "username": "newusername",
    "email": "newemail@example.com",
    "password": "newpassword123"
  }
  ```

- **Response:**
  - **Success:** Returns a success message.

    ```json
    {
      "msg": "Profile updated successfully"
    }
    ```

  - **Error:** Returns an error message.

    ```json
    {
      "msg": "Failed to update profile"
    }
    ```

## Technologies Used

### Front-end

- React
- React Router DOM
- Axios
- Bootstrap
- Create React App

### Back-end

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Tokens (JWT)
- CORS
- dotenv

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Nodemon
- Concurrently

## Deployment

### Deployed Services

- **Frontend:** https://codequizzer.onrender.com
- **Backend:** https://codequizzer-backend.onrender.com


## Acknowledgments

- **ALX Africa** for the learning platform.
- **Create React App** for the project scaffolding.
- **Bootstrap** for the styling framework.
- **MongoDB Atlas** for the database solution.
- **Express.js** for the back-end framework.

## Contact

For any inquiries or feedback, please contact:

- **Mohamed Riadi:** mohamedriadi@outlook.com
- **GitHub:** [medriadi](https://github.com/medriadi)

© 2023 CodeQuizzer. All rights reserved.
