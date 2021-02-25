import * as firebase from 'firebase/app';
import 'firebase/auth';

const app = firebase.initializeApp({
  apiKey: "AIzaSyAVj7OM71XOed_hKaGLoJzOjjCLhUVqd-Y",
  authDomain: "firewebhostingg.firebaseapp.com",
  databaseURL: "https://firewebhostingg.firebaseio.com",
  projectId: "firewebhostingg",
  storageBucket: "firewebhostingg.appspot.com",
  messagingSenderId: "539561986741",
  appId: "1:539561986741:web:5bcff524d321e714fc0cfc",
  measurementId: "G-6NNS3RJ492"
})

export default app;