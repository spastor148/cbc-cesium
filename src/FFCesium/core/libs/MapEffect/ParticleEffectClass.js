import ParticleSystem from "./SubClass/ParticleSystem.js";
class ParticleEffectClass {
  ffCesium;
  addParticleEffectInfo='叠加粒子效果方法(addParticleEffect)';
  removeParticleEffectInfo='移除粒子效果方法(removeParticleEffect)';
  constructor(ffCesium) {
    this.ffCesium = ffCesium;
  }
  //叠加粒子效果
  addParticleEffect(option) {
    let particleSystem = new ParticleSystem();
    let particlefire = particleSystem.init(option);
    this.ffCesium.viewer.scene.primitives.add(particlefire);
    return particlefire;
  }
  //移除粒子效果
  removeParticleEffect(primitive) {
    this.ffCesium.viewer.scene.primitives.remove(primitive);
  }
}
export default ParticleEffectClass;
