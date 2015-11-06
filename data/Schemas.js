var Schemas = function(mongoose, Q) {

    this.mongoose = mongoose;
    this.promise = Q;
    this.schemas = {};

    // Récuperation des schemas
    this.getSchemas = function() {

		this.schemas.mapSchema = new this.mongoose.Schema({
			title : String,
			description : String,
			gameId: { type: Number, min: 0 },
			specialOptions: [],
			specialAptitude: [],
			dateCreation : { type : Date, default : Date.now },
			dateModification : { type : Date, default : Date.now },
			pathJSON : String
		});

		this.schemas.tilesSchema = new this.mongoose.Schema({
			name : String,
			description : String,
			life: { type: Number, min: 1 },
			tile_number: { type: Number, min: 0 },
			construction_enable: Boolean,
			type: String
		});

		return this.schemas;
    }

}

module.exports = Schemas;