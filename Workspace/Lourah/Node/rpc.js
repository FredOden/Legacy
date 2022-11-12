/*
 * Remote Procedure Call - RPC
 * (c) 2018 Lourah
 *
 * usage:
      rpc = require("rpc");
      r1 = require("rpc").use("App1.rpc");
      r2 = rpc.use("App2.rpc");
      
      r1.call(method, param)
         .then(...)
         .catch(...);
 
 */

var Lourah = Lourah || {};
Lourah.nodejs = Lourah.nodejs || {};

Lourah.nodejs.rpc = {};

Lourah.nodejs.rpc._ = {
   name : 'Lourah.nodejs.rpc',
   description : 'Remote Procedure Call - RPC (c) 2018 Lourah',
   version: '1.0.0',
   repositories: [],
   use : (repository) => {
   	},
   check: () => {
   	if (Lourah.nodejs.rpc._.repository === undefined) {
		throw Lourah.nodesjs.rpc._.name + ":" + "repository is undefined";
		}
   	}
	};

Lourah.nodejs.rpc.Repository = function(name) {
	this.name = name;
	this.create = () => {
		// @implement
		}
	this.destroy = () => {
		// @implement
		}
	this.has = (method) => {
		// @implement
		return false;
		}
	this.add = (method) => {
		// @implement
		}
	this.remove = (method) => {
		// @implement
		}
	this.describe = (method) => {
		// @implement
		}
	this.call = (method, parameters) => {
		// @implement
		}
	}

Lourah.nodejs.rpc.Rpc = function(repository) {
	}

try {
 var fs = require('fs');
 } catch(e) {
 	throw Lourah.nodejs.rpc._.name + ':' + e;
 }

Lourah.nodejs.rpc.init = function(repository) {
	Lourah.nodejs.rpc._.repository = repository;
	}

Lourah.nodejs.rpc.register = function(method, type) {
	 Lourah.nodejs.rpc._.check();
		
	return new Promise(resolve => {
		
      });
	}




Lourah.nodejs.rpc.exports = {
	_ : Lourah.nodejs.rpc._,
	register : Lourah.nodejs.rpc.register,
	init : Lourah.nodejs.rpc.init,
	};
	
	

module.exports = Lourah.nodejs.rpc.exports;

/*EOF*/
