import "./firebase.ready";
import { getAuth, signInWithRedirect, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";

const signInWithGoogle = async () => {

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithRedirect(auth, provider);
    })
    .catch(() => {
      // Handle Errors here.
      console.log("failed to sign in with google.");
      console.log(error);
    });

}

const signOut = () => getAuth().signOut();

export { signInWithGoogle, signOut };