import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const handleLogin
        = () => {
            // You can handle any logic here before navigation, like setting a state flag
            navigate('/login');
        };
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-6">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">AI Journal</h1>
                    <div>
                        <a href="#features" className="px-4 py-2 text-gray-700 hover:text-gray-900">Features</a>
                        <a href="#about" className="px-4 py-2 text-gray-700 hover:text-gray-900">About</a>
                        <a href="#contact" className="px-4 py-2 text-gray-700 hover:text-gray-900">Contact</a>
                        <button onClick={handleLogin}  className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">Login</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 bg-blue-500 text-white text-center">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-4">Personal AI Journal for Increasing Productivity</h2>
                    <p className="text-lg mb-8">
                        A digital tool combining traditional journaling with the power of artificial intelligence.
                        Track your progress, set goals, and stay motivated with AI-driven insights.
                    </p>
                    <a href="#get-started" className="bg-white text-blue-500 px-6 py-3 rounded font-semibold hover:bg-gray-200">Get Started</a>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-100">
                <div className="container mx-auto text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold mb-4">Daily Journaling with AI Analysis</h4>
                            <p>Track your thoughts and activities daily. Get AI-powered insights on your productivity and well-being.</p>
                        </div>
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold mb-4">Multimedia Entries</h4>
                            <p>Enrich your journal with photos, voice notes, and videos to capture more context.</p>
                        </div>
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold mb-4">Goal Setting</h4>
                            <p>Set and track short-term and long-term goals. Stay motivated with progress updates.</p>
                        </div>
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold mb-4">Ikigai Surveys</h4>
                            <p>Identify what brings meaning to your life through surveys that focus on personal satisfaction.</p>
                        </div>
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <h4 className="text-xl font-bold mb-4">AI-powered Analytics</h4>
                            <p>Analyze your text and multimedia entries to gain insights and generate personalized reports.</p>
                        </div>
                        <div className="bg-white p-6 shadow-lg rounded-lg">
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
