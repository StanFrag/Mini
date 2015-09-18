var menu = function(game){
	currentGame = game;

	var clickArea,
		text,
		lauchGameButton;
};
  
menu.prototype = {

	preload: function(){
	},

  	create: function(){
  		this.addTitle();
  		this.addMenus();
	},

	addTitle: function(){

	},

	addMenus: function(){

		console.log("totoooooooooo")
		
		// Mis en place de la couleur de fond
		this.stage.backgroundColor = '#222';

		// Creation d'un bouton de menu cliquable
		// { Titre du bouton[string], positions[object], style[object], Path du state[string] }
		this.createTextClick(
			'Créer une partie', 
			{ pX: this.world.centerX, pY: this.world.centerY - 50 },
			{ font: "40px Arial", fill: "#313131", align: "center" },
			'CreateRoom'
		);

		this.createTextClick(
			'Rejoindre une partie', 
			{ pX: this.world.centerX, pY: this.world.centerY },
			{ font: "40px Arial", fill: "#313131", align: "center" },
			'JoinChoice'
		);

		this.createTextClick(
			'Options', 
			{ pX: this.world.centerX, pY: this.world.centerY + 50 },
			{ font: "40px Arial", fill: "#313131", align: "center" },
			'Option'
		);

		this.createTextClick(
			'Règles', 
			{ pX: this.world.centerX, pY: this.world.centerY + 100 },
			{ font: "40px Arial", fill: "#313131", align: "center" },
			'Rules'
		);
        

	},

	createTextClick: function(title, pos, style, dest){
		var text = this.add.text(pos.pX, pos.pY, title, style);

	    text.anchor.set(0.5);

	    text.inputEnabled = true;
	    text.input.useHandCursor= true;

	    text.events.onInputOver.add(this.over, this);
	    text.events.onInputOut.add(this.out, this);

	    text.events.onInputDown.add(this.down, {path: dest});
	},

	over: function(item) {
	    //item.fill = "#ffff44";
	    //item.text = "clicked " + clicks + " times";
	},

	out: function(item) {
	    //item.fill = "#ff0044";
	    //item.text = "click and drag me";
	},

	down: function(item, path) {
		currentGame.state.start(this.path);
	},
}