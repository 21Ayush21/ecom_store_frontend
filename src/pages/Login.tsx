import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCredentialsValidator } from "@/lib/AuthCredentialsValidator";
import axios from "axios";
import { useState } from "react";
import { z } from "zod";

type AuthCredentialsValidatorType = z.infer<typeof AuthCredentialsValidator>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentialsValidatorType>({ resolver: zodResolver(AuthCredentialsValidator) });

  const [error, setError] = useState<string | null>(null);

  const loginSubmit = async (data: AuthCredentialsValidatorType) => {
    try {
      setError(null)
      console.log("Sending request with data:", data);
      const response = await axios.post("http://localhost:3000/auth", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if(response.data){
        console.log("Login Successful", response.data)

        // Check if response contains tokens
        if (response.data.accessToken && response.data.refreshToken) {
          const {accessToken, refreshToken} = response.data;
          console.log("Tokens received");
          
          // Store tokens in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        } else if (response.data.user) {
          // If no tokens but we have user data, store that directly
          console.log("User data received without tokens, storing user data directly");
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        // Simply reload the page to force a complete re-render of all components
        const redirectUrl = response.data.redirect || '/home';
        window.location.href = redirectUrl;
        return;
      }
      
    } catch (error) {
      console.error(error);
      if(axios.isAxiosError(error) ){
        setError(error.response?.data?.message || "Login failed. Please check your credentials")
      } else{
        setError("An unexpected error occured")
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative">
      <form
        className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center space-y-3"
        onSubmit={handleSubmit(loginSubmit)}
      >
        <h1 className="text-center font-lato font-bold text-3xl">Login</h1>

        <Input
          type="email"
          placeholder="Email"
          className={cn(
            "block w-full p-2 border border-gray-300 rounded-lg mt-2 ",
            errors.email
              ? "focus-visible:ring-red-500"
              : "focus-visible:ring-blue-500"
          )}
          {...register("email")}
        />
        <Input
          type="password"
          placeholder="Password"
          className={cn(
            "block w-full p-2 border border-gray-300 rounded-lg mt-2",
            errors.password
              ? "focus-visible:ring-red-500"
              : "focus-visible:ring-blue-500"
          )}
          {...register("password")}
        />

        <Button className="w-full">Login</Button>
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </form>
    </div>
  );
};

export default Login;
