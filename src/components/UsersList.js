import { useState } from "react";
import { appConfig } from "../app.config";

import "../styles/usersList.scss";

import testicon from "../images/logo-1x.png";
import { Header } from "./Header";
import { useEffect } from "react/cjs/react.development";

const initialListState = [];
const testListState = [
  {
    uid: "testuser001-uid",
    name: "testuser001@gmail.com",
    email: "testuser001@gmail.com",
    profile: "testuser001のプロフィール",
    status: "1",
    photo: testicon,
  },
  {
    uid: "testuser002-uid",
    name: "testuser002@gmail.com",
    email: "testuser002@gmail.com",
    profile: "testuser002のプロフィール",
    status: "1",
    photo: testicon,
  },
  {
    uid: "testuser003-uid",
    name: "testuser003@gmail.com",
    email: "testuser003@gmail.com",
    profile: "testuser003のプロフィール",
    status: "1",
    photo: testicon,
  },
  {
    uid: "testuser004-uid",
    name: "testuser004@gmail.com",
    email: "testuser004@gmail.com",
    profile: "testuser004のプロフィール",
    status: "1",
    photo: testicon,
  },
  {
    uid: "testuser005-uid",
    name: "testuser005@gmail.com",
    email: "testuser005@gmail.com",
    profile: "testuser005のプロフィール",
    status: "1",
    photo: testicon,
  },
]

export const UsersList = (props) => {

  const [listState, setListState] = useState(props.allUsers);

  useEffect(() => {
    if (props.allUsers.length === 0) props.renewUsers();
  }, []);

  useEffect(() => {
    setListState(props.allUsers);
  }, [props.allUsers])

  const handleSelectUser = (e) => {
    //子要素のクリックを無視
    const targetId = e.target.id !== "" ? e.target.id : e.target.parentNode.id;

    if (targetId === "") return;

    //対象のユーザーデータをselectedUserStateに保存
    props.handleSelectUser(listState.filter(val => val.uid === targetId)[0]);

    //ページを更新
    props.handlePageContent(appConfig.pageContents["003"]);
  }

  // useEffect(() => {
  //   (async () => {
  //     setListState(await getAllUserDocs());
  //   })();
  // }, [listState]);

  return (
    <>
      <Header
        title="enspace にいる人一覧"
      />
      <ul className="users-list-wrapper">
        {listState.map((val) => {
          return (
            <li
              id={val.uid}
              className="user-list clickable"
              onClick={handleSelectUser}
              key={val.uid}
            >
              <img className="user-icon" src={val.photo} />
              <div className="text-container">
                <p className="name">{val.name}</p>
                <p className="profile">{val.profile}</p>
              </div>

            </li>
          )
        })}
      </ul>

    </>
  )
}