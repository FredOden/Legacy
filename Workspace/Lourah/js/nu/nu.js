var Lourah = Lourah || {};
Lourah.nu = Lourah.nu || {};

Lourah.nu.Nu = function(event) {
	this.event = event;
	this.promise = new Promise(this.event.handler);
}

Lourah.nu.Calculator = function(x, y, op) {
	
	this.handler = (resolve, reject) => {
		try {
			this.x = x;
			this.y = y;
			if (x.promise !== undefined) x.promise.then((c) => this.x = c.result);
			this.code = "" + this.x + op + this.y;
			this.result = eval(this.code);
			resolve(this);
		} catch(e) {
			reject("cannot resolve (" + this.x + "," + this.y + "," + op +"):" + e);
		}
	}
}

var nu = new Lourah.nu.Nu(new Lourah.nu.Calculator(
	  3
	, 7
	, '*'));
	
	nu.promise.then((p) => {
		console.log(p.result);
	}).catch((e) => {
		console.log("nu:" + e);
	});


 
 function Neurone(process, knowledge) {
 	this.process = process;
 	this.knowledge = knowledge;
 }


Neurone.prototype.evaluate = function(input) {
	return this.process(input, this.knowledge);
};
    

var sizerProcess = function(event, base) {
	var possible = base.slice();
	possible.push(event);
	possible.sort(function(a, b) {
		 return a.input.value - b.input.value
		 }); 
		 
	var idx = possible.indexOf(event);
	
	if (idx == 0) {
		event.output = base[0].output;
		return event;
	}
	
	if (idx == possible.length - 1) {
		event.output = base[base.length - 1].output;
		return event;
	}

  v = event.input.value;
  
  vm = base[idx - 1].input.value;
  vM = base[idx].input.value;
	
	dm = v - vm;
	dM = vM - v;
	
	if (dm < dM) {
		event.output = base[idx - 1].output;
		return event;
	}
	
	event.output = base[idx].output;
	return event;
	
}


var sizerKnowledge = [
       { input: { value : 0 },  output : undefined }
     , { input: { value : .6 },  output : { size : 'XS'} }
    , { input: { value : 1.3 },  output : { size : 'S'} }
    , { input: { value : 1.7 },  output : { size : 'M' } }
    , { input: { value : 1.9},  output : { size : 'L' } }
    , { input: { value : 2.3},  output : { size : 'XL'} }
    , { input: { value : 2.6},  output : undefined }
    ];
    

var sizer = new Neurone(sizerProcess, sizerKnowledge);

/*
for(var i = 0; i < 2.4; i+=.05) {
  var sized = sizer.evaluate(
	      { input : { value : i} }
	   );
	
  console.log(JSON.stringify(sized));
}
*/

var fProfiler = {
	handler : {
		size : (size, knowledge) => { s in knowledge.input.size },
		age : (age, knowledge) => { age >= knowledge.input.age[0] && age <= knowledge.input.age[1]}
	},
	knowledge : [
    { input: 
        
        {size : 
           { op: "in", set: ["XS"]}, 
         age : 
           { op: "[[", set: [0, 3]} 
          }
          
    
    ,  output : {profile:"Normal"}}
]};


var profilerKnowledge = [
     { input : { size : ["XS"] , age: [0, 8] }, output : { profile : "Normal" } }
     ,  { input : { size : ["XS"] , age: [8, 12] }, output : { profile : "Petit" } }
     ,  { input : { size : ["XS"] , age: [12, 120] }, output : { profile : "Nanisme" } }
     , { input : { size : ["S", "L", "M", "XL"] , age: [0, 7] }, output : { profile : "Gigantisme" } }
     , { input : { size : ["S"] , age: [5, 9] }, output : { profile : "Grand" } }
     ,  { input : { size : ["S"] , age: [8, 12] }, output : { profile : "Normal" } }
     ,  { input : { size : ["S"] , age: [14, 120] }, output : { profile : "Petit" } }
     , { input : { size : ["L", "M", "XL"] , age: [5, 8] }, output : { profile : "Gigantisme" } }
     ,  { input : { size : ["L", "M"] , age: [9,13] }, output : { profile : "Grand" } }
     ,  { input : { size : ["M", "L"] , age: [14, 120] }, output : { profile : "Normal" } }
	 ,  { input : { size : ["XL"] , age: [10, 15] }, output : { profile : "Gigantisme" } }
     ,  { input : { size : ["XL"] , age: [14, 18] }, output : { profile : "Grand" } }
     ,  { input : { size : ["XL"] , age: [17, 120] }, output : { profile : "Grand" } }
];

var profilerProcess = function(event, base) {
	for (b of base) {
		if (b.input.size.indexOf(event.input.size) !== -1 && event.input.age >= b.input.age[0] && event.input.age <= b.input.age[1]) {
			event.output = b.output;
			return event;
		}
	}
	return event;
}

var taille = 2.1;
var age = 14;

var o = (new Neurone(sizerProcess, sizerKnowledge)).evaluate({input:{value : taille}});
console.log("o:" + JSON.stringify(o));

var e = {};
e.input = o.output;
e.input.age = age;

var e = (new Neurone(profilerProcess, profilerKnowledge)).evaluate(e);

console.log("e:" + JSON.stringify(e));

