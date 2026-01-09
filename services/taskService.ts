import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  where,
  query,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const auth = getAuth();
const taskCollection = collection(db, 'tasks');

export const addTask = async (
  title: string,
  description: string,
  isComplete: boolean = false
) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(taskCollection, {
    title,
    description,
    isComplete,
    userId: user.uid,
    createdAt: new Date().toISOString(),
  });
};

export const getAllTasks = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    taskCollection,
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title as string,
      description: data.description as string,
      isComplete: data.isComplete as boolean,
      createdAt: data.createdAt,
    };
  });
};

// 3. READ (Single - for editing)
export const getTaskById = async (id: string) => {
  const docRef = doc(db, 'tasks', id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// 4. UPDATE (Toggle Complete)
export const toggleTaskComplete = async (
  taskId: string,
  currentStatus: boolean
) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    isComplete: !currentStatus,
  });
};

// 5. UPDATE (Edit Details)
export const updateTask = async (
  taskId: string,
  title: string,
  description: string
) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    title,
    description,
  });
};

// 6. DELETE
export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};
