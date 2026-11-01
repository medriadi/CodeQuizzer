import React, { useState } from "react";
import { Link } from "react-router-dom";

const topics = [
  ["JS", "JavaScript", "The language of the web.", "yellow"],
  ["Py", "Python", "Small syntax. Big possibilities.", "blue"],
  ["TS", "TypeScript", "Give your knowledge some type.", "pink"],
  ["{ }", "More topics", "Find your next rabbit hole.", "purple"],
];
export default function Home() {
  const [answer, setAnswer] = useState(null);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-dot" /> A LITTLE PRACTICE. A LOT OF PROGRESS.
          </p>
          <h1>
            Good code starts
            <br />
            with a <span>curious mind.</span>
          </h1>
          <p className="hero-lead">
            Turn “I think I know” into “I’ve got this.” Bite-sized programming
            quizzes to sharpen your skills, one good question at a time.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/quizzes">
              Find your first challenge <span>↗</span>
            </Link>
            <a className="text-link" href="#how-it-works">
              How it works <span>↓</span>
            </a>
          </div>
          <div className="hero-note">
            <span className="note-icon">✓</span> Free to explore <span>·</span>{" "}
            Built for every skill level
          </div>
        </div>
        <div className="practice-wrap">
          <span className="floating-label">LET’S WARM UP ↴</span>
          <div className="hero-card">
            <div className="preview-top">
              <span>
                <i /> quick-question.js
              </span>
              <span>•••</span>
            </div>
            <div className="preview-body">
              <div className="preview-meta">
                <span className="language-badge">JS</span>
                <span>JAVASCRIPT FUNDAMENTALS</span>
                <span>01 / 01</span>
              </div>
              <h2>What does this code return?</h2>
              <pre>
                <span className="code-purple">const</span> numbers = [1, 2, 3,
                4];{"\n"}numbers.<span className="code-yellow">filter</span>(n
                =&gt; n % 2 === 0);
              </pre>
              <p className="preview-instruction">
                Pick an answer. Trust your instincts.
              </p>
              <div className="preview-options">
                {["[1, 3]", "[2, 4]", "[1, 2, 3, 4]", "[]"].map(
                  (option, index) => (
                    <button
                      key={option}
                      onClick={() => setAnswer(index)}
                      className={`preview-option ${answer === index ? "preview-selected" : ""}`}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      <code>{option}</code>
                      {answer === index && <b>{index === 1 ? "✓" : "×"}</b>}
                    </button>
                  ),
                )}
              </div>
              <div className="preview-feedback" aria-live="polite">
                {answer === null ? (
                  <>
                    <span>✧</span> A small challenge to get your brain going.
                  </>
                ) : answer === 1 ? (
                  "✓ Nailed it! filter() keeps elements that pass the test."
                ) : (
                  "Almost! Even numbers pass the test. Try another answer."
                )}
              </div>
            </div>
          </div>
          <div className="practice-sticker">
            Less scrolling.
            <br />
            <strong>More “aha!”</strong>
            <span>✳</span>
          </div>
        </div>
      </section>
      <div className="belief-strip">
        <span>FOR THE LOVE OF LEARNING</span>
        <p>
          Not another tutorial.
          <br />
          <strong>A chance to put it into practice.</strong>
        </p>
        <span className="strip-symbol">✳</span>
        <p>
          Think it through. Try it out.
          <br />
          <strong>Leave a little better.</strong>
        </p>
      </div>
      <section className="topics-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PICK YOUR PLAYGROUND</p>
            <h2>What are you curious about?</h2>
          </div>
          <Link className="text-link" to="/quizzes">
            Explore all quizzes ↗
          </Link>
        </div>
        <div className="topic-grid">
          {topics.map(([icon, title, description, color]) => (
            <Link
              to={
                title === "More topics"
                  ? "/quizzes"
                  : `/quizzes?topic=${encodeURIComponent(title)}`
              }
              className={`topic-card topic-${color}`}
              key={title}
            >
              <span className="topic-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="topic-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="feature-section" id="how-it-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A SIMPLE WAY TO GET BETTER</p>
            <h2>Small steps. Real understanding.</h2>
          </div>
          <p>
            Make a little room for learning.
            <br />
            We’ll make it worth your while.
          </p>
        </div>
        <div className="feature-grid">
          {[
            [
              "01",
              "Find your focus",
              "Choose a language or concept you want to get comfortable with. Start where you are.",
            ],
            [
              "02",
              "Give it a go",
              "Work through focused questions at your own pace. No pressure. Just you and your next aha moment.",
            ],
            [
              "03",
              "Connect the dots",
              "Get clear explanations, learn from the tricky ones, and track your progress as you go.",
            ],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span className="feature-number">{number} /</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="join-banner">
        <span className="join-symbol">✳</span>
        <div>
          <p className="eyebrow">YOUR NEXT AHA MOMENT IS WAITING</p>
          <h2>Stay curious. Keep building.</h2>
          <p>Your future self will thank you for the practice.</p>
        </div>
        <Link className="button button-primary" to="/register">
          Let’s get started ↗
        </Link>
      </section>
      <footer className="site-footer">
        <Link className="brand" to="/">
          <span className="brand-mark">cq.</span> CodeQuizzer
        </Link>
        <span>Made for the endlessly curious.</span>
        <span>© {new Date().getFullYear()} CodeQuizzer</span>
      </footer>
    </>
  );
}
