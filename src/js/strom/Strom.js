const Strom = function ([x, y], uSpeed, vSpeed, forecastTime = 1) {
	// 预测时间 1 hour
	this.forecast = 1;
	this.x = x;
	this.y = y;
	this.uSpeed = uSpeed;
	this.vSpeed = vSpeed;
}

Strom.prototype = {
	constructor: Strom,
	forecastPath: function (count) {
		var path = [];
		let {x, y, forecast, uSpeed, vSpeed} = this;

		for (var i = 0; i < count; i++) {
			path.push([x + uSpeed * i, y + vSpeed * i]);
		}
		return path;
	}
}

export default Strom