// GoalEntryForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';
import { BASE_URL } from '../../api';

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
        } catch (error) {
            console.error('Error sending goal to server:', error);
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (goalDescription.trim() && goalCategory.trim()) {
            const newGoal = {
                goalDescription,
                goalCategory,
                userId:id
            };
            setGoals([...goals, newGoal]);
            await sendGoalToServer(newGoal); // Send the goal to the server
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
                >
                    Add Goal
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
