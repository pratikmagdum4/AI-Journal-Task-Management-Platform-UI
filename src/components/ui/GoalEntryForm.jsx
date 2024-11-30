import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';
import { BASE_URL } from '../../api';
import { toast } from 'react-toastify';

const GoalEntryForm = ({ ONnewGoalAdded }) => {
    const [goalDescription, setGoalDescription] = useState('');
    const [goalCategory, setGoalCategory] = useState('');
    const [goals, setGoals] = useState([]);
    const [goalQuestions, setGoalQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const id = useSelector(selectCurrentUid);

    // Fetch all goals for the user when the component loads
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/goals/${id}`);
                setGoals(response.data);
            } catch (error) {
                console.error('Error fetching goals:', error);
                toast.error('Failed to fetch goals. Please try again.');
            }
        };
        fetchGoals();
    }, [id]);

    // Function to send goal to the server
    const sendGoalToServer = async (newGoal) => {
        try {
            const response = await axios.post(`${BASE_URL}/user/goals/add/${id}`, newGoal);
            setGoals((prevGoals) => [...prevGoals, response.data.goal]);
            ONnewGoalAdded()
            setGoalDescription('');
            setGoalCategory('');
            setGoalQuestions([]);
        } catch (error) {
            console.error('Error sending goal to server:', error);
            toast.error('Failed to add goal. Please try again.');
        }
    };

    // Generate questions based on goalDescription
    useEffect(() => {
        if (!goalDescription.trim()) return;

        const fetchGoalQuestions = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Generate 2 questions to track progress for these goals: "${goalDescription}".`
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

        const delayDebounce = setTimeout(() => {
            fetchGoalQuestions();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [goalDescription]);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (goalDescription.trim() && goalCategory.trim()) {
            const newGoal = {
                goalDescription,
                goalCategory,
                userId: id,
                questions: goalQuestions
            };
            await sendGoalToServer(newGoal);
        }
    };

    // Update a goal
    // const handleUpdateGoal = async (goalId, updatedDescription, updatedCategory) => {
    //     try {
    //         const response = await axios.put(`${BASE_URL}/user/goals/${goalId}`, {
    //             goalDescription: updatedDescription,
    //             goalCategory: updatedCategory,
    //         });
    //         setGoals((prevGoals) => prevGoals.map((goal) =>
    //             goal._id === goalId ? response.data.goal : goal
    //         ));
    //         toast.success('Goal updated successfully!');
    //     } catch (error) {
    //         console.error('Error updating goal:', error);
    //         toast.error('Failed to update goal. Please try again.');
    //     }
    // };

    // Mark goal as done and delete it
    const handleMarkGoalAsDone = async (goalId) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            try {
                await axios.delete(`${BASE_URL}/user/goals/delete/${goalId}`);
                setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
                toast.success('Goal marked as done!');
            } catch (error) {
                console.error('Error deleting goal:', error);
                toast.error('Failed to mark goal as done. Please try again.');
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Set Your Goals</h2>
            <form onSubmit={handleAddGoal} className="mb-4">
                <input
                    type="text"
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    placeholder="Enter your goal description"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 mb-2"
                />
                <input
                    type="text"
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    placeholder="Enter goal category"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 mb-2"
                />
                <button
                    type="submit"
                    className="mt-2 w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >{loading ? "Adding the goal" : "Add goal"}
                </button>
            </form>

            <ul className="list-disc pl-4">
                {goals.map((goal) => (
                    <li key={goal._id} className="text-gray-700 mb-2 flex items-center justify-between">
                        <div>
                            <span className="font-semibold">{goal.goalDescription}</span>
                            <span className="text-gray-500 ml-2">({goal.goalCategory})</span>
                        </div>
                        <button
                            onClick={() => handleMarkGoalAsDone(goal._id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                        >
                            Mark as Done
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default GoalEntryForm;
