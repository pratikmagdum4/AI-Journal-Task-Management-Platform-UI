import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-500">
      {/* Navbar */}
      <div className='pb-10'>

      
      <Navbar/>
      </div>
      {/* Hero Section */}
      <section className="py-20 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Personal AI Journal for Increasing Productivity</h2>
          <p className="text-lg mb-8">
            A digital tool combining traditional journaling with the power of artificial intelligence.
            Track your progress, set goals, and stay motivated with AI-driven insights.
          </p>
          <Link to="/signup" className="bg-white text-blue-500 px-6 py-3 rounded font-semibold hover:bg-gray-200 transition duration-300">Get Started</Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Daily Journaling with AI Analysis</h4>
              <p>Track your thoughts and activities daily. Get AI-powered insights on your productivity and well-being.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Multimedia Entries</h4>
              <p>Enrich your journal with photos, voice notes, and videos to capture more context.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Goal Setting</h4>
              <p>Set and track short-term and long-term goals. Stay motivated with progress updates.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Ikigai Surveys</h4>
              <p>Identify what brings meaning to your life through surveys that focus on personal satisfaction.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">AI-powered Analytics</h4>
              <p>Analyze your text and multimedia entries to gain insights and generate personalized reports.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Secure Data Storage</h4>
              <p>Your data is protected with encryption and secure cloud storage for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        <p>© 2024 AI Journal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
