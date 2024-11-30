import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentEmail, selectCurrentUid } from '../../redux/authSlice';

const TaskInputForm = () => {
    const [taskInput, setTaskInput] = useState('');
    const [parsedTask, setParsedTask] = useState('');
    const [parsedDeadline, setParsedDeadline] = useState('');
    const [notificationTime, setNotificationTime] = useState(30); // Default notification time (30 minutes)
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const id = useSelector(selectCurrentUid);
    const email = useSelector(selectCurrentEmail)
    useEffect(() => {
        getTasks(); // Fetch existing tasks when the component mounts
        console.log("The tasks stored in effect ", tasks)

    }, []);
    const formatDeadline = (isoString) => {
        const dateObj = new Date(isoString);
        return {
            date: dateObj.toISOString().split("T")[0], // Extracts date in YYYY-MM-DD format
            time: dateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC", // Use UTC explicitly
            }),
        };
    };

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
                                    text: `Analyze the following task description and extract the exact task and its associated date and time. Use the current date for expressions like "today" and ensure the year matches the current year .Return the result in the following JSON format:
                                {
                                    "description": "<task description>",
                                    "dateTime": "<ISO 8601 formatted date and time>"
                                }

                                If no explicit date or time is found, set the "dateTime" field to the current date and time in ISO 8601 format.

                                Examples of input and expected JSON output:
                                1. Input: "Jogging tomorrow at 5 pm"
                                   Output: {
                                       "description": "Jogging",
                                       "dateTime": "2024-11-30T17:00:00Z"
                                   }

                                2. Input: "Finish the project by 3rd December"
                                   Output: {
                                       "description": "Finish the project",
                                       "dateTime": "2024-12-03T00:00:00Z"
                                   }

                                3. Input: "Team meeting on Monday at 10 am"
                                   Output: {
                                       "description": "Team meeting",
                                       "dateTime": "2024-12-02T10:00:00Z" // Assuming the input was on a Friday.

                                4. Input: "I want to read Mahabharat book at 11:10 am today"
                                Output: {
                                    "description": "Read Mahabharat book",
                                    "dateTime": "2024-11-29T11:10:00Z" // Assuming today is 29th November 2024
                                }
                                5. Input: "Jogging tomorrow at 5 pm"
                                Output: {
                                    "description": "Jogging",
                                    "dateTime": "2024-11-30T17:00:00Z" // Assuming today is 29th November 2024
                                }

                                Input Task:
                                "${taskInput}"`,
                                },
                            ],
                        },
                    ],
                },
            });
            console.log("The response is",response);
            const geminiResponse = JSON.parse(response.data.candidates[0].content.parts[0].text);

            const taskDescription = geminiResponse.description || "No description provided";
            const taskDeadline = geminiResponse.dateTime || new Date().toISOString();
            const deadline = formatDeadline(taskDeadline)
            setParsedTask(taskDescription);
            setParsedDeadline(deadline);

            // Add task to the server
            await addTaskToServer({ taskDescription, taskDeadline });

            // Update task list
            setTasks((prevTasks) => [...prevTasks, { taskDescription, taskDeadline }]);
            setTaskInput(''); // Clear input after processing

        } catch (error) {
            console.error("Error extracting task details:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const getTasks = async () => {
        console.log("in")

        try {
            const response = await axios.get(`${BASE_URL}/api/tasks/${id}`);
            setTasks(response.data); // Set fetched tasks in the state
            console.log("The tasks are", response.data)
            console.log("The tasks stored ", tasks)
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    const calculateReminderTime = (taskDateTime, minutesBefore) => {
        const taskTime = new Date(taskDateTime); // Parse the task date and time
        taskTime.setMinutes(taskTime.getMinutes() - minutesBefore); // Subtract the reminder offset
        return taskTime.toISOString(); // Return as UTC ISO string
    };

    const addTaskToServer = async (taskData) => {
        try {
            
            const reminderTime = new Date(
                new Date(taskData.taskDeadline).getTime() - notificationTime * 60000 // notificationTime is in minutes
            ).toISOString();

            const newTaskData = {
                originalTask: taskInput,
                extractedDescription: taskData.taskDescription,
                extractedTime: taskData.taskDeadline,
                dateTime: taskData.taskDeadline,
                reminderTime,
                userID: id,
                email
            };
            console.log("The task i s", newTaskData)
         const response =    await axios.post(`${BASE_URL}/api/tasks/add`, newTaskData);
         console.log("The response ",response)
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
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Notification Time:</label>
                        <select
                            value={notificationTime}
                            onChange={(e) => setNotificationTime(parseInt(e.target.value))}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                        >
                            <option value={5}>5 minutes before</option>
                            <option value={10}>10 minutes before</option>
                            <option value={30}>30 minutes before</option>
                            <option value={60}>1 hour before</option>
                            <option value={1440}>1 day before</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Add Task Details"}
                    </button>
                </form>

                {parsedTask && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold">Task Details:</h3>
                        <p><strong>Task:</strong> {parsedTask}</p>
                        <p><strong>Deadline:</strong> {formatDeadline(parsedDeadline)}</p>
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Task List:</h3>
                    <ul className="mt-4">
                        {tasks && tasks.length > 0 ? (
                            tasks.map((task, index) => (
                                <li key={index} className="p-4 mb-2 bg-gray-100 rounded-lg">
                                    <p><strong>Original Task:</strong> {task.originalTask}</p>
                                    <p><strong>Task:</strong> {task.extractedDescription}</p>
                                    {task.extractedTime && (
                                        <>  
                                        <p><strong>Deadline:</strong> </p>
                                        <p><strong>Date:</strong> {formatDeadline(task.extractedTime).date}</p>
                                        <p><strong>Time:</strong> {formatDeadline(task.extractedTime).time}</p>
                                        </>
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
