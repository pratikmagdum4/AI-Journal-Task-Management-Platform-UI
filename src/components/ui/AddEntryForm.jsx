import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import Loader2 from './Loading2';
import { getMoodAndScore } from '../../utlis/HealthHelper';

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
    const [isRecording, setIsRecording] = useState(false);
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

    
    // const getEntriesForDays = async()=>[
    //     const response = axios.get(`${BASE_URL}/api/journal/day-entries/${id}`)
    // setDayEntryContent(response.data.content)
    // ]
    const handleAddEntry = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formattedAnswers = showQuestions ? await formatAnswersToText(questionAnswers) : "";
            const finalContent = formattedAnswers ? `${formattedAnswers}${entryContent}` : entryContent;
            const newIndividualEntry = {
                userId,
                CombinedEntry: { content: finalContent, timestamp: new Date() },
                date: new Date().toISOString().split('T')[0],
            };
            const newIndividualEntry2 = {
                userId,
                content: finalContent,
                date: new Date().toISOString().split('T')[0],
            };
            console.log("The date is ",newIndividualEntry2.date)
            await axios.post(`${BASE_URL}/api/journal/add-entry`, newIndividualEntry2);
            let existingContent = '';

            try {
                const { data: dayEntryResponse } = await axios.get(
                    `${BASE_URL}/api/journal/day/day-entry/${userId}/${newIndividualEntry.date}`
                );
                console.log("The date is", newIndividualEntry.date)
                if (dayEntryResponse?.data?.CombinedEntry?.content) {
                    existingContent = dayEntryResponse.data.CombinedEntry.content;
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log("No entry found for this date.");
                } else {
                    throw error;
                }
            }
            console.log("The exixting is ",existingContent)
            const updatedContent = existingContent
                ? `${existingContent}\n\n${finalContent}`
                : finalContent;
            console.log("the updated is ",updatedContent)
            const { retrievedMood, retrievedMoodScore } = await getMoodAndScore(updatedContent);
            const mood = retrievedMood;
            const moodScore = retrievedMoodScore;

            const dayEntryData = {
                userId,
                CombinedEntry: { content: updatedContent, timestamp: new Date() },
                Date: newIndividualEntry.date,
                mood,
                moodScore,
            };
console.log("The day entry is ",dayEntryData)
            // if (existingContent) {
            //     await axios.put(`${BASE_URL}/api/journal/day/update-day-entry`, dayEntryData);
            // } else {
                await axios.post(`${BASE_URL}/api/journal/day/add-day-entry`, dayEntryData);
            // }

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

    const startRecording = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error('Your browser does not support speech recognition.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();
        setIsRecording(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setEntryContent((prevContent) => `${prevContent} ${transcript}`);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            toast.error('Error with speech recognition. Please try again.');
        };

        recognition.onend = () => {
            setIsRecording(false);
        };
    };


    return (
        <div className="relative">
            <form onSubmit={handleAddEntry} className="p-4 border rounded-lg bg-gray-100 shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>

                {/* Goal Selection */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Select a Goal</label>
                    <select
                        onChange={(e) => handleSelectGoal(goals.find((g) => g._id === e.target.value))}
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

                {showQuestions &&
                    goalQuestions.map((question, index) => (
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

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={startRecording}
                        className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    >
                        {isRecording ? 'Stop Recording...' : 'Start Recording'}
                    </button>
                </div>

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
