import clsx from "clsx"
import moment from "moment"
import React, { useState } from "react"
import { FaBug, FaTasks, FaThumbsUp, FaUser,FaCheckCircle } from "react-icons/fa"
import { GrInProgress } from "react-icons/gr"
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
    MdOutlineDoneAll,
    MdOutlineMessage,
    MdTaskAlt,
} from "react-icons/md"
import { RxActivityLog } from "react-icons/rx"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { tasks } from "../assets/data"
import Tabs from "../components/Tabs"
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils"
import Loading from "../components/Loader"
import Button from "../components/Button"
import {
    useGetSingleTaskQuery,
    usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice"

const assets = [
    "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
]

const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
}

const bgColor = {
    high: "bg-red-200",
    medium: "bg-yellow-200",
    low: "bg-blue-200",
}

const TABS = [
    { title: "Task Detail", icon: <FaTasks /> },
    { title: "Activities/Timeline", icon: <RxActivityLog /> },
]

const TASKTYPEICON = {
    commented: (
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
            <MdOutlineMessage />,
        </div>
    ),
    started: (
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <FaThumbsUp size={20} />
        </div>
    ),
    assigned: (
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
            <FaUser size={14} />
        </div>
    ),
    bug: (
        <div className="text-red-600">
            <FaBug size={24} />
        </div>
    ),
    completed: (
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
            <MdOutlineDoneAll size={24} />
        </div>
    ),
    "in progress": (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
            <GrInProgress size={16} />
        </div>
    ),
}

const act_types = [
    "Started",
    "Completed",
    "In Progress",
    "Commented",
    "Bug",
    "Assigned",
]

const TaskDetails = () => {
    const { id } = useParams()
    const { data, isLoading, refetch } = useGetSingleTaskQuery(id)

    const [selected, setSelected] = useState(0)
    const task = data?.task

    if (isLoading)
        return (
            <div className="py-10">
                <Loading />
            </div>
        )

    return (
        <div className="w-full flex flex-col gap-3 mb-4 text-white font-[Poppins]">
    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text drop-shadow-lg tracking-wide">
        {task?.title}
    </h1>

    <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
            <>
                <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-gray-950 shadow-2xl rounded-xl p-8 border border-gray-800 backdrop-blur-lg transition-all duration-500">
                    {/* LEFT SECTION */}
                    <div className="w-full md:w-1/2 space-y-8">
                        <div className="flex items-center gap-5">
                            <div
                                className={clsx(
                                    "flex gap-2 items-center text-sm font-semibold px-4 py-2 rounded-full shadow-md border border-gray-600 backdrop-blur-md",
                                    PRIOTITYSTYELS[task?.priority],
                                    bgColor[task?.priority]
                                )}
                            >
                                <span className="text-lg text-cyan-400 drop-shadow-md">
                                    {ICONS[task?.priority]}
                                </span>
                                <span className="uppercase tracking-wider text-gray-300">
                                    {task?.priority} Priority
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400">
                                <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
                                <span className="uppercase font-medium">
                                    {task?.stage}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm italic">
                            Created At: <span className="font-semibold text-pink-400">
                                {new Date(task?.date).toDateString()}
                            </span>
                        </p>

                        <div className="flex items-center gap-8 p-4 border-y border-gray-700">
                            <div className="space-x-2">
                                <span className="font-semibold text-purple-400">
                                    Assets :
                                </span>
                                <span className="text-gray-300">{task?.assets?.length}</span>
                            </div>

                            <span className="text-gray-500">|</span>

                            <div className="space-x-2">
                                <span className="font-semibold text-blue-400">
                                    Sub-Task :
                                </span>
                                <span className="text-gray-300">{task?.subTasks?.length}</span>
                            </div>
                        </div>

                        {/* TASK TEAM */}
                        <div className="space-y-4 py-6">
                            <p className="text-gray-300 font-semibold text-md tracking-wider underline underline-offset-4 decoration-blue-500">
                                TASK TEAM
                            </p>
                            <div className="space-y-3">
                                {task?.team?.map((m, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 py-2 items-center border-t border-gray-800 hover:bg-gray-900 transition-all duration-300 p-2 rounded-lg"
                                    >
                                        <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                                            <span>{getInitials(m?.name)}</span>
                                        </div>

                                        <div>
                                            <p className="text-lg font-semibold text-gray-100">
                                                {m?.name}
                                            </p>
                                            <span className="text-gray-400 text-sm">
                                                {m?.title}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SUB-TASKS */}
                        <div className="space-y-4 py-6">
                            <p className="text-gray-300 font-semibold text-md tracking-wider underline underline-offset-4 decoration-pink-500">
                                SUB-TASKS
                            </p>
                            <div className="space-y-8">
                                {task?.subTasks?.map((el, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-900 shadow-lg">
                                            <MdTaskAlt className="text-pink-400" size={26} />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs text-gray-400">
                                                    {new Date(el?.date).toDateString()}
                                                </span>

                                                <span className="px-2 py-1 text-xs rounded-full bg-pink-600 text-white font-semibold shadow-md">
                                                    {el?.tag}
                                                </span>
                                            </div>

                                            <p className="text-gray-200 text-md">
                                                {el?.title}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION (ASSETS) */}
                    <div className="w-full md:w-1/2 space-y-8">
                        <p className="text-lg font-semibold text-gray-200">ASSETS</p>

                        <div className="w-full grid grid-cols-2 gap-4">
                            {task?.assets?.map((el, index) => (
                                <img
                                    key={index}
                                    src={el}
                                    alt={task?.title}
                                    className="w-full rounded-lg h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-500 hover:scale-110 hover:z-50 shadow-xl border border-gray-700"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <>
                <Activities activity={data?.task?.activities} id={id} refetch={refetch} />
            </>
        )}
    </Tabs>
</div>

    )
}

const Activities = ({ activity, id, refetch }) => {
    const [selected, setSelected] = useState(act_types[0])
    const [text, setText] = useState("")

    const [postActivity, { isLoading }] = usePostTaskActivityMutation()
    const handleSubmit = async () => {
        try {
            const activityData = {
                type: selected?.toLowerCase(),
                activity: text,
            }

            const result = await postActivity({
                data: activityData,
                id,
            }).unwrap()

            setText("")
            toast.success(result?.message)
            refetch()
        } catch (err) {
            console.log(err)
            toast.error(err?.data?.message || err.message)
        }
    }

    const Card = ({ item }) => {
        return (
            <div className="flex space-x-4 hover:bg-gray-800 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105">
                <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xl">
                        <div className="text-white text-xl">
                            {TASKTYPEICON[item?.type]}
                        </div>
                    </div>
                    <div className="w-0.5 bg-gray-500 h-full mt-4"></div>
                </div>
    
                <div className="flex flex-col gap-y-3 mb-8">
                    <p className="font-bold text-white text-xl">{item?.by?.name}</p>
                    <div className="text-gray-400 space-y-2">
                        <span className="capitalize text-blue-400">{item?.type}</span>
                        <span className="text-sm text-yellow-500"> {moment(item?.date).fromNow()}</span>
                    </div>
                    <div className="text-gray-300 text-lg">{item?.activity}</div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-12 py-10 bg-gradient-to-r from-gray-900 to-black shadow-xl rounded-lg justify-between overflow-y-auto">
            <div className="w-full md:w-1/2">
                <h4 className="text-white font-bold text-2xl mb-6 transform transition-all duration-300 hover:scale-105">
                    Activities
                </h4>
    
                <div className="w-full space-y-6">
                    {activity?.map((el, index) => (
                        <Card
                            key={index}
                            item={el}
                            isConnected={index < activity?.length - 1}
                        />
                    ))}
                </div>
            </div>
    
            <div className="w-full md:w-1/3 bg-gray-800 p-8 rounded-xl shadow-xl">
                <h4 className="text-white font-semibold text-xl mb-6 transform transition-all duration-300 hover:scale-105">
                    Add Activity
                </h4>
                <div className="w-full flex flex-wrap gap-6">
                    {act_types.map((item, index) => (
                        <div key={item} className="flex gap-4 items-center text-gray-300 hover:text-blue-500 cursor-pointer transition-all duration-300">
                            <FaCheckCircle 
                                size={24} 
                                className={`transition-all duration-300 ${selected === item ? 'text-blue-500' : 'text-gray-500'}`} 
                                onClick={() => setSelected(item)} 
                            />
                            <p className="text-lg">{item}</p>
                        </div>
                    ))}
                    <textarea
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your activity here..."
                        className="bg-gray-700 text-white w-full mt-6 border border-gray-600 outline-none p-4 rounded-md focus:ring-2 ring-blue-500 transition-all ease-in-out duration-300"
                    ></textarea>
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-4">
                            <Loading />
                        </div>
                    ) : (
                        <Button
                            type="button"
                            label="Submit"
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md px-6 py-3 mt-6 transform hover:scale-105 transition-all duration-300"
                        />
                    )}
                </div>
            </div>
        </div>
    );
    
}
export default TaskDetails
