import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDyLKEBr9vCndnFtkkzFVm3p0uKAdUq6fs",
  authDomain: "ceara-ar-2.firebaseapp.com",
  databaseURL: "https://ceara-ar-2.firebaseio.com",
  projectId: "ceara-ar-2",
  storageBucket: "ceara-ar-2.appspot.com",
  messagingSenderId: "604044208547"
};

require('firebase/firestore');
require('firebase/storage');

export const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.firestore();
