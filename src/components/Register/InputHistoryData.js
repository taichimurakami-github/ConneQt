import { useState, useEffect, useContext } from "react";
import { Header } from "../UI/Header";
import schoolData from "../../local/schoolCode.json";
import { ControlledInputText } from "../UI/InputText";
import {
  validateAccountData,
  validateZipcode,
} from "../../fn/app/validateAccountData";
import { ChoiceActionButton } from "../UI/Button";
import { AppRouteContext } from "../../AppRoute";

export const InputHistoryData = (props) => {
  const { showErrorModal, showConfirmModal, eraceModal } =
    useContext(AppRouteContext);
  const [schoolZipcode, setSchoolZipcode] = useState("");
  const [inputStr, setInputStr] = useState("");
  const [resultArr, setResultArr] = useState([]);

  const isAbleToGoNext = () => {
    return props.registerUserData.history.university !== "";
  };

  const handleGoBack = () => {
    props.handleGoBack();
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

  /**
   * 検索結果から該当の出身校を登録する
   * @param {String} name : 出身校名 or ""(入力値をそのまま登録する場合)
   * @returns
   */
  const handleSelectResult = (name) => {
    //入力出身校名をそのまま登録する場合、バリデーションを通す
    if (name === "" && !validateAccountData("string-01", inputStr)) {
      return showErrorModal({
        content: {
          title: "出身校名を正しく入力してください。",
          text: ["空白のみ、あるいは未記入の場合は登録できません。"],
        },
      });
    }
    const registerSchoolName = name === "" ? inputStr : name;

    //reducerを更新 -> useEffectが拾って自動モーダル表示
    props.dispatchUserData({
      type: "set",
      value: {
        history: {
          university: registerSchoolName,
        },
      },
    });
  };

  useEffect(() => {
    isAbleToGoNext() && resultArr.length > 0 && handleGoNext();
  }, [props.registerUserData.history.university]);

  return (
    <>
      <Header title="出身校を登録" handleBack={handleGoBack} />

      <div className="register-form-container">
        <h2>出身大学、短大、高専を登録</h2>

        <p className="description">
          マッチング用の条件として利用します。<br></br>
          出身校名を記入して「検索する」を押し、<br></br>
          検索結果から出身校を選択してください。
        </p>

        <p className="description">
          ※出身校名のみを正確に記入してください。
          <br></br>
          <b>学部、専攻などは記入しないでください。</b>
          <br></br>
          <span className="orange">
            例： 「東大」ではなく、「東京大学」と記入
          </span>
        </p>

        <ControlledInputText
          id="userSchoolNameInput"
          valueState={inputStr}
          setValueState={(inputValue) => {
            setInputStr(inputValue);
          }}
          text={{
            placeholder: "手動入力の場合はこちら",
          }}
          required={true}
          maxLength={30}
        />

        <button
          className="btn-gray"
          style={{
            margin: "-10px auto 50px",
          }}
          onClick={() => {
            const resultArr = schoolData.filter(
              (elem) => elem.indexOf(inputStr) >= 0
            );
            if (resultArr.length > 0) {
              setResultArr(resultArr);
              showConfirmModal({
                content: {
                  title:
                    inputStr +
                    " の検索結果が" +
                    resultArr.length +
                    " 件見つかりました。",
                },
              });
            } else {
              showErrorModal({
                content: {
                  title: inputStr + " が見つかりませんでした。",
                  text: [
                    "見つからない場合、ページ下の",
                    "「入力した出身校名をそのまま登録」",
                    "ボタンから登録を行ってください。",
                  ],
                },
              });
            }
          }}
          disabled={!validateAccountData("string-01", inputStr)}
        >
          検索する
        </button>

        <SchoolNameList
          nameList={resultArr}
          handleClick={handleSelectResult}
          inputStr={inputStr}
          registeredUniversity={props.registerUserData.history.university}
        />

        <p
          style={{
            marginTop: "100px",
          }}
        >
          <span>登録される出身校名：</span>
          <strong
            className="orange"
            style={{
              display: "inline-block",
              fontSize: "2rem",
              // marginTop: "10px",
            }}
          >
            {props.registerUserData.history.university}
          </strong>
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

const SchoolNameList = (props) => {
  return (
    <>
      <h3
        style={{
          fontSize: "1.6rem",
        }}
      >
        検索結果（クリックして選択）
      </h3>
      <p
        style={{
          margin: "10px",
        }}
      >
        <strong className="orange">{props.nameList.length + " "}</strong>
        件見つかりました：
      </p>
      <ul className="school-search-result-list">
        {props.nameList.map((name) => (
          <li
            className={`school-name ${
              props.registeredUniversity === name ? "selected" : ""
            }`}
            key={name}
            onClick={() => {
              props.handleClick(name);
            }}
          >
            {name}
          </li>
        ))}
      </ul>
      <p className="description">見つからないときは...</p>
      <button
        className={`btn-orange`}
        disabled={
          props.registeredUniversity === props.inputStr || props.inputStr === ""
        }
        onClick={() => {
          props.handleClick("");
        }}
      >
        入力した出身校名をそのまま登録
      </button>
    </>
  );
};
