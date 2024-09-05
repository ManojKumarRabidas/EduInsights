import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
        <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? 'active' : '')} end>Admin Dashboard</NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')} end>Users</NavLink>
        <NavLink to="/pending-verifications" className={({ isActive }) => (isActive ? 'active' : '')} end>Pending Verifications</NavLink>
        <NavLink to="/departments" className={({ isActive }) => (isActive ? 'active' : '')}>Departments</NavLink>
        <NavLink to="/subjects" className={({ isActive }) => (isActive ? 'active' : '')}>Subjects</NavLink>
        <NavLink to="/strengths" className={({ isActive }) => (isActive ? 'active' : '')}>Strengths</NavLink>
        <NavLink to="/areas-of-improvement" className={({ isActive }) => (isActive ? 'active' : '')}>Areas of Improvement</NavLink>
        <NavLink to="/teacher-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Teacher_feedback</NavLink>
        <NavLink to="/student-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Student_Feedback</NavLink>
    </div>
  );
}

export default Sidebar;
