import './App.css';
import Registration from "./components/Registration";
import Login from "./components/Login";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Department from './components/Department';
import Strength from './components/Strength';
import Subject from './components/Subject';
import Teacher_feedback from './components/Teacher_feedback';
import AreaOfImprovement from './components/AreaOfImprovement';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check session
  const checkSession = () => {
    const session = sessionStorage.getItem('userSession');
    setIsAuthenticated(session === 'true');
  };

  // Check session on component mount
  useEffect(() => {
    checkSession(); // Initial check for session
    window.addEventListener('storage', checkSession); // Listen for session changes

    // Clean up the event listener
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AppContent isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </div>
  );
}

function AppContent({ isAuthenticated }) {
  const location = useLocation();
  const isRegistrationPage = location.pathname === '/registration';
  const isLoginPage = location.pathname === '/login';

  // Redirect logic
  if (!isAuthenticated && !isLoginPage && !isRegistrationPage) {
    return <Navigate to='/login' replace />;
  }

  // If the user is authenticated, redirect from login or registration to home
  if (isAuthenticated && (isLoginPage || isRegistrationPage)) {
    return <Navigate to='/home' replace />;
  }

  return (
    <>
      {/* Conditionally Render Navbar and Sidebar */}
      {isAuthenticated && !isRegistrationPage && !isLoginPage && <Navbar />}
      <div className="container-fluid">
        <div className={`${isRegistrationPage || isLoginPage ? 'row ei-row-unrestricted' : 'row ei-row'}`}>
          {/* Conditionally Render Sidebar */}
          {isAuthenticated && !isRegistrationPage && !isLoginPage && <Sidebar />}
          {/* <main className={`main-section ${isRegistrationPage || isLoginPage ? 'col-12' : 'col-md-9 col-lg-10'}`}> */}
          <main className={`${isRegistrationPage || isLoginPage ? 'col-12 main-section-unrestricted' : 'col-md-9 col-lg-10 main-section'}`}>
            <Routes>
              <Route path='/' element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
              <Route path='/registration' element={<Registration />} />
              <Route path='/login' element={<Login />} />
              <Route path='/home' element={<Home />} />
              <Route path='/departments/*' element={<Department />} />
              <Route path='/strengths/*' element={<Strength />} />
              <Route path='/areas-of-improvement/*' element={<AreaOfImprovement />} />
              <Route path='/subjects/*' element={<Subject />} />
              <Route path='/teacher-feedback' element={<Teacher_feedback/>} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
