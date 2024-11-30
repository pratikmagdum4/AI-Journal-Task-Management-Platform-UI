import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';

const AskQuestionForm = () => {
    const [question, setQuestion] = useState('');
    const [entries, setEntries] = useState([]);
    const [answer, setAnswer] = useState('');
    const [generatingAnswer, setGeneratingAnswer] = useState(false); // Use boolean for loading state
    const id = useSelector(selectCurrentUid)
    // Format journal entries for the API
    const formatEntriesForAPI = () => {
        return entries.map((entry, index) => {
            return `Entry ${index + 1}: ${entry.content} (Timestamp: ${new Date(entry.date).toLocaleString()})`;
        }).join("\n\n");
    };

    async function generateAnswer(e) {
        e.preventDefault();
        setGeneratingAnswer(true); // Set loading state
        const formattedEntries = formatEntriesForAPI();

        setAnswer("Loading your answer... It might take up to 10 seconds.");
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
                method: "post",
                data: {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Here is my question and relevant journal entries. Please answer based on these entries. Format the response as a JSON object with categories as keys and arrays of points as values, give  description answer for all points STRICTLY ,also change category title according to question asked here are sample categories :
                                {
                                    "Challenges_Encountered": [...],
                                    "Strategies_for_Overcoming_Challenges": [...],
                                    "Action_Planning": [...],
                                    "Additional_Tips": [...]
                                }
                                Question: ${question}

                                Journal Entries:
                                ${formattedEntries}`
                                }
                            ]
                        }
                    ]
                }
            });

            // Directly use the response if it's already a valid object
            const responseContent = response.data.candidates[0].content.parts[0].text;

            // Ensure the response is in an object format before processing
            let parsedResponse;
            try {
                parsedResponse = typeof responseContent === "string" ? JSON.parse(responseContent) : responseContent;
            } catch (parseError) {
                throw new Error("Failed to parse response as JSON");
            }

            const formattedAnswer = Object.entries(parsedResponse).map(([category, points]) => (
                <div key={category}>
                    <h4 className="font-bold">{category.replace(/_/g, " ")}</h4>
                    <ul className="list-disc ml-5">
                        {points.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
            ));

            setAnswer(formattedAnswer);
        } catch (error) {
            console.error("Error:", error);
            setAnswer("Sorry - Something went wrong. Please try again!");
        }

        setGeneratingAnswer(false); // End loading state
    }

    // Fetch all entries when the component loads
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/journal/get-all-entries/${id}`); // Fetch all user entries
                // console.log("The data I got is", response.data);
                setEntries(response.data); // Store entries in the state
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };
        fetchEntries();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Ask a Question Based on Your Entries</h2>
            <form onSubmit={generateAnswer}>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask your question..."
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4"
                    rows="3"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={generatingAnswer} // Disable the button while loading
                >
                    {generatingAnswer ? "Generating Answer..." : "Ask Question"}
                </button>
            </form>
            {answer && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold">Answer:</h3>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

export default AskQuestionForm;
