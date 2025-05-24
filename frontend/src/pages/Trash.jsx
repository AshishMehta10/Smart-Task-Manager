import clsx from "clsx"
import React, { useState } from "react"
import {
    MdDelete,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
    MdOutlineRestore,
} from "react-icons/md"
import { tasks } from "../assets/data"
import Title from "../components/Title"
import Button from "../components/Button"
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils"
import AddUser from "../components/AddUser"
import ConfirmatioDialog from "../components/Dialogs"
import {
    useDeleteRestoreTaskMutation,
    useGetAllTaskQuery,
} from "../redux/slices/api/taskApiSlice"
import Loading from "../components/Loader"
import { toast } from "sonner"

const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
}

const Trash = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [open, setOpen] = useState(false)
    const [msg, setMsg] = useState(null)
    const [type, setType] = useState("delete")
    const [selected, setSelected] = useState("")

    const { data, isLoading, refetch } = useGetAllTaskQuery({
        strQuery: "",
        isTrashed: "true",
        search: "",
    })

    const [deleteRestoreTask] = useDeleteRestoreTaskMutation()

    const deleteRestoreHandler = async () => {
        try {
            let result

            switch (type) {
                case "delete":
                    result = await deleteRestoreTask({
                        id: selected,
                        actionType: "delete",
                    }).unwrap()
                    break
                case "deleteAll":
                    result = await deleteRestoreTask({
                        id: selected,
                        actionType: "deleteAll",
                    }).unwrap()
                    break
                case "restore":
                    result = await deleteRestoreTask({
                        id: selected,
                        actionType: "restore",
                    }).unwrap()
                    break
                case "restoreAll":
                    result = await deleteRestoreTask({
                        id: selected,
                        actionType: "restoreAll",
                    }).unwrap()
                    break
            }

            toast.success(result?.message)
            setTimeout(() => {
                setOpenDialog(false)
                refetch()
            }, 500)
        } catch (err) {
            console.log(err)
            toast.error(err?.data?.message || err.message)
        }
    }

    const deleteAllClick = () => {
        setType("deleteAll")
        setMsg("Do you want to permenantly delete all items?")
        setOpenDialog(true)
    }

    const restoreAllClick = () => {
        setType("restoreAll")
        setMsg("Do you want to restore all items in the trash?")
        setOpenDialog(true)
    }

    const deleteClick = (id) => {
        setType("delete")
        setSelected(id)
        setOpenDialog(true)
    }

    const restoreClick = (id) => {
        setSelected(id)
        setType("restore")
        setMsg("Do you want to restore the selected item?")
        setOpenDialog(true)
    }

    if (isLoading)
        return (
            <div className="py-10">
                <Loading />
            </div>
        )
        const TableHeader = () => (
            <thead className="border-b border-gray-700 text-white bg-gray-800">
                <tr className="text-left text-lg">
                    <th className="py-3 w-2/6">Task Title</th>
                    <th className="py-3 w-1/6">Priority</th>
                    <th className="py-3 w-1/6">Stage</th>
                    <th className="py-3 w-1/6">Modified On</th>
                    <th className="py-3 px-4 w-1/6 text-right">Actions</th>
                </tr>
            </thead>
        );

    const TableRow = ({ item }) => (
        <tr className="">
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <div
                        className={clsx(
                            "w-4 h-4 rounded-full",
                            TASK_TYPE[item.stage]
                        )}
                    />
                    <p className="w-full line-clamp-2 text-base">
                        {item?.title}
                    </p>
                </div>
            </td>

            <td className="py-2 capitalize">
                <div className={"flex gap-1 items-center"}>
                    <span
                        className={clsx(
                            "text-lg",
                            PRIOTITYSTYELS[item?.priority]
                        )}
                    >
                        {ICONS[item?.priority]}
                    </span>
                    <span className="">{item?.priority}</span>
                </div>
            </td>

            <td className="py-2 capitalize text-center md:text-start">
                {item?.stage}
            </td>
            <td className="py-2 text-sm">
                {new Date(item?.date).toDateString()}
            </td>

            <td className="py-2 flex gap-1 justify-end">
                <Button
                    icon={
                        <MdOutlineRestore className="text-xl text-gray-500" />
                    }
                    onClick={() => restoreClick(item._id)}
                />
                <Button
                    icon={<MdDelete className="text-xl text-red-600" />}
                    onClick={() => deleteClick(item._id)}
                />
            </td>
        </tr>
    )
    return (
        <>
            <div className="w-full md:px-1 px-0 mb-6">
                <div className="flex items-center justify-between mb-8 text-white">
                    <Title title="Trashed Tasks" />
                    <div className="flex gap-4">
                        <Button label="Restore All" icon={<MdOutlineRestore className="text-lg hidden md:flex" />} className="flex flex-row-reverse gap-1 items-center bg-green-600 hover:bg-green-500 text-white text-sm md:text-base rounded-lg px-4 py-2 transition transform hover:scale-105" onClick={() => restoreAllClick()} />
                        <Button label="Delete All" icon={<MdDelete className="text-lg hidden md:flex" />} className="flex flex-row-reverse gap-1 items-center bg-red-600 hover:bg-red-500 text-white text-sm md:text-base rounded-lg px-4 py-2 transition transform hover:scale-105" onClick={() => deleteAllClick()} />
                    </div>
                </div>
                <div className="bg-gray-900 px-6 py-4 shadow-lg rounded-lg border border-gray-700 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-50 -z-10"></div>
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                        <table className="w-full text-white border-collapse">
                            <TableHeader />
                            <tbody>
                                {data?.tasks?.map((tk, id) => (
                                    <TableRow key={id} item={tk} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ConfirmatioDialog
                open={openDialog}
                setOpen={setOpenDialog}
                msg={msg}
                setMsg={setMsg}
                type={type}
                setType={setType}
                onClick={() => deleteRestoreHandler()}
            />
        </>
    );
}

export default Trash
