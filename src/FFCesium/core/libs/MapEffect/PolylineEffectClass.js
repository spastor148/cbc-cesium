import * as Cesium from "cesium";
import PolylineEffectLogic from "./SubClass/PolylineEffectLogic.js";

class PolylineEffectClass {
  viewer;
  polylineEffectLogic;
  addPolylineMovePointInfo= "叠加线的移动点效果方法(addPolygonEffect)";

  constructor(viewer) {
    this.viewer = viewer;
    this.polylineEffectLogic = new PolylineEffectLogic(viewer);
  }
  //叠加线的移动点效果方法(addPolylineMovePoint)
  addPolylineMovePoint(movePointArr, option){
    return this.polylineEffectLogic.addPolylineMovePoint(movePointArr, option);
  }
  removePolylineMovePoint(polylineMovePointArr){
    this.polylineEffectLogic.removePolylineMovePoint(polylineMovePointArr);
  }
}
export default PolylineEffectClass;
