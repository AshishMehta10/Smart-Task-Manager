import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./AttendenceDetail.css"; // ✅ Import stylish CSS

const AttendanceDetail = () => {
    const [attendance, setAttendance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/user/attendance", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setAttendance(data); // ✅ Store the attendance data properly
            } catch (err) {
                console.error("Error fetching attendance:", err.message);
                setError("Failed to fetch attendance details.");
            }
        };

        fetchAttendance();
    }, []);

    if (error) return <p className="error">{error}</p>;
    if (!attendance) return <p className="loading">Loading attendance details...</p>;

    const data = [
        { name: "Attended Classes", value: attendance.attendedClasses },
        { name: "Remaining Classes", value: 200 - attendance.attendedClasses }, // Assuming 200 total classes
    ];

    const COLORS = ["#4CAF50", "#FF6B6B"]; // Green for attended, red for remaining

    return (
        <div className="attendance-container">
            <div className="attendence-card">
                <h2 className="attendence-title">📊 ATTENDENCE OVERVIEW</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                innerRadius={60} // ✅ Donut-style effect
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <>
                                    <Cell fill="#00FF7F" className="transition-all duration-300 hover:scale-110" />
                                    <Cell fill="#FF4500" className="transition-all duration-300 hover:scale-110" /></>
                                ))}
                            </Pie>
                            <Tooltip  wrapperStyle={{ backgroundColor: "#222", color: "#fff", borderRadius: "8px", padding: "10px" }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="attendance-percentage">
                    ✅ <strong>Attendance Percentage:</strong> {attendance.attendancePercentage}%
                </p>
            </div>
        </div>
    );
};

export default AttendanceDetail;
