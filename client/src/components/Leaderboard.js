import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { requestMessage } from "../axiosInstance";
import LoadingState from "./LoadingState";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ loading: true, error: "" });
    axiosInstance
      .get("/api/leaderboard")
      .then(({ data }) => {
        if (active) setRows(data);
      })
      .catch((error) => {
        if (active)
          setState({
            loading: false,
            error: requestMessage(error, "Unable to load the leaderboard."),
          });
      })
      .finally(() => {
        if (active) setState((previous) => ({ ...previous, loading: false }));
      });
    return () => {
      active = false;
    };
  }, [retry]);
  if (state.loading)
    return <LoadingState>Loading the leaderboard…</LoadingState>;
  if (state.error)
    return (
      <div className="center-state">
        <div className="alert alert-error" role="alert">
          {state.error}
        </div>
        <button
          className="button button-primary"
          onClick={() => setRetry((value) => value + 1)}
        >
          Try again
        </button>
      </div>
    );
  return (
    <section className="page-section page-narrow">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE COMMUNITY</p>
          <h1>Leaderboard</h1>
        </div>
        <p>
          Consistency compounds. Ranked by answer accuracy, then completed
          quizzes.
        </p>
      </div>
      {rows.some((row) => row.isDemo) && (
        <p className="demo-notice">
          Demo learners are sample profiles with simulated quiz history.
        </p>
      )}
      <div className="leaderboard">
        {rows.length === 0 ? (
          <div className="empty-state">
            <p>Complete a quiz to claim your spot.</p>
            <Link className="button button-primary" to="/quizzes">
              Find a challenge ↗
            </Link>
          </div>
        ) : (
          rows.map((row, index) => (
            <div
              className={`leader-row ${index === 0 ? "leader-first" : ""}`}
              key={row.username}
            >
              <span className="leader-rank">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="leader-name">
                {row.username}
                {row.isDemo ? (
                  <em>Demo learner · sample scores</em>
                ) : (
                  index === 0 && <em>Top performer</em>
                )}
              </span>
              <strong aria-label={`${row.averagePercentage} percent accuracy`}>
                {row.averagePercentage}%
              </strong>
              <span>{row.quizzesTaken} quizzes</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
