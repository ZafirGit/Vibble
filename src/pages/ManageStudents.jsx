import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const studentList = [];
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === "student") {
          studentList.push({ id: doc.id, ...data });
        }
      });
      setStudents(studentList);
    };

    fetchStudents();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-6">All Students</h1>
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Class Assigned</th>
              <th className="border p-2">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.name || "N/A"}</td>
                <td className="border p-2">{s.email}</td>
                <td className="border p-2">{s.class || "—"}</td>
                <td className="border p-2">{s.lastLogin || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
