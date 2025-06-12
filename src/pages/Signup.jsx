import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import reactLogo from "../assets/react.svg";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role
      });

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
  <div className="w-screen h-screen bg-[#012533] flex items-center justify-center overflow-hidden">
      <div className="bg-white px-6 py-8 rounded-lg shadow-xl w-full max-w-md flex flex-col items-center">
        <img src={reactLogo} alt="Logo" className="w-16 h-16 mb-6" />
        <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="w-full space-y-4">
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#00baff] hover:bg-[#009fd6] text-white font-semibold rounded-lg transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}
