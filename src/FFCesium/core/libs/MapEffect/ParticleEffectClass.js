import ParticleEffectLogic from "./SubClass/ParticleEffectLogic.js";
class ParticleEffectClass {
  ffCesium;
  addParticleEffectInfo='叠加粒子效果方法(addParticleEffect)';
  removeParticleEffectInfo='移除粒子效果方法(removeParticleEffect)';
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  //叠加粒子效果
  addParticleEffect(option) {
    let particleEffectLogic = new ParticleEffectLogic();
    let particleObj = particleEffectLogic.init(option);
    this.ffCesium.viewer.scene.primitives.add(particleObj);
    return particleObj;
  }
  //移除粒子效果
  removeParticleEffect(primitive) {
    this.ffCesium.viewer.scene.primitives.remove(primitive);
  }
}
export default ParticleEffectClass;
