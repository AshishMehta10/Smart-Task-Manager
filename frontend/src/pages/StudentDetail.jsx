import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, Briefcase, Shield, Activity, CheckCircle, XCircle } from "lucide-react"; 

const StudentDetail = () => {
    const [student, setStudent] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudentDetail = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/user/student-detail", {
                    method: "GET",
                    credentials: "include", // ✅ Allows cookies (important for auth)
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch student details");
                }

                const data = await response.json();
                setStudent(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching student details:", err);
            }
        };

        fetchStudentDetail();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 student-div">
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, ease: "easeOut" }} 
                className="w-full max-w-2xl bg-gray-800 text-white rounded-2xl shadow-xl p-6 border border-teal-500 hover:border-teal-400 transition-all duration-300"
            >
                <h2 className="text-3xl font-bold text-center text-teal-400 mb-6">
                    <Activity className="inline-block w-8 h-8 mr-2 text-teal-300 animate-pulse" /> 
                    Student Details
                </h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                {student ? (
                    <motion.table 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full border-collapse"
                    >
                        <tbody>
                            <tr className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                                <td className="px-4 py-3 font-semibold text-gray-300 flex items-center">
                                    <User className="w-5 h-5 text-teal-300 mr-2" /> Name:
                                </td>
                                <td className="px-4 py-3">{student.name}</td>
                            </tr>
                            <tr className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                                <td className="px-4 py-3 font-semibold text-gray-300 flex items-center">
                                    <Briefcase className="w-5 h-5 text-teal-300 mr-2" /> Title:
                                </td>
                                <td className="px-4 py-3">{student.title}</td>
                            </tr>
                            <tr className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                                <td className="px-4 py-3 font-semibold text-gray-300 flex items-center">
                                    <Shield className="w-5 h-5 text-teal-300 mr-2" /> Role:
                                </td>
                                <td className="px-4 py-3">{student.role}</td>
                            </tr>
                            <tr className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                                <td className="px-4 py-3 font-semibold text-gray-300 flex items-center">
                                    <Mail className="w-5 h-5 text-teal-300 mr-2" /> Email:
                                </td>
                                <td className="px-4 py-3">{student.email}</td>
                            </tr>
                            <tr className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                                <td className="px-4 py-3 font-semibold text-gray-300 flex items-center">
                                    <Shield className="w-5 h-5 text-teal-300 mr-2" /> Admin:
                                </td>
                                <td className="px-4 py-3">
                                    {student.isAdmin ? (
                                        <CheckCircle className="w-5 h-5 text-green-400 inline-block" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400 inline-block" />
                                    )}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                                <td className="px-4 py-3 font-semibold text-gray-300 flex items-center">
                                    <Activity className="w-5 h-5 text-teal-300 mr-2" /> Active:
                                </td>
                                <td className="px-4 py-3">
                                    {student.isActive ? (
                                        <CheckCircle className="w-5 h-5 text-green-400 inline-block" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400 inline-block" />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </motion.table>
                ) : (
                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 0.5 }} 
                        className="text-center text-gray-400"
                    >
                        Loading...
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default StudentDetail;
