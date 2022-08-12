import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDTFMtu11PhMo5pcqx_pUZkRD70ETnZmgc",
    authDomain: "vue-test-bcdab.firebaseapp.com",
    projectId: "vue-test-bcdab",
    storageBucket: "vue-test-bcdab.appspot.com",
    messagingSenderId: "717590562874",
    appId: "1:717590562874:web:4bb07a035eb30fad130d03",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
