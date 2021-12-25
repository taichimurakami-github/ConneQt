import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { userDocTemplate } from "../../firebase.config";
import { getFirestore } from "firebase/firestore";
import "./firestore.ready";

const db = getFirestore();

const sendRequest = async (senderUid, receiverUid) => {
  // create ref
  const senderDocRef = doc(db, "users", senderUid);
  const receiverDocRef = doc(db, "users", receiverUid);

  //update sender user doc
  //リクエスト送信者のUserDocを更新
  //request.sent にリクエスト受信者のuidを入れる
  await updateDoc(senderDocRef, {
    request: {
      sent: arrayUnion(receiverUid),
    },
  });

  //update receiver user doc
  //リクエスト受信者のUserDocを更新
  //request.received にリクエスト送信者のuidを入れる
  await updateDoc(receiverDocRef, {
    request: {
      received: arrayUnion(senderUid),
    },
  });

  console.log("...done!");
  return true;
};

const approveRequest = async (approvingUserUid, approvedUserUid) => {
  //チャットルームを作成する準備
  //チャットルームIDを作成
  const chatRoomID =
    new Date().getTime().toString(16) +
    Math.floor(1000 * Math.random()).toString(16);

  //チャットルームの雛形を作成
  const chatRoomInitialTemplate = {
    data: [],
    metaData: {
      user01: approvingUserUid,
      user02: approvedUserUid,
    },
  };

  //チャットルームを開設
  await setDoc(doc(db, "chatRoom", chatRoomID), chatRoomInitialTemplate);

  // create ref
  const approvingUserDoc = doc(db, "users", approvingUserUid);
  const approvedUserDoc = doc(db, "users", approvedUserUid);

  // リクエストを許可する側のUserDocを更新
  // request.received からリクエスト送信者のuidを削除 >> friendに追加
  await updateDoc(rejectingUserDocRef, {
    request: {
      received: arrayRemove(approvedUserUid),
    },
    friend: arrayUnion([approvingUserUid, chatRoomID]),
  });

  // リクエストを許可される側のUserDocを更新
  // request.sent からリクエスト受信者のuidを削除 >> friendに追加
  await updateDoc(rejectedUserDocRef, {
    request: {
      sent: arrayRemove(rejectingUserUid),
      rejected: arrayUnion(rejectingUserUid),
    },
    friend: arrayUnion([approvingUserUid, chatRoomID]),
  });

  return true;
};

const rejectRequest = async (rejectingUserUid, rejectedUserUid) => {
  // create ref
  const rejectingUserDocRef = doc(db, "users", rejectingUserUid);
  const rejectedUserDocRef = doc(db, "users", rejectedUserUid);

  // リクエストを拒否する側のUserDocを更新
  // request.received からリクエスト送信者のuidを削除 >> request.rejectedに追加
  await updateDoc(rejectingUserDocRef, {
    request: {
      received: arrayRemove(rejectedUserUid),
      rejected: arrayUnion(rejectedUserUid),
    },
  });

  // リクエストを拒否される側のUserDocを更新
  // request.sent からリクエスト受信者のuidを削除 >> request.rejectedに追加
  await updateDoc(rejectedUserDocRef, {
    request: {
      sent: arrayRemove(rejectingUserUid),
      rejected: arrayUnion(rejectingUserUid),
    },
  });

  return true;
};

export { sendRequest, approveRequest, rejectRequest };
