import { useEffect, useState } from "react";
import PDFViewer from "./PDFViewer";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function AssignmentViewer({ assignment }) {
  const { user } = useAuth();
  const [viewedPages, setViewedPages] = useState([]);

  // Fetch viewed pages for this user
  useEffect(() => {
    const fetchProgress = async () => {
      const docSnap = await getDoc(doc(db, "assignments", assignment.id));
      const pageProgress = docSnap.data().pageProgress?.[user.uid] || [];
      setViewedPages(pageProgress);
    };

    fetchProgress();
  }, [assignment.id, user.uid]);

  // Called when a page is viewed (50% or more visible)
  const handleViewPage = async (pageNum) => {
    if (!viewedPages.includes(pageNum)) {
      const updatedPages = [...viewedPages, pageNum].sort((a, b) => a - b);
      setViewedPages(updatedPages);

      // Update Firestore progress
      await updateDoc(doc(db, "assignments", assignment.id), {
        [`pageProgress.${user.uid}`]: updatedPages,
      });
    }
  };

  return (
    <div className="border p-4 rounded mb-6 shadow">
      <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
      <PDFViewer fileUrl={assignment.fileUrl} onViewPage={handleViewPage} />
      <div className="mt-4 text-sm text-gray-600">
        Viewed {viewedPages.length} {viewedPages.length === 1 ? "page" : "pages"}
      </div>
      {assignment.feedback?.[user.uid] && (
        <p className="mt-2 text-sm text-green-700">
          💬 Feedback: {assignment.feedback[user.uid]}
        </p>
      )}
    </div>
  );
}
