var Lourah = Lourah || {};
Lourah.gravity = Lourah.gravity || {};
Lourah.gravity.G = 6.67408e-11;
Lourah.gravity.DAY = 24 * (Lourah.gravity.HOUR = 60 * (Lourah.gravity.MINUTE = 60));
Lourah.gravity.CORPUS = [];

Lourah.gravity.Corpus = function(name, weight, radius, rotationDuration) {
	this.name = name;
	this.weight = weight;
	this.radius = radius;
	this.rotationDuration = rotationDuration;
	this.rotationSpeed = Math.PI*2/this.rotationDuration;
	this.volume = (Math.PI*4/3)*this.radius*this.radius*this.radius;
	this.density = this.weight/this.volume;

  Lourah.gravity.CORPUS.push(this);
	
	this.g = function(d) {
		return Lourah.gravity.G * weight/((radius + d)*(radius + d));
	};
	
	this.gGround = function(latitude) {
		return this.g(0) - (this.rotationSpeed*this.rotationSpeed)*radius*Math.cos(latitude*Math.PI/180);
	}
	
	this.fCentrifuge = function(corpus, angularSpeed, altitude) {
	 return	corpus.weight * (angularSpeed*angularSpeed)*(altitude);
	};
	
	this.fGravitation = function(corpus, distance) {
		return Lourah.gravity.G  * this.weight*corpus.weight/(distance * distance);
		//return this.g(distance - corpus.radius - this.radius)*corpus.weight;
	}
	
	this.fOrbitalRadius = function (period) {
		return Math.cbrt(Lourah.gravity.G  * this.weight
		            / ( (period*period)));
		}

    this.corpus = null;
    this.period = 0;
    this.satellites = [];
    var orbitalRadius = undefined;

	this.attachTo = function(corpus, revolution) {
		this.name = this.name + "->(" + corpus.name + ")";
		this.corpus = corpus;
		this.revolution = revolution;
		this.period = Math.PI*2/revolution;
		corpus.satellites.push(this);
		corpus.satellites.sort((a, b) => {
			return a.getOrbitalRadius() - b.getOrbitalRadius();
            });
		}
		
	this.getOrbitalRadius = function() {
		if (this.corpus !== null && orbitalRadius === undefined) {
			orbitalRadius = this.corpus.fOrbitalRadius(this.period);
			}
	    return orbitalRadius;
		}
}



