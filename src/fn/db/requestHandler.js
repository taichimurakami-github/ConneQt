import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { userDocTemplate } from "../../firebase.config";
import "./firestore.ready";

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

const approveRequest = async () => {};

const rejectRequest = async (rejectingUserUid, rejectedUserUid) => {
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
