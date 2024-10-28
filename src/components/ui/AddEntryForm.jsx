import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import Loader2 from './Loading2';

const AddEntryForm = () => {
    const [entryContent, setEntryContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [goalQuestions, setGoalQuestions] = useState([]);
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [goals, setGoals] = useState([]);
    const userId = useSelector(selectCurrentUid);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch goals on initial load
        getGoals();
    }, [userId]);

    // Fetch user's goals from the server
    const getGoals = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/goals/${userId}`);
            setGoals(response.data);
        } catch (error) {
            console.error("Error fetching goals:", error);
            toast.error("Could not retrieve goals. Please try again later.");
        }
    };

    // Fetch questions only if the user chooses to answer them today
    useEffect(() => {
        const fetchGoalQuestions = async () => {
            if (goals.length === 0 || !showQuestions) return;

            setLoading(true);
            try {
                const goalDescriptions = goals.map(goal => goal.goalDescription).join(", ");
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Generate 3 questions to track progress for these goals: "${goalDescriptions}".`
                                    }
                                ]
                            }
                        ]
                    }
                );
                const generatedQuestions = response.data.candidates[0].content.parts[0].text.split("\n");
                setGoalQuestions(generatedQuestions);
            } catch (error) {
                console.error('Error fetching goal-related questions:', error);
                toast.error('Failed to generate goal questions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchGoalQuestions();
    }, [goals, showQuestions]);

    // Format answers to descriptive statements
    const formatAnswersToText = async (answers) => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Convert these yes/no answers into descriptive statements: ${answers.map(
                                        (answer, index) => `Q: ${goalQuestions[index]}, A: ${answer || 'Not Answered'}`
                                    ).join(" | ")}`
                                }
                            ]
                        }
                    ]
                }
            );
            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error formatting answers:", error);
            return "";
        }
    };

    const handleAnswerChange = (index, answer) => {
        const updatedAnswers = [...questionAnswers];
        updatedAnswers[index] = answer;
        setQuestionAnswers(updatedAnswers);
    };

    const handleAddEntry = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Format answers into descriptive statements if questions are shown
            const formattedAnswers = showQuestions ? await formatAnswersToText(questionAnswers) : "";

            // Combine formatted answers and additional content
            const finalContent = `${formattedAnswers}\n\n${entryContent}`;

            const newEntry = {
                userId,
                content: finalContent,
                date: new Date().toISOString().split('T')[0],
            };

            await axios.post(`${BASE_URL}/api/journal/add-entry`, newEntry);
            toast.success("Entry added successfully");
            setEntryContent('');
            setQuestionAnswers([]);
            setShowQuestions(false); // Reset questions for the next day
        } catch (error) {
            console.error("Error adding entry:", error);
            toast.error("Error adding entry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleAddEntry} className="p-4 border rounded-lg bg-gray-100 shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>

                {/* Toggle to show goal-related questions */}
                <button
                    type="button"
                    onClick={() => setShowQuestions(!showQuestions)}
                    className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    {showQuestions ? "Hide Goal Questions" : "Show Goal Questions if not answered today!!"}
                </button>

                {/* Display goal-related questions if toggled on */}
                {showQuestions && goalQuestions.map((question, index) => (
                    <div key={index} className="mb-4">
                        <label className="block font-semibold mb-2">{question}</label>
                        <input
                            type="text"
                            value={questionAnswers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder="Answer here..."
                            className="w-full p-2 border rounded"
                        />
                    </div>
                ))}

                <textarea
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                    placeholder="Write additional thoughts..."
                    className="w-full h-32 p-2 border rounded mt-4"
                    required
                />

                <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Add Entry
                </button>
            </form>

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <Loader2 />
                </div>
            )}
        </div>
    );
};

export default AddEntryForm;
