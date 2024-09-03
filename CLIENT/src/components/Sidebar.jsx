import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
        <NavLink to="/departments" className={({ isActive }) => (isActive ? 'active' : '')}>Departments</NavLink>
        <NavLink to="/subjects" className={({ isActive }) => (isActive ? 'active' : '')}>Subjects</NavLink>
        <NavLink to="/strengths" className={({ isActive }) => (isActive ? 'active' : '')}>Strength</NavLink>
        <NavLink to="/areas-of-improvement" className={({ isActive }) => (isActive ? 'active' : '')}>Areas of Improvement</NavLink>
    </div>
  );
}

export default Sidebar;
