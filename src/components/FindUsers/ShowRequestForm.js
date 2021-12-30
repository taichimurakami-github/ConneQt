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
        <p style={{ padding: "10px" }}>
          「友達申請を送る」 ボタンを押すと、 <br></br>
          {" " + props.targetUserDoc.name + " "}
          さんに対して友達申請を送ります。
        </p>
        <p style={{ padding: "10px" }}>
          友達申請が許可されると、下部メニュー「友達一覧」からチャットで会話できます。
        </p>

        <button className="btn-orange" onClick={props.handleRequest}>
          {/* チケット１枚を消費して<br></br>リクエストを送る */}
          友達申請を送る(取り消せません)
        </button>
        <button
          className="btn-gray"
          onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
        >
          友達申請をキャンセル
        </button>
      </div>
    </>
  );
};
