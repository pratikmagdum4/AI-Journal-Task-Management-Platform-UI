import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Navbar from '../Navbar/Navbar';
// import f
// import { HomeLink } from "../../components/variables/variables";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        // EmailJS service details
        const serviceID = import.meta.env.VITE_EMAIL_SERVICE_ID;
        const templateID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
        const userID = import.meta.env.VITE_EMAIL_USER_ID;
        console.log("THe formdata is ", formData)
        // Send email via EmailJS
        emailjs.send(serviceID, templateID, formData, userID)
            .then((response) => {
                console.log("response ", response)
                console.log('SUCCESS!', response.status, response.text);
                setSubmitted(true); // Show success message
            })
            .catch((err) => {
                console.error('FAILED...', err);
                setError('Failed to send message. Please try again.');
            });
    };

    return (
        <>
            <Navbar  />
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10 mt-10">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                    <h1 className="text-4xl font-bold text-indigo-600 mb-6 text-center">Contact Us</h1>

                    {submitted ? (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-4">Thank you for reaching out!</h2>
                            <p className="text-gray-600">We will get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Your Contact Number"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Your Email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Your Message"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default ContactPage;
