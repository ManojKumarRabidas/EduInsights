import '../App.css'
import List from './partials/strength/List';
import Create from './partials/strength/Create';
import Update from './partials/strength/Update';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Route, Routes, Link, Navigate } from 'react-router-dom';

export default function Strength(){

    return(
        <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
          {/* <div className="container-fluid"> */}
            <Link className="navbar-brand" to="strength-list">List</Link>
            <Link className="navbar-brand" to="strength-create">Create</Link>
            {/* <Link className="navbar-brand" to="dept-update">Update</Link> */}
          {/* </div> */}
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