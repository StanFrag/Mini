var room = function(game){
	_current = this;
	this.elementArray = [];
	this.room = null;
};
  
room.prototype = {

	init: function(room){
		this.room = room;
	},

	preload: function(){
		// Permet de rester en focus sur le jeu quand le joueur unfocus la page
		this.game.stage.disableVisibilityChange = true;
	},

  	create: function(){
  		// On envoi au serveur qu'un nouveau player a rejoint la salle
  		this.sendNewPlayer();

  		// On lance la reception des sockets
  		this.socketReception();
  		// Et on crée les infos lié a la room
  		this.createInfoRoom();
	},

	sendNewPlayer: function(){
		// On emit au serveur qu'un nouveau player a join la room
		socket.emit('newPlayerJoinedRoom', this.room);
	},

	socketReception: function(){
		socket.on('newRoomReceived', function(room){
			// On reatribu la room recu a la room de la page client
			this.room = room;
			// Puis on supprime les instances de l'ancienne room pour ensuite les recréer avec la new room
			_current.removeListPlayers();
			_current.createListPlayers(room);
		});

		socket.on('receiveBeginGame', function(room){
			_current.game.state.start("Play", true, false, room);
		});
	},

	createInfoRoom: function(){

		var bmd = this.game.add.bitmapData(200, 200);

		input = new CanvasInput({
		  canvas: bmd.canvas,
		  fontSize: 12,
		  fontFamily: 'Arial',
		  fontColor: '#212121',
		  fontWeight: 'bold',
		  width: 300,
		  padding: 8,
		  borderWidth: 1,
		  borderColor: '#000',
		  borderRadius: 3,
		  boxShadow: '1px 1px 0px #fff',
		  innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
		  value: this.room.idRoom
		});

		var inputButton = this.game.add.button(this.world.centerX, 50, bmd, function(){input.focus()}, this);
		inputButton.anchor.set(1, 0.09);

		this.createListMaps();

		/*
		var infoIdRoom = this.game.add.text(this.world.centerX, 50, "Id de la partie: " + this.room.idRoom, { font: "12pt Arial", fill: "#FFFFFF", align: "center" });
		infoIdRoom.inputEnable = true;
		infoIdRoom.anchor.set(0.5);
		*/
	},

	createListMaps: function(){
		for(var i = 0; i < this.room.listMaps.length; i++){
			var tmp = this.game.add.text(this.world.centerX, this.world.height - 200 + (i * 5), room.listMaps[i]['title'], { font: "16pt Arial", fill: fillButton, align: "center" });
			tmp.anchor.set(0.5);

			tmp.events.onInputDown.add(this.chooseMap, {room: room});
			tmp.events.onInputOver.add(this.over, this);
			tmp.events.onInputOut.add(this.out, this);

			this.elementArray.push(tmp);
		}
	},

	createLancementButton: function(room){

		var fillButton = "#a3a3a3";
		var allReady = true;

		// Pour chaque players
		for(var u = 0; u < room.players.length; u++){
			// Si l'un n'est pas ready on le precise
			if(!room.players[u].ready){
				// Le jeu ne peux pas etre lancé
				allReady = false;
			}
		}

		// Si tout les joueurs sont ready on peu crée un bouton vert
		if(allReady){
			fillButton = "#1cd434";
		}

		var lancementButton = this.game.add.text(this.world.centerX, this.world.height - 100, "Lancer", { font: "16pt Arial", fill: fillButton, align: "center" });
		lancementButton.anchor.set(0.5);

		// Si tout les joueurs sont ready
		if(allReady){

			// Et si le client est le createur de la partie
			if(room.players[0].idPlayer == USER_ID){
				lancementButton.inputEnabled = true;
				lancementButton.events.onInputDown.add(this.lancementPartie, {room: room});
				lancementButton.events.onInputOver.add(this.over, this);
				lancementButton.events.onInputOut.add(this.out, this);
			}
		}

		this.elementArray.push(lancementButton);

	},

	createReadyButton: function(room, currentPlayer){

		var readytext;
		
		// Si le player est ready on crée un bouton vert
		if(room.players[currentPlayer].ready){
			readytext = this.game.add.text(this.world.centerX + 100, 200 + (40 * currentPlayer), 'Ready', { font: "12pt Arial", fill: "#1cd434" });
		}else{
			readytext = this.game.add.text(this.world.centerX + 100, 200 + (40 * currentPlayer), 'Ready', { font: "12pt Arial", fill: "#a3a3a3" });
		}

		// Si le client est le proprietaire de cette id, on enable le bouton ready
		if(room.players[currentPlayer].idPlayer == USER_ID){
			readytext.inputEnabled = true;
			readytext.events.onInputDown.add(this.changeReadyState, {currentRoom: room});
		}

		this.elementArray.push(readytext);
	},

	createListPlayers: function(room){

		// Pour chaque player de la liste
		for(var i = 0; i < room.players.length; i++){

			var text = this.game.add.text(50, 200 + (40 * i), (i + 1) + ". " + room.players[i].idPlayer, { font: "12pt Arial", fill: "#FFFFFF"});

			this.createReadyButton(room, i);

			this.elementArray.push(text);
		}

		this.createLancementButton(room);
	},

	removeListPlayers: function(){
		for(var i = 0; i < this.elementArray.length; i++){
			this.game.world.remove(this.elementArray[i]);
		}
	},

	changeReadyState: function(currentRoom){
		socket.emit('changeReadyState', this.currentRoom);
	},

	over: function(item) {
	    item.scale.set(1.1);
	},

	out: function(item) {
	    item.scale.set(1);
	},

	lancementPartie: function(room) {
		socket.emit('beginGame', this.room);
	},

	chooseMap: function(room) {
		socket.emit('activeMap', this.room);
	},
}