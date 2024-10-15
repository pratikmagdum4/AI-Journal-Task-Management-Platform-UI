// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Summarize from './components/Summarize.jsx'
// import QA from './components/QA.jsx'
// import Sentiment from './components/Sentiment.jsx'
// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div className="App">
//         <h1>AI Flask API Client</h1>
//         <Summarize />
//         <QA />
//         <Sentiment />
//       </div>
//     </>
//   )
// }

import { useState } from 'react';
import './App.css';
import HomePage from './components/Home';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (username, password) => {
    if (username === 'student' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/login/u" element={<StudentDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;