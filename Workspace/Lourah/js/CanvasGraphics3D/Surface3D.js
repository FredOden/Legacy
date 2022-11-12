function Surface3D() {
	this.handler = undefined;
}

Surface3D.prototype.getXYZ = function(t) {
	try {
	      return new P3D(this.handler.getPoint(t));
	      }
	catch(e) {
		console.log("Surface3D.getXYZ(" + t + "):err!!!:" + e);
		return null;
		}
	}
	
Surface3D.prototype.getSpheric = function(t) {
	try {
	      return (new P3D()).setSpheric(this.handler.getPoint(t));
	      }
	catch(e) {
		console.log("Surface3D.getSpheric(" + t + "):err!!!:" + e);
		return null;
		}
	}
