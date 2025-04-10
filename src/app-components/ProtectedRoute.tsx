import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"


const ProtectedRoute = ({children}:{children: JSX.Element}) => {
  const {user , loading } = useAuth();
  
    if(loading) return <p>Loading...</p>
    return user? children : <Navigate to='/login' replace state={{from: window.location.pathname}}/>
}

export default ProtectedRoute
