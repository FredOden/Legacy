var Lourah = Lourah || {};
Lourah.js3d = Lourah.js3d || {};

Lourah.js3d.id = (row, col) => ([0,3,6][row] + col);

Lourah.js3d.spheric = (rho, lat, longit) =>     
     { var slat = Math.sin(lat);
        return [ rho*slat*Math.cos(longit)
                     ,rho*slat*Math.sin(longit)
                     ,rho*Math.cos(lat)]
     };
     
Lourah.js3d.translate = (p, v) => (
	[p[0] + v[0],  p[1] + v[1], p[2] + v[2]]
	);
	
Lourah.js3d.rotate = (m, p) => (
	[ m[0]*p[0] + m[1]*p[1] + m[2]*p[2]
	, m[3]*p[0] + m[4]*p[1] + m[5]*p[2]
	, m[6]*p[0] + m[7]*p[1] + m[8]*p[2]]
	);
	
	Lourah.js3d.m3x3 = (m, p) => (
		[ m[0]*p[0] + m[1]*p[3] + m[2]*p[6], m[0]*p[1] + m[1]*p[4] + m[2]*p[7], m[0]*p[2] + m[1]*p[5] + m[2]*p[8]
		, m[3]*p[0] + m[4]*p[3] + m[5]*p[6], m[3]*p[1] + m[4]*p[4] + m[5]*p[7], m[3]*p[2] + m[4]*p[5] + m[5]*p[8]
		,m[6]*p[0] + m[7]*p[3] + m[8]*p[6], m[6]*p[1] + m[7]*p[4] + m[8]*p[7], m[6]*p[2] + m[7]*p[5] + m[8]*p[8] ]
	);
	
	Lourah.js3d.rot = (a, b, c) => {
		var [ ca, sa, cb, sb, cc, sc ] = [
		       Math.cos(a), Math.sin(a)
		     , Math.cos(b), Math.sin(b)
		     , Math.cos(c), Math.sin(c) ];
		     //console.log([ ca, sa, cb, sb, cc, sc ]);
		return [
	        	cb*cc, -sc*cb, sb,
	        	sa*sb*cc + ca*sc, -sa*sb*sc + ca*cc, -sa*cb,
	        	-ca*sb*cc + sa*sc, ca*sb*sc + sa*cc, ca*cb
		];
	}

Lourah.js3d.rotCalc = (a, b, c) =>(
	Lourah.js3d.m3x3(
		Lourah.js3d.m3x3(Lourah.js3d.rot(a,0,0), Lourah.js3d.rot(0,b,0)),
		Lourah.js3d.rot(0, 0, c)
		)
	);

Lourah.js3d.dump = (m) => {
	 console.log("m::" + m);
};

Lourah.js3d.transform = (p, t, a, b, c) => (
	Lourah.js3d.rotate(Lourah.js3d.rot(a,b,c)
		                        , Lourah.js3d.translate(p,t))
	);

Lourah.js3d.Rad2Deg = 180/Math.PI;
Lourah.js3d.Deg2Rad = Math.PI/180;

Lourah.js3d.transformDeg = (p, t, a, b, c) => (
	Lourah.js3d.transform(p, t, a*Lourah.js3d.Deg2Rad, b*Lourah.js3d.Deg2Rad, c*Lourah.js3d.Deg2Rad)
	);
	
Lourah.js3d.to2d = (p, c) => ([
	(p[0] - c[0])*(c[2]/(p[2] + c[2])) + c[0],
	(p[1] - c[1])*(c[2]/(p[2] + c[2])) + c[1]
	]);

Lourah.js3d.toScreen = (p, dim) => ([
	dim[0]/2 + p[0],
	dim[1]/2 - p[1]
	]);

var p = Lourah.js3d.transformDeg(
	 [10, 50, 100]
	,[0, 0, 0]
	,0
	,0
	,90);


console.log(p);
var p2d;
console.log(p2d = Lourah.js3d.to2d(p, [
	0
	,0
	,1500
	]));

console.log(Lourah.js3d.toScreen(p2d, [340, 400]));


