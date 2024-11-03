import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, LineController } from 'chart.js';
import { Line } from "react-chartjs-2";
import { BASE_URL } from "../../api";
import { useSelector } from "react-redux";
import { selectCurrentUid } from "../../redux/authSlice";

// Register Chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, LineController);

const HealthInsight = () => {
    const [entries, setEntries] = useState([]);
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const id = useSelector(selectCurrentUid);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/journal/get-all-entries/${id}`);
                setEntries(response.data); // Store entries in the state
            } catch (error) {
                console.error("Error fetching entries:", error);
            }
        };
        fetchEntries();
    }, [id]);

    useEffect(() => {
        const fetchFormattedText = async () => {
            if (entries.length === 0) return;

            const formattedEntries = entries.map((entry, index) => (
                `Entry ${index + 1}: ${entry.content} (Timestamp: ${new Date(entry.date).toLocaleString()})`
            )).join("\n\n");

            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Based on the entries data, draw analysis on health such as physical, mental, and emotional health. ${formattedEntries}`,
                                    },
                                ],
                            },
                        ],
                    }
                );

                const resultText = response.data.candidates[0].content.parts[0].text;
                console.log("The result is",resultText)
                const parsedData = parseHealthData(resultText);
                setHealthData(parsedData);
                setLoading(false);
            } catch (error) {
                console.error("Error generating insights:", error);
                setLoading(false);
            }
        };

        fetchFormattedText();
    }, [entries]);

    // Parse resultText to extract health insights
    const parseHealthData = (resultText) => {
        const categories = resultText.split("**").filter(text => text.trim() !== "");
        const healthData = {
            physical: [],
            mental: [],
            emotional: []
        };

        categories.forEach(category => {
            const [title, ...entries] = category.split("\n").filter(line => line.trim());
            const categoryName = title.toLowerCase().includes("physical")
                ? "physical"
                : title.toLowerCase().includes("mental")
                    ? "mental"
                    : "emotional";

            entries.forEach(entryText => {
                const entryNumberMatch = entryText.match(/Entry (\d+)/);
                if (entryNumberMatch) {
                    const entryNumber = parseInt(entryNumberMatch[1], 10);
                    const score = determineSentimentScore(entryText);
                    healthData[categoryName].push({ entry: entryNumber, score, description: entryText });
                }
            });
        });

        return healthData;
    };

    // Helper function to assign sentiment scores
    const determineSentimentScore = (entryText) => {
        const positiveKeywords = ["contentment", "fulfilled", "clarity", "happy", "accomplished", "positive"];
        const negativeKeywords = ["unmotivated", "overwhelmed", "stress", "emptiness", "frustration", "disappointment"];

        let score = 0;
        positiveKeywords.forEach(word => {
            if (entryText.toLowerCase().includes(word)) score += 1;
        });
        negativeKeywords.forEach(word => {
            if (entryText.toLowerCase().includes(word)) score -= 1;
        });

        return score;
    };

    // Generate chart data for Chart.js
    const generateChartData = (healthData) => ({
        labels: healthData.physical.map(data => `Entry ${data.entry}`),  // Map entries to labels
        datasets: [
            {
                label: "Physical Health",
                data: healthData.physical.map(entry => entry.score),
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
            },
            {
                label: "Mental Health",
                data: healthData.mental.map(entry => entry.score),
                borderColor: "rgba(153, 102, 255, 1)",
                fill: false,
            },
            {
                label: "Emotional Health",
                data: healthData.emotional.map(entry => entry.score),
                borderColor: "rgba(255, 159, 64, 1)",
                fill: false,
            },
        ],
    });


    return (
        <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Health Insights</h2>
            {loading ? (
                <p className="text-gray-500 text-center">Loading insights...</p>
            ) : healthData ? (
                <Line key={JSON.stringify(healthData)} data={generateChartData(healthData)} />
            ) : (
                <p className="text-gray-500 text-center">No data available.</p>
            )}
        </div>
    );
};

export default HealthInsight;
