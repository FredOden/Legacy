
const express = require('express');
const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const axios = require('axios');
const www = express.Router();
const rpc = require('./rpc');

const $SITES$ = [];

const app = express();
const HW = {
	head : "<head></head>",
	body : {
		      b : "<body><h1>",
		      e : "</h1></body>"
		      },
	html : {
		      b : "<html>",
		      e : "</html>"
		      }
	}
	
rpc.init("./zz.rpc");
rpc.register("a", "b");
	
	
function Site(url) {
	if ($SITES$[url] === undefined) {
   	this.url = url;
	  $SITES$[url] = this;
	  return this;
	  }
	return $SITES[url];
	}
	
	Site.get = function(url) {
		return $SITES$[url];
	}
	
	Site.prototype.setHtml = function(html) {
		this.html = html;
		this.$ = cheerio.load(this.html);
	}



function loadUrl(url, req, res, send) {
	axios
	  .get(url)
	  .then(answer => {
	  	  send(answer.data);
	  	}). catch(err => {
	  		 send("Axios.get("
	  		 	+ url
	  		 	+ ")::Error::"
	  		 	+ err
	  		 	);
	  	});
	}

function cachedLoadUrl(url, req, res) {
	var site;
			if ((site = Site.get(url)) === undefined) {
			  site = new Site(url);
	  		loadUrl(url, req, res, 
		  		answer => {
		  			site.setHtml(answer);
				  	res.send(answer);
					 });
			} else {
				 console.log("cached::");
				 res.send(site.html);
			}
	}

app.use((req, res, next) => {
	console.log("check:" + req.url);
	next();
	});
	
	
var where;
	
www.use("/",
	(req, res, next) => {
 	res.target = {
		 	url : req.url
			  .replace(/:/g, "/")
			  .replace(/^\//, "https://")
			};
			next();
		});

www.get('/:url', (req, res) => {

		var answer = "";
		
			console.log("target:"
				+ JSON.stringify(res.target));
			
			where = res.target.url;
  cachedLoadUrl(where, req, res);
			
	}
	);

app.use("/www", www);
app.use("/http", www);
//app.use("/rpc", rpc);

app.get('*', (req, res) => {
	cachedLoadUrl(where + req.url, req, res);
	});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
  console.log('Using:' + JSON.stringify(rpc));
})
