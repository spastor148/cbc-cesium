<template>
  <div id="cesiumContainer">
    <button style="position: absolute; left: 100px; top: 100px; z-index: 999" @click="addParticleEffectFun">叠加粒子效果</button>
    <button style="position: absolute; left: 100px; top: 150px; z-index: 999" @click="removeParticleEffectFun">移除粒子效果</button>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from "vue";
  import FFCesium from "FFCesium";
  let ffCesium = null;
  onMounted(() => {
    //初始化
    ffCesium = new FFCesium("cesiumContainer");
    let option = {
      lng: 118.1022,
      lat: 24.4959,
      eyeHeight: 1000,
      pitchRadiu: -50,
      time: 1
    };
    ffCesium.flyTo(option);
  });
  let fireEffectObj = null;
  const addParticleEffectFun = () => {
    console.log("addParticleEffectFun--ffCesium", ffCesium);
    let option = {
      lngLatHeight:[118.1022, 24.4959, 10],//位置
      headingAngle: 45, //旋转角度
      pickAngle: 90, //倾斜角度
      image: "../images/FFCesium/MapEffect/particleSystem/fire.png", //图片
      imageSize: new ffCesium.Cesium.Cartesian2(5, 5), //图片比例 宽高
      startColor: ffCesium.Cesium.Color.WHITE.withAlpha(0.5), //粒子在其生命初期的颜色
      endColor: ffCesium.Cesium.Color.YELLOW.withAlpha(0.5), //粒子寿命结束时的颜色。
      startScale: 0.5, //开始大小
      endScale: 4.0, //结束大小
      minimumParticleLife: 1.5, //最短存活时间
      maximumParticleLife: 3, //最长存活时间
       // lifetime: 16.0,//粒子系统发射粒子的时间
      minimumSpeed: 29,
      maximumSpeed: 30,
      emissionRate: 100.0, //粒子数
      // particleLife: 1.0,//粒子生命
      // speed: 5.0,//发射速度
      emitter: new ffCesium.Cesium.CircleEmitter(10.0), //生成区域 粒子发射器。
      sizeInMeters: true, //true 米为单位 false 像素为单位，大小不变
    };
    fireEffectObj = ffCesium.particleEffectClass.addParticleEffect(option);
  };

  const removeParticleEffectFun = () => {
    ffCesium.particleEffectClass.removeParticleEffect(fireEffectObj);
  };
</script>
<style scoped>
  #cesiumContainer {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
