var ConstructionPicker = function(game){
	_constructionState = game;
	this.create();
};
  
ConstructionPicker.prototype = {
	preload: function(){
	},

  	create: function(){

  		EZGUI.Theme.load(['json/gui/test.json'], function () {

  			guiConstruction.width = _constructionState.width;

		    mainScreen = EZGUI.create(guiConstruction, 'metalworks');

		    var main = EZGUI.components.main;
		    var gameHeight = _constructionState.height - main.height;

		   	main.y = gameHeight;
		});
		
	}
}