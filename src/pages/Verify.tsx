import { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/users/verify?token=${token}`);
        
        setSuccess(true);
        setMessage(response.data.message);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setMessage(error.response?.data?.message || "Verification failed. Please try again.");
        } else {
          setMessage("Verification failed. Please try again.");
        }
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">{message}</h2>
      {success && <a href="/login" className="mt-4 text-blue-500">Go to Login</a>}
    </div>
  );
};

export default VerifyEmail;
