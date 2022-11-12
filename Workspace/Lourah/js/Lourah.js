    var Lourah = Lourah || {};

     Lourah.copyright = "¢ 2010-2018 Lourah ";
     Lourah.toggleLog = false;
     
     YConsole.activate(); 
      
     console.log("first intercepted log."); 
     
     YConsole.docking="bottom"; 
     YConsole.MAX_LOG_ARRAY_LENGTH=20; 
     YConsole.MAX_LOG_STR_LENGTH=300; 
         
     Lourah.YConsoleToggleLog = function() {
     	if (YConsole === undefined) return;
     /*
     	if (Lourah.toggleLog === undefined) {

     	}
     */
    	Lourah.toggleLog = !Lourah.toggleLog;
       
        if(Lourah.toggleLog) {

            YConsole.show();
            }
        else YConsole.hide();
    	}

Lourah.logAndThrow = function(msg) {
	console.log(msg);
	throw(msg);
}

Lourah.identify = function () {
	this.version = 1;
	this.release = 0;
	}

Lourah.verbose = -1;
Lourah.log = function(message, verbose) {
	if (verbose === undefined) verbose = 0;
	if (Lourah.verbose >= verbose) {
		console.log(message);
		}
	}
