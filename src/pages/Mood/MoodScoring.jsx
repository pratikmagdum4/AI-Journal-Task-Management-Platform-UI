import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useSelector } from "react-redux";
import { selectCurrentUid } from "../../redux/authSlice";
import { BASE_URL } from "../../api";
import Navbar from "../Navbar/Navbar";

const MoodCalendar = () => {
    const [moods, setMoods] = useState({});
    const [loading, setLoading] = useState(true);
    const id = useSelector(selectCurrentUid);
    const [entries, setEntries] = useState([]);

    const currentMonth = new Date();
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/journal/day/day-entries/${id}`);
            console.log("The response data is", response.data);
            setEntries(response.data.data); // Access the actual array within the response
        } catch (error) {
            console.error("Error fetching entries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);  // Fetch entries once when component mounts

    useEffect(() => {
        const moodData = {};

        entries.forEach((entry) => {
            // Format the date without hyphens to use as a key, e.g., "20241106"
            const dateKey = format(new Date(entry.Date), "yyyy-MM-dd");
            const dateKeyNumber = Number(dateKey.replace(/-/g, ""));  // Convert date to a number like 20241106

            // Store the mood data under this formatted date key (number)
            moodData[dateKeyNumber] = { mood: entry.mood, moodScore: entry.moodScore };
        });

        console.log("Mood data populated:", moodData); // Check if the mood data is populated correctly
        setMoods(moodData);
    }, [entries]);  // Re-run when `entries` change

    return (
        <>
            <Navbar />
            <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Mood Calendar</h2>
                {loading ? (
                    <p className="text-gray-500 text-center">Loading mood data...</p>
                ) : (
                    <div className="grid grid-cols-7 gap-4">
                        {daysInMonth.map((date) => {
                            const dateKey = format(date, "yyyy-MM-dd");
                            const dateKeyNumber = Number(dateKey.replace(/-/g, ""));  // Convert to number

                            const moodData = moods[dateKeyNumber] || { mood: "No entry", moodScore: "N/A" };  // Get mood data for this day
                            // console.log("data",moodData.mode)
                            return (
                                <div
                                    key={dateKey}
                                    className={`border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-24 ${moodData.mood !== "No entry" ? "bg-yellow-100" : "bg-gray-100"
                                        }`}
                                >
                                    <p className="text-xs text-gray-500">{format(date, "MMM d")}</p>
                                    <p className="text-sm font-semibold mt-2">{moodData.mood}</p>
                                    <p className="text-xs text-gray-400 mt-1">Mood Score: {moodData.moodScore}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

// Add emojis to mood keywords
const moodWithEmoji = (mood) => {
    switch (mood.toLowerCase()) {
        case "Sadness":
            return "😭 😢 Sad";
        case "happiness":
        case "happy":
            return "😊 😄 Happy";
        case "joyful":
        case "joy":
            return "🥳 🎉 Joyful";
        case "excited":
            return "🤩 🎉 Excited";
        case "calm":
            return "😌 ☮️ Calm";
        case "content":
            return "😊 😌 Content";
        
        case "angry":
            return "😠 🤬 Angry";
        case "fearful":
        case "fear":
            return "😨 😱 Fearful";
        case "anxious":
            return "😟 😰 Anxious";
        case "frustrated":
            return "😤 😠 Frustrated";
        default:
            return "😐 No entry";
    }
};

export default MoodCalendar;
