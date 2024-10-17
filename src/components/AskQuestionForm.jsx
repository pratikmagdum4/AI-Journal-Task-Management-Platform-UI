import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AskQuestionForm = () => {
    const [question, setQuestion] = useState('');
    const [entries, setEntries] = useState([]);
    const [answer, setAnswer] = useState('');
    const [generatingAnswer, setGeneratingAnswer] = useState('');
    const id = "6710039be1ee72e4ab1e6965";

    const formatEntriesForAPI = () => {
        return entries.map((entry, index) => {
            return `Entry ${index + 1}: ${entry.content} (Timestamp: ${new Date(entry.date).toLocaleString()})`;
        }).join("\n\n");
    };


    async function generateAnswer(e) 
    {
        console.log("The entries are here ", entries)
        setGeneratingAnswer(true);
        e.preventDefault();
        const formattedEntries = formatEntriesForAPI();

        setAnswer("Loading your answer... \n It might take upto 10 seconds");
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
                    }`,
                method: "post",
                data: {
                    contents: [{ parts: [{ text: "Following is my question ,give me answer based on following entries which are provided with there timestamp" + question + formattedEntries }] }],
                },
            });

            setAnswer(
                response["data"]["candidates"][0]["content"]["parts"][0]["text"]
            );
        } catch (error) {
            console.log(error);
            setAnswer("Sorry - Something went wrong. Please try again!");
        }

        setGeneratingAnswer(false);
    }

    // Fetch all entries when the component loads
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/journal/get-all-entries/${id}`); // Fetch all user entries
                console.log("The data i got is",response.data)
                setEntries(response.data); // Store entries in the state
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };
        console.log("The entries are", entries)
        fetchEntries();
        
    }, []);

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/ask-question', {
                question,
                entries, // Sending the question and all previous entries to the server
            });
            setAnswer(response.data.answer); // Store the API answer in state
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };

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
                >
                    Ask Question
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
