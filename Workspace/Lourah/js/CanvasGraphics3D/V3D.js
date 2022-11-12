function V3D() {
   this.u = 0;
   this.v = 0;
   this.w = 0;

  this.setUVW = function(u, v, w) {
     this.u = u;
     this.v = v;
     this.w = w;
     return this;
  }

  this.setAB = function (a, b) {
     return this.setUVW(b.x - a.x, b.y - a.y, b.z - a.z);
  }

  this.setV = function(v) {
     return this.setUVW(v.u, v.v, v.w);
  }

  this.norm = function() {
     return Math.sqrt(this.u*this.u + this.v*this.v + this.w*this.w);
  }

  this.normalize = function(norm) {
     var n = this.norm();
     if (norm === undefined) norm = 1;
     return this.setUVW(norm*this.u/n
             , norm*this.v/n
             , norm*this.w/n);
  }

 this.toString = function() {
     return "V3D(" + [ this.u, this.v, this.w ].join(',') + ")";
 }
  
  switch(arguments.length) {
  	case 0 : break ;
      case 1: this.setV(arguments [0]);
                    break ;
      case 2: this.setAB(arguments [0], arguments [1]);
                    break;
      case 3: this.setUVW(arguments [0], arguments [1], arguments [2])
                    break;
     default: Lourah.logAndThrow("V3D: invalid number of arguments (" + arguments.length + ")");
                    break ;
  	}
  
}

V3D.scalarProduct = function(u,v) {
    return u.u * v.u + u.v * v.v + u.w * v.w;
    }
    
V3D.vectorProduct = function(u,v) {
     var vp = new V3D();
     return vp.setUVW(
          u.v * v.w - u.w * v.v
        , u.w * v.u - u.u * v.w
        , u.u * v.v - u.v * v.u
        );
    }