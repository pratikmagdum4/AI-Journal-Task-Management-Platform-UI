import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAuthenticated } from './redux/authSlice';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import StudentDashboard from './pages/User/StudentDashboard';
import TaskInputForm from './pages/TaskManagement/AddTask';
import ContactPage from './pages/Contact/Contact';
import Loader2 from './components/ui/Loading2';
import AboutUs from './pages/About/About';
import GoalMilestoneTracker from './components/ui/GoalMilestoneTracker';
import ReminderNotification from './components/ui/ReminderNotification';
import FeedbackPage from './pages/Feedback/FeedbackPage';
import PrivateRoute from './components/services/PrivateRoute';
import ErrorPage from './components/ui/Error';

function App() {
  const isAuth = useSelector(isAuthenticated);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
     
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login/t" element={<TaskInputForm />} />
          <Route path="/c" element={<ContactPage />} />
          <Route path="/l" element={<Loader2 />} />
          <Route path="/a" element={<AboutUs />} />
          <Route path="/feed" element={<FeedbackPage />} />
          <Route
            path="/login/u"
            element={
              <PrivateRoute
                element={<StudentDashboard />}
                allowedRoles={["user"]}
              />
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        
        {isAuth && (
          <>
            <ReminderNotification currentPath={location.pathname} />
            <ToastContainer />
          </>
        )}
     
    </div>
  );
}

export default App;
