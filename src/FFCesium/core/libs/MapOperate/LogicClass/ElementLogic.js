import * as Cesium from "cesium";

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
}
