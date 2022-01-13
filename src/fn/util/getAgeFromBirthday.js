/**
 * 渡されたYmdオブジェクトに対して、年齢を算出して返す
 * @param {YmdObject} birthday
 * birthday: {"y": "year", "m": "month", "d": "date"}
 * @returns
 */
export const getAgeFromBirthday = (birthday) => {
  //birthdayが正しい形式でない場合、
  if (!birthday || !birthday.y || !birthday.m || !birthday.d) return -100;
  const today = new Date();
  const thisYearsBirthday = new Date(
    today.getFullYear(),
    Number(birthday.m) - 1,
    Number(birthday.d)
  );

  let age = today.getFullYear() - Number(birthday.y);

  //今年まだ誕生日が来ていなかったらage - 1
  if (today < thisYearsBirthday) return age - 1;
  //今年誕生日を既に迎えていればageをそのまま返す
  else return age;
};
