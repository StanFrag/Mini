var boot = function (game) {
    this.game = game;
    this.parentElement = document.getElementById("game");
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

		this.game.scale.fullScreenTarget = this.parentElement;
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; // Important
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.stage.disableVisibilityChange = true;
        this.game.input.maxPointers = 1;

        
        this.game.scale.setResizeCallback(function () {
            // you would probably just use this.game.scale.setResizeCallback(this.resize, this);

            var _this = this;
            var logging = true;

            // A value of 1 means no scaling 0.5 means half size, 2 double the size and so on.
            var scale = Math.min(window.innerWidth / _this.game.width, window.innerHeight / _this.game.height);
         
            // Resize parent div in order to vertically center the canvas correctly.
            this.parentElement.style.minHeight = window.innerHeight.toString() + "px";
         
            // Resize the canvas keeping the original aspect ratio.
            _this.game.scale.setUserScale(scale, scale, 0, 0);
         
            if (logging == true) {
                var w = Math.floor(_this.game.width * scale),
                    h = Math.floor(_this.game.height * scale);
                console.info("The game has just been resized to: " + w + " x " + h);
            }
        }, this);
        

		this.game.state.start("Preload");
	},

	enablePlugins: function(){
		this.game.add.plugin(Phaser.Plugin.Tiled);
		CACHE_KEY = Phaser.Plugin.Tiled.utils.cacheKey;
	}
}