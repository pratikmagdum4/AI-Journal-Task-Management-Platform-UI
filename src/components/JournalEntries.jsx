import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import CSS for calendar styling

const JournalEntries = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        // Mock function to simulate fetching journal entries by date
        const fetchEntriesForDate = (date) => {
            const allEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
            const formattedDate = date.toISOString().split('T')[0]; // Format date to yyyy-mm-dd
            return allEntries.filter(entry => entry.date === formattedDate);
        };

        const entriesForSelectedDate = fetchEntriesForDate(selectedDate);
        setEntries(entriesForSelectedDate);
    }, [selectedDate]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Select a Date to View Entries</h2>
            <Calendar onChange={handleDateChange} value={selectedDate} />

            <div className="mt-6">
                {entries.length > 0 ? (
                    <div>
                        <h3 className="text-lg font-medium">Entries for {selectedDate.toDateString()}:</h3>
                        {entries.map((entry, index) => (
                            <div key={index} className="border rounded-lg p-4 mb-4 bg-white shadow">
                                <p>{entry.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No entries found for this date.</p>
                )}
            </div>
        </div>
    );
};

export default JournalEntries;
