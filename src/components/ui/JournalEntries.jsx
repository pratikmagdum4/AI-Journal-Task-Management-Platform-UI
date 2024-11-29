import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../pages/Navbar/Navbar';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';

const JournalEntriesByDate = ({ newEntryAdded }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gotdate, setgotdate] = useState('');
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const id = useSelector(selectCurrentUid);




    // Fetch entries by date
    const fetchEntriesByDate = async (date) => {
        setLoading(true);
        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setgotdate(formattedDate);

            const response = await axios.get(`${BASE_URL}/api/journal/get-entry`, {
                params: { date: formattedDate, userId: id },
            });
            console.log("the entries are",response)
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            alert('Error fetching entries. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Delete entry function
    const handleDelete = async (entryId, date) => {
        const confirmed = window.confirm('Are you sure you want to delete this entry?');
        if (confirmed) {
            try {
                // Send request to delete the entry and update the day entry's CombinedEntry
                await axios.delete(`${BASE_URL}/api/journal/delete-entry/${entryId}/${id}/${date}`);

                // Remove the deleted entry from the list of entries
                setEntries(entries.filter(entry => entry._id !== entryId));
                alert('Entry deleted successfully');
            } catch (error) {
                console.error('Error deleting entry:', error);
                alert('Error deleting entry. Please try again.');
            }
        }
    };

    // Start editing mode for an entry
    const startEditing = (entry) => {
        setEditingEntryId(entry._id);
        setEditedContent(entry.content);
    };

    // Cancel editing mode
    const cancelEditing = () => {
        setEditingEntryId(null);
        setEditedContent('');
    };

    // Save edited entry function
    const handleSave = async (entryId) => {
        try {
            // console.log("The entries",entries)
            let currentEntry = '';
            for (const entry of entries) {
                if (entry._id === entryId) {
                    currentEntry = entry;
                    break;
                }
            }

            // console.log("The cuurent content is",currentEntry.content)
            await axios.put(`${BASE_URL}/api/journal/update-entry/${entryId}`, {
                entryId,
                userId: id,
                content: editedContent,
            });
            const date = new Date(currentEntry.date);
            const yearMonthDay = date.toISOString().split('T')[0];
            console.log("The date is ",yearMonthDay)
            let CombinedDayEntry;
             try{
                 const { date: dayEntry } = await axios.get(`${BASE_URL}/api/journal/day/day-entry/${id}/${yearMonthDay}`)
                 CombinedDayEntry = dayEntry;
                 console.log("The combined entry is",CombinedDayEntry)
             }
             catch(error)
             {
                 if (error.response?.status === 404) {
                     console.log("No entry found for this date.");
                 } else {
                     throw error;
                 }
             }
            // Update the entries list with the edited entry
            setEntries(entries.map(entry => (
                entry._id === entryId ? { ...entry, content: editedContent } : entry
            )));
            alert('Entry updated successfully');
            setEditingEntryId(null);
            setEditedContent('');
        } catch (error) {
            console.error('Error updating entry:', error);
            alert('Error updating entry. Please try again.');
        }
    };

    // Fetch entries whenever the date changes
    useEffect(() => {
        fetchEntriesByDate(selectedDate);
    }, [selectedDate, newEntryAdded]);

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Select a Date to View Entries</h2>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="p-2 border rounded mb-4"
                />
                {loading ? (
                    <p>Loading entries...</p>
                ) : entries.length === 0 ? (
                    <p>No entries found for the selected date.</p>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Entries for {gotdate}</h3>
                        <ul className="list-disc pl-5">
                            {entries.map((entry, index) => (
                                <li key={index} className="mb-2 flex items-center">
                                    {editingEntryId === entry._id ? (
                                        // Edit mode
                                        <>
                                            <input
                                                type="text"
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                                className="flex-grow p-2 border rounded"
                                            />
                                            <button
                                                onClick={() => handleSave(entry._id)}
                                                className="ml-4 text-green-500 hover:text-green-700"
                                                title="Save changes"
                                            >
                                                💾 {/* Save icon */}
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="ml-2 text-gray-500 hover:text-gray-700"
                                                title="Cancel"
                                            >
                                                ❌ {/* Cancel icon */}
                                            </button>
                                        </>
                                    ) : (
                                        // View mode
                                        <>
                                            <p className="flex-grow">{entry.content}</p>
                                            <button
                                                onClick={() => startEditing(entry)}
                                                className="ml-4 text-blue-500 hover:text-blue-700"
                                                title="Edit entry"
                                            >
                                                ✏️ {/* Pencil icon for editing */}
                                            </button>
                                                <button
                                                    onClick={() => handleDelete(entry._id, gotdate)}  // Pass gotdate here
                                                    className="ml-4 text-red-500 hover:text-red-700"
                                                    title="Delete entry"
                                                >
                                                    🗑️ {/* Trash bin icon */}
                                                </button>

                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default JournalEntriesByDate;
