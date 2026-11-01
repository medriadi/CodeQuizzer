const assert = require("node:assert/strict");
const { test } = require("node:test");
const { buildCommunityData, idFor } = require("../seed-community");

test("community seed validates all records, references, and demo identities", async () => {
  const data = await buildCommunityData({
    now: new Date("2026-11-01T20:00:00Z"),
  });
  assert.equal(data.questions.length, 96);
  assert.equal(data.quizzes.length, 12);
  assert.equal(data.users.length, 20);
  const questionIds = new Set(
    data.questions.map((question) => question._id.toString()),
  );
  const quizIds = new Set(data.quizzes.map((quiz) => quiz._id.toString()));
  assert.equal(questionIds.size, data.questions.length);
  assert.equal(quizIds.size, data.quizzes.length);
  assert.equal(new Set(data.users.map((user) => user._id.toString())).size, 20);
  assert.equal(
    new Set(data.questions.map((question) => question.questionText)).size,
    96,
  );
  const answerPositions = new Set();
  for (const question of data.questions) {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.options.includes(question.correctAnswer));
    assert.ok(question.explanation.length > 30);
    answerPositions.add(question.options.indexOf(question.correctAnswer));
  }
  assert.equal(answerPositions.size, 4);
  for (const quiz of data.quizzes) {
    assert.equal(quiz.questions.length, 8);
    for (const id of quiz.questions) assert.ok(questionIds.has(id.toString()));
  }
  for (const user of data.users) {
    assert.equal(user.isDemo, true);
    assert.match(user.username, /^Demo/);
    assert.match(user.email, /@example\.invalid$/);
    assert.match(user.password, /^\$2[ab]\$12\$/);
    assert.ok(user.quizAttempts.length >= 4);
    for (const attempt of user.quizAttempts) {
      assert.ok(quizIds.has(attempt.quizId.toString()));
      assert.ok(attempt.score >= 0 && attempt.score <= attempt.total);
      assert.ok(attempt.date <= new Date("2026-11-01T20:00:00Z"));
    }
  }
  assert.equal(
    idFor("quiz:sql-foundations").toString(),
    data.quizzes
      .find((quiz) => quiz.title === "SQL: Query Foundations")
      ._id.toString(),
  );
});
