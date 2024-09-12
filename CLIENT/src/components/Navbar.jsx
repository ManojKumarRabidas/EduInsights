import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user name from session storage
    const name = sessionStorage.getItem('eiUserName');
    const userType = sessionStorage.getItem('eiUserType');
    if (name) {
      setUserName(name);
    }
    if (userType) {
      setUserType(userType);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('eiUserSession');
    sessionStorage.removeItem('eiUserName');
    sessionStorage.removeItem('eiUserId');

    // Trigger a storage event to update authentication state in other components
    window.dispatchEvent(new Event('storage'));

    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        {/* Navbar Brand */}
        <div className="navbar-brand">
          <Link className="nav-link active" to="/"> <img style={{maxWidth: "2rem", margin: "0rem 0.4rem 0rem 1rem"}} src="../src/assets/images/eduInsights-logo.png" alt="" /> EduInsights</Link>
        </div>

        {/* Toggle button for mobile view */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              {/* Dropdown Toggle */}
              {/* <i class="bi bi-person-circle"></i> */}
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">{userName || 'User'}</a>
              {/* Dropdown Menu */}
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Settings</a></li>
                {/* <li><Link className="dropdown-item" to="/user-manual">User Manual</Link></li> */}
                {/* {(userType != "ADMIN") && <li><Link className="dropdown-item" to="/profile">Profile</Link></li>} */}
                {/* <li><Link className="dropdown-item" to="/password">Change Password</Link></li> */}
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" onClick={handleLogout}>Sign Out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
