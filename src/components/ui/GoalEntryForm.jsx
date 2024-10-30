<<<<<<< HEAD
// GoalEntryForm.js
import React, { useState } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> main
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';
import { BASE_URL } from '../../api';
<<<<<<< HEAD

const GoalEntryForm = ( ) => {
    const [goalDescription, setGoalDescription] = useState('');
    const [goalCategory, setGoalCategory] = useState('');
    const [goals, setGoals] = useState([]);
    const id = useSelector(selectCurrentUid);
    // Async function to send goal to the server
    const sendGoalToServer = async (newGoal) => {
        try {
            const response = await axios.post(`${BASE_URL}/user/goals/add/${id}`, newGoal);
            console.log('Goal saved:', response.data); // Log response data
=======
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

const GoalEntryForm = () => {
    const [goalDescription, setGoalDescription] = useState('');
    const [goalCategory, setGoalCategory] = useState('');
    const [goals, setGoals] = useState([]);
    const [goalQuestions, setGoalQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const id = useSelector(selectCurrentUid);

    // Async function to send goal to the server
    const sendGoalToServer = async (newGoal) => {
        if (!goalQuestions) {
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/user/goals/add/${id}`, newGoal);
            console.log('Goal saved:', response.data); // Log response data
            setGoalDescription('');
>>>>>>> main
        } catch (error) {
            console.error('Error sending goal to server:', error);
        }
    };

<<<<<<< HEAD
    const handleAddGoal = async (e) => {
        e.preventDefault();
=======
    // useEffect to fetch questions after goalDescription is set
    useEffect(() => {
        if (!goalDescription.trim()) return;

        const fetchGoalQuestions = async () => {
            setLoading(true);
            try {
                console.log("The goal is ", goalDescription);
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

        // Delay execution to wait for goalDescription to settle
        const delayDebounce = setTimeout(() => {
            fetchGoalQuestions();
        }, 1000); // Delay by 1 second (1000 ms)

        return () => clearTimeout(delayDebounce); // Clear timeout if goalDescription changes
    }, [goalDescription]);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log("The questions generated are", goalQuestions);
>>>>>>> main
        if (goalDescription.trim() && goalCategory.trim()) {
            const newGoal = {
                goalDescription,
                goalCategory,
<<<<<<< HEAD
                userId:id
            };
            setGoals([...goals, newGoal]);
            await sendGoalToServer(newGoal); // Send the goal to the server
=======
                userId: id,
                questions: goalQuestions
            };
            setGoals([...goals, newGoal]);
            if (goalQuestions)
                await sendGoalToServer(newGoal); // Send the goal to the server
>>>>>>> main
            setGoalDescription(''); // Clear input fields after adding
            setGoalCategory('');
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
<<<<<<< HEAD
                >
                    Add Goal
=======
                >{loading ? "Adding the goal" : "Add goal"}
>>>>>>> main
                </button>
            </form>
            <ul className="list-disc pl-4">
                {goals.map((g, index) => (
                    <li key={index} className="text-gray-700 mb-1">
                        {g.goalDescription} - <span className="text-gray-500">{g.goalCategory}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalEntryForm;
