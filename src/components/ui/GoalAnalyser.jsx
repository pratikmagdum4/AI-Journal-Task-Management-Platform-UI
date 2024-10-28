import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';

const GoalAnalyzer = () => {
    const [goal, setGoal] = useState('');
    const [entries, setEntries] = useState([]);
    const [analysis, setAnalysis] = useState('');
    const [analyzingGoal, setAnalyzingGoal] = useState(false);
    const id = useSelector(selectCurrentUid);

    // Format entries for the API
    const formatEntriesForAPI = () => {
        return entries.map((entry, index) => {
            return `Entry ${index + 1}: ${entry.content} (Timestamp: ${new Date(entry.date).toLocaleString()})`;
        }).join("\n\n");
    };

    // Function to analyze goal
    async function analyzeGoal(e) {
        e.preventDefault();
        console.log("Entries for analysis: ", entries);
        setAnalyzingGoal(true);

        const formattedEntries = formatEntriesForAPI();
        setAnalysis("Analyzing your goal progress... This may take a few moments.");

        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                method: "post",
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze the following entries in relation to the goal: "${goal}". Provide insights on the user's progress in a short paragraph and provide few points to improve , give the response as like you are taking to a person and providing him this information in a conversation :\n\n${formattedEntries}`
                                }
                            ]
                        }
                    ]
                }
            });

            setAnalysis(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error("Error:", error);
            setAnalysis("Sorry - Something went wrong. Please try again.");
        }

        setAnalyzingGoal(false);
    }

    // Fetch all entries when the component loads
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/journal/get-all-entries/${id}`);
                console.log("Fetched entries:", response.data);
                setEntries(response.data);
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };
        fetchEntries();
    }, [id]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Analyze Your Goal Progress</h2>
            <form onSubmit={analyzeGoal}>
                <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Enter your goal..."
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4"
                    rows="3"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    disabled={analyzingGoal}
                >
                    {analyzingGoal ? "Analyzing Goal..." : "Analyze Goal"}
                </button>
            </form>
            {analysis && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold">Goal Analysis:</h3>
                    <p>{analysis}</p>
                </div>
            )}
        </div>
    );
};

export default GoalAnalyzer;
