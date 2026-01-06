<template>
  <div id="cesiumContainer" style="
      background-image: url(./FFCesiumExample/AdvancedExamples/addType/images/back.png);
    "></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import FFCesium from "FFCesium";
let ffCesium = null;
onMounted(() => {
  ffCesium = new FFCesium("cesiumContainer");
  console.log("ffCesium", ffCesium);
  //定位
  ffCesium.mapActionClass.setView({
    lng: 118.08164379,
    lat: 37.1808099,
    height: 85000,
    pitchRadiu: -50,
  });

  //zhanhuaGeojson已在工程进行导入，标准的geojson格式。自行获取
  let pointList = zhanhuaGeojson.features[0].geometry.coordinates[0];
  let latlngArr = [];
  pointList.forEach((item, index) => {
    latlngArr.push(item[0]);
    latlngArr.push(item[1]);
  });
  ffCesium.addTypeClass.showMapByAreaLngLat(latlngArr);
});
</script>
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
