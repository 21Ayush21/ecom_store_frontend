import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./app-components/Navbar";
import VerifyEmail from "./pages/Verify";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/verify' element={<VerifyEmail/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
    
    </>
  )
}