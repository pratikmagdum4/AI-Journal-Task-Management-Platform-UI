import React, { useState } from 'react';
import Summarize from './Summarize';
import QA from './QA';
import Sentiment from './Sentiment';
import JournalEntries from './JournalEntries'; // Calendar and past entries
import AddEntryForm from './AddEntryForm'; // Form to add new entries
import GoalAnalyzer from './GoalAnalyzer'; // Recognizes goals/interests

function StudentDashboard() {
    const [dailyNote, setDailyNote] = useState('');

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-8">Student Dashboard</h1>

            {/* Daily Note Input */}
            <textarea
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                placeholder="Enter your daily note"
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-indigo-500"
            />

            {/* AI Features (Summarize, QA, Sentiment) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Summarize dailyNote={dailyNote} />
                <QA dailyNote={dailyNote} />
                <Sentiment dailyNote={dailyNote} />
            </div>

            {/* Calendar and Past Entries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-4 bg-white rounded-lg shadow">
                    <JournalEntries />
                </div>

                {/* Add New Entry Form */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <AddEntryForm />
                </div>
            </div>

            {/* Goal Analyzer */}
            <div className="p-4 bg-white rounded-lg shadow mt-8">
                <GoalAnalyzer />
            </div>
        </div>
    );
}

export default StudentDashboard;
