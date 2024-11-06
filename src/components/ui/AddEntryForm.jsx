import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
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
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [dayEntryContent,setDayEntryContent] = useState()
    const userId = useSelector(selectCurrentUid);

    useEffect(() => {
        getGoals();
    }, [userId]);

    const getGoals = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/goals/${userId}`);
            setGoals(response.data);
        } catch (error) {
            console.error("Error fetching goals:", error);
            toast.error("Could not retrieve goals. Please try again later.");
        }
    };

    const handleSelectGoal = (goal) => {
        setSelectedGoal(goal);
        setGoalQuestions(goal.questions || []);
        setShowQuestions(true);
        setQuestionAnswers(new Array(goal.questions.length).fill(''));
    };

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
                                    ).join(" | ")}`,
                                },
                            ],
                        },
                    ],
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

    const getMoodAndScore = async (content) => {
        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze the following entry to identify the mood state with one keyword and its intensity on a scale of 1-10. Select from these moods: happiness, sadness, anger, fear, surprise, disgust, joy, excitement, calmness, anxiety, frustration, boredom, confusion, contentment, indifference. Entry: "${content}" ,return  only two things a word with relevant emoji and score digit `,
                                },
                            ],
                        },
                    ],
                }
            );
            const moodData = response.data.candidates[0].content.parts[0].text.split('|');
            
            const [retrievedMood, retrievedMoodScore] = moodData[0].split(',');
            console.log("The mood ", retrievedMood)
            console.log("The mood score ", retrievedMoodScore)
            return { retrievedMood, retrievedMoodScore };
        } catch (error) {
            console.error("Error fetching mood:", error);
            return { mood: "Unknown", moodScore: "0" };
        }
    };
    // const getEntriesForDays = async()=>[
    //     const response = axios.get(`${BASE_URL}/api/journal/day-entries/${id}`)
    // setDayEntryContent(response.data.content)
    // ]
    const handleAddEntry = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formattedAnswers = showQuestions ? await formatAnswersToText(questionAnswers) : "";
            const finalContent = `${formattedAnswers}\n\n${entryContent}`;

            // Individual entry object to save in the other schema
            const newIndividualEntry = {
                userId,
                content: finalContent,
                date: new Date().toISOString().split('T')[0],
            };

            // Save the individual entry to the other schema
            await axios.post(`${BASE_URL}/api/journal/add-entry`, newIndividualEntry);

            // Check if there's already a DayEntry for the user on the same date
            console.log("The date is ",newIndividualEntry.date)
            let existingContent = '';
            try {
                // Fetch DayEntry for the specific user and date
                const { data: dayEntryResponse } = await axios.get(`${BASE_URL}/api/journal/day/day-entries/${userId}`, newIndividualEntry.date);
                console.log("The dayEntryResponse", dayEntryResponse.data)
                // Access the CombinedEntry from the first item in the array, if it exists
                existingContent = '';

                // Iterate over each entry in the response and concatenate the CombinedEntry
                dayEntryResponse.data.forEach(entry => {
                    if (entry.CombinedEntry) {
                        existingContent += `\n\n${entry.CombinedEntry}`;
                    }
                });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No entry found for this date.");
                    // If no existing entry found, set existingContent to empty string
                    existingContent = '';
                } else {
                    // If another error occurred, throw it
                    throw error;
                }
            }

            // Concatenate the new content to the existing content if any
            const updatedContent = existingContent ? `${existingContent}\n\n${finalContent}` : finalContent;
            console.log("The updated content ",updatedContent)
            console.log("The existingContent content ",existingContent)
            // Recalculate mood and moodScore based on updated content
            const { retrievedMood, retrievedMoodScore } = await getMoodAndScore(updatedContent);
            const mood = retrievedMood;
            const moodScore = retrievedMoodScore;

            // Day entry object to either update or create in DayEntry schema
            const dayEntryData = {
                userId,
                CombinedEntry: updatedContent,
                Date: newIndividualEntry.date,
                mood,
                moodScore,
            };

            if (existingContent) {
                // If entry exists, update it with the concatenated content
                await axios.put(`${BASE_URL}/api/journal/day/update-day-entry/${userId}/${newIndividualEntry.date}`, dayEntryData);
            } else {
                // If entry does not exist, create a new one
                await axios.post(`${BASE_URL}/api/journal/day/add-day-entry`, dayEntryData);
            }

            toast.success("Entry added successfully");
            setEntryContent('');
            setQuestionAnswers([]);
            setShowQuestions(false);
            setSelectedGoal(null);
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

                {/* Goal Selection */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Select a Goal</label>
                    <select
                        onChange={(e) => handleSelectGoal(goals.find(g => g._id === e.target.value))}
                        value={selectedGoal ? selectedGoal._id : ''}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">-- Select a Goal --</option>
                        {goals.map((goal) => (
                            <option key={goal._id} value={goal._id}>
                                {goal.goalDescription}
                            </option>
                        ))}
                    </select>
                </div>

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

            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <Loader2 />
                </div>
            )}
        </div>
    );
};

export default AddEntryForm;
