import { createGatherPoint ,createHalfGatherPoint,cartesian3ArrToLngLatHeightArr} from "./common.js";
import * as Cesium from "cesium";

class MainLogicCLass {
  viewer = null;
  gatherHandler = null;
  mapID=null;
  constructor(viewer,mapID) {
    this.mapID=mapID;
    this.viewer = viewer;
  }

  polygonGather(callback, option) {
    let the = this;
    let gatherPolygonEntity = null;
    let entityPoints = [];
    let cartesianPoints = [];
    //鼠标变成加号
    document.getElementById(this.mapID).style.cursor = "crosshair";
    this.gatherHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    // 对鼠标按下事件的监听
    this.gatherHandler.setInputAction(function (event) {
      //获取加载地形后对应的经纬度和高程：地标坐标
      var ray = the.viewer.camera.getPickRay(event.position);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      var point = createGatherPoint(cartesian, the.viewer);
      entityPoints.push(point);
      cartesianPoints.push(cartesian);

      //供forceGatherEnd使用，采集到一半强制关闭采集
      the.gatherHandler.GatherEntity = [];
      the.gatherHandler.GatherEntity.push(point);

      if (cartesianPoints.length >= 3) {
        if (gatherPolygonEntity == null) {
          gatherPolygonEntity = the.viewer.entities.add({
            polygon: {
              hierarchy: new Cesium.CallbackProperty(function (time, result) {
                var hierarchyTemp = new Cesium.PolygonHierarchy(cartesianPoints, null);
                return hierarchyTemp;
              }, false),
              material: Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha),
              ...option
            }
          });
          //供forceGatherEnd使用，采集到一半强制关闭采集
          the.gatherHandler.GatherEntity.push(gatherPolygonEntity);
        } else {
          gatherPolygonEntity.polygon.hierarchy = new Cesium.CallbackProperty(function (time, result) {
            var hierarchyTemp = new Cesium.PolygonHierarchy(cartesianPoints, null);
            return hierarchyTemp;
          }, false);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.gatherHandler.setInputAction(function (rightClick) {
      //移除面采集点
      for (var i = 0; i < entityPoints.length; i++) {
        the.viewer.entities.remove(entityPoints[i]);
      }
      entityPoints = [];
      //鼠标变成加号
      document.getElementById(the.mapID).style.cursor = "default";
      //移除事件
      the.gatherHandlerDestroy();
      callback(gatherPolygonEntity);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  gatherHandlerDestroy ()  {
    if (this.gatherHandler) {
      this.gatherHandler.destroy();
      this.gatherHandler = null;
    }
    //鼠标变成加号
    document.getElementById(this.mapID).style.cursor = "default";
    this.viewer.scene.screenSpaceCameraController.enableRotate = true;
    this.viewer.scene.screenSpaceCameraController.enableZoom = true;
  };
  /**
   * 面修改
   * @param {*} polygon
   * @param {*} callback
   */
  polygonEdit(polygon, callback) {
    let the = this;
    let viewer = this.viewer;
    polygon.pointsId = [];
    polygon.halfPointsId = [];
    let currentPoint = null;
    if (!polygon.id) {
      polygon.id = "polygonEdit_" + new Date().getTime() + "_" + Math.random();
    }
    document.getElementById(this.mapID).style.cursor = "pointer";
    //叠加编辑点
    for (var i = 0; i < polygon.FFPosition.length; i++) {
      var cartesian = polygon.FFPosition[i];
      var point = createGatherPoint(cartesian, viewer);
      point.name = "polygonEdit_point";
      // var point = viewer.entities.add({
      //   name: "polygonEdit_point",
      //   position: cartesian,
      //   point: {
      //     color: Cesium.Color.WHITE,
      //     pixelSize: 8,
      //     outlineColor: Cesium.Color.BLACK,
      //     outlineWidth: 1,
      //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //贴地
      //   },
      // });
      polygon.pointsId.push(point.id);
    }
    //叠加half采集点
    for (var i = 0; i < polygon.FFPosition.length; i++) {
      let cartesian = null;
      if (i == polygon.FFPosition.length - 1) {
        var halfX = (polygon.FFPosition[i].x + polygon.FFPosition[0].x) / 2;
        var halfY = (polygon.FFPosition[i].y + polygon.FFPosition[0].y) / 2;
        var halfZ = (polygon.FFPosition[i].z + polygon.FFPosition[0].z) / 2;
        cartesian = new Cesium.Cartesian3(halfX, halfY, halfZ);
      } else {
        var halfX = (polygon.FFPosition[i].x + polygon.FFPosition[i + 1].x) / 2;
        var halfY = (polygon.FFPosition[i].y + polygon.FFPosition[i + 1].y) / 2;
        var halfZ = (polygon.FFPosition[i].z + polygon.FFPosition[i + 1].z) / 2;
        cartesian = new Cesium.Cartesian3(halfX, halfY, halfZ);
      }

      var pointEntity = createHalfGatherPoint(cartesian, viewer);
      pointEntity.name = "polygonEdit_half_point";

      // var pointEntity = {
      //   name: "polygonEdit_half_point",
      //   position: cartesian,
      //   point: {
      //     color: Cesium.Color.RED,
      //     pixelSize: 8,
      //     outlineColor: Cesium.Color.BLACK,
      //     outlineWidth: 1,
      //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //贴地
      //   },
      // };
      if (i == polygon.pointsId.length - 1) {
        pointEntity.positionFlag = [i, 0];
      } else {
        pointEntity.positionFlag = [i, i + 1];
      }
      // var point = viewer.entities.add(pointEntity);
      console.log("pointEntity", pointEntity);
      polygon.halfPointsId.push(pointEntity.id);
    }

    //事件
    polygon.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    polygon.handler.setInputAction((event) => {
      let windowPosition = event.position;
      let pickedObject = viewer.scene.pick(windowPosition);
      if (Cesium.defined(pickedObject)) {
        let entity = pickedObject.id;
        if (entity.name === "polygonEdit_point") {
          currentPoint = entity;
        } else if (entity.name === "polygonEdit_half_point") {
          let ellipsoid = viewer.scene.globe.ellipsoid;
          let cartesian = viewer.camera.pickEllipsoid(
            windowPosition,
            ellipsoid
          );
          if (!cartesian) {
            return;
          }
          // var point = viewer.entities.add({
          //   name: "polygonEdit_point",
          //   position: cartesian,
          //   point: {
          //     color: Cesium.Color.WHITE,
          //     pixelSize: 8,
          //     outlineColor: Cesium.Color.BLACK,
          //     outlineWidth: 1,
          //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //贴地
          //   },
          // });
          var point = createGatherPoint(cartesian, viewer);
          point.name = "polygonEdit_point";
          currentPoint = point;
          //线半点变成线上点
          polygon.pointsId.splice(entity.positionFlag[0] + 1, 0, point.id);
          //删除所有线半点
          for (var i = 0; i < polygon.halfPointsId.length; i++) {
            viewer.entities.remove(
              viewer.entities.getById(polygon.halfPointsId[i])
            );
          }
          polygon.halfPointsId = [];
          //重新生成所有线半点
          console.log("polygon.pointsId123", polygon.pointsId);
          for (var i = 0; i < polygon.pointsId.length; i++) {
            var oneTemp = null;
            var twoTemp = null;
            if (i == polygon.pointsId.length - 1) {
              oneTemp = viewer.entities.getById(polygon.pointsId[i]).position
                ._value;
              twoTemp = viewer.entities.getById(polygon.pointsId[0]).position
                ._value;
            } else {
              oneTemp = viewer.entities.getById(polygon.pointsId[i]).position
                ._value;
              twoTemp = viewer.entities.getById(polygon.pointsId[i + 1])
                .position._value;
            }
            var halfX = (oneTemp.x + twoTemp.x) / 2;
            var halfY = (oneTemp.y + twoTemp.y) / 2;
            var halfZ = (oneTemp.z + twoTemp.z) / 2;
            var cartesianHalf = new Cesium.Cartesian3(halfX, halfY, halfZ);

            var pointEntity = createHalfGatherPoint(cartesianHalf, viewer);
            pointEntity.name = "polygonEdit_half_point";
            // var pointEntity = {
            //   name: "polygonEdit_half_point",
            //   position: cartesianHalf,
            //   point: {
            //     color: Cesium.Color.RED,
            //     pixelSize: 8,
            //     outlineColor: Cesium.Color.BLACK,
            //     outlineWidth: 1,
            //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //贴地
            //   },
            // };
            if (i == polygon.pointsId.length - 1) {
              pointEntity.positionFlag = [i, 0];
            } else {
              pointEntity.positionFlag = [i, i + 1];
            }
            // var point = viewer.entities.add(pointEntity);
            polygon.halfPointsId.push(pointEntity.id);
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // 对鼠标移动事件的监听
    polygon.handler.setInputAction((event) => {
      if (currentPoint && currentPoint.name == "polygonEdit_point") {
        viewer.scene.screenSpaceCameraController.enableRotate = false;
        viewer.scene.screenSpaceCameraController.enableZoom = false;
        var ray = viewer.camera.getPickRay(event.endPosition);
        var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        let points = [];
        if (!cartesian) {
          return;
        }
        currentPoint.position = cartesian;
        for (var i = 0; i < polygon.pointsId.length; i++) {
          if (currentPoint.id == polygon.pointsId[i]) {
            points.push(currentPoint.position._value);
          } else {
            var id = polygon.pointsId[i];
            points.push(viewer.entities.getById(id).position._value);
          }
        }

        //更新线上中心点位置信息
        for (var i = 0; i < polygon.halfPointsId.length; i++) {
          var entityTemp = viewer.entities.getById(polygon.halfPointsId[i]);
          if (typeof entityTemp != "undefined") {
            //console.log("entityTemp123", entityTemp);
            var oneTemp = entityTemp.positionFlag[0];
            var twoTemp = entityTemp.positionFlag[1];
            if (
              typeof points[oneTemp] != "undefined" &&
              typeof points[twoTemp] != "undefined"
            ) {
              var halfX = (points[oneTemp].x + points[twoTemp].x) / 2;
              var halfY = (points[oneTemp].y + points[twoTemp].y) / 2;
              var halfZ = (points[oneTemp].z + points[twoTemp].z) / 2;
              var cartesian = new Cesium.Cartesian3(halfX, halfY, halfZ);
              entityTemp.position = cartesian;
            }
          }
        }

        polygon.polygon.hierarchy = new Cesium.CallbackProperty(function (
          time,
          result
        ) {
          var hierarchyTemp = new Cesium.PolygonHierarchy(points, null);
          return hierarchyTemp;
        },
        false);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 对鼠标抬起事件的监听
    polygon.handler.setInputAction((event) => {
      currentPoint = null;
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // 右击事件的监听
    polygon.handler.setInputAction((event) => {
      the.closePolygonEdit(polygon);
      callback(polygon);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  closePolygonEdit(polygon) {
    //关闭鼠标提示
    //this.closeMouseTip();
    let the = this;
    //鼠标变成加号
    document.getElementById(this.mapID).style.cursor = "default";
    //移除地图事件
    polygon.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    polygon.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    polygon.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    polygon.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);

    let lngLatHeightArr = cartesian3ArrToLngLatHeightArr(
      polygon.polygon.hierarchy.getValue().positions,
      this.viewer
    );

    polygon.FFCoordinates = lngLatHeightArr;
    polygon.FFPosition = polygon.polygon.hierarchy.getValue().positions;
    the.removeFFEntityIDArr(polygon.pointsId);
    polygon.pointsId = [];
    the.removeFFEntityIDArr(polygon.halfPointsId);
    polygon.halfPointsId = [];
    return polygon;
  }

  /**
   * 根据ID值移除所给实体数据
   * @param {*} FFEntityArr
   */
  removeFFEntityIDArr(FFEntityIDArr) {
    FFEntityIDArr.forEach((element) => {
      this.viewer.entities.removeById(element);
    });
  }
}
export default MainLogicCLass;
