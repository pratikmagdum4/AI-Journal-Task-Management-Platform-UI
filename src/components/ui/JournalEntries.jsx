import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../../pages/Navbar/Navbar';
import { BASE_URL } from '../../api';
import { useSelector } from 'react-redux';
import { selectCurrentUid } from '../../redux/authSlice';

const JournalEntriesByDate = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gotdate, setgotdate] = useState('')
    const id = useSelector(selectCurrentUid)
    const fetchEntriesByDate = async (date) => {
        setLoading(true);
        try {
            // Extract year, month, and day manually to avoid timezone issues
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
            const day = String(date.getDate()).padStart(2, '0');

            // Format the date as YYYY-MM-DD
            const formattedDate = `${year}-${month}-${day}`;
            setgotdate(formattedDate)
            console.log("The formatted date is", formattedDate);
            const response = await axios.get(`${BASE_URL}/api/journal/get-entry`, {
                params: { date: formattedDate, userId: id },
            });
            console.log(response);
            console.log("Response data is", response.data);
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            alert('Error fetching entries. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    // Fetch entries whenever the date changes
    useEffect(() => {
        fetchEntriesByDate(selectedDate);
    }, [selectedDate]);

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
                                <li key={index} className="mb-2">
                                    <p>{entry.content}</p>
                                    <small className="text-gray-500">{entry.date}</small>
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
