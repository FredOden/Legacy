var Lourah = Lourah || {};
Lourah.blockchain = Lourah.blockchain || {};


Lourah.blockchain.Blockchain =
   function(difficulty) {
	this.difficulty = difficulty;
	this.chain = [];
	console.log(`constructed Blockchain(${difficulty})`);
}
	
Lourah.blockchain.Blockchain.prototype
   .append = function(data) {
   	console.log("append(" + data + ")");
   	var length = this.chain.length;
       this.chain[length] = new Lourah.blockchain.Block(
                 data
                , (length === 0)
                    ? "0"
                    :  this.chain[length - 1]
                          .hash
                );
       if (this.difficulty > 0) {
       	this.chain[length].mineBlock(this.difficulty);
       	}
   };

Lourah.blockchain.Blockchain.prototype
   .toString = function() {
   	var s ="Lourah.blockchain.Blockchain::" + this.chain.length + "::";
       for(var i = 0; i < this.chain.length; i++) {
       	s += this.chain[i] + "<br>";
       	}
       return s;
   	};


if (typeof module != 'undefined' && module.exports)  
  module.exports = {
  	Blockchain: Lourah.blockchain.Blockchain
  	};
  
 