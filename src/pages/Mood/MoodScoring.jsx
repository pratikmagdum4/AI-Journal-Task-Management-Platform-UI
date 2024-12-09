import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useSelector } from "react-redux";
import { isAuthenticated, selectCurrentUid } from "../../redux/authSlice";
import { BASE_URL } from "../../api";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const MoodCalendar = () => {

    const navigate = useNavigate();
    const authenticated = useSelector(isAuthenticated);
    useEffect(()=>{
        if(!authenticated)
        {
            navigate('/login');
        }
    },[authenticated])

    const [moods, setMoods] = useState({});
    const [loading, setLoading] = useState(true);
    const id = useSelector(selectCurrentUid);
    const [entries, setEntries] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-based month

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(new Date(selectedYear, selectedMonth)),
        end: endOfMonth(new Date(selectedYear, selectedMonth)),
    });

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/journal/day/day-entries/${id}`);
            setEntries(response.data.data);
        } catch (error) {
            console.error("Error fetching entries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    useEffect(() => {
        const moodData = {};
        entries.forEach((entry) => {
            const dateKey = format(new Date(entry.Date), "yyyy-MM-dd");
            const dateKeyNumber = Number(dateKey.replace(/-/g, ""));
            moodData[dateKeyNumber] = { mood: entry.mood, moodScore: entry.moodScore };
        });
        setMoods(moodData);
    }, [entries]);

    return (
        <>
            <Navbar />
            <div className="bg-white mt-14 p-6 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Mood Calendar</h2>
                <div className="flex justify-center space-x-4 mb-4">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg p-2"
                    >
                        {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() - 5 + i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg p-2"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                                {format(new Date(0, i), "MMMM")}
                            </option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <p className="text-gray-500 text-center">Loading mood data...</p>
                ) : (
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                        {daysInMonth.map((date) => {
                            const dateKey = format(date, "yyyy-MM-dd");
                            const dateKeyNumber = Number(dateKey.replace(/-/g, ""));
                            const moodData = moods[dateKeyNumber] || { mood: "No entry", moodScore: "N/A" };

                            return (
                                <div
                                    key={dateKey}
                                    className={`border border-gray-200 p-2 rounded-lg flex flex-col items-center justify-center h-24 text-center ${moodData.mood !== "No entry" ? "bg-yellow-100" : "bg-gray-100"
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

export default MoodCalendar;
