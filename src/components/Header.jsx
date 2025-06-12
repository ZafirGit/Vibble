import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="text-lg font-medium">
        Welcome back, {user?.email || "User"}!
      </div>
    </div>
  );
}
