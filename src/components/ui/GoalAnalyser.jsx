import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';

const GoalAnalyzer = ({ newGoalAdded }) => {
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState('');
    const [entries, setEntries] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [analyzingGoal, setAnalyzingGoal] = useState(false);
    const userId = useSelector(selectCurrentUid);

    // Format entries for the API
    const formatEntriesForAPI = () => {
        return entries
            .map((entry, index) => `Entry ${index + 1}: ${entry.content} (Timestamp: ${new Date(entry.date).toLocaleString()})`)
            .join("\n\n");
    };

    // Function to analyze goal
    async function analyzeGoal(e) {
        e.preventDefault();

        if (!selectedGoal) {
            alert('Please select a goal to analyze.');
            return;
        }

        setAnalyzingGoal(true);
        setAnalysis("Analyzing your goal progress... This may take a few moments.");

        const formattedEntries = formatEntriesForAPI();

        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                method: "post",
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze the following entries related to the goal: "${selectedGoal}". Provide insights in JSON format with the following structure:
                                {
                                    "Challenges_Encountered": [],
                                    "Strategies_for_Overcoming_Challenges": [],
                                    "Action_Planning": [],
                                    "Additional_Tips": []
                                }
                                provide JSON response, along with any other explanation in json format only, fill all categories :\n\n${formattedEntries}`
                                }
                            ]
                        }
                    ]
                }
            });

            const responseText = response.data.candidates[0].content.parts[0].text;
            console.log("Response from API:", responseText);

            // Try parsing the response as JSON
            let jsonResponse;
            try {
                jsonResponse = JSON.parse(responseText);
                setAnalysis(jsonResponse);
            } catch (parseError) {
                console.error("JSON parsing error:", parseError);
                setAnalysis("Sorry, the response was not in the expected JSON format. Please try again.");
            }

        } catch (error) {
            console.error("Error:", error);
            setAnalysis("Sorry - Something went wrong. Please try again.");
        }

        setAnalyzingGoal(false);
    }

    // Fetch all entries and goals when the component loads
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/journal/get-all-entries/${userId}`);
                setEntries(response.data);
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };

        const fetchGoals = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/goals/${userId}`);
                console.log("The response goal i s",response)
                setGoals(response.data);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
        };

        fetchEntries();
        fetchGoals();
    }, [userId, newGoalAdded]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Analyze Your Goal Progress</h2>
            <form onSubmit={analyzeGoal}>
                <label className="block mb-2 text-gray-700">Select a Goal to Analyze:</label>
                <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                >
                    <option value="">-- Select a Goal --</option>
                    {goals.map((goal, index) => (
                        <option key={index} value={goal.goalDescription}>
                            {goal.goalDescription}
                        </option>
                    ))}
                </select>

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
                    <h3 className="text-lg font-semibold mb-2">Goal Analysis:</h3>

                    {typeof analysis === 'string' ? (
                        <p>{analysis}</p>
                    ) : (
                        <div>
                            <h4 className="font-bold mt-4">Challenges Encountered:</h4>
                            <ul className="list-disc pl-5">
                                {analysis.Challenges_Encountered.map((challenge, index) => (
                                    <li key={index}>{challenge}</li>
                                ))}
                            </ul>

                            <h4 className="font-bold mt-4">Strategies for Overcoming Challenges:</h4>
                            <ul className="list-disc pl-5">
                                {analysis.Strategies_for_Overcoming_Challenges.map((strategy, index) => (
                                    <li key={index}>{strategy}</li>
                                ))}
                            </ul>

                            <h4 className="font-bold mt-4">Action Planning:</h4>
                            <ul className="list-disc pl-5">
                                {analysis.Action_Planning.map((action, index) => (
                                    <li key={index}>{action}</li>
                                ))}
                            </ul>

                            <h4 className="font-bold mt-4">Additional Tips:</h4>
                            <ul className="list-disc pl-5">
                                {analysis.Additional_Tips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoalAnalyzer;
