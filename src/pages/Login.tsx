import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCredentialsValidator } from "@/lib/AuthCredentialsValidator";
import axios from "axios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(AuthCredentialsValidator) });

  const loginSubmit = async (data: any) => {
    try {
      console.log("Sending request with data:", data);
      const response = await axios.post("http://localhost:3000/auth", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status == 200) {
        console.log("Login successful:", response.data);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
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
      </form>
    </div>
  );
};

export default Login;
