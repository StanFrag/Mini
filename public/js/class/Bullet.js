Bullet = function(game, weapon, userPos, pointer){
	this.game = game;
	this.weapon = weapon;
	this.userPos = userPos;
	this.pointer = pointer;
	this.color = '#bb5500';

	this.bullet = null;

	this.create();
};
  
Bullet.prototype = {

	preload: function(){
	},

  	create: function(){
  		this.bullet = this.game.add.sprite(this.userPos.x, this.userPos.y, this.createBlock({x:10,y:10}, this.color));
		this.bullet.anchor.setTo(0.5, 0.5);

		this.game.physics.arcade.enableBody(this.bullet);

		this.bullet.body.collideWorldBounds = false;
	},

	update: function(){
		this.game.physics.arcade.moveToXY(this.bullet, this.pointer.x, this.pointer.y, 300);
		this.detectOut();
	},

	detectOut: function(){
		if(this.bullet.x < 0 || this.bullet.x > this.game.world.width){
			this.bullet.destroy();
			console.log("bullet destroy");
		}
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		var bmd = this.game.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);

		return bmd;
	},
}