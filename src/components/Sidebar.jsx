import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { role } = useAuth();

  const navLinks = {
  admin: [
    { to: "/admin", label: "Admin Dashboard" },
    { to: "/admin/manage-teachers", label: "Manage Teachers" },
    { to: "/admin/manage-students", label: "Manage Students" },
  ],
  teacher: [{ to: "/teacher", label: "Teacher Dashboard" }],
  student: [{ to: "/student", label: "Student Dashboard" }],

  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">LMS</h2>
      <ul className="space-y-2">
        {navLinks[role]?.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="block hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
