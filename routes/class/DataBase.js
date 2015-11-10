// Constructor
function DataBase(model, Q) {
 	// always initialize all instance properties
  	this.model = model;
  	this.Q = Q;
}

// class methods
DataBase.prototype.getConstructionTiles = function() {

	var deferred = this.Q.defer();

	this.model.tileModel.find(null, function (err, result) {
	  if (err) { deferred.reject(err); }
	  deferred.resolve(result);
	});

	return deferred.promise;
};

DataBase.prototype.getTiles = function() {

	var deferred = this.Q.defer();

	this.model.tileModel.find(null, function (err, result) {
	  if (err) { deferred.reject(err); }
	  deferred.resolve(result);
	});

	return deferred.promise;
};

DataBase.prototype.getEnnemisByLevel = function(level) {

	var deferred = this.Q.defer();

	this.model.ennemiModel.find( { min_level : { $lte: level }, max_level : { $gte: level} }, function (err, result) {
	  if (err) { deferred.reject(err); }
	  deferred.resolve(result);
	});

	return deferred.promise;
};


// export the class
module.exports = DataBase;