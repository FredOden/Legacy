v1 = [ 4,-5,7566 ];
v2 = [ 100,10, -1123];

function O() {
this.vector = (p1, p2) => ([
		p2[0] - p1[0],
		p2[1] - p1[1],
		p2[2] - p1[2]
		]);
		
		
		this.vectorialProduct = (v1, v2) => [
		v1[1]*v2[2] - v1[2]*v2[1],
		v1[2]*v2[0] - v1[0]*v2[2],
		v1[0]*v2[1] - v1[1]*v2[0]
		];
		
		this.scalarProduct = (v1, v2) => (
		   v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]
		);
		//21
		this.abs = v => v < 0?-v:v;
		// to quickly compare vector size without
		// using scalarproduct or norm
		this.manhattan = v=> (
		   this.abs(v[0])
		+ this.abs(v[1])
		+ this.abs(v[2])
		);
		
		this.mormalize = v => {
			var man = this.manhattan(v);
			return [v[0]/man
			           , v[1]/man
			           , v[2]/man];
		}
		

		this.norm = v =>
		  Math.sqrt(this.scalarProduct(v, v));
		
		
		this.normalize = v => {
			var norm = this.norm(v);
			return [ v[0]/norm, v[1]/norm, v[2]/norm ];
			}
			
}

var o = new O();

m1 = o.manhattan(v1);
m2 = o.manhattan(v2);
n1 = o.norm(v1);
n2 = o.norm(v2);

[ v1.n1, v2.n1] = [o.mormalize(v1), o.mormalize(v2)];
[v1.n2, v2.n2] = [o.normalize(v1), o.normalize(v2)];


console.log([m1, m2, n1, n2]);

console.log([v1.n1, v2.n1, v1.n2, v2.n2]);

m1 = o.manhattan(v1.n1);
m2 = o.manhattan(v2.n2);
n1 = o.norm(v1.n2);
n2 = o.norm(v2.n2);
console.log([m1, m2, n1, n2]);

var a = 1;
var b = 1.001
var c = 1/b;
var maxLoop = 10000000;
var d = new Date();
var start = d.getTime();
for(var i = 0;  i< maxLoop; i++) {
	   a = (a/b);
}
var end = (new Date()).getTime() - start;
console.log("a::" + a + "::" + end + " ms" );

