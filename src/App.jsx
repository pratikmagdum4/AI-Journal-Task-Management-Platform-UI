import './App.css';
import HomePage from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import StudentDashboard from './pages/User/StudentDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/services/PrivateRoute';
import ErrorPage from './components/ui/Error';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} /> {/* Home page route */}
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route path="/signup" element={<Signup />} /> {/* Signup route */}

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
