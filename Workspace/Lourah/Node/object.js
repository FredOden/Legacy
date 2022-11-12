var Lourah = Lourah || {};
Lourah.nodejs= Lourah.nodejs || {};
Lourah.nodejs.rpc = Lourah.nodejs.rpc || {};


Lourah.nodejs.rpc.Object = function() {

	};


Lourah.nodejs.rpc.Object.prototype.invoke = function(method, parameters)
	{
		if (this[method] === undefined) {
			throw `${this.name}:: has no method "${method}"`;
			}
			
		var m = this[method];
		if (typeof m !== "function") {
			throw `${this.name}::"${method}" is not a method:${this[method]})`;
			}
		return this[method].apply([parameters]);
	};

Lourah.nodejs.rpc.Object.extend  = function(subClass) {
	function t() {};
	t.prototype = Lourah.nodejs.rpc.Object.prototype;
	subClass.prototype = new t();
	subClass.prototype.constructor = subClass;
	}

/*
  * Sample implemenration
  *
  
function TestRpcObject(name) {
	this.name = name;
	this.meth0 = () => { return "meth0"; };
	};
	
Lourah.nodejs.rpc.Object.extend(TestRpcObject);

TestRpcObject.prototype.meth1 = () => {
	return "meth1";
	};

var tst = new TestRpcObject("test");
r = tst.invoke("meth3");
console.log(r);
*/

module.exports = Lourah.rpc.Object;
