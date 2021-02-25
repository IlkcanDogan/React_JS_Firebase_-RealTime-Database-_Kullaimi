importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyAVj7OM71XOed_hKaGLoJzOjjCLhUVqd-Y",
  authDomain: "firewebhostingg.firebaseapp.com",
  databaseURL: "https://firewebhostingg.firebaseio.com",
  projectId: "firewebhostingg",
  storageBucket: "firewebhostingg.appspot.com",
  messagingSenderId: "539561986741",
  appId: "1:539561986741:web:5bcff524d321e714fc0cfc",
  measurementId: "G-6NNS3RJ492"
};

firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});