import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReminderNotification = ({ currentPath }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (currentPath === '/feed') return; // Do not show notification on the feedback page

        const delay = 3000; // 5 minutes in milliseconds

        const reminderInterval = setInterval(() => {
            toast.info(
                <div className="text-center p-4 bg-teal-100 rounded-lg border border-teal-300 shadow-md">
                    <p className="text-teal-700 font-medium">Reminder:</p>
                    <p>Give us your feedback for improvement!</p>
                    <button onClick={() => navigate('/feed')}>Click Here</button>
                </div>,
                {
                    position: 'top-right',
                    autoClose: 10000,
                    hideProgressBar: true,
                    closeOnClick: true,
                }
            );
        }, delay);

        return () => clearInterval(reminderInterval);
    }, [currentPath, navigate]);

    return null;
};

export default ReminderNotification;
