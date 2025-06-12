import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import reactLogo from "../assets/react.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/"); // Always go to "/", let context + ProtectedRoute redirect
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="w-screen h-screen bg-[#012533] flex items-center justify-center overflow-hidden">
      <div className="bg-white px-6 py-8 rounded-lg shadow-xl w-full max-w-md flex flex-col items-center">
        <img src={reactLogo} alt="Logo" className="w-16 h-16 mb-6" />
        <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Log In</h2>
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#00baff] hover:bg-[#009fd6] text-white font-semibold rounded-lg transition"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">Lost your password?</p>
      </div>
    </div>
  );
}
