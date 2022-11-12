/*
 * Lourah rpc repository framework
 
    var m = new Lourah.rpc.Method(
       'method'
       , { name : ['string', 'required']
           , mail : ['string']
           }
        , input => {
        	return "done"
        	}
    );
    
    repository.addMethod(m);
    
   
    var JsonResponse =
     reposirory.methods['method'].call(JsonData);
 
 
 */
var Lourah = Lourah || {};
Lourah.rpc = Lourah.rpc || {};

Lourah.rpc.validateInput = (input) => {
	}

Lourah.rpc.Repository = function(name) {
	this.name = name;
	this.methods = {};
	}
	
Lourah.rpc.Repository.prototype.addMethod(method) {
	if (this.method[method.name] === undefined) {
	    this.method[method.name] = method;
	     }
	else {
		throw `Lourah.rpc.Repository(${this.name}): cannot add Lourah.rpc.Method(${method}) : already exists !`;
		}
	}
	
Lourah.rpc.Method = function(name, input, body) {
	Lourah.rpc.validateInput(input);
	this.name = name;
	this.input = input;
	this.body = body;
	};
	
Lourah.rpc.Method.prototype.call = function(input) {
	// validate input
	var in = JSON.parse(input);
	return JSON.stringify(body(in));
	};
	
