var room = function(game){
};
  
room.prototype = {

	init: function(room){
		this.room = room;
	},

	preload: function(){
	},

  	create: function(){
  		console.log(this.room);
  		console.log(USER_ID);

  		this.createInfoRoom();
  		this.createListPlayers();
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

		/*
		var infoIdRoom = this.game.add.text(this.world.centerX, 50, "Id de la partie: " + this.room.idRoom, { font: "12pt Arial", fill: "#FFFFFF", align: "center" });
		infoIdRoom.inputEnable = true;
		infoIdRoom.anchor.set(0.5);
		*/
	},

	createListPlayers: function(){

		for(var i = 0; i < this.room.players.length; i++){
			var t = this.game.add.text(this.world.centerX, 200 + (10 * i + 30), (i + 1) + ". " + this.room.players[i], { font: "12pt Arial", fill: "#FFFFFF", align: "center" });
			t.anchor.set(0.5);
		}

	}
}