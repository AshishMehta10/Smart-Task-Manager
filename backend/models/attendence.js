import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // Ensure one entry per user
        },
        attendedClasses: {
            type: Number,
            required: true,
            default: 0,
        },
        attendancePercentage: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
