var padangDomino = undefined;

function padangDominoMain() {
    //  console.log("padangDominoMain");
	try {
	        var dominoCanvas;
	        
	
	         // singleton
	         if (padangDomino !== undefined) return;
	
	        padangDominoCanvas = document.getElementById("canvas");
           // padangDominoCanvas.height = window.innerHeight - padangDominoCanvas.getBoundingClientRect().top - 10;
            padangDominoCanvas.width = window.innerWidth*1.5 //- 20;
            padangDominoCanvas.height = padangDominoCanvas.width;
            padangDomino = new PadangDomino(padangDominoCanvas);
        } catch (e) {
        	console.log("PadangDomino error:" + e);
        }
}

function FaceLocator(pd, x, y, orientation, face) {
	this.x = x;
	this.y = y;
	this.orientation = orientation*Math.PI/180;
	this.deg = orientation;
	this.face = face;
	this.pd = pd;
	}

FaceLocator.prototype.hilight = function(hilight) {
	this.pd.drawFace(this.x, this.y, this.deg, this.face, hilight);
	}

FaceLocator.prototype.hilightTile = function() {
	var angle = this.deg + this.face.tile.isDouble()?270:0;
	this.pd.drawTile(this.x, this.y, angle, this.face.tile, null, true);
	}

FaceLocator.prototype.surround = function(pos) {
	var cos = Math.cos(this.orientation);
	var sin = Math.sin(this.orientation);
	//console.log("cos:"+cos+",sin:"+sin);
	//console.log("pos.x:"+pos.x+",pos.y:"+pos.y);
	//console.log("this.x:"+this.x+",this.y:"+this.y);
	var X = (pos.x - this.x)*cos + (pos.y - this.y)*sin;
	var Y = -(pos.x - this.x)*sin + (pos.y - this.y)*cos;
	/*
	console.log("surround?" + this.face.tile);
	console.log("size:"+(this.pd.attributes.Face.width/2));
	console.log("X:"+X+",Y:"+Y);
	console.log("X<?" + (X < this.pd.attributes.Face.width/2));
	console.log("X>?" + (X > -this.pd.attributes.Face.width/2));
	console.log("Y<?" + (Y < this.pd.attributes.Face.height/2));
	console.log("Y>?" + (Y > -this.pd.attributes.Face.height/2));
	*/
	var ret = (X < this.pd.attributes.Face.width)
	      && (X > -this.pd.attributes.Face.width)
	      && (Y < this.pd.attributes.Face.height)
	      && (Y > -this.pd.attributes.Face.height);
	//console.log("surround ret:"+ret);
	return ret;
	}
	
FaceLocator.prototype.onSelected = function() {
	console.log("face selected:" + this.face.value + "of tile:" + this.face.tile + " at " + this.face.idx);
	}
	
FaceLocator.prototype.isEnd = function() {
	var end =this.isTileLinked() 
	         && this.face.next == null
	         && this.face.prev == null
	         ;
	return end;
	}
	
FaceLocator.prototype.isTileLinked = function() {
	
	for(face of this.face.tile.faces) {
		if(face.next != null || face.prev != null) {
			return true;
			}
		}
		
		if (this.face.tile == this.pd.game.tiles) {
			
             return true;
             }
		return false;
	}

function PadangDomino(canvas) {
	//console.log("PadangDomino("+canvas+")");
	this.canvas = canvas;
	this.c2d = canvas.getContext("2d");
	this.canvas.addEventListener(
            "mousedown"
           ,this.computerPlays
           ,false);
    this.newParty();
	}

PadangDomino.prototype.endOfParty = function() {
	console.log("end of party");
	try {
	for (var hand of [this.mesin, this.hand]) {
		var remaining = 0;
		
		for(var tile of hand.hand) {
			for(var face of tile.faces) {
				remaining += face.value;
				}
			}
			
		remaining =  Math.floor((remaining)/5)*5;
		hand.score -= remaining;
		}
		if (this.mesin.score > this.hand.score) {
			this.mesin.name = this.mesin.name + " !winner!";
			this.hand.name = this.hand.name + " ?looser?";
			return;
			}
		if (this.mesin.score < this.hand.score) {
			this.mesin.name = this.mesin.name + " ?looser?";
			this.hand.name = this.hand.name + " !winner!";
			return;
			}
		this.mesin.name = this.mesin.name + " sama";
		this.hand.name = this.hand.name + " sama";
		} catch(e) {
			console.log("endOfParty err:" + e);
			}
	}

PadangDomino.prototype.newParty = function() {
	this.game = new Game();
    this.game.begin(this.game.peekTile(0,0));
    this.hand = new Hand(this.game, "Mr Hendrick");
  
    this.hand.addHand(7);
    this.mesin = new Hand(this.game, "Hati hati!");
    this.mesin.addHand(7);
    
    /*
    var found = false;
    for(var i = 0; i < 7 && !found; i++) {
    	for(var hand of [ this.mesin.hand, this.hand.hand ]) {
    	if (found) break;
    	for(var it in hand) {
    	    var t = hand[it];
            if (t.isDouble()) {
            	if (t.faces[0].value == i) {
            	   this.game.begin(t);
	               hand.splice(it, 1);
	               if (hand == this.hand.hand) {
		             this.play();
		             }
            	   found = true;
                   break;
            	   }
            	}
    	    }
            }
    	}
    */
    this.hilighted = null;
	this.init();
	}

PadangDomino.prototype.play = function() {
	while (this.mesin.play() == null) {
		if (this.game.tileSet.length == 0) {
		  this.endOfParty();
          return;
          }
		this.mesin.addHand(1);
		}
	}

PadangDomino.prototype.getMousePos = function(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

PadangDomino.prototype.computerPlays = function(e) {
	//console.log("computerPlays(" + e + ")");
	try {
	var pos = padangDomino.getMousePos(e);
	var faceLocated = false;
	
	//console.log("padangDomino.faceLocations:"+ padangDomino.faceLocations);
	
	for(faceLocator of padangDomino.faceLocations) {
		
		if (faceLocator.surround(pos)) {
			faceLocator.onSelected();
			if(faceLocator.isEnd()) {
				//console.log("face is end");
				if (padangDomino.hilighted != null) {
					padangDomino.hilighted.hilight(false);
					}
				faceLocator.hilight(true);
				padangDomino.hilighted= faceLocator;
				}
		    if(!faceLocator.isTileLinked()) {
			    //console.log("face of free tile");
			   //console.log("shall play?:" + faceLocator.face.tile);
			   if(padangDomino.hilighted == null) {
				   //console.log("no hilighted end!");
				   return;
				}
			  //console.log("shall place?:" + faceLocator.face.tile + " on " + padangDomino.hilighted.face);
			 var ret = padangDomino.hand.place(
                            padangDomino.hilighted.face
			               , faceLocator.face.tile);
			
			   if (ret && padangDomino.hand.hand.length == 0) {
                    padangDomino.endOfParty();
                    padangDomino.redraw();
                    return;
                    }
			   //console.log("selected linked:"+ret);
			   if (ret) {
				 padangDomino.play();
				 if(padangDomino.mesin.hand.length == 0) {
					padangDomino.endOfParty();
					}
				 padangDomino.redraw();
				 return;
				 }
			   }
			faceLocated = true;
			return;
			}
			
		}
	
	
	if (!faceLocated) {
		console.log(pos.y + "<?" + (padangDomino.canvas.height - 100));
	   if (pos.y < padangDomino.canvas.height - 100) return;
	   if (padangDomino.game.tileSet.length  == 0) {
		 padangDomino.endOfParty();
		 return;
		}
		   //console.log("computerPlays(" + e + "):play is nul");
		   
		 padangDomino.hand.addHand(1);
		   
	    }
	
	
	//console.log("computerPlays(" + e + "):call redraw");
	padangDomino.redraw();
	} catch(err) {
				console.log("computerPlay:err:"+err);
				}
	}
	
PadangDomino.prototype.init =function() {
	//console.log("PadangDomino::init()");
	/*
	init stuff here...
	*/
	this.attributes = {
      Face:{ width:this.canvas.width/30
                , height:this.canvas.height/30
                , background:"#fff"
                , foreground:"#000"
                , hilight:"#f00"
                }
     };
     
     this.xMin = this.canvas.width/2;
     this.xMax = this.canvas.width/2;
     this.yMin = this.canvas.height/2;
     this.yMax = this.canvas.height/2;
     
	this.redraw();
	}
	       
PadangDomino.prototype.redraw = function() {
	console.log("redraw():c2d:" + this.c2d);
	this.c2d.setTransform(1, 0, 0, 1, 0, 0);
    this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
	//console.log(padangDomino.hand.name + ": " + padangDomino.hand.score);
    //this.center();
	this.c2d.save();
	this.c2d.fillStyle = "#007f00";
	this.c2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.c2d.fillStyle = "#00007F";
	
	this.drawGame(
         this.canvas.width - (this.xMax + this.xMin)/2
        ,this.canvas.height - (this.yMax + this.yMin)/2, 45, this.game);
    
    this.c2d.font = "30px Arial";
	this.c2d.fillText(this.mesin.name + ": " + this.mesin.score, 10, 35);
	this.c2d.font = "16px Arial";
	this.c2d.fillText("has " + this.mesin.hand.length + " tiles",  10, 55);
	this.showHand(this.hand);
	this.c2d.restore();
	}
	
PadangDomino.prototype.showHand = function(hand) {
	var x0 = 5;
	var y0 = this.canvas.height - this.attributes.Face.height - 20;
	this.c2d.font = "30px Arial";
	this.c2d.fillText(this.hand.name + ": " + this.hand.score, x0, y0);
	
	x0 = this.attributes.Face.width*3;
	for(tile of hand.hand) {
		this.drawTile(x0,
                  y0 + 20
               ,  tile.isDouble()?270:0
               , tile
               , null);
        
		x0 += this.attributes.Face.width*3;
		}
		
	}

PadangDomino.prototype.drawFace = function(x0, y0, orientation, face, hilight) {
	//console.log("drawFace(" +x0 +"," + y0 + "," + orientation + "," + face);
	/*
	if (x0 < this.xMin) this.xMin = x0 - this.attributes.Face.width*2;
	if (x0 > this.xMax) this.xMax = x0 + this.attributes.Face.width*2;
	if (y0 < this.yMin) this.yMin = y0 - this.attributes.Face.height*2;
	if (y0 > this.yMax) this.yMax = y0 + this.attributes.Face.height*2;
	*/
	
	if (face.next == null && face.prev == null) {
		var found = false;
		
		for(var faceLocator of this.faceLocations) {
			if (face == faceLocator.face) {
				found = true;
				break;
				}
			}
	   if (!found) {
          this.faceLocations.push(new FaceLocator(this, x0, y0, orientation, face));
          }
	   }
	
	//console.log("drawFace:hilight:"+hilight);
    var foreground = 
          hilight
         ?this.attributes.Face.hilight
          :this.attributes.Face.foreground;
          
	if (hilight) {
		console.log("drawFace:hilight:foreground:"+foreground);
		}
		
	this.c2d.save();
	
	
	
	this.c2d.translate(x0, y0);
    this.c2d.rotate(orientation*Math.PI/180);
	
	var x = - this.attributes.Face.width/2;
	var y = - this.attributes.Face.height/2;
	this.c2d.fillStyle = this.attributes.Face.background;
	this.c2d.fillRect(x, y
         , this.attributes.Face.width
         , this.attributes.Face.height
         );
         
    this.c2d.beginPath();
    this.c2d.strokeStyle = foreground;
    this.c2d.rect(x, y
         , this.attributes.Face.width
         , this.attributes.Face.height
         );
    
    this.c2d.stroke();
    
    var ray = this.attributes.Face.width/12;
    
    this.c2d.save();

    
    this.c2d.fillStyle = foreground;
    //console.log("face.value:"+face.value+",ray:"+ray);
    switch(face.value) {
    	case 0: break;
        case 1: this.c2d.beginPath();this.c2d.arc(0, 0, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      break;
        case 2: this.c2d.beginPath();this.c2d.arc(-ray*3.5, -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( ray*3.5,  ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      break;
        case 3: this.c2d.beginPath();this.c2d.arc(-ray*3.5, -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc(0, 0, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc(ray*3.5, ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      break;
        case 4: this.c2d.beginPath();this.c2d.arc(-ray*3.5,  -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( ray*3.5,  -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc(-ray*3.5,  ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( ray*3.5,  ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      break;
        case 5: this.c2d.beginPath();this.c2d.arc(-ray*3.5, -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( ray*3.5, -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc(0, 0, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc(-ray*3.5, ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( ray*3.5, ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      break;
        case 6: this.c2d.beginPath();this.c2d.arc(-ray*3.5, -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( ray*3.5, -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( 0, -ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( 0,  ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc(-ray*3.5,  ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      this.c2d.beginPath();this.c2d.arc( ray*3.5,  ray*3.5, ray*1.3, 0, 2*Math.PI);this.c2d.fill();
                      break;
    	}
    
    this.c2d.restore();
    
	this.c2d.restore();
	}


PadangDomino.prototype.drawTile = function(x0, y0, orientation, tile, face, hilight) {
	//console.log("drawTile(" + x0 + "," + y0 + "," + orientation + "," + tile +")");
	if (tile.isDouble()) {
		orientation += 90;
		}
		
	var angle = orientation*Math.PI/180;
	var cos = Math.cos(angle) * this.attributes.Face.width/2;
	var sin = Math.sin(angle) * this.attributes.Face.height/2;
    
    if (tile.isDouble() && tile.faces[0].value == 0) {
    	this.drawFace(x0 - cos, y0 - sin, orientation, tile.faces[1], hilight);
        this.drawFace(x0 + cos, y0 + sin, orientation, tile.faces[0], hilight);
        this.drawFace(x0 - cos, y0 - sin, orientation, tile.faces[3], hilight);
        this.drawFace(x0 + cos, y0 + sin, orientation, tile.faces[2], hilight);
        return;
    	}
    
    
    var offset = 1;

    if (face == null || tile.faces[0].value == face.value) {
    	offset = 0;
    	}
    
    //console.log("drawTile(" + x0 + "," + y0 + "," + orientation + "," + tile +"," + face + "):offset:"+offset);
    
     this.drawFace(x0 - cos, y0 - sin, orientation, tile.faces[0 + offset], hilight);
     this.drawFace(x0 + cos, y0 + sin, orientation, tile.faces[(1 + offset)%2], hilight);
	}
	
PadangDomino.prototype.drawGame = function(x0, y0, orientation, game) {
	this.faceLocations =[];
	this.hilighted = null;
	this.drawTiles(x0, y0, orientation, game.tiles, null);
	}
	
PadangDomino.prototype.drawTiles = function(x0, y0, orientation, tiles, face) {
	this.drawTile(x0, y0, orientation, tiles, face, false);
	var corr = [180, 0, 90, 270];
	for(var i in tiles.faces) {
		var o = orientation

        if (tiles.isDouble()) {
            o += corr[i];
        }
        
		var angle = o*Math.PI/180;
		
		
		var cos = Math.cos(angle) * this.attributes.Face.width;
	    var sin = Math.sin(angle) * this.attributes.Face.height;
	
	    var cosd = cos*1.5;
	    var sind = sin*1.5;
	
	    if (!tiles.faces[i].tile.isDouble() || i >1) {
		   cos = cos*2;
		   sin = sin*2;
		} else {
			cos = cos*1.5;
			sin = sin*1.5;
	    }
  
	    if (tiles.faces[i].next != null) {
		   if (tiles.faces[i].next.tile.isDouble()) {
			cos = cosd;
			sin = sind;
			}
		   this.drawTiles(x0 + cos, y0 + sin, o, tiles.faces[i].next.tile, tiles.faces[i]);
		   }
	    }
	}