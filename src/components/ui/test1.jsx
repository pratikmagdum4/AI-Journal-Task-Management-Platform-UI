import React from 'react';
import ReminderNotification from './ReminderNotification';
import { ToastContainer } from 'react-toastify';

const Test1 = () => {
    return (
        <div className="app">
            <h1>Reminder Notification Test</h1>
            <p>Click the button to initialize the reminder notification component.</p>
            {/* Render the ReminderNotification component */}
            <ReminderNotification />
            {/* ToastContainer is required for notifications to display */}
            <ToastContainer />
        </div>
    );
};

export default Test1;
