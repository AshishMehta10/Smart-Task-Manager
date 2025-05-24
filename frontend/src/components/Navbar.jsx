import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import "./navbar.css";

const Navbar = ({ onSearch }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);  // Pass the search term to the parent
    };

    return (
        <div className="flex justify-between items-center px-4 py-3 2xl:py-4 sticky z-10 top-0" id="navbarID"
        >
            <div className="flex gap-4">
                <button
                    onClick={() => dispatch(setOpenSidebar(true))}
                    className="text-2xl text-gray-500 block md:hidden"
                >
                    ☰
                </button>
            </div>

            <div className="flex gap-2 items-center">
                <NotificationPanel />
                <UserAvatar />
            </div>
        </div>
    );
};

export default Navbar;
