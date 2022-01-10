export const getAddressByZipcode = async (zipcode) => {
  const API_REQUEST_URL = "https://zipcloud.ibsnet.co.jp/api/search";
  const response = await fetch(`${API_REQUEST_URL}?zipcode=${zipcode}`);
  return await response.json();
};
