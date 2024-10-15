import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center p-5 bg-light">
        <div className="container">
          <h1 className="display-4">Welcome to CodeQuizzer</h1>
          <p className="lead">
            Your ultimate platform to test and improve your programming knowledge!
          </p>
          <Link className="btn btn-primary btn-lg mt-3" to="/quizzes" role="button">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Features</h2>
          <div className="row">
            {/* Feature 1 */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Diverse Quizzes</h5>
                  <p className="card-text">
                    Access a wide range of quizzes covering various programming languages and topics.
                  </p>
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Instant Feedback</h5>
                  <p className="card-text">
                    Receive immediate feedback on your answers to understand your strengths and areas for improvement.
                  </p>
                </div>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Track Progress</h5>
                  <p className="card-text">
                    Monitor your quiz history and performance over time to gauge your learning journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <h4>1. Choose a Quiz</h4>
              <p>Select from a variety of quizzes tailored to different programming languages and skill levels.</p>
            </div>
            <div className="col-md-6 mb-4">
              <h4>2. Take the Quiz</h4>
              <p>Answer multiple-choice questions designed to test your knowledge and understanding.</p>
            </div>
            <div className="col-md-6 mb-4">
              <h4>3. Review Results</h4>
              <p>Receive detailed feedback on your performance, including correct answers and explanations.</p>
            </div>
            <div className="col-md-6 mb-4">
              <h4>4. Improve and Repeat</h4>
              <p>Identify areas for improvement and take more quizzes to enhance your programming skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-1">&copy; {new Date().getFullYear()} CodeQuizzer. All rights reserved.</p>
          <p className="mb-0">
            This project was developed as part of the ALX portfolio project for Cohort-1-Blended by Mohamed RIADI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
