import { useContext, useReducer, useState, useEffect } from "react";
import { userDocTemplate } from "../firebase.config";

import { Header } from "./UI/Header";
import { ControlledInputText } from "./UI/InputText";

import { AppRouteContext } from "../AppRoute";
import { getAddressByZipcode } from "../fn/app/getAddressByZipcode";
import { setGeolocation } from "../fn/app/geolocation";
import { registerAuthUserDoc } from "../fn/db/firestore.handler";
import { AgeOptions } from "./UI/Options";

const userDataReducerFunc = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        ...action.value,
      };

    default:
      throw new Error("dispatchUserData(): undefined action.type");
  }
};

export const RegisterHandler = (props) => {
  const { eraceModal, showLoadingModal, showErrorModal } =
    useContext(AppRouteContext);

  const [registerUserData, dispatchUserData] = useReducer(userDataReducerFunc, {
    // auto complete meta data
    ...userDocTemplate,
    uid: props?.authState?.uid,
    email: props?.authState?.email,

    // initial value from authState
    name: props?.authState?.displayName,
    photo: props?.authState?.photoURL,
  });
  const [hometownZipcode, setHometownZipcode] = useState("");
  const handleSubmit = (e) => {
    console.log("submit!");
    e.preventDefault();

    //DB登録後、登録したデータを取得
    (async () => {
      showLoadingModal();
      await registerAuthUserDoc({ ...registerUserData });
      props.handleAuthUserDoc(props.authState);
      eraceModal();
    })();
  };

  useEffect(() => {
    hometownZipcode !== "" &&
      (async () => {
        if (hometownZipcode.length < 7 && 8 < hometownZipcode.length) return;

        // 入力された郵便番号（ハイフン消去）
        const parsedZipcode = hometownZipcode.split("-").join("");
        console.log(parsedZipcode);

        //ハイフン以外に、数字以外の文字列を入力してたら終了
        //数値変換後、7桁出なければ終了
        if (isNaN(parsedZipcode) || parsedZipcode.length !== 7) return;

        showLoadingModal();
        const fetchResponse = await getAddressByZipcode(parsedZipcode);

        if (fetchResponse.status === 200 && fetchResponse.results) {
          //正常なレスポンスを取得し、かつ住所が取得できた
          const result = fetchResponse.results[0];

          // resultから県と市を取り出す
          const prefecture = result.address1;
          const city = result.address2.indexOf("市")
            ? result.address2.split("市")[0] + "市"
            : result.address2;

          //○○市と書いてある場合は、区、町は切り捨てて、市のみhometown.cityに入れる
          //「市」の文字がない場合（東京23区等）は、そのまま入れる
          dispatchUserData({
            type: "set",
            value: {
              hometown: {
                prefecture: prefecture,
                city: city,
              },
            },
          });
        } else if (fetchResponse.status === 500) {
          //APIエラーを取得
          showErrorModal({
            title: "住所の取得に失敗しました。",
            text: [
              "APIの不具合により、住所の取得に失敗しました。",
              "お手数ですが、開発者までご連絡ください。",
            ],
          });
          return;
        }

        eraceModal();
      })();
  }, [hometownZipcode]);

  return (
    <>
      <Header
        title="アカウント情報入力"
        handleBack={() => {
          props.handleSignOut();
        }}
      />
      <form onSubmit={handleSubmit}>
        <img src={registerUserData.photo} className="user-icon"></img>

        <ControlledInputText
          id="userName"
          valueState={registerUserData.name}
          setValueState={(inputValue) => {
            dispatchUserData({
              type: "set",
              value: { name: inputValue },
            });
          }}
          text={{
            label: "お名前",
            placeholder: "お名前を入力してください",
          }}
          required={true}
        />

        <ControlledInputText
          id="userAge"
          element="select"
          valueState={registerUserData.age}
          setValueState={(inputValue) => {
            dispatchUserData({
              type: "set",
              value: { age: inputValue },
            });
          }}
          text={{
            label: "年齢",
            placeholder: "お名前を入力してください",
          }}
          required={true}
        >
          <AgeOptions />
        </ControlledInputText>

        <ControlledInputText
          id="userGraduatedUniversity"
          valueState={registerUserData.history.university}
          setValueState={(value) => {
            dispatchUserData({
              type: "set",
              value: { history: { university: value } },
            });
          }}
          text={{
            label: "出身大学を記入",
            placeholder: "出身大学名を記入してください",
          }}
          required={true}
        />

        <ControlledInputText
          id="userHometownZipcode"
          valueState={hometownZipcode}
          setValueState={setHometownZipcode}
          text={{
            label: "実家の郵便番号を入力（ハイフン省略可）",
            placeholder: "半角英数字で郵便番号を入力してください",
          }}
          required={true}
        />
        <p className="data-showcase">
          住所：
          {registerUserData.hometown.prefecture !== "" &&
          registerUserData.hometown.city !== ""
            ? registerUserData.hometown.prefecture +
              registerUserData.hometown.city
            : "郵便番号を正しく入力してください"}
        </p>

        <ControlledInputText
          id="userProfile"
          element="textarea"
          valueState={registerUserData.profile}
          maxLength={100}
          setValueState={(value) => {
            dispatchUserData({
              type: "set",
              value: { profile: value },
            });
          }}
          text={{
            label: "プロフィール文",
            placeholder:
              "プロフィール文を100文字以内で入力してください。100文字以上入力するとカットされます。",
          }}
          required={true}
        />

        <button
          className={`getNowLocation ${
            registerUserData.location?.lat && registerUserData.location?.lng
              ? "btn-gray"
              : "btn-orange"
          }`}
          type="button"
          onClick={() => {
            showLoadingModal();
            setGeolocation((value) => {
              dispatchUserData({
                type: "set",
                value: {
                  location: { ...value },
                },
              });
              eraceModal();
            });
          }}
        >
          現在地を設定（後からでも設定可能です）
        </button>
        <p className="data-showcase">
          現在地：
          {`${
            registerUserData.location?.lat && registerUserData.location?.lng
              ? "現在地を取得しました。"
              : "現在地が取得されていません"
          }`}
        </p>

        <button className="btn-orange" type="submit">
          この内容で登録する
        </button>
      </form>
    </>
  );
};
