import {
  updateDoc,
  doc,
  deleteDoc,
  deleteField,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
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

  /**
   * memo: エラーハンドリングについて
   * resultObject = {
   *  type: "ERROR",
   *  code: appConfig.state.error[""].code
   *  modalContent: {
   *    //モーダル表示コンテンツ
   *  }
   * }
   */
  //friend -> request.rejectedへと移行
  await updateDoc(nowUserDocRef, {
    "request.rejected": arrayUnion(targetUserData.uid),
    ["friend." + targetUserData.uid]: deleteField(),
  });

  /**
   * memo: エラーハンドリングについて
   * resultObject = {
   *  type: "ERROR",
   *  code: appConfig.state.error[""].code
   *  modalContent: {
   *    //モーダル表示コンテンツ
   *  }
   * }
   */
  // request.rejectedへ登録するが、friendからは消さない
  // 退会したユーザーとして見せるため
  await updateDoc(targetUserDocRef, {
    "request.rejected": arrayUnion(nowUserData.uid),
  });

  /**
   * memo: エラーハンドリングについて
   * resultObject = {
   *  type: "ERROR",
   *  code: appConfig.state.error[""].code
   *  modalContent: {
   *    //モーダル表示コンテンツ
   *  }
   * }
   */
  //チャットルームから、metaDataを消去
  return await updateDoc(chatRoomRef, {
    metaData: deleteField(),
  });
};

/**
 * 退会済みのユーザーと、チャットルームを削除
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
  return await deleteDoc(chatRoomRef).catch((e) => console.log(e));
};

/**
 * 該当するチャットルームを削除する
 * @param {ChatRoomDataState} authUserDoc
 */

/**
 * 引数に指定したユーザーをデータベースから削除する
 * @param {UserDoc} authUserDoc
 * @returns
 */
export const deleteAuthUserDoc = async (authUserDoc, chatRoomData) => {
  /**
   * request userDocs関連
   */
  //friendに登録しているchatRoomのディアクティベート、
  //もしくはchatRoomそのものの削除を行う
  for (const key of Object.keys(authUserDoc.friend)) {
    try {
      const chatRoomID = authUserDoc.friend[key].chatRoomID;

      if (chatRoomData[chatRoomID]?.meta) {
        //chatRoomData.chatRoomID.metaが存在
        // >> 該当friendがまだ存在
        // >> chatRoomのディアクティベート(metaDataを消去)
        updateDoc(
          doc(db, db_name.chatRoom, authUserDoc.friend[key].chatRoomID),
          {
            metaData: deleteField(),
          }
        );
      } else {
        //chatRoomData.chatRoomID.metaが存在しない
        // >> 該当friendに既に削除された
        // >> chatRoomそのものを削除
        deleteDoc(doc(db, db_name.chatRoom, chatRoomID));
      }
    } catch (e) {
      console.log(e);
    }
  }

  //requestを送ってきた相手のrequest.sentから自分を消去
  for (const uid of authUserDoc.request.received) {
    try {
      updateDoc(doc(db, db_name.user, uid), {
        "request.sent": arrayRemove(authUserDoc.uid),
      });
    } catch (e) {
      console.log(e);
    }
  }

  //requestを送った相手のrequest.receivedから自分を消去
  for (const uid of authUserDoc.request.sent) {
    try {
      updateDoc(doc(db, db_name.user, uid), {
        "request.received": arrayRemove(authUserDoc.uid),
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * firebase storage関連
   */
  //storageからユーザーアイコン画像を消去
  const storage = getStorage();
  const desertRef = ref(storage, `users/images/${authUserDoc.uid}`);
  deleteObject(desertRef).catch((e) => {
    console.log(e);
  });

  //authUserDoc削除
  await deleteDoc(doc(db, db_name.user, authUserDoc.uid)).catch((e) =>
    console.log(e)
  );
};
