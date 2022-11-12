console.log("Lourah.base.Thread::load");

var Lourah = Lourah || {};
Lourah.base = Lourah.base || {};



Lourah.base.Thread = function (f, poolSize, maxQueue) {
	  this.pool = Array(poolSize || 1);
	  this.maxQueue = maxQueue || 5;
	  var name = f;
	  var url = f;
	  if (typeof f === "function") {
		   var blob = new Blob(['(' + f.toString() + ')();'], {type: "application/javascript"});
           console.log("blob:" + blob);
           url = window.URL.createObjectURL(blob);
           name = f.name;
        this.toString = function () {
        	return name;
        	}
		}
	
	  for(var i = 0; i < this.pool.length; i++) {
		var w = new Worker(url);
		this.pool[i] = {
			worker :  w
			, state : -1
			, instance : i
			};
		}
	
      
	  //this.w = new Worker(url);
}

Lourah.base.Thread.prototype.run = function(handler) {
	
	for(var p = 0; p < this.pool.length; p++) {
	     var w = this.pool[p];
	     
	     if (w === undefined) throw "Lourah.base.Thread::run::" + w + ": is not created";
		try {
		       w.worker.onmessage =  e=> { 
                  handler.resolve(e);
                  w.state--;
                  }
               w.worker.onerror = e => {
                 handler.reject(e);
                  w.state--;
              	}
		       w.state = 0;
		    } catch(e) {
			   handler.reject(e);
			}
	   }
}

Lourah.base.Thread.prototype.fire = function(event) {
	//if (this.w === undefined) throw `Lourah.base.Thread::fire::cannot fire (${event}), thread is not initialized`;
	
	for(var queue = 0; queue < this.maxQueue; queue++) {
	  for(var i = 0; i< this.pool.length; i++) {
	      if (this.pool[i].state === queue) {
	         this.pool[i].worker.postMessage({input: event, instance: i});
	         this.pool[i].state++;
	         return;
	        }
	     }
	  }
	 throw "Lourah.base.Thread::fire::All queues are full " + this.maxQueue + " while firing " + event;
	}
	
Lourah.base.Thread.prototype.shutdown = function() {
	for(var i = 0; i < this.pool.length; i++) {
	     this.pool[i].worker.terminate();
	     this.pool[i].worker= undefined;
	     this.pool[i].state = -1;
	     }
	}

console.log("Lourah.base.Thread::loaded");

