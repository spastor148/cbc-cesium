import AddTypeLogic from "./LogicClass/AddTypeLogic.js";

class AddTypeClass {
    viewer;
    addTypeLogic;
    addHtmlForVueInfo = "Vue组件叠加Html方法(addHtmlForVue)";
    closeHtmlForVueInfo = "关闭Vue组件叠加Html方法(closeHtmlForVue)";
    openDivCollisionCheckingInfo = "开启Div层碰撞检测方法(openDivCollisionChecking)";
    closeDivCollisionCheckingInfo = "关闭Div层碰撞检测方法(closeDivCollisionChecking)";
    showMapByAreaLngLatInfo = "根据区域坐标展示地图方法(showMapByAreaLngLat)";

    constructor(viewer) {
        this.viewer = viewer;
        this.addTypeLogic = new AddTypeLogic(viewer);
    }

    /**
     * Vue组件叠加Html方法
     * @param {Array} lngLatHeight - 经纬度高度
     * @param {HTMLElement} htmlOverlay - html元素
     * @param {Object} offset - 偏移量
     */
    addHtmlForVue(lngLatHeight, htmlOverlay, offset) {
        return this.addTypeLogic.addHtmlForVue(lngLatHeight, htmlOverlay, offset);
    }

    /**
     * 关闭Vue组件叠加Html方法
     * @param {HTMLElement} htmlOverlay 
     */
    closeHtmlForVue(htmlOverlay) {
        this.addTypeLogic.closeHtmlForVue(htmlOverlay);
    }

    /**
     * 开启Div层碰撞检测方法
     * @param {Array} allHtmlOverlay 
     * @param {Object} option 
     */
    openDivCollisionChecking(allHtmlOverlay, option) {
        this.addTypeLogic.openDivCollisionChecking(allHtmlOverlay, option);
    }

    /**
     * 关闭Div层碰撞检测方法
     */
    closeDivCollisionChecking() {
        this.addTypeLogic.closeDivCollisionChecking();
    }

    /**
     * 根据区域坐标展示地图方法
     * @param {Array} LngLats 
     */
    showMapByAreaLngLat(LngLats) {
        this.addTypeLogic.showMapByAreaLngLat(LngLats);
    }
}

export default AddTypeClass;
