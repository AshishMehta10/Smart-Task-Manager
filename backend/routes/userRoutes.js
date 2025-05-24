import express from "express"
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js"
import {
    activateUserProfile,
    changeUserPassword,
    deleteUserProfile,
    getNotificationsList,
    getTeamList,
    loginUser,
    logoutUser,
    markNotificationRead,
    registerUser,
    updateUserProfile,
    getStudentDetails,
    getAttendanceDetails, // Import the new function
    updateAttendance // Add this import for the updateAttendance function
    
} from "../controllers/userController.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)

router.get("/get-team", protectRoute,isAdminRoute,getTeamList)
router.get("/notifications", protectRoute, getNotificationsList)
router.get("/student-detail", protectRoute, getStudentDetails);
router.get("/attendance", protectRoute, getAttendanceDetails);

router.put("/profile", protectRoute, updateUserProfile)
router.put("/read-noti", protectRoute, markNotificationRead)
router.put("/change-password", protectRoute, changeUserPassword)

router.put("/update-attendance", protectRoute,isAdminRoute, updateAttendance,);


// FOR ADMIN ONLY - ADMIN ROUTES
router
    .route("/:id")
    .put(protectRoute, isAdminRoute, activateUserProfile)
    .delete(protectRoute, isAdminRoute, deleteUserProfile)

export default router
