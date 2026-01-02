import { AuthContext } from "../context/AuthContext.jsx";
import { useContext } from "react";

export const useAuth = ()=>{
    return useContext(AuthContext)
};