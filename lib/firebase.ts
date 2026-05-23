import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB-qlb_QYAPbqijr00XN-PeUd9DTzI0MDs",
  authDomain: "taameeni-v1.firebaseapp.com",
  databaseURL: "https://taameeni-v1-default-rtdb.firebaseio.com",
  projectId: "taameeni-v1",
  storageBucket: "taameeni-v1.firebasestorage.app",
  messagingSenderId: "240999338900",
  appId: "1:240999338900:web:bb73a1ea1239d2c074f581",
  measurementId: "G-MP49WZ65T2"
};

let app: FirebaseApp;
let db: Database;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization error", error);
  throw new Error("Failed to initialize Firebase.");
}

export { db };
export default app;
