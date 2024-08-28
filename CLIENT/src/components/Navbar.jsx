// import React from "react";
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container-fluid">
//         <h3 className="navbar-brand">
//           <Link to="/" className="nav-link" aria-current="page"> MERN </Link>
//         </h3>
//         <button 
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <Link to="/create" className="nav-link" aria-current="page">Create Post</Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/userlist" className="nav-link active" aria-current="page">All Post</Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   )
// }

// components/Navbar.js

// import React from 'react';
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container-fluid">
//         <div className="navbar-brand" href="#">
//           <Link className="nav-link active" to="/">
//             Home
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// components/Navbar.js

// components/Navbar.js

import React from 'react';
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        {/* Navbar Brand */}
        <div className="navbar-brand" href="#">
          <Link className="nav-link active" to="/">
            Home
          </Link>
        </div>

        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              {/* Dropdown Toggle */}
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                User Name
              </a>
              {/* Dropdown Menu */}
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sign Out
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
