
const express = require('./Node/express');
//const fs = require('fs');

var app = express();
var workspace = express.Router();

workspace.get('/:tst', (req, res) => {

		var answer = "";
		
			console.log("req.params:"
				+ JSON.stringify(req.params));
				res.sendFile(
				 req.params.tst
					, {
						root : __dirname
						}
					);
			
			try {
				} catch(e) {
					res.send(e);
				}
			
			}
	);
	
app.use(express.static(__dirname + "/.."));

app.use("/ws", workspace);
app.get("*", (req, res) => {
	res.send("access denied !");
	}
);


app.listen(3000, function () {
  console.log('Example app listening on port 3000! at ' + __dirname)
});
