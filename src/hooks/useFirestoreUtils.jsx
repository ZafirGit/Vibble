import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const getClassStudents = async (className) => {
  const q = query(collection(db, "users"), where("class", "==", className), where("role", "==", "student"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createAssignment = async ({ title, fileUrl, studentIds, teacherId }) => {
  const assignmentId = `${teacherId}_${Date.now()}`;
  const assignmentDoc = doc(db, "assignments", assignmentId);

  await setDoc(assignmentDoc, {
    title,
    fileUrl,
    studentIds,
    teacherId,
    feedback: {},
    progress: {},
    createdAt: new Date(),
  });

  return assignmentId;
};

export const updateProgress = async (assignmentId, studentId, status) => {
  const assignmentRef = doc(db, "assignments", assignmentId);
  const assignmentSnap = await getDoc(assignmentRef);
  const data = assignmentSnap.data();

  const newProgress = { ...data.progress, [studentId]: status };
  await updateDoc(assignmentRef, { progress: newProgress });
};

export const addFeedback = async (assignmentId, studentId, feedbackText) => {
  const assignmentRef = doc(db, "assignments", assignmentId);
  const assignmentSnap = await getDoc(assignmentRef);
  const data = assignmentSnap.data();

  const newFeedback = { ...data.feedback, [studentId]: feedbackText };
  await updateDoc(assignmentRef, { feedback: newFeedback });
};
