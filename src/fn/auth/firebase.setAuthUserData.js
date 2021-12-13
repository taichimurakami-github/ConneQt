import { getAuth, onAuthStateChanged } from "firebase/auth";

export const setAuthStateHandler = (setter) => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("you have signed in!");
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log(user);
      setter(true);
      // ...
    } else {
      // User is signed out
      // ...
      console.log("you have signed out!");
      setter(false);
    }
  });
}