
const express = require('express');
const fs = require('fs');

var app = express();
var workspace = express.Router();

var webAccessDir = __dirname + "/../..";

workspace.get('/:tst', (req, res) => {

		var answer = "";
		
			console.log("req.params:"
				+ JSON.stringify(req.params));
				console.log("req.url:" + req.url);
				res.send(
				 req.params.tst
					);
			
			try {
				} catch(e) {
					res.send("myerror::" + e);
				}
			
			}
	);
	
workspace.use('/file', (req, res, next) => {
	var url = req.url;
	console.log("req.url::" + req.url);
	req.__ctx = {
		path : req.url
		};
		next();
	});

workspace.post('*', (req, res) => {
	  console.log("workspace.post::req.headers::"+JSON.stringify(req.headers));
	  const { ["content-type"]:contentType = "no content" } = req.headers;
	  console.log("content-type::" + contentType);
	  const { url } = req;
	  console.log("url::" + url);


var bodyStr = '';
req.on("data",function(chunk) {
	        bodyStr += chunk.toString(); 
	  });
req.on("end",function(){
	  var body = JSON.parse(bodyStr);
	  console.log("body.filename::\"" + body.filename + "\"");
	  console.log("body.type::\"" + body.type + "\"");
	  console.log("body.content::\"" + body.content + "\"");
	  try {
	  res.send("swallowed::" + eval(body.content));
	  } catch(e) {
	  	res.send("rejected::" + e + "::" + e.stack);
	  	}
	  }
	  
	  );

/*
	  res.send('posted file::"'
	  	  + JSON.stringify(req.__ctx)
	  	  + '"'
	  	  );
	*/
	  }
	
	);
	
	workspace.get('*', (req, res) => {
		 try {
		   var content = fs.readFileSync(
		   	    webAccessDir
		   	  + req.__ctx.path);
	    res.send('got file::"'
	  	    + JSON.stringify(req.__ctx)
	  	    + '"'
	  	    + content
	  	  );
	  	 } catch(err) {
	    res.status(500).send("Error::" + req.__ctx.path + "::" + err);
	  	 }
	  }
	);


	
app.use(express.static(webAccessDir));

app.use("/ws", workspace);

/*
app.get("*", (req, res) => {
	res.sendFile(req.url, {
		root : __dirname + "/../.."
		});
	console.log("*::" + req.url);
	}
);
*/



app.listen(3000, function () {
  console.log('Example app listening on port 3000! at ' + __dirname)
});
