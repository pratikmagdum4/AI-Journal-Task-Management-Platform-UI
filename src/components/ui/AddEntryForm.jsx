import React, { useId, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';

const AddEntryForm = () => {
    const [entryContent, setEntryContent] = useState('');
    // const userId = '6710039be1ee72e4ab1e6965'; // You can retrieve this from authentication logic
    const dispatch = useDispatch();
    const userId = useSelector(selectCurrentUid)
    console.log("The id is ", userId)
    const handleAddEntry = async (e) => {
        e.preventDefault();

        const newEntry = {
            userId, // Make sure to pass the userId for the entry
            content: entryContent,
            date: new Date().toISOString().split('T')[0], // Store the entry with the current date
        };

        try {
            // Ensure the API endpoint is correct (adjust host and port if needed)
            const response = await axios.post(`${BASE_URL}/api/journal/add-entry`, newEntry);
            console.log(response.data); // Handle successful response from the server
            alert('Entry added successfully!'); // Optional success message
            setEntryContent(''); // Clear the input field
        } catch (error) {
            console.error(error); // Handle errors from the server
            alert('Error adding entry. Please try again.');
        }
    };

    return (
        <form onSubmit={handleAddEntry} className="p-4 border rounded-lg bg-gray-100 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
            <textarea
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full h-32 p-2 border rounded"
                required
            />
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Entry
            </button>
        </form>
    );
};

export default AddEntryForm;
