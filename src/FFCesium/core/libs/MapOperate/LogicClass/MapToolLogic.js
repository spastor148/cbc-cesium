import * as Cesium from "cesium";
import * as turf from "@turf/turf";

export default class MapToolLogic {
    cartesian3ToLngLat(cartesian3, viewer) {
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let height = cartographic.height;
        return { lat: lat, lng: lng, height: height };
    }

    lngLatToCartesian3(lngLatHeight) {
        if (!lngLatHeight.height) {
            lngLatHeight.height = 0;
        }
        let cartesian3 = Cesium.Cartesian3.fromDegrees(
            lngLatHeight.lng,
            lngLatHeight.lat,
            lngLatHeight.height
        );
        return cartesian3;
    }

    lngLatArrToCartesian3(lngLatArr) {
        if (!lngLatArr[2]) {
            lngLatArr[2] = 0;
        }
        let cartesian3 = Cesium.Cartesian3.fromDegrees(
            lngLatArr[0],
            lngLatArr[1],
            lngLatArr[2]
        );
        return cartesian3;
    }

    measureCenterByCartesian(from, to) {
        // 转换为Cartographic
        var carto1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(from);
        var carto2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(to);
        // 计算中心点的经纬度
        var lon = (carto1.longitude + carto2.longitude) / 2;
        var lat = (carto1.latitude + carto2.latitude) / 2;
        var center = Cesium.Cartographic.fromRadians(lon, lat);
        // 将中心点的经纬度转换回Cartesian3
        let centerPoint = Cesium.Ellipsoid.WGS84.cartographicToCartesian(center);
        return centerPoint;
    }

    createBezierSpline(latlngArr) {
        var line = turf.lineString(latlngArr);
        console.log("line", line);
        var curved = turf.bezierSpline(line, { sharpness: 0.5 });
        let newLnglatArr = curved.geometry.coordinates;
        return newLnglatArr;
    }

    calculateArea(objArr) {
        let featuresArr = [];
        let areaXYArr = [];
        objArr.forEach((obj, index) => {
            featuresArr.push(turf.point([obj.lng, obj.lat]));
            areaXYArr.push([obj.lng, obj.lat]);
        });

        var features = turf.featureCollection(featuresArr);
        var center = turf.center(features);

        let lngTemp = center.geometry.coordinates[0];
        let latTemp = center.geometry.coordinates[1];

        areaXYArr.push(areaXYArr[0]);
        var polygon = turf.polygon([areaXYArr]);
        var area = turf.area(polygon);
        return { area, centerLng: lngTemp, centerLat: latTemp };
    }
}
