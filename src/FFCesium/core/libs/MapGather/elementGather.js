import * as Cesium from "cesium";
import { createGatherPoint } from "./common.js";

export const elementGather = {
  //涓€娆″彧鑳界敱涓€涓噰闆嗕簨浠?gatherHandler
  gatherHandler: null,
  //杩涘叆閲囬泦鍒颁竴鍗婏紝寮哄埗鍏抽棴閲囬泦
  forceGatherEnd() {
    console.log("this.gatherHandler", this.gatherHandler);
    if (this.gatherHandler) {
      if (this.gatherHandler.GatherEntity !== undefined && this.gatherHandler.GatherEntity.length > 0) {
        for (let i = 0; i < this.gatherHandler.GatherEntity.length; i++) {
          this.viewer.entities.remove(this.gatherHandler.GatherEntity[i]);
        }
        this.gatherHandler.GatherEntity = [];
      }
    }
    this.gatherHandlerDestroy();
  },
  //濡傛灉瀛樺湪gatherHandler锛屽垯鍏堥攢姣?
  gatherHandlerDestroy() {
    if (this.gatherHandler) {
      this.gatherHandler.destroy();
      this.gatherHandler = null;
    }
    //鍏抽棴榧犳爣鎻愮ず
    this.mapToolClass.closeMouseTip();
    //榧犳爣鍙樻垚鍔犲彿
    document.getElementById(this.cesiumID).style.cursor = "default";
    this.viewer.scene.screenSpaceCameraController.enableRotate = true;
    this.viewer.scene.screenSpaceCameraController.enableZoom = true;
  },
  //鍦嗗舰閲囬泦
  circleGather(callback, option) {
    this.mapToolClass.openMouseTip("鐐瑰嚮閲囬泦鍚庢嫋鍔紝鍙冲嚮鍗冲彲瀹屾垚閲囬泦");
    let the = this;
    let viewer = this.viewer;
    let gatherCircleEntity = null;
    let centerPoint = null;
    //榧犳爣鍙樻垚鍔犲彿
    document.getElementById(this.cesiumID).style.cursor = "crosshair";
    //杩涘埗鍦板浘绉诲姩
    viewer.scene.screenSpaceCameraController.enableRotate = false;
    viewer.scene.screenSpaceCameraController.enableZoom = false;
    this.gatherHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //榧犳爣鐐瑰嚮浜嬩欢
    this.gatherHandler.setInputAction((event) => {
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = viewer.camera.getPickRay(event.position);
      var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      centerPoint = createGatherPoint(cartesian, viewer);
      //榛樿鐢熸垚鍗婂緞涓?.1绫崇殑鍦嗐€?
      gatherCircleEntity = viewer.entities.add({
        position: cartesian,
        ellipse: {
          semiMinorAxis: 0.1, //妞渾鐭酱锛堝崟浣嶇背锛?
          semiMajorAxis: 0.1, //妞渾闀胯酱锛堝崟浣嶇背锛?
          material: Cesium.Color.GREENYELLOW.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 3
        }
      });
      //渚沠orceGatherEnd浣跨敤锛岄噰闆嗗埌涓€鍗婂己鍒跺叧闂噰闆?
      this.gatherHandler.GatherEntity = [];
      this.gatherHandler.GatherEntity.push(centerPoint);
      this.gatherHandler.GatherEntity.push(gatherCircleEntity);
      this.gatherHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // 瀵归紶鏍囩Щ鍔ㄤ簨浠剁殑鐩戝惉
    this.gatherHandler.setInputAction((event) => {
      if (centerPoint == null || gatherCircleEntity == null) {
        return;
      }
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = viewer.camera.getPickRay(event.endPosition);
      var radiusCartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (!radiusCartesian) {
        return;
      }
      var centerCartesian = centerPoint.position.getValue(Cesium.JulianDate.now());
      //璁＄畻绉诲姩鐐逛笌涓績鐐圭殑璺濈锛堝崟浣嶇背锛?
      var centerTemp = viewer.scene.globe.ellipsoid.cartesianToCartographic(centerCartesian);
      var radiusTemp = viewer.scene.globe.ellipsoid.cartesianToCartographic(radiusCartesian);
      var geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(centerTemp, radiusTemp);
      var radius = geodesic.surfaceDistance;
      //console.log("radius",radius);
      //濡傛灉鍗婂緞灏忎簬0,鍒欎笉鏇存柊鍦嗕俊鎭?
      if (radius <= 0) {
        return;
      }
      gatherCircleEntity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(function (time, result) {
        return radius;
      }, false);
      gatherCircleEntity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(function (time, result) {
        return radius;
      }, false);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 瀵归紶鏍囨姮璧蜂簨浠剁殑鐩戝惉(缁撴潫鐐归噰闆?
    this.gatherHandler.setInputAction((event) => {
      //榧犳爣鍙樻垚榛樿
      document.getElementById(this.cesiumID).style.cursor = "default";
      //寮€濮嬮紶鏍囨搷浣滃湴鍥?
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      viewer.scene.screenSpaceCameraController.enableZoom = true;
      //绉婚櫎浜嬩欢
      the.gatherHandlerDestroy();
      //濡傛灉鍦嗗崐寰勫皬浜?.5绫冲垯鍒犻櫎锛岄槻姝㈠嚭鐜伴粯璁や负0.1绫崇殑琚噰闆嗐€傝绉嶆儏鍐靛垯鏄敤鎴峰彇娑堝渾閲囬泦
      //if (gatherCircleEntity.ellipse.semiMinorAxis.getValue() < 0.5) {
      // viewer.entities.remove(gatherCircleEntity);
      // gatherCircleEntity = null;
      // return;
      //}
      //娓呴櫎鍦嗕腑蹇冪偣鍜屽崐寰勭偣
      viewer.entities.remove(centerPoint);
      centerPoint = null;
      the.setAttributeForEntity(gatherCircleEntity, option, "circle");
      callback(gatherCircleEntity);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  },
  //鐭╁舰閲囬泦
  rectangleGather(callback, option) {
    let the = this;
    this.mapToolClass.openMouseTip("鐐瑰嚮閲囬泦鍚庢嫋鍔紝鍙冲嚮鍗冲彲瀹屾垚閲囬泦");
    let gatherRectangleEntity = null;
    let startPoint = null;
    //榧犳爣鍙樻垚鍔犲彿
    document.getElementById(this.cesiumID).style.cursor = "crosshair";
    //杩涘埗鍦板浘绉诲姩
    this.viewer.scene.screenSpaceCameraController.enableRotate = false;
    this.viewer.scene.screenSpaceCameraController.enableZoom = false;
    this.gatherHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    //榧犳爣鐐瑰嚮浜嬩欢
    this.gatherHandler.setInputAction((event) => {
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = the.viewer.camera.getPickRay(event.position);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      startPoint = createGatherPoint(cartesian, the.viewer);
      gatherRectangleEntity = the.viewer.entities.add({
        rectangle: {
          coordinates: Cesium.Rectangle.fromCartesianArray([cartesian, cartesian]),
          material: Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha)
        }
      });
      this.gatherHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);

      //渚沠orceGatherEnd浣跨敤锛岄噰闆嗗埌涓€鍗婂己鍒跺叧闂噰闆?
      this.gatherHandler.GatherEntity = [];
      this.gatherHandler.GatherEntity.push(startPoint);
      this.gatherHandler.GatherEntity.push(gatherRectangleEntity);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    // 瀵归紶鏍囩Щ鍔ㄤ簨浠剁殑鐩戝惉
    this.gatherHandler.setInputAction((event) => {
      if (startPoint == null || gatherRectangleEntity == null) {
        return;
      }
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = the.viewer.camera.getPickRay(event.endPosition);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!cartesian) {
        return;
      }
      var startCartesian = startPoint.position.getValue(Cesium.JulianDate.now());
      gatherRectangleEntity.rectangle.coordinates = new Cesium.CallbackProperty(function (time, result) {
        return Cesium.Rectangle.fromCartesianArray([startCartesian, cartesian]);
      }, false);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 瀵归紶鏍囨姮璧蜂簨浠剁殑鐩戝惉(缁撴潫鐐归噰闆?
    this.gatherHandler.setInputAction((event) => {
      //榧犳爣鍙樻垚榛樿
      document.getElementById(this.cesiumID).style.cursor = "default";
      the.viewer.scene.screenSpaceCameraController.enableRotate = true;
      the.viewer.scene.screenSpaceCameraController.enableZoom = true;
      the.viewer.entities.remove(startPoint);
      //绉婚櫎浜嬩欢
      the.gatherHandlerDestroy();
      the.setAttributeForEntity(gatherRectangleEntity, option, "rectangle");
      callback(gatherRectangleEntity);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    //Cesium.ScreenSpaceEventType.LEFT_UP
  },
  //鍥炬爣鐐归噰闆?
  billboardGather(callback, option) {
    let the = this;
    this.mapToolClass.openMouseTip("鐐瑰嚮鍗冲彲瀹屾垚閲囬泦");
    let gatherPointEntity = null;
    //榧犳爣鍙樻垚鍔犲彿
    document.getElementById(this.cesiumID).style.cursor = "crosshair";
    this.gatherHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    // 瀵归紶鏍囨寜涓嬩簨浠剁殑鐩戝惉
    this.gatherHandler.setInputAction(function (event) {
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = the.viewer.camera.getPickRay(event.position);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }

      let lngLatHeightTemp = the.cartesian3ToLngLat(cartesian);
      gatherPointEntity = the.addBillboardEntity([lngLatHeightTemp.lng, lngLatHeightTemp.lat, lngLatHeightTemp.height], option);
      //榧犳爣鍙樻垚榛樿
      document.getElementById(the.cesiumID).style.cursor = "default";
      //绉婚櫎浜嬩欢
      the.gatherHandlerDestroy();
      callback(gatherPointEntity);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  //鐐归噰闆?
  pointGather(callback, option) {
    let the = this;
    //绉婚櫎浜嬩欢
    this.mapToolClass.openMouseTip("鐐瑰嚮鍗冲彲瀹屾垚閲囬泦");
    let gatherPointEntity = null;
    //榧犳爣鍙樻垚鍔犲彿
    document.getElementById(this.cesiumID).style.cursor = "crosshair";
    this.gatherHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    // 瀵归紶鏍囨寜涓嬩簨浠剁殑鐩戝惉
    this.gatherHandler.setInputAction(function (event) {
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = the.viewer.camera.getPickRay(event.position);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      let lngLatHeightTemp = the.cartesian3ToLngLat(cartesian);
      gatherPointEntity = the.addPointEntity([lngLatHeightTemp.lng, lngLatHeightTemp.lat, lngLatHeightTemp.height], option);
      //榧犳爣鍙樻垚榛樿
      document.getElementById(the.cesiumID).style.cursor = "default";
      //绉婚櫎浜嬩欢
      the.gatherHandlerDestroy();
      //璁剧疆灞炴€?
      the.setAttributeForEntity(gatherPointEntity, option, "point");
      callback(gatherPointEntity);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  //绾块噰闆?
  polylineGather(callback, option) {
    let the = this;
    this.mapToolClass.openMouseTip("涓嶆柇鐐瑰嚮閲囬泦锛屽彸鍑诲嵆鍙畬鎴愰噰闆?);
    let gatherPolylineEntity = null;
    let entityPoints = [];
    let cartesianPoints = [];
    //榧犳爣鍙樻垚鍔犲彿
    document.getElementById(this.cesiumID).style.cursor = "crosshair";
    this.gatherHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    //渚沠orceGatherEnd浣跨敤锛岄噰闆嗗埌涓€鍗婂己鍒跺叧闂噰闆?
    the.gatherHandler.GatherEntity = [];
    // 瀵归紶鏍囨寜涓嬩簨浠剁殑鐩戝惉
    this.gatherHandler.setInputAction(function (event) {
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = the.viewer.camera.getPickRay(event.position);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      var point = createGatherPoint(cartesian, the.viewer);
      entityPoints.push(point);
      cartesianPoints.push(cartesian);
      the.gatherHandler.GatherEntity.push(point);
      if (cartesianPoints.length >= 2) {
        if (gatherPolylineEntity == null) {
          gatherPolylineEntity = the.viewer.entities.add({
            polyline: {
              positions: new Cesium.CallbackProperty(function (time, result) {
                return cartesianPoints;
              }, false),
              material: new Cesium.Color.fromCssColorString(option.color).withAlpha(option.alpha),
              ...option
            }
          });
          the.gatherHandler.GatherEntity.push(gatherPolylineEntity);
        } else {
          //CallbackProperty鐩戝惉point鍙樺寲鍊间細鑷姩set
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.gatherHandler.setInputAction(function (rightClick) {
      //绉婚櫎鍦板浘鐐?
      for (var i = 0; i < entityPoints.length; i++) {
        the.viewer.entities.remove(entityPoints[i]);
      }
      entityPoints = [];
      //榧犳爣鍙樻垚鍔犲彿
      document.getElementById(the.cesiumID).style.cursor = "default";
      //绉婚櫎浜嬩欢
      the.gatherHandlerDestroy();
      //璁剧疆灞炴€?
      the.setAttributeForEntity(gatherPolylineEntity, option, "polyline");

      callback(gatherPolylineEntity);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  },
  //闈㈤噰闆?
  polygonGather(callback, option) {
    let the = this;
    this.mapToolClass.openMouseTip("涓嶆柇鐐瑰嚮閲囬泦锛屽彸鍑诲嵆鍙畬鎴愰噰闆?);
    let gatherPolygonEntity = null;
    let entityPoints = [];
    let cartesianPoints = [];
    //榧犳爣鍙樻垚鍔犲彿
    document.getElementById(this.cesiumID).style.cursor = "crosshair";
    this.gatherHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    // 瀵归紶鏍囨寜涓嬩簨浠剁殑鐩戝惉
    this.gatherHandler.setInputAction(function (event) {
      //鑾峰彇鍔犺浇鍦板舰鍚庡搴旂殑缁忕含搴﹀拰楂樼▼锛氬湴鏍囧潗鏍?
      var ray = the.viewer.camera.getPickRay(event.position);
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      var point = createGatherPoint(cartesian, the.viewer);
      entityPoints.push(point);
      cartesianPoints.push(cartesian);

      //渚沠orceGatherEnd浣跨敤锛岄噰闆嗗埌涓€鍗婂己鍒跺叧闂噰闆?
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
          //渚沠orceGatherEnd浣跨敤锛岄噰闆嗗埌涓€鍗婂己鍒跺叧闂噰闆?
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
      //绉婚櫎闈㈤噰闆嗙偣
      for (var i = 0; i < entityPoints.length; i++) {
        the.viewer.entities.remove(entityPoints[i]);
      }
      entityPoints = [];
      //榧犳爣鍙樻垚鍔犲彿
      document.getElementById(the.cesiumID).style.cursor = "default";
      //绉婚櫎浜嬩欢
      the.gatherHandlerDestroy();
      the.setAttributeForEntity(gatherPolygonEntity, option, "polygon");
      callback(gatherPolygonEntity);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
};

