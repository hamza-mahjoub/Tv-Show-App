import axios from "axios";

// set up axios - simple json-server prototype config
export const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: { api_key: process.env.REACT_APP_API_KEY },
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    }});