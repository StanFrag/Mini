var boot = function (game) {
    this.game = game;
    this.parentElement = document.getElementById("game");
    this.orientation = false;
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
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.pageAlignVertically = true;
            this.game.scale.setScreenSize(true);
        }
        else
        {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.pageAlignVertically = true;
            this.game.scale.forceOrientation(true, false);
            this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation);
            this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation);
            this.game.scale.setScreenSize(true);
        }        

		this.game.state.start("Preload");
	},

	enablePlugins: function(){
		this.game.add.plugin(Phaser.Plugin.Tiled);
		CACHE_KEY = Phaser.Plugin.Tiled.utils.cacheKey;
	},

    gameResized: function (width, height) {
        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device.
    },

    enterIncorrectOrientation: function () {
        this.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    },

    leaveIncorrectOrientation: function () {
        this.orientated = true;
        document.getElementById('orientation').style.display = 'none';
    }
}