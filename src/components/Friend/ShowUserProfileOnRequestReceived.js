import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { UserProfile } from "../UI/UserProfile";

export const ShowUserProfileOnRequestReceived = (props) => {
  return (
    <>
      <Header
        backable={true}
        title={`${props.targetUserDoc?.name} さんのプロフィール`}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />
      <div className="app-view-container">
        <UserProfile userDoc={props.targetUserDoc} />

        <button className="btn-orange" onClick={props.handleApproveRequest}>
          リクエストを許可する
        </button>
        <button className="btn-gray" onClick={props.handleRejectRequest}>
          リクエストを拒否する
        </button>
      </div>
    </>
  );
};
