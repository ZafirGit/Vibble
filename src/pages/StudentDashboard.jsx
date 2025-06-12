import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [studentClass, setStudentClass] = useState("");

  const fetchAssignments = async (studentId, studentClass) => {
    const q = query(collection(db, "assignments"), where("studentIds", "array-contains", studentId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAssignments(data);
  };

  const fetchUserClass = async () => {
    const docRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(docRef);
    const userData = userSnap.data();
    setStudentClass(userData.class);
    fetchAssignments(user.uid, userData.class);
  };

  const handleMarkCompleted = async (assignmentId) => {
    const docRef = doc(db, "assignments", assignmentId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    const newProgress = { ...data.progress, [user.uid]: "completed" };
    await updateDoc(docRef, { progress: newProgress });
    fetchAssignments(user.uid, studentClass);
  };

  useEffect(() => {
    fetchUserClass();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

        {assignments.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          assignments.map((a) => (
            <div key={a.id} className="border p-4 rounded mb-4">
              <h3 className="font-semibold">{a.title}</h3>
              <a href={a.fileUrl} target="_blank" className="text-blue-600 underline">
                Download PDF
              </a>
              <p className="mt-2">
                Progress:{" "}
                {a.progress?.[user.uid] ? a.progress[user.uid] : "Not started"}
              </p>
              <button
                className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
                onClick={() => handleMarkCompleted(a.id)}
              >
                Mark as Completed
              </button>
              {a.feedback?.[user.uid] && (
                <p className="mt-2 text-sm text-gray-700">
                  💬 Feedback: {a.feedback[user.uid]}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}