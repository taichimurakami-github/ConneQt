export const parseLFToReactBr = (text) => {
  const parsedArr = [...text].map((t) =>
    t === "\n" || t === "\r" ? <br></br> : t
  );

  return [...text].reduce((accumulator, current) => {
    const result = [...accumulator];

    if (current === "\n" || current === "\r") {
      //改行文字列
      result.push(<br></br>);
      result.push("");
    } else if (result.length > 0) {
      //改行文字以外かつ最初の要素ではない
      result[result.length - 1] += current;
    } else {
      //改行文字以外かつ最初の要素
      result.push(current);
    }

    return result;
  }, []);
};
