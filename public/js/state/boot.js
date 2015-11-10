var boot = function (game) {
    this.game = game;
    this.orientated = false;
};
  
boot.prototype = {

	preload: function(){
         //this.game.load.image("loading","assets/loading.png"); 
	},

  	create: function(){
		this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            this.game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.pageAlignVertically = true;
            //this.game.stage.scale.setScreenSize(true);
        }
        else
        {
            this.game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.pageAlignVertically = true;
            this.game.stage.scale.forceOrientation(true, false);
            this.game.stage.scale.hasResized.add(this.gameResized, this);
            this.game.stage.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.game.stage.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            //this.game.stage.scale.setScreenSize(true);
        }
		
		this.game.state.start("Preload");
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
        this.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    },

    leaveIncorrectOrientation: function () {
        this.orientated = true;
        document.getElementById('orientation').style.display = 'none';
    }
}