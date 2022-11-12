// Volume3D
//
function Volume3D(p3dHandler) {
	this.p3dHandler = p3dHandler;
	this.getP3dAt = function(theta, phi) {
		return new P3D(...this.p3dHandler(theta, phi));
		};
	}
	
function View3D(volume3d, split) {
	this.volume3d = volume3d;
	this.split = split;
	}
	
var R = 100;
var r = 40;
var v3d = new Volume3D(
    function(theta, phi) {
    	  return [
               (R + r*Math.cos(theta))
                            *Math.cos(phi)
               ,(R + r*Math.cos(theta))
                            *Math.sin(phi)
               ,(R + r*Math.sin(phi))
                             *Math.sin(theta)
               ];
    	}
);
