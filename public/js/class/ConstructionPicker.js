var ConstructionPicker = function(game){
	_constructionState = game;
	_current = this;

	this.listSprite = null;

	_current.spriteArray = [];
	_current.idTileArray = [];
	_current.mainScreen = null;

	_current.currentTile = 0;

	this.create();
};
  
ConstructionPicker.prototype = {
	preload: function(){

	},

  	create: function(){
  		socket.emit('construction.getPicker');
	},

	createGui: function(tile){

		EZGUI.Theme.load(['json/gui/test.json'], function () {

			// Avant la creation du gui
			// on modifie la width du picket
  			guiConstruction.width = _constructionState.width;
  			guiConstruction.children[0].width = _constructionState.width - 30;

  			// Recuperation de la list du gui
  			var list = guiConstruction.children[0].children;

  			// Pour chaque tuile recuperé
  			for(var i= 0; i < tile.length; i++){
  				// On recupere l'index de la tuile
  				var idTile = tile[i].tile_number;

  				// On crée un element dans la gui pour cette tuile
  				list.push({ id: idTile, component: 'Button', position: 'center', width: 90, height: 120, text: tile[i].name });

  				// Puis on push sont index dans le tableau des index de tuile
  				_current.idTileArray.push(idTile);
  				console.log(_current.idTileArray)
  			}

  			// On crée le gui element
		    _current.mainScreen = EZGUI.create(guiConstruction, 'metalworks');
		    // Recuperation du gui crée
		    var main = EZGUI.components.main;
		    // Placement du picker en bas de jeu
		    var gameHeight = _constructionState.height - main.height;
		   	main.y = gameHeight;
		   	
		   	_current.createOnClick();
		});

	},

	update: function(){
		this.socketReception();
	},

	createOnClick: function(){
		var tmpComponent = EZGUI.components;

		// Pour chaque composant du gui
		for(var t in tmpComponent){
			// Gui n'est pas un des elements suivant
			if(t != "main" && t != "hlist1" && t != "ttl"){
				// On recupere l'objet
				var obj = this.accessProperties(tmpComponent, t);

				// Et on crée un event click dessus
				obj.on('click', function (event) {
					// A chaque clique on modifie la variable global de tuile courante
	                _current.currentTile = obj.Id;
	            });
			}
		}
	},

	accessProperties: function(object, string){
	   var explodedString = string.split('.');
	   for (i = 0, l = explodedString.length; i<l; i++){
	      object = object[explodedString[i]];
	   }
	   return object;
	},

	socketReception: function(){
		socket.on('construction.getPicker', function(data){
			console.log("data: ",data);
			_current.createGui(data);
		});
	},

	getCurrentTile: function(){
		return _current.currentTile;
	},

	hide: function(){
		//_current.destroy();
		_current.mainScreen.visible = false;
	}
}