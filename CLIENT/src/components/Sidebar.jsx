import { React, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Sidebar() {
  const [userType, setUserType] = useState('');
  const getUserType = async (token) => {
    const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        setUserType(result.doc.user_type)
      } else{
        setError(result.msg);
      }
    } else{
      setError("We are unable to process now. Please try again later.")
    }
  }
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    getUserType(token)
  }, []);
  return (
    <div className="sidebar">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
        {((userType == "ADMIN") || (userType == "SUPPORT")) && <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Search By Strength</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORT")) && <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>Users</NavLink>}
        {(userType == "ADMIN") &&<NavLink to="/support-users" className={({ isActive }) => (isActive ? 'active' : '')}>Support Users</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORT")) &&<NavLink to="/pending-verifications" className={({ isActive }) => (isActive ? 'active' : '')}>Pending Verifications</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORT")) &&<NavLink to="/departments" className={({ isActive }) => (isActive ? 'active' : '')}>Departments</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORT")) &&<NavLink to="/subjects" className={({ isActive }) => (isActive ? 'active' : '')}>Subjects</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORT")) && <NavLink to="/session" className={({ isActive }) => (isActive ? 'active' : '')}>Sessions</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORT")) &&<NavLink to="/strengths" className={({ isActive }) => (isActive ? 'active' : '')}>Strengths</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORT")) &&<NavLink to="/areas-of-improvement" className={({ isActive }) => (isActive ? 'active' : '')}>Areas of Improvement</NavLink>}
        {(userType == "TEACHER") && <NavLink to="/teacher-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Feedback Form</NavLink>}
        {(userType == "STUDENT") && <NavLink to="/student-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Feedback Form</NavLink>}
        {(userType != "TEACHER") && <NavLink to="/all-teachers-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>All Teachers Feedback</NavLink>}
        {(userType != "STUDENT") && <NavLink to="/all-students-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>All Students Feedback</NavLink>}
    </div>
  );
}

export default Sidebar;
