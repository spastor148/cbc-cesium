import * as Cesium from "cesium";
import * as turf from "@turf/turf";

class SpatialAnalysisLogic {
    constructor(viewer) {
        this.viewer = viewer;
    }

    /**
     * 判断点与面空间关系
     * @param {*} point 
     * @param {*} polygon 
     * @returns 
     */
    judgePointAndPolygon(point, polygon) {
        var pt = turf.point(point);
        polygon.forEach((element) => {
            element.push(element[0]);
        });
        var poly = turf.polygon(polygon);
        let flagTemp = turf.booleanDisjoint(pt, poly);
        return !flagTemp;
    }

    /**
     * 判断线与面空间关系
     * @param {*} polyline 
     * @param {*} polygon 
     * @returns 
     */
    judgePolylineAndPolygon(polyline, polygon) {
        var pl = turf.lineString(polyline);
        polygon.forEach((element) => {
            element.push(element[0]);
        });
        var poly = turf.polygon(polygon);
        let flagTemp = turf.booleanDisjoint(pl, poly);
        return !flagTemp;
    }

    /**
     * 判断面与面空间关系
     * @param {*} polygon1 
     * @param {*} polygon2 
     * @returns 
     */
    judgePolygonAndPolygon(polygon1, polygon2) {
        polygon1.forEach((element) => {
            element.push(element[0]);
        });
        var pg1 = turf.polygon(polygon1);

        polygon2.forEach((element) => {
            element.push(element[0]);
        });
        var pg2 = turf.polygon(polygon2);
        let flagTemp = turf.booleanDisjoint(pg1, pg2);
        return !flagTemp;
    }
}

export default SpatialAnalysisLogic;
