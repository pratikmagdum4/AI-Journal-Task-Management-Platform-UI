import React, { useEffect, useState } from 'react';

const GoalAnalyzer = () => {
    const [recognizedGoals, setRecognizedGoals] = useState([]);

    useEffect(() => {
        // Fetch all journal entries and analyze goals
        const analyzeGoals = () => {
            const allEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
            const interests = extractInterests(allEntries);
            setRecognizedGoals(interests);
        };

        const extractInterests = (entries) => {
            // Basic keyword detection for goal recognition (AI integration can be done here)
            const goalKeywords = ['exercise', 'study', 'work', 'health', 'read', 'project'];
            const detectedGoals = [];

            entries.forEach(entry => {
                goalKeywords.forEach(keyword => {
                    if (entry.content.includes(keyword)) {
                        detectedGoals.push(keyword);
                    }
                });
            });

            return Array.from(new Set(detectedGoals)); // Unique goals
        };

        analyzeGoals();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recognized Goals</h2>
            {recognizedGoals.length > 0 ? (
                <ul className="list-disc list-inside">
                    {recognizedGoals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                    ))}
                </ul>
            ) : (
                <p>No goals detected yet.</p>
            )}
        </div>
    );
};

export default GoalAnalyzer;
