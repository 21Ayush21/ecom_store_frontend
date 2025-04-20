import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCredentialsValidator } from "@/lib/ZodSchemas";
import { cn } from "@/lib/utils";
import { Select ,SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { z } from "zod";


const SignupSchema = AuthCredentialsValidator.extend({
  role: z.enum(['user','seller']).default('user')
})

type SignUpFormData = z.infer<typeof SignupSchema>

const Signup = () => {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({resolver: zodResolver(SignupSchema) ,  defaultValues: {role: "user"}});

  const handleSignup = async (data:SignUpFormData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      if (response.status === 201) {
        alert(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "An unexpected error occurred");
      } else {
        alert("Server error, please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center space-y-3"
        onSubmit={handleSubmit(handleSignup)}
      >
        <h1 className="text-center font-lato font-bold text-3xl">Sign Up</h1>

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

        <Select onValueChange={(value) => setValue("role", value as "user" | "seller")}>
          <SelectTrigger className="w-full border border-gray-300 rounded-lg p-1">
            <SelectValue placeholder="Role"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value='user'>User</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>


        <Button className="w-full">Sign Up</Button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
