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

/**
 * まだ存在しているユーザーのチャットルームを削除
 * @param {*} chatRoomID
 * @param {*} nowUserData
 * @param {*} targetUserData
 */
export const deleteExistingFriend = async (
  chatRoomID,
  nowUserData,
  targetUserData
) => {
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

/**
 * 退会済みのユーザーのチャットルームを削除
 * @param {*} chatRoomID
 * @param {*} nowUserData
 * @param {*} targetUserData
 */
export const deleteWithdrawalFriend = async (
  chatRoomID,
  nowUserData,
  targetUserData
) => {
  const nowUserDocRef = doc(db, db_name.user, nowUserData.uid);
  const chatRoomRef = doc(db, db_name.chatRoom, chatRoomID);

  //friendから消去
  await updateDoc(nowUserDocRef, {
    ["friend." + targetUserData.uid]: deleteField(),
  });

  //チャットルームそのものを消去
  await deleteDoc(chatRoomRef).catch((e) => console.log(e));
};

/**
 * 引数に指定したユーザーをデータベースから削除する
 * @param {UserDoc} authUserDoc
 * @returns
 */
export const deleteAuthUserDoc = async (authUserDoc) => {
  console.log("deleteAuthUserDoc");
  console.log(authUserDoc);

  //friendに登録しているchatRoomのディアクティベートも行う
  const friendsData = Object.keys(authUserDoc.friend);

  friendsData.length > 0 &&
    friendsData.map(async (key) => {
      //chatRoomのディアクティベート(metaDataを消去)
      console.log(key, authUserDoc.friend[key].chatRoomID);
      updateDoc(doc(db, "chatRoom", authUserDoc.friend[key].chatRoomID), {
        metaData: deleteField(),
      });
    });

  //authUserDoc削除
  await deleteDoc(doc(db, db_name.user, authUserDoc.uid)).catch((e) =>
    console.log(e)
  );
};
