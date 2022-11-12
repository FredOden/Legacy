Function.prototype.Lourah = { };

Function.prototype.curry = 
 function ()
   {
   	var fn = this;
   	console.log(this)
   	var args = [].slice.call(arguments, 0);
   return function() {
   	    	return fn.apply(this, args.concat([].slice.call(arguments, 0)));
   	    	};
   	}

   	
 function add(a, b) {
 	  return a + b;
 }
 
 function s(str, str2) {
 	 return str + "..." + str2;
 }
 
 addby3 = add.curry(3);
 
 console.log(addby3(5));
 
 hello = s.curry("hello");
 
 console.log(hello("world"));
 
 
