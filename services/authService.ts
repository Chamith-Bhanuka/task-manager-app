import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(userCredential.user, { displayName: fullName });
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    name: fullName,
    role: '',
    email,
    createAt: new Date(),
  });
  return userCredential.user;
};

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  await signOut(auth);
  await AsyncStorage.clear();
  return;
};
