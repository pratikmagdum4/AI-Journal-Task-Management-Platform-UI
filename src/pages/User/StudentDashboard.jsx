// StudentDashboard.js
import React from 'react';
import JournalEntriesByDate from '../../components/ui/JournalEntries';
import AddEntryForm from '../../components/ui/AddEntryForm';
import AskQuestionForm from '../../components/ui/AskQuestionForm';
import Navbar from '../Navbar/Navbar';
import GoalEntryForm from '../../components/ui/GoalEntryForm'; // Import the new Goal Entry component
import GoalAnalyzer from '../../components/ui/GoalAnalyser';
const StudentDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <AddEntryForm />
                    </div>
                    <div>
                        <JournalEntriesByDate />
                    </div>
                </div>

                {/* Goals Section */}
                <div className="mt-12">
                    <GoalEntryForm /> {/* Add GoalEntryForm Component */}
                </div>

                <div className="mt-12">
                    <GoalAnalyzer />
                </div>

                {/* New Ask Question Section */}
                <div className="mt-12">
                    <AskQuestionForm />
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;
