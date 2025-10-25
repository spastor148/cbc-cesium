import * as Cesium from "cesium";
import gatherPoint from "./images/gatherPoint.png";
import gatherPointHalf from "./images/gatherPointHalf.png";

/**
 * 通用产生采集点
 * @param {*} cartesian
 * @returns
 */
export function createGatherPoint(cartesian, viewer) {
  var point = viewer.entities.add({
    position: cartesian,
    billboard: {
      image: gatherPoint,
      width: 12,
      height: 12,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  return point;
}

/**
 * 通用产生采集半点
 * @param {*} cartesian
 * @returns
 */
export function createHalfGatherPoint(cartesian, viewer) {
  var point = viewer.entities.add({
    position: cartesian,
    billboard: {
      image: gatherPointHalf,
      width: 12,
      height: 12,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  return point;
}

export function coordinatesToWKT(coordinates) {
  if (!coordinates || coordinates.length < 3) {
    throw new Error("坐标数组至少需要3个点");
  }
  // 闭合多边形（首尾点相同）
  let wktCoordinates = "";
  for (let i = 0; i < coordinates.length; i++) {
    wktCoordinates += `${coordinates[i][0]} ${coordinates[i][1]}`;
    if (i < coordinates.length - 1) {
      wktCoordinates += ", ";
    }
  }
  // 如果首尾点不同，添加首点使其闭合
  if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] || coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
    wktCoordinates += `, ${coordinates[0][0]} ${coordinates[0][1]}`;
  }
  return `POLYGON((${wktCoordinates}))`;
}

export function positionToLngLatHeight(position,viewer) {
  let ellipsoid = viewer.scene.globe.ellipsoid;
  let cartographic = ellipsoid.cartesianToCartographic(position);
  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  let lng = Cesium.Math.toDegrees(cartographic.longitude);
  let height = cartographic.height;
  return [lng, lat, height];
}

export function cartesian3ArrToLngLatHeightArr(cartesian3Arr,viewer) {
  var lngLatHeightArr = [];
  for (var i = 0; i < cartesian3Arr.length; i++) {
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartesian3 = new Cesium.Cartesian3(cartesian3Arr[i].x, cartesian3Arr[i].y, cartesian3Arr[i].z);
    var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
    var arr = [];
    arr.push(Cesium.Math.toDegrees(cartographic.longitude));
    arr.push(Cesium.Math.toDegrees(cartographic.latitude));
    //arr.push(cartographic.height);
    lngLatHeightArr.push(arr);
  }
  return lngLatHeightArr;
}
