import React, { useState } from 'react';

const AddEntryForm = () => {
    const [entryContent, setEntryContent] = useState('');

    const handleAddEntry = (e) => {
        e.preventDefault();
        const currentEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        const newEntry = {
            content: entryContent,
            date: new Date().toISOString().split('T')[0], // Store the entry with the current date
        };
        localStorage.setItem('journalEntries', JSON.stringify([...currentEntries, newEntry]));
        setEntryContent('');
        alert('Journal entry added successfully!');
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
