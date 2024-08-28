// import React from 'react';
// import { Link } from 'react-router-dom';

// function Sidebar() {
//   return (
//     <nav
//       id="sidebarMenu"
//       className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse position-fixed"
//       style={{ height: '100vh', top: '0', left: '0', zIndex: '1000' }}
//     >
//       <div className="position-sticky pt-3">
//         <ul className="nav flex-column">
//           <li className="nav-item">
//             <Link className="nav-link active" to="/">
//               Home
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/create">
//               Create
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/userlist">
//               User List
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

// export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
        <Link className="active" to="/">
            Home
        </Link> 
        <Link to="/create">
            Create
        </Link> 
        <Link to="/userlist">
            User List
        </Link> 
    </div>
  );
}

export default Sidebar;
