import { useContext, useEffect, useState } from "react";
import { AppRouteContext } from "../../AppRoute";
import { registerUserImageToStorage } from "../../fn/db/registerHandler";
import { Header } from "../UI/Header";
import { UncontrolledInputFIle } from "../UI/InputFile";
import { cmpConfig } from "./config";

export const EditUserImage = (props) => {
  const { showErrorModal, showLoadingModal } = useContext(AppRouteContext);
  const [imageState, setImageState] = useState(null);
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");

  const handlePreview = () => {
    if (imageState === null) return;

    //ファイルをdataURLとして読み込み
    //imgsrcへ
    const reader = new FileReader();
    reader.readAsDataURL(imageState);
    reader.onload = () => setImagePreviewSrc(String(reader.result));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        showLoadingModal();
        //storageにユーザーアイコンの画像データを格納（既にある場合は上書き）
        //storageへのdownload linkが帰ってくる
        const ref = await registerUserImageToStorage(
          imageState,
          props.nowUserDoc
        );

        //userDoc.photoを更新
        props.handleSubmit(ref);
      } catch (e) {
        console.log(e);
        showErrorModal({
          content: {
            title: "画像のアップロード中にエラーが発生しました。",
            text: ["お手数ですがもう一度やり直してください。"],
          },
        });
      }
    })();
  };

  useEffect(() => {
    imageState && handlePreview();
  }, [imageState]);

  return (
    <>
      <Header
        title="ユーザーアイコンを編集"
        backable={true}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />

      <form onSubmit={handleSubmit}>
        <h2 className="input-target-title">
          新しいユーザーアイコンの画像を選択してください。
        </h2>

        <UncontrolledInputFIle
          id="NEW_USER_IMAGE_INPUT"
          setValueState={(fileData) => {
            setImageState(fileData);
          }}
          accept="image/*"
          required={true}
        />

        {imageState && imagePreviewSrc !== "" && (
          <img
            className="user-icon"
            src={imagePreviewSrc}
            alt={props.nowUserDoc?.name + "さんの新しいプロフィール画像"}
          ></img>
        )}

        <button
          className="btn-orange"
          type="submit"
          disabled={!Boolean(imageState)}
        >
          この画像に変更する
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
