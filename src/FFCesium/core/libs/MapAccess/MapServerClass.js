import MapServerLogic from "./LogicClass/MapServerLogic.js";

class MapServerClass {
    constructor(viewer) {
        this.viewer = viewer;
        this.mapServerLogic = new MapServerLogic();
    }

    // 添加高德标准地图
    addGaodeLayer(url) {
        let provider = this.mapServerLogic.getGaodeProvider(url);
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 天地图平面地图加载
    addTdtVecLayer() {
        let provider = this.mapServerLogic.getTdtVecProvider();
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 加载天地图平面注记地图加载
    addTdtCvaLayer() {
        let provider = this.mapServerLogic.getTdtCvaProvider();
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 天地图影像地图加载
    addTdtImgLayer() {
        let provider = this.mapServerLogic.getTdtImgProvider();
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 天地图影像地图加载 (注记)
    addTdtCiaLayer() {
        let provider = this.mapServerLogic.getTdtCiaProvider();
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 天地图道路地图加载
    addTdtCtaLayer() {
        let provider = this.mapServerLogic.getTdtCtaProvider();
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 其他天地图服务
    addTdtLayer(url) {
        let provider = this.mapServerLogic.createTdtProvider(url);
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // arcgis瓦片服务加载
    addArcgisImgLayer() {
        let provider = this.mapServerLogic.getArcgisImgProvider();
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 自定义地图服务
    addCustomLayer(url) {
        let provider = this.mapServerLogic.createCustomProvider(url);
        return this.viewer.imageryLayers.addImageryProvider(provider);
    }

    // 删除地图图层
    removeMapLayer(mapLayer) {
        this.viewer.imageryLayers.remove(mapLayer, true);
    }

    hideMapLayer() { }
}

export default MapServerClass;
