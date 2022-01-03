export const validateAccountData = (mode, data) => {
  switch (mode) {
    case "string-01":
      //文字列じゃなかったらOUT
      if (typeof data !== "string") {
        return false;
      }

      const splitStr = [...data];

      //入力されてなかったらOUT
      if (splitStr.length === 0) {
        return false;
      }

      //半角・全角の空白のみの文字列だったらOUT
      else if (
        splitStr.filter((str) => str === " " || str === "　").length ===
        splitStr.length
      ) {
        return false;
      }

      return true;

    case "number-01":
      if (Number.isNaN(data)) {
        return false;
      }

      //最大値は100までにする
      if (Number(data) > 100) {
        return false;
      }

      return true;

    // case "object-01":
    //   //Arrayとnull以外のobjectでなければreturn
    //   if (!data || typeof data !== "object" || Array.isArray(data)) {
    //     return false;
    //   }

    //   for (const val of Object.values(data)) {
    //     //valueがstringだったら、普通にstring-01パターンの判定を行う
    //     if (typeof val === "string") {
    //       console.log(val);
    //       return validateAccountData("string-01", val);
    //     }

    //     //valueがオブジェクトだったら、stringの値を取り出せるまで再起処理
    //     else if (val && typeof val === "object" && !Array.isArray(val)) {
    //       console.log(val);
    //       //再起処理でdeep objectを展開する
    //       return validateAccountData("object-01", val);
    //     }

    //     //想定外なのでreturn false
    //     else return false;
    //   }

    default:
      return false;
  }
};

export const validateZipcode = (zipcode) => {
  if (zipcode.length < 7 && 8 < zipcode.length) return false;

  // 入力された郵便番号（ハイフン消去）
  const parsedZipcode = zipcode.split("-").join("");

  //ハイフン以外に、数字以外の文字列を入力してたら終了
  //数値変換後、7桁出なければ終了
  if (Number.isNaN(parsedZipcode) || parsedZipcode.length !== 7) return false;

  //バリデーション成功
  return parsedZipcode;
};

export const validateUserName = (userName) => {
  if (userName === "") return;
};
