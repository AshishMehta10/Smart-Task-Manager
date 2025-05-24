import React, { useState } from "react"
import Title from "../components/Title"
import Button from "../components/Button"
import { IoMdAdd } from "react-icons/io"
import { summary } from "../assets/data"
import { getInitials } from "../utils"
import clsx from "clsx"
import ConfirmatioDialog, { UserAction } from "../components/Dialogs"
import AddUser from "../components/AddUser"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect } from "react"

import {
    useDeleteUserMutation,
    useGetTeamListQuery,
    useUserActionMutation,
    useUpdateAttendanceMutation
} from "../redux/slices/api/userApiSlice"
import { toast } from "sonner"
import "./user.css"
const Users = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [open, setOpen] = useState(false)
    const [openAction, setOpenAction] = useState(false)
    const [selected, setSelected] = useState(null)

    const { data, isLoading, refetch } = useGetTeamListQuery()
    const [deleteUser] = useDeleteUserMutation()
    const [userAction] = useUserActionMutation()
    const [attendanceData, setAttendanceData] = useState({});
    const [updateAttendance] = useUpdateAttendanceMutation(); // New mutation hook


    useEffect(() => {
        if (data) {
            const attendanceMap = data.reduce((acc, user) => {
                acc[user._id] = user.attendance?.attendedClasses || 0;
                return acc;
            }, {});
            setAttendanceData(attendanceMap);
        }
    }, [data]);

    const userActionHandler = async () => {
        try {
            const result = await userAction({
                isActive: !selected?.isActive,
                id: selected?._id,
            })

            refetch()
            toast.success(result.data.message)

            setSelected(null)
            setTimeout(() => {
                setOpenAction(false)
            }, 500)
        } catch (err) {
            console.log(err)
            toast.error(err?.data?.message || err.message)
        }
    }
    const deleteHandler = async () => {
        try {
            const result = await deleteUser(selected)

            refetch()
            toast.success("Deleted user successfully.")
            setSelected(null)

            setTimeout(() => {
                setOpenDialog(false)
            }, 500)
        } catch (err) {
            console.log(err)
            toast.error(err?.data?.message || err.message)
        }
    }

    const deleteClick = (id) => {
        setSelected(id)
        setOpenDialog(true)
    }

    const editClick = (el) => {
        setSelected(el)
        setOpen(true)
    }

    const userStatusClick = (el) => {
        setSelected(el)
        setOpenAction(true)
    }


    const handleAttendanceChange = (userId, value) => {
        if (value > 200) {
            value = 200;
        } else if (value < 0) {
            value = 0;
        }
        setAttendanceData((prev) => ({ ...prev, [userId]: value }));
    };

   
    const renderAttendanceChart = (userId) => {
        const user = data?.find((user) => user._id === userId);
        const attendancePercentage = user?.attendance?.attendancePercentage || 0;

        const attended = (attendancePercentage / 100) * 200;
        const missed = 200 - attended;

        const chartData = [
            { name: "Attended", value: attended, color: "#4CAF50" },
            { name: "Missed", value: missed, color: "#F44336" },
        ];

        return (
            <ResponsiveContainer width={180} height={180}>
                <PieChart>
                    <Pie data={chartData} dataKey="value" outerRadius={50}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const calculateAttendancePercentage = (userId) => {
        const user = data.find((user) => user._id === userId);
        return user?.attendance?.attendancePercentage || "0%";
    };

    const handleUpdateAttendance = async (userId) => {
        const attendedClasses = attendanceData[userId] || 0;
        console.log("Updating attendance for user ID:", userId, "Attended classes:", attendedClasses);
        try {
            const result = await updateAttendance({ userId, attendedClasses });
            if (result.data) {
                toast.success(result.data.message);
                refetch();
            } else {
                toast.error("Error updating attendance");
            }
        } catch (err) {
            console.log("Error:", err);
            toast.error("Error updating attendance");
        }
    };

    const TableHeader = () => (
        <thead className="border-b border-gray-700 bg-gray-900 text-white" id="tableheader">
            <tr className="text-left text-lg">
                <th className="pl-6 py-3">Full Name</th>
                <th className="pl-5 py-3">Title</th>
                <th className="pl-9 py-3">Email</th>
                <th className="pl-4 py-3">Role</th>
                <th className="pl-8 py-3">Active</th>
                <th className="pl-5 py-3">Classes Attended</th>
                <th className="pl-10 py-3">Attendance Chart</th>
                <th className="pl-8 py-3">Attendance %</th>

            </tr>
        </thead>
    );
    
    const TableRow = ({ user }) => (
        <tr className="border-b border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700/80 transition-all" id="columnID">
            <td className="p-3 flex items-center gap-3">
                <div className="mt-14 w-10 h-10 rounded-full flex items-center justify-center text-sm bg-blue-600 shadow-lg">
                    <span className="text-xs md:text-sm text-white text-center">
                        {getInitials(user.name)}
                    </span>
                </div>
                <span className="mt-14 font-semibold">{user.name}</span>
            </td>
            <td className="p-4">{user.title}</td>
            <td className="p-4">{user.email || "user.email.com"}</td>
            <td className="p-4">{user.role}</td>
            <td className="p-6">
                <button
                    onClick={() => userStatusClick(user)}
                    className={`px-4 py-1 rounded-full font-semibold shadow-md transition-all duration-300 ${
                        user?.isActive ? "bg-green-500 text-white hover:bg-green-400" : "bg-red-600 text-white hover:bg-red-500"
                    }`}
                    id="statusbtn"
                >
                    {user?.isActive ? "Active" : "Disabled"}
                </button>
            </td>
            <td className="p-8">
                <input
                    type="number"
                    min="0"
                    max="200"
                    value={attendanceData[user._id] || ""}
                    onChange={(e) => handleAttendanceChange(user._id, parseInt(e.target.value) || 0)}
                    className="border p-2 rounded w-24 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
                    id="attendanceID"
                    placeholder="Enter classes"
                />
            </td>
            <td>{renderAttendanceChart(user._id)}</td>
            <td className="p-12 text-lg font-bold text-green-400">{calculateAttendancePercentage(user._id)}%</td>
            <td className="p-8 flex gap-4" id="btnContainers">
                <Button
                    className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all"
                    label="Edit"
                    type="button"
                    onClick={() => editClick(user)}
                />
                <Button
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all"
                    label="Delete"
                    type="button"
                    onClick={() => deleteClick(user?._id)}
                />
                <Button
                    className="px-6 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-semibold transition-all"
                    label="Update"
                    type="button"
                    onClick={() => handleUpdateAttendance(user._id)}
                />
            </td>
        </tr>
    );
    
    return (
        <>
            <div className="w-full md:px-1 px-0 mb-6">
                <div className="bg-gray-900 px-4 py-4 shadow-lg rounded-lg border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full mb-5 text-white">
                            <TableHeader />
                            <tbody>
                                {data?.map((user, index) => (
                                    <TableRow key={index} user={user} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <AddUser open={open} setOpen={setOpen} userData={selected} key={new Date().getTime().toString()} />
            <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />
            <UserAction open={openAction} setOpen={setOpenAction} onClick={userActionHandler} />
        </>
    );
    
}

export default Users
