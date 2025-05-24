import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Textbox from "../components/Textbox"
import Button from "../components/Button"
import { useSelector, useDispatch } from "react-redux"
import { useLoginMutation } from "../redux/slices/api/authApiSlice"
import { toast } from "sonner"

import { setCredentials } from "../redux/slices/authSlice"
import Loading from "../components/Loader"
import "./login.css"
import Navbar from "./Navbar"



const Login = () => {
    const { user } = useSelector((state) => state.auth)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [login, { isLoading }] = useLoginMutation()

    const submitHandler = async (data) => {
        try {
            const result = await login(data).unwrap()

            dispatch(setCredentials(result))

            navigate("/")
        } catch (error) {
            console.log(error)
            toast.error(error?.data?.message || error.message)
        }
    }

    useEffect(() => {
        user && navigate("/dashboard")
    }, [user])

    return (
        <>
        <Navbar />
        <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row" id="loginID">
            <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
                

                {/* right side */}
                <div className="w-full  p-4 md:p-1 flex flex-col justify-center items-center">
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="form-container w-full md:w-[500px] flex flex-col gap-y-8 px-10 pt-14 pb-14" id="formID">
                            <h1 className="loginHead">
                                LOGIN
                            </h1>
                            <hr />
                           

                        <div className="flex flex-col gap-y-5" >
                            <Textbox
                                placeholder="your email"
                                type="email"
                                name="email"
                                label="Email Address"
                                className="w-full rounded-full text-white border-sky-500"
                                register={register("email", {
                                    required: "Email Address is required!",
                                
                                })}
                                error={errors.email ? errors.email.message : ""}
                            />
                            <Textbox
                                placeholder="your password"
                                type="password"
                                name="password"
                                label="Password"
                                className="w-full rounded-full text-white border-sky-500"
                                register={register("password", {
                                    required: "Password is required!",
                                })}
                                error={
                                    errors.password
                                        ? errors.password.message
                                        : ""
                                }
                            />

                            <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
                                Register If Not Login?
                            </span>

                            {isLoading ? (
                                <Loading />
                            ) : (
                                <>
                                <Button
                                    type="submit"
                                    label="Submit"
                                    className="w-full h-10 bg-sky-600 text-white rounded-full"
                                />

                                <Button
                                    type="button"
                                    label="Register"
                                    className="w-full h-10 bg-green-900 text-white rounded-full hover:bg-gray-600 transition duration-200"
                                    onClick={() => navigate("/register")}
                                />
            </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login
