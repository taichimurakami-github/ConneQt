import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { userDocTemplate } from "../../firebase.config";
import "./firestore.ready";
import "./cloudfunctions.ready";
import { document } from "firebase-functions";

//get Cloud Firestore
const db = getFirestore();



/**
 * user docs から、認証情報に合致するユーザーを取得
 * ただし、見つからなかった場合、nullを返す
 * @param {authData} authData 
 * @returns {null | Object}
 */
const getAuthUserDoc = async (authData) => {

  console.log(`searching user docs ... where uid = ${authData.uid}`);

  const docRef = doc(db, "users", authData.uid);
  const result = await getDoc(docRef);
  console.log(result.data());

  if (result.exists()) return result.data();
  else return null;
}

/**
 * user docs から、すべての登録ユーザーを取得
 * 見つからなかったら、空の配列を返す
 * @returns {Array}
 */
const getAllUserDocs = async () => {
  console.log("getting all user docs from firestore...");
  const result = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
}

const registerAuthUserDoc = async (authData) => {

  console.log(`now creating new User docs ... DocId = ${authData.uid}`);

  //create template
  const template = { ...userDocTemplate };
  template.name = authData.displayName;
  template.uid = authData.uid;
  template.email = authData.email;
  template.photo = authData.photoURL;

  //create user doc
  const docRef = collection(db, "users");
  await setDoc(doc(docRef, authData.uid), template);
  return template;
}

const updateUserData = async (authData, updateData) => {
  const docRef = doc(db, "users", authData.uid);
  await updateDoc(docRef, updateData);
}

const registerRequest = async (senderData, receiverData) => {
  console.log(`sending request from ${senderData.email} to ${receiverData.uid}`);

  // create doc ref
  const senderDocRef = doc(db, "users", senderData.uid);
  const receiverDocRef = doc(db, "users", receiverData.uid);

  //set user doc
  await setDoc(senderDocRef, senderData);
  await setDoc(receiverDocRef, receiverData);
  console.log("...done!");
}



const registerUpdateHook = (targetDoc) => {
  console.log("registered updateHook for firestore.");
  console.log(targetDoc);

  document(targetDoc)
    .onWrite(((changedDocSnapshot, context) => {
      console.log("registerUpdateHook.js")
      console.log(changedDocSnapshot.data());
      console.log(context);
    }))
};


export {
  getAuthUserDoc,
  registerAuthUserDoc,
  getAllUserDocs,
  updateUserData,
  registerRequest,
  registerUpdateHook,
};