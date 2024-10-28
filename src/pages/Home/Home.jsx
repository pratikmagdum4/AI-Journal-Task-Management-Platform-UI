import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading, selectLoading } from '../../redux/slices/loadingSlice';
import Navbar from '../Navbar/Navbar';
import Loader from '../../components/ui/Loader'; // Import your Loader component

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);

  // Simulate loading entries on component mount
  useEffect(() => {
    const fetchData = async () => {
      dispatch(startLoading());
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
      dispatch(stopLoading());
    };

    fetchData();
  }, [dispatch]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to signup page
  };

  // Simulate submission with a loader
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(startLoading());
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
    dispatch(stopLoading());
    // After submission, you might want to navigate or do something else
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-500">
      {/* Navbar */}
      <div className='pb-10'>
        <Navbar />
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

      {/* Loader Section */}
      {isLoading && <Loader />}

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Daily Journaling with AI Analysis</h4>
              <p>Track your thoughts and activities daily. Get AI-powered insights on your productivity and well-being.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Goal Tracking & Recommendations</h4>
              <p>Set and track your goals with AI assistance. Receive personalized recommendations to stay on track.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg transition duration-300 hover:shadow-xl">
              <h4 className="text-xl font-bold mb-4">Productivity Insights & Trends</h4>
              <p>Analyze your productivity patterns over time. Get insights on trends to optimize your daily routines.</p>
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
