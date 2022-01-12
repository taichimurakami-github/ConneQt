export const AgeOptions = () => {
  return (
    <>
      <option value="22">22歳以下</option>
      <option value="23">23</option>
      <option value="24">24</option>
      <option value="25">25</option>
      <option value="26">26</option>
      <option value="27">27</option>
      <option value="28">28</option>
      <option value="29">29</option>
      <option value="30">30歳以上</option>
    </>
  );
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
