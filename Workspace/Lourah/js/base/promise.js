function doPromise() {
if (window.Promise) {
  console.log('Promise found');

  var promise = new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
   // var url = "http://www.cadastre.gouv.fr/scpc/wms?version=1.1&request=GetMap&layers=CDIF:LS3,CDIF:LS2,CDIF:LS1,CDIF:PARCELLE,CDIF:NUMERO,CDIF:PT3,CDIF:PT2,CDIF:PT1,CDIF:LIEUDIT,CDIF:SUBSECTION,CDIF:SECTION,CDIF:COMMUNE&format=image/png&bbox=1914063.727741477,4224871.904308877,1914349.126178977,4225075.371183878&width=484&height=345&n=3&exception=application/vnd.ogc.se_inimage&styles=LS3_90,LS2_90,LS1_90,PARCELLE_90,NUMERO_90,PT3_90,PT2_90,PT1_90,LIEUDIT_90,SUBSECTION_90,SECTION_90,COMMUNE_90";
      var url = "http://www.cadastre.gouv.fr" ; // /scpc/";
      var url = 'http://api.icndb.com/jokes/random';
      //var url = "http://0.0.0.0:8080";
 //  request.open('GET', 'http://api.icndb.com/jokes/random');
    request.open('GET', url);
    request.onload = function() {
      if (request.status == 200) {
        resolve(request.response); // we got data here, so resolve the Promise
      } else {
        reject(Error(request.statusText)); // status is not 200 OK, so reject
      }
    };

    request.onerror = function() {
      reject(Error('Error fetching data.')); // error occurred, reject the  Promise
    };

    request.send(); //send the request
  });

  console.log('Asynchronous request made.');

  promise.then(function(data) {
    console.log('Got data! Promise fulfilled.');
    document.getElementById('promise').textContent = data; //JSON.parse(data).value.joke;
  }, function(error) {
    console.log('Promise rejected.');
    console.log(error.message);
  });
} else {
  console.log('Promise not available');
}
}