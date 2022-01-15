import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  getFirestore,
  deleteField,
} from "firebase/firestore";
import { db_name } from "../../firebase.config";
import "./firestore.ready";

const db = getFirestore();

export const updateUserData = async (updateDataAndUid) => {
  const updateData = { ...updateDataAndUid };
  delete updateData.uid;
  const docRef = doc(db, db_name.user, updateDataAndUid.uid);
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
  // console.log("...done!");
};

export const updateUserDocObjectData = async (
  mode,
  targetUserUid,
  fieldRef,
  data
) => {
  const docRef = doc(db, db_name.user, targetUserUid);

  switch (mode) {
    case "deleteField":
      return await updateDoc(docRef, {
        [fieldRef]: deleteField(),
      });

    default:
      return;
  }
};
