import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getClassStudents, createAssignment, addFeedback } from "../hooks/useFirestoreUtils";
import { uploadPdfToStorage } from "../hooks/useStorageUpload";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [title, setTitle] = useState("");
  const [assignments, setAssignments] = useState([]);

  const fetchClassAndStudents = async () => {
    const userDoc = await (await import("firebase/firestore")).getDoc((await import("firebase/firestore")).doc(db, "users", user.uid));
    const userClass = userDoc.data().class;
    const result = await getClassStudents(userClass);
    setStudents(result);
  };

  const handleCheckboxChange = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleUploadAndAssign = async () => {
    if (!pdfFile || !title || selectedStudents.length === 0) return;
    const url = await uploadPdfToStorage(pdfFile, "assignments");
    await createAssignment({ title, fileUrl: url, studentIds: selectedStudents, teacherId: user.uid });
    alert("Assignment created!");
    setPdfFile(null);
    setTitle("");
    setSelectedStudents([]);
    fetchAssignments();
  };

  const fetchAssignments = async () => {
    const q = query(collection(db, "assignments"), where("teacherId", "==", user.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAssignments(data);
  };

  const handleFeedbackSubmit = async (id, studentId, text) => {
    await addFeedback(id, studentId, text);
    fetchAssignments();
  };

  useEffect(() => {
    fetchClassAndStudents();
    fetchAssignments();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

        <div className="border p-4 mb-6 rounded">
          <h2 className="text-xl mb-2">Assign PDF to Students</h2>
          <input
            type="text"
            placeholder="Assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="mb-2"
          />
          <div className="grid grid-cols-2 gap-2 mb-4">
            {students.map((s) => (
              <label key={s.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.id)}
                  onChange={() => handleCheckboxChange(s.id)}
                />
                <span>{s.email}</span>
              </label>
            ))}
          </div>
          <button onClick={handleUploadAndAssign} className="bg-blue-600 text-white px-4 py-2 rounded">
            Upload & Assign
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Assignments</h2>
          {assignments.map((a) => (
            <div key={a.id} className="border p-4 rounded mb-4">
              <h3 className="font-bold">{a.title}</h3>
              <a href={a.fileUrl} target="_blank" className="text-blue-500 underline">View PDF</a>
              <ul className="mt-2">
                {a.studentIds.map((sid) => (
                  <li key={sid} className="mt-2">
                    <span>{sid}</span>
                    <textarea
                      className="border p-1 ml-2 rounded w-full"
                      placeholder="Leave feedback"
                      defaultValue={a.feedback?.[sid] || ""}
                      onBlur={(e) => handleFeedbackSubmit(a.id, sid, e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
