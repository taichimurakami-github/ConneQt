/**
 * 第一引数の配列を、第二引数で定義された最大長の長さの配列に分割し、
 * それらを格納した配列の配列を返す
 * @param {Array} arrayData
 * @param {Number} maxlength
 * @returns
 */
export const splitArray = (arrayData, maxlength) => {
  const l = Math.ceil(arrayData.length / maxlength);
  return new Array(l)
    .fill()
    .map((_emptyVal, index) => arrayData.slice(index, index + maxlength));
};
