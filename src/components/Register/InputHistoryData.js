import { useState, useEffect, useContext } from "react";
import { Header } from "../UI/Header";
import schoolData from "../../local/schoolCode.json";
import { ControlledInputText } from "../UI/InputText";
import { validateZipcode } from "../../fn/app/validateAccountData";
import { ChoiceActionButton } from "../UI/Button";
import { AppRouteContext } from "../../AppRoute";

export const InputHistoryData = (props) => {
  const { showErrorModal, showConfirmModal, eraceModal } =
    useContext(AppRouteContext);
  const [schoolZipcode, setSchoolZipcode] = useState("");

  const isAbleToGoNext = () => {
    return props.registerUserData.history.university !== "";
  };

  const handleGoNext = () => {
    if (isAbleToGoNext()) {
      showConfirmModal({
        content: {
          title: "出身校名は後から変更できません。",
          text: ["記入ミスがないかご確認ください。"],
        },
        children: (
          <>
            <p className="description">
              登録学校名：{" "}
              <strong className="orange">
                {props.registerUserData.history.university}
              </strong>
            </p>
            <p>本当にこの学校名でよろしいですか？</p>
            <ChoiceActionButton
              callback={{
                yes: () => {
                  props.handleGoNext();
                  eraceModal();
                },
                no: eraceModal,
              }}
            />
          </>
        ),
      });
    } else {
      showErrorModal({
        content: {
          title: "出身校の所在地を登録してください。",
          text: [
            "出身校の入力は必須事項です。",
            "所在地を正しく入力してください。",
            "郵便番号検索で見つからない場合、お手数ですが手動での入力をお願いいたします。",
          ],
        },
      });
    }
  };

  const handleGoBack = () => {
    props.handleGoBack();
  };

  useEffect(() => {
    //郵便番号のバリデーション
    const parsedZipcode = validateZipcode(schoolZipcode);
    if (!parsedZipcode) return;

    //ローカルjsonデータから学校名情報取得
    const searchResult = schoolData[parsedZipcode];

    if (searchResult) {
      props.dispatchUserData({
        type: "set",
        value: { history: { university: searchResult } },
      });
    } else {
      showErrorModal({
        content: {
          title: "該当する学校が見つかりませんでした。",
          text: [
            "余分な空白や文字が含まれていないかご確認ください。",
            "郵便番号検索で見つからない場合、お手数ですが手動での入力をお願いいたします。",
          ],
        },
      });
    }
  }, [schoolZipcode]);

  return (
    <>
      <Header title="出身校を登録" handleBack={handleGoBack} />

      <div className="register-form-container">
        <h2>出身大学、短大、高専を登録</h2>

        <p className="description">
          マッチング用の条件として利用します。<br></br>
          <b>出身大学、短大、高専の所在地に記載されている郵便番号</b>
          を記入してください。
        </p>

        <ControlledInputText
          id="userSchoolZipcode"
          valueState={schoolZipcode}
          setValueState={setSchoolZipcode}
          text={{
            label: "出身校を所在地の郵便番号で検索（ハイフン省略可）",
            placeholder: "半角英数字で郵便番号を入力",
          }}
          required={true}
          statefulNavComponent={
            <p className="data-showcase">
              <span className="orange">登録内容：</span>
              {props.registerUserData.history.university !== "" ? (
                <strong className="orange">
                  {props.registerUserData.history.university}
                </strong>
              ) : (
                <span className="darkgray">
                  出身校の所在地の郵便番号を正しく入力してください
                </span>
              )}
            </p>
          }
        />

        <p className="description">
          郵便番号検索で所在地が出ない場合、<br></br>
          お手数ですが下部の入力フォームにて手動入力をお願いいたします。
        </p>

        <ControlledInputText
          id="userSchoolNameInput"
          valueState={props.registerUserData.history.university}
          setValueState={(inputValue) => {
            props.dispatchUserData({
              type: "set",
              value: {
                history: {
                  university: inputValue,
                },
              },
            });
          }}
          text={{
            placeholder: "手動入力の場合はこちら",
          }}
          required={true}
          maxLength={30}
        />

        <p className="description">
          ※手動で記入する場合、出身校名のみを正確に記入してください。
          <b>学部、専攻などは記入しないでください。</b>
          <br></br>
          <span className="orange">
            例： 「東大」ではなく、「東京大学」と記入
          </span>
        </p>

        <ChoiceActionButton
          callback={{
            yes: handleGoNext,
            no: handleGoBack,
          }}
          text={{
            yes: "次へ進む >",
            no: "< 前に戻る",
          }}
          attributes={{
            yes: {
              disabled: !isAbleToGoNext(),
            },
          }}
          reverseOrder={true}
        />
      </div>
    </>
  );
};
