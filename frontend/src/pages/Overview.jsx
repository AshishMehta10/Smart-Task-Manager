import clsx from "clsx"
import moment from "moment"
import React from "react"
import { FaNewspaper } from "react-icons/fa"
import { FaArrowsToDot } from "react-icons/fa6"
import { LuClipboardEdit } from "react-icons/lu"
import { useState } from "react";
import "./chat.css";
import {
    MdAdminPanelSettings,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md"
import { Chart } from "../components/Chart"
import Loading from "../components/Loader"
import UserInfo from "../components/UserInfo"
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice"
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils"
import { FaCommentDots, FaTimes } from "react-icons/fa"; // Icons for chatbot toggle


const TaskTable = ({ tasks }) => {
    const ICONS = {
        high: <MdKeyboardDoubleArrowUp className="text-red-500" />, 
        medium: <MdKeyboardArrowUp className="text-yellow-400" />, 
        low: <MdKeyboardArrowDown className="text-green-400" />,
    };

    const TableHeader = () => (
        <thead className="border-b border-gray-700 text-gray-300 text-lg uppercase tracking-wide">
            <tr className="text-left">
                <th className="py-3 px-6">Task Title</th>
                <th className="py-3 px-6">Priority</th>
                <th className="py-3 px-6">Team</th>
                <th className="py-3 px-6 hidden md:table-cell">Created At</th>
            </tr>
        </thead>
    );

    const TableRow = ({ task }) => (
        <tr className="border-b border-gray-700 text-gray-400 hover:bg-gray-800/50 transition duration-300 transform hover:scale-[1.02]">
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
                    <p className="text-base text-gray-200 font-medium">{task.title}</p>
                </div>
            </td>

            <td className="py-4 px-6">
                <div className="flex items-center gap-2 text-lg">
                    {ICONS[task.priority]}
                    <span className="capitalize font-semibold text-gray-300">{task.priority}</span>
                </div>
            </td>

            <td className="py-4 px-6">
                <div className="flex">
                    {task.team.map((m, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white -mr-1 border-2 border-gray-900 shadow-md", 
                                BGS[index % BGS.length]
                            )}
                        >
                            <UserInfo user={m} />
                        </div>
                    ))}
                </div>
            </td>

            <td className="py-4 px-6 hidden md:table-cell">
                <span className="text-sm text-gray-400">{moment(task?.date).fromNow()}</span>
            </td>
        </tr>
    );

    return (
        <div className="flex justify-center items-center p-8">
            <div className="w-full md:w-4/4 bg-gray-900 shadow-2xl rounded-2xl p-8 transform transition hover:scale-[1.01] border border-gray-800">
                <table className="w-full text-gray-300 rounded-lg overflow-hidden">
                    <TableHeader />
                    <tbody>
                        {tasks?.map((task, id) => (
                            <TableRow key={id} task={task} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

   
function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
  
    const toggleChatbot = () => {
      setIsOpen(!isOpen);
    };
  
    const sendMessage = async () => {
      if (!userInput.trim()) return;
  
      const newMessages = [...messages, { role: "user", text: userInput }];
      setMessages(newMessages);
      setUserInput("");
      setLoading(true);
  
      try {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInput }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setMessages([...newMessages, { role: "bot", text: data.response }]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages([...newMessages, { role: "bot", text: "Error fetching response. Please try again." }]);
      }
  
      setLoading(false);
    };
  
    return (
      <>
        {/* Chatbot Toggle Button */}
        <button
          onClick={toggleChatbot}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={20} />}
        </button>
  
        {/* Chatbot Container */}
        <div
        id="chatbotcontainer"
          className={`relative bottom-18 right-4 w-80 shadow-lg border rounded-lg p-4 transition-transform ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
          }`}
        >
          <h1 id="chathead" className="text-center">CHATBOT</h1>
          <div className="h-80 overflow-y-auto border-b p-2">
            {messages.map((msg, index) => (
              <div
              id="chatmsg"
                key={index}
                className={`p-2 my-1 rounded-lg ${
                  msg.role === "user" ? "bg-blue-200 text-right text-purple-900 font-bold" : "bg-gray-200 text-black font-bold"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-500">Chatbot is typing...</div>}
          </div>
          <div className="flex mt-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow p-2 border rounded-l-lg focus:outline-none text-black font-bold"
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </>
    );
  }
  

const Overview = () => {
    const { data, isLoading } = useGetDashboardStatsQuery()

    if (isLoading) {
        return (
            <div className="py-10">
                <Loading />
            </div>
        )
    }

    const totals = data?.tasks || {}// Ensures it does not throw an error

    const stats = [
        {
            _id: "1",
            label: "TOTAL TASK",
            total: data?.totalTasks || 0,
            icon: <FaNewspaper />,
            bg: "bg-cyan-500",
        },
        {
            _id: "2",
            label: "COMPLETED TASK",
            total: totals["completed"] || 0,
            icon: <MdAdminPanelSettings />,
            bg: "bg-green-600",
        },
        {
            _id: "3",
            label: "TASK IN PROGRESS",
            total: totals["in progress"] || 0,
            icon: <LuClipboardEdit />,
            bg: "bg-orange-500",
        },
        {
            _id: "4",
            label: "TODOS",
            total: totals["todo"] || 0,
            icon: <FaArrowsToDot />,
            bg: "bg-pink-700",
        },
    ]
    
    const Card = ({ label, count, bg, icon }) => {
        return (
            <div className={clsx("w-full h-32 p-5 shadow-md rounded-md flex items-center justify-between text-white", bg)}>
                <div className="h-full flex flex-1 flex-col justify-between">
                    <p className="text-base">{label}</p>
                    <span className="text-2xl font-semibold">{count}</span>
                    <span className="text-sm text-gray-200">
                        {"110 last month"}
                    </span>
                </div>
    
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black">
                    {icon}
                </div>
            </div>
        )
    }
    
    return (
        <div className="h-full py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {stats.map(({ icon, bg, label, total }, index) => (
                    <Card
                        key={index}
                        icon={icon}
                        bg={bg}
                        label={label}
                        count={total}
                    />
                ))}
            </div>

            <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
                <h4 className="text-xl text-gray-600 font-semibold">
                    Chart by Priority
                </h4>
                <Chart data={data?.graphData} />
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
  {/* Left - Task Table */}
  <div className="md:flex-grow-0 md:w-5/6">
    <TaskTable tasks={data?.last10Task} />
  </div>

  {/* Right - Chatbot */}
  <div className="md:w-1/5">
    <Chatbot />
  </div>
</div>


        </div>
    )
}

export default Overview;
