var Models = function(mongoose, Q, schema) {

    this.mongoose = mongoose;
    this.schema = schema;
    this.promise = Q;
    this.models = {};

    // Récuperation des models
    this.getModels = function() {
    	// On liste les differents modeles mis en place
		this.models.mapModel = this.mongoose.model('map', schema.mapSchema);
        this.models.tileModel = this.mongoose.model('tile', schema.tileSchema);
        this.models.ennemiModel = this.mongoose.model('ennemi', schema.ennemiSchema);

		return this.models;
    }

}

module.exports = Models;