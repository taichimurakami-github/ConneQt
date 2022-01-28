export const DateOptions = (props) => {
  const isLeapYear = (year) =>
    year % 4 === 0 && !(year % 100 === 0 && year % 400 !== 0);

  const dateForEachMonth = [
    31,
    isLeapYear(props.valueState.y) ? 29 : 28, //うるう年のときのみ29日
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  const returnElems = [];

  for (let i = 1; i <= dateForEachMonth[Number(props.valueState.m) - 1]; i++) {
    returnElems.push(
      <option value={i} key={"date-" + i}>
        {i}
      </option>
    );
  }

  return <>{[...returnElems]}</>;
};

export const MonthOptions = (props) => {
  const returnElems = [];

  for (let i = 1; i <= 12; i++) {
    returnElems.push(
      <option value={i} key={"month-" + i}>
        {i}
      </option>
    );
  }

  return <>{[...returnElems]}</>;
};

export const YearOptions = (props) => {
  const returnElems = [];
  const nowYear = new Date().getFullYear();

  for (let i = nowYear; i >= nowYear - props.number; i--) {
    returnElems.push(
      <option value={i} key={"year-" + i}>
        {i}
      </option>
    );
  }

  return <>{[...returnElems]}</>;
};

export const MatchingAgeDiffOptions = () => {
  return (
    <>
      <option value={0}>０（年齢差なし）</option>
      <option value={1}>１歳差まで</option>
      <option value={2}>２歳差まで</option>
      <option value={3}>３歳差まで</option>
      <option value={4}>４歳差まで</option>
      <option value={5}>５歳差まで</option>
      <option value={6}>６歳差まで</option>
      <option value={100}>特に制限しない</option>
    </>
  );
};

export const GenderOptions = () => {
  return (
    <>
      <option value="male">男性</option>
      <option value="female">女性</option>
    </>
  );
};
