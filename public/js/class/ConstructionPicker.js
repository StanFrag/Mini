var ConstructionPicker = function(game){
	_constructionState = game;
	_current = this;

	this.listSprite = null;

	this.spriteArray = [];
	this.idTileArray = [];

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

  			guiConstruction.width = _constructionState.width;
  			guiConstruction.children[0].width = _constructionState.width - 30;

  			var list = guiConstruction.children[0].children;

  			for(var i= 0; i < tile.length; i++){
  				var idTile = tile.tile_number;
  				list.push({ id: idTile, component: 'Button', position: 'center', width: 90, height: 120 });
  				_current.idTileArray.push(idTile);
  			}

		    mainScreen = EZGUI.create(guiConstruction, 'metalworks');

		    var main = EZGUI.components.main;

		    var gameHeight = _constructionState.height - main.height;

		   	main.y = gameHeight;

		   	_current.initSprites();
		});

	},

	update: function(){
		this.socketReception();
		this.updateSprites()
	},

	initSprites: function(){
		for(var i=0; i < _current.idTileArray.length; i++){
			_current.spriteArray[_current.idTileArray[i]] = _constructionState.add.tileSprite(0, 0, 32, 32, 'constructionTiles', 31);
		}
	},

	updateSprites: function(){
		for(var i=0; i < _current.idTileArray.length; i++){

			var tmp = _current.idTileArray[i];
			var obj = EZGUI.components.tmp;

			console.log(EZGUI.components.hlist1);
			console.log(obj);

			_current.spriteArray[t].x = obj.x;
			_current.spriteArray[t].y = obj.y;
		}
	},

	socketReception: function(){
		socket.on('construction.getPicker', function(data){
			console.log(data);
			_current.createGui(data);
		});
	}
}