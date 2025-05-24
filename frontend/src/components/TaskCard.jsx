import clsx from "clsx";
import React, { useState } from "react";
import {
    MdAttachFile,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";
import "./TaskCard.css";

const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
    const { user } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="taskCard">
                <div className="flex justify-between items-center">
                    <div
                        className={clsx(
                            "priority-card flex items-center gap-2 text-sm font-medium"
                        )}
                    >
                        <span className="text-lg">{ICONS[task?.priority]}</span>
                        <span className="uppercase">{task?.priority} Priority</span>
                    </div>

                    {<TaskDialog task={task} />}
                </div>

                <div className="card-section">
                    <div className="flex items-center gap-2">
                        <div
                            className={clsx(
                                "w-4 h-4 rounded-full",
                                TASK_TYPE[task.stage]
                            )}
                        />
                        <h4 className="task-card-title line-clamp-1">{task?.title}</h4>
                    </div>
                    <span className="text-sm text-yellow-600">{formatDate(new Date(task?.date))}</span>
                </div>

                <div className="card-section flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1 items-center text-sm text-white-600">
                            <BiMessageAltDetail />
                            <span>{task?.activities?.length}</span>
                        </div>
                        <div className="flex gap-1 items-center text-sm text-white-600">
                            <MdAttachFile />
                            <span>{task?.assets?.length}</span>
                        </div>
                        <div className="flex gap-1 items-center text-sm text-white">
                            <FaList />
                            <span >0/{task?.subTasks?.length}</span>
                        </div>
                    </div>

                    <div className="flex flex-row-reverse">
                        {task?.team?.map((m, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    "user-avatar text-white flex items-center justify-center text-sm -mr-1",
                                    BGS[index % BGS?.length]
                                )}
                            >
                                <UserInfo user={m} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subtasks Section */}
                {task?.subTasks?.length > 0 ? (
                    <div className="subtask-card py-4">
                        <h5 className="text-base line-clamp-1 text-yellow-500">
                            {task?.subTasks[0].title}
                        </h5>

                        <div className="p-4 space-x-8">
                            <span className="text-sm text-white">
                                {formatDate(new Date(task?.subTasks[0]?.date))}
                            </span>
                            <span className="bg-blue-300/10 px-3 py-1 rounded-full text-blue-400 text-lg font-bold">
                                {task?.subTasks[0].tag}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="subtask-card py-4">
                        <span className="text-gray-500">No Sub Task</span>
                    </div>
                )}

                <div className="card-footer">
                    <button
                        onClick={() => setOpen(true)}
                        disabled={user.isAdmin ? false : true}
                        className="add-subtask-btn flex gap-4 items-center text-sm text-white font-bold disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                        <IoMdAdd className="text-lg" />
                        <span>ADD SUBTASK</span>
                    </button>
                </div>
            </div>

            <AddSubTask open={open} setOpen={setOpen} id={task._id} />
        </>
    );
};

export default TaskCard
