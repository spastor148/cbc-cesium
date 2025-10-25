class TransformClassLogic {
  viewer;
  constructor(viewer) {
    this.viewer = viewer;
  }
  /**
   * 带有高度的坐标数组转成没有高度的坐标数组
   * 输入：[[118,24,10][118,24,10][118,24,10]]
   * 输出：[[118,24][118,24][118,24]]
   * @param {*} LngLatHeightArr
   * @returns
   */
  getLngLatArrFromLngLatHeightArr(LngLatHeightArr) {
    let lngLatArr = [];
    LngLatHeightArr.forEach((item) => {
      let arrTemp = [item[0], item[1]];
      lngLatArr.push(arrTemp);
    });
    return lngLatArr;
  }
}
export default TransformClassLogic;
