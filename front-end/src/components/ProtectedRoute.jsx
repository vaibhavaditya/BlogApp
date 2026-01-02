import { useAuth } from "../hooks/useAuth.jsx";
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children })=>{
    const {isAuthenticated,loading} = useAuth();

    if(loading){
        return null;
    }

    if(!isAuthenticated){
        return <Navigate to= "/login"/>
    }

    return children;
}

export default ProtectedRoute;