import React, { useState } from 'react';
import axios from 'axios';

const TaskInputForm = () => {
    const [taskInput, setTaskInput] = useState('');
    const [parsedTask, setParsedTask] = useState('');
    const [parsedDeadline, setParsedDeadline] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

            // Here we assume the Gemini API response is structured so you can split or parse the response
            // Example response processing based on structure you might receive:
            const parsedData = geminiResponse.split("Deadline:");
            setParsedTask(parsedData[0].trim());
            setParsedDeadline(parsedData[1] ? parsedData[1].trim() : "No specific deadline found");

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
        </div>
    );
};

export default TaskInputForm;
