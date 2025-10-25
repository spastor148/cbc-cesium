import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import flickerBase64 from "../../images/flicker.png";
import PolylineFlow from "../../dependentLib/polylineFlow.js";

export const polylineEffect = {
  
  
  
  //添加闪烁线
  addPolylineFlicker(lnglatArr, option) {
    if (option.addType == "entity") {
      return this.addPolylineFlickerByEntity(lnglatArr, option);
    } else {
      return this.addPolylineFlickerByPrimitive(lnglatArr, option);
    }
  },

  //删除闪烁线
  removePolylineFlicker(polylineFlickerObj) {
    if (polylineFlickerObj.addType == "entity") {
      this.viewer.entities.remove(polylineFlickerObj);
    } else {
      clearInterval(polylineFlickerObj.intervalTimer);
      this.viewer.scene.primitives.remove(primitive);
    }
  },

  addPolylineFlickerByPrimitive(lnglatArr, option) {
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        width: option.width,
      }),
    });
    const primitive = new Cesium.Primitive({
      geometryInstances: instance, //可以是实例数组
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: new Cesium.Color.fromCssColorString(option.color),
            },
          },
        }),
      }),
    });
    primitive.flickerFlag = 1;
    primitive.flickerChangeFlag = "minus";
    let intervalTimer = setInterval(() => {
      if (primitive.flickerChangeFlag == "plus") {
        primitive.flickerFlag = primitive.flickerFlag + 0.02;
        if (primitive.flickerFlag > 1) {
          primitive.flickerChangeFlag = "minus";
        }
      } else if (primitive.flickerChangeFlag == "minus") {
        primitive.flickerFlag = primitive.flickerFlag - 0.02;
        if (primitive.flickerFlag < 0.3) {
          primitive.flickerChangeFlag = "plus";
        }
      }
      primitive.appearance.material.uniforms.color =
        Cesium.Color.fromCssColorString(option.color).withAlpha(
          primitive.flickerFlag
        );
    }, 20);
    primitive.intervalTimer = intervalTimer;
    primitive.addType = option.addType;
    this.viewer.scene.primitives.add(primitive);
    return primitive;
  },

  //添加闪烁线
  addPolylineFlickerByEntity(lnglatArr, option) {
    let FFentity = this.viewer.entities.add({
      show: true,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        width: 5,
        material: Cesium.Color.fromCssColorString(option.color),
      },
    });
    FFentity.flickerFlag = 1;
    FFentity.flickerChangeFlag = "minus";
    FFentity.polyline = {
      positions: FFentity.polyline.positions,
      width: option.width,
      material: new Cesium.ImageMaterialProperty({
        image: flickerBase64,
        color: new Cesium.CallbackProperty(function () {
          if (FFentity.flickerChangeFlag == "plus") {
            FFentity.flickerFlag = FFentity.flickerFlag + 0.02;
            if (FFentity.flickerFlag > 1) {
              FFentity.flickerChangeFlag = "minus";
            }
          } else if (FFentity.flickerChangeFlag == "minus") {
            FFentity.flickerFlag = FFentity.flickerFlag - 0.02;
            if (FFentity.flickerFlag < 0.3) {
              FFentity.flickerChangeFlag = "plus";
            }
          }
          return Cesium.Color.fromCssColorString(option.color).withAlpha(
            FFentity.flickerFlag
          );
        }, false),
        repeat: new Cesium.Cartesian2(1.0, 1.0),
        transparent: true,
      }),
    };
    FFentity.addType = option.addType;
    return FFentity;
  },
  //流动线
  addPolylineFlow(lnglatArr, option) {
    console.log("lnglatArr, option", lnglatArr, option);
    let polylineObj = this.viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(lnglatArr.flat()),
        width: option.width,
        material: new PolylineFlow(
          Cesium.Color.fromCssColorString(option.color),
          option.url,
          option.time
        ),
      },
    });
    return polylineObj;
  },
  //删除流动线
  removePolylineFlow(polylineObj) {
    this.viewer.entities.remove(polylineObj);
  },
  /**
   * 添加线段上的标签
   * @param {Array} lnglatHeightArr - 经纬度高度数组
   * @param {Object} option - 标签的配置选项，包括标签内容、字体大小、字体颜色、背景颜色等
   */
  addLineSegmentLabel(lnglatHeightArr, option) {
    let htmlOverlayArr = [];
    let labelArr = [...option.label];
    // console.log("addLineSegmentLabel--labelArr", labelArr);
    var line = turf.lineString(
      this.getLngLatArrFromLngLatHeightArr(lnglatHeightArr)
    );
    var lineLength = turf.length(line, { units: "meters" });
    //console.log("线段长度lineLength", lineLength);
    let cutLength = lineLength / (labelArr.length + 1);
    //console.log("分割线段长度为：", cutLength);
    let chunk = turf.lineChunk(line, cutLength, { units: "meters" });
    //console.log("分割chunk", chunk);
    chunk.features.forEach((item, index) => {
      if (index < labelArr.length) {
        let lng =
          item.geometry.coordinates[item.geometry.coordinates.length - 1][0];
        let lat =
          item.geometry.coordinates[item.geometry.coordinates.length - 1][1];
        let lngLatHeight = [lng, lat, 10];
        let html = "";
        html +=
          "<div style='" + option.styleStr + "'>" + labelArr[index] + "</div>";
        let htmlOverlay = this.addHtml(lngLatHeight, html, option.offset);
        htmlOverlayArr.push(htmlOverlay);
      }
    });
    return htmlOverlayArr;
  },
};
