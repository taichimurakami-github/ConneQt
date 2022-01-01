import { useState, useEffect, useContext } from "react";
import { AppRouteContext } from "../../AppRoute";
import { getAddressByZipcode } from "../../fn/app/getAddressByZipcode";
import { validateZipcode } from "../../fn/app/validateAccountData";
import { ChoiceActionButton } from "../UI/Button";
import { Header } from "../UI/Header";
import { ControlledInputText } from "../UI/InputText";

export const InputHometownData = (props) => {
  const { showErrorModal, showLoadingModal, eraceModal } =
    useContext(AppRouteContext);

  const [hometownZipcode, setHometownZipcode] = useState("");

  const handleGoNext = () => {
    if (
      props.registerUserData.hometown.prefecture !== "" &&
      props.registerUserData.hometown.city !== ""
    ) {
      props.handleGoNext();
    } else {
      showErrorModal({
        content: {
          title: "正しい郵便番号を入力してください。",
          text: [
            "出身地の入力は必須事項です。",
            "ご実家の郵便番号を正しく入力してください。",
          ],
        },
      });
    }
  };

  const handleGoBack = () => {
    props.handleGoBack();
  };

  useEffect(() => {
    hometownZipcode !== "" &&
      (async () => {
        //郵便番号のバリデーション
        const parsedZipcode = validateZipcode(hometownZipcode);
        if (!parsedZipcode) return;

        //APIで住所取得
        showLoadingModal();
        const fetchResponse = await getAddressByZipcode(parsedZipcode);
        eraceModal();

        //取得結果を分析・整形
        if (fetchResponse.status === 200 && fetchResponse.results) {
          //正常なレスポンスを取得し、かつ住所が取得できた
          const result = fetchResponse.results[0];

          // resultから県と市を取り出す
          const prefecture = result.address1;
          const city =
            result.address2.indexOf("市") !== -1
              ? result.address2.split("市")[0] + "市"
              : result.address2;

          //○○市と書いてある場合は、区、町は切り捨てて、市のみhometown.cityに入れる
          //「市」の文字がない場合（東京23区等）は、そのまま入れる
          props.dispatchUserData({
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
              "郵便番号からの住所の取得に失敗しました。",
              "お手数ですが、もう一度郵便番号を入力してください。",
            ],
          });

          //その他：住所が存在しないなど(都庁とかの特殊郵便番号だと存在しない扱いになる)
          return;
        }
      })();
  }, [hometownZipcode]);

  return (
    <>
      <Header title="出身地を登録" handleBack={handleGoBack} />

      <div className="register-form-container">
        <ControlledInputText
          id="userHometownZipcode"
          valueState={hometownZipcode}
          setValueState={setHometownZipcode}
          text={{
            label: "実家の郵便番号（ハイフン省略可）",
            placeholder: "半角英数字で郵便番号を入力",
          }}
          required={true}
          pattern="\d{3}-?\d{4}"
          statefulNavComponent={
            <p className="data-showcase">
              登録内容：
              {props.registerUserData.hometown.prefecture !== "" &&
              props.registerUserData.hometown.city !== ""
                ? props.registerUserData.hometown.prefecture +
                  props.registerUserData.hometown.city
                : "正しい郵便番号が入力されていません。"}
            </p>
          }
        />
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
