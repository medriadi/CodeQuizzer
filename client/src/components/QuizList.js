import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LoadingState from "./LoadingState";
import axiosInstance from "../axiosInstance";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [params, setParams] = useSearchParams();
  const topic = params.get("topic") || "All topics";
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All levels");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ loading: true, error: "" });
    axiosInstance
      .get("/api/quizzes")
      .then(({ data }) => {
        if (active)
          setQuizzes(
            data.map((quiz) => ({
              ...quiz,
              category:
                quiz.category && quiz.category !== "Programming"
                  ? quiz.category
                  : quiz.title.split(" ")[0],
            })),
          );
      })
      .catch(() => {
        if (active)
          setState({
            loading: false,
            error: "We couldn’t reach the quiz library. Please try again.",
          });
      })
      .finally(() => {
        if (active) setState((previous) => ({ ...previous, loading: false }));
      });
    return () => {
      active = false;
    };
  }, [retry]);
  const topics = [
    ...new Set(quizzes.map((quiz) => quiz.category).filter(Boolean)),
  ];
  const filtered = quizzes.filter(
    (quiz) =>
      (topic === "All topics" || quiz.category === topic) &&
      (difficulty === "All levels" || quiz.difficulty === difficulty) &&
      `${quiz.title} ${quiz.description || ""} ${quiz.category || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE QUIZ LIBRARY</p>
          <h1>
            A little challenge.
            <br />
            <span>A little sharper.</span>
          </h1>
        </div>
        <p>
          Follow your curiosity. Find your focus.
          <br />
          There’s always something new to learn.
        </p>
      </div>
      <div className="library-toolbar">
        <label className="search-field">
          <span className="visually-hidden">Search quizzes</span>
          <input
            type="search"
            placeholder="Search for your next aha moment…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          <span className="visually-hidden">Difficulty</span>
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            <option>All levels</option>
            {[
              ...new Set(
                quizzes.map((quiz) => quiz.difficulty).filter(Boolean),
              ),
            ].map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="topic-filters">
        {[
          ...new Set([
            "All topics",
            ...topics,
            ...(topic !== "All topics" ? [topic] : []),
          ]),
        ].map((category) => (
          <button
            className={topic === category ? "active" : ""}
            key={category}
            onClick={() =>
              setParams(category === "All topics" ? {} : { topic: category })
            }
          >
            {category}
          </button>
        ))}
      </div>
      {state.loading ? (
        <LoadingState>Finding your next challenge…</LoadingState>
      ) : state.error ? (
        <div className="empty-state" role="alert">
          <h2>A small connection hiccup.</h2>
          <p>{state.error}</p>
          <button
            className="button button-primary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try again ↻
          </button>
        </div>
      ) : (
        <>
          <p className="library-count">
            {filtered.length}{" "}
            {filtered.length === 1 ? "challenge" : "challenges"} to explore
          </p>
          {filtered.length ? (
            <div className="quiz-grid">
              {filtered.map((quiz, index) => (
                <article className="quiz-card" key={quiz._id}>
                  <div className="quiz-card-top">
                    <span className={`quiz-monogram color-${index % 4}`}>
                      {(quiz.category || "CQ").slice(0, 2)}
                    </span>
                    <span className="difficulty">
                      {quiz.difficulty || "All levels"}
                    </span>
                  </div>
                  <span className="tag">{quiz.category}</span>
                  <h2>{quiz.title}</h2>
                  <p>
                    {quiz.description ||
                      "Make your next breakthrough, one question at a time."}
                  </p>
                  <div className="quiz-card-footer">
                    <span>{quiz.questionCount} questions</span>
                    <Link className="text-link" to={`/quizzes/${quiz._id}`}>
                      Take the challenge ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>
                {quizzes.length
                  ? "No matches just yet."
                  : "The library is warming up."}
              </h2>
              <p>
                {quizzes.length
                  ? "Try another search or explore all topics."
                  : "New challenges will appear here when quizzes are added."}
              </p>
              <button
                className="button button-primary"
                onClick={() => {
                  setSearch("");
                  setDifficulty("All levels");
                  setParams({});
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
