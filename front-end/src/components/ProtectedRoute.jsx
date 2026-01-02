import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children })=>{
    const isAithenticated = useAuth();

    if(!isAithenticated){
        return <Navigate to= "/login"/>
    }

    return children;
}

export default ProtectedRoute;