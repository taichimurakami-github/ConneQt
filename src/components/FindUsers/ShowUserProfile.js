import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { UserProfile } from "../UI/UserProfile";
import { useContext } from "react";
import { AppRouteContext } from "../../AppRoute";

export const ShowUserProfile = (props) => {
  const { showErrorModal } = useContext(AppRouteContext);

  const HeaderTitle = () => {
    return (
      <>
        <span className="inline-block">{props.targetUserDoc?.name} さん</span>
        <span className="inline-block">のプロフィール</span>
      </>
    );
  };

  const handleGoRequestFormPage = () => {
    const requestReceivedUids = [...props.nowUserDoc.request.received];
    const targetUserUid = props.targetUserDoc.uid;

    //ボタンを押した際に、すでに相手からリクエストが届いている場合
    if (requestReceivedUids.includes(targetUserUid)) {
      showErrorModal({
        content: {
          title: "すでにこのユーザーから友達申請が届いています！",
          text: ["届いた申請は「友達一覧」ページより確認可能です。"],
        },
      });
    } else {
      props.handleViewState(cmpConfig.state.view["003"]);
    }
  };

  return (
    <>
      <Header
        backable={true}
        title={<HeaderTitle />}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />
      <div className="app-view-container">
        <UserProfile userDoc={props.targetUserDoc} />

        <button className="btn-orange" onClick={handleGoRequestFormPage}>
          リクエストを送る
        </button>
        <button
          className="btn-gray"
          onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
        >
          前のページに戻る
        </button>
      </div>
    </>
  );
};
