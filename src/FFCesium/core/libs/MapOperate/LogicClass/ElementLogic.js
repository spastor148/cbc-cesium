import * as Cesium from "cesium";
import { getModelMatrix, getHeadingPitchRoll } from "@/FFCesium/core/dependentLib/getHpr.js";

export default class ElementLogic {
    getGroundLabelPrimitive(lngLatHeight, option) {
        const canvas = document.createElement("canvas");
        canvas.width = 60;
        canvas.height = 20;
        const context = canvas.getContext("2d");

        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "14px sans-serif";
        context.fillStyle = option.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(option.text, canvas.width / 2, canvas.height / 2);

        const image = new Image();
        image.src = canvas.toDataURL();

        const geometryInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
                rectangle: Cesium.Rectangle.fromDegrees(
                    lngLatHeight[0] - 0.0035,
                    lngLatHeight[1] - 0.001,
                    lngLatHeight[0] + 0.0035,
                    lngLatHeight[1] + 0.001
                ),
                height: lngLatHeight[2],
            }),
        });

        const appearance = new Cesium.MaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: "Image",
                    uniforms: {
                        image: image.src,
                    },
                },
            }),
        });

        return { geometryInstance, appearance, canvas };
    }

    /**
     * 获取圆柱体图元
     * @param {*} linePoints 
     * @param {*} option 
     * @returns 
     */
    addCylinder(linePoints, option) {
        //圆柱的中心点
        let centerPointX = (linePoints[0] + linePoints[3]) / 2;
        let centerPointY = (linePoints[1] + linePoints[4]) / 2;
        let centerPointH = (linePoints[2] + linePoints[5]) / 2;
        let centerPosition = Cesium.Cartesian3.fromDegrees(
            centerPointX,
            centerPointY,
            centerPointH
        );
        //圆柱的长度
        var startheightCartesian = Cesium.Cartesian3.fromDegrees(
            linePoints[0],
            linePoints[1],
            linePoints[2]
        );
        var endheightCartesian = Cesium.Cartesian3.fromDegrees(
            linePoints[3],
            linePoints[4],
            linePoints[5]
        );
        let distance = this.getDistance(startheightCartesian, endheightCartesian);

        //获取倾斜角度
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(centerPosition);
        let pointA = Cesium.Cartesian3.fromDegrees(
            linePoints[0],
            linePoints[1],
            linePoints[2]
        );
        let pointB = Cesium.Cartesian3.fromDegrees(
            linePoints[3],
            linePoints[4],
            linePoints[5]
        );
        let m = getModelMatrix(pointA, pointB);
        let hpr = getHeadingPitchRoll(m);
        hpr.pitch = hpr.pitch + 3.14 / 2 + 3.14;
        var hprRotation = Cesium.Matrix3.fromHeadingPitchRoll(hpr);

        var hprnew = Cesium.Matrix4.fromRotationTranslation(
            hprRotation,
            new Cesium.Cartesian3(0.0, 0.0, 0.0) // 不平移
        );

        Cesium.Matrix4.multiply(modelMatrix, hprnew, modelMatrix);

        // 创建圆柱/圆锥几何实例
        const instance = new Cesium.GeometryInstance({
            geometry: new Cesium.CylinderGeometry({
                length: distance, // 圆柱体的长度
                topRadius: option.radius, // 顶部半径
                bottomRadius: option.radius, // 底部半径
                slices: option.slices,
            }),
            modelMatrix: modelMatrix, // 圆柱体的位置
        });

        // 根据几何实例创建图元
        const primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                material: Cesium.Material.fromType("Color", {
                    color: new Cesium.Color.fromCssColorString(option.color).withAlpha(
                        option.alpha
                    ),
                }),
            }),
        });

        return primitive;
    }

    /**
     * 获取距离
     * @param {*} startPosition 
     * @param {*} endPosition 
     * @returns 
     */
    getDistance(startPosition, endPosition) {
        var distance = Cesium.Cartesian3.distance(startPosition, endPosition);
        return distance;
    }
}
