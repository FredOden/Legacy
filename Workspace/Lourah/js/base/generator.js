function *user() {
	console.log("start");
	let name = yield 1;
	console.log("user::" + name);
	let pass = yield 2;
	 console.log("pass::" + pass)
	 //return 0;
}

let u = user();
var r

r = u.next("init");
console.log(JSON.stringify(r));

r = u.next("owner");
console.log(JSON.stringify(r));
r = u.next("passwd");
console.log(JSON.stringify(r));
//r = u.next("end");
//console.log(JSON.stringify(r));

