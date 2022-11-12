let buf = new ArrayBuffer(4)
, f32=new Float32Array(buf)
, u32=new Uint32Array(buf)
;
function q2(x) {
	let x2 = 0.5 * (f32[0] = x);
	u32[0] = (0x5f3759df - (u32[0] >> 1));
	let y = f32[0]; y = y * ( 1.5 - ( x2 * y * y ) ); // 1st iteration
	return 1/y;
	}
	
	let x,y;
	let start = performance.now();
	for(let i = 0; i < 1000; i++)
	   x = q2(2);
	let d = performance.now() - start;
	console.log("q2::" + x + "::" +d);
	start = performance.now();
	for(let i = 0; i < 1000; i++)
	   y = Math.sqrt(2);
	d = performance.now() - start;
	console.log("sqrt::" + y + "::" +d);
	console.log("delta::" + (x - y));
	
	
	
	
	