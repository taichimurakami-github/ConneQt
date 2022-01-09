import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { db_name, firebaseConfig } from "../../firebase.config";
import "./firestore.ready";

const db = getFirestore();

export const registerAuthUserDoc = async (registerDataWithoutMetaArr) => {
  console.log("creating your account...");
  const template = { ...registerDataWithoutMetaArr };
  template.meta = [
    registerDataWithoutMetaArr.hometown.prefecture,
    registerDataWithoutMetaArr.hometown.city,
    registerDataWithoutMetaArr.history.university,
  ];

  //create user doc
  return await setDoc(doc(db, db_name.user, template.uid), template);
};

export const registerUpdateHookForUsers = (uid, setter) => {
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
  return onSnapshot(doc(db, db_name.user, uid), (doc) => {
    console.log("user data updated.");
    console.log(doc.data());
    setter(doc.data());
  });
};

export const registerUpdateHookForChatroom = (chatRoomID, setter) => {
  if (!setter) {
    console.log("UPDATE HOOK SETTER MUST BE A FUNCTION");
    return null;
  }

  console.log(chatRoomID);

  return onSnapshot(doc(db, db_name.chatRoom, chatRoomID), (doc) => {
    console.log("chatroom id=" + chatRoomID + " data updated.");
    console.log(doc.data());
    setter(doc.data());
  });
};

export const registerUserImageToStorage = async (fileData, authUserDoc) => {
  const storage = getStorage();
  const filePath = `users/images/${authUserDoc.uid}`;
  const storageRef = ref(storage, filePath);

  //storageにアップロード
  await uploadString(storageRef, fileData, "data_url");

  //storageからのDownload linkを取得してreturn
  return await getDownloadURL(storageRef).then((url) => url);
};
