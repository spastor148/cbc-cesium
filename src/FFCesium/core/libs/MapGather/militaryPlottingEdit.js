import * as Cesium from "cesium";
import { createGatherPoint } from "./common.js";
import { xp } from "../../dependentLib/plotHelper/algorithm.js";
export const militaryPlottingEdit = {
  //涓€娆″彧鑳芥湁涓€涓慨鏀逛簨浠?
  militaryPlottingEditHandler: null,
  //鍐涗簨淇敼鐐?
  militaryPlottingEditPoints: [],
  /**
   * 缁撴潫鍐涗簨鏍囩粯缂栬緫鐨勫鐞?
   */
  endMilitaryPlottingEditDeal() {
    //榧犳爣鍙樻垚榛樿
    document.getElementById(this.cesiumID).style.cursor = "default";
    //绉婚櫎浜嬩欢
    if (this.militaryPlottingEditHandler) {
      this.militaryPlottingEditHandler.destroy();
      this.militaryPlottingEditHandler = null;
    }
    //鍏抽棴榧犳爣鎻愮ず
    this.mapToolClass.closeMouseTip();
    //绉婚櫎鏍囨敞鐐?
    for (var i = 0; i < this.militaryPlottingEditPoints.length; i++) {
      this.viewer.entities.remove(this.militaryPlottingEditPoints[i]);
    }
    this.militaryPlottingEditPoints = [];
  },
  /**
   * 鍏抽棴闆嗙粨鍦伴噰闆?
   * @param {*} entityObj
   * @returns
   */
  closeRendezvousEdit(entityObj) {
    entityObj.FFPosition = entityObj.polygon.hierarchy.getValue().positions;
    let lngLatHeightArr = this.cartesian3ArrToLngLatHeightArr(
      entityObj.FFPosition
    );
    entityObj.FFCoordinates = lngLatHeightArr;
    //缁撴潫澶勭悊
    this.endMilitaryPlottingEditDeal();
    return entityObj;
  },

  /**
   * 闆嗙粨鍦拌繘鍏ョ紪杈?
   * @param {*} entityObj
   * @param {*} callback
   */
  rendezvousEdit(entityObj, callback) {
    this.mapToolClass.openMouseTip("鍘嬩綇缂栬緫鐐圭Щ鍔紝鍙冲嚮鍗冲彲瀹屾垚閲囬泦");
    document.getElementById(this.cesiumID).style.cursor = "pointer";
    let the = this;
    let isMoving = false;
    let pickedAnchor = null;
    let gatherPosition = this.LngLatHeightArrToCartesian3Arr(
      entityObj.FFPlotKeyPoints
    );
    for (var i = 0; i < gatherPosition.length; i++) {
      let pointTemp = createGatherPoint(gatherPosition[i], this.viewer);
      pointTemp.oid = i;
      pointTemp.flag = "anchor";
      the.militaryPlottingEditPoints.push(pointTemp);
    }
    //娣诲姞浜嬩欢
    this.militaryPlottingEditHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    //鐐瑰嚮浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      var position = event.position;
      if (!Cesium.defined(position)) {
        return;
      }
      var ray = the.viewer.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      if (isMoving) {
        isMoving = false;
        pickedAnchor.position.setValue(cartesian);
        var oid = pickedAnchor.oid;
        gatherPosition[oid] = cartesian;
      } else {
        var pickedObject = the.viewer.scene.pick(position);
        if (!Cesium.defined(pickedObject)) {
          return;
        }
        if (!Cesium.defined(pickedObject.id)) {
          return;
        }
        var entity = pickedObject.id;
        //console.log("entity",entity);
        //濡傛灉鐐瑰嚮鐨勪笉鏄偣锛涘垯杩斿洖
        if (entity.flag != "anchor") {
          return;
        }
        pickedAnchor = entity;
        isMoving = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    // 瀵归紶鏍囨姮璧蜂簨浠剁殑鐩戝惉
    this.militaryPlottingEditHandler.setInputAction((event) => {
      pickedAnchor = null;
      isMoving = false;
      the.viewer.scene.screenSpaceCameraController.enableRotate = true;
      the.viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    //绉诲姩浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      if (!isMoving || !pickedAnchor) {
        return;
      }
      the.viewer.scene.screenSpaceCameraController.enableRotate = false;
      the.viewer.scene.screenSpaceCameraController.enableZoom = false;

      var position = event.endPosition;
      if (!Cesium.defined(position)) {
        return;
      }

      var ray = the.viewer.scene.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      pickedAnchor.position.setValue(cartesian);
      var oid = pickedAnchor.oid;
      gatherPosition[oid] = cartesian;
      entityObj.FFPlotKeyPoints =
        the.cartesian3ArrToLngLatHeightArr(gatherPosition);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //鍙冲嚮浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      // entityObj.FFPlotKeyPoints =
      //   the.cartesian3ArrToLngLatHeightArr(gatherPosition);
      //鍏抽棴缂栬緫
      the.closeDoubleArrowEdit(entityObj);
      callback(entityObj);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    //閲嶇粯
    entityObj.polygon.hierarchy = new Cesium.CallbackProperty(function () {
      if (gatherPosition.length > 2) {
        var res = the.fineGatheringPlace(gatherPosition);
        if (res == null || res.length < 3) {
          return null;
        }
        var pHierarchy = new Cesium.PolygonHierarchy(res);
        return pHierarchy;
      } else {
        return null;
      }
    }, false);
  },
  /**
   * 娣诲姞闆嗙粨鍦?
   * @param {*} lnglatArr
   * @param {*} option
   */
  addRendezvousEntity(lnglatArr, option) {
    let newOption = Object.assign({}, option);
    var res = this.fineGatheringPlace(
      this.LngLatHeightArrToCartesian3Arr(lnglatArr)
    );
    var pHierarchy = new Cesium.PolygonHierarchy(res);
    var bData = {
      polygon: new Cesium.PolygonGraphics({
        hierarchy: pHierarchy,
        material: Cesium.Color.fromCssColorString(option.color).withAlpha(
          option.alpha
        ),
        show: true,
        ...newOption,
      }),
    };
    if (newOption.id) {
      bData.id = newOption.id;
    }
    let rendezvousEntity = this.viewer.entities.add(bData);
    this.setAttributeForEntity(rendezvousEntity, option, "FFRendezvousEntity");
    rendezvousEntity.FFPlotKeyPoints = lnglatArr;
    return rendezvousEntity;
  },

  /**
   * 鍏抽棴鍙岀澶寸紪杈?
   * @param {*} entityObj
   * @returns
   */
  closeDoubleArrowEdit(entityObj) {
    entityObj.FFPosition = entityObj.polygon.hierarchy.getValue().positions;
    let lngLatHeightArr = this.cartesian3ArrToLngLatHeightArr(
      entityObj.FFPosition
    );
    entityObj.FFCoordinates = lngLatHeightArr;
    //缁撴潫澶勭悊
    this.endMilitaryPlottingEditDeal();
    return entityObj;
  },
  /**
   * 鍙屽嚮绠ご杩涘叆缂栬緫
   * @param {*} entityObj
   */
  doubleArrowEdit(entityObj, callback) {
    this.mapToolClass.openMouseTip("鍘嬩綇缂栬緫鐐圭Щ鍔紝鍙冲嚮鍗冲彲瀹屾垚閲囬泦");
    document.getElementById(this.cesiumID).style.cursor = "pointer";

    let the = this;
    let isMoving = false;
    let pickedAnchor = null;
    let gatherPosition = this.LngLatHeightArrToCartesian3Arr(
      entityObj.FFPlotKeyPoints
    );
    for (var i = 0; i < gatherPosition.length; i++) {
      let pointTemp = createGatherPoint(gatherPosition[i], this.viewer);
      pointTemp.oid = i;
      pointTemp.flag = "anchor";
      the.militaryPlottingEditPoints.push(pointTemp);
    }
    //娣诲姞浜嬩欢
    this.militaryPlottingEditHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    //鐐瑰嚮浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      var position = event.position;
      if (!Cesium.defined(position)) {
        return;
      }
      var ray = the.viewer.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      if (isMoving) {
        isMoving = false;
        pickedAnchor.position.setValue(cartesian);
        var oid = pickedAnchor.oid;
        gatherPosition[oid] = cartesian;
      } else {
        var pickedObject = the.viewer.scene.pick(position);
        if (!Cesium.defined(pickedObject)) {
          return;
        }
        if (!Cesium.defined(pickedObject.id)) {
          return;
        }
        var entity = pickedObject.id;
        //console.log("entity",entity);
        //濡傛灉鐐瑰嚮鐨勪笉鏄偣锛涘垯杩斿洖
        if (entity.flag != "anchor") {
          return;
        }
        pickedAnchor = entity;
        isMoving = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    // 瀵归紶鏍囨姮璧蜂簨浠剁殑鐩戝惉
    this.militaryPlottingEditHandler.setInputAction((event) => {
      pickedAnchor = null;
      isMoving = false;
      the.viewer.scene.screenSpaceCameraController.enableRotate = true;
      the.viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    //绉诲姩浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      if (!isMoving || !pickedAnchor) {
        return;
      }
      the.viewer.scene.screenSpaceCameraController.enableRotate = false;
      the.viewer.scene.screenSpaceCameraController.enableZoom = false;
      var position = event.endPosition;
      if (!Cesium.defined(position)) {
        return;
      }

      var ray = the.viewer.scene.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      pickedAnchor.position.setValue(cartesian);
      var oid = pickedAnchor.oid;
      gatherPosition[oid] = cartesian;
      entityObj.FFPlotKeyPoints =
        the.cartesian3ArrToLngLatHeightArr(gatherPosition);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //鍙冲嚮浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      // entityObj.FFPlotKeyPoints =
      //   the.cartesian3ArrToLngLatHeightArr(gatherPosition);
      //鍏抽棴缂栬緫
      the.closeDoubleArrowEdit(entityObj);
      callback(entityObj);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    //閲嶇粯
    entityObj.polygon.hierarchy = new Cesium.CallbackProperty(function () {
      if (gatherPosition.length > 2) {
        try {
          var lonLats = the.cartesian3ArrToLngLatHeightArr(gatherPosition);
          //鍘婚噸
          the.coordinateArrDeduplication(lonLats);
          var doubleArrow = xp.algorithm.doubleArrow(lonLats);
          var positions = doubleArrow.polygonalPoint;
          if (!Cesium.defined(positions)) {
            return null;
          }
          if (positions == null || positions.length < 3) {
            return null;
          }
          var pHierarchy = new Cesium.PolygonHierarchy(positions);
          pHierarchy.keyPoints = lonLats;
          return pHierarchy;
        } catch (err) {
          return null;
        }
      } else {
        return null;
      }
    }, false);
  },
  /**
   * 鍙犲姞鍙岀澶?
   * @param {*} lnglatArr
   * @param {*} option
   * @returns
   */
  addDoubleArrowEntity(lnglatArr, option) {
    let newOption = Object.assign({}, option);

    var attackObj = xp.algorithm.doubleArrow(lnglatArr);
    console.log("attackObj", attackObj);
    var arrow = attackObj.polygonalPoint;
    console.log("鏍规嵁绠ご鍏抽敭鐐硅幏鍙栫澶存暟鎹細", arrow);
    var pHierarchy = new Cesium.PolygonHierarchy(arrow);
    //闂悎铏氱嚎
    var firstPoint = arrow[0];
    arrow.push(firstPoint);
    var bData = {
      polygon: new Cesium.PolygonGraphics({
        hierarchy: pHierarchy,
        material: Cesium.Color.fromCssColorString(option.color).withAlpha(
          option.alpha
        ),
        ...newOption,
      }),
    };
    if (newOption.id) {
      bData.id = newOption.id;
    }
    let doubleArrowEntity = this.viewer.entities.add(bData);
    this.setAttributeForEntity(
      doubleArrowEntity,
      option,
      "FFDoubleArrowEntity"
    );
    //鑾峰彇鐩寸嚎绠ご鍏抽敭鍧愭爣鏁版嵁
    doubleArrowEntity.FFPlotKeyPoints = lnglatArr;
    return doubleArrowEntity;
  },

  /**
   * 鍏抽棴鏀诲嚮绠ご淇敼
   * @param {*} entityObj
   * @returns
   */
  closeTailedAttackArrowEdit(entityObj) {
    entityObj.FFPosition = entityObj.polygon.hierarchy.getValue().positions;
    let lngLatHeightArr = this.cartesian3ArrToLngLatHeightArr(
      entityObj.FFPosition
    );
    entityObj.FFCoordinates = lngLatHeightArr;
    //缁撴潫澶勭悊
    this.endMilitaryPlottingEditDeal();
    return entityObj;
  },

  /**
   * 鏀诲嚮绠ご杩涘叆淇敼
   * @param {*} entityObj
   * @param {*} callback
   */
  tailedAttackArrowEdit(entityObj, callback) {
    this.mapToolClass.openMouseTip("鍘嬩綇缂栬緫鐐圭Щ鍔紝鍙冲嚮鍗冲彲瀹屾垚閲囬泦");
    document.getElementById(this.cesiumID).style.cursor = "pointer";

    let the = this;
    let isMoving = false;
    let pickedAnchor = null;
    let gatherPosition = this.LngLatHeightArrToCartesian3Arr(
      entityObj.FFPlotKeyPoints
    );
    for (var i = 0; i < gatherPosition.length; i++) {
      let pointTemp = createGatherPoint(gatherPosition[i], this.viewer);
      pointTemp.oid = i;
      pointTemp.flag = "anchor";
      the.militaryPlottingEditPoints.push(pointTemp);
    }
    //娣诲姞浜嬩欢
    this.militaryPlottingEditHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    //鐐瑰嚮浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      var position = event.position;
      if (!Cesium.defined(position)) {
        return;
      }
      var ray = the.viewer.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      if (isMoving) {
        isMoving = false;
        pickedAnchor.position.setValue(cartesian);
        var oid = pickedAnchor.oid;
        gatherPosition[oid] = cartesian;
      } else {
        var pickedObject = the.viewer.scene.pick(position);
        if (!Cesium.defined(pickedObject)) {
          return;
        }
        if (!Cesium.defined(pickedObject.id)) {
          return;
        }
        var entity = pickedObject.id;
        //console.log("entity",entity);
        //濡傛灉鐐瑰嚮鐨勪笉鏄偣锛涘垯杩斿洖
        if (entity.flag != "anchor") {
          return;
        }
        pickedAnchor = entity;
        isMoving = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    // 瀵归紶鏍囨姮璧蜂簨浠剁殑鐩戝惉
    this.militaryPlottingEditHandler.setInputAction((event) => {
      pickedAnchor = null;
      isMoving = false;
      the.viewer.scene.screenSpaceCameraController.enableRotate = true;
      the.viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    //绉诲姩浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      if (!isMoving || !pickedAnchor) {
        return;
      }
      the.viewer.scene.screenSpaceCameraController.enableRotate = false;
      the.viewer.scene.screenSpaceCameraController.enableZoom = false;
      var position = event.endPosition;
      if (!Cesium.defined(position)) {
        return;
      }

      var ray = the.viewer.scene.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      pickedAnchor.position.setValue(cartesian);
      var oid = pickedAnchor.oid;
      gatherPosition[oid] = cartesian;
      entityObj.FFPlotKeyPoints =
        the.cartesian3ArrToLngLatHeightArr(gatherPosition);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //鍙冲嚮浜嬩欢
    this.militaryPlottingEditHandler.setInputAction(function (event) {
      // entityObj.FFPlotKeyPoints =
      //   the.cartesian3ArrToLngLatHeightArr(gatherPosition);
      //鍏抽棴缂栬緫
      the.closeTailedAttackArrowEdit(entityObj);
      callback(entityObj);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    //閲嶇粯
    entityObj.polygon.hierarchy = new Cesium.CallbackProperty(function () {
      if (gatherPosition.length > 1) {
        var lonLats = the.cartesian3ArrToLngLatHeightArr(gatherPosition);
        //console.log("lonLats", lonLats);
        var tailedAttackArrowTemp = xp.algorithm.tailedAttackArrow(lonLats);
        //console.log("tailedAttackArrowTemp", tailedAttackArrowTemp);
        var positions = tailedAttackArrowTemp.polygonalPoint;
        if (positions == null || positions.length < 3) {
          return null;
        }
        var pHierarchy = new Cesium.PolygonHierarchy(positions);
        pHierarchy.keyPoints = lonLats;
        return pHierarchy;
      } else {
        return null;
      }
    }, false);
  },
  /**
   * 娣诲姞鏀诲嚮绠ご
   * @param {*} lnglatArr
   * @param {*} option
   * @returns
   */
  addTailedAttackArrow(lnglatArr, option) {
    let newOption = Object.assign({}, option);

    var attackObj = xp.algorithm.tailedAttackArrow(lnglatArr);
    var arrow = attackObj.polygonalPoint;
    console.log("attackObj:", attackObj);
    console.log("鏍规嵁绠ご鍏抽敭鐐硅幏鍙栫澶存暟鎹細", arrow);
    var pHierarchy = new Cesium.PolygonHierarchy(arrow);
    var bData = {
      polygon: new Cesium.PolygonGraphics({
        hierarchy: pHierarchy,
        material: Cesium.Color.fromCssColorString(option.color).withAlpha(
          option.alpha
        ),
        ...newOption,
      }),
    };
    if (newOption.id) {
      bData.id = newOption.id;
    }
    let tailedAttackArrowEntity = this.viewer.entities.add(bData);
    var keyPointArr = [];
    for (var i = 0; i < attackObj.controlPoint.length; i++) {
      var obj = Cesium.Cartesian3.fromDegrees(
        attackObj.controlPoint[i][0],
        attackObj.controlPoint[i][1]
      );
      keyPointArr.push(obj);
    }
    tailedAttackArrowEntity.keyPoints = keyPointArr;
    this.setAttributeForEntity(
      tailedAttackArrowEntity,
      option,
      "FFTailedAttackArrowEntity"
    );
    //鑾峰彇鐩寸嚎绠ご鍏抽敭鍧愭爣鏁版嵁
    tailedAttackArrowEntity.FFPlotKeyPoints = lnglatArr;
    return tailedAttackArrowEntity;
  },

  /**
   * 鍙犲姞鐩寸嚎绠ご鐨勬爣缁?
   * @param {*} lnglatArr
   * @param {*} option
   * @returns
   */
  addStraightArrowEntity(lnglatArr, option) {
    let newOption = Object.assign({}, option);
    var arrow = xp.algorithm.fineArrow(lnglatArr[0], lnglatArr[1]);
    console.log("鏍规嵁绠ご鍏抽敭鐐硅幏鍙栫澶存暟鎹細", arrow);
    var pHierarchy = new Cesium.PolygonHierarchy(arrow);
    var bData = {
      polygon: new Cesium.PolygonGraphics({
        hierarchy: pHierarchy,
        material: Cesium.Color.fromCssColorString(option.color).withAlpha(
          option.alpha
        ),
        ...newOption,
      }),
    };
    if (newOption.id) {
      bData.id = newOption.id;
    }
    let straightArrowEntity = this.viewer.entities.add(bData);
    this.setAttributeForEntity(
      straightArrowEntity,
      option,
      "FFStraightArrowEntity"
    );
    //鑾峰彇鐩寸嚎绠ご鍏抽敭鍧愭爣鏁版嵁
    straightArrowEntity.FFPlotKeyPoints = lnglatArr;
    return straightArrowEntity;
  },
  /**
   * 鍏抽棴鐩寸嚎绠ご淇敼
   * @param {*} entityObj
   * @returns
   */
  closeStraightArrowEdit(entityObj) {
    entityObj.FFPosition = entityObj.polygon.hierarchy.getValue().positions;
    let lngLatHeightArr = this.cartesian3ArrToLngLatHeightArr(
      entityObj.FFPosition
    );
    entityObj.FFCoordinates = lngLatHeightArr;
    //缁撴潫澶勭悊
    this.endMilitaryPlottingEditDeal();
    return entityObj;
  },
  /**
   * 鐩寸嚎绠ご淇敼
   * @param {*} entityObj
   * @param {*} callback
   */
  straightArrowEdit(entityObj, callback) {
    this.mapToolClass.openMouseTip("鍘嬩綇缂栬緫鐐圭Щ鍔紝鍙冲嚮鍗冲彲瀹屾垚閲囬泦");
    document.getElementById(this.cesiumID).style.cursor = "pointer";

    let the = this;
    let isMoving = false;
    let pickedAnchor = null;
    let gatherPosition = this.LngLatHeightArrToCartesian3Arr(
      entityObj.FFPlotKeyPoints
    );
    for (var i = 0; i < gatherPosition.length; i++) {
      let pointTemp = createGatherPoint(gatherPosition[i], this.viewer);
      pointTemp.oid = i;
      pointTemp.flag = "anchor";
      the.militaryPlottingEditPoints.push(pointTemp);
    }
    //娣诲姞浜嬩欢
    this.militaryPlottingEditHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    this.militaryPlottingEditHandler.setInputAction(function (event) {
      var position = event.position;
      if (!Cesium.defined(position)) {
        return;
      }
      var ray = the.viewer.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      if (isMoving) {
        isMoving = false;
        pickedAnchor.position.setValue(cartesian);
        var oid = pickedAnchor.oid;
        gatherPosition[oid] = cartesian;
      } else {
        var pickedObject = the.viewer.scene.pick(position);
        if (!Cesium.defined(pickedObject)) {
          return;
        }
        if (!Cesium.defined(pickedObject.id)) {
          return;
        }
        var entity = pickedObject.id;
        //console.log("entity",entity);
        //濡傛灉鐐瑰嚮鐨勪笉鏄偣锛涘垯杩斿洖
        if (entity.flag != "anchor") {
          return;
        }
        pickedAnchor = entity;
        isMoving = true;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // 瀵归紶鏍囨姮璧蜂簨浠剁殑鐩戝惉
    this.militaryPlottingEditHandler.setInputAction((event) => {
      pickedAnchor = null;
      isMoving = false;
      the.viewer.scene.screenSpaceCameraController.enableRotate = true;
      the.viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    this.militaryPlottingEditHandler.setInputAction(function (event) {
      if (!isMoving || !pickedAnchor) {
        return;
      }
      the.viewer.scene.screenSpaceCameraController.enableRotate = false;
      the.viewer.scene.screenSpaceCameraController.enableZoom = false;
      var position = event.endPosition;
      if (!Cesium.defined(position)) {
        return;
      }

      var ray = the.viewer.scene.camera.getPickRay(position);
      if (!Cesium.defined(ray)) {
        return;
      }
      var cartesian = the.viewer.scene.globe.pick(ray, the.viewer.scene);
      if (!Cesium.defined(cartesian)) {
        return;
      }
      pickedAnchor.position.setValue(cartesian);
      var oid = pickedAnchor.oid;
      gatherPosition[oid] = cartesian;
      entityObj.FFPlotKeyPoints =
        the.cartesian3ArrToLngLatHeightArr(gatherPosition);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.militaryPlottingEditHandler.setInputAction(function (event) {
      //鍏抽棴缂栬緫
      the.closeStraightArrowEdit(entityObj);
      callback(entityObj);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    //閲嶇粯
    entityObj.polygon.hierarchy = new Cesium.CallbackProperty(function () {
      if (gatherPosition.length > 1) {
        var p1 = gatherPosition[0];
        var p2 = gatherPosition[1];
        if (the.isSimpleXYZ(p1, p2)) {
          return null;
        }
        var firstPoint = the.positionToLngLatHeight(p1);
        var endPoints = the.positionToLngLatHeight(p2);
        var arrow = xp.algorithm.fineArrow(
          [firstPoint[0], firstPoint[1]],
          [endPoints[0], endPoints[1]]
        );
        var pHierarchy = new Cesium.PolygonHierarchy(arrow);
        pHierarchy.keyPoints = [firstPoint, endPoints];
        return pHierarchy;
      } else {
        return null;
      }
    }, false);
  },
};

