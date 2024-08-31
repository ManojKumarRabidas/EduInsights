import './App.css'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Department from './components/Department';
import Strength from './components/Strength';
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
            <main className="col-md-9 col-lg-10 main-section">
              <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/departments/*' element={<Department />} />
                <Route exact path='/strengths/*' element={<Strength />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

