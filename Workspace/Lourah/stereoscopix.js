
var torus = new Torus(40, 20, 6, [255, 0, 0, 255]);

var perf = {
	mean : 0,
	sum : 0,
	last : 0,
	length : 0
	};

 var panes = {};

cam = {
	left: [2000, 2000, 40000],
	right : [-2000, 2000, 40000]
	};

spot = ([0, 0, 1]);

function Pane(canvas, cam, width, height) {
	canvas.width = width;
	canvas.height = height;
	//console.log("Pane::width::" + width);
	//console.log("Pane::height::" + height);
	this.ctx = canvas.getContext('2d');
	this.renderer = undefined;
	this.camera = cam;
	}

function stereoscopix(left, right) {
	//console.log("init::" + left + "," + right);
	
	
     height = (window.innerHeight *.7)|0;
     width = ((window.innerWidth - 45)/2)|0;
  
	
	panes = { canvas : [
	        new Pane(document.getElementById(left), cam.left, width, height)
	      , new Pane(document.getElementById(right), cam.right, width, height)
          ],
          rotation: null,
          translation: [-50, 0, 0]
          };
          
     //console.log("call display::" + JSON.stringify(panes));
     stereoscopixDisplay(0, 0, 0);
	}
	
function stereoscopixFromElements(elements) {
     	stereoscopixDisplay(...elements.map(e => document.getElementById(e).value*Math.PI/180));
}

function stereoscopixDisplay(a, b, c) {
	//console.log("in");
	var start = performance.now();
	panes.rotation = Lourah.js3d.rot(a, b, c);
	var rot2 = Lourah.js3d.rot(a/2, b/2, c/2);
	
	var [o, i, j, k] = [
           [0, 0, 0]
           ,[100, 0, 0]
           ,[0, 100, 0]
           ,[0, 0, 100]
          ];

         //console.log("clear");
         panes.canvas.forEach(canvas => {
         	 canvas.renderer  = new Lourah.js3d.Renderer(canvas.ctx.canvas.width, canvas.ctx.canvas.height);
              canvas.ctx.clearRect(0, 0, canvas.ctx.canvas.width, canvas.ctx.canvas.height)
              }
              );
              
              
         //console.log("axis to draw");
         [i,j,k].forEach(p => panes.canvas.forEach(canvas =>
               canvas.renderer.line(o, p,
                    [255,0,0,255],
                    null,
                    panes.translation,
                    canvas.camera)
                    )
               );
          //console.log("axis done" );
         
         
         
         panes.canvas.forEach(canvas => {
           canvas.renderer.txel(i, j, k, [230, 128, 255, 255], panes.rotation, panes.translation, canvas.camera, spot);
           canvas.renderer.txel(o, j, k, [230, 128, 255, 255], panes.rotation, panes.translation, canvas.camera, spot);
           canvas.renderer.txel(k, o, i, [230, 128, 255, 255], panes.rotation, panes.translation, canvas.camera, spot);
           canvas.renderer.txel(j, i, o, [230, 128, 255, 255], panes.rotation, panes.translation, canvas.camera, spot)
           }
           );
          
         // console.log("i:;"+JSON.stringify(i.pr.p2d));
          
         var co = [0, 128, 0, 255]; 
         var sz = 50;
         var [a, b, c, d, e, f, g, h] = [
         [0, sz, -sz], [sz*2, sz, -sz], [sz*2, -sz, -sz], [0, -sz, -sz],
         [0, sz, sz], [sz*2, sz, sz], [sz*2, -sz, sz], [0, -sz, sz]
         ];
         
         [[a,b,c,d],[e,f,g,h], [a,e,h,d], [b,f,g,c]].forEach(s => 
            panes.canvas.forEach(canvas =>
                 canvas.renderer.polygon(s, co, panes.rotation, panes.translation, canvas.camera)
            ));
         
         sz = 25;
        [a, b, c, d, e, f, g, h] = [
         [0, sz, -sz], [sz*2, sz, -sz], [sz*2, -sz, -sz], [0, -sz, -sz],
         [0, sz, sz], [sz*2, sz, sz], [sz*2, -sz, sz], [0, -sz, sz]
         ];
         
	    [[a,b,c,d],[e,f,g,h], [a,e,h,d], [b,f,g,c]].forEach(s => 
            panes.canvas.forEach(canvas =>
                 canvas.renderer.polygon(s, co, panes.rotation, [25,25,0], canvas.camera)
            ));
	
	      
         
         
	     panes.canvas.forEach(canvas => {
           canvas.renderer.txel(a, b, c, [220, 164, 255, 255], panes.rotation, [25, 25, 0], canvas.camera, spot);
           canvas.renderer.txel(a, c, d, [220, 164, 255, 255], panes.rotation, [25, 25, 0], canvas.camera, spot);
           canvas.renderer.txel(e, f, g, [220, 164, 255, 255], panes.rotation, [25, 25, 0], canvas.camera, spot);
           canvas.renderer.txel(e, g, h, [220, 164, 255, 255], panes.rotation, [25, 25, 0], canvas.camera, spot);
           }
           );
	
	    
       
	
       
        var lats = torus.lats();
        

        
        for(var k = 0; k < panes.canvas.length; k++) {
           for(var i = 0; i <  lats.length - 1; i++) {
        	for(var j = 0; j <  lats[i].length - 1; j++) {
                panes.canvas[k].renderer.txel(lats[i][j], lats[i][j+1], lats[(i+1)][j], torus.color(), rot2, panes.translation, panes.canvas[k].camera, spot);
                panes.canvas[k].renderer.txel(lats[(i+1)][j], lats[i][(j+1)], lats[i+1][(j+1)], torus.color(), rot2, panes.translation, panes.canvas[k].camera, spot);
            	}
        	}
         }
        
           
     /*  */

	
	
           
         
	  panes.canvas.forEach(canvas => {
	     var imageData = canvas.renderer.flush(
                canvas.ctx.getImageData(0,0,
                     canvas.ctx.canvas.width,
                     canvas.ctx.canvas.height)
                );
         canvas.ctx.putImageData(imageData,0,0);
         }
       );
       
       perf.last = ((performance.now() - start)) ;
       perf.sum += perf.last;
       perf.length ++;
       perf.mean = perf.sum/perf.length;
       document.getElementById("log").innerHTML =
       "<br>mean::"+ (perf.mean|0) + "::" + perf.length +"::" + perf.last;

	}
	
function Torus(R, r, sides, color) {
        var lats = new Array(sides + 1);

        for(var i = 0; i< lats.length; i ++) {
            var  phi = i*360/(lats.length - 1);
        	lats[i] = new Array(sides +1);
        	for(var j = 0; j< lats[i].length ; j++) {
               var theta = j*360/(lats[i].length - 1);
              
               
               
               lats[i][j] = ([
                  (R + r*Math.cos(theta*Math.PI/180))
                            *Math.cos(phi*Math.PI/180),
                 (R + r*Math.cos(theta*Math.PI/180))
                            *Math.sin(phi*Math.PI/180),
                 (r*Math.sin(theta*Math.PI/180))
                            // *Math.sin(phi*Math.PI/180)
                 ]);
        	   }
        	}
           this.lats = () => lats;
           this.color = () => color;
		}
		
	
	