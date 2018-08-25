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
const auth = firebase.auth();
let me = null;

const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
const login = document.getElementById('login');
const logout = document.getElementById('logout');

login.addEventListener('click', () => {
  auth.signInAnonymously();
});

logout.addEventListener('click', () => {
  auth.signOut();
});

auth.onAuthStateChanged(user => {
  if (user) {
    me = user;
    collection.orderBy('created').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const li = document.createElement('li');
          const d = change.doc.data();
          li.textContent = d.uid.substr(0, 8) + ': ' + d.message;
          messages.appendChild(li);
        }
      });
    });
    console.log(`Logged in as: ${user.uid}`);

    login.classList.add('hidden');

    [logout, form, messages].forEach(el => {
      el.classList.remove('hidden');
    });

    message.focus();

    return;
  }
  me = null;

  console.log('Nobody is logged in');

  login.classList.remove('hidden');

  [logout, form, messages].forEach(el => {
    el.classList.add('hidden');
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
    uid: me ? me.uid : 'nobody',
  })
    .then(doc => {
      console.log(`${doc.id} added`);
    })
    .catch(error => {
      console.log(error);
    });
});

