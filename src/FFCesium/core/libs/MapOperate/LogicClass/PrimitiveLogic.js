import * as Cesium from "cesium";

export default class PrimitiveLogic {
    getGltfModelMatrix(position, headingAngle, pitchAngle, rollAngle) {
        let heading = Cesium.Math.toRadians(headingAngle);
        let pitch = Cesium.Math.toRadians(pitchAngle);
        let roll = Cesium.Math.toRadians(rollAngle);
        let headingPositionRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");
        return Cesium.Transforms.headingPitchRollToFixedFrame(position, headingPositionRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform);
    }

    getBillboardOption(lngLatHeight, option) {
        let newOption = Object.assign({}, option);
        newOption.position = Cesium.Cartesian3.fromDegrees(lngLatHeight[0], lngLatHeight[1], lngLatHeight[2]);
        newOption.pixelOffset = new Cesium.Cartesian2(newOption.pixelOffset[0], newOption.pixelOffset[1]);
        return newOption;
    }

    getPointOption(lngLatHeight, option) {
        let newOption = Object.assign({}, option);
        newOption.position = Cesium.Cartesian3.fromDegrees(lngLatHeight[0], lngLatHeight[1], lngLatHeight[2]);
        newOption.color = new Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha);
        if (option.outlineColor) {
            newOption.outlineColor = new Cesium.Color.fromCssColorString(option.outlineColor);
        }
        return newOption;
    }

    getPolylinePrimitive(lnglatArr, option) {
        let positionTemp = Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat());
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
                positions: positionTemp,
                width: option.width
            })
        });
        const primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PolylineMaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: "Color",
                        uniforms: {
                            color: new Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha)
                        }
                    }
                })
            })
        });
        return { primitive, positionTemp };
    }

    getPolygonPrimitive(lnglatArr, option) {
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat()))
            })
        });
        const primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.MaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: "Color",
                        uniforms: {
                            color: new Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha)
                        }
                    }
                })
            })
        });
        return primitive;
    }
}
