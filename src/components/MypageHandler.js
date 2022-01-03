import { useContext, useState } from "react";
import { updateUserData } from "../fn/db/updateHandler";

import { cmpConfig } from "./Mypage/config";
import { MypageTop } from "./Mypage/MyPageTop";
import { EditText } from "./Mypage/EditText";
import { AgeOptions } from "./UI/Options";
import { AppRouteContext } from "../AppRoute";

import "../styles/mypage.scss";
import { EditMatchingAge } from "./Mypage/EditMatchingAge";

export const MypageHandler = (props) => {
  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);
  const { eraceModal, showLoadingModal, showConfirmModal } =
    useContext(AppRouteContext);

  const handleUpdateAuthUserDoc = async (
    updateData,
    newModalStateData = null
  ) => {
    showLoadingModal();
    await updateUserData({ ...updateData, uid: props.nowUserDoc.uid });
    newModalStateData ? showConfirmModal(newModalStateData) : eraceModal();
  };

  const handleSubmitToDB = (data) => {
    (async () => {
      //loading 画面を表示
      showLoadingModal();

      let updateData;

      switch (viewState) {
        case cmpConfig.state.view["003"]:
          updateData = { uid: props.nowUserDoc.uid, name: data };
          break;

        case cmpConfig.state.view["004"]:
          updateData = { uid: props.nowUserDoc.uid, age: data };
          break;

        case cmpConfig.state.view["005"]:
          updateData = { uid: props.nowUserDoc.uid, profile: data };
          break;

        default:
          return;
      }

      //アップデートを実行
      await updateUserData(updateData);

      //loadingモーダルを隠す
      eraceModal();

      //myPageTopに遷移
      setViewState(cmpConfig.state.view["001"]);
    })();
  };

  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return (
          <MypageTop
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
            handleExecUpdate={handleUpdateAuthUserDoc}
            nowUserDoc={props.nowUserDoc}
            signOut={props.signOut}
          />
        );

      case cmpConfig.state.view["003"]:
        return (
          <EditText
            viewState={viewState}
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
            pattern=".*\S+.*"
            text={{
              placeholder: "お名前を入力してください。",
            }}
          />
        );

      case cmpConfig.state.view["004"]:
        return (
          <EditText
            viewState={viewState}
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
            inputMode="select"
            defaultValue="under-22"
          >
            <AgeOptions />
          </EditText>
        );

      case cmpConfig.state.view["005"]:
        return (
          <EditText
            viewState={viewState}
            handleViewState={setViewState}
            handleValidate={(str) => {
              if (str.length > 100) return false;
            }}
            handleSubmit={handleSubmitToDB}
            inputMode="textarea"
            text={{
              placeholder: "プロフィールを100文字以内で入力してください。",
            }}
          />
        );

      case cmpConfig.state.view["011"]:
        return (
          <EditMatchingAge
            viewState={viewState}
            handleViewState={setViewState}
          />
        );

      default:
        return undefined;
    }
  };

  return <>{handleView()}</>;
};
