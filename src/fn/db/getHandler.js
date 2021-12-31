import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db_name, firestoreQueryConfig } from "../../firebase.config";
import "./firestore.ready";
const db = getFirestore();

/**
 * user docs から、認証情報に合致するユーザーを取得
 * ただし、見つからなかった場合、nullを返す
 * @param {authData} authData
 * @returns {null | Object}
 */
export const getAuthUserDoc = async (authData) => {
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
export const getRelatedUserDocs = async (userDoc) => {
  console.log("getting related user docs from firestore...");
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
   * userDoc.meta配列内にある要素が一つでも含まれている、自分以外のuserDocを取得
   * 自身に関係があるユーザーを取得する
   * この時、friendやrequestに保持されたuserDocが取得される可能性がある
   */
  const metaUserDocs = {};
  const q = query(
    collection(db, db_name.user),
    where("meta", "array-contains-any", queryMetaData)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    //存在するユーザーのみ抽出
    // 自分以外で、かつreqest.rejectedに含まれていないもののみresultに入れる
    if (
      doc.exists() &&
      data.uid !== userDoc.uid &&
      !userDoc.request.rejected.includes(data.uid)
    ) {
      metaUserDocs[data.uid] = data;
    }
  });

  // console.log("phase1 finished");
  // console.log(metaUserDocs);

  /**
   * fetch phase 2
   * phase1で取得したuserDocのうち、friend, requestに該当するユーザーを抜き出す
   */

  const metaUserUidArray = Object.keys(metaUserDocs);
  const friendUserDocs = {};
  const requestUserDocs = {
    received: {},
    sent: {},
  };

  // console.log("metaUsersUidArray");
  // console.log(metaUserUidArray);

  for (const uid of metaUserUidArray) {
    //friendユーザーだった場合
    //friendUserDocsオブジェクトに該当のuserDocデータを入れる
    //metaUserDocsオブジェクトから該当要素を削除する
    if (uid in userDoc.friend) {
      friendUserDocs[uid] = metaUserDocs[uid];
      delete metaUserDocs[uid];
    }

    //request.receivedユーザーだった場合
    if (userDoc.request.received.includes(uid)) {
      requestUserDocs.received[uid] = metaUserDocs[uid];
      delete metaUserDocs[uid];
    }

    //request.sentユーザーだった場合
    if (userDoc.request.sent.includes(uid)) {
      requestUserDocs.sent[uid] = metaUserDocs[uid];
      delete metaUserDocs[uid];
    }

    //request.rejectedユーザーだった場合
    //metaUserDocから削除するだけ
    if (userDoc.request.rejected.includes(uid)) {
      delete metaUserDocs[uid];
    }
  }

  // console.log("phase2 finished");
  // console.log(metaUserDocs);
  // console.log(friendUserDocs);
  // console.log(requestUserDocs);

  /**
   * fetch phase 3
   * phase 2で取得しきれなかったfriend,requestユーザーを取得する
   * ただし、すでに全てのfreind,requestユーザーを取得していた場合はこのphaseを放棄する
   */

  //まずは取得する必要のあるユーザーuidをカテゴリ別に取得
  const gettingUsersUid = {
    friend: [],
    request: {
      received: [],
      sent: [],
    },
  };

  for (const friendUid of Object.keys(userDoc.friend)) {
    // console.log(userDoc.friend);
    // console.log(friendUid);
    // もしもuserDoc.friend内に格納されているユーザーが、
    // 先ほど取得したデータに入っていなかった場合
    if (!Object.keys(friendUserDocs).includes(friendUid)) {
      //取得処理を行う
      //複数の非同期関数を実行するため、Promise.all()で使用する配列に追加する
      gettingUsersUid.friend.push(friendUid);
    }
  }

  for (const req_receivedUid of userDoc.request.received) {
    // もしもuserDoc.request.received内に格納されているユーザーが、
    // 先ほど取得したデータに入っていなかった場合
    if (!Object.keys(requestUserDocs.received).includes(req_receivedUid)) {
      gettingUsersUid.request.received.push(req_receivedUid);
    }
  }

  for (const req_sentUid of userDoc.request.sent) {
    // もしもuserDoc.request.received内に格納されているユーザーが、
    // 先ほど取得したデータに入っていなかった場合
    if (!Object.keys(requestUserDocs.sent).includes(req_sentUid)) {
      gettingUsersUid.request.sent.push(req_sentUid);
    }
  }

  // console.log("phase3 parsed getiingUsersuid");
  // console.log(gettingUsersUid);

  //取得する必要があるユーザーが存在した場合
  //Promise.allで取得処理を並列で実行
  if (
    gettingUsersUid.friend.length > 0 ||
    gettingUsersUid.request.received.length > 0 ||
    gettingUsersUid.request.sent.length > 0
  ) {
    //docSnap.data()を実行してデータをparseするところまでやってくれる関数
    const getDocSnapDataFromUserDoc = async (uid) => {
      const docRef = doc(db, db_name.user, uid);
      const docSnap = await getDoc(docRef).catch((e) => console.log(e));
      if (docSnap.exists()) {
        console.log(docSnap.data());
        return docSnap.data();
      } else {
        return undefined;
      }
    };
    //取得したUserDocArrayをターゲットのobjectに追加
    const addUserDocArrToObject = (data, obj) => {
      for (const val of data) {
        if (val && val?.uid) obj[val.uid] = val;
      }
    };

    //追加のfriendデータを取得
    if (gettingUsersUid.friend.length > 0) {
      const userDocsArr = await Promise.all(
        gettingUsersUid.friend.map((uid) => getDocSnapDataFromUserDoc(uid))
      ).catch((e) => {
        console.log(
          "error at getRelatedUserDocs(): failed to fetch all userDocs of friend"
        );
        console.log(e);
      });

      addUserDocArrToObject(userDocsArr, friendUserDocs);
    }

    //追加のrequest.receivedデータを取得
    if (gettingUsersUid.request.received.length > 0) {
      const userDocsArr = await Promise.all(
        gettingUsersUid.request.received.map((uid) =>
          getDocSnapDataFromUserDoc(uid)
        )
      ).catch((e) => {
        console.log(
          "error at getRelatedUserDocs(): failed to fetch all userDocs of request.received"
        );
        console.log(e);
      });

      addUserDocArrToObject(userDocsArr, requestUserDocs.received);
    }

    //追加のrequest.sentデータを取得
    if (gettingUsersUid.request.sent.length > 0) {
      const userDocsArr = await Promise.all(
        gettingUsersUid.request.sent.map((uid) =>
          getDocSnapDataFromUserDoc(uid)
        )
      ).catch((e) => {
        console.log(
          "error at getRelatedUserDocs(): failed to fetch all userDocs of request.sent"
        );
        console.log(e);
      });

      addUserDocArrToObject(userDocsArr, requestUserDocs.sent);
    }
  }

  // storeするデータ構造に変換する
  const result = {
    friend: friendUserDocs,
    request: requestUserDocs,
    others: metaUserDocs,
  };

  console.log("relatedUserDocs fetch done");
  console.log(result);
  return result;
};
