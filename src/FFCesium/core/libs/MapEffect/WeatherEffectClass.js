import WeatherEffectLogic from "./LogicClass/WeatherEffectLogic.js";
class WeatherEffectClass {
  addRainEffectInfo = "叠加雨效果方法(addRainEffect)";
  removeRainEffectInfo = "移除雨效果方法(removeRainEffect)";
  addSnowEffectInfo = "叠加雪效果方法(addSnowEffect)";
  removeSnowEffectInfo = "移除雪效果方法(removeSnowEffect)";
  addFogEffectInfo = "叠加雾效果方法(addFogEffect)";
  removeFogEffectInfo = "移除雾效果方法(removeFogEffect)";
  addCloudEffectInfo = "叠加云效果方法(addCloudEffect)";
  removeCloudEffectInfo = "移除云效果方法(removeCloudEffect)";
  ffCesium;
  weatherEffectLogic;
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
    this.weatherEffectLogic = new WeatherEffectLogic(ffCesium);
  }
  //叠加雨效果
  addRainEffect(option) {
    return this.weatherEffectLogic.addRainEffect(option);
  }
  //移除雨效果
  removeRainEffect(rainEffect) {
    this.weatherEffectLogic.removeRainEffect(rainEffect);
  }

  //叠加雪效果
  addSnowEffect(option) {
    return this.weatherEffectLogic.addSnowEffect(option);
  }
  //移除雪效果
  removeSnowEffect(rainEffect) {
    this.weatherEffectLogic.removeSnowEffect(rainEffect);
  }

  //叠加雾效果
  addFogEffect(option) {
    return this.weatherEffectLogic.addFogEffect(option);
  }
  //移除雾效果
  removeFogEffect(rainEffect) {
    this.weatherEffectLogic.removeFogEffect(rainEffect);
  }

  //叠加云效果
  addCloudEffect(option) {
    return this.weatherEffectLogic.addCloudEffect(option);
  }
  //移除云效果
  removeCloudEffect(rainEffect) {
    this.weatherEffectLogic.removeCloudEffect(rainEffect);
  }
}
export default WeatherEffectClass;
