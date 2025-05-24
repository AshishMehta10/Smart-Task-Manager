import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaUserGraduate, FaTasks, FaCheckCircle, FaSpinner, FaList, FaIdCard, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";

function Dashboard() {
  const [attendance, setAttendance] = useState(null);
  const [student, setStudent] = useState(null);
  const [date, setDate] = useState(new Date());
  const { data } = useGetDashboardStatsQuery();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user/attendance", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        setAttendance(data);
      } catch (err) {
        console.error("❌ Error fetching attendance:", err.message);
        setAttendance(null);
      }
    };

    const fetchStudentDetail = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user/student-detail", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch student details");
        }

        const data = await response.json();
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student details:", err);
      }
    };

    fetchAttendance();
    fetchStudentDetail();
  }, []);

  const taskStats = [
    { label: "Total Tasks", total: data?.totalTasks || 0, bg: "bg-cyan-500", icon: <FaTasks /> },
    { label: "Completed", total: data?.tasks?.completed || 0, bg: "bg-green-600", icon: <FaCheckCircle /> },
    { label: "In Progress", total: data?.tasks?.["in progress"] || 0, bg: "bg-orange-500", icon: <FaSpinner /> },
    { label: "To-Do", total: data?.tasks?.todo || 0, bg: "bg-pink-700", icon: <FaList /> },
  ];

  return (
    <div className="min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6"style={{

        fontSize: "50px",
        fontWeight: "800",
        fontFamily: "Poppins",
        marginBottom: "50px",
        color: "white",
        textShadow: "0 0 8px  rgba(217, 179, 90, 0.933)",
      }}>DASHBOARD</h1>

      {/* Student Details & Attendance Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Student ID Card */}

        <Link to="/studentdetail" className="relative w-full bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center text-center transform transition duration-500 hover:scale-105 hover:bg-gray-700">
          <div className="absolute top-0 left-0 w-full h-16 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-xl rounded-t-2xl backdrop-blur-lg">Student ID</div>
          <div className="mt-16 flex flex-col items-center">
            <FaIdCard className="text-6xl text-blue-400 mb-3 animate-bounce" />
            {student ? (
              <>
                <p className="text-2xl font-bold tracking-wide text-white">{student.name}</p>
                <p className="text-gray-300 flex items-center justify-center mt-1"><FaUserTag className="mr-2" /> {student.role}</p>
                <p className="text-gray-400 flex items-center justify-center mt-1"><FaEnvelope className="mr-2" /> {student.email}</p>
              </>
            ) : (
              <p className="text-gray-500 animate-pulse">Loading student details...</p>
            )}
          </div>
        </Link>

        {/* Attendance Section */}
        {attendance ? (
                   <Link to="/attendencedetail" className="relative w-full bg-gradient-to-r from-indigo-900 to-purple-900 p-8 rounded-3xl shadow-2xl border border-purple-500 flex flex-col items-center transition-transform duration-500 hover:scale-110 hover:shadow-purple-500/50 group">
                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">Attendance Overview</div>
                   <ResponsiveContainer width={200} height={200}>
                     <PieChart>
                       <Pie data={[{ name: "Attended", value: attendance.attendedClasses }, { name: "Missed", value: 200 - attendance.attendedClasses }]} dataKey="value" outerRadius={80} innerRadius={10} stroke="none" fill="#1e1e2f">
                         <Cell fill="#00FF7F"  />
                         <Cell fill="#FF4500" />
                       </Pie>
                       <Tooltip  />
                     </PieChart>
                   </ResponsiveContainer>
                   <p className="mt-4 text-xl font-bold text-white drop-shadow-lg animate-fade-in">{attendance.attendancePercentage}% Attendance</p>
                 </Link>
        ) : (
          <p className="text-center text-gray-600 text-lg">No attendance data available.</p>
        )}
      </div>

      <Link
      to="/overview"
      className="mt-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black w-full max-w-5xl p-8 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-lg hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300"
    >
      <h2 className="text-2xl font-extrabold text-white mb-6 text-center tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        Task Overview
      </h2>
      <table className="w-full text-center text-white border-separate border-spacing-3">
        <thead className="bg-gradient-to-r from-purple-700 to-blue-600 text-white shadow-lg rounded-xl">
          <tr className="text-lg">
            <th className="p-5 rounded-lg">Task Type</th>
            <th className="p-5 rounded-lg">Total</th>
          </tr>
        </thead>
        <tbody>
          {taskStats.map(({ label, total, bg }, index) => (
            <tr
              key={index}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-25 hover:backdrop-blur-md hover:border-purple-400 border border-gray-700"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <td className="p-5 text-lg font-semibold bg-gray-900 rounded-lg shadow-md hover:text-purple-400">
                {label}
              </td>
              <td
                className={`p-5 text-lg font-bold rounded-lg shadow-md ${bg} text-white border-2 border-gray-800 hover:border-purple-500`}
              >
                {total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Link>

      {/* Calendar Section */}
      <Link to="/calender" className="mt-6 bg-gradient-to-br from-gray-900 via-black to-gray-950 w-full max-w-5xl p-8 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-lg hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300">
      <h2 className="text-2xl font-extrabold text-white mb-6 text-center tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        Task History Calendar
      </h2>
      <div className="flex justify-center p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <Calendar
          onChange={setDate}
          value={date}
          className="react-calendar border-none w-full max-w-md p-4 text-lg text-white bg-gray-900 rounded-xl shadow-md transition-all duration-300 hover:shadow-purple-500/50"
          tileClassName={({ date, view }) =>
            view === "month" ? "p-2 rounded-lg text-white hover:bg-purple-600 transition-all duration-200" : null
          }
        />
    </div>
    </Link>

    </div>
  );
}

export default Dashboard;
