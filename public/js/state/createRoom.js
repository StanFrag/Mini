var createRoom = function(game){
	currentGame = game;

	var loaderSearch;
};
  
createRoom.prototype = {

	preload: function(){
		// Loader
		loaderSearch = new loaderSearchUsers(
											currentGame, 
											{
												width: 100,
												height: 30,
												color: 0xFF700B,
												alpha: 1,
												vit: 7
											},
											{
												text: 'Test loader', 
												font:'Arial', 
												fontSize: 30, 
												color: '#fff',
												align: 'left', 
												anchor: 0.5,
												space: 100
											});
	},

  	create: function(){
  		//loaderSearch.create();
  		socket.emit('createNewRoom');

  		socket.on('roomCreated', function(obj){			
			USER_ROOM = obj.idRoom;
			currentGame.state.start("Room", true, false, obj);
		});
	},

	update: function(){
		//loaderSearch.update();
	},

	
}