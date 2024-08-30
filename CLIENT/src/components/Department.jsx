import '../App.css'
import List from './partials/department/List';
import Create from './partials/department/Create';
import Update from './partials/department/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Link, Navigate} from 'react-router-dom';

export default function Department() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        {/* <div className="container-fluid"> */}
          <Link className="navbar-brand" to="dept-list">List</Link>
          <Link className="navbar-brand" to="dept-create">Create</Link>
          {/* <Link className="navbar-brand" to="dept-update">Update</Link> */}
        {/* </div> */}
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="dept-list" />} />
              <Route path='dept-list' element={<List />} />
              <Route path='dept-create' element={<Create />} />
              <Route path='dept-update/:id' element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

