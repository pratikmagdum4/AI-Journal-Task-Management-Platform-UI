// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';

// const GoalProgressChart = ({ goalId }) => {
//     const [chartData, setChartData] = useState(null);

//     // Sample data with correct structure
//     const sampleData = {
//         labels: ['2023-11-01', '2023-11-02', '2023-11-03', '2023-11-04', '2023-11-05', '2023-11-06'],
//         datasets: [
//             {
//                 label: 'Progress Over Time',
//                 data: [20, 35, 50, 65, 80, 100],
//                 fill: false,
//                 backgroundColor: 'rgba(75,192,192,1)',
//                 borderColor: 'rgba(75,192,192,1)',
//             },
//         ],
//     };

//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
//     //             const response = await axios.get(`/api/goals/${goalId}/progress`);
//     //             const dates = response.data.map(entry => entry.date);
//     //             const progressValues = response.data.map(entry => entry.progress);

//     //             setChartData({
//     //                 labels: dates,
//     //                 datasets: [
//     //                     {
//     //                         label: 'Progress Over Time',
//     //                         data: progressValues,
//     //                         fill: false,
//     //                         backgroundColor: 'rgba(75,192,192,1)',
//     //                         borderColor: 'rgba(75,192,192,1)',
//     //                     },
//     //                 ],
//     //             });
//     //         } catch (error) {
//     //             console.error('Error fetching progress data:', error);
//     //         }
//     //     };

//     //     fetchData();
//     // }, [goalId]);

//     return (
//         <div className="mb-4 bg-gray-100 rounded-lg shadow-md p-4">
//             <h3 className="text-xl font-medium mb-2">Progress Chart</h3>
//             {sampleData ? <Line data={sampleData} /> : <p>Loading...</p>}
//         </div>
//     );
// };

// export default GoalProgressChart;
