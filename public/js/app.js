/*************************************
//
// bonebreaker app
//
**************************************/
var USER_ID;
var USER_ROOM = "";
var CACHE_KEY = null;

//var HOST = 'http://mini.cleverapps.io/';
var HOST = 'http://localhost:4000/';

// Connexion au serveur socket
var socket = io.connect(HOST);
    
window.onload=function(){

    socket.emit('generateSocketId');

    var w = window.innerWidth * window.devicePixelRatio;
    var h = window.innerHeight * window.devicePixelRatio;

    var game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h, Phaser.CANVAS, "game");

    game.state.add("Boot",boot);                // Initialisation de l'application (scale/plateforme)
    game.state.add("Preload",preload);          // Preload des elements de Menu (images/sons)
    game.state.add("Menu",menu);                // Menu principal de l'application
    game.state.add("CreateRoom",createRoom);    // Création d'une nouvelle Room de jeu
    game.state.add("JoinChoice",joinChoice);    // Choix du Join d'une room (Random/Gametag)
    game.state.add("Option",option);            // Options
    game.state.add("Rules",rules);              // Règles du jeu
    game.state.add("Room",room);                // Room d'attente de lancement du jeu
    game.state.add("GameLoad",gameLoad);        // Load de l'ensemble des elements lié au jeu
    game.state.add("Play",play);                // Jeu
    game.state.add("GameOver",gameOver);        // Recapitulatif de fin de partie

    console.log("%cStarting application", "color:green; background:black");

    socket.on('sendSocketId', function(id){
        console.log("id generé");
        USER_ID = id;
        game.state.start("Boot");
    });


}
