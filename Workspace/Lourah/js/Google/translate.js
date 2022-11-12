console.log("translate");
/*
curl -s -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
    --data "{
  'q': 'The Great Pyramid of Giza (also known as the Pyramid of Khufu or the
        Pyramid of Cheops) is the oldest and largest of the three pyramids in
        the Giza pyramid complex.',
  'source': 'en',
  'target': 'es',
  'format': 'text'
}" "https://translation.googleapis.com/language/translate/v2"
*/


var Lourah = Lourah || {};
if (Lourah.httpRequest === undefined) throw "Lourah httpRequest required (base)";
console.log("loading Lourah.Google.translate::" 
   + JSON.stringify(Lourah) );
Lourah.Google = Lourah.Google || {};
Lourah.Google.translate = {};
Lourah.Google.translate.api = 
   "https://translation.googleapis.com/language/translate/v2";
/*
var http = new XMLHttpRequest();
var url = 'get_data.php';
var params = 'orem=ipsum&name=binny';
http.open('POST', url, true);

//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
    }
}
http.send(params);
*/

Lourah.Google.translate.request = (q, source, target, format) => {
	
	var query = {
		 q:q
		, source:source
		,target:target
		,format:format
	}
	console.log("translate.request::" + 
	   JSON.stringify(query));
	
    return Lourah.httpRequest({
       url:Lourah.Google.translate.api
      ,method:"POST"
      ,body:JSON.stringify(query)
      ,headers: {
      	"Content-Type": "application/json"
         ,"Authorization": "key"
       //   ,"Content-Type": 'text/plain; charset="utf-8"'
      	}
    });
}

