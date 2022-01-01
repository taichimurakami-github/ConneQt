export const validateAccountData = (mode, data) => {
  // switch()

  return true;
};

export const validateZipcode = (zipcode) => {
  if (zipcode.length < 7 && 8 < zipcode.length) return false;

  // 入力された郵便番号（ハイフン消去）
  const parsedZipcode = zipcode.split("-").join("");

  //ハイフン以外に、数字以外の文字列を入力してたら終了
  //数値変換後、7桁出なければ終了
  if (isNaN(parsedZipcode) || parsedZipcode.length !== 7) return false;

  //バリデーション成功
  return parsedZipcode;
};

export const validateUserName = (userName) => {
  if (userName === "") return;
};
