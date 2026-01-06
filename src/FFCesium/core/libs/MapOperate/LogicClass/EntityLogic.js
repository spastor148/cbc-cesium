import * as Cesium from "cesium";

export default class EntityLogic {
    getCircleConfig(centerPoint, radius, option) {
        let newOption = Object.assign({}, option);
        newOption.semiMinorAxis = radius;
        newOption.semiMajorAxis = radius;
        newOption.material = new Cesium.Color.fromCssColorString(newOption.color).withAlpha(newOption.alpha);
        let positionTemp = Cesium.Cartesian3.fromDegrees(centerPoint[0], centerPoint[1], centerPoint[2]);

        let circleConfig = {
            position: positionTemp,
            ellipse: {
                ...newOption
            }
        };
        if (newOption.id) {
            circleConfig.id = newOption.id;
        }
        return { circleConfig, positionTemp };
    }

    getPointConfig(lngLatHeight, option) {
        let newOption = Object.assign({}, option);
        let positionTemp = Cesium.Cartesian3.fromDegrees(lngLatHeight[0], lngLatHeight[1], lngLatHeight[2]);
        newOption.color = new Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha);

        if (option.outlineColor) {
            newOption.outlineColor = new Cesium.Color.fromCssColorString(option.outlineColor);
        }

        let pointConfig = {
            position: positionTemp,
            point: {
                ...newOption
            }
        };
        if (newOption.id) {
            pointConfig.id = newOption.id;
        }
        return { pointConfig, positionTemp };
    }

    getBillboardConfig(lngLatHeight, option) {
        let newOption = Object.assign({}, option);
        let positionTemp = null;
        if (option.heightReference) {
            positionTemp = Cesium.Cartesian3.fromDegrees(lngLatHeight[0], lngLatHeight[1]);
        } else {
            positionTemp = Cesium.Cartesian3.fromDegrees(lngLatHeight[0], lngLatHeight[1], lngLatHeight[2]);
        }

        newOption.pixelOffset = new Cesium.Cartesian2(newOption.pixelOffset[0], newOption.pixelOffset[1]);

        let billboardConfig = {
            position: positionTemp,
            billboard: {
                ...newOption
            }
        };
        if (newOption.id) {
            billboardConfig.id = newOption.id;
        }
        return { billboardConfig, positionTemp };
    }

    getRectangleConfig(coordinates, option) {
        let newOption = Object.assign({}, option);
        let positionTemp = Cesium.Rectangle.fromDegrees(coordinates.west, coordinates.south, coordinates.east, coordinates.north);

        let rectangleConfig = {
            rectangle: {
                coordinates: positionTemp,
                material: new Cesium.Color.fromCssColorString(newOption.color).withAlpha(newOption.alpha),
                ...newOption
            }
        };
        if (newOption.id) {
            rectangleConfig.id = newOption.id;
        }
        return { rectangleConfig, positionTemp };
    }

    getPolygonConfig(lnglatArr, option, mapUtil) {
        let newOption = Object.assign({}, option);
        if (lnglatArr.length > 0 && lnglatArr[0].length > 2) {
            // Need mapUtil for getLngLatArrFromLngLatHeightArr
            // Or move that util here or pass it in. passed in mapUtil.
            lnglatArr = mapUtil.getLngLatArrFromLngLatHeightArr(lnglatArr);
        }
        //处理newOption
        let positionTemp = Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat());

        let polygonConfig = {
            polygon: {
                hierarchy: positionTemp,
                material: new Cesium.Color.fromCssColorString(newOption.color).withAlpha(newOption.alpha),
                ...newOption
            }
        };
        if (newOption.id) {
            polygonConfig.id = newOption.id;
        }
        return { polygonConfig, positionTemp, lnglatArr };
    }

    getPolylineConfig(lngLatHeightArr, option) {
        let newOption = Object.assign({}, option);
        let positionTemp = null;
        if (lngLatHeightArr.length > 0 && lngLatHeightArr[0].length > 2) {
            positionTemp = Cesium.Cartesian3.fromDegreesArrayHeights(lngLatHeightArr.flat());
        } else {
            positionTemp = Cesium.Cartesian3.fromDegreesArray(lngLatHeightArr.flat());
        }
        let polylineConfig = {
            polyline: {
                positions: positionTemp,
                material: new Cesium.Color.fromCssColorString(newOption.color).withAlpha(newOption.alpha),
                ...newOption
            }
        };
        if (newOption.id) {
            polylineConfig.id = newOption.id;
        }
        return { polylineConfig, positionTemp };
    }
}
