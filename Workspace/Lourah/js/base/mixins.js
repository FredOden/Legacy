//
// mixins by Lourah
//
var Lourah = Lourah || {};
Lourah.base = Lourah.base || {};

Lourah.base.mixin = (aClass, mixins) => {
mixins.forEach(mixin => {
   
   	for (var key in mixin) {
   	  
   	  if (mixin.hasOwnProperty(key)) {
   	    
	   	if (aClass.prototype[key] !== undefined) {
			throw `Lourah.base.mixin::${key} already implemented for ${aClass.name}`;
		  }
		aClass.prototype[key] = mixin[key];
	  }
    }
	});
};

/**
class Zz {
	constructor(name) {
		this.name = name;
		this.count = 0;
	}
	
	setCount(val) {
		this.count = val;
	}
}

var top = {
	inc: function() { this.count++ },
	dec0:function()  { this.count-- },
	kind:"rock"
};

var down = {
	dec: function() {	this.count-=2;}
}

Lourah.base.mixin(Zz, [top, down]);

var zz = new Zz("tejas");
zz.setCount(1974);
zz.dec();
console.log(zz.count + "::" + zz.kind);
/**/

if (typeof module != 'undefined' && module.exports)  
  module.exports = {
  	mixin : Lourah.base.mixin,
      Lourah : Lourah
  	};
 

