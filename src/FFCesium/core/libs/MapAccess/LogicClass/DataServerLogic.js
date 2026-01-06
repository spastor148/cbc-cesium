import * as Cesium from "cesium";

class DataServerLogic {
    constructor() { }

    // 创建倾斜摄影Tileset
    async createObliquePhotography(url, option) {
        return await Cesium.Cesium3DTileset.fromUrl(url, option);
    }

    // 创建地形Provider
    async createTerrainProvider(url) {
        return await Cesium.CesiumTerrainProvider.fromUrl(url, {});
    }

    // 创建默认地形Provider
    createEllipsoidTerrainProvider() {
        return new Cesium.EllipsoidTerrainProvider();
    }

    // 解析Geojson
    readGeojson(geojson) {
        return Cesium.GeoJsonDataSource.load(geojson);
    }

    // 样式化Geojson
    styleGeoJson(dataSource, option) {
        option.stroke = Cesium.Color.fromCssColorString(option.stroke);
        option.fill = Cesium.Color.fromCssColorString(option.fill).withAlpha(
            option.fillAlpha
        );
        dataSource.entities.values.forEach(function (entity) {
            if (entity.polygon) {
                entity.polygon.outline = false;
                entity.polygon.material = option.fill;
                entity.polyline = {
                    positions: entity.polygon.hierarchy._value.positions,
                    width: option.strokeWidth,
                    material: option.stroke,
                };
            }
        });
        return dataSource;
    }

    // 解析KML
    readKml(kml, viewer) {
        return Cesium.KmlDataSource.load(kml, {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas,
            screenOverlayContainer: viewer.container,
        });
    }

    // 创建WMS Provider
    createWmsProvider(url, layerName) {
        return new Cesium.WebMapServiceImageryProvider({
            url: url,
            layers: layerName,
            parameters: {
                transparent: true,
                service: "WMS",
                format: "image/png",
                srs: "EPSG:4326",
            },
        });
    }

    // 根据配置创建WMS Provider
    createWmsProviderFromOption(option) {
        return new Cesium.WebMapServiceImageryProvider(option);
    }
}

export default DataServerLogic;
