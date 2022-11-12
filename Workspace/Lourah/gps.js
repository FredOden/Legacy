if(navigator.geolocation) {
	function surveillePosition(position) {
    var infopos = "Position déterminée :\n";
    infopos += "Latitude : "+position.coords.latitude +"\n";
    infopos += "Longitude: "+position.coords.longitude+"\n";
    infopos += "Altitude : "+position.coords.altitude +"\n";
    infopos += "Vitesse  : "+position.coords.speed +"\n";
    document.getElementById("infoposition").innerHTML = infopos;
}

// On déclare la variable survId afin de pouvoir par la suite annuler le suivi de la position
var survId = navigator.geolocation.watchPosition(surveillePosition);
  // L'API est disponible
} else {
  // Pas de support, proposer une alternative ?
  document.getElementById("infoposition").innerHTML = "geolocalisation::unsupported feature";
}