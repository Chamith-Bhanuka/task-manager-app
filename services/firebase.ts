import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth} from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.API_KEY as string,
    authDomain: process.env.AUTH_DOMAIN as string,
    projectId: process.env.PROJECT_ID as string,
    storageBucket: process.env.STORAGE_BUCKET as string,
    messagingSenderId: process.env.MESSAGING_SENDER_ID as string,
    appId: process.env.APP_ID as string,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app)