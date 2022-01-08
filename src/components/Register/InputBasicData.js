import { useState, useEffect, useContext } from "react";
import { validateAccountData } from "../../fn/app/validateAccountData";

import { ChoiceActionButton } from "../UI/Button";
import { Header } from "../UI/Header";
import { UncontrolledInputFIle } from "../UI/InputFile";
import { ControlledInputText } from "../UI/InputText";
import { AgeOptions } from "../UI/Options";

import { AppRouteContext } from "../../AppRoute";

export const InputBasicData = (props) => {
  const { showConfirmModal, showErrorModal, eraceModal } =
    useContext(AppRouteContext);

  //inputで一度ファイル選択をせずにエクスプローラーを閉じるとundefinedになるので、それを初期値とする
  const [imageState, setImageState] = useState(
    props.registerUserData.photoData
  );

  //preview用の画像データをimageURLで格納
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");

  const isAbleToGoNext = () => {
    return validateAccountData("string-01", props.registerUserData.name);
  };

  const handlePreviewImage = () => {
    if (imageState === null) return;

    //ファイルをdataURLとして読み込み
    //imgsrcへ
    const reader = new FileReader();
    reader.readAsDataURL(imageState);
    reader.onload = () => {
      setImagePreviewSrc(String(reader.result));
    };
  };

  const handleGoNext = () => {
    if (!isAbleToGoNext()) {
      return showErrorModal({
        content: {
          title: "お名前を正しく入力してください。",
          text: ["名前が記入されていない場合は登録できません。"],
        },
      });
    }

    if (props.registerUserData.profile === "") {
      return showConfirmModal({
        content: {
          title: "プロフィールが未記入です。よろしいですか？",
        },
        children: (
          <ChoiceActionButton
            callback={{
              yes: () => {
                eraceModal();
                props.handleGoNext();
              },
              no: eraceModal,
            }}
          />
        ),
      });
    }

    props.handleGoNext();
  };

  const handleGoBack = () => {
    props.handleGoBack();
  };

  useEffect(() => {
    imageState && handlePreviewImage();
  }, [imageState]);

  return (
    <>
      <Header title="基本情報入力" handleBack={handleGoBack} />

      <div className="register-form-container">
        <img
          src={
            imageState && imagePreviewSrc !== ""
              ? imagePreviewSrc
              : props.registerUserData.photo
          }
          className="user-icon"
          alt="アカウントプロフィール画像"
        ></img>

        <UncontrolledInputFIle
          id="userIconImage"
          setValueState={(fileData) => {
            setImageState(fileData);
            props.dispatchUserData({
              type: "set",
              value: { photoData: fileData },
            });
          }}
          text={{
            label: "ユーザーアイコン画像を選択",
          }}
          accept="image/*"
          required={true}
        />

        <ControlledInputText
          id="userName"
          valueState={props.registerUserData.name}
          setValueState={(inputValue) => {
            props.dispatchUserData({
              type: "set",
              value: { name: inputValue },
            });
          }}
          text={{
            label: "お名前(30文字以内で入力)",
            placeholder: "お名前を入力",
          }}
          required={true}
          maxLength={30}
        />

        <ControlledInputText
          id="userAge"
          element="select"
          valueState={props.registerUserData.age}
          setValueState={(inputValue) => {
            props.dispatchUserData({
              type: "set",
              value: { age: inputValue },
            });
          }}
          text={{
            label: "年齢(選択してください)",
          }}
          required={true}
        >
          <AgeOptions />
        </ControlledInputText>

        <ControlledInputText
          id="userProfile"
          element="textarea"
          valueState={props.registerUserData.profile}
          maxLength={100}
          setValueState={(value) => {
            props.dispatchUserData({
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
          statefulNavComponent={
            <p>
              {props.registerUserData.profile.length}/{100}
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
            no: "< ログアウト",
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
