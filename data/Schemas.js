var Schemas = function(mongoose, Q) {

    this.mongoose = mongoose;
    this.promise = Q;
    this.schemas = {};

    // Récuperation des schemas
    this.getSchemas = function() {

		this.schemas.mapSchema = new this.mongoose.Schema({
			title : String,
			description : String,
			life: { type: Number, min: 1 },
			gameId: { type: Number, min: 0 },
			specialOptions: [],
			specialAptitude: [],
			dateCreation : { type : Date, default : Date.now },
			dateModification : { type : Date, default : Date.now }
		});

		return this.schemas;
    }

}

module.exports = Schemas;