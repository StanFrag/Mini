var mongoose = require('mongoose');
var Q  = require('q');
var Schemas = require('./Schemas.js');
var Models = require('./Models.js');
 
// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
mongoose.connect('mongodb://ujhgjs0txcun5ze:hRkZYpdk0NR659yITCDn@b6elb6t4b6sm3gf.mongodb.clvrcld.net:27017/b6elb6t4b6sm3gf', function(err) {
  if (err) { throw err; }
});

// SCHEMAS
var schemaFactory = new Schemas(mongoose, Q);
var tmpSchemas = schemaFactory.getSchemas();

// MODELS
var modelFactory = new Models(mongoose, Q, tmpSchemas);
var tmpModels = modelFactory.getModels();

// On crée une instance du Model
var obj = new tmpModels.tilesModel({ name : 'cactus' });

obj.description = 'Salut, je suis un cactus !';
obj.life = 3;
obj.tile_number = 31;
obj.construction_enable = true;

// On le sauvegarde dans MongoDB !
obj.save(function (err) {
  if (err) { throw err; }
  console.log('Données statiques ajouté avec succès.');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});