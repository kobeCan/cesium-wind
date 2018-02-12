/*
 * direction degree
 * speed m/s
 **/
const degreeKm = 111000;	// 111km;
const Strom = function (x, y, speed, direction, lineLength, forecast) {
	var radians = direction / 180 * Math.PI;
	var sin = Math.sin(radians);
	var cos = Math.cos(radians);
	var xEnd = x + lineLength * sin / degreeKm;
	var yEnd = y + lineLength * cos / degreeKm;
	// 预测时间 1 hour
	this.forecast = forecast ? (forecast * 3600) : 3600;
	this.position = [x, y, xEnd, yEnd];
	this.curPosition = [x, y, xEnd, yEnd];
	this.speed = speed;
	this.direction = direction;
	// u v 方向每秒走多少经纬度值。
	this.u = speed * sin / degreeKm;
	this.v = speed * cos / degreeKm;
	this.time = 0;
}

Strom.prototype = {
	constructor: Strom,
	animate: function (cesiumViewer) {
		var that = this;
		this._timer = setInterval(function () {
			that.updatePosition();
			that.clearStorm(cesiumViewer);
			that.updateStorm(cesiumViewer);
		}, 100);
	},
	stopAnimate: function () {
		this._timer && clearInterval(this._timer);
		this._timer = null;
	},
	updatePosition: function () {
		if (this.time >= this.forecast) {
			var that = this;
			this.curPosition.forEach(function (value, index) {
				that.curPosition[index] = that.position[index];
			});
			this.time = 0;
			return;
		}
		this.time += 600;
		this.curPosition[0] += this.u * 600;
		this.curPosition[1] += this.v * 600;
		this.curPosition[2] += this.u * 600;
		this.curPosition[3] += this.v * 600;
	},
	updateStorm: function (viewer) {
		var polylineGeometry = new Cesium.PolylineGeometry({
		     positions : Cesium.Cartesian3.fromDegreesArray(this.curPosition),
		     colors: [Cesium.Color.WHITE.withAlpha(0), Cesium.Color.WHITE],
		     width: 1.5,
		     colorsPerVertex: true
		});

		this._polyline = viewer.scene.primitives.add(new Cesium.Primitive({
		    geometryInstances: [new Cesium.GeometryInstance({
		        geometry: polylineGeometry
		    })],
		    appearance: new Cesium.PolylineColorAppearance({
		        translucent: true
		    }),
		    asynchronous: false
		}));
	},
	clearStorm: function (viewer) {
		this._polyline && viewer.scene.primitives.remove(this._polyline);
	}
}

export default Strom