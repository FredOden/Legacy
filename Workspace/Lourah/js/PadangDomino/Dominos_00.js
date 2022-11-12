function PadangDominoError(code, object) {
	this.code = code;
	this.object = object;
}

PadangDominoError.ALREADYCHAINED = "Already chained";

function Face(val, tile) {
	this.val = val;
	this.tile = tile;
	this.next = [ null ];
	if (this.tile.double) {
		 this.next.push(null);
	 }
	 
	this.toString = function() {
		  var ret = "{" + this.val + "}";
		  return ret;
    	}
	}
	
	Face.prototype.chain = function(face) {
		var idx = 0;
		 if (this.next[0] != null) {
		 	   if (this.tile.double) {
		 	   	  if (this.next[1] != null) {
		 	   	  	throw new PadangDominoError(PadangDominoError.ALREADYCHAINED, this);
		 	   	  }
		 	   	  idx = 1;
		 	   } else {
		 	   	throw new PadangDominoError(PadangDominoError.ALREADYCHAINED, this);
		 	   }
		 }
		 this.next[idx] = face;
	};


function Tile(pair) {
	  this.pair = pair;
    this.double = (pair[0] === pair[1]);
    this.faces = [];
    for(var val of pair) {
    	  this.faces.push(new Face(val, this));
    }
    this.toString = function() {
    	   return "[" + this.pair[0] + "," + this.pair[1] + "]";
    	   
    }
}

PadangDomino.tiles = [];
PadangDomino.game = undefined;


for (var i = 0; i <= 6; i++) {
	for(var j = 0; j <= i; j++) {
		PadangDomino.tiles.push(new Tile([i, j]));
	  }
	}

function PadangDomino() {
	}
	
PadangDomino.prototype.findEnds = function(ends, face) {
	 console.log("findEnds(["+ends+"]," +face+")");
	 for(next of face.next) {
	 	  if (next !== null) {
	 	  	 this.findEnds(ends, next);
	 	  } else {
	 	  	 console.log(next + "->" + ends);
	 	  	 ends.push(face);
	 	  }
	 }
}
	
PadangDomino.prototype.getEnds = function() {
		var ends = [];
		var points = 0;
		
		for(face of PadangDomino.game) {
		  this.findEnds(ends, face);
		}
	
		console.log("ends are : " + ends);
		return ends;
}
	
	
PadangDomino.prototype.add = function(tile) {
	console.log("adding:"+tile);
	if (PadangDomino.game === undefined) {
		   PadangDomino.game = [];
		   for(var face of tile.faces) {
		   	   PadangDomino.game.push(face);
		   }
		   return;
		}
		

	var ends = this.getEnds();
		
		
		/*********
		@@ ca va pas etre de la tarte!
		*********/
		
		for(face of tile.faces) {
			for(end in ends) {
				if(face.val === ends[end].val) {
					console.log(face + "matched" + ends[end]);
					
					for(next in ends[end].next) {
						if (ends[end].next[next] === null) {
							  ends[end].next[next] = face;
							  console.log("***" + ends[end] + "next :" + ends[end].next);
					     //end.next.push(face);
					     return;
					     }
					 }
					 
				}
			}
		}
		
	}
	
	var padang = new PadangDomino();
	
	padang.add(new Tile([0,0]));
	padang.add(new Tile([3,0]));
	padang.add(new Tile([2,3]));
	/*
	padang.add(new Tile([6,0]));
	*/
	console.log("OK.");
	
