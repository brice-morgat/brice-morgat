import { Component } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'brice-morgat';

  constructor() {
    var firebaseConfig = {
      apiKey: "AIzaSyCsevW1QpOdffa8GVFc0DStbo5dzeIVHLU",
      authDomain: "brice-morgat.firebaseapp.com",
      databaseURL: "https://brice-morgat-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "brice-morgat",
      storageBucket: "brice-morgat.appspot.com",
      messagingSenderId: "559007282130",
      appId: "1:559007282130:web:3052e78b8968452988ce0b",
      measurementId: "G-SPEGE675VW"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }
}
