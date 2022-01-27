import { useContext, useReducer, useState, useEffect } from "react";
import { userDocTemplate } from "../firebase.config";

import { AppRouteContext } from "../AppRoute";
import {
  registerAuthUserDoc,
  registerUserImageToStorage,
} from "../fn/db/registerHandler";

import { cmpConfig } from "./Register/config";
import { InputBasicData } from "./Register/InputBasicData";
import { InputHometownData } from "./Register/InputHometownData";
import { InputHistoryData } from "./Register/InputHistoryData";
import { ConfirmInputData } from "./Register/ConfirmInputData";
import { InputNowLocationData } from "./Register/InputNowLocationData";

import "../styles/Register.scss";

const userDataReducerFunc = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        ...action.value,
      };

    default:
      throw new Error("dispatchUserData(): undefined action.type");
  }
};

export const RegisterHandler = (props) => {
  const { eraceModal, showLoadingModal, showConfirmModal, showErrorModal } =
    useContext(AppRouteContext);
  const [registerUserData, dispatchUserData] = useReducer(userDataReducerFunc, {
    // auto complete meta data
    ...userDocTemplate,
    uid: props.authState?.uid,
    email: props.authState?.email,

    // initial value from authState
    name: props.authState?.displayName,
    photo: props.authState?.photoURL,

    //set initial value for input
    birthday: { y: "1995", m: "1", d: "1" },
    gender: "male",

    // user icon set from device data
    photoData: undefined,
  });

  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);

  const handleSubmit = (e) => {
    e.preventDefault();

    //DB登録後、登録したデータを取得
    (async () => {
      showLoadingModal();
      try {
        //登録用データとして入力データをコピー
        const submitUserData = { ...registerUserData };

        //任意に設定したユーザーアイコンデータがある場合
        if (registerUserData.photoData) {
          //storageにデータを格納し、該当データへのdownload linkを取得
          submitUserData.photo = await registerUserImageToStorage(
            registerUserData.photoData,
            props.authState
          );
        }

        //photoData(file APIデータ)を削除
        delete submitUserData.photoData;

        //firestoreにuserDocを登録
        await registerAuthUserDoc(submitUserData);

        //appRoute.authStateを設定 >> 自動ログイン処理
        props.handleAuthUserDoc(props.authState);
      } catch (e) {
        console.log(e);

        //登録画面の最初に戻す
        setViewState(cmpConfig.state.view["001"]);

        //エラーメッセージを表示
        showErrorModal({
          content: {
            title: "アカウント登録に失敗しました",
            text: [
              "お手数ですが、アカウント登録作業をやり直してください。",
              "登録ができない場合、下記メールアドレスまでご連絡ください。",
            ],
          },
          children: (
            <>
              <a
                className="orange"
                style={{ display: "block", margin: "10px auto;" }}
                href="mailto:conneqtu@gmail.com"
              >
                conneqtu@gmail.com
              </a>
              <button className="btn-gray btn-close" onClick={eraceModal}>
                閉じる
              </button>
            </>
          ),
        });
      }
    })();
  };

  useEffect(() => {
    showConfirmModal({
      content: {
        title: "Hey! へようこそ！",
        text: [
          "新規アカウントへの情報登録を行います。",
          "必要な情報を入力し、「次へ進む」を押してください。",
        ],
      },
    });
  }, []);

  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return (
          <InputBasicData
            registerUserData={registerUserData}
            dispatchUserData={dispatchUserData}
            handleGoNext={() => {
              setViewState(cmpConfig.state.view["002"]);
            }}
            handleGoBack={() => {
              props.handleSignOut();
            }}
          />
        );

      case cmpConfig.state.view["002"]:
        return (
          <InputHometownData
            registerUserData={registerUserData}
            dispatchUserData={dispatchUserData}
            handleGoNext={() => {
              setViewState(cmpConfig.state.view["003"]);
            }}
            handleGoBack={() => {
              setViewState(cmpConfig.state.view["001"]);
            }}
          />
        );

      case cmpConfig.state.view["003"]:
        return (
          <InputHistoryData
            registerUserData={registerUserData}
            dispatchUserData={dispatchUserData}
            handleGoNext={() => {
              setViewState(cmpConfig.state.view["004"]);
            }}
            handleGoBack={() => {
              setViewState(cmpConfig.state.view["002"]);
            }}
          />
        );

      case cmpConfig.state.view["004"]:
        return (
          <InputNowLocationData
            registerUserData={registerUserData}
            dispatchUserData={dispatchUserData}
            handleGoNext={() => {
              setViewState(cmpConfig.state.view["005"]);
            }}
            handleGoBack={() => {
              setViewState(cmpConfig.state.view["003"]);
            }}
          />
        );

      case cmpConfig.state.view["005"]:
        return (
          <ConfirmInputData
            registerUserData={registerUserData}
            dispatchUserData={dispatchUserData}
            handleViewState={setViewState}
            handleGoBack={() => {
              setViewState(cmpConfig.state.view["004"]);
            }}
            handleSubmit={handleSubmit}
          />
        );

      default:
        return undefined;
    }
  };

  return <>{handleView()}</>;
};
