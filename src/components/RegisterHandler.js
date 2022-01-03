import { useContext, useReducer, useState, useEffect } from "react";
import { userDocTemplate } from "../firebase.config";

import { AppRouteContext } from "../AppRoute";
import { registerAuthUserDoc } from "../fn/db/registerHandler";

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
    uid: props?.authState?.uid,
    email: props?.authState?.email,

    // initial value from authState
    name: props?.authState?.displayName,
    photo: props?.authState?.photoURL,

    //set initial value for input
    age: "23",
  });

  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);

  const handleSubmit = (e) => {
    e.preventDefault();

    //DB登録後、登録したデータを取得
    (async () => {
      showLoadingModal();
      try {
        await registerAuthUserDoc({ ...registerUserData });
        props.handleAuthUserDoc(props.authState);
        showConfirmModal({
          content: {
            title: "アカウント登録に成功しました！",
            text: [
              "まずは下部メニュー「見つける」から、",
              "周囲に友達候補がいるか確認しましょう！",
            ],
          },
        });
      } catch (e) {
        showErrorModal({
          content: {
            title: "アカウント登録に失敗しました",
            text: [
              "アクセス権が存在しない可能性があります。",
              "登録には、事前登録フォームでのお申し込みが必要です。",
            ],
          },
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
