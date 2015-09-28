var boot = function (game) {
    this.game = game;
};
  
boot.prototype = {

	preload: function(){
         //this.game.load.image("loading","assets/loading.png"); 
	},

  	create: function(){
		/*
		this.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL; //resize your window to see the stage resize too
		this.stage.scale.setShowAll();
		this.stage.scale.refresh();
		*/
		
		this.game.state.start("Preload");

		//this.game.canvas.id = 'canvas';
	}
}