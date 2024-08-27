// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mern-estate-5896a.firebaseapp.com",
	projectId: "mern-estate-5896a",
	storageBucket: "mern-estate-5896a.appspot.com",
	messagingSenderId: "159044294464",
	appId: "1:159044294464:web:b16e12ed3eafa667144ca5"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
