import React, { useState, useEffect } from "react";
import { FaList} from "react-icons/fa";
import { MdGridView, MdSearch } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import "./Tasks.css"

const TABS = [
    { title: "Board View", icon: <MdGridView /> },
    { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
    todo: "bg-blue-600",
    "in progress": "bg-yellow-600",
    completed: "bg-green-600",
};

const Tasks = () => {
    const params = useParams();
    const [selected, setSelected] = useState(0);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(""); // Search term
    const [filteredTasks, setFilteredTasks] = useState([]); // Stores filtered tasks

    const status = params?.status || "";

    // Fetch tasks
    const { data, isLoading } = useGetAllTaskQuery({
        strQuery: status,
        isTrashed: "",
    });

    // Filter tasks when `search` updates
    useEffect(() => {
        if (!data?.tasks) return;
        const filtered = data.tasks.filter((task) =>
            task.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredTasks(filtered);
    }, [search, data]);

    return isLoading ? (
        <div className="py-10">
            <Loading />
        </div>
    ) : (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <Title title={status ? `${status} Tasks` : "Tasks"} />

                {!status && (
                    <Button
                        onClick={() => setOpen(true)}
                        label="Create Task"
                        icon={<IoMdAdd className="text-lg" />}
                        className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
                    />
                )}
            </div>

            {/* 🔍 Search Input */}
            <div className="mb-4">
                
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                
                />


            </div>

            <Tabs tabs={TABS} setSelected={setSelected}>
                {!status && (
                    <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
                        <TaskTitle label="To Do" className={TASK_TYPE.todo} />
                        <TaskTitle
                            label="In Progress"
                            className={TASK_TYPE["in progress"]}
                        />
                        <TaskTitle
                            label="Completed"
                            className={TASK_TYPE.completed}
                        />
                    </div>
                )}

                {/* Task Views */}
                {selected !== 1 ? (
                    <BoardView tasks={filteredTasks} />
                ) : (
                    <div className="w-full">
                        <Table tasks={filteredTasks} />
                    </div>
                )}
            </Tabs>

            {/* Add Task Modal */}
            <AddTask open={open} setOpen={setOpen} />
        </div>
    );
};

export default Tasks;
