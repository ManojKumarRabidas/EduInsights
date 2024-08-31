import '../App.css'
import List from './partials/subject/List';
import Create from './partials/subject/Create';
import Update from './partials/subject/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Link, Navigate} from 'react-router-dom';

export default function Subject() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        {/* <div className="container-fluid"> */}
          <Link className="navbar-brand" to="subject-list">List</Link>
          <Link className="navbar-brand" to="subject-create">Create</Link>
          {/* <Link className="navbar-brand" to="dept-update">Update</Link> */}
        {/* </div> */}
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="subject-list" />} />
              <Route path='subject-list' element={<List />} />
              <Route path='subject-create' element={<Create />} />
              <Route path='subject-update/:id' element={<Update />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

