import React from 'react';
import '../../../src/App.css';
import Navbar from '../Navbar/Navbar';

function AboutUs() {
    return (
        <>
      <Navbar/>
        <div className="about-us min-h-screen bg-gradient-to-br from-purple-400 to-blue-500 text-white p-10">
            {/* <header className="text-center mb-10">
                <h1 className="text-5xl font-bold">About Us</h1>
                <p className="text-xl mt-4">Empowering Productivity Through AI</p>
            </header> */}

            <section className="our-mission mb-10">
                <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
                <p className="text-lg">
                    Our mission is to provide a digital platform that enhances productivity
                    through personalized AI-driven insights, helping individuals achieve their
                    goals and maintain a balanced life.
                </p>
            </section>

            <section className="our-team mb-10">
                <h2 className="text-3xl font-semibold mb-4">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Team Member 1 */}
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold">Vaishnavi</h3>
                        <p>Frontend Developer</p>
                        <p>Building responsive and user-friendly interfaces.</p>
                    </div>
                    {/* Team Member 2 */}
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold">Pratik</h3>
                        <p>AI Developer</p>
                        <p>Leveraging AI for enhanced productivity solutions.</p>
                    </div>
                    {/* Team Member 3 */}
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold">Sejal</h3>
                        <p>UI/UX Designer</p>
                        <p>Creating intuitive designs for a seamless user experience.</p>
                    </div>
                    {/* Team Member 4 */}
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold">Rutuja</h3>
                        <p>Analyst</p>
                        <p>Analyzing data to drive product decisions.</p>
                    </div>
                    {/* Team Member 5 */}
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold">Preeti</h3>
                        <p>Developer</p>
                        <p>Developing solutions to enhance user engagement.</p>
                    </div>
                </div>
            </section>

            <section className="our-journey mb-10">
                <h2 className="text-3xl font-semibold mb-4">Our Journey</h2>
                <p className="text-lg">
                    Founded in 2024, we started as a small group of tech enthusiasts aiming
                    to blend technology and personal development. Our goal has always been to
                    harness the power of AI to create tools that genuinely help people.
                </p>
            </section>

            {/* <footer className="text-center">
                <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
                <p className="text-lg">For inquiries, reach us at: <a href="mailto:info@aijournal.com" className="underline">info@aijournal.com</a></p>
            </footer> */}
        </div>
        </>
    );
}

export default AboutUs;
