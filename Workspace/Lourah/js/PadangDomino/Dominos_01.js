function Face(tile, idx) {
	this.tile = tile;
	this.idx = idx;
	this.nextCount = 0;
	
	if (this.tile.double) {
		this.next = [ null, null ];
	} else {
		this.next = [ null ];
	}
	this.linked = null;
	
	this.toString = function() {
		/*
		return "[" 
		   + ((this.idx == 0)?"*":"") 
		   + this.tile.pair.join(",") 
		   + ((this.idx == 1)?"*":"") 
		   + "]";
		   */
		   return this.tile.pair[this.idx]
		   + "("
		   	+ this.nextCount + "/" + this.next.length
		   	+ ")"
		   	+ (this.linked?"L":"")
		   	;
	};
	
	this.getOpposite = function() {
		return this.tile.faces[this.idx == 0?1:0];
	};
	

}

Face.prototype.link = function(face) {
	if (this.tile.pair[this.idx] !== face.tile.pair[face.idx]) {
		throw "Face:link:bad pair value " + this + "/" + face;
	}
	
	for(var i in this.next) {
		if (this.next[i] === null) {
			console.log(this + "link" + face + "at:" + i);
			this.next[i] = face;
			face.linked = this;
			this.nextCount++;
			return;
		}
	}
	throw "Face:link:already linked " + this + "->[" + this.next.join(",") + "]";
}

function Tile(pair) {
	this.pair = pair;
	this.faces = [];
	this.double = (this.pair[0] === this.pair[1]);
	for(var i in this.pair) {
	   this.faces[i] = new Face(this, i);
	}
	this.toString = function() {
		return "Tile{" + this.faces.join(",") + "}";
	};
	
	this.getIdx = function(val) {
		for(var i in this.pair) {
			if (val === this.pair[i]) return i;
		}
		return -1;
	}
}

Tile.prototype.chain = function(tile) {
	console.log("test:" + tile.pair);
	for(var i in tile.pair) {
		var idx = this.getIdx(tile.pair[i]);
		if (idx !== -1) {
			console.log("chain:"+this+"with"+tile+"at:"+ idx + "/" + i);
			this.faces[idx].link(tile.faces[i]);
			}
	}
}

function Game() {
	this.tiles = undefined;
	this.ends = [];
}

Game.prototype.getEnds = function(tileChain) {
	  //console.log("getEnds(" + tileChain + ")");
    for(face of tileChain.faces) {
    	  var pushed = false;
    	  for(next of face.next) {
    	  	 if (next !== null) {
    	  	 	   this.getEnds(next.tile);
    	  	 } else {
    	  	 	   if (face.linked === null) {
    	  	 	   	  if (!pushed) this.ends.push(face);
    	  	 	   	  pushed = true;
    	  	 	   }
    	  	 }
    	  }
    	}
}

Game.prototype.add = function(tile) {
	this.ends = [];
	if (this.tiles === undefined) {
		this.tiles = tile;
		return;
	}
	this.getEnds(this.tiles);
	
	for(end of this.ends) {
		for(face of tile.faces) {
			if (tile.pair[face.idx] === end.tile.pair[end.idx]) {
				end.tile.chain(tile);
				return;
			}
		}
	}
}


g = new Game();
g.add( new Tile([2,2]));
g.add(new Tile([5,2]));
g.getEnds(g.tiles);
console.log("ends:"+ g.ends.join(","));
g.add(new Tile([3,2]));
g.getEnds(g.tiles);

console.log("ends:"+ g.ends.join(","));

console.log("OK.");


