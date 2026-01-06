import SpatialAnalysisLogic from "./LogicClass/SpatialAnalysisLogic.js";

class SpatialAnalysisClass {
    judgePointAndPolygonInfo = "判断点与面空间关系方法(judgePointAndPolygon)";
    judgePolylineAndPolygonInfo = "判断线与面空间关系方法(judgePolylineAndPolygon)";
    judgePolygonAndPolygonInfo = "判断面与面空间关系方法(judgePolygonAndPolygon)";

    constructor(ffCesium) {
        this.ffCesium = ffCesium;
        this.spatialAnalysisLogic = new SpatialAnalysisLogic(ffCesium.viewer);
    }

    /**
     * 判断点与面空间关系
     * @param {*} point 
     * @param {*} polygon 
     * @returns 
     */
    judgePointAndPolygon(point, polygon) {
        return this.spatialAnalysisLogic.judgePointAndPolygon(point, polygon);
    }

    /**
     * 判断线与面空间关系
     * @param {*} polyline 
     * @param {*} polygon 
     * @returns 
     */
    judgePolylineAndPolygon(polyline, polygon) {
        return this.spatialAnalysisLogic.judgePolylineAndPolygon(polyline, polygon);
    }

    /**
     * 判断面与面空间关系
     * @param {*} polygon1 
     * @param {*} polygon2 
     * @returns 
     */
    judgePolygonAndPolygon(polygon1, polygon2) {
        return this.spatialAnalysisLogic.judgePolygonAndPolygon(polygon1, polygon2);
    }
}

export default SpatialAnalysisClass;
