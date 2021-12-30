import {
  updateDoc,
  doc,
  deleteDoc,
  deleteField,
  arrayUnion,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { db_name } from "../../firebase.config";
import "./firestore.ready";

const db = getFirestore();

const deleteFriend = async (chatRoomID, nowUserData, targetUserData) => {
  const nowUserDocRef = doc(db, db_name.user, nowUserData.uid);
  const targetUserDocRef = doc(db, db_name.user, targetUserData.uid);
  const chatRoomRef = doc(db, db_name.chatRoom, chatRoomID);

  //friend -> request.rejectedへと移行
  await updateDoc(nowUserDocRef, {
    "request.rejected": arrayUnion(targetUserData.uid),
    ["friend." + targetUserData.uid]: deleteField(),
  });

  // request.rejectedへ登録するが、friendからは消さない
  // 退会したユーザーとして見せるため
  await updateDoc(targetUserDocRef, {
    "request.rejected": arrayUnion(nowUserData.uid),
  });

  //チャットルームから、metaDataを消去
  await updateDoc(chatRoomRef, {
    metaData: deleteField(),
  });
};

const deleteAuthUserDoc = async (authUserDoc) => {
  //friendに登録しているchatRoomのディアクティベートも行う
  Object.keys(authUserDoc.friend).map(async (key) => {
    //chatRoomのディアクティベート(metaDataを消去)
    updateDoc(doc(db, "chatRoom", authUserDoc.friend[key].chatRoomID), {
      metaData: deleteField(),
    });
  });

  //authUserDoc削除
  return await deleteDoc(doc(db, db_name.user, authUserDoc.uid));
};

export { deleteFriend, deleteAuthUserDoc };
