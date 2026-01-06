import MapUtilLogic from "./LogicClass/MapUtilLogic.js";

class MapUtilClass {
    constructor(ffCesium) {
        this.ffCesium = ffCesium;
        this.mapUtilLogic = new MapUtilLogic(ffCesium);
    }

    getCenterPosition() {
        return this.mapUtilLogic.getCenterPosition();
    }

    getHeightAtPoint(LngLat, level) {
        return this.mapUtilLogic.getHeightAtPoint(LngLat, level);
    }

    getCenterPointByPolyline(LngLatArr) {
        return this.mapUtilLogic.getCenterPointByPolyline(LngLatArr);
    }

    countlength(option) {
        return this.mapUtilLogic.countlength(option);
    }

    countArea(option) {
        return this.mapUtilLogic.countArea(option);
    }

    rectangleCoordinateToPolygonCoordinate(east, west, south, north) {
        return this.mapUtilLogic.rectangleCoordinateToPolygonCoordinate(east, west, south, north);
    }

    getLngLatFromLngLatHeight(LngLatHeight) {
        return this.mapUtilLogic.getLngLatFromLngLatHeight(LngLatHeight);
    }

    getLngLatArrFromLngLatHeightArr(LngLatHeightArr) {
        return this.mapUtilLogic.getLngLatArrFromLngLatHeightArr(LngLatHeightArr);
    }

    getCenterPointFromLngLatArr(LngLatArr) {
        return this.mapUtilLogic.getCenterPointFromLngLatArr(LngLatArr);
    }

    cartesian3ArrToLngLatHeightArr(cartesian3Arr) {
        return this.mapUtilLogic.cartesian3ArrToLngLatHeightArr(cartesian3Arr);
    }

    lngLatHeightArrToCartesian3Arr(lngLatHeightArr) {
        return this.mapUtilLogic.lngLatHeightArrToCartesian3Arr(lngLatHeightArr);
    }

    positionToLngLatHeight(position) {
        return this.mapUtilLogic.positionToLngLatHeight(position);
    }

    isSimpleXYZ(p1, p2) {
        return this.mapUtilLogic.isSimpleXYZ(p1, p2);
    }

    coordinateArrDeduplication(lngLatArr) {
        return this.mapUtilLogic.coordinateArrDeduplication(lngLatArr);
    }

    setAttributeForEntity(entity, option, type) {
        return this.mapUtilLogic.setAttributeForEntity(entity, option, type);
    }
}

export default MapUtilClass;
