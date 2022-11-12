
console.log("Loading Lourah.base.FileSystem");

var Lourah = Lourah || {};
Lourah.base = Lourah.base || {};


console.log("fs::base::" + Lourah.base);

try {

Lourah.base.File = function(filename, fileSystem) {
	
	//console.log("Lourah.base.File::IN::");
	
	this.fileSystem = fileSystem;
	
	var __fullname = this.fileSystem.root() + "/" + filename;
	
	
	
	var __descriptor = -1;
	
    this.fullname = function() { return __fullname; };
	this.descriptor = function() { return __descriptor; };
	
	
	
	this.exists = function() {
		return this.fileSystem.storage()[__fullname] !== undefined;
		};
	
	
	
	this.open = function(mode) {
		if (__descriptor !== -1)  throw new Error(
		    `Already open File::${__fullname}::already opened::${this}`
		   );
		if (mode.match(/[r]/) !== null && !this.exists()) throw new Error(
           `Cannot open for read File::${__fullname}::does not exist!::${this}`
           );
           
        //console.log("open");
        
        for(var d = 0; d <  this.fileSystem.descriptors().length; d++) {
        	if (this.fileSystem.descriptors()[d] === undefined) {
                 __descriptor = d;
                 break;
                 }
        	}
        
        //console.log("open 2");
        
        if (__descriptor === -1) {
        	__descriptor = this.fileSystem.descriptors().length;
            this.fileSystem.descriptors().push(this);
        	} else {
        	this.fileSystem.descriptors()[__descriptor] = this;
        	}
        
        //console.log("open out::" + __descriptor + "," + this);
        return this;
		};
	
	
	
	this.read = function() {
		if (__descriptor === -1) throw new Error(
		    `cannot read File::${__fullname}::not open::${this}`
		  );
		return this.fileSystem.storage()[__fullname];
		};
	
	
	
	this.write = function(buffer) {
		if (__descriptor === -1) throw new Error(
		    `cannot write File::${__fullname}::not open::${this}`
		  );
		this.fileSystem.storage()[__fullname] =  buffer;
		};
	
	
	
	this.close = function () {
		if (__descriptor === -1) throw new Error(
		    `cannot close File::${__fullname}::not open::${this}`
		  );
		this.fileSystem.descriptors()[__descriptor] = undefined;
		__descriptor = -1;
		};
	
	/*
	this.remove = function() {
		if (__descriptor !== -1) throw new Error(
		    `Cannot remove File::${__fullname}::already opened::${this}`
		);
		}
	*/
	
	this.toString = function () {
		return "Lourah.base.File::" + JSON.stringify({
			__descriptor : __descriptor
			,__fullname : __fullname
			,"this.fileSystem.root" : this.fileSystem.root()
          });
		};
};


Lourah.base.File.prototype.load = function() {
	this.open("r");
	var ret = this.read();
	this.close();
	return ret;
	};



Lourah.base.File.prototype.save = function(text) {
	this.open("w");
	this.write(text);
	this.close();
	};


Lourah.base.fs="fs";


Lourah.base.FileSystem = function(root) {
   var __root = root || "";
   this.root = function() { return __root; }
   var __storage = localStorage || {};
  this.storage = function() { return __storage; }
   var __descriptors = [];
   this.descriptors = function() { return __descriptors; }
   var __files ={};
   this.files = function() { return __files; }
   
   var __std = [
         this.getFile("<0>")
        ,this.getFile("<1>")
        ,this.getFile("<2>")
        ];
 
  
  
   __std[0].open("").write("");
   __std[1].open("").write("");
   __std[2].open("").write("");
   
   
   this.stdin = function() { return __std[0]; }
   this.stdout = function() { return __std[1]; }
   this.stderr = function() { return __std[2]; }
    
    
    
   this.toString = function() {
   	return "Lourah.base.FileSystem::"+JSON.stringify({
   	   __root : __root
         ,__storage : __storage
         ,__descriptors : __descriptors
         ,__files : __files
        });
   	};
   
};


Lourah.base.FileSystem.prototype.getFile = function(filename) {
	//console.log("getFile::" + filename);
	if (this.files()[filename] === undefined)  {
	  this.files()[filename] = new Lourah.base.File(filename, this);
	}
	return this.files()[filename];
};

Lourah.base.FileSystem.prototype.$ = 
    Lourah.base.FileSystem.prototype.getFile;
    
Lourah.base.FileSystem.prototype.remove = function(filename) {
	var file = this.files()[filename];
	if (file === undefined)  throw new Error(
	     `Cannot remove FileSystem::${filename}::does not exist::${file}`
	    );
	if (file.descriptor() !== -1)  throw new Error(
	     `Cannot remove FileSystem::${filename}::is in use (open)::${file}`
	    );
    this.files()[filename] = undefined;
    this.storage()[file.fullname()] = undefined;
	}


} catch(e) {
	console.log(e);
}
