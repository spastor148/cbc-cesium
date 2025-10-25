import * as turf from "@turf/turf";
import * as Cesium from "cesium";
class PolylineEffectLogic {
  viewer;
  movePointPrimitiveCollection;
  constructor(viewer) {
    this.viewer = viewer;
    this.movePointPrimitiveCollection=this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
  }

  //添加线的移动点
  addPolylineMovePoint(movePointArr, option) {
    let pointEntityArray = [];
    var line = turf.lineString(movePointArr);
    var length = turf.length(line, { units: "meters" });
    var chunk = null;
    if (length > 40000) {
      chunk = turf.lineChunk(line, 80, { units: "meters" });
    } else if (length > 5000) {
      chunk = turf.lineChunk(line, 60, { units: "meters" });
    } else if (length > 1000) {
      chunk = turf.lineChunk(line, 40, { units: "meters" });
    } else {
      chunk = turf.lineChunk(line, 20, { units: "meters" });
    }
    for (let i = 0; i < chunk.features.length; i++) {
      if (i % 30 == 0 && chunk.features.length - i > 16) {
        let movePoint = null;
        if (option.addType == "entity") {
          movePoint = this.addPolylineMovePointByEntity(chunk, i, option);
          pointEntityArray.push(movePoint);
        } else {
          movePoint = this.addPolylineMovePointByPrimitive(chunk, i, option);
          pointEntityArray.push(movePoint);
        }
      }
    }
    pointEntityArray.addType = option.addType;
    return pointEntityArray;
  }
  //通过Primitive添加线移动点
  addPolylineMovePointByPrimitive(chunk, indexFlag, option) {
    let lnglat = [chunk.features[0].geometry.coordinates[1][0], chunk.features[0].geometry.coordinates[1][1], option.height];
    let pointPrimitive = this.addPointPrimitive(lnglat, option);
    let intervalTimer = setInterval(() => {
      if (indexFlag < chunk.features.length - 1) {
        indexFlag = indexFlag + 1;
      } else {
        indexFlag = 0;
      }
      const chunkLng = chunk.features[indexFlag].geometry.coordinates[1][0];
      const chunkLat = chunk.features[indexFlag].geometry.coordinates[1][1];
      pointPrimitive.position = Cesium.Cartesian3.fromDegrees(chunkLng, chunkLat, option.height);
    }, 20);
    pointPrimitive.intervalTimer = intervalTimer;
    return pointPrimitive;
  }
  //通过entity添加线移动点
  addPolylineMovePointByEntity(chunk, indexFlag, option) {
    let pointEntity = new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(
        chunk.features[0].geometry.coordinates[1][0],
        chunk.features[0].geometry.coordinates[1][1],
        option.height
      ),
      point: {
        pixelSize: option.pixelSize,
        color: Cesium.Color.fromCssColorString(option.color)
      }
    });
    pointEntity.type = "FFCesiumAddMovePoint";
    this.viewer.entities.add(pointEntity);
    pointEntity._position = new Cesium.CallbackProperty(function () {
      if (indexFlag < chunk.features.length - 1) {
        indexFlag = indexFlag + 1;
      } else {
        indexFlag = 0;
      }
      const chunkLng = chunk.features[indexFlag].geometry.coordinates[1][0];
      const chunkLat = chunk.features[indexFlag].geometry.coordinates[1][1];
      var cartesian = Cesium.Cartesian3.fromDegrees(chunkLng, chunkLat, option.height);
      return cartesian;
    }, false);
    return pointEntity;
  }

  //添加点图元
  addPointPrimitive(lngLatHeight, option) {
    let newOption = Object.assign({}, option);
    //其他特殊参数设置
    newOption.position = Cesium.Cartesian3.fromDegrees(lngLatHeight[0], lngLatHeight[1], lngLatHeight[2]);
    //颜色属性设置
    newOption.color = new Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha);
    if (option.outlineColor) {
      newOption.outlineColor = new Cesium.Color.fromCssColorString(option.outlineColor);
    }
    let primitive = this.movePointPrimitiveCollection.add(newOption);
    primitive.FFtype = "FFPointPrimitive";
    return primitive;
  }
  //移除移动点
  removePolylineMovePoint(polylineMovePointArr) {
    console.log("removePolylineMovePoint--polylineMovePointArr",polylineMovePointArr);
    if (polylineMovePointArr.addType == "entity") {
      for (let i = 0; i < polylineMovePointArr.length; i++) {
        this.viewer.entities.remove(polylineMovePointArr[i]);
      }
    } else {
      for (let i = 0; i < polylineMovePointArr.length; i++) {
        clearInterval(polylineMovePointArr[i].intervalTimer);
        this.movePointPrimitiveCollection.remove(polylineMovePointArr[i]);
      }
    }
    polylineMovePointArr = [];
  }

}
export default PolylineEffectLogic;
