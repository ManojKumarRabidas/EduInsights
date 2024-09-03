import '../App.css'
import List from './partials/strength/List';
import Create from './partials/strength/Create';
import Update from './partials/strength/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';

export default function Strength(){

    return(
        <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
          <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="strength-list">List</NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="strength-create">Create</NavLink>
        </nav>
  
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Routes>
                <Route path="/" element={<Navigate to="strength-list" />} />
                <Route path='strength-list' element={<List />} />
                <Route path='strength-create' element={<Create />} />
                <Route path='strength-update/:id' element={<Update />} />
              </Routes>
            </div>
          </div>
        </div>
      </div> 
    )
}