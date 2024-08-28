import './App.css'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Create from './components/Create';
import Update from './components/Update';
import Read from './components/Read';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {

  return (
    <div className="App">
      <BrowserRouter>
        {/* Navbar Component */}
        <Navbar />
        {/* Main Container with Sidebar and Content */}
        <div className="container-fluid">
          <div className="row ei-row">
            {/* Sidebar Component */}
            <Sidebar />
            {/* Main Content Area */}
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/create' element={<Create />} />
                <Route exact path='/userlist' element={<Read />} />
                <Route exact path='/update/:id' element={<Update />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

