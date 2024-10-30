import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const GoalMilestoneTracker = ({ goalId }) => {
    const [streak, setStreak] = useState(0);
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const response = await axios.get(`/api/goals/${goalId}/milestones`);
                setMilestones(response.data.milestones);
                setStreak(response.data.streak);
            } catch (error) {
                console.error('Error fetching milestones:', error);
            }
        };

        fetchMilestones();
    }, [goalId]);
    const sampleMilestones = [
        {
            date: "2023-11-15",
            description: "Complete the initial project setup"
        },
        {
            date: "2023-12-01",
            description: "Finish the core functionality"
        },
        {
            date: "2024-01-10",
            description: "Implement the user interface"
        },
        {
            date: "2024-02-15",
            description: "Test and debug the application"
        },
        {
            date: "2024-03-01",
            description: "Deploy the application to production"
        }
    ];
    return (
        <div className="bg-gray-100 rounded-lg shadow-md p-4">
            <h3 className="text-2xl font-semibold text-green-500">Streak: {streak} days</h3>
            <ul className="list-disc pl-4">
                {sampleMilestones && sampleMilestones.map((milestone, index) => (
                    <li key={index} className="flex items-center py-2">
                        <span className="mr-2 text-gray-500 text-sm">
                            {milestone.date}
                        </span>
                        <span className="text-base font-medium">{milestone.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalMilestoneTracker;