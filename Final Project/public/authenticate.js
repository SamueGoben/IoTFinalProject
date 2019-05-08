const initApp = () => {
    const registryToken = "37d222d8-5b20-4b82-8d37-beef72905b78";
  
    var config = {
        apiKey: "AIzaSyBdkPGfJWImXKOfULwhdymRI8YJ81vCXCg",
        authDomain: "ece597-f2251.firebaseapp.com",
        databaseURL: "https://ece597-f2251.firebaseio.com",
        projectId: "ece597-f2251",
        storageBucket: "ece597-f2251.appspot.com",
        messagingSenderId: "707905504595"
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
  