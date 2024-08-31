import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
        <NavLink to="/departments" className={({ isActive }) => (isActive ? 'active' : '')}>Departments</NavLink>
        <NavLink to="/strengths" className={({ isActive }) => (isActive ? 'active' : '')}>Strength</NavLink>
    </div>
  );
}

export default Sidebar;
