var haf;
var sun;
var days = 0;
var gctx;


solarSystem = function() {
cancelAnimationFrame(haf);
var earth = new Lourah.gravity.Corpus("Earth",
   5.9722e24, 40000000/(Math.PI*2), 23.93419 * Lourah.gravity.HOUR);
var moon = new Lourah.gravity.Corpus("Moon",
   7.342e22,	1737400, 27.321582 * Lourah.gravity.DAY);
sun = new Lourah.gravity.Corpus("Sun",
	1.9884e30, 696342000, 27.28 * Lourah.gravity.DAY);
var mercure = new Lourah.gravity.Corpus( "mercure"
    , 3.3011e23 , 2439700 , 58.6462 * Lourah.gravity.DAY);
var venus = new Lourah.gravity.Corpus("venus"
    , 4.8685e24, 6051800, -243.023 * Lourah.gravity.DAY);
var mars = new Lourah.gravity.Corpus("mars"
    , 641.85e21, 3376200, 1.025957 * Lourah.gravity.DAY);
var jupiter = new Lourah.gravity.Corpus("jupiter"
    , 1.8986e27, 69911000, 0.41351 * Lourah.gravity.DAY);
var io = new Lourah.gravity.Corpus("io"
    , 8.93e22, 3643200/2, 1.769 * Lourah.gravity.DAY);
var europe = new Lourah.gravity.Corpus("europe"
    , 4.8e22, 3121600, 3.551181 * Lourah.gravity.DAY);
var ganymede = new Lourah.gravity.Corpus("ganymede"
    , 1.4819e23, 5262400/2, 7.1545529 * Lourah.gravity.DAY);
var callisto = new Lourah.gravity.Corpus("callisto"
    , 1.075938e23, 4820300/2, 16.6890184 * Lourah.gravity.DAY);
    
earth.attachTo(sun, 365.256363004 * Lourah.gravity.DAY);
moon.attachTo(earth, 29.53058885 * Lourah.gravity.DAY);
mercure.attachTo(sun, 87.96934 * Lourah.gravity.DAY);
venus.attachTo(sun, 224.701 * Lourah.gravity.DAY);
mars.attachTo(sun, 686.9601 * Lourah.gravity.DAY);
jupiter.attachTo(sun, 4335.3545 * Lourah.gravity.DAY);
io.attachTo(jupiter,  1.769 * Lourah.gravity.DAY);
europe.attachTo(jupiter,  3.551181 * Lourah.gravity.DAY);
ganymede.attachTo(jupiter,  7.1545529 * Lourah.gravity.DAY);
callisto.attachTo(jupiter,  16.6890184 * Lourah.gravity.DAY);

var center = undefined;
for(var i = 0; i < Lourah.gravity.CORPUS.length; i++) {
	var corpus = Lourah.gravity.CORPUS[i];
	if (corpus.corpus === null) {
		center = corpus;
		break;
		}
	}

var out = "<style>table, th, td { border: 1px solid black;}</style>";
//console.log("0" + out);
out += (center.name);
//console.log("1" + out);

out += displaySatellites(center);

//console.log("2" + out);
document.body.innerHTML = document.body.innerHTML + out;

try {
   gctx = makeContext(jupiter.getOrbitalRadius(), sun.radius);
} catch(e) {
	console.log(e.message);
}
console.log("done");


haf = requestAnimationFrame(anim);
}

function anim() {
	gctx.c3d.clearRect(0, 0, gctx.canvas.width, gctx.canvas.height);
	drawSystem(gctx, sun, days, 0, 0, gctx.orbitScale);
	days++;
	haf = requestAnimationFrame(anim);
}

function makeContext(maxOrbitalRadius, maxCorpusRadius) {
 var   canvas = document.getElementById("canvas");

            canvas.height = window.innerHeight - canvas.getBoundingClientRect()
                .top - 10;
            canvas.width = window.innerWidth - 20;

 var    canvas3d = new Canvas3D(canvas);
 var    c3d = canvas3d.c3d;
            if (c3d === undefined)
            {
                console.log("canvas not supported !");
                return;
            }

console.log("init gctx");
//@@@@@@@@@

var gctx = {
	canvas : canvas,
	c3d : c3d,
	orbitScale : canvas.width/maxOrbitalRadius,
	corpusScale : .3*canvas.width/(maxCorpusRadius)
	//corpusScale : canvas.width/maxOrbitalRadius,
	};

//console.log("gctx:" + JSON.stringify(gctx.c3d));

return gctx;
}

function displaySatellites(center) {
	var ret = "";
	if(center.satellites.length ===0) return ret;
	
	//console.log("in displaySatellie:" + center.name);
  
   ret += ("<table><tr><th>name</th><th>distance (km)</th></tr>");
  for(var i = 0; i < center.satellites.length; i++) {
	ret +=("<tr>");
	ret +=("<td style='font-style:italic; background:lightgrey'>" + center.satellites[i].name + "</td>");
    ret += ("<td style='text-align:right'>" + (center.satellites[i].getOrbitalRadius()/1000).toFixed(3) + displaySatellites(center.satellites[i])  + "</td>");
    ret +=("</tr>");
	}
  ret+=("</table>");
  
  //console.log("out displaySatellie:" + center.name);
  return ret;
}

function drawSystem(gctx, corpus, t, xc, yc, scale) {
	//console.log("drawSystem::" + corpus.name);
	for(var i = 0; i < corpus.satellites.length; i++) {
		satellite = corpus.satellites[i];
		//console.log("drawSystem::process::" + satellite.name);
		
		var or = satellite.getOrbitalRadius();
		var angle = satellite.period*t*Lourah.gravity.DAY;
		var x = xc + or * Math.cos(angle);
		var y = yc + or * Math.sin(angle);
	
	     gctx.c3d.beginPath();
	   gctx.c3d.fillStyle = "cyan";
	   gctx.c3d.arc(
	    (gctx.canvas.width + x * scale)/2
	   ,(gctx.canvas.height + y * scale)/2
	   , 5 // satellite.radius * gctx.corpusScale/2
	   , 0, 2 * Math.PI);
	    gctx.c3d.fill();
	
	
	gctx.c3d.beginPath();
		gctx.c3d.strokeStyle = "#007";
    var oRadius = satellite.getOrbitalRadius()*scale/2;
	gctx.c3d.arc(
	    (gctx.canvas.width + xc * gctx.orbitScale)/2
       , (gctx.canvas.height + yc * gctx.orbitScale)/2
       , oRadius, 0, 2*Math.PI,true);
	gctx.c3d.stroke();
	    //console.log("radius::"+satellite.radius);
	    drawSystem(gctx, satellite, t, x, y, 100*gctx.canvas.width/or /*gctx.corpusScale*/);
		}
	}


