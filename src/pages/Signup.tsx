import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignup = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const res = await axios.post("http://localhost:3000/signup")
      console.log(res)
    } catch (error){
      console.log(error)
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">

      
      <form className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center space-y-3" onSubmit={handleSignup}>
        <h1 className="text-center font-lato font-bold text-3xl">Sign Up</h1>

        <Label htmlFor="email">Email</Label>
        <Input
          type="text"
          placeholder="Email"
          id="email"
          className="block w-full p-2 border border-gray-300 rounded-lg mt-2"
          value={email}
          onChange={(e) => {setEmail(e.target.value)}}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Password"
          id="password"
          className="block w-full p-2 border border-gray-300 rounded-lg mt-2"
          value={password}
          onChange={(e) => {setPassword(e.target.value)}}
        />

        <Button className="w-full">Sign Up</Button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
