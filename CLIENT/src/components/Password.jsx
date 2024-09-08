// import "../App.css";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// const HOST = import.meta.env.VITE_HOST
// const PORT = import.meta.env.VITE_PORT
// export default function ChangePassword(){
//     const [old_password, setOldPassword] = useState("");
//     const [new_password, setNewPassword] = useState("");
//     const [confirm_password, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
//     const [response, setResponse] = useState("");
//     const navigate = useNavigate();
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         // const deptData = { name, dept_id, active };
//         const deptData = { name, dept_id, active: active ? "1" : "0" };
//         if ((deptData.name=="") || (deptData.dept_id=="")){
//           setError("Please enter all the required values.");
//           return;
//         }
//         const response = await fetch(`${HOST}:${PORT}/server/change-password`, {
//           method: "POST",
//           body: JSON.stringify(deptData),
//           headers: {"Content-Type": "application/json"},
//         });
//         if (response){
//           const result = await response.json();
//           if (response.ok){
//             setResponse(result.msg);
//             setError("");
//             setOldPassword("");
//             setNewPassword("");
//             setConfirmPassword("");
//             navigate("/change-password");
//           } else{
//             setError(result.msg);
//           }
//         } else{
//           setError("We are unable to process now. Please try again later.")
//         }
//         setTimeout(() => {
//           setResponse("");
//           setError("");
//         }, 3000);
//       };
//     return(
//         <div>
//             <main className="container my-2">
//                 <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
//                     <h5 className="mb-3">Change Password</h5>
//                     {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
//                     {response && (<div className="alert alert-success" role="alert">{response}</div>)}
//                     <form onSubmit={handleSubmit}>
//                         <div className=" justify-content-center">
//                             <div className="mb-3">
//                                 <label className="form-label">Old Password <span className="ei-col-red">*</span></label>
//                                 <input name="old_password" type="text" className="form-control" aria-describedby="emailHelp" value={old_password} onChange={(e) => setOldPassword(e.target.value)}/>
//                             </div>
//                             <div className="mb-3">
//                                 <label className="form-label">New Password <span className="ei-col-red">*</span></label>
//                                 <input name="new_password" type="text" className="form-control" aria-describedby="emailHelp" value={new_password} onChange={(e) => setNewPassword(e.target.value)}/>
//                             </div>
//                             <div className="mb-3">
//                                 <label className="form-label">Confirm Password <span className="ei-col-red">*</span></label>
//                                 <input name="confirm_password" type="text" className="form-control" aria-describedby="emailHelp" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)}/>
//                             </div>
//                             <button type="submit" className="btn btn-primary mx-2">Change Password</button>
//                             <button type="" className="btn btn-primary mx-2">Forgot Password</button>
//                         </div>
//                     </form>
//                 </section>
//             </main>
//         </div>
//     )
// }

import '../App.css'
import ChangePassword from './partials/password/ChangePassword';
import ForgotPassword from './partials/password/ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Navigate, NavLink} from 'react-router-dom';

export default function Password() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="change-password">Change Password</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="forgot-password">Forgot Password</NavLink>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="change-password" />} />
              <Route path='change-password' element={<ChangePassword />} />
              <Route path='forgot-password' element={<ForgotPassword />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}