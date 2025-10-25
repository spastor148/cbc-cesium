import * as Cesium from "cesium";

class MapClass {
  mapUrl = "http://113.0.120.80:8003/YTBingmap/{z}/{x}/{y}.jpg";
  qxsyUrl = "http://113.0.120.80:8003/YTQSQXSY2/tileset.json";
  qxsyHeight = 182;
  terrainUrl = "http://113.0.120.80:8003/terrain";

  centerOption = {
    lngLatHeight: [129.7206803448775, 46.68638059953559, 2000],
    pitch: -90
  };
  viewer;
  photographyLayer;
  constructor() {}
  //初始化地图
  initMap(id) {
    let viewerOption = {
      animation: false, //是否创建动画小器件，左下角仪表
      baseLayerPicker: false, //是否显示图层选择器
      baseLayer: false,
      fullscreenButton: false, //是否显示全屏按钮
      geocoder: false, //是否显示geocoder小器件，右上角查询按钮
      homeButton: false, //是否显示Home按钮
      infoBox: false, //是否显示信息框
      sceneModePicker: false, //是否显示3D/2D选择器
      scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      selectionIndicator: false, //是否显示选取指示器组件
      timeline: false, //是否显示时间轴
      navigationHelpButton: false, //是否显示右上角的帮助按钮
      shadows: true, //是否显示背影
      shouldAnimate: true,
      orderIndependentTranslucency: true,
      contextOptions: {
        // requestWebgl1: true,
        webgl: {
          alpha: true
        }
      }
    };
    this.viewer = new Cesium.Viewer(id, viewerOption);
    this.viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        this.centerOption.lngLatHeight[0],
        this.centerOption.lngLatHeight[1],
        this.centerOption.lngLatHeight[2]
      ),
      orientation: {
        // 指向
        heading: Cesium.Math.toRadians(0),
        // 视角
        pitch: Cesium.Math.toRadians(this.centerOption.pitch),
        roll: 0.0
      }
    });
    var mapOption = {
      url: this.mapUrl,
      minimumLevel: 0, //最小层级
      maximumLevel: 19,
      tileWidth: 256,
      tileHeight: 256
    };
    var imgProvider = new Cesium.UrlTemplateImageryProvider(mapOption);
    this.viewer.imageryLayers.addImageryProvider(imgProvider);
    //叠加倾斜摄影
    this.addPhotographyOrigin(this.qxsyUrl);
    //叠加地形
    this.addTerrain(this.terrainUrl);
    return this.viewer;
  }

  addModelLayer(modelParam) {
    modelParam.option = {
      maximumMemoryUsage: 100, //不可设置太高，目标机子空闲内存值以内，防止浏览器过于卡
      maximumScreenSpaceError: 20, //用于驱动细节细化级别的最大屏幕空间错误;较高的值可提供更好的性能，但视觉质量较低。
      maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
      shadows: false, //是否显示阴影
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 0.00278,
      dynamicScreenSpaceErrorFactor: 4.0,
      dynamicScreenSpaceErrorHeightFalloff: 0.25
    };
    console.log("addModelLayer--modelParam", modelParam);
    let promise = this.add3DTile(modelParam);
    return promise;
  }
  async add3DTile(modelParam) {
    let the = this;
    try {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(modelParam.url, modelParam.option);
      the.viewer.scene.primitives.add(tileset);
      console.log("add3DTile--定位完成");
      let lightColor = "2.2";
      tileset._customShader = new Cesium.CustomShader({
        fragmentShaderText:
          `
                void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                        material.diffuse = material.diffuse * ` +
          lightColor +
          `;
            }`
      });
      the.update3dtilesMaxtrix(tileset, modelParam.location);
      return tileset;
    } catch (error) {
      console.error(`Error loading tileset: ${error}`);
    }
  }
  update3dtilesMaxtrix(tileset, params) {
    //console.log('update3dtilesMaxtrix--tileset, modelObj', tileset, params)
    //旋转
    var mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
    var my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
    var mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
    var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
    var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
    var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    //平移
    var position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
    var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    //旋转、平移矩阵相乘
    Cesium.Matrix4.multiply(m, rotationX, m);
    Cesium.Matrix4.multiply(m, rotationY, m);
    Cesium.Matrix4.multiply(m, rotationZ, m);
    //比例缩放
    var scale = Cesium.Matrix4.fromUniformScale(params.scale);
    Cesium.Matrix4.multiply(m, scale, m);
    //console.log('矩阵m:', m)
    //console.log('矩阵m-tileset:', tileset)

    //赋值给tileset
    tileset._root.transform = m;
  }
  /**
   * 异步添加地形服务。
   * @param {string} url - 地形数据的URL。
   * @returns {Promise} 返回一个Promise，解析为添加的地形提供者对象。
   */
  async addTerrain(url) {
    try {
      var terrainLayer = await Cesium.CesiumTerrainProvider.fromUrl(url, {});
      this.viewer.scene.terrainProvider = terrainLayer;
      return terrainLayer;
    } catch (error) {
      console.log(`Error loading tileset: ${error}`);
    }
  }

  //叠加倾斜摄影
  addPhotographyOrigin() {
    let the = this;
    console.log("叠加倾斜摄影");
    if (this.photographyLayer != null) {
      this.viewer.scene.primitives.remove(this.photographyLayer);
      this.photographyLayer = null;
    }
    let option = {
      maximumMemoryUsage: 1024, //不可设置太高，目标机子空闲内存值以内，防止浏览器过于卡
      maximumScreenSpaceError: 20, //用于驱动细节细化级别的最大屏幕空间错误;较高的值可提供更好的性能，但视觉质量较低。
      maximumNumberOfLoadedTiles: 2000, //最大加载瓦片个数
      shadows: false, //是否显示阴影
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 0.00278,
      dynamicScreenSpaceErrorFactor: 4.0,
      dynamicScreenSpaceErrorHeightFalloff: 0.25
    };
    let promise = this.addObliquePhotography(this.qxsyUrl, option);
    console.log("开始叠加倾斜摄影");
    promise.then((result) => {
      let lightColor = "1.2";
      result._customShader = new Cesium.CustomShader({
        fragmentShaderText:
          `
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                  material.diffuse = material.diffuse * ` +
          lightColor +
          `;
      }`
      });
      the.setHeight(result, the.qxsyHeight);
      the.photographyLayer = result;
      console.log("成功叠加倾斜摄影--the.photographyLayer1", the.photographyLayer);

    });
  }

  clippingPolygons(lnglatArr) {
    console.log("clippingPolygons--lnglatArr",lnglatArr);
    this.photographyLayer.clippingPolygons=undefined;
    this.photographyLayer.clippingPolygons = new Cesium.ClippingPolygonCollection({
      polygons: [
        new Cesium.ClippingPolygon({
          positions: Cesium.Cartesian3.fromDegreesArray(lnglatArr.flat())
        })
      ],
      inverse: false //true，显示点集合区域，去掉外部，false，挖掉点集合区域
    });
    console.log("成功叠加倾斜摄影--the.photographyLayer2", this.photographyLayer);

  }

  setHeight(tileset, height) {
    //3dtile模型的边界球体
    var boundingSphere = tileset.boundingSphere;
    //迪卡尔空间直角坐标=>地理坐标（弧度制）
    var cartographic_original = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    //地理坐标（弧度制）=>迪卡尔空间直角坐标
    var Cartesian3_original = Cesium.Cartesian3.fromRadians(
      cartographic_original.longitude,
      cartographic_original.latitude,
      cartographic_original.height
    );
    var Cartesian3_offset = Cesium.Cartesian3.fromRadians(cartographic_original.longitude, cartographic_original.latitude, height);
    //获得地面和offset的转换
    var translation = Cesium.Cartesian3.subtract(Cartesian3_offset, Cartesian3_original, new Cesium.Cartesian3());
    //修改模型矩阵
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
  }
  async addObliquePhotography(url, option) {
    try {
      //const tileset = await Cached3DTileset.fromUrl(url, option);
      const tileset = await Cesium.Cesium3DTileset.fromUrl(url, option);
      this.viewer.scene.primitives.add(tileset);
      return tileset;
    } catch (error) {
      console.log(`Error loading tileset: ${error}`);
    }
  }
}

export default MapClass;
