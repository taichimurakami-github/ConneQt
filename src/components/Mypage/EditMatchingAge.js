import { useContext, useState } from "react";
import { AppRouteContext } from "../../AppRoute";
import { updateUserData } from "../../fn/db/updateHandler";

import { cmpConfig } from "./config";
import { Header } from "../UI/Header";
import { ControlledInputText } from "../UI/InputText";
import { MatchingAgeDiffOptions } from "../UI/Options";

export const EditMatchingAge = (props) => {
  const { authUserDoc, showLoadingModal, showConfirmModal, showErrorModal } =
    useContext(AppRouteContext);
  const [overAgeRestriction, setOverAgeRestriction] = useState(
    authUserDoc?.setting?.matching?.age?.diff?.plus || ""
  );
  const [belowAgeRestriction, setBelowAgeRestriction] = useState(
    authUserDoc?.setting?.matching?.age?.diff?.minus || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAbleToSubmit()) return;

    (async () => {
      try {
        showLoadingModal();
        await updateUserData({
          uid: authUserDoc.uid,
          "setting.matching.age.diff": {
            plus: Number(overAgeRestriction),
            minus: Number(belowAgeRestriction),
          },
        });
        showConfirmModal({
          content: {
            title: "更新に成功しました。",
          },
        });
      } catch (e) {
        console.log(e);
        showErrorModal({
          content: {
            title: "データの更新に失敗しました。",
            text: ["お手数ですがもう一度やり直してください。"],
          },
        });
      }
      props.handleViewState(cmpConfig.state.view["001"]);
    })();
  };

  const isAbleToSubmit = () => {
    return (
      overAgeRestriction !== props.defaultValue.plus ||
      belowAgeRestriction !== props.defaultValue.minus
    );
  };

  return (
    <>
      <Header
        title="マッチング年齢幅を設定"
        backable={true}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />

      <form className="app-view-container" onSubmit={handleSubmit}>
        <h2 className="input-target-title" style={{ marginBottom: "30px" }}>
          マッチング年齢幅を設定
        </h2>
        <p className="description">
          マッチングする年齢幅を選択してください。<br></br>
          年上、年下それぞれ別々に設定できます。<br></br>
        </p>
        <ControlledInputText
          id="over-age-restriction"
          element="select"
          valueState={overAgeRestriction}
          setValueState={setOverAgeRestriction}
          required={true}
          text={{
            label: "年上に対する許容年齢幅を設定",
          }}
        >
          <MatchingAgeDiffOptions />
        </ControlledInputText>

        <ControlledInputText
          id="below-age-restriction"
          element="select"
          valueState={belowAgeRestriction}
          setValueState={setBelowAgeRestriction}
          required={true}
          text={{
            label: "年下に対する年齢許容幅を設定",
          }}
        >
          <MatchingAgeDiffOptions />
        </ControlledInputText>

        <button
          disabled={!isAbleToSubmit()}
          className="btn-orange"
          type="submit"
        >
          この内容に変更する
        </button>
      </form>

      <button
        className="btn-gray"
        onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
      >
        前のページに戻る
      </button>
    </>
  );
};
