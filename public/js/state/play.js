var play = function(game){
	this.room = null;
	this.playersArray = [];
};
  
play.prototype = {

	// Fonction de base permettant de recuperer les parametres du state precedent
	init: function(currentRoom){
		this.room = currentRoom;
	},

	// Preload de l'ensemble des elements necessaire au jeu
	preload: function(){
		// Permet de rester en focus sur le jeu quand le joueur unfocus la page
		this.game.stage.disableVisibilityChange = true;
	},

	// Initialisation de l'ensemble des elements du jeu
  	create: function(){
  		console.log("dans play: ",this.room);
  		this.initMap();
  		this.initPlayers();
	},

	// Loop du jeu
	update: function(){
		this.updatePlayers();
	},

	// Rendu des debugs
	render: function(){
		/*
		currentGame.debug.text(currentGame.time.suggestedFps, 32, 32);
		currentGame.debug.text(currentGame.time.physicsElapsed, 32, 52);
		*/
	},

	updatePlayers: function(){
		for(var i = 0; i < this.playersArray.length; i++){
			this.playersArray[i].update();
		}
	},

	initMap: function(){

	},

	initPlayers: function(){

		for(var i = 0; i < this.room.players.length; i++){
			var colorPlayer = '#828282';

			if (this.room.players[i].idPlayer == USER_ID) {
				colorPlayer = '#29BA2B';
			};

			var user = new User(this.game, {x: 150 + (i * 60), y: this.world.centerY}, colorPlayer);
			this.playersArray.push(user);
		}
	},
}