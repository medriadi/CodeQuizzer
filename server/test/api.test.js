const assert = require("node:assert/strict");
const { test, before, after, afterEach, mock } = require("node:test");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-secret-never-used-in-production";
const { app } = require("../index");
const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Question = require("../models/Question");
const { quizMetadata } = require("../lib/quizMetadata");
let server, base;
const quizId = new mongoose.Types.ObjectId().toString();
const userId = new mongoose.Types.ObjectId().toString();
const question = new Question({
  questionText: "Choose the matching option",
  options: [" right ", "wrong", "other", "none"],
  correctAnswer: " right ",
  explanation: "Whitespace belongs to this option.",
});
const token = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET);
const request = (
  path,
  {
    body,
    token: auth = token,
    method = body ? "POST" : "GET",
    ...options
  } = {},
) =>
  fetch(base + path, {
    method,
    headers: {
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...options,
  });
before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
});
afterEach(() => mock.restoreAll());

function quizQuery() {
  const quiz = new Quiz({
    _id: quizId,
    title: "JavaScript Basics",
    questions: [question],
  });
  quiz.questions = [question];
  let projection;
  const query = {
    populate(spec) {
      projection = spec;
      return this;
    },
    async lean() {
      const data = quiz.toObject();
      data.questions = [
        projection?.select
          ? {
              _id: question._id,
              questionText: question.questionText,
              options: question.options,
            }
          : question.toObject(),
      ];
      delete data.category;
      delete data.difficulty;
      return data;
    },
    then(resolve, reject) {
      return Promise.resolve({ id: quizId, questions: [question] }).then(
        resolve,
        reject,
      );
    },
  };
  mock.method(Quiz, "findById", () => query);
  return query;
}

test("fresh startup registers referenced models and Mongoose can populate Question", async () => {
  assert.equal(mongoose.model("Question"), Question);
  mock.method(Question, "find", () => ({ exec: async () => [question] }));
  const quiz = new Quiz({
    title: "Population regression",
    questions: [question._id],
  });
  await Quiz.populate(quiz, { path: "questions" });
  assert.equal(quiz.questions[0].questionText, question.questionText);
});

test("metadata is compatible with legacy records and distinguishes Java from JavaScript", () => {
  assert.equal(
    quizMetadata({ title: "JavaScript Basics" }).category,
    "JavaScript",
  );
  assert.equal(
    quizMetadata({ title: "Java Fundamentals", category: "Programming" })
      .category,
    "Java",
  );
  assert.equal(
    quizMetadata({ title: "Python Fundamentals" }).difficulty,
    "Beginner",
  );
  assert.equal(
    quizMetadata({
      title: "Advanced Python",
      category: "Python",
      difficulty: "Advanced",
    }).difficulty,
    "Advanced",
  );
});

test("quiz detail requires authentication, rejects invalid IDs, and hides answer keys", async () => {
  assert.equal(
    (await request(`/api/quizzes/${quizId}`, { token: null })).status,
    401,
  );
  assert.equal((await request("/api/quizzes/not-an-id")).status, 404);
  quizQuery();
  const response = await request(`/api/quizzes/${quizId}`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.difficulty, "Beginner");
  assert.equal(data.category, "JavaScript");
  assert.equal(data.questions[0].correctAnswer, undefined);
  assert.equal(data.questions[0].explanation, undefined);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("scoring validates completeness and exact options; retry saves only one attempt", async () => {
  quizQuery();
  const attempts = [];
  mock.method(User, "updateOne", async (filter, update) => {
    if (
      attempts.some(
        (item) =>
          item.submissionId === filter["quizAttempts.submissionId"]?.$ne,
      )
    )
      return { matchedCount: 0 };
    attempts.push(update.$push.quizAttempts);
    return { matchedCount: 1 };
  });
  mock.method(User, "findById", () => ({
    select() {
      return this;
    },
    lean: async () => ({ quizAttempts: attempts }),
  }));
  const endpoint = `/api/quizzes/${quizId}/submit`;
  assert.equal(
    (await request(endpoint, { body: { answers: [] } })).status,
    400,
  );
  assert.equal(
    (
      await request(endpoint, {
        body: {
          answers: [{ questionId: question.id, selectedOption: "fake" }],
        },
      })
    ).status,
    400,
  );
  assert.equal(attempts.length, 0);
  const body = {
    submissionId: "test-attempt-123",
    answers: [{ questionId: question.id, selectedOption: " right " }],
  };
  const response = await request(endpoint, { body });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.score, 1);
  assert.equal(result.percentage, 100);
  assert.equal((await request(endpoint, { body })).status, 200);
  assert.equal(attempts.length, 1);
  assert.equal(
    (
      await request(endpoint, {
        body: {
          ...body,
          answers: [{ questionId: question.id, selectedOption: "wrong" }],
        },
      })
    ).status,
    409,
  );
  assert.equal(attempts.length, 1);
});

test("profile accepts an unchanged blank password without replacing it", async () => {
  const user = {
    id: userId,
    username: "Tester",
    email: "tester@example.com",
    password: "existing-hash",
    save: async () => {},
  };
  mock.method(User, "findById", async () => user);
  const response = await request("/api/profile", {
    method: "PUT",
    body: { username: "Tester", email: "tester@example.com", password: "" },
  });
  assert.equal(response.status, 200);
  assert.equal(user.password, "existing-hash");
  assert.equal((await response.json()).user.password, undefined);
});

test("health reports database readiness and invalid JSON has a useful error", async () => {
  const response = await request("/healthz", { token: null });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { status: "unavailable" });
  const malformed = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).msg, "Invalid JSON payload");
});

test("unapproved origins are rejected without a server error", async () => {
  const response = await request("/api/quizzes", {
    headers: { Origin: "https://unapproved.example" },
  });
  assert.equal(response.status, 403);
});

test("demo accounts cannot sign in", async () => {
  mock.method(User, "findOne", () => ({
    select: async () => ({ isDemo: true, password: "not-used" }),
  }));
  const response = await request("/api/auth/login", {
    body: { email: "demo@example.com", password: "some-password" },
    token: null,
  });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).token, undefined);
});

test("leaderboard identifies simulated learners separately from real users", async () => {
  mock.method(User, "find", () => ({
    select() {
      return this;
    },
    lean: async () => [
      { username: "RealLearner", quizAttempts: [{ score: 7, total: 8 }] },
      {
        username: "DemoLearner",
        isDemo: true,
        quizAttempts: [{ score: 6, total: 8 }],
      },
    ],
  }));
  const response = await request("/api/leaderboard", { token: null });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.find((row) => row.username === "DemoLearner").isDemo, true);
  assert.equal(
    data.find((row) => row.username === "RealLearner").isDemo,
    false,
  );
});
