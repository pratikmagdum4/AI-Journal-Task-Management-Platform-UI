import React, { useState, useEffect } from "react";
import axios from "axios";

// HealthInsight Component
const HealthInsight = ({ answers, goalQuestions }) => {
    const [formattedText, setFormattedText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormattedText = async () => {
            setLoading(true);
            const text = await formatAnswersToText(answers, goalQuestions);
            setFormattedText(text);
            setLoading(false);
        };

        fetchFormattedText();
    }, [answers, goalQuestions]);

    return (
        <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Health Insights</h2>

            {loading ? (
                <p className="text-gray-500 text-center">Loading insights...</p>
            ) : (
                <div className="space-y-6">
                    {/* Display insight categories */}
                    <HealthCategory title="Physical Health" insight={formattedText} />
                    <HealthCategory title="Mental Health" insight={formattedText} />
                    <HealthCategory title="Emotional Health" insight={formattedText} />
                </div>
            )}
        </div>
    );
};

// Individual Health Category Display
const HealthCategory = ({ title, insight }) => (
    <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-medium text-gray-700">{title}</h3>
        <p className="text-gray-600 mt-2">{insight}</p>
        <div className="flex mt-4 space-x-4">
            {/* Visual Indicators */}
            <Indicator label="Good" color="bg-green-400" value={Math.random() * 100} />
            <Indicator label="Average" color="bg-yellow-400" value={Math.random() * 100} />
            <Indicator label="Poor" color="bg-red-400" value={Math.random() * 100} />
        </div>
    </div>
);

// Indicator for health status with dynamic width
const Indicator = ({ label, color, value }) => (
    <div className="w-full">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="relative h-2 rounded-full overflow-hidden bg-gray-300">
            <div
                className={`${color} h-full`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{Math.round(value)}%</p>
    </div>
);

// formatAnswersToText function (use your existing function)
const formatAnswersToText = async (answers, goalQuestions) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Convert these yes/no answers into descriptive statements: ${answers
                                    .map(
                                        (answer, index) =>
                                            `Q: ${goalQuestions[index]}, A: ${answer || "Not Answered"}`
                                    )
                                    .join(" | ")}`
                            }
                        ]
                    }
                ]
            }
        );
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error formatting answers:", error);
        return "Error generating insights.";
    }
};

export default HealthInsight;
