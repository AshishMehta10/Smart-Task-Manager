import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { FaTasks, FaCheckCircle, FaSpinner, FaList } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import "./Calender.css";

function Calender() {
  const [value, onChange] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);
  const { data } = useGetDashboardStatsQuery();

  useEffect(() => {
    console.log("API Data:", data);
  }, [data]);

  const totals = data?.tasks || {};
  const taskDates = data?.last10Task?.map((task) => ({ date: task.createdAt, title: task.title })) || [];

  const stats = [
    { label: "Total Tasks", total: data?.totalTasks || 0, bg: "bg-cyan-500", icon: <FaTasks /> },
    { label: "Completed", total: totals["completed"] || 0, bg: "bg-green-600", icon: <FaCheckCircle /> },
    { label: "In Progress", total: totals["in progress"] || 0, bg: "bg-orange-500", icon: <FaSpinner /> },
    { label: "To-Do", total: totals["todo"] || 0, bg: "bg-pink-700", icon: <FaList /> },
  ];

  const isSameDate = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const tileContent = ({ date }) => {
    const tasksForDate = taskDates.filter((task) => isSameDate(new Date(task.date), date));
    if (tasksForDate.length > 0) {
      return (
        <Tooltip title={tasksForDate.map((task) => task.title).join(", ")} arrow>
          <div className="task-marker bg-purple-500 rounded-full w-3 h-3 mx-auto mt-1 animate-pulse"></div>
        </Tooltip>
      );
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    return taskDates.some((task) => isSameDate(new Date(task.date), date))
      ? "bg-purple-700 text-white hover:bg-purple-800 rounded-lg cursor-pointer p-2"
      : "p-4 hover:bg-gray-800 rounded-lg text-gray-300";
  };

  const handleDateClick = (date) => {
    const tasksOnDate = taskDates.filter((task) => isSameDate(new Date(task.date), date));
    setSelectedTasks(tasksOnDate);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white"
   id="calender-div"
    >
      <div className="flex gap-8 max-w-6xl w-full">
        <div className="w-1/3 bg-gray-950 p-6 rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
            Task Calendar
          </h2>
          <Calendar
            onChange={(date) => {
              onChange(date);
              handleDateClick(date);
            }}
            value={value}
            className="calender-container react-calendar border-none w-full text-lg bg-gray-900 text-white rounded-xl shadow-lg p-4"
            tileClassName={tileClassName}
            tileContent={tileContent}
          />
        </div>
        <div className="w-2/3 bg-gray-950 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {stats.map(({ label, total, bg, icon }, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg text-white flex items-center justify-center space-x-4 ${bg} shadow-lg transform hover:scale-105 transition-all duration-300`}
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="text-lg font-semibold">{label}</p>
                  <p className="text-xl font-bold">{total}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedTasks.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-4">
                Tasks for {value.toDateString()}
              </h3>
              <table className="w-full border-collapse border border-gray-800 text-center">
                <thead className="bg-purple-700 text-white">
                  <tr>
                    <th className="p-3 border border-gray-800">Task Title</th>
                    <th className="p-3 border border-gray-800">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTasks.map((task, index) => (
                    <tr key={index} className="hover:bg-purple-900">
                      <td className="p-3 border border-gray-800 text-white">{task.title}</td>
                      <td className="p-3 border border-gray-800 text-gray-400">
                        {new Date(task.date).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calender;
