import {
  updateDoc,
  doc,
  deleteDoc,
  deleteField,
  arrayUnion,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import "./firestore.ready";

const db = getFirestore();

const deleteFriend = async (chatRoomID, nowUserData, targetUserData) => {
  const nowUserDocRef = doc(db, "users", nowUserData.uid);
  const targetUserDocRef = doc(db, "users", targetUserData.uid);
  const chatRoomRef = doc(db, "chatRoom", chatRoomID);

  //friend -> request.rejectedへと移行
  await updateDoc(nowUserDocRef, {
    "request.rejected": arrayUnion(targetUserData.uid),
    ["friend." + targetUserData.uid]: deleteField(),
  });

  await updateDoc(targetUserDocRef, {
    "request.rejected": arrayUnion(nowUserData.uid),
    ["friend." + nowUserData.uid]: deleteField(),
  });

  //チャットルームを削除
  await deleteDoc(chatRoomRef);
};

export { deleteFriend };
