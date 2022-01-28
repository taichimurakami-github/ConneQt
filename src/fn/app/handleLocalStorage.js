export class LSHandler {
  /**
   * LS.handle.load
   */
  static load(id, dispatch, dispatchCondition = true) {
    try {
      const data = JSON.parse(localStorage.getItem(id));
      dispatch && dispatchCondition && dispatch(data);
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * @param {String} id
   * @param {Object} data
   */
  static save(id, data, dispatch) {
    try {
      let beforeData = JSON.parse(localStorage.getItem(id));
      localStorage.setItem(id, JSON.stringify({ ...beforeData, ...data }));
      dispatch && dispatch(data);
    } catch (e) {
      console.log(e);
    }
  }
}
