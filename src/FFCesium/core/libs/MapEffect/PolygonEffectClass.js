import * as Cesium from "cesium";
import PolygonEffectLogic from "./LogicClass/PolygonEffectLogic";

class PolygonEffectClass {
  addWaterSurfaceEffectInfo= "叠加水面效果方法(addPolygonEffect)";
  removeWaterSurfaceEffectInfo= "移除水面效果方法(removePolygonEffect)";
  addWaterVolumeEffectInfo= "叠加水体效果方法(addPolygonEffect)";
  removeWaterVolumeEffectInfo= "移除水体效果方法(removePolygonEffect)";
  viewer;
  polygonEffectLogic;
  constructor(viewer) {
    this.viewer = viewer;
    this.polygonEffectLogic = new PolygonEffectLogic(viewer);
  }
  //叠加水面效果
  addWaterSurfaceEffect(lnglatArr, option) {
    return this.polygonEffectLogic.addWaterSurfaceEffect(lnglatArr, option);
  }
  //移除水面效果
  removeWaterSurfaceEffect(polygonPrimitive) {
    this.polygonEffectLogic.removeWaterSurfaceEffect(polygonPrimitive);
  }
  //叠加水体效果
  addWaterVolumeEffect(lnglatArr, option) {
    return this.polygonEffectLogic.addWaterVolumeEffect(lnglatArr, option);
  }
  //移除水面效果
  removeWaterVolumeEffect(polygonPrimitive) {
    this.polygonEffectLogic.removeWaterVolumeEffect(polygonPrimitive);
  }

  
}
export default PolygonEffectClass;
