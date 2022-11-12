var Lourah = Lourah || {};
Lourah.base = Lourah.base || {};

Lourah.base.Class = function() {
	
};

Lourah.base.Interface = function (definition) {
	for(method in definition) {
		/*
    	this[method] = 
	     function(defnition[method]) {
		
    	}
    	*/
	}
};

Lourah.base.Class.prototype.extends = function(superClass) {
	
}

Lourah.base.Class.prototype.implements = function(interface) {
	
}

/*
interface = new Lourah.base.Interface({
	onOpen : {
		set : [ filename ],
		get : [ String ]
	},
	onClose : {
		set : [],
		get : [ Boolean ]
	}
});
*/
var jscode = function() {
	var i = 1;
	return i;
};

var txt = jscode.toString();

console.log("jscode:"+ txt);