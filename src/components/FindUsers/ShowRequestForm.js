import { Header } from "../UI/Header";
import cmpConfig from "./config";

export const ShowRequestForm = (props) => {
  const HeaderTitle = () => {
    return (
      <>
        <span className="inline-block">{props.targetUserDoc.name} さん</span>
        <span className="inline-block">にリクエストを送る</span>
      </>
    );
  };

  return (
    <>
      <Header
        title={<HeaderTitle />}
        backable={true}
        handleBack={() => props.handleViewState(cmpConfig.state.view["002"])}
      />
      <img className="user-icon" src={props.targetUserDoc.photo}></img>
      <div>
        <button className="btn-orange" onClick={props.handleRequest}>
          チケット１枚を消費して<br></br>リクエストを送る
        </button>
        <button
          className="btn-gray"
          onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
        >
          リクエストをキャンセル
        </button>
      </div>
    </>
  );
};
