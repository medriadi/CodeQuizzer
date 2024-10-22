import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext); // Get the authentication context to manage user login state and logout function
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage the dropdown visibility
  const dropdownRef = useRef(null); // Ref to detect clicks outside of the dropdown

  // Function to handle user logout
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect the user to the login page
  };

  // Toggle the visibility of the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Invert the current state of the dropdown
  };

  // Function to close the dropdown if a click is detected outside of it
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && // Check if the dropdown ref is assigned
      !dropdownRef.current.contains(event.target) // Check if the click target is outside the dropdown
    ) {
      setIsDropdownOpen(false); // Close the dropdown
    }
  };

  // Effect to add and clean up the event listener for clicks outside the dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Attach the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up the event listener on component unmount
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        {/* Navbar brand/logo link to home page */}
        <Link className="navbar-brand" to="/">
          CodeQuizzer
        </Link>
        {/* Navbar toggler button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Collapsible navbar content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Link to quizzes page, always visible */}
            <li className="nav-item">
              <Link className="nav-link" to="/quizzes">
                Quizzes
              </Link>
            </li>
            {/* Conditional rendering based on authentication status */}
            {auth.isAuthenticated ? (
              // Render these links if the user is authenticated
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item dropdown" ref={dropdownRef}>
                  {/* Dropdown button for profile options */}
                  <button
                    className="btn btn-link nav-link dropdown-toggle"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown} // Toggle dropdown visibility on click
                  >
                    {auth.user?.username} {/* Display the logged-in user's username */}
                  </button>
                  {/* Dropdown menu with profile and logout options */}
                  <ul
                    className={`dropdown-menu ${
                      isDropdownOpen ? 'show' : '' // Conditionally show dropdown based on state
                    }`}
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout} // Handle logout on button click
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // Render these links if the user is not authenticated
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
