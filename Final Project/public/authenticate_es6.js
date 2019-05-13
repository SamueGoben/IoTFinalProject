// var config = {
//     apiKey: "AIzaSyBdkPGfJWImXKOfULwhdymRI8YJ81vCXCg",
//     authDomain: "ece597-f2251.firebaseapp.com",
//     databaseURL: "https://ece597-f2251.firebaseio.com",
//     projectId: "ece597-f2251",
//     storageBucket: "ece597-f2251.appspot.com",
//     messagingSenderId: "707905504595",

//     clientId: "365411631981-lpvgc54v77jia2aed4naap6orgkve0pq.apps.googleusercontent.com",

//     scopes: [
//           "email",
//           "profile",
//           "https://www.googleapis.com/auth/calendar"
//     ],
//     discoveryDocs: [
//           "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
//     ]
// };
// firebase.initializeApp(config);

// var uiConfig = {
//   signInSuccessUrl: "https://ece597-f2251.firebaseapp.com/index.html", // Assuming you are running on your local machine
//   signInOptions: [
//     {
//       provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//       scopes: config.scopes
//     }
//   ],
//   // Terms of service url.
//   tosUrl: "<your-tos-url>"
// };

// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// // The start method will wait until the DOM is loaded.
// ui.start("#firebaseui-auth-container", uiConfig);

// // This function will trigger when there is a login event
// firebase.auth().onAuthStateChanged(function(user) {
//   console.log(user);
//   // Make sure there is a valid user object
//   if (user) {
//     var script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = "https://apis.google.com/js/api.js";
//     // Once the Google API Client is loaded, you can run your code
//     script.onload = function(e) {
//       // Initialize the Google API Client with the config object
//       gapi.client
//         .init({
//           apiKey: config.apiKey,
//           clientId: config.clientID,
//           discoveryDocs: config.discoveryDocs,
//           scope: config.scopes.join(" ")
//         })
//         // Loading is finished, so start the app
//         .then(function() {
//           // Make sure the Google API Client is properly signed in
//           if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
//             startApp(user);
//           } else {
//             firebase.auth().signOut(); // Something went wrong, sign out
//           }
//         });
//     };
//     // Add to the document
//     document.getElementsByTagName("head")[0].appendChild(script);
//   }
// });

// function startApp(user) {
//   console.log(user);
  
//   // Make sure to refresh the Auth Token in case it expires!
//   firebase.auth().currentUser.getToken()
//   .then(function(){
//    return gapi.client.calendar.events
//     .list({
//       calendarId: "primary",
//       timeMin: new Date().toISOString(),
//       showDeleted: false,
//       singleEvents: true,
//       maxResults: 10,
//       orderBy: "startTime"
//     });
//   })
//   .then(function(response) {
//     console.log(response);
//   });
// }

const initApp = () => {
    const registryToken = "37d222d8-5b20-4b82-8d37-beef72905b78";

    const config = {
      apiKey: "AIzaSyBdkPGfJWImXKOfULwhdymRI8YJ81vCXCg",
      authDomain: "ece597-f2251.firebaseapp.com",
      databaseURL: "https://ece597-f2251.firebaseio.com",
      projectId: "ece597-f2251",
      storageBucket: "ece597-f2251.appspot.com",
      messagingSenderId: "707905504595",
    };
    firebase.initializeApp(config);
  
    const loginDiv = document.getElementById('loginDiv');
    const logoutDiv = document.getElementById('logoutDiv');
    const autoInfo = document.getElementById('authInfo');
  
    const errorCallback = (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error ${errorCode}: ${errorMessage}`);
    };
  
    const login = () => {
      Rosefire.signIn(registryToken, (err, rfUser) => {
        console.log(rfUser);
        firebase.auth().signInWithCustomToken(rfUser.token).catch(errorCallback);
      });
    };
    document.getElementById('login').onclick = login;
    const logout = () => {
      firebase.auth().signOut().catch(errorCallback);
    };
    document.getElementById('logout').onclick = logout;
  
    firebase.auth().onAuthStateChanged((user) => {
      loginDiv.hidden = !!user;
      logoutDiv.hidden = !user;
      autoInfo.innerHTML = `<pre>User: ${user ? user.uid : null}</pre>`;
    });
};
  
window.onload = () => {
    initApp();
};

  