import { initializeApp } from 'firebase/app';
// getAuth hata kar hum naye tools laa rahe hain
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// AsyncStorage ka naya tool
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
apiKey: "AIzaSyBSzg6XyDZHXcSz0iFEZfDukGeQQbLyjtU",
authDomain: "motogram-d02ea.firebaseapp.com",
projectId: "motogram-d02ea",
storageBucket: "motogram-d02ea.firebasestorage.app",
messagingSenderId: "796396169499",
appId: "1:796396169499:web:0bc928e4af8ab6943f4bbe",
measurementId: "G-DXY0HL6Y1L"
};

const app = initializeApp(firebaseConfig);

// Yeh code user ko humesha logged in rakhega!
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);