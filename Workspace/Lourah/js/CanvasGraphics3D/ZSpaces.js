function ZSpace(z) {
  this.z = z;
  this.p2d = [];
}

ZSpaces.statics = {
	ctx:undefined,
	colorCache:[]
	};

var cnt = 0;

function ZSpaces(canvas3d) {
	this.canvas3d = canvas3d;
	//this.zSpaces = [];
	this.width = canvas3d.c3d.canvas.width;
	this.height = canvas3d.c3d.canvas.height;
	this.zBuffer = new Array(this.width * this.height);
	this.data = undefined;
	
	if (ZSpaces.statics.ctx === undefined) {
		var canvas = document.createElement("canvas");
		ZSpaces.statics.ctx = canvas.getContext("2d");
		}
		
}




ZSpaces.prototype.toRGBA = function(cssColor) {
	var rgba;
	rgba = ZSpaces.statics.colorCache[cssColor];
	
	if (rgba === undefined) {
		//ZSpaces.statics.ctx.clearRect(0,0,1,1);
		ZSpaces.statics.ctx.fillStyle = cssColor;
		ZSpaces.statics.ctx.fillRect(0,0,1,1);
		var pixel = ZSpaces.statics.ctx.getImageData(0,0,1,1).data;
		rgba = { rgba:[
                               pixel[0]
                              ,pixel[1]
                              ,pixel[2]
                              ,pixel[3]
                              ]
                     };
		ZSpaces.statics.colorCache[cssColor] = rgba;
		}
		
	return rgba;
	}


ZSpaces.prototype.add = function(p2d) {
	var c3d = this.canvas3d.c3d;
   if (this.data === undefined) {

   	this.data = c3d.getImageData(0,0,
	                     c3d.canvas.width
	                    ,c3d.canvas.height
	                    );
	
	    this.zBuffer = new Array(
	                    c3d.canvas.width
	                   ,c3d.canvas.height
	                   );
   	}

   var idx = p2d.y * c3d.canvas.width + p2d.x;
   var poz = this.zBuffer[idx];
   
  if (poz === undefined || poz >= p2d.z) {
   	var pixel = idx << 2;
   	this.zBuffer[idx] = p2d.z;
 
       for(var i = 0; i <4; i++) {
           this.data.data[pixel | i] = p2d.fill.rgba[i];
           }
   	}
	}



	
ZSpaces.prototype.draw = function() {
	this.canvas3d.c3d.putImageData(this.data, 0, 0);
	this.data = undefined;
	}

ZSpaces.prototype.fill = function(txel, fill) {
    var rgba = this.toRGBA(fill);
	for(var span of txel.spans) {
		for(var x = span.left.x; x <= span.right.x; x++) {
			var p;
             p = span.getP2D(x);
			if (p !== undefined) {
			    p.fill = rgba;
			    this.add(p);
			    }
			
			}
			
		}
		
	}

/*
function P2D(x2d, y2d, z) {
	this.x = Math.round(x2d);
	this.y = Math.round(y2d);
	this.z = z;
	this.fill = undefined;
	this.stroke = undefined;
	}
	
P2D.prototype.xy =  function() {
	return [this.x, this.y];
	}
	
P2D.prototype.toString = function() {
	var ret = "P2D(" 
                + this.x
                + "," + this.y
                + "," + this.z
                + ")"
                ;

     if (this.fill != undefined) {
     	ret += "fill.rgba=[" + this.fill.rgba + "]";
     	}
     
     return ret;
	}
*/

function RGBA(r, g, b, a) {
	this.rgba = [ r, g, b, a ];
	}


function Edge(a, b) {
	this.height = b.y - a.y;
	this.from = a;
	this.to = b;
	
	
	if (this.height < 0) {
		this.from = b;
		this.to = a;
		this.height = -this.height;
		}

	var k; 
	  if (this.to.y === this.from.y) {
		  k = {x:0, z:0};
		} else {
		  var ry = this.to.y - this.from.y;
          k = {
            x:(this.to.x - this.from.x)/ry,
            z:(this.to.z - this.from.z)/ry
          };
        }
	
	this.xs = new Array(this.to.y - this.from.y + 1);
	
	for(var y = this.from.y; y <= this.to.y; y++) {
		var idx =  y - this.from.y
		this.xs[idx] = ({
             x:Math.round(this.from.x + k.x*(idx)),
             y:y,
             z:this.from.z + k.z*(idx)
             });
		}
	}

Edge.prototype.getP2D = function(atY) {
	if (atY >= this.from.y && atY <= this.to.y) {
		return this.xs[atY - this.from.y];
	    }
	return null;
    }

function Span(atY, edges) {
	this.y = atY;
	this.right = undefined;
	this.left = undefined;
	
	for(edge of edges) {
		var p2d = edge.getP2D(atY);
		
		if (p2d === null) {
			continue;
			}

        if(p2d === undefined) {
        	continue;
        	}
 
		if (this.left === undefined) {
			this.left = p2d;
			}
        else {
				if (p2d.x <= this.left.x) {
					   if (this.right === undefined || this.right.x <= this.left.x) {
					      this.right = this.left;
					      }
					   this.left = p2d;
					} 
                else {
					this.right = p2d;
					}
				}
			}
		
		}



Span.prototype.getP2D = function(atX) {
	if (atX < this.left.x || atX > this.right.x) {
		return null;
		}
		
	var kz = 0;
	if (this.right.x !== this.left.x) {
		kz = (this.right.z - this.left.z)/(this.right.x - this.left.x);
		}
	return {
        x:atX
      , y:this.y
	  , z:this.left.z + kz*(atX - this.left.x)
	    };
	}

function Txel(a, b, c) {
	this.x = {
            //min:Math.min(...[a.x, b.x, c.x]),
            min:(a.x < b.x)?(a.x < c.x)?a.x:c.x:(b.x < c.x)?b.x:c.x,
            //max:Math.max(...[a.x, b.x, c.x])
            max:(a.x > b.x)?(a.x > c.x)?a.x:c.x:(b.x > c.x)?b.x:c.x,
            };
     this.y = {
            //min:Math.min(...[a.y, b.y, c.y]),
            min:(a.y < b.y)?(a.y < c.y)?a.y:c.y:(b.y < c.y)?b.y:c.y,
            //max:Math.max(...[a.y, b.y, c.y])
            max:(a.y > b.y)?(a.y > c.y)?a.y:c.y:(b.y > c.y)?b.y:c.y,
            };
      
      
      var summits = [a, b, c];
      this.edges = new Array(summits.length);
      for (var i in summits) {
      	this.edges[i] = (
               new Edge(
                  summits[i]
                  ,summits[(i + 1) % summits.length]
                  )
              );
      	}
      
      
      this.spans = new Array(this.y.max - this.y.min + 1);
      
      for(var y = this.y.min; y <= this.y.max; y++) {
      	this.spans[y - this.y.min] = (new Span(y, this.edges));
      	}
      
	}
	
Txel.prototype.getSpan = function(atY) {
	if (atY < this.y.min || atY > this.y.max) {
		return null;
		}
	return this.spans[atY - this.y.min];
	}

Txel.prototype.getP2D = function(atX, atY) {
	var span = this.getSpan(atY);
	if (span == null) {
		return null;
		}
	if (atX < span.left.x || atX > span.right.x) {
		return null;
		}
	return {x:atX, y:atY, 
	    z:span.left.z + (span.right.z - span.left.z)/(span.right.x - span.left.x)*(atX - span.left.x)
	    };
	}
	
	/**/