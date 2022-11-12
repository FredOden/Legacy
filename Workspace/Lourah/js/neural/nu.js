(function (key) {
	function z() {
		console.log(key);
		this.me = key;
	}
	key.z = new z();
})("k");

var target = {
};

function Nu () {
	 this.o = {};
}

Nu.prototype.stimulate = function(event, result) {
	this.o[event] = result;
	target[event] = this;
};

nu = new Nu();

nu.stimulate("0,0,255", function() { return "blue"});



console.log(target["0,0,255"].o["0,0,255"]());


