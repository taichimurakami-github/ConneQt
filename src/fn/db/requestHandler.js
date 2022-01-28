import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { db_name } from "../../firebase.config";
import "./firestore.ready";

const db = getFirestore();

const sendRequest = async (senderUid, receiverUid) => {
  // create ref
  const senderDocRef = doc(db, db_name.user, senderUid);
  const receiverDocRef = doc(db, db_name.user, receiverUid);

  //リクエスト受信者のUserDocを更新
  //request.received にリクエスト送信者のuidを入れる
  await updateDoc(receiverDocRef, {
    "request.received": arrayUnion(senderUid),
  });

  //リクエスト送信者のUserDocを更新
  //request.sent にリクエスト受信者のuidを入れる
  await updateDoc(senderDocRef, {
    "request.sent": arrayUnion(receiverUid),
  });

  console.log("...done!");
  return true;
};

//自分のupdateDocは最後に実行！
const approveRequest = async (approvingUserUid, approvedUserUid) => {
  /**
   * チャットルームを作成
   */

  //チャットルームIDを作成
  const chatRoomID =
    new Date().getTime().toString(16) +
    Math.floor(1000 * Math.random()).toString(16);

  //チャットルームの雛形を作成 && チャットルームを開設
  await setDoc(doc(db, db_name.chatRoom, chatRoomID), {
    data: [],
    metaData: {
      user01: approvingUserUid,
      user02: approvedUserUid,
    },
  });

  /**
   * userDocを更新
   */

  // create ref
  const approvingUserDoc = doc(db, db_name.user, approvingUserUid);
  const approvedUserDoc = doc(db, db_name.user, approvedUserUid);

  // リクエストを許可される側のUserDocを更新
  // request.sent からリクエスト受信者のuidを削除 >> friendに追加
  await updateDoc(approvedUserDoc, {
    "request.sent": arrayRemove(approvingUserUid),
    ["friend." + approvingUserUid]: { chatRoomID: chatRoomID },
  });

  // リクエストを許可する側のUserDocを更新
  // request.received からリクエスト送信者のuidを削除 >> friendに追加
  await updateDoc(approvingUserDoc, {
    "request.received": arrayRemove(approvedUserUid),
    ["friend." + approvedUserUid]: { chatRoomID: chatRoomID },
  });
};

//自分のupdateDocを最初に実行！！
const rejectRequest = async (rejectingUserUid, rejectedUserUid) => {
  /**
   * userDocを更新する準備
   */

  // create ref
  const rejectingUserDocRef = doc(db, db_name.user, rejectingUserUid);
  const rejectedUserDocRef = doc(db, db_name.user, rejectedUserUid);

  // リクエストを拒否する側のUserDocを更新
  // request.received からリクエスト送信者のuidを削除 >> request.rejectedに追加
  await updateDoc(rejectingUserDocRef, {
    "request.received": arrayRemove(rejectedUserUid),
    "request.rejected": arrayUnion(rejectedUserUid),
  });

  // リクエストを拒否される側のUserDocを更新
  // request.sent からリクエスト受信者のuidを削除 >> request.rejectedに追加
  await updateDoc(rejectedUserDocRef, {
    "request.sent": arrayRemove(rejectingUserUid),
    "request.rejected": arrayUnion(rejectingUserUid),
  });

  return true;
};

const deleteNonExistenceRequestSentUser = async (nowUserUid, targetUid) => {
  const authUserRef = doc(db, db_name.user, nowUserUid);

  // リクエストを拒否される側のUserDocを更新
  // request.sent からリクエスト受信者のuidを削除 >> request.rejectedに追加
  await updateDoc(authUserRef, {
    "request.sent": arrayRemove(targetUid),
    "request.rejected": arrayUnion(targetUid),
  });
};

export {
  sendRequest,
  approveRequest,
  rejectRequest,
  deleteNonExistenceRequestSentUser,
};
