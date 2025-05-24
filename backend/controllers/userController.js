import { response } from "express"
import User from "../models/user.js"
import { createJWT } from "../utils/index.js"
import Notice from "../models/notification.js"

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, isAdmin, role, title } = req.body

        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.status(400).json({
                status: false,
                message: "User already exists",
            })
        }

        const user = await User.create({
            name,
            email,
            password,
            isAdmin,
            role,
            title,
        })

        if (user) {
            isAdmin ? createJWT(res, user._id) : null

            user.password = undefined

            res.status(201).json(user)
        } else {
            return res
                .status(400)
                .json({ status: false, message: "Invalid user data" })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const getStudentDetails = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId).select("-password -attendance");

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        console.log("User Data Sent:", user); // Debugging Log ✅
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getStudentDetail:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



// Fetch attendance details of the logged-in user
export const getAttendanceDetails = async (req, res) => {
    try {
        const userId = req.user?.userId; // Get userId from middleware

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const user = await User.findById(userId).select("attendance"); // Adjust based on your schema

        if (!user || !user.attendance) {
            return res.status(404).json({ message: "Attendance details not found" });
        }

        return res.json({
            attendedClasses: user.attendance.attendedClasses,
            attendancePercentage: user.attendance.attendancePercentage,
        });

    } catch (error) {
        console.error("Error fetching attendance:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res
                .status(401)
                .json({ status: false, message: "Invalid email or password." })
        }

        if (!user?.isActive) {
            return res.status(401).json({
                status: false,
                message:
                    "User account has been deactivated, contact the administrator",
            })
        }

        const isMatch = await user.matchPassword(password)

        if (user && isMatch) {
            createJWT(res, user._id)

            user.password = undefined

            res.status(200).json(user)
        } else {
            return res
                .status(401)
                .json({ status: false, message: "Invalid email or password" })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {
            htttpOnly: true,
            expires: new Date(0),
        })

        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const getTeamList = async (req, res) => {
    try {
        const users = await User.find().select("name title role email isActive attendance.attendedClasses attendance.attendancePercentage");

        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const getNotificationsList = async (req, res) => {
    try {
        const { userId } = req.user

        const notice = await Notice.find({
            team: userId,
            isRead: { $nin: [userId] },
        }).populate("task", "title")

        res.status(201).json(notice)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { userId, isAdmin } = req.user
        const { _id } = req.body

        const id =
            isAdmin && userId === _id
                ? userId
                : isAdmin && userId !== _id
                ? _id
                : userId

        const user = await User.findById(id)

        if (user) {
            user.name = req.body.name || user.name
            user.title = req.body.title || user.title
            user.role = req.body.role || user.role

            const updatedUser = await user.save()

            user.password = undefined

            res.status(201).json({
                status: true,
                message: "Profile Updated Successfully.",
                user: updatedUser,
            })
        } else {
            res.status(404).json({ status: false, message: "User not found" })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const markNotificationRead = async (req, res) => {
    try {
        const { userId } = req.user

        const { isReadType, id } = req.query

        if (isReadType === "all") {
            await Notice.updateMany(
                { team: userId, isRead: { $nin: [userId] } },
                { $push: { isRead: userId } },
                { new: true }
            )
        } else {
            await Notice.findOneAndUpdate(
                { _id: id, isRead: { $nin: [userId] } },
                { $push: { isRead: userId } },
                { new: true }
            )
        }

        res.status(201).json({ status: true, message: "Done" })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const changeUserPassword = async (req, res) => {
    try {
        const { userId } = req.user

        const user = await User.findById(userId)

        if (user) {
            user.password = req.body.password

            await user.save()

            user.password = undefined

            res.status(201).json({
                status: true,
                message: `Password chnaged successfully.`,
            })
        } else {
            res.status(404).json({ status: false, message: "User not found" })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const activateUserProfile = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id)

        if (user) {
            user.isActive = req.body.isActive //!user.isActive

            await user.save()

            res.status(201).json({
                status: true,
                message: `User account has been ${
                    user?.isActive ? "activated" : "disabled"
                }`,
            })
        } else {
            res.status(404).json({ status: false, message: "User not found" })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const deleteUserProfile = async (req, res) => {
    try {
        const { id } = req.params

        await User.findByIdAndDelete(id)

        res.status(200).json({
            status: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}


export const updateAttendance = async (req, res) => {
    const { userId, attendedClasses } = req.body;

    // Log the received data for debugging purposes
    console.log("Received userId:", userId, "attendedClasses:", attendedClasses);

    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure the attendedClasses is within a valid range (0 to 200)
        if (attendedClasses < 0 || attendedClasses > 200) {
            return res.status(400).json({ message: "Invalid attendedClasses value. It should be between 0 and 200." });
        }

        // Update the attendedClasses
        user.attendance.attendedClasses = attendedClasses;

        // Recalculate attendance percentage
        const attendancePercentage = (attendedClasses / 200) * 100;
        user.attendance.attendancePercentage = attendancePercentage;

        // Save the updated user document
        await user.save();

        // Respond with success message
        return res.status(200).json({ message: "Attendance updated successfully" });
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ message: "Error updating attendance" });
    }
};