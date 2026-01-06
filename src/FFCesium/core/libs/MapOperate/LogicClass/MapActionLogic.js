import * as Cesium from "cesium";

export default class MapActionLogic {
    getFlyToEntityConfig(option) {
        let position = Cesium.Cartesian3.fromDegrees(option.lng, option.lat, option.height);
        let flyToEntityConfig = {
            position: position,
            point: {
                pixelSize: 0
            }
        };
        return flyToEntityConfig;
    }

    getSetViewOptions(option) {
        return {
            destination: Cesium.Cartesian3.fromDegrees(option.lng, option.lat, option.height),
            orientation: {
                // 指向
                heading: Cesium.Math.toRadians(0, 0),
                // 视角
                pitch: Cesium.Math.toRadians(option.pitchRadiu),
                roll: 0.0
            }
        };
    }
}
