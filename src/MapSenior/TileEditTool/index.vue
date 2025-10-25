<template>
  <div id="cesiumContainer">
    <div style="position: absolute; left: 50px; top: 50px; z-index: 999">
      <button @click="panModel">模型平移</button>
      <button @click="rotateModel" style="margin-left: 50px">模型旋转</button>
    </div>
    <div style="position: absolute; left: 50px; top: 100px; z-index: 999">
      <button @click="getModelLoaction">获取模型位置</button>
    </div>

    <div style="position: absolute; left: 50px; top: 150px; z-index: 999">
      <el-input v-model="areaJsonRef" type="textarea" style="width: 600px" /><br />
      <input type="button" value="读取坐标并上图" @click="readXy" />
      <input style="margin-left: 10px" type="button" value="面编辑,右击编辑结束后自动裁切" @click="polygonEditFun" /><br />
      <input style="margin-top: 10px" type="button" value="面采集,右击采集结束后自动裁切" @click="polygonGatherFun" />
    </div>
  </div>
</template>
<script setup>
  import { ref, onMounted, reactive } from "vue";
  import MapClass from "./js/MapClass.js";
  import EditB3DM from "./js/EditB3DM.js";
  import PolygonCLass from "./tool/polygonTool/PolygonCLass.js";
  import { createGatherPoint, createHalfGatherPoint, cartesian3ArrToLngLatHeightArr } from "./tool/polygonTool/common.js";
  import * as Cesium from "cesium";

  let viewer = null;
  let mapClass = null;
  let editObj = null;
  let editModelLayer = null;
  let polygonCLass = null;
  const areaJsonRef = ref("");
  let editPolygonEntity = null;

  onMounted(() => {
    mapClass = new MapClass();
    console.log("Cesium版本", Cesium.VERSION);

    viewer = mapClass.initMap("cesiumContainer");
    polygonCLass = new PolygonCLass(viewer, "cesiumContainer");

    let modelParam = {
      url: "http://113.0.120.80:8003//YTGLB/TYZQS_DM/tileset.json",
      location: {
        tx: 129.71656895003622, //模型中心X轴坐标（经度，单位：十进制度）
        ty: 46.68661726344193, //模型中心Y轴坐标（纬度，单位：十进制度）上小下
        tz: 126.01864400584722, //模型中心Z轴坐标（高程，单位：米）//模型高度
        rx: 0, //X轴（经度）方向旋转角度（单位：度）
        ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
        rz: 0, //Z轴（高程）方向旋转角度（单位：度）//角度
        scale: 1 //缩放比例
      },
      clippingLnglatArr: [
        [129.7217706616376, 46.68665407940257],
        [129.72173211253858, 46.68657195149925],
        [129.72171239049305, 46.68653845436867],
        [129.72169642404174, 46.68650390736166],
        [129.72157529149163, 46.686509117129624],
        [129.7215535993217, 46.685963332754724],
        [129.7215067256247, 46.685820215087844],
        [129.72147349072912, 46.685631288369855],
        [129.7213783479045, 46.68561819327229],
        [129.721286455102, 46.68561009076239],
        [129.72112288227237, 46.685624628694065],
        [129.72087342910413, 46.68571368772451],
        [129.72064840216768, 46.68585828865825],
        [129.72035914269682, 46.68603954929561],
        [129.72018524787734, 46.68612904311048],
        [129.72002206379554, 46.685981448997666],
        [129.72019161260917, 46.685841645483215],
        [129.71927616629762, 46.68517584691889],
        [129.71805975338404, 46.68432902992828],
        [129.71782847647847, 46.68421049476152],
        [129.71759785778053, 46.684273762532],
        [129.71724494661873, 46.684647426421286],
        [129.7169581649834, 46.68524880797163],
        [129.71653615245452, 46.68595397286096],
        [129.71652675211348, 46.686291245940325],
        [129.71667111846412, 46.68728757418725],
        [129.717122790739, 46.68736446397712],
        [129.71886105499925, 46.68681465121961],
        [129.71989286262482, 46.68669924789041],
        [129.72095655887966, 46.686764061474996],
        [129.72116017760095, 46.68672829886659],
        [129.72138083913862, 46.686704979631955]
      ]
    };

    areaJsonRef.value = JSON.stringify(modelParam.clippingLnglatArr);
    let promiseTemp = mapClass.addModelLayer(modelParam);
    console.log("promiseTemp", promiseTemp);
    promiseTemp
      .then((result) => {
        console.log("promiseTemp--成功:", result);
        editModelLayer = result;
        editObj = new EditB3DM(viewer, result, 1, 1);
        //裁切倾斜摄影
        if (modelParam.clippingLnglatArr && modelParam.clippingLnglatArr.length > 0) {
          mapClass.clippingPolygons(modelParam.clippingLnglatArr);
        }
      })
      .catch((error) => {
        console.error("promiseTemp--失败:", error);
      });
  });

  const readXy = () => {
    console.log("readXy--areaJsonRef.value", areaJsonRef.value);
    let FFCoordinates = JSON.parse(areaJsonRef.value);
    let positionTemp = Cesium.Cartesian3.fromDegreesArray(FFCoordinates.flat());
    //叠加面
    editPolygonEntity = viewer.entities.add({
      polygon: {
        hierarchy: positionTemp,
        material: new Cesium.Color.fromCssColorString("#FBFF65").withAlpha(0.5)
      }
    });
    editPolygonEntity.FFPosition = positionTemp;
  };
  const polygonEditFun = () => {
    if (editPolygonEntity) {
      polygonCLass.polygonEdit(editPolygonEntity, polygonEditFunCallback);
    }
  };

  const polygonEditFunCallback = (polygon) => {
    console.log("坐标采集成功,其对象为：", polygon);
    console.log("坐标采集成功,其坐标为：", polygon.FFCoordinates);
    areaJsonRef.value = JSON.stringify(polygon.FFCoordinates);
    mapClass.clippingPolygons(polygon.FFCoordinates);
  };

  const polygonGatherFun = () => {
    polygonCLass.polygonGather(polygonGatherFunCallback, {
      color: "#FBFF65",
      alpha: 0.5
    });
  };
  const polygonGatherFunCallback = (gatherPolygon) => {
    console.log("坐标采集成功,其对象为：", gatherPolygon);
    let FFCoordinates = cartesian3ArrToLngLatHeightArr(gatherPolygon.polygon.hierarchy.getValue().positions, viewer);
    console.log("坐标采集成功,其坐标为：", FFCoordinates);
    areaJsonRef.value = JSON.stringify(FFCoordinates);
    mapClass.clippingPolygons(FFCoordinates);
  };

  const panModel = () => {
    //平移
    editObj.editTranslation();
  };
  const rotateModel = () => {
    //旋转
    editObj.editRtation();
  };
  const getModelLoaction = () => {
    //取消编辑
    //editObj.destroy();
    let paramsTemp = editObj.getParams();
    console.log("模型位置:", paramsTemp);
  };
</script>
<style scoped>
  #cesiumContainer {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
