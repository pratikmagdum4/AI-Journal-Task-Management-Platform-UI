import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  CheckSquare, 
  Smile, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  Contact 
} from 'lucide-react';

import { logOut } from "../../redux/authSlice";
import { logo3 } from "../../assets/exportImages";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state from Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Handle logout
  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  // Menu variants for animation
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      x: "100%",
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        type: "tween"
      }
    }
  };

  // Navigation link variants
  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover:scale-105 transition duration-300"
        >
          <img 
            src={logo3} 
            alt="Logo" 
            className="h-10 w-10 rounded-full shadow-md"
          />
          <span className="text-xl font-bold text-blue-600">AI Journal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Common Links */}
          <NavLink to="/" icon={<Home />} label="Home" />
          
          {/* Authentication-based Links */}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" icon={<LogIn />} label="Login" />
              <NavLink to="/signup" icon={<UserPlus />} label="SignUp" />
            </>
          ) : (
            <>
              <NavLink to="/login/u" icon={<LayoutDashboard />} label="Dashboard" />
              <NavLink to="/login/t" icon={<CheckSquare />} label="Tasks" />
              <NavLink to="/login/u/m" icon={<Smile />} label="Mood" />
              <NavLink to="/login/u/feed" icon={<MessageSquare />} label="Feedback" />
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600 
                transition duration-300 transform hover:scale-105"
              >
                <LogOut />
                <span>Logout</span>
              </button>
            </>
          )}
          
          <NavLink to="/c" icon={<Contact />} label="Contact" />
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-white z-40 md:hidden"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                {/* Mobile Navigation Links */}
                <MobileNavLink to="/" icon={<Home />} label="Home" />
                
                {!isAuthenticated ? (
                  <>
                    <MobileNavLink to="/login" icon={<LogIn />} label="Login" />
                    <MobileNavLink to="/signup" icon={<UserPlus />} label="SignUp" />
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/login/u" icon={<LayoutDashboard />} label="Dashboard" />
                    <MobileNavLink to="/login/t" icon={<CheckSquare />} label="Tasks" />
                    <MobileNavLink to="/login/u/m" icon={<Smile />} label="Mood" />
                    <MobileNavLink to="/login/u/feed" icon={<MessageSquare />} label="Feedback" />
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-600 
                      text-xl transition duration-300 transform hover:scale-105"
                    >
                      <LogOut size={24} />
                      <span>Logout</span>
                    </button>
                  </>
                )}
                
                <MobileNavLink to="/c" icon={<Contact />} label="Contact" />

                {/* Close Button */}
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-6 right-6 text-blue-600 hover:text-blue-800"
                >
                  <X size={32} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

// Desktop Navigation Link Component
function NavLink({ to, icon, label }) {
  return (
    <Link 
      to={to} 
      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 
      transition duration-300 transform hover:scale-105"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, icon, label }) {
  return (
    <Link 
      to={to} 
      className="flex items-center text-xl text-blue-600 hover:text-blue-800 
      transition duration-300 transform hover:scale-110"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default Navbar;