import loading from "../../images/loading.gif";

export const LoadingModal = () => {
  return (
    <div className="loading-wrapper">
      <img src={loading} alt="読み込み中、または処理中です"></img>
    </div>
  );
};
