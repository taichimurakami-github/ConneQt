import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  getFirestore,
} from "firebase/firestore";
import { db_name } from "../../firebase.config";
import "./firestore.ready";

const db = getFirestore();

export const updateUserData = async (updateData) => {
  const docRef = doc(db, db_name.user, updateData.uid);
  await updateDoc(docRef, updateData);
};

export const updateChatRoomData = async (sendData) => {
  const docRef = doc(db, db_name.chatRoom, sendData.chatRoomID);
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
