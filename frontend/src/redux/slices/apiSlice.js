import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URI = "http://localhost:8000/api" // Ensure this matches your backend

const baseQuery = fetchBaseQuery({ 
    baseUrl: API_URI, // Fixed: Removed extra "/api"
    credentials: "include", // Ensure cookies are sent with requests if using JWT auth
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: [],
    endpoints: (builder) => ({}),
})
