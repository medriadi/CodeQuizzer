import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setCurrent(0);
    setError("");
    axiosInstance
      .get(`/api/quizzes/${id}`)
      .then(({ data }) => {
        if (active) setQuiz(data);
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.msg ||
              "We couldn’t load this challenge. Please return to the library and try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);
  const submit = async (event) => {
    event.preventDefault();
    const missing = quiz.questions.findIndex(
      (question) => answers[question._id] === undefined,
    );
    if (missing !== -1) {
      setCurrent(missing);
      setError(
        "A question needs your attention. Answer every question before finishing.",
      );
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post(`/api/quizzes/${id}/submit`, {
        answers: quiz.questions.map((question) => ({
          questionId: question._id,
          selectedOption: answers[question._id],
        })),
      });
      setResult(data);
      window.scrollTo(0, 0);
    } catch (requestError) {
      setError(
        requestError.response?.data?.msg ||
          "Your answers couldn’t be submitted. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (loading)
    return (
      <div className="center-state" role="status">
        <span className="loader" />
        Getting your challenge ready…
      </div>
    );
  if (!quiz || !quiz.questions?.length)
    return (
      <div className="center-state">
        <h1>Challenge unavailable</h1>
        <p role="alert">
          {error || "This quiz doesn’t have any questions yet."}
        </p>
        <Link className="button button-primary" to="/quizzes">
          Back to the library
        </Link>
      </div>
    );
  const total = quiz.questions.length;
  const answered = Object.keys(answers).length;
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <section className="quiz-session">
        <div className="session-top">
          <Link className="text-link" to="/quizzes">
            ← Back to the library
          </Link>
          <span>CHALLENGE COMPLETE</span>
        </div>
        <p className="eyebrow">ONE STEP SHARPER</p>
        <h1>Every answer is progress.</h1>
        <div className="result-summary">
          <strong className="result-score">{percentage}%</strong>
          <div>
            <h2>
              {percentage === 100
                ? "You’ve got this."
                : percentage >= 60
                  ? "Nicely done. Keep that momentum."
                  : "A great place to grow from."}
            </h2>
            <p>
              {result.score} of {result.total} correct · Your progress has been
              saved.
            </p>
          </div>
        </div>
        <h2 className="review-heading">Let’s connect the dots.</h2>
        {result.results.map((item, index) => (
          <article className="review-card" key={item.questionId || index}>
            <div
              className={`review-status ${item.isCorrect ? "" : "incorrect"}`}
            >
              {item.isCorrect ? "✓ GOT IT RIGHT" : "↗ ROOM TO GROW"} · QUESTION{" "}
              {index + 1}
            </div>
            <h3>{item.questionText}</h3>
            <p>
              Your answer: <strong>{item.selectedOption}</strong>
            </p>
            {!item.isCorrect && (
              <p>
                Correct answer: <strong>{item.correctAnswer}</strong>
              </p>
            )}
            {item.explanation && (
              <p className="review-explanation">{item.explanation}</p>
            )}
          </article>
        ))}
        <div className="session-actions">
          <Link className="button button-primary" to="/quizzes">
            Find another challenge ↗
          </Link>
          <Link className="text-link" to="/profile">
            View your progress →
          </Link>
        </div>
      </section>
    );
  }
  const question = quiz.questions[current];
  return (
    <section className="quiz-session">
      <div className="session-top">
        <Link className="text-link" to="/quizzes">
          ← Back to the library
        </Link>
        <span>
          {quiz.category} / {quiz.difficulty}
        </span>
      </div>
      <h1>{quiz.title}</h1>
      <p className="session-description">{quiz.description}</p>
      <div
        className="session-progress"
        role="progressbar"
        aria-label="Questions answered"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
      >
        <span style={{ width: `${(answered / total) * 100}%` }} />
      </div>
      <div className="session-top">
        <span>
          QUESTION {current + 1} OF {total}
        </span>
        <span>{answered} ANSWERED</span>
      </div>
      <div className="question-jumps" aria-label="Jump to question">
        {quiz.questions.map((item, index) => (
          <button
            key={item._id}
            disabled={submitting}
            className={`${answers[item._id] !== undefined ? "answered" : ""} ${current === index ? "current" : ""}`}
            aria-label={`Question ${index + 1}${answers[item._id] !== undefined ? ", answered" : ""}`}
            aria-current={index === current ? "step" : undefined}
            onClick={() => setCurrent(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={submit} className="question-panel">
        <fieldset disabled={submitting}>
          <legend>{question.questionText}</legend>
          {question.options.map((option, index) => (
            <label className="answer-option" key={`${question._id}-${index}`}>
              <input
                type="radio"
                name={`question-${question._id}`}
                checked={answers[question._id] === option}
                onChange={() => {
                  setAnswers((previous) => ({
                    ...previous,
                    [question._id]: option,
                  }));
                  setError("");
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
        <div className="session-actions">
          <button
            type="button"
            className="button button-ghost"
            disabled={current === 0 || submitting}
            onClick={() => setCurrent((value) => value - 1)}
          >
            ← Previous
          </button>
          {current === total - 1 ? (
            <button
              className="button button-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Saving your answers…" : "Finish challenge ✓"}
            </button>
          ) : (
            <button
              className="button button-primary"
              type="button"
              onClick={() => setCurrent((value) => value + 1)}
            >
              Next question →
            </button>
          )}
        </div>
      </form>
      <p className="question-help">
        Take your time. You can revisit any question before finishing.
      </p>
    </section>
  );
}
