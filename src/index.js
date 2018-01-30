import Windy from './js/windy/Windy';
import Strom from './js/strom/Strom';
import $ from 'jquery';

var czml = [{
    "id" : "document",
    "name" : "CZML Polygon - Intervals and Availability",
    "version" : "1.0",
    "clock": {
        "interval": "2012-08-04T16:00:00Z/2012-08-04T17:00:00Z",
        "currentTime": "2012-08-04T16:00:00Z",
        "multiplier": 900
    }
}, {
    "id" : "dynamicWind",
    "name": "Dynamic Wind with Intervals",
    "availability":"2012-08-04T16:00:00Z/2012-08-04T17:00:00Z",
    "path" : {
        "material" : {
            "polylineOutline" : {
                "color" : {
                    "rgba" : [255, 255, 255, 255]
                },
                "outlineColor" : {
                    "rgba" : [255, 255, 0, 125]
                },
                "outlineWidth" : 1
            }
        },
        "width" : 3,
        leadTime: 1,
        "resolution" : 5
    },
    "billboard": {
    	"image": "./Data/TVS.png",
    	"scale": .15
    },
    // "position": {
    // 	"cartographicDegrees": [120, 20, 0]
    // }
    "position": {
    	"epoch" : "2012-08-04T16:00:00Z",
    	"cartographicDegrees": [
    		400, 120, 20, 0,
    		400, 119, 20.5, 0,
			800, 118, 21, 0,
			1200, 117, 21.5, 0,
			1600, 116, 22, 0,
			2000, 115, 23.5, 0,
			2400, 114, 24, 0,
			3600, 110, 27, 0
    	]
    }
}];

var strom = new Strom([120, 20], 1, .5);
var path = strom.forecastPath(10);


function animateStrom () {
    var polyline = new Cesium.PolylineGeometry({
         positions : Cesium.Cartesian3.fromDegreesArray(path[0].concat(path[1])),
         colors: [Cesium.Color.WHITE, Cesium.Color.WHITE.withAlpha(0)],
         width: 1.5,
         colorsPerVertex: true
    });
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: [new Cesium.GeometryInstance({
            geometry: polyline
        })],
        appearance: new Cesium.PolylineColorAppearance({
            translucent: true
        })
    }))
}

var viewer = new Cesium.Viewer('cesiumContainer');
// viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
var windy, lastTime;
animateStrom();
// reqDynamicWind();
function reqDynamicWind () {
    $.ajax({
        type: "get",
        url: "./Data/uvwind_d01.json",
        dataType: "json",
        success: function (response) {
            var header = response[0].header;
            createRect(header['lo1'], header['la2'], header['lo2'], header['la1']);
            viewer.camera.setView({
                destination: Cesium.Rectangle.fromDegrees(header['lo1'], header['la2'], header['lo2'], header['la1'])
            });
            windy = new Windy(response, viewer);
            lastTime = new Date().getTime();
            redraw();
        },
        error: function (errorMsg) {
            alert("请求数据失败1!");
        }
    });
}

var timer = null;
function redraw() {
    // var curTime = new Date().getTime();
    // if ( curTime - lastTime > 100) {
    //     windy.animate();
    //     lastTime = curTime;
    // }

    timer = setInterval(function () {
        windy.animate();
    }, 100);
    // Cesium.requestAnimationFrame(redraw);
}

function createRect (west, south, east, north) {
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: [
            getRectInstance(Cesium.Rectangle.fromDegrees(west, south, east, north))
        ],
        appearance: new Cesium.PolylineColorAppearance({
            translucent: false
        })
    }));
}

function getRectInstance (rect) {
    return new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleOutlineGeometry({
            rectangle: rect
        }),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                Cesium.Color.RED
            )
        }
    })
}