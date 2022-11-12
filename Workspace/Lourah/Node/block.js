var Lourah = Lourah || {};
Lourah.blockchain = Lourah.blockchain || {};

Lourah.blockchain.zz = "top";

Lourah.blockchain.Block = function(data, previousHash ) {
		this.data = data; // data object
		this.previousHash = previousHash;
		this.timeStamp = (new Date()).getTime();
		this.nonce = 0;
		
		this.prefix = this.previousHash
                          + this.timeStamp
                          + JSON.stringify(this.data)
                          ;
                          
        //this.suffix = JSON.stringify(this.data);
		
		this.hash = this.calculateHash();
	};


	//Calculate new hash based on blocks contents
Lourah.blockchain.Block.prototype
   .calculateHash = function() {	
		var calculatedhash = Sha256.hash( 
				   this.prefix
				+ this.nonce 
				// + this.suffix // data serialization
				);
		return calculatedhash;
	};

	

Lourah.blockchain.Block.prototype
     .mineBlock = function(difficulty, startNonce) {
     	this.nonce = startNonce || 1;
     	if (difficulty === 0) return;
		target = "0".repeat(difficulty);
		while(this.hash.substring( 0, difficulty) !== target) {
			this.nonce ++;
			this.hash = this.calculateHash();
		}
	};

Lourah.blockchain.Block.prototype
     .mineBlockBitcoin = function(difficulty, startNonce, fProgress) {
     	this.nonce = startNonce || 1;
     	if (difficulty === 0) return;
		target = "0".repeat(difficulty);
		while(this.hash.substring( 0, difficulty) !== target) {
			if (fProgress !== undefined) fProgress(this);
			this.nonce ++;
			this.hash = this.calculateHash(this.calculateHash()
                              ,{msgFormat : 'hex-bytes'});
		} 
	};


Lourah.blockchain.Block.prototype
   .toString = function() {
   	return "Lourah.blockchain.Block::" + JSON.stringify(this);
   	}


if (typeof module != 'undefined' && module.exports)  
  module.exports = {
  	Block: Lourah.blockchain.Block
  	};
 
