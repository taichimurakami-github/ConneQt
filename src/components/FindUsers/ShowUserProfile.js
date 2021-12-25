import "../../styles/userProfile.scss";
import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { UserProfile } from "../UI/UserProfile";

export const ShowUserProfile = (props) => {
  return (
    <>
      <Header
        backable={true}
        title={`${props.targetUserDoc?.name} さんのプロフィール`}
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
