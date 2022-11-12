       var canvas;
        var count;
        var haf;
        var canvas3d;
        var c3d;

        var vz = new V3D(0, 0, 1);
        var a = new P3D();
        var b = new P3D();
        var c = new P3D();
        var d = new P3D();
        
        var area = new Area3D(a, b, c);
        var area1 = new Area3D(b, c, d);
        var area2 = new Area3D(a, b, d);
        var area3 = new Area3D(c, d, a);

        function draw_00()
        {
            count = 0;
            cancelAnimationFrame(haf);
            canvas = document.getElementById("canvas");

            canvas.height = window.innerHeight - canvas.getBoundingClientRect()
                .top - 10;
            canvas.width = window.innerWidth - 20;

            canvas3d = new Canvas3D(canvas);
            c3d = canvas3d.c3d;
            if (c3d === undefined)
            {
                alert("canvas not supported !");
                return;
            }

            haf = requestAnimationFrame(anim1);
        }

        function fillArea3D(c3d, area) {
           var g = area.getGeometry().g;
            var v = new V3D(area.getGeometry().vOrtho)
                .normalize(200);
            var o = P3D.translate(g, v);
            var lambda = area.getLambda(vz);
            c3d.fillStyle = "rgba(" + Math.round(196 - lambda * 128) + "," + Math.round(128 - lambda * 128) + "," + Math.round(196 - lambda * 128) + ",1)";
            c3d.beginPath();
            c3d.area3D(area);
            c3d.closePath();
            c3d.fill();
            
            c3d.fillStyle = "black";
            c3d.fillText3D("x", g);
            
            c3d.strokeStyle = "red";
            c3d.beginPath();
            c3d.polyLine3D(g, o)
            /*
                .polyLine3D(area.a, o)
                .polyLine3D(area.b, o)
                .polyLine3D(area.c, o)
            */
            c3d.stroke();
            
            
            return c3d;
        }

        function scaleText(c3d, p ) {
            c3d.font = "bold " + Math.round(20 * canvas3d.transform3D(p).scale) + "pt sans-serif";
         }
         
         function drawAxis(c3d, size) {
         	c3d.save();
         	//c3d.strokeStyle = "green";
            //c3d.fillStyle = "black";
            
            c3d.beginPath();

            var O = new P3D();
         //   O.fixed = true
            scaleText(c3d, O);
            c3d.fillText3D("O", O);
            var I = (new P3D())
                .setXYZ(size, 0, 0);
          //  I.fixed = true;
            c3d.polyLine3D(O, I);
            scaleText(c3d, I);
            c3d.fillText3D("I", I);

            var J = new P3D();
            J.setXYZ(0, size, 0);
          //  J.fixed = true;
            c3d.polyLine3D(O, J);
            scaleText(c3d, J);
            c3d.fillText3D("J", J);

            var K = new P3D();
            K.setXYZ(0, 0, size);
        //    K.fixed = true;
            c3d.polyLine3D(O, K);
            scaleText(c3d, K);
            c3d.fillText3D("K", K);
            c3d.stroke();
            c3d.restore();
     	}
         
         
        function anim1()
        {
            var count1 = 30;
            canvas3d.setRotation(count/36, count/36, count/36);
            
            a.setSpheric(200, count / 3, 0);
            b.setSpheric(150, 300 - count / 3, 0);
            c.setSpheric(250, 90, count / 3);
            d.setSpheric(100, -135, 50 - count / 3);
            
            var areas = [
               area.setABC(a, b, c),
               area1.setABC(b, c, d),
               area2.setABC(d, a, b),
               area3.setABC(c, d, a)
            ];


           /*
           areas.sort(function(a, b) {
           	return +( a.getZOrder(canvas3d)
                          -b.getZOrder(canvas3d));
           	});
           */
           
           areas.sort(Area3D.zCompare);
           
            
           

            c3d.clearRect(0, 0, canvas.width, canvas.height);
            c3d.save();
            /**/
            drawAxis(c3d, 200);
            
            areas.forEach(function(area) {
            fillArea3D(c3d, area);
            c3d.beginPath();
            c3d.area3D(area);
            c3d.closePath();
            c3d.stroke();
            });
      
            /**/
            c3d.restore();
            count++;
            haf = requestAnimationFrame(anim1);
        }
        
function draw_01() {
	canvas = document.getElementById("canvas");

            canvas.height = window.innerHeight - canvas.getBoundingClientRect()
                .top - 10;
            canvas.width = window.innerWidth - 20;

            canvas3d = new Canvas3D(canvas);
            c3d = canvas3d.c3d;
            if (c3d === undefined)
            {
                alert("canvas not supported !");
                return;
            }
    try {
    var shape = new Shape3D();
    var s3d = shape.getVirtualContext3D();
    var square = new Shape3D();
    var sq3 = square.getVirtualContext3D();
    var axis = new Shape3D();
    
    canvas3d.setRotation(10, 10, 10);
    drawAxis(axis.getVirtualContext3D(), 200);
    
    square.add("beginPath");
    sq3.strokeRect(0, 0, 20, 20).strokeStyle = "#00f";
    
    square.add("area3D", area);
    square.add("fill");
    
    s3d.beginPath();
    s3d.moveTo(100, 100);
    s3d.lineTo(200, 200);
    s3d.lineTo(200, 400);
    s3d.lineTo(250, 350);
    //shape.add("lineTo", 200, 400);
    shape.add("closePath");
    var e = s3d.fill();
    var s = shape.add("stroke");
    shape.add("beginPath");
    s3d.arc(250, 300, 100, Math.PI/2, Math.PI);
    shape.add("lineTo", 250, 300);
    shape.add("closePath");
    shape.add("stroke");
    shape.add("translate", 250, 300);
    shape.merge(square);
    shape.setCenter(250,300);
    //console.log("shape:"+shape);
    e.fillStyle = "#007";
    shape.draw(c3d);
    shape.moveTo(50, -50);
    for(var i = 0; i< 12; i++) {
      e.fillStyle = "rgb(0," + Math.round(i*255/12) + ",0)";
      s.strokeStyle = "rgb(" + Math.round(i*255/12) + ",0,0)";
     shape.setScale((12-i)/12, (12 - i)/12);
     shape.setRotation(i*Math.PI/12);
      
      shape.draw(c3d);
      }
      console.log("axis:"+axis);
      axis.setScale(.5,.5);
      axis.draw(c3d);
    } catch(e) {
        console.log("shape:" + e);
	}
	}
	
	var shape3d;
	var axis;
	
	function draw() {
		try{
		cancelAnimationFrame(haf);
	    canvas = document.getElementById("canvas");

            canvas.height = window.innerHeight - canvas.getBoundingClientRect()
                .top - 10;
            canvas.width = window.innerWidth - 20;

            canvas3d = new Canvas3D(canvas);
            c3d = canvas3d.c3d;
            if (c3d === undefined)
            {
                alert("canvas not supported !");
                return;
            }
    
    	shape3d = new Shape3D();
        axis = new Shape3D();
        drawAxis(axis.getVirtualContext3D(), 200);
        var s3d = shape3d.getVirtualContext3D();
        var summits = [];
        
        var sides = 5;
        var lats = new Array(sides + 1);

        for(var i = 0; i< lats.length; i ++) {
            var  phi = i*360/(lats.length - 1);
        	lats[i] = new Array(sides +1);
        	for(var j = 0; j< lats[i].length ; j++) {
               var theta = j*360/(lats[i].length - 1);
               var R = 100;
               var r = 40;
               /*
        	   var p =  (new P3D()).setSpheric(Math.sqrt(R*R + 2*R*r*Math.cos(phi*Math.PI/180) +r*r)
                                     , phi
                                     , theta
                                     );
               */
               var x = (R + r*Math.cos(theta*Math.PI/180))
                            *Math.cos(phi*Math.PI/180);
               var y = (R + r*Math.cos(theta*Math.PI/180))
                            *Math.sin(phi*Math.PI/180);
               var z = (R + r*Math.sin(phi*Math.PI/180))
                             *Math.sin(theta*Math.PI/180);
               var p = new P3D(x,y,z);
               
               //p.fixed = (j % 2=== 0);
               lats[i][j] = p;
        	   }
        	}
        
        var areas = [];
        
        for(var i = 0; i <  lats.length - 1; i++) {
        	for(var j = 0; j <  lats[i].length - 1; j++) {
                areas.push(new Area3D(lats[i][j], lats[i][j+1], lats[(i+1)][j]));
                areas.push(new Area3D(lats[(i+1)][j], lats[i][(j+1)], lats[i+1][(j+1)]));
            	}
        	}
        
       
       var i = 0;
       
       
       
       var hooks = new CustomHooks();
      
       
        for(area of areas) {
        	s3d.area3D(area, hooks);
        	}
 
       
        console.log("shape3d:"  + shape3d);
        count = 0;
    	haf = requestAnimationFrame(anim2);
        
    	} catch(e) {
    	console.log("draw catched:" + e);
    	}
    }
    
    function anim2() {
    	try {
    	   var framing = 6;
    	   //console.log("count:"+count);
    	   c3d.clearRect(0, 0, c3d.canvas.width, c3d.canvas.height);
           canvas3d.setRotation(count++/framing, 45+ count/framing, 45-count/framing);
           //canvas3d.setRotation(10,10,10);
           //drawAxis(c3d, 200);
           //shape3d.setCenter(c3d.canvas.width/2, c3d.canvas.height/2);
           //shape3d.setRotation(count/36);
           //shape3d.setScale((count%100)/100, (count%100)/100);
           shape3d.setScale(1,1);
    	   shape3d.draw(c3d);
    
          // axis.draw(c3d);
           //c3d.stroke();
           
           
           canvas3d.setRotation(count*2/framing, 45+ -count*2/framing, 45-count*2/framing);
      //     canvas3d.setTranslation(new P3D(0,0,50 + (count)%100));
         
           shape3d.setScale(.5,.5);
           shape3d.draw(c3d);
           
           canvas3d.setTranslation(new P3D(0,0,0));
           
           
           c3d.zSpaces.draw();
 
    	   haf = requestAnimationFrame(anim2);
       	} catch(e) {
    	   console.log("anim2 catched:" + e);
       	}
    	}
    
 
function CustomHooks() {
           this.count = 0;
          this.begin = function(c3d, area) {
       	    //c3d.beginPath();
           	}
           
         
         this.close = function(c3d, area) {
         	
         	//c3d.closePath();
         
         var OK = new V3D(
             (new P3D(0,0,0)).setFixed()
            ,(new P3D(1,1,1)).setFixed());
       
            OK.normalize();
         
             c3d.fillStyle = "rgba(64,0," + Math.round(127+(1+area.getLambda(OK))*64) + ",1)";
             /*
             if (this.count++<64) {
             	console.log("fillStyle:"+c3d.fillStyle);
             	}
             */
             c3d.strokeStyle = "#007";
             //c3d.fill();
             
             c3d.zSpaces.fill(area.txel,  c3d.fillStyle);
             //c3d.stroke();
             
         	}
             
       }

    
    function Sphere3D(ray, sides) {
    	this.shape = new Shape3D();
        
    	}