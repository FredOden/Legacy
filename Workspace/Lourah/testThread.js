var fThread = n => {
  self.onmessage = (e) => {
   var r = 1;
   var n = e.data.input;
   if (n < 1) throw "illegal value for input (" + JSON.stringify(e.data) + "): must be >= 1";
   for(var k = 1; k <= n; k++) { r = k / r; }
   self.postMessage({input: e.data, result:r});
   }
  };

var fHttpRequest = () => {
    
  
    self.onmessage = (e) => {
    try {
    var url = e.data.input.url
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function() {
      if (request.status == 200) {
        self.postMessage({response: request.response}); // we got data here, so resolve the Promise
      } else {
        self.postMessage({error: request.statusText}); // status is not 200 OK, so reject
      }
    };

    request.onerror = function() {
      self.postMessage({error: 'Error fetching data.'}); // error occurred, reject the  Promise
    };

    request.send(); //send the request
   } catch(err) {
     self.postMessage({error: err});
   }
  }
 }

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
    var nonce = e.data.input.nonce;
    var bloc = new self.Lourah.blockchain.Block(key, "0");
    bloc.mineBlockBitcoin(difficulty, nonce, (b) => {
      if (b.nonce % 100000 == 0) {
        self.postMessage({progress : b});
        }
      });
    bloc.duration = ((new Date()).getTime() - start)/1000;
    self.postMessage({input : e.data, rate: (bloc.nonce - nonce)/bloc.duration, result : bloc});
    }
  };

var handler={
    resolve : (e) => { doLog("Thread::" + "" + "::Resolved::" + JSON.stringify(e.data)); }
   ,reject : (e) => { doLog("Thread::::Error::" + JSON.stringify(e.message) + ", at line:" + e.lineno + " in file:" + e.filename);}
   };


var miner = new Lourah.base.Thread(fMiner, 4);

miner.run(handler);

let difficulty = 4;
let loop = 4;
let nonce = 40000; // 0*1200000;

for (let i = 0; i < loop; i++) {
  miner.fire({root:  "http://127.0.0.1:3000/Lourah/" ,key : "miner(" + difficulty + ")[" + i + "]", difficulty : difficulty, nonce : nonce});
  }

var http = new Lourah.base.Thread(fHttpRequest, 1);
http.run(handler);
for(let j = 0; j < 3; j++) {
  http.fire({url: 'http://api.icndb.com/jokes/random'});
  }

/*
var t = new Lourah.base.Thread(fThread,5);


t.run({
    resolve : (e) => { doLog("Thread::" + t + "::Resolved::" + JSON.stringify(e.data)); }
   ,reject : (e) => { doLog("Thread::" + t + "::Error::" + JSON.stringify(e.message) + ", at line:" + e.lineno + " in file:" + e.filename);}
   }
   )
   ;


t.fire(2000000);
t.fire(10000);
t.fire(45);
t.fire(-4);
t.fire(2);
*/


//t.shutdown();
doLog("end");

JSON.stringify(miner);
