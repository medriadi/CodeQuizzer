# CodeQuizzer

A programming quiz app for focused practice. Explore topics, work through questions at your own pace, and learn from explanations after each challenge.

## What’s included

- Responsive cream and violet interface with an interactive practice question on the home page.
- Searchable quiz library with topic links and difficulty filters.
- Question navigation, answer tracking, and complete-answer validation before submission.
- Server-scored results with explanations and saved quiz history.
- Account registration, sign-in, profile editing, and a public leaderboard.
- JWT authentication, protected quiz and profile routes, and server-side request validation.

## Run locally

Requires Node.js, npm, and a MongoDB database.

```sh
npm ci
npm ci --prefix client
npm ci --prefix server
```

Create `server/.env`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/codequizzer
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
```

Create `client/.env`:

```dotenv
REACT_APP_BACKEND_URL=http://localhost:5000
```

For a fresh database, run the seeder from the server directory:

```sh
cd server
node seeder.js
cd ..
npm run dev
```

The seeder is safe to rerun: it preserves existing quiz IDs, questions, accounts, and history; fills missing category and difficulty fields; and adds missing quizzes. It does not clear collections. Older production records are also normalized by the API when read, so an existing deployment does not need to be reseeded.

The client runs at `http://localhost:3000`; the API runs at `http://localhost:5000`. The home page works independently of the API; accounts, quizzes, history, and rankings require the configured backend and database.

## Verify

```sh
npm test -- --runInBand
npm run test:server
npm run build --prefix client
```

Frontend tests cover practice feedback, filters, quiz submission, and session recovery. Backend HTTP tests cover model population, legacy metadata, answer privacy, scoring, duplicate submission protection, profile changes, readiness, and error handling. Database operations are mocked in these tests; no live data is changed.

## API

Protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint                  | Access    | Behavior                                     |
| ------ | ------------------------- | --------- | -------------------------------------------- |
| POST   | `/api/auth/register`      | Public    | Create an account and return a token         |
| POST   | `/api/auth/login`         | Public    | Sign in and return a token                   |
| GET    | `/api/auth/user`          | Protected | Load the current account                     |
| GET    | `/api/quizzes`            | Public    | List quiz metadata and question counts       |
| GET    | `/api/quizzes/:id`        | Protected | Get questions without correct answers        |
| POST   | `/api/quizzes/:id/submit` | Protected | Validate and score answers; save the attempt |
| GET    | `/api/profile`            | Protected | Get profile and quiz history                 |
| PUT    | `/api/profile`            | Protected | Update username, email, or password          |
| GET    | `/api/leaderboard`        | Public    | Get the top ten learners                     |

Quiz submission accepts `{ "answers": [{ "questionId": "...", "selectedOption": "..." }] }`, with exactly one valid option per question. Correct answers and explanations are returned after submission.

## Deploy

Build the client with `npm run build --prefix client` and publish `client/build`. Configure SPA fallback to `/index.html` for direct links and page refreshes. The repository includes configurations for Vercel and hosts supporting `_redirects`; on Render add a `/*` → `/index.html` rewrite.

Set `REACT_APP_BACKEND_URL` before building the client. Configure `MONGODB_URI`, `JWT_SECRET`, and `ALLOWED_ORIGINS` on the backend, install its dependencies, and run `npm start` in `server`.

## Stack

React 18, React Router, Axios, CSS, and Bootstrap utilities on the client. Express, Mongoose, MongoDB, bcrypt, and JWT on the server.

Created by Mohamed Riadi as an ALX portfolio project.

The backend readiness endpoint is `/healthz`. It returns 200 only while MongoDB is connected, and 503 otherwise. Use it as Render’s Health Check Path. The client allows up to 75 seconds for requests to accommodate free-service cold starts; it never automatically retries writes. Quiz drafts are kept in session storage for the current account and tab, and each submission includes an ID so retrying a lost response does not add another attempt.
