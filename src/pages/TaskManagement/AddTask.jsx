import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';

const TaskInputForm = () => {
    const [taskInput, setTaskInput] = useState('');
    const [parsedTask, setParsedTask] = useState('');
    const [parsedDeadline, setParsedDeadline] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const id = useSelector(selectCurrentUid);

    useEffect(() => {
        getTasks(); // Fetch existing tasks when the component mounts
    }, []);

    const extractTaskDetails = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                method: "post",
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Please identify the task description and deadline from the following text, specifying both the task and the exact time and date (if provided):\n\n"${taskInput}"`
                                }
                            ]
                        }
                    ]
                }
            });

            const geminiResponse = response.data.candidates[0].content.parts[0].text;
            const parsedData = geminiResponse.split("Deadline:");
            const taskDescription = parsedData[0].trim();
            const taskDeadline = parsedData[1] ? parsedData[1].trim() : "No specific deadline found";

            setParsedTask(taskDescription);
            setParsedDeadline(taskDeadline);

            // Add task to server and update task list
            await addTaskToServer({ taskDescription, taskDeadline });

            // Add task to the list
            setTasks((prevTasks) => [...(prevTasks || []), { taskDescription, taskDeadline }]); // Check for prevTasks existence
            setTaskInput(''); // Clear the input after adding

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTasks = async () => {
        console.log("in")
        
        try {
            const response = await axios.get(`${BASE_URL}/api/tasks/${id}`);
            setTasks(response); // Set fetched tasks in the state
            console.log("The tasks are",tasks)
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTaskToServer = async (taskData) => {
        try {
            // Prepare data with all required fields
            const newTaskData = {
                originalTask: taskInput, // Use the full task input as `originalTask`
                extractedDescription: taskData.taskDescription || "No description",
                extractedTime: taskData.taskDeadline || "No deadline",
                dateTime: new Date(), // Set this to the current time or parse a specific date from `taskDeadline`
                userID: id, // Pass the user ID from state or Redux
            };

            await axios.post(`${BASE_URL}/api/tasks/add`, newTaskData);
        } catch (error) {
            console.error("Error adding task to server:", error);
        }
    };


    return (
        <>
            <Navbar />
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Add a Task with Natural Language</h2>
                <form onSubmit={extractTaskDetails}>
                    <textarea
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="e.g., Jogging today at 5 pm"
                        className="w-full p-4 border border-gray-300 rounded-lg mb-4"
                        rows="3"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Extract Task Details"}
                    </button>
                </form>

                {parsedTask && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold">Task Details:</h3>
                        <p><strong>Task:</strong> {parsedTask}</p>
                        <p><strong>Deadline:</strong> {parsedDeadline}</p>
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Task List:</h3>
                    <ul className="mt-4">
                        {tasks && tasks.length > 0 ? (
                            tasks.map((task, index) => (
                                <li key={index} className="p-4 mb-2 bg-gray-100 rounded-lg">
                                    <p><strong>Task:</strong> {task.taskDescription}</p>
                                    {task.taskDeadline && (
                                        <p><strong>Deadline:</strong> {task.taskDeadline}</p>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="p-4 mb-2 bg-gray-100 rounded-lg">
                                <p>No tasks found.</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default TaskInputForm;
