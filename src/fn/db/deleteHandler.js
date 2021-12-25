import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { userDocTemplate } from "../../firebase.config";
import { getFirestore } from "firebase/firestore";
import "./firestore.ready";

const db = getFirestore();

const deleteFriend = async (chatRoomID, nowUserData, targetUserData) => {
  const nowUserDocRef = doc(db, "users", nowUserData.uid);
  const targetUserDocRef = doc(db, "users", targetUserData.uid);
  const chatRoomRef = doc(db, "chatRoom", chatRoomID);

  //friend -> request.rejectedへと移行...使用と思ってたけど、
  //デバッグ時は普通に消えるだけにしてくれた方が便利なので一旦はこれにする
  //フレンド周りの仕様をどうするかは要検討
  await updateDoc(nowUserDocRef, {
    // "request.rejected": arrayUnion(targetUserUid),
    friend: nowUserData.friend,
  });

  await updateDoc(targetUserDocRef, {
    // "request.rejected": arrayUnion(targetUserUid),
    friend: targetUserData.friend,
  });

  //チャットルームを削除
  await deleteDoc(chatRoomRef);
};

export { deleteFriend };
