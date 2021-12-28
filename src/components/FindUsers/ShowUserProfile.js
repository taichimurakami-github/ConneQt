import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { UserProfile } from "../UI/UserProfile";

export const ShowUserProfile = (props) => {
  const HeaderTitle = () => {
    return (
      <>
        <span className="inline-block">{props.targetUserDoc?.name} さん</span>
        <span className="inline-block">のプロフィール</span>
      </>
    );
  };
  return (
    <>
      <Header
        backable={true}
        title={<HeaderTitle />}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />

      <UserProfile userDoc={props.targetUserDoc} />

      <button
        className="btn-orange"
        onClick={() => props.handleViewState(cmpConfig.state.view["003"])}
      >
        リクエストを送る
      </button>
      <button
        className="btn-gray"
        onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
      >
        前のページに戻る
      </button>
    </>
  );
};
