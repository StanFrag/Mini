var option = function(game){

};
  
option.prototype = {
	preload: function(){
	},

  	create: function(){
  		EZGUI.Theme.load(['json/gui/test.json'], function () {

		    mainScreen = EZGUI.create(guiObj, 'metalworks');

		    EZGUI.components.btn1.on('click', function (event) {
                alert(EZGUI.components.myInput.text);
            });
		});
	}
}