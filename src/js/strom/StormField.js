/*
 * direction degree
 * speed m/s
 **/
 import Storm from './Storm'

const TIME_RATE = 300;
const LINE_LENGTH_RATE = 10;
const StormField = function (viewer, data, options) {
	this._primitives = viewer.scene.primitives;
	this.data = data;
	this.forecastTime = options.forecastTime * 60 * 60;
	this.currentTime = 0;
	this.storms = null;

	this._init();
}

StormField.prototype = {
	constructor: StormField,
	_init: function () {
			this._createField();
	},
	_createField: function () {
		var storms = [];
		this.data.forEach(function (item) {
			var storm = new Storm(item.x, item.y, item.speed, item.direction);
			storm.path = [
				storm.x, 
				storm.y, 
				storm.x + storm.u * TIME_RATE * LINE_LENGTH_RATE, 
				storm.y + storm.v * TIME_RATE * LINE_LENGTH_RATE
			];
			storms.push(storm);
		});
		this.storms = storms;
	},
	animate: function () {
		var that = this;
		this._timer = setInterval(function () {
			that.updatePosition();
			that.clearStorm();
			that.updateStorm();
		}, 100);
	},
	stopAnimate: function () {
		this._timer && clearInterval(this._timer);
		this._timer = null;
	},
	resetPosition: function () {
		this.storms.forEach(function (storm) {
			storm.path[0] = storm.x;
			storm.path[1] = storm.y;
			storm.path[2] = storm.x + storm.u * TIME_RATE * LINE_LENGTH_RATE;
			storm.path[3] = storm.y + storm.v * TIME_RATE * LINE_LENGTH_RATE;
		});
	},
	updatePosition: function () {
		if (this.currentTime >= this.forecastTime) {
			this.resetPosition();
			this.currentTime = 0;
			return;
		}
		this.currentTime += TIME_RATE;
		var that = this;
		this.storms.forEach(function (storm) {
			var dx = storm.u * that.currentTime;
			var dy = storm.v * that.currentTime;
			storm.path[0] += dx;
			storm.path[1] += dy;
			storm.path[2] += dx;
			storm.path[3] += dy;
		});
	},
	updateStorm: function () {
		var instances = [];
		this.storms.forEach(function (storm) {
			var polylineGeometry = new Cesium.PolylineGeometry({
			     positions : Cesium.Cartesian3.fromDegreesArray(storm.path),
			     colors: [Cesium.Color.WHITE.withAlpha(0), Cesium.Color.WHITE],
			     width: 1.5,
			     colorsPerVertex: true
			});

			instances.push(new Cesium.GeometryInstance({
        geometry: polylineGeometry
	    }));
		});
		this._polylines = this._primitives.add(new Cesium.Primitive({
		    geometryInstances: instances,
		    appearance: new Cesium.PolylineColorAppearance({
		        translucent: true
		    }),
		    asynchronous: false
		}));
	},
	clearStorm: function () {
		this._polylines && this._primitives.remove(this._polylines);
	}
}

export default StormField