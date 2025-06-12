import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminDashboard() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  const [selectedClassTeacher, setSelectedClassTeacher] = useState(null);
  const [showStudentsPopup, setShowStudentsPopup] = useState(false);
  const [showTeacherPopup, setShowTeacherPopup] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const studentsList = [];
    const teachersList = [];
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === "student") studentsList.push({ id: doc.id, ...data });
      if (data.role === "teacher") teachersList.push({ id: doc.id, ...data });
    });

    setStudents(studentsList);
    setTeachers(teachersList);

    const allClasses = Array.from(
      new Set([...studentsList, ...teachersList].map((u) => u.class))
    ).filter(Boolean);
    setClasses(allClasses);
  };

  const handleViewStudents = (className) => {
    const filtered = students.filter((s) => s.class === className);
    setSelectedClassStudents(filtered);
    setShowStudentsPopup(true);
  };

  const handleViewTeacher = (className) => {
    const teacher = teachers.find((t) => t.class === className);
    setSelectedClassTeacher(teacher || null);
    setShowTeacherPopup(true);
  };

  const addClass = async () => {
    if (!newClassName.trim()) return;
    await setDoc(doc(db, "classes", newClassName), { name: newClassName });
    setNewClassName("");
    fetchAll();
  };

  const deleteClass = async (className) => {
    await deleteDoc(doc(db, "classes", className));
    setStudents((prev) =>
      prev.map((s) => (s.class === className ? { ...s, class: null } : s))
    );
    setTeachers((prev) =>
      prev.map((t) => (t.class === className ? { ...t, class: null } : t))
    );
    fetchAll();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-6">All Classes</h1>

        <div className="grid grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls} className="bg-gray-200 p-4 rounded shadow">
              <h2 className="font-bold text-lg mb-2">{cls}</h2>
              <button
                className="underline text-blue-600 block"
                onClick={() => handleViewStudents(cls)}
              >
                View Students
              </button>
              <button
                className="underline text-blue-600 block mt-1"
                onClick={() => handleViewTeacher(cls)}
              >
                View Teacher
              </button>
              <button
                className="text-sm text-red-600 mt-2"
                onClick={() => deleteClass(cls)}
              >
                Delete Class
              </button>
            </div>
          ))}

          <div className="bg-white border border-gray-300 p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Add New Class</h2>
            <input
              type="text"
              placeholder="Class Name"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={addClass}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add Class
            </button>
          </div>
        </div>

        {/* Students Popup */}
        {showStudentsPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-4 rounded max-w-md w-full">
              <h2 className="text-xl font-semibold mb-3">Students in Class</h2>
              {selectedClassStudents && selectedClassStudents.length > 0 ? (
                <ul className="list-disc pl-5">
                {selectedClassStudents.map((s) => (
                  <li key={s.id}>{s.email}</li>
                ))}
              </ul> 
              ) : (
                <p className="text-gray-500">No Student assigned.</p>
              )}
              <button
                className="mt-4 text-sm text-red-600"
                onClick={() => setShowStudentsPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Teacher Popup */}
        {showTeacherPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-4 rounded max-w-md w-full">
              <h2 className="text-xl font-semibold mb-3">Assigned Teacher</h2>
              {selectedClassTeacher ? (
                <p>{selectedClassTeacher.email}</p>
              ) : (
                <p className="text-gray-500">No teacher assigned.</p>
              )}
              <button
                className="mt-4 text-sm text-red-600"
                onClick={() => setShowTeacherPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
