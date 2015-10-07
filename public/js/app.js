/*************************************
//
// bonebreaker app
//
**************************************/
var USER_ID;
var USER_ROOM = "";
var CACHE_KEY = null;

var HOST = 'http://mini.cleverapps.io/';
//var HOST = 'http://localhost:3000/';

// Connexion au serveur socket
var socket = io.connect('http://127.0.0.1:3000/');
    
window.onload=function(){

    socket.emit('generateSocketId');

    // Ensemble des parametres lié au jeu
    var paramsList = {};

    paramsList.width = 500;
    paramsList.height = 720;

    var game = new Phaser.Game(paramsList.width, paramsList.height, Phaser.CANVAS, "game");

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
        USER_ID = id;
        game.state.start("Boot");
    });


}
