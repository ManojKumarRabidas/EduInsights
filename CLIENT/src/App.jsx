import './App.css';
import Registration from "./components/Registration";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import Error404 from "./components/Error404";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import SupportUsers from './components/SupportUser';
import PendingVerifications from './components/PendingVerifications';
import Department from './components/Department';
import Strength from './components/Strength';
import Subject from './components/Subject';
import TeacherFeedback from './components/TeacherFeedback';
import StudentFeedback from './components/StudentFeedback';
import AllTeachersFeedback from './components/AllTeachersFeedback';
import AllStudentsFeedback from './components/AllStudentsFeedback';
import AreaOfImprovement from './components/AreaOfImprovement';
import Profile from './components/Profile';
import UserManual from './components/UserManual';
import Password from './components/Password';
// import 'bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

let user_type_globle;
export default function App() {
  const [userType, setUserType] = useState("");
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
    const getUserType = async (token) => {
      const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response){
        const result = await response.json();
        if (response.ok){
          setUserType(result.doc.user_type);
          user_type_globle = result.doc.user_type;
        } else{
          setUserType("ERROR");
          user_type_globle = "ERROR";
          toastr.error(result.msg);
        }
      } else{
        toastr.error("We are unable to process now. Please try again later.")
      }
    }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkSession = () => {
    const session = sessionStorage.getItem('token');
    if (session){getUserType(session)}
    setIsAuthenticated(session);
  };

  useEffect(() => {
    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AppContent isAuthenticated={(isAuthenticated, userType)} />
      </BrowserRouter>
    </div>
  );
}

function AppContent({ isAuthenticated, userType }) {
  const user_type = user_type_globle;
  const location = useLocation();
  const isRegistrationPage = location.pathname === '/registration';
  const isLoginPage = location.pathname === '/login';
  const error404Page = location.pathname === '/error-404';
  if (!isAuthenticated && !isLoginPage && !isRegistrationPage) {
    return <Navigate to='/login' replace />;
  }

  if (isAuthenticated && (isLoginPage || isRegistrationPage)) {
    if (user_type != "ERROR") {
      return <Navigate to='/home' replace />;
    } else{
      return <Navigate to='/error-404' replace />
    }
  }
  return (
    <>
      {isAuthenticated && !isRegistrationPage && !isLoginPage && !error404Page && <Navbar />}
      <div className="container-fluid">
        <div className={`${isRegistrationPage || isLoginPage || error404Page ? 'row ei-row-unrestricted' : 'row ei-row'}`}>
          {isAuthenticated && !isRegistrationPage && !isLoginPage && !error404Page && <Sidebar />}
          <main className={`${isRegistrationPage || error404Page ? 'col-12 main-section-registration': (isLoginPage ? 'col-12 main-section-log-in': 'col-12 main-section')}`}>
            <Routes>
              <Route path='/' element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
              <Route path='/registration' element={<Registration />} />
              <Route path='/login' element={<Login />} />
              <Route path='/error-404' element={<Error404 />} />
              <Route path='/home' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              {/* <Route path='/admin-dashboard' element={((user_type ==='ADMIN') || (user_type ==='SUPPORT')) ? <AdminDashboard /> : <Unauthorized />} /> */}
              <Route path='/users' element={((user_type ==='ADMIN') || (user_type ==='SUPPORT')) ? <Users /> : <Unauthorized />} />
              <Route path='/support-users/*' element={user_type === 'ADMIN' ? <SupportUsers /> : <Unauthorized />} />
              <Route path='/pending-verifications' element={((user_type ==='ADMIN') || (user_type ==='SUPPORT')) ? <PendingVerifications /> : <Unauthorized />} />
              <Route path='/departments/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORT')) ? <Department /> : <Unauthorized />} />
              <Route path='/strengths/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORT')) ? <Strength /> : <Unauthorized />} />
              <Route path='/areas-of-improvement/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORT')) ? <AreaOfImprovement /> : <Unauthorized />} />
              <Route path='/subjects/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORT')) ? <Subject /> : <Unauthorized />} />
              <Route path='/teacher-feedback' element={user_type === 'TEACHER' ? <TeacherFeedback /> : <Unauthorized />} />
              <Route path='/student-feedback' element={user_type === 'STUDENT' ? <StudentFeedback /> : <Unauthorized />} />
              <Route path='/all-teachers-feedback' element={user_type != 'TEACHER' ? <AllTeachersFeedback /> : <Unauthorized />} />
              <Route path='/all-students-feedback' element={user_type != 'STUDENT' ? <AllStudentsFeedback /> : <Unauthorized />} />
              <Route path='/profile' element={user_type != 'ADMIN' ? <Profile /> : <Unauthorized />} />
              <Route path='/user-manual' element={<UserManual/>} />
              <Route path='/password/*' element={<Password/>} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
