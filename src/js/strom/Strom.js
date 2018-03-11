const degreeKm = 111000;
const Storm = function (x, y, speed, direction) {
	var radians = direction / 180 * Math.PI;
	var sin = Math.sin(radians);
	var cos = Math.cos(radians);
	this.x = x;
	this.y = y;
	this.u = speed * sin / degreeKm;
	this.v = speed * cos / degreeKm;
	this.path = null;
}

export default Storm