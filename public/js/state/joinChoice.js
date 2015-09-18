var joinChoice = function(game){
	var input = null,
		errorText = null;
};
  
joinChoice.prototype = {

	preload: function(){
	},

  	create: function(){
  		this.createText();
  		this.createErrorHandler();
  		this.socketReception();	
	},

	socketReception: function(){
		socket.on('joinRoom', function(obj){			
			USER_ROOM = obj.idRoom;
			currentGame.state.start("Room", true, false, obj);
		});

		socket.on('errorReceive', function(err){
			errorText.text = err;
		});
	},

	createErrorHandler: function(){
		errorText = this.game.add.text(
			this.world.centerX, 
			100, 
			"test", 
			{ font: "12pt Arial", fill: "#dd0d0d", align: "center", wordWrap: true, wordWrapWidth: (this.world.width / (2)) }
		);

		errorText.anchor.set(0.5);
	},

	createText: function(){
		
		var joinText = this.game.add.text(
			this.world.centerX, 
			this.world.centerY - 50, 
			"Rejoigne une partie aléatoire", 
			{ font: "18pt Arial", fill: "#FFFFFF", align: "center" }
		);

		joinText.inputEnabled = true;
		joinText.events.onInputDown.add(this.joinRandom, this);
		joinText.events.onInputOver.add(this.over, this);
		joinText.events.onInputOut.add(this.out, this);

		var orText = this.game.add.text(
			this.world.centerX, 
			this.world.centerY, 
			"Ou", 
			{ font: "20pt Arial", fill: "#FFFFFF", align: "center" }
		);

		var linkText = this.game.add.text(
			this.world.centerX, 
			this.world.centerY + 50, 
			"Enter l'id d'une partie:", 
			{ font: "18pt Arial", fill: "#FFFFFF", align: "center" }
		);

		joinText.anchor.set(0.5);
		orText.anchor.set(0.5);
		linkText.anchor.set(0.5);

		this.createLinkInput();
	},

	createLinkInput: function(){
		var offsetInput = 100;

		this.createInput(offsetInput);
		this.createSendButton(offsetInput);		
	},

	createInput: function(offset){
		var bmd = this.game.add.bitmapData(170, 50);

		input = new CanvasInput({
		  canvas: bmd.canvas,
		  fontSize: 14,
		  fontFamily: 'Arial',
		  fontColor: '#212121',
		  fontWeight: 'bold',
		  padding: 8,
		  width: 150,
		  borderWidth: 1,
		  borderColor: '#000',
		  borderRadius: 3,
		  boxShadow: '1px 1px 0px #fff',
		  innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
		  placeHolder: 'Id de la partie...'
		});

		var inputButton = this.game.add.button(this.world.centerX, this.world.centerY + offset, bmd, function(){input.focus()}, this);
		inputButton.anchor.set(1, 0.09);
	},

	createSendButton: function(offset){
		var sendButton = this.game.add.text(
			this.world.centerX + 20,
			this.world.centerY + offset,
			"Chercher",
			{ font: "16pt Arial", fill: "#FFFFFF", align: "center" }
		);

		sendButton.anchor.set(0, 0);
		sendButton.inputEnabled = true;
		sendButton.events.onInputDown.add(this.clickSendButton, this);
		sendButton.events.onInputOver.add(this.over, this);
		sendButton.events.onInputOut.add(this.out, this);
	},

	clickSendButton: function(item){
		socket.emit('WantJoinLinkedRoom', input.selectText()._value);
	},

	joinRandom: function(item) {
		socket.emit('WantJoinRandomRoom');
	},

	over: function(item) {
	    item.fill = "#D7DEFF";
	    item.scale.set(1.1);
	},

	out: function(item) {
	    item.fill = "#fff";
	    item.scale.set(1);
	},
}