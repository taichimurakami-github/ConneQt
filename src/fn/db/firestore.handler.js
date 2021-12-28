import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  Timestamp,
  arrayRemove,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db_name, firestoreQueryConfig } from "../../firebase.config";
import "./firestore.ready";
// import "./cloudfunctions.ready";

const db = getFirestore();

/**
 * user docs から、認証情報に合致するユーザーを取得
 * ただし、見つからなかった場合、nullを返す
 * @param {authData} authData
 * @returns {null | Object}
 */
const getAuthUserDoc = async (authData) => {
  console.log(`searching user docs ... where uid = ${authData.uid}`);

  const docRef = doc(db, db_name.user, authData.uid);
  const result = await getDoc(docRef);
  console.log(result.data());

  if (result.exists()) return result.data();
  else return null;
};

/**
 * user docs から、すべての登録ユーザーを取得
 * 見つからなかったら、空の配列を返す
 * @returns {Array}
 */
const getRelatedUserDocs = async (userDoc) => {
  console.log("getting related user docs from firestore...");
  const result = {};
  const queryMetaData = [...userDoc.meta];
  const max_arr_length = firestoreQueryConfig.array_contains_any.max_length;

  //metaDataがもしもfirestoreのarray_contains_any配列の上限を超える長さだったら
  //上限を超えた分の要素を除外する（pop()を使用、後ろから除外）
  if (userDoc.meta.length > max_arr_length) {
    const overLength = userDoc.meta.length - 1 - max_arr_length;

    for (let i = 0; i < overLength; i++) {
      queryMetaData.pop();
    }
  }

  /**
   * fetch phase 1
   * userDoc.meta配列内にある要素が一つでも含まれているuserDocを取得
   * 自身に関係があり、friendやrequestと関係のないユーザーを取得する
   */
  const q = query(
    collection(db, db_name.user),
    where("meta", "array-contains-any", queryMetaData)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // reqest.rejectedに含まれていないもののみresultに入れる
    if (!userDoc.request.rejected.includes(data.uid)) {
      result.others[data.uid] = data;
    }
  });

  console.log(result);
  return result;
};

const registerAuthUserDoc = async (registerDataWithoutMetaArr) => {
  console.log("creating your account...");
  const template = { ...registerDataWithoutMetaArr };
  template.meta = [
    registerDataWithoutMetaArr.hometown.prefecture,
    registerDataWithoutMetaArr.hometown.city,
    registerDataWithoutMetaArr.history.university,
  ];

  //create user doc
  return await setDoc(doc(db, db_name.user, template.uid), template);
};

const updateUserData = async (updateData) => {
  const docRef = doc(db, db_name.user, updateData.uid);
  await updateDoc(docRef, updateData);
};

const registerUpdateHookForUsers = (uid, setter) => {
  console.log("registered updateHook for firestore.");

  if (!uid || typeof uid !== "string") {
    throw new Error(
      "registerUpdateHookForUser Error: uidを引数に正しく指定してください."
    );
  }

  if (!setter) {
    throw new Error(
      "registerUpdateHookUser Error: UserDocを保持するstate用のsetterを正しく指定してください。"
    );
  }

  console.log(uid);
  /**
   * onSnapshot with doc
   * 該当ユーザーのデータベースの読み込みを行う
   * 初回起動時はユーザーデータが "added" 扱いで取得される。
   * それ以降はユーザーデータに変更があったときのみ該当データが取得される。
   */
  return onSnapshot(doc(db, db_name.user, uid), (doc) => {
    console.log("user data updated.");
    console.log(doc.data());
    setter(doc.data());
  });
};

const deleteAuthUserDoc = async (userDoc) => {
  //friend, request系に登録していたユーザーのuserDocに対し、
  //アカウント削除側のuserDoc.uidを該当箇所から削除する
  //ついでにchatRoomの削除も行う
  userDoc.friend.map(async (val) => {
    await updateDoc(doc(db, db_name.user, val.uid), {
      friend: arrayRemove(userDoc.uid),
    });
    //chatRoomの削除
    await deleteDoc(doc(db, db_name.chatRoom, val.chatRoomID));
  });

  userDoc.request.received.map((uid) => {
    updateDoc(doc(db, db_name.user, uid), {
      "request.received": arrayRemove(userDoc.uid),
    });
  });

  userDoc.request.sent.map((uid) => {
    updateDoc(doc(db, db_name.user, uid), {
      "request.sent": arrayRemove(userDoc.uid),
    });
  });

  userDoc.request.rejected.map((uid) => {
    updateDoc(doc(db, db_name.user, uid), {
      "request.rejected": arrayRemove(userDoc.uid),
    });
  });

  //authUserDoc削除
  return await deleteDoc(doc(db, db_name.user, userDoc.uid));
};

const registerUpdateHookForChatroom = (chatRoomID, setter) => {
  if (!setter) {
    console.log("UPDATE HOOK SETTER MUST BE A FUNCTION");
    return null;
  }

  console.log(chatRoomID);

  return onSnapshot(doc(db, db_name.chatRoom, chatRoomID), (doc) => {
    console.log("chatroom id=" + chatRoomID + " data updated.");
    console.log(doc.data());
    setter(doc.data());
  });
};

const updateChatRoomData = async (sendData) => {
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

export {
  getAuthUserDoc,
  registerAuthUserDoc,
  getRelatedUserDocs,
  updateUserData,
  updateChatRoomData,
  registerUpdateHookForUsers,
  registerUpdateHookForChatroom,
  deleteAuthUserDoc,
};
