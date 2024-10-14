import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center p-5">
      <div className="jumbotron bg-light shadow-sm p-4 rounded">
        <h1 className="display-4">Welcome to CodeQuizzer</h1>
        <p className="lead">Your ultimate platform to test and improve your programming knowledge!</p>
        <hr className="my-4" />
        <Link className="btn btn-primary btn-lg" to="/quizzes" role="button">Get Started</Link>
      </div>
    </div>
  );
};

export default Home;
