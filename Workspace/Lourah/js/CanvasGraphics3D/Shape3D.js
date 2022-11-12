
function Element3D(instruction) {
	this.fillStyle = undefined;
	this.strokeStyle = undefined;
	this.instruction = instruction;
	this.args = [];
	if (arguments.length > 1) {
		for(var i = 1; i < arguments.length;  i++) {
			this.args.push(arguments[i]);
			}
		}
	}


Element3D.prototype.toString = function() {
	return "E3D:"+ this.instruction + "(" + this.args.join(',') + ")";
	}
  

function Shape3D() {
	this.elements = [];
	this._position = {x:0, y:0};
	this.a = 0;
	this._center = { x:0, y:0 };
	this._scale = { x:1, y:1};
	this.virtualContext3d = undefined;
	}

Shape3D.mirrorContext = undefined;

Shape3D.prototype.getVirtualContext3D = function() {
	
	if (this.virtualContext3d === undefined) {
		if (Shape3D.mirrorContext === undefined) {
			Shape3D.mirrorContext = (new Canvas3D(document.createElement("canvas"))).c3d;
			}
		this.virtualContext3d = new Proxy(this, {
			
			get: function(target, name, receiver) {
                       if (name in Shape3D.mirrorContext && typeof Shape3D.mirrorContext[name] === "function") {
                           return function() {
                               var methodName = name;
                                // we now have access to both methodName and arguments
                                   
                                   var args = [ name ];
                                   for (var i = 0; i < arguments.length; i++) {
                                   	args.push(arguments[i]);
                                   	}
                                   //console.log("trapped:" + name + ",args:(" + args.join(',') + ")");
                                   var ret;
	                               target.elements.push(ret = new Element3D(...args));
	                               return ret;
                                   };
                                } else { // assume instance vars like on the target
                           //return Reflect.get(target, name, receiver);
                           throw("illegal method:" + name + " for virtualContext3D !");
                           }
                       }
                       
			      }
		     );
		}
		
	return this.virtualContext3d;
	}

Shape3D.prototype.toString = function() {
	var ret = "Shape3D:" + this.elements.length +"{\n";
	for(var e of this.elements) {
		ret += "\t" + e + "\n";
		}
	ret += "}";
	return ret;
	}


Shape3D.prototype.moveTo = function(x, y) {
	this._position = {x:x, y:y};
	}

Shape3D.prototype.setCenter = function(x, y) {
	this._center = {x:x, y:y};
	}

Shape3D.prototype.setRotation = function(a) {
	this.a = a;
	}
	
Shape3D.prototype.setScale = function(x, y) {
	this._scale ={x:x,y:y};
	}

Shape3D.prototype.add = function() {
	var ret;
	this.elements.push(ret = new Element3D(...arguments));
	return ret;
	}
	
Shape3D.prototype.merge = function(shape) {
	for(var element of shape.elements) {
		this.elements.push(element);
		}
	}

Shape3D.prototype.draw = function(c3d) {
	c3d.save();
	c3d.scale(this._scale.x, this._scale.y);
	
	c3d.translate(this._center.x, this._center.y);
	c3d.rotate(this.a);
	c3d.translate(- this._center.x, - this._center.y);
	
	c3d.translate(this._position.x, this._position.y);
	
	//c3d.beginPath();
	for(element of this.elements) {
		
		if (element.fillStyle !== undefined) {
			c3d.fillStyle = element.fillStyle;
			}
			
	    if (element.strokeStyle !== undefined) {
			c3d.strokeStyle = element.strokeStyle;
			}
		//console.log("shape?:" + element.instruction + "(" + element.args.join(",") + ")");
		c3d[element.instruction].apply(c3d, element.args);
		//console.log("shape!:" + element.instruction + "(" + element.args.join(",") + ")");
		}
	//c3d.closePath();
	//c3d.stroke();
	c3d.restore();
	}
	