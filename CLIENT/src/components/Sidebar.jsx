import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
        <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Admin Dashboard</NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>Users</NavLink>
        <NavLink to="/support-users" className={({ isActive }) => (isActive ? 'active' : '')}>Support Users</NavLink>
        <NavLink to="/pending-verifications" className={({ isActive }) => (isActive ? 'active' : '')}>Pending Verifications</NavLink>
        <NavLink to="/departments" className={({ isActive }) => (isActive ? 'active' : '')}>Departments</NavLink>
        <NavLink to="/subjects" className={({ isActive }) => (isActive ? 'active' : '')}>Subjects</NavLink>
        <NavLink to="/strengths" className={({ isActive }) => (isActive ? 'active' : '')}>Strengths</NavLink>
        <NavLink to="/areas-of-improvement" className={({ isActive }) => (isActive ? 'active' : '')}>Areas of Improvement</NavLink>
        <NavLink to="/teacher-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Teacher Feedback</NavLink>
        <NavLink to="/student-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>Student Feedback</NavLink>
        <NavLink to="/all-teachers-feedback" className={({ isActive }) => (isActive ? 'active' : '')}>All Teachers Feedback</NavLink>
    </div>
  );
}

export default Sidebar;
