Map = function(game, template){
	this.game = game;
	mapTemplate = template;

	sizeOfCube = this.game.world.width / mapTemplate[0].length;
	originLigne = this.game.world.height;

	this.textureRegistry = {};
	this.elementsArray = [];

	this.create();
};
  
Map.prototype = {

	preload: function(){
	},

  	create: function(){

  		for(var ligne = 0; ligne < mapTemplate.length; ligne++){
  			for(var colonne = 0; colonne < mapTemplate[0].length; colonne++){

  				var tmp = mapTemplate[ligne][colonne];

  				switch(tmp) {
				    case 0:
				 		// Vide
				        break;
				    case 1:
				        this.addBlock(ligne, colonne);
				        break;
				} 				
  			}
  		}
	},

	update: function(){

	},

	addBlock: function(currentLigne, currentColonne){

		var color = '0x' + (Math.random()*0xFFFFFF<<0).toString(16);
		var ligne = originLigne - (sizeOfCube * currentLigne) - sizeOfCube;
		var colonne = sizeOfCube * currentColonne;

		var tmpBlock = this.game.add.sprite(
			colonne, 
			ligne
		);

		tmpBlock.addChild(
			this.createBlock(
				sizeOfCube, 
				color
			)
		);

		this.game.physics.arcade.enableBody(tmpBlock);

		tmpBlock.body.allowGravity = false;
		tmpBlock.body.immovable = true;

		this.elementsArray.push(tmpBlock);
	},

	generateFromTemplate: function(){

	},

	createBlock: function(size, color) {
		var graphics = this.game.add.graphics(0, 0);
	    graphics.beginFill(color, 1);
	    graphics.drawRect(0, 0, size, size);
	    return graphics;
	},
}