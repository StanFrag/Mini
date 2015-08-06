var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/One', function(err) {
  if (err) { throw err; }
});

// Création du Model pour les commentaires
var ennemieModel = mongoose.model('ennemies');
 
// On crée une instance du Model
var tmpEnnemie = new ennemieModel({ title : 'walkerBasique' });
tmpEnnemie.description = 'Premier ennemie, marcheur normal, basique';
tmpEnnemie.levelMin = 1;
tmpEnnemie.life = 3;
tmpEnnemie.speed = 10;
tmpEnnemie.mass = 1;

// On le sauvegarde dans MongoDB !
tmpEnnemie.save(function (err) {
  if (err) { throw err; }
  console.log('Commentaire ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});