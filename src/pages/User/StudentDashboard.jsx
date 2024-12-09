// StudentDashboard.js
import React, { useEffect, useState } from 'react';
import JournalEntriesByDate from '../../components/ui/JournalEntries';
import AddEntryForm from '../../components/ui/AddEntryForm';
import AskQuestionForm from '../../components/ui/AskQuestionForm';
import Navbar from '../Navbar/Navbar';
import GoalEntryForm from '../../components/ui/GoalEntryForm'; // Import the new Goal Entry component
import GoalAnalyzer from '../../components/ui/GoalAnalyser';
// import HealthInsight from './HealthInsight';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../redux/authSlice';
import { useSelector } from 'react-redux';
const StudentDashboard = () => {

    const navigate = useNavigate();
    const authenticated = useSelector(isAuthenticated);
    useEffect(()=>{
        if(!authenticated)
        {
            navigate('/login');
        }
    },[authenticated])

    const [newEntryAdded, setNewEntryAdded] = useState(false);
    const [newGoalAdded, setGoalEntryAdded] = useState(false);

    // Function to handle when a new entry is added
    const handleNewEntryAdded = () => {
        setNewEntryAdded((prev) => !prev); // Toggle the state to trigger refresh in JournalEntriesByDate
    };
    const handleNewGoalAdded = () => {
        setGoalEntryAdded((prev) => !prev); // Toggle the state to trigger refresh in JournalEntriesByDate
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <AddEntryForm onNewEntryAdded={handleNewEntryAdded} newGoalAdded={newGoalAdded} />
                    </div>
                    <div>
                        <JournalEntriesByDate newEntryAdded={newEntryAdded}  />
                    </div>
                </div>

                {/* Goals Section */}
                <div className="mt-12">
                    <GoalEntryForm ONnewGoalAdded={handleNewGoalAdded} /> {/* Add GoalEntryForm Component */}
                </div>

                <div className="mt-12">
                    <GoalAnalyzer newGoalAdded={newGoalAdded} />
                </div>

                {/* New Ask Question Section */}
                <div className="mt-12">
                    <AskQuestionForm />
                </div>
                <div className="mt-12">
                    {/* <HealthInsight /> */}
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;
