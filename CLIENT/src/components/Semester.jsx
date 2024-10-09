import '../App.css'
import List from './partials/semester/List';
import Create from './partials/semester/Create';
import Update from './partials/semester/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';

export default function Semester(){

    return(
        <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
          <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="semester-list">List</NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="semester-create">Create</NavLink>
        </nav>
  
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Routes>
                <Route path="/" element={<Navigate to="semester-list" />} />
                <Route path='semester-list' element={<List />} />
                <Route path='semester-create' element={<Create />} />
                <Route path='semester-update/:id' element={<Update />} />
              </Routes>
            </div>
          </div>
        </div>
      </div> 
    )
}