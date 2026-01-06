<template>
  <div id="cesiumContainer">
    <button style="position: absolute; left: 100px; top: 100px; z-index: 999" @click="addPointEntityFun">
      叠加点实体
    </button>

    <button style="position: absolute; left: 100px; top: 150px; z-index: 999" @click="removePointEntityFun">
      移除点实体
    </button>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import FFCesium from "FFCesium";

let ffCesium = null;
onMounted(() => {
  ffCesium = new FFCesium("cesiumContainer");
});
let pointEntity = null;
const addPointEntityFun = () => {
  let lngLatHeight = [118.1022, 24.4959, 100];
  let option = {
    pixelSize: 10,
    color: "#FFFF00",
    alpha: 1,
    outlineWidth: 2,
    outlineColor: "#0000FF",
  };
  pointEntity = ffCesium.entityClass.addPointEntity(lngLatHeight, option);
  console.log("叠加的实体对象", pointEntity);
};
const removePointEntityFun = () => {
  ffCesium.entityClass.removeFFEntity(pointEntity);
};
</script>
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
