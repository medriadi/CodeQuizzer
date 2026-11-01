import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">LEVEL UP YOUR CRAFT</p>
        <h1>Think sharper.<br /><span>Code better.</span></h1>
        <p className="hero-lead">Focused programming quizzes with instant feedback, clear explanations, and progress you can actually see.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/quizzes">Browse quizzes <span>→</span></Link>
          <Link className="text-link" to="/register">Create a free account <span>↗</span></Link>
        </div>
      </div>
      <div className="hero-card" aria-label="Quiz preview">
        <div className="preview-top"><span className="status-dot" /> LIVE PRACTICE SESSION <span>01 / 10</span></div>
        <p className="preview-label">JavaScript · Fundamentals</p>
        <h2>Which method creates a new array with every element passing a test?</h2>
        {['filter()', 'forEach()', 'map()', 'reduce()'].map((option, index) => (
          <div className={`preview-option ${index === 0 ? 'preview-selected' : ''}`} key={option}><span>{String.fromCharCode(65 + index)}</span>{option}{index === 0 && <b>✓</b>}</div>
        ))}
        <div className="preview-footer"><span>Progress</span><strong>4 / 10</strong></div>
        <div className="preview-progress"><span /></div>
      </div>
    </section>
    <section className="stats-strip">
      <div><strong>100+</strong><span>Curated questions</span></div>
      <div><strong>8</strong><span>Programming topics</span></div>
      <div><strong>∞</strong><span>Ways to improve</span></div>
    </section>
    <section className="feature-section">
      <p className="eyebrow">BUILT FOR MOMENTUM</p>
      <h2>Everything you need to<br /><span>keep moving forward.</span></h2>
      <div className="feature-grid">
        <article><span className="feature-icon">◈</span><h3>Practice with purpose</h3><p>Short, focused quizzes built around the concepts developers use every day.</p></article>
        <article><span className="feature-icon">↗</span><h3>Learn from every answer</h3><p>Understand why an answer is correct with explanations that make ideas stick.</p></article>
        <article><span className="feature-icon">✦</span><h3>See your progress</h3><p>Track attempts, celebrate wins, and find the topics worth another look.</p></article>
      </div>
    </section>
    <footer className="site-footer"><span>CodeQuizzer © {new Date().getFullYear()}</span><span>Built for curious developers.</span></footer>
  </>
);

export default Home;
