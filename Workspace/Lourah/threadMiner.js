var fMiner = () => {

  self.onmessage = (e) => {
   
   if (self.Lourah === undefined) {
     var root = e.data.input.root;
     self.importScripts(
      //"http://127.0.0.1:3000/Lourah/js/Lourah.js"
      root + "Node/sha256.js"
    , root + "Node/Block.js"
    );
   }
    
    var start = (new Date()).getTime();
    var key = e.data.input.key;
    var difficulty = e.data.input.difficulty;
    var bloc = new self.Lourah.blockchain.Block(key, "0");
    bloc.mineBlock(difficulty);
    bloc.duration = ((new Date()).getTime() - start)/1000;
    self.postMessage({input : e.data, rate: bloc.nonce/bloc.duration, result : bloc});
    }
  };
  var handler={
    resolve : (e) => { doLog("Thread::" + "" + "::Resolved::" + JSON.stringify(e.data)); }
   ,reject : (e) => { doLog("Thread::::Error::" + JSON.stringify(e.message) + ", at line:" + e.lineno + " in file:" + e.filename);}
   };


var miner = new Lourah.base.Thread(fMiner, 4);

miner.run(handler);

let difficulty = 5;
let loop = 3;

for (let i = 0; i < loop; i++) {
  miner.fire({root: "http://127.0.0.1:3000/Lourah/" ,key : "miner(" + difficulty + ")[" + i + "]", difficulty : difficulty});
  }
  
  

 
