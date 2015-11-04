Map = function(game){
	this.game = game;
	this.map = null;
	this.layer = null;

	this.create();
};
  
Map.prototype = {

	preload: function(){
	},

  	create: function(){
  		this.map = this.game.add.tilemap('map');

	    this.map.addTilesetImage('TileSet', 'tiles');

	    this.map.setCollisionBetween(31, 32);
	    this.map.setCollisionBetween(38, 40);
	   	this.map.setCollisionBetween(46, 48);

	    this.layer = this.map.createLayer('Ground');

	    this.layer.resizeWorld();
	},

	update: function(){

	},

	getLayer: function(){
		return this.layer;
	},

	getMap: function(){
		return this.map;
	},
}