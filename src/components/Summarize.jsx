import React, { useState } from 'react';

function Summarize({ dailyNote }) {
    const [summary, setSummary] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5000/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: dailyNote }),
        })
            .then((response) => response.json())
            .then((data) => setSummary(data.summary))
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Text Summarization</h2>
            <button
                onClick={handleSubmit}
                className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
            >
                Summarize
            </button>
            {summary && (
                <div className="mt-4">
                    <h3 className="font-semibold">Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}

export default Summarize;
