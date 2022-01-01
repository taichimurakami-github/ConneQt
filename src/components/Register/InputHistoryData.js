import { useState, useEffect, useContext } from "react";
import { Header } from "../UI/Header";
import schoolData from "../../local/schoolCode.json";
import { ControlledInputText } from "../UI/InputText";
import { validateZipcode } from "../../fn/app/validateAccountData";
import { ChoiceActionButton } from "../UI/Button";
import { AppRouteContext } from "../../AppRoute";

export const InputHistoryData = (props) => {
  const { showErrorModal } = useContext(AppRouteContext);
  const [schoolZipcode, setSchoolZipcode] = useState("");

  const handleGoNext = () => {
    if (props.registerUserData.history.university !== "") {
      props.handleGoNext();
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
        <h2>出身大学、短大、高専の情報を登録</h2>

        <p className="description">
          マッチング用の条件として利用します。<br></br>
          出身大学、短大、高専の所在地に記載されている郵便番号を下部記入欄に記入してください。
        </p>

        <ControlledInputText
          id="userSchoolZipcode"
          valueState={schoolZipcode}
          setValueState={setSchoolZipcode}
          text={{
            label: "出身校の所在地の郵便番号で検索（ハイフン省略可）",
            placeholder: "半角英数字で郵便番号を入力",
          }}
          required={true}
          statefulNavComponent={
            <p className="data-showcase">
              登録内容：
              {props.registerUserData.history.university !== ""
                ? props.registerUserData.history.university
                : "出身校の所在地の郵便番号を正しく入力してください"}
            </p>
          }
        />

        <p className="description">
          郵便番号検索で所在地が出てこない場合、<br></br>
          大変お手数ですが下部の入力フォームにて入力をお願いいたします。
        </p>

        <p className="description">
          出身校名を手動で記入する場合、<br></br>
          出身校名のみを正確に記入してください。
          <br></br>
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
            label: "手動で入力する場合はこちら",
            placeholder: "出身校名のみを正確に記入してください。",
          }}
          required={true}
          maxLength={30}
        />

        <p className="description">
          記入された出身校名をそのままマッチング上の条件として使用しますので、
          <br></br>
          略称や記入ミスなどにより、<br></br>
          マッチングが難しくなる可能性があります。
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
          reverseOrder={true}
        />
      </div>
    </>
  );
};
