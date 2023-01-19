// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJ_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// initialize Firebase
const app = initializeApp(firebaseConfig);
// if build target is development, enable appcheck debug token
if (import.meta.env.VITE_APPCHECK_PROD === "0") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = "221E1FBC-F27A-42E1-BB99-F1C6D220E9F9";
}
// initialize AppCheck
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_reCAPTCHA_SITE_KEY),
  // SDK automatically refreshes App Check tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

// export vars
const db = getFirestore(app);
const auth = getAuth(app);

signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    // Error
    console.log(error);
  });

export { db, auth };
