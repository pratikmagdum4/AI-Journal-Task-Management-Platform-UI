import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';
import { toast } from 'react-toastify';
import Loader2 from './Loading2';

const AddEntryForm = () => {
    const [entryContent, setEntryContent] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const userId = useSelector(selectCurrentUid);

    const handleAddEntry = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader on form submission
        const newEntry = {
            userId,
            content: entryContent,
            date: new Date().toISOString().split('T')[0],
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/journal/add-entry`, newEntry);
            console.log(response.data);
            alert('Entry added successfully!');
            setEntryContent('');
            toast.success("Entry added successfully");
        } catch (error) {
            console.error(error);
            toast.error("Error adding entry. Please try again.");
        } finally {
            setLoading(false); // Hide loader after the operation completes
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleAddEntry} className="p-4 border rounded-lg bg-gray-100 shadow-lg relative">
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

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                    <Loader2 />
                </div>
            )}
        </div>
    );
};

export default AddEntryForm;
