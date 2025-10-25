import ParticleEffectLogic from "./LogicClass/ParticleEffectLogic.js";
class ParticleEffectClass {
  viewer;
  addParticleEffectInfo='叠加粒子效果方法(addParticleEffect)';
  removeParticleEffectInfo='移除粒子效果方法(removeParticleEffect)';
  constructor(viewer) {
    this.viewer = viewer;
  }
  //叠加粒子效果
  addParticleEffect(option) {
    let particleEffectLogic = new ParticleEffectLogic();
    let particleObj = particleEffectLogic.init(option);
    this.viewer.scene.primitives.add(particleObj);
    return particleObj;
  }
  //移除粒子效果
  removeParticleEffect(primitive) {
    this.viewer.scene.primitives.remove(primitive);
  }
}
export default ParticleEffectClass;
