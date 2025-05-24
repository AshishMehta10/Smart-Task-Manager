// AdminRegister.js
import React from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import Loading from "../components/Loader";
import { toast } from "sonner";
import "./register.css";

const AdminRegister = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    
    const [registerUser, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log("Submitting Admin Data:", data);
        try {
            await registerUser({ ...data, isAdmin: true }).unwrap(); // Ensure isAdmin is always true
            toast.success("Admin Registration Successful");
            navigate("/log-in");
        } catch (error) {
            console.error("Admin Registration Error:", error);
            toast.error(error?.data?.message || "Registration Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center " id="registerID">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md " id="registerFormID">
                <h1 className="loginHead">ADMIN REGISTER</h1>
                <hr className="mb-4" />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
                    <Textbox
                        placeholder="Enter your name"
                        type="text"
                        name="name"
                        label="Name"
                        className="w-full rounded-full text-white border-sky-500"
                        register={register("name", { required: "Name is required" })}
                        error={errors.name?.message}
                    />
                    <Textbox
                        placeholder="Enter your email"
                        type="email"
                        name="email"
                        label="Email Address"
                        className="w-full rounded-full text-white border-sky-500"
                        register={register("email", { required: "Email is required" })}
                        error={errors.email?.message}
                    />
                    <Textbox
                        placeholder="Enter your password"
                        type="password"
                        name="password"
                        label="Password"
                        className="w-full rounded-full text-white border-sky-500"
                        register={register("password", { required: "Password is required" })}
                        error={errors.password?.message}
                    />
                    <Textbox
                        placeholder="Enter your role"
                        type="text"
                        name="role"
                        label="Role"
                        className="w-full rounded-full text-white border-sky-500 text-white"
                        register={register("role", { required: "Role is required" })}
                        error={errors.role?.message}
                    />
                    <Textbox
                        placeholder="Enter your title"
                        type="text"
                        name="title"
                        label="Title"
                        className="w-full rounded-full text-white border-sky-500"
                        register={register("title", { required: "Title is required" })}
                        error={errors.title?.message}
                    />

                    {isLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <Button
                                type="submit"
                                label="Register as Admin"
                                className="w-full h-10 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200"
                            />
                            <Button
                                type="button"
                                label="Back to Login"
                                className="w-full h-10 bg-cyan-900 text-white rounded-full hover:bg-gray-600 transition duration-200"
                                onClick={() => navigate("/log-in")}
                            />
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
