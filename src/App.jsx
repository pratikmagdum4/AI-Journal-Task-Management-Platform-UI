import './App.css';
import HomePage from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import StudentDashboard from './pages/User/StudentDashboard';
import AboutUs from './pages/AboutUs'; // Import AboutUs component
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/services/PrivateRoute';
import ErrorPage from './components/ui/Error';
import TaskInputForm from './pages/TaskManagement/AddTask';
import ContactPage from './pages/Contact/Contact';
import Loader2 from './components/ui/Loading2';
import AboutUs from './pages/About/About';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} /> {/* Home page route */}
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route path="/signup" element={<Signup />} /> {/* Signup route */}
<<<<<<< HEAD
          <Route path="/about" element={<AboutUs />} /> {/* About Us route */}
          <Route path="/login/t" element={<TaskInputForm />} /> {/* Task input route */}
          <Route path="/c" element={<ContactPage />} /> {/* Contact page route */}
          <Route path="/l" element={<Loader2 />} /> {/* Loader route */}
=======
          <Route path="/login/t" element={<TaskInputForm />} /> Signup route
          <Route path="/c" element={<ContactPage />} /> {/* Signup route */}
          <Route path="/l" element={<Loader2 />} /> {/* Signup route */}
          <Route path="/a" element={<AboutUs />} /> {/* Signup route */}
>>>>>>> master

          {/* Private route for the Student Dashboard (protected and role-based) */}
          <Route
            path="/login/u"
            element={
              <PrivateRoute
                element={<StudentDashboard />}
                allowedRoles={["user"]} // Only "student" role can access
              />
            }
          />

          {/* Add more private routes with role-based protection as needed */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
