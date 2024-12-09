import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Target, Camera, Lock, ChartLine, Lightbulb } from 'lucide-react';
import Navbar from '../Navbar/Navbar';

function HomePage() {
  // Animation variants for sections and features
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 120
      }
    }
  };

  const features = [
    {
      icon: <Star className="w-12 h-12 text-purple-500 mb-4" />,
      title: "Daily Journaling with AI Analysis",
      description: "Track your thoughts and activities daily. Get AI-powered insights on your productivity and well-being.",
    },
    {
      icon: <Camera className="w-12 h-12 text-blue-500 mb-4" />,
      title: "Multimedia Entries",
      description: "Enrich your journal with photos, voice notes, and videos to capture more context.",
    },
    {
      icon: <Target className="w-12 h-12 text-green-500 mb-4" />,
      title: "Goal Setting",
      description: "Set and track short-term and long-term goals. Stay motivated with progress updates.",
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-yellow-500 mb-4" />,
      title: "Ikigai Surveys",
      description: "Identify what brings meaning to your life through surveys that focus on personal satisfaction.",
    },
    {
      icon: <ChartLine className="w-12 h-12 text-indigo-500 mb-4" />,
      title: "AI-powered Analytics",
      description: "Analyze your text and multimedia entries to gain insights and generate personalized reports.",
    },
    {
      icon: <Lock className="w-12 h-12 text-red-500 mb-4" />,
      title: "Secure Data Storage",
      description: "Your data is protected with encryption and secure cloud storage for peace of mind.",
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-500 overflow-hidden"
    >
      {/* Navbar */}
      <div className='pb-10'>
        <Navbar/>
      </div>

      {/* Hero Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="py-20 text-white text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-10 animate-pulse"></div>
        <div className="container mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200"
          >
            Personal AI Journal for Increasing Productivity
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl mb-10 max-w-2xl mx-auto text-gray-100"
          >
            A digital tool combining traditional journaling with the power of artificial intelligence. 
            Track your progress, set goals, and stay motivated with AI-driven insights.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold 
              hover:bg-blue-50 transition duration-300 transform hover:scale-105 
              shadow-2xl hover:shadow-blue-500/50"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        id="features" 
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl 
                transform transition duration-300 hover:-translate-y-4 
                border-b-4 border-purple-500"
              >
                {feature.icon}
                <h4 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          © 2024 AI Journal. All rights reserved.
        </motion.p>
      </footer>
    </motion.div>
  );
}

export default HomePage;