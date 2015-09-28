var Models = function(mongoose, Q, schema) {

    this.mongoose = mongoose;
    this.schema = schema;
    this.promise = Q;
    this.models = {};

    // Récuperation des models
    this.getModels = function() {
    	// On liste les differents modeles mis en place
		this.models.mapModel = this.mongoose.model('map', schema.mapSchema);

		return this.models;
    }

}

module.exports = Models;