import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  db_name,
  firebaseConfig,
  firestoreQueryConfig,
} from "../../firebase.config";
import { splitArray } from "../util/splitArray";
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
 * 第一引数内に含まれているuidに該当する全てのユーザのuserDocを取得
 * @param {[string]} uidArray
 * @param {Object} options
 * @returns {UserDocsObject}
 */
export const getUserDocsByDataArray = async (
  dataArray,
  options = {
    where: {
      target: "uid",
      operator: "in",
    },
  }
) => {
  //uidArray > array-contains.maxlengthの場合を考慮し、
  //配列の最大長がarray-contains.maxlengthとなるようなqueryExecParsedAOAを作成
  const queryExecParsedAOA = splitArray(
    dataArray,
    firestoreQueryConfig.array_max_length
  );

  const result = {};

  //分割したqueryExecParsedArray全てに対し、fetchを実行
  for (const queryExecArray of queryExecParsedAOA) {
    const q = query(
      collection(db, db_name.user),
      where(options.where.target, options.where.operator, queryExecArray)
    );

    //userDocsを取得
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //データが存在する時のみresultへ入れる
      if (doc.exists()) {
        const data = doc.data();
        result[data.uid] = data;
      }
    });
  }

  //取得できなかったユーザーはundefinedで置換
  //ただし、where.targetがuid以外の時はこれに該当しない
  for (const uid of dataArray) {
    if (!result.hasOwnProperty(uid) && options.where.uid === "uid")
      result[uid] = undefined;
  }

  return result;
};

/**
 * user docs から、すべての登録ユーザーを取得
 * @param {userDocObject} userDoc
 * @returns {UserDocsObject}
 */
export const getRelatedUserDocs = async (userDoc) => {
  console.log("getting related user docs from firestore...");

  /**
   * fetch phase 1
   * userDoc.meta配列内にある要素が一つでも含まれている、自分以外のuserDocを取得
   * 自身に関係があるユーザーを取得する
   * この時、friendやrequestに保持されたuserDocが取得される可能性がある
   */

  //とりあえずmetaデータと相関のあるユーザー全て抽出
  const metaUserDocs = await getUserDocsByDataArray(userDoc.meta, {
    where: {
      target: "meta",
      operator: "array-contains-any",
    },
  });

  // 自分以外と、reqest.rejectedに含まれているユーザーは消去する
  for (const uid of Object.keys(metaUserDocs)) {
    if (uid === userDoc.uid || userDoc.request.rejected.includes(uid)) {
      delete metaUserDocs[uid];
    }
  }

  // console.log("phase1 finished");
  // console.log(metaUserDocs);

  /**
   * fetch phase 2
   * phase1で取得したuserDocのうち、friend, requestに該当するユーザーを抜き出す
   */
  //まだ取得できていない、relatedUserDocのuid
  const gettingUidArray = [];

  //authUserDocに関連した全てのuserDocのuid
  const relatedUsersUidArray = [
    ...Object.keys(userDoc.friend),
    ...userDoc.request.received,
    ...userDoc.request.sent,
  ];

  //metaDataに入っていないuidをgettingUidArrayに保持
  for (const uid of relatedUsersUidArray) {
    !metaUserDocs.hasOwnProperty(uid) && gettingUidArray.push(uid);
  }

  // console.log("phase2 finished");
  // console.log(gettingUidArray);

  /**
   * fetch phase 3
   * phase 2で取得しきれなかったfriend,requestユーザーがいれば新たに取得
   * 取得できていないfriendユーザーのみ、undefinedを入れる
   * userDocsObjectを作成してreturn
   */

  const newUserDocs =
    gettingUidArray.length > 0
      ? await getUserDocsByDataArray(gettingUidArray)
      : {};
  const result = { ...metaUserDocs, ...newUserDocs };

  // console.log("relatedUserDocs fetch done");
  // console.log(newUserDocs);
  // console.log(result);
  return result;
};
