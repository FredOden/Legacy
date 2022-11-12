function P3D() {
   
   this.fixed = false;
              
   this.setXYZ = function (x3d, y3d, z3d) {
           this.x = x3d;
           this.y = y3d;
           this.z = z3d;
           this.pr = undefined;
           return this;
         };
         
     this.setSpheric = function(rho, latitude, longitude) {
        var lat= latitude*Math.PI/180;
        var longit = longitude*Math.PI/180;
        var slat = Math.sin(lat);
        var x = rho*slat*Math.cos(longit);
        var y = rho*slat*Math.sin(longit);
        var z = rho*Math.cos(lat);
        return this.setXYZ(x, y, z);
         };
             
         this.setP = function(p) {
             this.x = p.x;
             this.y = p.y;
             this.z = p.z;
             this.pr = undefined;
             this.scale = undefined;
             this.fixed = p.fixed;
             return this;
          };
          
    this.setFixed = function() {
    	this.fixed = true;
        return this;
    	}
          
    switch (arguments.length) {
    	case 0: this.setXYZ(0, 0, 0);
                      break;
        case 1: this.setP(arguments[0]);
                      break;
        case 3: this.setXYZ(arguments[0]
                                           ,arguments[1]
                                           ,arguments[2]); 
                       break;
         default:
                      Lourah.logAndThrow("P3D invalid number of arguments (" + arguments.length + ")");
                       break;             
    }
    
    this.toString = function() {
    	return "P3D(" + this.x +"," + this.y + "," + this.z +")";
    	};
}

P3D.translate = function(p, v) {
   var t = new P3D();
   return t.setXYZ(p.x + v.u
                                ,p.y + v.v
                                ,p.z + v.w);
}

