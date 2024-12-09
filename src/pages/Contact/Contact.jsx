import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Mail, Phone, User, Send, CheckCircle2 } from 'lucide-react';
import Navbar from '../Navbar/Navbar';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // EmailJS service details
        const serviceID = import.meta.env.VITE_EMAIL_SERVICE_ID;
        const templateID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
        const userID = import.meta.env.VITE_EMAIL_USER_ID;

        emailjs.send(serviceID, templateID, formData, userID)
            .then((response) => {
                setSubmitted(true);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('FAILED...', err);
                setError('Failed to send message. Please try again.');
                setIsLoading(false);
            });
    };

    return (
        <>
         <Navbar/>
        <div className="min-h-screen bg-gradient-to-br mt-12 from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden">
                {/* Contact Information Section */}
                <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-blue-100 mb-8">
                            We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Mail className="h-6 w-6 text-blue-200" />
                            <span>support@company.com</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Phone className="h-6 w-6 text-blue-200" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="w-1/2 bg-white p-12 flex flex-col justify-center">
                    {submitted ? (
                        <div className="text-center">
                            <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
                            <p className="text-gray-600">
                                Your message has been received. We'll get back to you soon.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Your Email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your Message"
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ContactPage;