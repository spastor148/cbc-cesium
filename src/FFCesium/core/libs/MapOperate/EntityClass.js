import EntityLogic from "./LogicClass/EntityLogic.js";

export default class EntityClass {
    constructor(ffCesium) {
        this.ffCesium = ffCesium;
        this.viewer = ffCesium.viewer;
        this.entityLogic = new EntityLogic();
    }

    removeFFEntity(FFEntity) {
        this.viewer.entities.remove(FFEntity);
    }

    removeFFEntityArr(FFEntityArr) {
        FFEntityArr.forEach((element) => {
            this.viewer.entities.remove(element);
        });
    }

    removeFFEntityID(FFEntityID) {
        this.viewer.entities.removeById(FFEntityID);
    }

    removeFFEntityIDArr(FFEntityIDArr) {
        FFEntityIDArr.forEach((element) => {
            this.viewer.entities.removeById(element);
        });
    }

    addCircleEntity(centerPoint, radius, option) {
        const { circleConfig, positionTemp } = this.entityLogic.getCircleConfig(centerPoint, radius, option);
        let circleEntity = this.viewer.entities.add(circleConfig);
        circleEntity.FFOption = option;
        circleEntity.FFType = "FFCircleEntity";
        circleEntity.FFCenterPoint = centerPoint;
        circleEntity.FFRadius = radius;
        circleEntity.FFPosition = positionTemp;
        return circleEntity;
    }

    addPointEntity(lngLatHeight, option) {
        const { pointConfig, positionTemp } = this.entityLogic.getPointConfig(lngLatHeight, option);
        let pointEntity = this.viewer.entities.add(pointConfig);
        pointEntity.FFOption = option;
        pointEntity.FFType = "FFPointEntity";
        pointEntity.FFCoordinates = lngLatHeight;
        pointEntity.FFPosition = positionTemp;
        return pointEntity;
    }

    addBillboardEntity(lngLatHeight, option) {
        const { billboardConfig, positionTemp } = this.entityLogic.getBillboardConfig(lngLatHeight, option);
        let billboardEntity = this.viewer.entities.add(billboardConfig);
        billboardEntity.FFOption = option;
        billboardEntity.FFType = "FFBillboardEntity";
        billboardEntity.FFCoordinates = lngLatHeight;
        billboardEntity.FFPosition = positionTemp;
        return billboardEntity;
    }

    addRectangleEntity(coordinates, option) {
        const { rectangleConfig, positionTemp } = this.entityLogic.getRectangleConfig(coordinates, option);
        let rectangleEntity = this.viewer.entities.add(rectangleConfig);
        rectangleEntity.FFOption = option;
        rectangleEntity.FFType = "FFRectangleEntity";
        rectangleEntity.FFCoordinates = coordinates;
        rectangleEntity.FFPosition = positionTemp;
        return rectangleEntity;
    }

    addPolygonEntity(lnglatArr, option) {
        const { polygonConfig, positionTemp, lnglatArr: processedLngLatArr } = this.entityLogic.getPolygonConfig(lnglatArr, option, this.ffCesium.mapUtilClass);
        let polygonEntity = this.viewer.entities.add(polygonConfig);
        polygonEntity.FFOption = option;
        polygonEntity.FFType = "FFPolygonEntity";
        polygonEntity.FFCoordinates = processedLngLatArr;
        polygonEntity.FFPosition = positionTemp;
        return polygonEntity;
    }

    addPolylineEntity(lngLatHeightArr, option) {
        const { polylineConfig, positionTemp } = this.entityLogic.getPolylineConfig(lngLatHeightArr, option);
        let polylineEntity = this.viewer.entities.add(polylineConfig);
        polylineEntity.FFOption = option;
        polylineEntity.FFType = "FFPolylineEntity";
        polylineEntity.FFCoordinates = lngLatHeightArr;
        polylineEntity.FFPosition = positionTemp;
        return polylineEntity;
    }
}
7