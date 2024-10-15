import React, { useState } from 'react';

function Sentiment({ dailyNote }) {
    const [result, setResult] = useState({ label: '', score: 0 });

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5000/sentiment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: dailyNote }),
        })
            .then((response) => response.json())
            .then((data) => setResult({ label: data.label, score: data.score }))
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Sentiment Analysis</h2>
            <button
                onClick={handleSubmit}
                className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
            >
                Analyze Sentiment
            </button>
            {result.label && (
                <div className="mt-4">
                    <h3 className="font-semibold">Sentiment:</h3>
                    <p>{`Label: ${result.label}, Confidence: ${result.score.toFixed(2)}`}</p>
                </div>
            )}
        </div>
    );
}

export default Sentiment;
