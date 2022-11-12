/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Canvas3D(canvas) {
   this.canvas = canvas;
   this.fov = 1500;
   this.c3d = canvas.getContext("2d");
   
   this.zSpaces = new ZSpaces(this);
   this.c3d.zSpaces = this.zSpaces;
   
   this.scratch = document.createElement("canvas");
   this.scratch.width = this.canvas.width;
   this.scratch.height = this.canvas.height;
   this.c2d = this.scratch.getContext("2d");
   
   var translation = (new P3D()).setXYZ(0, 0, 0);

   this.x0 = canvas.width/2;
   this.y0 = canvas.height/2;
   this.recompute = false;

    this.setRotation = function(rx, ry, rz) {
    	this.recompute = true;
        this.rx = rx*Math.PI/180;
        this.ry = ry*Math. PI/180;
        this.rz = rz*Math. PI/180;
        
        this.crx = Math. cos(this.rx);
        this.srx = Math.sin(this.rx);
        
        this.cry = Math. cos(this.ry);
        this.sry = Math.sin(this.ry);
        
        this.crz = Math. cos(this.rz);
        this.srz = Math.sin(this.rz);
    };

    this.setRotation(0,0,0);

    this.rotate = function(p) {
        var pr = (new P3D()).setP(p);
        
        // rotate x axis
        if (this.srx !== 0) {

           pr.setXYZ(pr.x
                   , pr.y*this.crx - pr.z*this.srx
                   , pr.y*this.srx + pr.z*this.crx);
           }
        // rotate y axis
        if (this.sry !== 0) {
           pr.setXYZ(pr.z*this.sry + pr.x*this.cry
                   , pr.y
                   , pr.z*this.cry - pr.x*this.sry);
           }
        // rotate z axis
        if (this.srz !== 0) {
           pr.setXYZ(pr.x*this.crz - pr.y*this.srz
                   , pr.x*this.srz + pr.y*this.crz
                   , pr.z);
           }
        return pr;
    };

   this.setTranslation = function(p) {
     this.recompute = true;
      translation.setP(p);
   };

   var translated = new P3D();
   
  this.transform3D = function(p) {
  	//console.log("call transform(" + p + ")");
   //	if (p.pr === undefined) {
   	if (p.fixed) {
   	    p.pr = { x:p.x, y:p.y, z:p.z };
   	    } else {
   	          p.pr = this.rotate(translated.setXYZ(
                   p.x + translation.x
                  ,p.y + translation.y
                  ,p.z + translation.z
               ));
           }
                p.scale = this.fov/(p.pr.z+ this.fov);

              // p.pr.z = -p.pr.z;
            //this.recompute = false;
   //	}
      //console.log(p + "->" + p.pr);
      return p;
  };

   this.toP2D = function(p) {
   	       
               this.transform3D(p);
 
               /*
               return new P2D(
                               this.x0 + Math.round(p.pr.x*p.scale)
                             , this.y0 - Math.round(p.pr.y*p.scale)
                             , p.pr.z);
               */
               var x = this.x0 + Math.round(p.pr.x*p.scale);
               var y = this.y0 - Math.round(p.pr.y*p.scale);
               return {
               	            x:x
                             , y:y
                             , z:p.pr.z
                             , xy: [x, y]
               	};

   };
   
   
   var that = this;

   this.c3d.lineTo3D = function (p) {
       that.c3d.lineTo.apply(that.c3d, that.toP2D(p).xy);
       return that.c3d; 
   };

  this.c3d.moveTo3D = function (p) {
       that.c3d.moveTo.apply(that.c3d, that.toP2D(p).xy);
       return that.c3d;
   };

  this.c3d.polyLine3D = function() {
     if (arguments.length > 0) {
        that.c3d.moveTo.apply(that.c3d, that.toP2D(arguments[0]).xy);
        for(var i = 1; i < arguments.length; i++) {
           that.c3d.lineTo.apply(that.c3d, that.toP2D(arguments[i]).xy);
        }
        that.c3d.lineTo.apply(that.c3d, that.toP2D(arguments[0]).xy);
     }
    return that.c3d;
  };

  this.c3d.area3D = function(area3d, hooks) {
  	var txel;
  
      var a = that.toP2D(area3d.a);
      var b = that.toP2D(area3d.b);
      var c = that.toP2D(area3d.c);
      
      txel = new Txel(a, b, c);
      area3d.txel = txel;
      
  	if (hooks !== undefined && hooks.begin !== undefined) {
  	
  	   if (typeof hooks.begin !== "function") {
  	      throw "Canvas3D.c3d.area3D:err:parameter hooks.begin is not a function:" + hooks.begin;
  	   }
      
         hooks.begin(that.c3d, area3d);
  	}
     
     /*
     that.c3d.moveTo.apply(that.c3d, a.xy);

     that.c3d.lineTo.apply(that.c3d, b.xy);

     that.c3d.lineTo.apply(that.c3d, c.xy);
     */
    
  	if (hooks !== undefined && hooks.close !== undefined) {
  	   if (typeof hooks.close !== "function") {
  	      throw "Canvas3D.c3d.area3D:err:parameter hooks.close is not a function:" + hooks.close;
  	   }
         hooks.close(that.c3d, area3d);
  	}
     
     return that.c3d;
  };
  
  this.c3d.fillText3D = function(text, at) {
  	a2 = that.toP2D(at).xy;
  	that.c3d.fillText(text, a2[0], a2[1]);
      return that.c3d;
  };
  
  this.c3d.strokeText3D = function(text, at) {
	  a2 = that.toP2D(at).xy;
  	that.c3d.strokeText(text, a2[0], a2[1]);
      return that.c3d;
  };
  
}


