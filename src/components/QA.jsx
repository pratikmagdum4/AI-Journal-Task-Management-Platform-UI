import React, { useState } from 'react';

function QA({ dailyNote }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5000/qa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context: dailyNote, question }),
        })
            .then((response) => response.json())
            .then((data) => setAnswer(data.answer))
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Question Answering</h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <button
                onClick={handleSubmit}
                className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
            >
                Get Answer
            </button>
            {answer && (
                <div className="mt-4">
                    <h3 className="font-semibold">Answer:</h3>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}

export default QA;
