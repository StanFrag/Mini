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

		this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.pageAlignVertically = true;
            this.game.scale.setScreenSize(true);
            this.game.scale.setShowAll();
            this.game.scale.refresh();
        }
        else
        {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.pageAlignVertically = true;
            this.game.scale.forceOrientation(true, false, 'orientation');
            this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation);
            this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation);
            this.game.scale.setScreenSize(true);
            this.game.scale.setShowAll();
            this.game.scale.refresh();
        }
		
		this.game.state.start("Preload");

		//this.game.canvas.id = 'canvas';
	},

	enablePlugins: function(){
		this.game.add.plugin(Phaser.Plugin.Tiled);
		CACHE_KEY = Phaser.Plugin.Tiled.utils.cacheKey;
	},

	gameResized: function (width, height) {
        //  Processus suplementaire quand le jeu est resize
        //  this.game.width = width;
        //  this.game.height = height;
    },

    enterIncorrectOrientation: function () {
        GameCtrl.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    },

    leaveIncorrectOrientation: function () {
        GameCtrl.orientated = true;
        document.getElementById('orientation').style.display = 'none';
    }
}