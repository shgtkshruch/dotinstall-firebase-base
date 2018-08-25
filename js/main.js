'use strict';

const config = {
  apiKey: "AIzaSyB4a2DypoEWh2_gkG9MOhp9Jz4k2HAhczE",
  authDomain: "myfirebasechatapp-2fe56.firebaseapp.com",
  databaseURL: "https://myfirebasechatapp-2fe56.firebaseio.com",
  projectId: "myfirebasechatapp-2fe56",
  storageBucket: "myfirebasechatapp-2fe56.appspot.com",
  messagingSenderId: "941607125908"
};
firebase.initializeApp(config);

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true,
});

const collection = db.collection('messages');

const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');

collection.orderBy('created').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const li = document.createElement('li');
      li.textContent = change.doc.data().message;
      messages.appendChild(li);
    }
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const val = message.value.trim();
  if (val === '') return

  message.value = '';
  message.focus();

  collection.add({
    message: val,
    created: firebase.firestore.FieldValue.serverTimestamp(),
  })
    .then(doc => {
      console.log(`${doc.id} added`);
    })
    .catch(error => {
      console.log(error);
    });
});

message.focus();

