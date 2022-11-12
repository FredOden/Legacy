

function NameSpacer(namespace) {
	 this.toString = function() {
	 	  return namespace;
	 }
	 this.subSpace = function(subspace) {
	 	  this[subspace] = new NameSpacer(this.toString() + "::" + subspace);
	 	  return this[subspace];
	 }
	 
	 this.scope = function(hook) {
	 	console.log(typeof hook);
	try {
	hook(this);
	} catch(e) {
		console.log("scopeCode:" + e);
	}
	 }
	 return this;
}

(Lourah = new NameSpacer("Lourah")).subSpace("api").subSpace("bar");

Lourah.api.scope(function(namespace) {
	function Obj(name) {
		this.name = namespace + "::" + name;
	}
	
	Obj.prototype.getName = function() {
		return "(" + this.name + ")";
	}
	
	namespace.Obj = Obj;
});

Lourah.api.bar.scope(function(namespace) {
	
	namespace.Foo = function() {
		this.id =98;
	}
	
	namespace.Foo.prototype.getId = function() {
		return this.id * this.id;
	}
});

var o = new Lourah.api.Obj("test");

console.log("o.name:"+o.getName());
console.log("foo:"+ (new Lourah.api.bar.Foo()).getId());

Lourah.api.Operation = function(x, y) {
	this.x = x;
	this.y = y;
	this.prod = function() {
		return this.x * this.y;
	}
}

Lourah.api.Operation.prototype.sum = function() {
	
	return this.x + this.y;
}
Lourah.api.Operation.prototype.sum.prototype.toString = function() {
		return "sum(" +this.x + "+" + this.y + ")";
	}

var op;

console.log("Ope:" + new  (op = new Lourah.api.Operation(3,4)).sum());

console.log("Prod" + op.prod());

Lourah.g3d = {
	Zorglub : function (z) {
		this.z = '"' + z + '"';
		this.getZ = function() {
			return "Zorglub(" + this.z + ")";
		}
	}
}
Lourah.g3d.Zorglub.prototype.hey =  function() {
		return "hey " + this.getZ();
	}


zorg = new Lourah.g3d.Zorglub("grand Z!");

console.log(zorg.hey());

console.log("Meta:");

Lourah.meta = {};

Lourah.meta.TopLevel = function() {
	this.a = "ah";
	this.A = function() {
		
		this.A = "Aa";
		this.toString = function() {
			return "(" + this.A + ")";
		}
		
		return this;
	}
	this.toString = function() {
		return "TopLevel:" + this.A;
	}
}
Lourah.meta.TopLevel.prototype.$ = function (obj, f) {
	this[obj] = f;
}

var top = new Lourah.meta.TopLevel();
console.log("top:" + top.A.toString());
a = new top.A();
console.log("top.A:" + a);
top.W = function(x, y) {
	this.x = x;
	this.y = y;
};

top.W.prototype.substract = function() {
	return this.x - this.y;
}

var w = new top.W(9, 10);
console.log("w.substract:" + w.substract());
var ww = new top.W(11,89);
console.log("ww.substract:" + ww.substract());
var tip = new Lourah.meta.TopLevel();
tip.W = function() {
	this.substract = function() {
	return "bad ass";
	};
}
var www = new tip.W(1991,30);
console.log("www.substract:" + www.substract());

var Interface = {
	init: function() {},
	begin:function(event) {},
	end: function() {},
}

var implementation = new function() {
	this.init = function() { return "init";};
}


for(k in Interface) {
	 tip.$(k, implementation[k]);
}

console.log("Lourah:"+Lourah);
