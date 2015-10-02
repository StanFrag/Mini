Map = function(game){
	this.game = game;
	this.map = null;

	this.create();
};
  
Map.prototype = {

	preload: function(){
	},

  	create: function(){
  		this.map = this.game.add.tilemap('map');

	    this.map.addTilesetImage('TileSet', 'tiles');

	    this.map.setCollisionBetween(1, 12);

	    layer = this.map.createLayer('Ground');

	    layer.resizeWorld();
	},

	update: function(){

	},
}