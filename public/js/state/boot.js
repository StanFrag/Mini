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

		this.enablePlugins();
		
		this.game.state.start("Preload");

		//this.game.canvas.id = 'canvas';
	},

	enablePlugins: function(){
		this.game.add.plugin(Phaser.Plugin.Tiled);
		CACHE_KEY = Phaser.Plugin.Tiled.utils.cacheKey;
	}
}