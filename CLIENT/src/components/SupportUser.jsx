import '../App.css'
import List from './partials/supportuser/List';
import Create from './partials/supportuser/Create';
import Update from './partials/supportuser/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Navigate, NavLink} from 'react-router-dom';

export default function SupportUser() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="support-user-list">List</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="support-user-create">Create</NavLink>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="support-user-list" />} />
              <Route path='support-user-list' element={<List />} />
              <Route path='support-user-create' element={<Create />} />
              <Route path='support-user-update/:id' element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}