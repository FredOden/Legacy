let f = a => ( "c'est " + a);
let r = f("moi");
console.log(r);

var p = new Promise((ok,err) => {
	throw "shiiiur";
	ok(new Date());
})

var a = (p
.then((i) => console.log(i))
.catch((e) => { console.log("e::"+e); return new Promise((o)=> {o(6 + e)});})
.then((m) => console.log("2::" + m)))

console.log("a::" + a.then(() =>"3"))