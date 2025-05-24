import React, { useState } from "react";
import {
    MdDashboard,
    MdOutlineAddTask,
    MdOutlinePendingActions,
    MdSettings,
    MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { RiTaskLine } from "react-icons/ri";
import { GiProgression } from "react-icons/gi";
import { BsClipboardCheck } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineViewGrid } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { SlNotebook } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import "./Sidebar.css";
import sidebar from "../assets/images/sidebar.jpg";


const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const path = location.pathname.split("/")[1];

    // Dropdown states
    const [panelDropdown, setPanelDropdown] = useState(false);
    const [taskDropdown, setTaskDropdown] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    const closeSidebar = () => {
        dispatch(setOpenSidebar(false));
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 p-5 sideMain">
            {/* Sidebar Header */}
            <h1 className="flex gap-1 items-center">
                <p className="bg-blue-600 p-2 rounded-full">
                    <MdOutlineAddTask className="text-white text-2xl font-black" />
                </p>
                <span className="text-2xl font-bold text-black text-white">Smart-Task</span>
            </h1>

            {/* Sidebar Links */}
            <div className="flex-1 flex flex-col gap-y-3 py-4">
                {/* Panel Dropdown */}
                <div className="flex flex-col">
                    <button
                        onClick={() => setPanelDropdown(!panelDropdown)}
                        className="w-full flex gap-2 px-3 py-2 rounded-md items-center text-gray-800 text-base hover:bg-[#2564ed2d]"
                    >
                        <HiOutlineViewGrid className="text-white"/>
                        <span className="hover:text-[#2564ed] text-white sideHeadings">Panel</span>
                    </button>
                    {panelDropdown && (
                        <div className="ml-6 flex flex-col gap-2">
                            <Link
                                to="dashboard"
                                onClick={closeSidebar}
                                className={clsx(
                                    "flex items-center gap-2 text-white hover:text-blue-500",
                                    path === "dashboard" ? "text-blue-600 font-semibold" : ""
                                )}
                            >
                                <MdDashboard className="text-white" /> Dashboard
                            </Link>

                            <Link to="/overview" className="flex items-center gap-2 text-white hover:text-blue-500">
                            <SlNotebook  className="text-white"/>Overview
                            </Link>

                            <Link to="calender" className="flex items-center gap-2 text-white hover:text-blue-500">
                            <SlCalender className="text-white"/>Calender
                            </Link>

                        </div>
                    )}
                </div>
                <hr id="sidehr"/>

                {/* Tasks Dropdown */}
                <div className="flex flex-col">
                    <button
                        onClick={() => setTaskDropdown(!taskDropdown)}
                        className="w-full flex gap-2 px-3 py-2 rounded-md items-center text-gray-800 text-base hover:bg-[#2564ed2d]"
                    >
                        
                        <FaTasks className="text-white" />
                        <span className="hover:text-[#2564ed] text-white sideHeadings">Tasks</span>
                    </button>
                    {taskDropdown && (
                        <div className="ml-6 flex flex-col gap-2">
                            <Link to="tasks" className="flex items-center gap-2 text-white hover:text-blue-500">
                                <RiTaskLine className="text-white" /> Assigned Task
                            </Link>
                            <Link to="completed/completed" className="flex items-center gap-2 text-white hover:text-blue-500">
                                <MdTaskAlt className="text-white"/> Completed
                            </Link>
                            <Link to="in-progress/in progress" className="flex items-center gap-2 text-white hover:text-blue-500">
                                <GiProgression /> In Progress
                            </Link>
                            <Link to="todo/todo" className="flex items-center gap-2 text-white hover:text-blue-500">
                                <BsClipboardCheck className="text-white"/> To Do
                            </Link>
                        </div>
                    )}
                </div>
                <hr id="sidehr"/>


                {/* Users Dropdown */}
                <div className="flex flex-col">
                    <button
                        onClick={() => setUserDropdown(!userDropdown)}
                        className="w-full flex gap-2 px-3 py-2 rounded-md items-center text-gray-800 text-base hover:bg-[#2564ed2d]"
                    >
                        <FaUsers className="text-white" />
                        <span className="hover:text-[#2564ed] text-white sideHeadings">Users</span>
                    </button>
                    {userDropdown && (
                        <div className="ml-6 flex flex-col gap-2">
                            <Link to="studentdetail" className="flex items-center gap-2 text-white hover:text-blue-500">
                                <AiOutlineUser className="text-white"/> Student-Details
                            </Link>

                            <Link to="attendencedetail" className="flex items-center gap-2 text-white hover:text-blue-500">
                                <AiOutlineUser className="text-white"/> Attendence
                            </Link>
                            {user?.isAdmin && (
                                <>
                                <Link to="trashed" className="flex items-center gap-2 text-white hover:text-blue-500">
                                    <FaTrashAlt className="text-white"/> Trash
                                </Link>

                                <Link to="team" className="flex items-center gap-2 text-white hover:text-blue-500">
                                    <FaTrashAlt className="text-white"/> Student List
                                </Link>

                                </>

                                
                                
                            )}
                        </div>
                    )}
                </div>
                <hr id="sidehr"/>

            </div>
        </div>
    );
};

export default Sidebar;
