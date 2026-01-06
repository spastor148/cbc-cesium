import * as Cesium from "cesium";

class MapServerLogic {
    constructor() { }

    // 获取高德地图Provider
    getGaodeProvider(url) {
        return new Cesium.UrlTemplateImageryProvider({ url: url });
    }

    // 获取天地图矢量图层Provider
    getTdtVecProvider() {
        let url = "https://t4.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=2cf56b2e77c1be9a456ef411d808daad";
        return this.createTdtProvider(url);
    }

    // 获取天地图注记图层Provider
    getTdtCvaProvider() {
        let url = "https://t4.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=2cf56b2e77c1be9a456ef411d808daad";
        return this.createTdtProvider(url);
    }

    // 获取天地图影像图层Provider
    getTdtImgProvider() {
        let url = "https://t4.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=2cf56b2e77c1be9a456ef411d808daad";
        return this.createTdtProvider(url);
    }

    // 获取天地图影像注记Provider
    getTdtCiaProvider() {
        let url = "https://t4.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=2cf56b2e77c1be9a456ef411d808daad";
        return this.createTdtProvider(url);
    }

    // 获取天地图道路图层Provider
    getTdtCtaProvider() {
        let url = "https://t4.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=2cf56b2e77c1be9a456ef411d808daad";
        return this.createTdtProvider(url);
    }

    // 创建天地图Provider
    createTdtProvider(url) {
        var mapOption = {
            url: url,
        };
        return new Cesium.UrlTemplateImageryProvider(mapOption);
    }

    // 获取ArcGIS影像Provider
    getArcgisImgProvider() {
        let url = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        return this.createCustomProvider(url);
    }

    // 创建自定义Provider
    createCustomProvider(url) {
        var mapOption = {
            url: url,
        };
        return new Cesium.UrlTemplateImageryProvider(mapOption);
    }
}
export default MapServerLogic;
