import '../App.css'
import List from './partials/Improvement/List';
import Create from './partials/Improvement/Create';
import Update from './partials/Improvement/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Link, Navigate, NavLink} from 'react-router-dom';

export default function Improvement() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        {/* <div className="container-fluid"> */}
          <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="improve-list">List</NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="improve-create">Create</NavLink>
          {/* <Link className="navbar-brand" to="dept-update">Update</Link> */}
        {/* </div> */}
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="improve-list" />} />
              <Route path='improve-list' element={<List />} />
              <Route path='improve-create' element={<Create />} />
              <Route path='improve-update/:id' element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}