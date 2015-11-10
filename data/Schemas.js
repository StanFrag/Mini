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

		this.schemas.tileSchema = new this.mongoose.Schema({
			name : String,
			description : String,
			life: { type: Number, min: 1 },
			tile_number: { type: Number, min: 0 },
			construction_enable: Boolean,
			type: String
		});

		this.schemas.ennemiSchema = new this.mongoose.Schema({
			name : String,
			description : String,
			life: { type: Number, min: 1 },
			min_level: { type: Number, min: 1 },
			max_level: { type: Number, min: 1 },
			appear_rate: { type: Number, min: 1, max: 100 },
			path: String,
		});

		return this.schemas;
    }

}

module.exports = Schemas;