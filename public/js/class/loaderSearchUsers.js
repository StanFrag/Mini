var loaderSearchUsers = function(game, styleLoader, styleTextLoader){
	currentGame = game;
	point = '.';
	temporisation = '&';

	loaderStyleWidth = styleLoader.width;
	loaderStyleHeight = styleLoader.height;
	loaderStyleColor = styleLoader.color;
	loaderStyleAlpha = styleLoader.alpha;
	loaderStyleVit = styleLoader.vit;

	loaderText = styleTextLoader.text;
	loaderTextFont = styleTextLoader.font;
	loaderTextSize = styleTextLoader.fontSize;
	loaderTextColor = styleTextLoader.color;
	loaderTextAlign = styleTextLoader.align;
	loaderTextAnchor = styleTextLoader.anchor;
	loaderTextSpace = styleTextLoader.space;
};
  
loaderSearchUsers.prototype = {

	preload: function(){
		var loader,
			indicator;
	},

  	create: function(){
  		this.drawLoader();
  		this.drawIndicator();

  		console.log("Loader initialisé");
	},

	update: function(){
		this.updateLoader();
	},

	updateLoader: function(){
		loader.x += loaderStyleVit;

		if(loader.x > (currentGame.world.centerX + 100) || loader.x < (currentGame.world.centerX - 100)){
			loaderStyleVit *= -1;
		}

		if(point.length > 5){
			point = '.';
		}else{

			if(temporisation.length > 30){
				point += '.';
				temporisation = '&';
			}else{
				temporisation += '&';
			}
			
		}

		indicator.text = loaderText + ' ' + point;
	},

	drawIndicator: function(){
		indicator = currentGame.add.text(currentGame.world.centerX, loader.y - loaderTextSpace, loaderText);

	    indicator.anchor.set(loaderTextAnchor);
	    indicator.align = loaderTextAlign;

	    indicator.font = loaderTextFont;
	    indicator.fontSize = loaderTextSize;
	    indicator.fill = loaderTextColor;
	},
	

	drawLoader: function(){

		var graphics = currentGame.add.graphics(100, 100);
  		graphics.beginFill(loaderStyleColor, loaderStyleAlpha);

    	loader = graphics.drawRect((-loaderStyleWidth / 2), (-loaderStyleHeight / 2), loaderStyleWidth, loaderStyleHeight);

    	loader.x = currentGame.world.centerX;
    	loader.y = currentGame.world.centerY;

    	console.log("ok")
	}
}