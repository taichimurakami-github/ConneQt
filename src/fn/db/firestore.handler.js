import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { userDocTemplate } from "../../firebase.config";
import "./firestore.ready";
// import "./cloudfunctions.ready";

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
};

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
};

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
};

const updateUserData = async (updateData) => {
  const docRef = doc(db, "users", updateData.uid);
  await updateDoc(docRef, updateData);
};

const registerUpdateHookForUsers = (uid, setter) => {
  console.log("registered updateHook for firestore.");

  if (!uid || typeof uid !== "string") {
    throw new Error(
      "registerUpdateHookForUser Error: uidを引数に正しく指定してください."
    );
  }

  if (!setter) {
    throw new Error(
      "registerUpdateHookUser Error: UserDocを保持するstate用のsetterを正しく指定してください。"
    );
  }

  console.log(uid);
  /**
   * onSnapshot with doc
   * 該当ユーザーのデータベースの読み込みを行う
   * 初回起動時はユーザーデータが "added" 扱いで取得される。
   * それ以降はユーザーデータに変更があったときのみ該当データが取得される。
   */
  return onSnapshot(doc(db, "users", uid), (doc) => {
    console.log("user data updated.");
    console.log(doc.data());
    setter(doc.data());
  });

  /**
   * onSnapshot with collection
   * users collection内のすべてのデータの読み込みを行う
   * 初回起動時はすべてのユーザーが "added" 扱いで取得されるよう。
   * つまり、
   * 初回起動時 -> change.type="added" && getAllUserData()
   * それ以降 -> users collection 内のデータが更新されたら、更新されたデータを自動でとってくる
   */

  // return onSnapshot(collection(db, "users"), (snapshot) => {
  //   snapshot.docChanges().forEach((change) => {
  //     if (change.type === "added") {
  //       console.log("New city: ", change.doc.data());
  //     }
  //     if (change.type === "modified") {
  //       console.log("Modified city: ", change.doc.data());
  //     }
  //     if (change.type === "removed") {
  //       console.log("Removed city: ", change.doc.data());
  //     }
  //   });
  // });

  // document(targetDoc)
  //   .onWrite(((changedDocSnapshot, context) => {
  //     console.log("registerUpdateHook.js")
  //     console.log(changedDocSnapshot.data());
  //     console.log(context);
  //   }))
};

const registerUpdateHookForChatroom = (chatRoomID, setter) => {
  if (!setter) {
    console.log("UPDATE HOOK SETTER MUST BE A FUNCTION");
    return null;
  }

  console.log(chatRoomID);

  return onSnapshot(doc(db, "chatRoom", chatRoomID), (doc) => {
    console.log("chatroom id=" + chatRoomID + " data updated.");
    console.log(doc.data());
    setter(doc.data());
  });
};

const updateChatRoomData = async (sendData) => {
  const docRef = doc(db, "chatRoom", sendData.chatRoomID);
  const dateTime = Timestamp.now();

  //set user doc
  await updateDoc(docRef, {
    data: arrayUnion({
      uid: sendData.uid,
      text: sendData.text,
      sentAt: dateTime,
    }),
  });
  console.log("...done!");
};

export {
  getAuthUserDoc,
  registerAuthUserDoc,
  getAllUserDocs,
  updateUserData,
  updateChatRoomData,
  registerUpdateHookForUsers,
  registerUpdateHookForChatroom,
};
