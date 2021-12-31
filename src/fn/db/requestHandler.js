import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import "./firestore.ready";

const db = getFirestore();

const sendRequest = async (senderUid, receiverUid) => {
  // create ref
  const senderDocRef = doc(db, "users", senderUid);
  const receiverDocRef = doc(db, "users", receiverUid);

  //リクエスト送信者のUserDocを更新
  //request.sent にリクエスト受信者のuidを入れる
  await updateDoc(senderDocRef, {
    "request.sent": arrayUnion(receiverUid),
  });

  //リクエスト受信者のUserDocを更新
  //request.received にリクエスト送信者のuidを入れる
  await updateDoc(receiverDocRef, {
    "request.received": arrayUnion(senderUid),
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
  await setDoc(doc(db, "chatRoom", chatRoomID), {
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
  const approvingUserDoc = doc(db, "users", approvingUserUid);
  const approvedUserDoc = doc(db, "users", approvedUserUid);

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
  const rejectingUserDocRef = doc(db, "users", rejectingUserUid);
  const rejectedUserDocRef = doc(db, "users", rejectedUserUid);

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

export { sendRequest, approveRequest, rejectRequest };
