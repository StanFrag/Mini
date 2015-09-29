var option = function(game){
};
  
option.prototype = {
	preload: function(){
	},

  	create: function(){
  		EZGUI.Theme.load([ 'json/gui/test.json' ], function () {
  			console.log('test');
  			console.log(mainScreenJSON);
			var mainScreen = EZGUI.create(mainScreenJSON, 'metalworks');	
		});
	}
}