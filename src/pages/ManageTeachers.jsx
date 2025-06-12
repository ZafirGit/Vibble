import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchTeachers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const result = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === "teacher") result.push({ id: doc.id, ...data });
    });
    setTeachers(result);
  };

  const fetchClasses = async () => {
    const snapshot = await getDocs(collection(db, "classes"));
    const result = [];
    snapshot.forEach((doc) => result.push(doc.id));
    setClasses(result);
  };

  const reassignClass = async (teacherId, newClass) => {
    const ref = doc(db, "users", teacherId);
    await updateDoc(ref, { class: newClass });
    fetchTeachers();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-6">All Teachers</h1>
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Class Assigned</th>
              <th className="border p-2">Change Class</th>
              <th className="border p-2">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id}>
                <td className="border p-2">{t.name || "N/A"}</td>
                <td className="border p-2">{t.email}</td>
                <td className="border p-2">{t.class || "—"}</td>
                <td className="border p-2">
                  <select
                    className="border p-1 rounded"
                    value={t.class || ""}
                    onChange={(e) => reassignClass(t.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">{t.lastLogin || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
