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
  		this.bullet = this.game.add.sprite(0, 0, this.createBlock({x:5,y:5}, this.color));
		this.bullet.anchor.setTo(0.5, 0.5);

		this.game.physics.arcade.enableBody(this.bullet);

		this.bullet.body.collideWorldBounds = false;
	},

	update: function(){
		this.detectOut();
	},

	run:function(target){
		this.game.physics.arcade.moveToObject(this.bullet, target, this.weapon.speedBullet);
	},

	detectOut: function(){
		if(this.bullet.x < 0 || this.bullet.x > this.game.world.width){
			this.bullet.destroy();
		}
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		var bmd = this.game.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);

		return bmd;
	},

	getSprite: function(){
		return this.bullet;
	},
}