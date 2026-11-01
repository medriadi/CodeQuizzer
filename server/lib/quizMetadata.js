const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "PHP",
  "Swift",
];

// Existing production documents predate category and difficulty. Normalize on read
// so their IDs, questions, and saved user history remain intact.
function quizMetadata(quiz) {
  const inferred = languages.find(
    (language) =>
      quiz.title === language || quiz.title?.startsWith(`${language} `),
  );
  return {
    ...quiz,
    category:
      quiz.category && quiz.category !== "Programming"
        ? quiz.category
        : inferred || "Programming",
    difficulty: quiz.difficulty || "Beginner",
  };
}
module.exports = { quizMetadata };
