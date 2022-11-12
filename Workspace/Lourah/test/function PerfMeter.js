console.log("test");
function goFat() {
	 	for (var i = 0; i < 1000000; i++) {
	 		 var v = (a)=> a ===1?1:v((a|0)-1);
	 		  v(3|0);
	 		 } 
	 } 
function goTraditional() {
	 for (var i = 0; i < 1000000; i++) {
	 	 var v = function (a) {
	 	    return a===1?1:v((a|0)-1);
	 	    };
	 	 
	 	 v(3|0); 
	 	 }
	 }
	 
 function race() { 
 	var start = performance.now();
 	 goTraditional();
 	 console.log('Traditional elapsed: ' + (performance.now() - start));
 	  start = performance.now();
 	   goFat();
 	   console.log('Fat elapsed: ' + (performance.now() - start)); 
 	  start = performance.now();
 	  goTraditional();
 	   console.log('Traditional elapsed: ' + (performance.now() - start));
 	   start = performance.now();
 	   goFat()
 	    console.log('Fat elapsed: ' + (performance.now() - start)); console.log('------'); }
 	    
race();
