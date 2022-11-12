function Face(tile, value, idx) {
	this.tile = tile;
	this.value = value;
	this.idx = idx;
	this.next = null;
	this.prev = null;
}

Face.prototype.getPoints = function() {
	if (this.idx > 1) return 0;
	if (this.tile.isDouble()) return this.value*2;
	return this.value;
}

Face.prototype.toString = function() {
	return "F{" + this.value + "}";
}

function Tile() {
	if (arguments.length != 2) {
		var err = ("Tile:wrong number of faces:" + arguments.length);
		//console.log(err);
		throw err;
	}
	
	this.faces = [];
	this.linkCount = 0;
	
	for(var i = 0; i < 2; i++) {
		this.faces.push(
			new Face(this, arguments[i], i));
		}
		
		
		if ( (this.double  = arguments[0] == arguments[1])  && arguments[0] == 0)
		  for(var i = 0; i < 2; i++) {
		    this.faces.push(
		    	  new Face(this, arguments[i], 2 + i));
		 }
		
		 
		 this.weight = this.faces[0].value + this.faces[1].value;
}

Tile.prototype.isDouble = function() {
	return (this.double);
}

Tile.prototype.toString = function() {
	return "[[" + this.faces.join(",") + "]]";
}

Face.prototype.link = function(tile) {
		for(tface of tile.faces) {
			if (this.value == tface.value) {
				/*@@@optimization
	            if(tile.isDouble() && tface.idx == 0) {
		            continue;
		            }
		        */
				if (this.next == null 
					&& tface.prev == null
					&& this.prev == null
					&& tface.next == null
					&& (this.idx < 2
						     || (this.idx > 1 && this.tile.linkCount >=2))
					) {
					this.next = tface;
					tface.prev = this;
					this.tile.linkCount++;
					tface.tile.linkCount++;
					////console.log(this + " linked with " + tface);
					return true;
				}
			}
  	}
  	return false;
}

Tile.prototype.link = function(tile) {
	for(var face of this.faces) {
	   if (face.link(tile)) return true;
	}
	return false;
}

function Game() {
	this.tiles = null;
	this.score = 0;
	this.tileSet = [];
	this.end = [];
	
	for(var i = 0; i < 7; i++) {
	  this.tileSet[i] = [];
	  for(var j = 0; j <= i; j++) {
	  	 this.tileSet[i][j] = new Tile(i,j);
	  }
  }
}


Game.prototype.getTile = function(i,j) {
	var  h = i;
	var l = j;
	if (j > i) {
		h = j;
		l = i;
	}
	return (this.tileSet[h][l]);
}

Game.prototype.peekTile = function(i,j) {
	
	tile = this.getTile(i,j);
	
	
	
	if (tile == null) return null;
	
	var  h = i;
	var l = j;
	if (j > i) {
		h = j;
		l = i;
	}
	
	this.tileSet[h][l] = null;
	
	////console.log("peekTile(" + i + "," + j +"):" + tile);
	
	return tile;
	
}

Game.prototype.getTileSetCount = function() {
	var count = 0;
	for(tiles of this.tileSet) {
		for (tile of tiles) {
  		if (tile != null) {
		   	count++;
		   	}
		}
	}
	return count;
}

Game.prototype.peekRandomTile = function() {
	var retTile = null;
	if (this.getTileSetCount() == 0) {
		//console.log("no more tile in set!");
		return null;
	}
	
	while(retTile == null) {
	   var i = Math.round(Math.random()*6);
	   var j = Math.round(Math.random()*i);
	   retTile = this.peekTile(i,j);
	   ////console.log("randomTile:"+retTile);
	}
	return retTile;
}

function Hand(game, name) {
	this.game = game;
	this.name = name;
	this.score = 0;
	this.hand = [];
}


Hand.prototype.addHand = function(count) {
	;
	for(var i = 0; i < count; i++){
		if (this.game.getTileSetCount() == 0) break;
		var tile = this.game.peekRandomTile();
		if (tile != null) {
			  ////console.log("push:"+tile+"->["+this.hand+"]")
		    this.hand.push(tile);
		}
	}
}

Hand.prototype.place = function(face, tile) {
  //console.log("hand.place(" + face + "," + tile + ")");
  var add = this.game.add(
        	face,
            tile
        	);
  
  if (add == null) return false;
  
  for(var i = 0 in this.hand) {
  	if (tile == this.hand[i]) {
  		this.hand.splice(i, 1);
  	}
  }
  
  
  var s = this.game.getScore(this.game.ends);
  
  if (s % 5 == 0) {
  	this.score += s;
  	//console.log("!!! scored:" + s + "/" + this.score);
    }
    return true;
}
Hand.prototype.play = function() {
	////console.log("Hand::hand:" + h.hand);
	
	var guess =
	                 this.game.checkTile(this.hand);

  if (guess == null) {
   	////console.log("Hand::cannot play!");
   	return null;
  }

  this.place(
        	this.game.ends[guess[0].end],
        	guess[0].tile
        	);
  return this.game.ends;
}

Game.prototype.getEnds = function(ends, tile) {
	
	for(var face of tile.faces) {
		if(face.next == null && face.prev == null) {
			ends.push(face);
		}
		if (face.next != null) {
		  ends = this.getEnds(ends, face.next.tile);
		}
	}
	return ends;
}

Game.prototype.begin = function(tile) {
	this.tiles = tile;
	return this.ends = this.getEnds([], this.tiles);
}

Game.prototype.getScore = function(ends) {
		this.score = 0;
	
		for(var end of ends) {
			this.score += end.getPoints();
		}
		return this.score;
}
	
Game.prototype.add = function(face, tile) {
	if (face.idx > 1) {
       var score = this.getScore(this.ends);
       console.log(face+"face.idx:"+face.idx+",score:"+score);
       score -= face.value;
       console.log(face+"face.idx:"+face.idx+",score - face.value:"+score);
       for(var iface in tile.faces) {
       	if (face.value == tile.faces[iface].value) {
       	   var ioface = iface.value==0?1:0;
       	   console.log(face+"face.idx:"+face.idx+" face.value:"+tile.faces[iface].value + " of " + tile + "/" + iface);
       	   console.log(face+"face.idx:"+face.idx+" oface.value:"+tile.faces[ioface].value + " of " + tile + "/" + ioface);
       	   score += tile.faces[ioface].value;
              console.log(face+"face.idx:"+face.idx+",score + tile.face.value:"+score);
              if (score % 5 != 0) return null;
              break;
       	   }
       	}
       }
	
	if (face.link(tile)) {
	   return this.ends = this.getEnds([], this.tiles);
	   }
	 return null;
}

Game.prototype.checkTile = function(tileArray) {
	this.ends = this.getEnds([], this.tiles);
	var ends = this.ends;
	var score = this.getScore(ends);
	var checkScore;
	var guess =[];
	for(tile of tileArray){
	for(var end in ends) {
		var e = ends[end];
		if ((e.idx<2 || e.idx > 1 && e.tile.linkCount >= 2)) {
		for(face of tile.faces) {
			if (ends[end].value == face.value) {
				checkScore = score - ends[end].getPoints();
				var oface = face.tile.faces[face.idx == 0?1:0];
				checkScore += oface.getPoints();
				
				if (checkScore % 5 != 0) checkScore = 0;
				// can only cross with score multiple
				// of 5 on double [0,0]
				if (e.idx > 1 && checkScore == 0) {
					continue;
					}
				/*
				//console.log("checkscore:"
					+ checkScore
					+ " at:"
					+ end
					);
					*/
					guess.push({
						tile:tile,
						end:end,
						score:checkScore,
						toString:function() {
							return this.tile + ":" + this.end + ":" + this.score;
						}
					});
			}
			}
		}
	}
	}
	
	if (guess.length == 0) {
		return null;
	}
	
	if (guess.length == 1) {
		return guess;
	}
	
	guess.sort(function(a,b){
		return b.score - a.score; 
		});
		
	
	if (guess[0].score == 0) {
	 guess.sort(function(a, b) {
		 return b.tile.weight - a.tile.weight;
	  });
  }
	return guess;
}

Game.prototype.showStatus = function() {
	//console.log("ends length:" + this.ends.length);
for(var end in this.ends) {
	//console.log(" end[" + end + "]=" + this.ends[end] + ":" + this.ends[end].next +"," + this.ends[end].prev);
}
//console.log("score:" + this.getScore(this.ends));

}

function testDominos() {

var g = new Game();

g.begin(g.peekTile(0,0));

var h = new Hand(g, "Hendrick");

h.addHand(7);

/*
for(var i = 0; i < 7; i++) {
	while(h.play() == null) {
		h.addHand(1);
		}
	}
*/


var count = 0;
while(h.hand.length > 0) {
   while (h.play() == null && g.getTileSetCount() > 0) {
	     h.addHand(1);
	     //h.play();
    }

   //g.showStatus();
   if (g.getTileSetCount() == 0) break;
   count++;
   if (count > 1000) break;
   
}

//console.log("*** count:"+count + ",hand.length:"+h.hand.length + ",hand.score:"+h.score + ",remainingTiles:"+g.getTileSetCount());
return g;
}





