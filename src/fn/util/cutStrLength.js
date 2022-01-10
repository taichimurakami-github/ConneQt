export const cutStrLength = (str, length = 30, lastStr = "...") => {
  if (typeof str !== "string") return "";
  if (str.length < length) return str;

  return str.substring(0, length) + lastStr;
};
