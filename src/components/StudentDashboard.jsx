import React, { useState } from 'react';
import Summarize from './Summarize';
import QA from './QA';
import Sentiment from './Sentiment';

function Dashboard() {
    const [dailyNote, setDailyNote] = useState('');

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Student Dashboard</h1>
            <textarea
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                placeholder="Enter your daily note"
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Summarize dailyNote={dailyNote} />
                <QA dailyNote={dailyNote} />
                <Sentiment dailyNote={dailyNote} />
            </div>
        </div>
    );
}

export default Dashboard;
