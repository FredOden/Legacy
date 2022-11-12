function destructuration(){
var a ={x:1, y:2,z:3};
const {z,x}= a;
console.log(z,x);
var arr = [10, 20,30]
const  [h,i, ...j] = arr;
console.log(j);
console.log(...arr);
}
function *f() {
	var i = 0;
	for(;;) {
     i = 	yield ++i;
	}
}

var x = f();
for(var i = 0; i<10; i++) {
	var y = x.next(i*2);
	console.log(JSON.stringify(y));
}