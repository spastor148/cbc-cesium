<template>
  <div style="width: 100%; margin-bottom: 60px">
    <FFMenuItem
      menuName="天气系统"
      :menuConfigs="weatherMenuConfigs"
    ></FFMenuItem>
    <FFMenuItem
      menuName="线效果"
      :menuConfigs="polylineEffectMenuConfigs"
    ></FFMenuItem>
    <FFMenuItem
      menuName="面效果"
      :menuConfigs="polygonEffectMenuConfigs"
    ></FFMenuItem>
    <FFMenuItem
      menuName="粒子系统"
      :menuConfigs="particleSystemMenuConfigs"
    ></FFMenuItem>
  </div>
</template>
<script setup lang="ts">
import FFMenuItem from "@/components/common/FFMenuItem/index.vue";
import {
  weatherMenuConfigs,
  particleSystemMenuConfigs,
  polygonEffectMenuConfigs,
  polylineEffectMenuConfigs,
} from "./config.js";
</script>

<style scoped></style>
