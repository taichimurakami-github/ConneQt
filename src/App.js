// config import
import { appConfig } from "./app.config";

// lib imports

import { useState, useEffect, useContext } from "react";

// components imports
import { FindUserHandler } from "./components/FindUserHandler";
import { FriendHandler } from "./components/FriendHandler";
import { MypageHandler } from "./components/MypageHandler";
import { Menu } from "./components/UI/Menu";

// fn imports
import { getAllUserDocs } from "./fn/db/firestore.handler";
// import handleOnWriteHook from "../functions";

// app common style imports
import "./styles/App.scss";

import { doc, getFirestore, onSnapshot } from "firebase/firestore";

import { AppRouteContext } from "./AppRoute";

export const App = (props) => {
  /**
   * setState definitions
   */
  const { setModalState, eraceModal, authUserDoc, setAuthUserDoc } =
    useContext(AppRouteContext);
  const [allUserDocsState, setAllUserDocsState] = useState([]);
  const [pageContentState, setPageContentState] = useState(
    appConfig.pageContents["001"]
  );
  const [chatRoomDataState, setChatRoomDataState] = useState({});

  /**
   * useEffect functions
   */

  useEffect(() => {
    (async () => {
      // FInd Usersを表示コンテンツに指定
      setPageContentState(appConfig.pageContents["002"]);

      setAllUserDocsState(await getAllUserDocs(authUserDoc));
    })();
  }, []);

  useEffect(() => {
    //chatRoomDataStateのUpdateHookを登録

    authUserDoc.friend.length > 0 &&
      (async () => {
        const db = getFirestore();

        const chatroom_unSubFuncArr = authUserDoc.friend.map((val) => {
          return onSnapshot(doc(db, "chatRoom", val.chatRoomID), (doc) => {
            console.log("chatroom " + val.chatRoomID + " has been updated.");

            const newData = {
              ...chatRoomDataState,
            };
            newData[val.chatRoomID] = doc.data();

            console.log(newData);

            setChatRoomDataState(newData);
          });
        });

        //authUserStateにunsubFuncを登録
        props.registerUnsubFunc(chatroom_unSubFuncArr, "chatRoom");
      })();
  }, [authUserDoc.friend]);

  /**
   * handle Page Content(Main content) by appConfig.pageContents data
   * @param {string} id
   * @returns
   */
  const handlePageContent = (id) => {
    switch (id) {
      //SIGN_UP
      // case appConfig.pageContents["001"]:
      //   return <SignUp />;

      //USERS_LIST
      case appConfig.pageContents["002"]:
        return (
          <FindUserHandler
            nowUserDoc={authUserDoc}
            allUserDocs={allUserDocsState}
            handleAllUserDocsState={setAllUserDocsState}
            handlePageContent={setPageContentState}
          />
        );

      case appConfig.pageContents["003"]:
        return (
          <FriendHandler
            nowUserDoc={authUserDoc}
            allUserDocs={allUserDocsState}
            chatRoomData={chatRoomDataState}
          />
        );

      case appConfig.pageContents["004"]:
        return (
          <MypageHandler
            eraceModal={eraceModal}
            nowUserDoc={authUserDoc}
            signOut={props.signOutFromApp}
          />
        );

      default:
        return undefined;
    }
  };

  /**
   * render
   */
  return (
    <div className="App">
      {handlePageContent(pageContentState)}
      <div className="spacer" style={{ height: "100px" }}></div>
      {authUserDoc && (
        <Menu
          pageContentState={pageContentState}
          handlePageContent={setPageContentState}
        />
      )}
    </div>
  );
};

// const getAllUserDocsSnapshot = async (setter) => {
//   const db = getFirestore();
//   return onSnapshot(collection(db, "users"), (snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === "added") {
//         console.log("New UserDoc: ", change.doc.data());
//         const newAllUserDocs = [...allUserDocsState];
//         const changedDocData = change.doc.data();
//         newAllUserDocs[changedDocData.uid] = changedDocData;
//         for (let i = 0; i < newAllUserDocs.length; i++) {
//           if (newAllUserDocs[i].uid === changedDocData.uid) {
//             newAllUserDocs[i] = changedDocData;
//             break;
//           }
//         }
//         setter(newAllUserDocs);
//       }
//       if (change.type === "modified") {
//         const newAllUserDocs = [...allUserDocsState];
//         const changedDocData = change.doc.data();
//         newAllUserDocs[changedDocData.uid] = changedDocData;
//         for (let i = 0; i < newAllUserDocs.length; i++) {
//           if (newAllUserDocs[i].uid === changedDocData.uid) {
//             newAllUserDocs[i] = changedDocData;
//             break;
//           }
//         }
//         console.log("Modified UserDoc: ", change.doc.data());
//         setter(newAllUserDocs);
//       }
//       if (change.type === "removed") {
//         console.log("Removed UserDoc: ", change.doc.data());
//         const newAllUserDocs = [...allUserDocsState];
//         delete newAllUserDocs[change.doc.data().uid];
//         setter(newAllUserDocs);
//       }
//     });
//   });
// };
