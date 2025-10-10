import * as Cesium from "cesium";

class ParticleSystemClass  {
  constructor() {}
  init(option) {
    let optionParam={
      ...option,
      modelMatrix: this.computeModelMatrix({
        lng: option.lngLatHeight[0],
        lat: option.lngLatHeight[1],
        height: option.lngLatHeight[2],
      }), //位置 （世界矩阵）
      emitterModelMatrix: this.computeEmitterModelMatrix(option.headingAngle, option.pickAngle, 0), //模型矩阵
    }
    console.log("optionParam",optionParam);
    let particlefire = new Cesium.ParticleSystem(optionParam);
    return particlefire;
  }
  computeModelMatrix(position) {
    const center = Cesium.Cartesian3.fromDegrees(
      position.lng,
      position.lat,
      position.height
    );
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    return matrix;
  }
  /**
   * 
   * @param {*} heading 旋转角度
   * @param {*} pick 倾斜角度
   * @param {*} roll 
   * @returns 
   */
  computeEmitterModelMatrix(heading, pick, roll) {
    let hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pick, roll); //朝向
    let trs = new Cesium.TranslationRotationScale();
    trs.translation = Cesium.Cartesian3.fromElements(0.0, 0.0, 0.0);
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr);
    let result = Cesium.Matrix4.fromTranslationRotationScale(trs);
    return result;
  }
};
export default ParticleSystemClass