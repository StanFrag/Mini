var Factory = function(Schema,mongoose, Q) {

    this.Schema = Schema;
    this.mongoose = mongoose;
    this.Item = null;

    this.createSchemas = function() {

        // Création du schéma pour les ennemies
		EnnemieSchema = new this.Schema({
			title : String,
			description : String,
			levelMin: { type: Number, min: 1 },
			levelMax: { type: Number, min: 1 },
			life: { type: Number, min: 1 },
			speed: { type: Number, min: 1 },
			mass: { type: Number, min: 0 },
			specialAptitude: [],
			dateCreation : { type : Date, default : Date.now },
			dateModification : { type : Date, default : Date.now }
		});

		// Création du schéma pour les elements de map
		mapElementSchema = new this.Schema({
			title : String,
			description : String,
			life: { type: Number, min: 1 },
			gameId: { type: Number, min: 0 },
			specialOptions: [],
			specialAptitude: [],
			dateCreation : { type : Date, default : Date.now },
			dateModification : { type : Date, default : Date.now }
		});

		// Création du Model pour les commentaires
		this.Ennemie = mongoose.model('ennemie', EnnemieSchema);
    }

    this.insertStaticData = function() {
    	
    	// On crée une instance du Model
		var walkerBasique = new this.Ennemie({ title : 'Walker basique' });
		walkerBasique.description = 'Premier ennemie, marcheur normal, basique.';
		walkerBasique.levelMin = 1;
		walkerBasique.life = 3;
		walkerBasique.speed = 10;
		walkerBasique.mass = 1;

		var walkerRapide = new this.Ennemie({ title : 'Walker rapide' });
		walkerRapide.description = 'Second ennemie, marcheur rapide.';
		walkerRapide.levelMin = 1;
		walkerRapide.life = 3;
		walkerRapide.speed = 25;
		walkerRapide.mass = 1;

		// On le sauvegarde dans MongoDB !
		walkerBasique.save();
		walkerRapide.save();
    }

    this.getEnnemies = function(query) {

    	var deferred = Q.defer();

        this.Ennemie.find(query,function(error,output) {
        	if(error){
        		console.log("[ERROR]- ", error);
        		deferred.reject(error);
        	}else{
        		deferred.resolve(output);
        	}
        });

        return deferred.promise;
    }

    this.getOneEnnemie = function(query) {

    	var deferred = Q.defer();

        this.Ennemie.findOne(query,function(error,output) {
        	if(error){
        		console.log("[ERROR]- ", error);
        		deferred.reject(error);
        	}else{
        		deferred.resolve(output);
        	}
        });

        return deferred.promise;
    }
}

module.exports = Factory;