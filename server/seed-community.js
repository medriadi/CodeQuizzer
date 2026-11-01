const crypto = require("node:crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const quizzes = require("./data/community-quizzes");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");
const User = require("./models/User");
const seedTag = "community-2026-v1";
const idFor = (key) =>
  new mongoose.Types.ObjectId(
    crypto
      .createHash("sha256")
      .update(`${seedTag}:${key}`)
      .digest("hex")
      .slice(0, 24),
  );

async function buildCommunityData({ now = new Date() } = {}) {
  const questions = [];
  const quizDocuments = quizzes.map((entry, quizIndex) => {
    const ids = entry.questions.map((question, index) => {
      const _id = idFor(`question:${entry.slug}:${index}`);
      // Rotate answer positions deterministically rather than making A the default.
      const offset = (quizIndex + index) % question.options.length;
      const options = [
        ...question.options.slice(offset),
        ...question.options.slice(0, offset),
      ];
      questions.push({ _id, ...question, options, seedTag });
      return _id;
    });
    return {
      _id: idFor(`quiz:${entry.slug}`),
      title: entry.title,
      description: entry.description,
      category: entry.category,
      difficulty: entry.difficulty,
      questions: ids,
      seedTag,
      createdAt: now,
      updatedAt: now,
    };
  });
  const names = [
    "Amina",
    "Noah",
    "Lina",
    "Omar",
    "Sofia",
    "Leo",
    "Yara",
    "Adam",
    "Nour",
    "Maya",
    "Elias",
    "Ines",
    "Sami",
    "Chloe",
    "Amir",
    "Zoe",
    "Idris",
    "Emma",
    "Rayan",
    "Lucia",
  ];
  const users = [];
  for (const [index, name] of names.entries()) {
    const attemptCount = 4 + (index % 9);
    const quizAttempts = Array.from(
      { length: attemptCount },
      (_, attemptIndex) => {
        const selected =
          quizDocuments[(index * 3 + attemptIndex) % quizDocuments.length];
        const total = selected.questions.length;
        const target = 0.48 + index * 0.022 + ((attemptIndex % 3) - 1) * 0.08;
        const score = Math.max(2, Math.min(total, Math.round(total * target)));
        const date = new Date(
          now.getTime() -
            ((attemptCount - attemptIndex) * 18 + (index % 6)) * 60 * 60 * 1000,
        );
        return {
          _id: idFor(`attempt:${name}:${attemptIndex}`),
          quizId: selected._id,
          score,
          total,
          date,
        };
      },
    );
    users.push({
      _id: idFor(`user:${name}`),
      username: `Demo${name}`,
      email: `demo.${name.toLowerCase()}@example.invalid`,
      password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12),
      isDemo: true,
      seedTag,
      quizAttempts,
      createdAt: new Date(now.getTime() - (30 + index) * 86400000),
      updatedAt: now,
    });
  }
  // Validate against the actual application schemas before any database writes.
  await Promise.all([
    ...questions.map((document) => new Question(document).validate()),
    ...quizDocuments.map((document) => new Quiz(document).validate()),
    ...users.map((document) => new User(document).validate()),
  ]);
  return { questions, quizzes: quizDocuments, users };
}

async function main() {
  const documents = await buildCommunityData();
  const counts = Object.fromEntries(
    Object.entries(documents).map(([collection, entries]) => [
      collection,
      entries.length,
    ]),
  );
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({ mode: "validated-dry-run", seedTag, counts }));
    return;
  }
  require("dotenv").config({
    path: require("node:path").join(__dirname, ".env"),
  });
  if (!process.env.MONGODB_URI)
    throw new Error("MONGODB_URI is required for --apply");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  try {
    // Deterministic IDs and insert-only upserts make reruns safe. Raw collection
    // writes preserve the prehashed random passwords without hashing them twice.
    for (const [collection, entries] of Object.entries(documents)) {
      const result = await mongoose.connection.collection(collection).bulkWrite(
        entries.map((document) => ({
          updateOne: {
            filter: { _id: document._id },
            update: { $setOnInsert: document },
            upsert: true,
          },
        })),
        { ordered: true },
      );
      console.log(
        `${collection}: ${result.upsertedCount} added, ${result.matchedCount} already present`,
      );
    }
  } finally {
    await mongoose.disconnect();
  }
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
module.exports = { buildCommunityData, idFor, seedTag };
