// Constructor
function DataBase(model, Q) {
 	// always initialize all instance properties
  	this.model = model;
  	this.Q = Q;
}
// class methods
DataBase.prototype.getMaps = function() {

	var deferred = this.Q.defer();

	this.model.mapModel.find(null, function (err, result) {
	  if (err) { deferred.reject(err); }
	  deferred.resolve(result);
	});

	return deferred.promise;
};

DataBase.prototype.getConstructionTiles = function() {

	var deferred = this.Q.defer();

	this.model.tilesModel.find(null, function (err, result) {
	  if (err) { deferred.reject(err); }
	  deferred.resolve(result);
	});

	return deferred.promise;
};

DataBase.prototype.getTiles = function() {

	var deferred = this.Q.defer();

	this.model.tilesModel.find(null, function (err, result) {
	  if (err) { deferred.reject(err); }
	  deferred.resolve(result);
	});

	return deferred.promise;
};


// export the class
module.exports = DataBase;