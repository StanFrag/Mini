// Constructor
function DataBase(db) {
 	// always initialize all instance properties
  	this.db = db;
}
// class methods
DataBase.prototype.getMaps = function() {

	var mapCollection = this.db.collection('maps');

	//Lets try to Find a user
	mapCollection.find(null, function (err, map) {
		if (err) { throw err; }
		  // On va parcourir le résultat et les afficher joliment
		  var comm;
		  for (var i = 0, l = map.length; i < l; i++) {
		    comm = map[i];
		    console.log('------------------------------');
		    console.log('Titre : ' + comm.title);
		    console.log('Descri : ' + comm.description);
		    console.log('------------------------------');
		  }
	});
};


// export the class
module.exports = DataBase;