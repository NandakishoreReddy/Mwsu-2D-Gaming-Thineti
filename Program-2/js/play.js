// New name for the state
var playState = {
    // Removed the preload function
    create: function() {

        this.createWorld();
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        //set the anchor point to the  player
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
		//Adding animations to player
		this.player.animations.add('right', [6,7], 8, true);	
        this.player.animations.add('left', [3,4], 8, true );
        
        //// Add the coin
        this.coin = game.add.sprite(60, 150, 'coin');
        //Add Arcade physics to the coin
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);

        //Enabbling keyboard events
        this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        
		game.global.score = 0;
        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });

        //addd the group of enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
		
		//adding music to game
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');

        this.music = game.add.audio('music'); // Add the music
        this.music.loop = true; // Make it loop
        this.music.play(); // Start the music
		this.player.body.setSize(32, 50, 0, 0);
        
		// Create the emitter with 15 particles. We don't need to set the x y
		// Since we don't know where to do the explosion yet
		this.emitter = game.add.emitter(0, 0, 15);

		// Set the 'pixel' image for the particles
		this.emitter.makeParticles('pixel');

		// Set the x and y speed of the particles between -150 and 150
		// Speed will be randomly picked between -150 and 150 for each particle
		this.emitter.setYSpeed(-150, 150);
		this.emitter.setXSpeed(-150, 150);

		// Scale the particles from 2 time their size to 0 in 800ms
		// Parameters are: startX, endX, startY, endY, duration
		this.emitter.setScale(2, 0, 2, 0, 800);

		// Use no gravity
		this.emitter.gravity = 0;			

    },
    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        	game.physics.arcade.collide(this.enemies, this.walls);
            //call the player die and take coin functions when the player,coin,enemies  overlaps
        	game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        	game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        	this.movePlayer(); 
			//when the player falls in the holes just spawn the player at random position
        	if (!this.player.inWorld) {
            	this.playerPositions();
        	}	
    },
    movePlayer: function() {
        //to move the players upon the arrow keys
        if (this.left.isDown) {
            this.player.body.velocity.x = -200;
			this.player.animations.play('left');            
        }
        else if (this.right.isDown) {
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        }
        else {
            this.player.body.velocity.x = 0;
			this.player.animations.stop();
			this.player.frame = 0;
        }
        if (this.up.isDown && this.player.body.touching.down) {
            this.jumpSound.play();               
            this.player.body.velocity.y = -320;
        }
        
    },

    	playerPositions: function() {
        //adding some random player postions to respawn them when player dies
		var pos =[  {x: 140, y: 90}, {x: 140, y: 270}, {x: 250, y: 90}, {x: 360, y: 90}, {x: 60, y: 180}, 
                {x: 370, y: 300}, {x: 440, y: 180}, 
			 {x: 250, y: 270}, {x: 360, y: 270}, {x: 60, y: 140}, {x: 40, y: 360}, {x: 320, y: 360},
              {x: 180, y: 360}, {x: 450, y: 360} ,
			{x: 140, y: 60}, {x: 360, y: 60}, {x: 440, y: 140}, {x: 130, y: 300} ];
		
		var playerpos = game.rnd.pick(pos);
		this.player.reset( playerpos.x, playerpos.y );
	
	},

    takeCoin: function(player, coin) {

        this.coinSound.play();
        // Use the new score variable
        game.global.score += 5;
        // Use the new score variable
        this.scoreLabel.text = 'score: ' + game.global.score;
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100).yoyo(true).start();
        this.updateCoinPosition();
    },
    updateCoinPosition: function() {
        //generate coin position at random
        var coinPosition = [
            {x: 140, y: 70}, {x: 360, y: 70}, 
            {x: 60, y: 150}, {x: 440, y: 150}, 
            {x: 130, y: 310}, {x: 370, y: 310} 
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(coinPosition);
        this.coin.reset(newPosition.x, newPosition.y);
    },
    addEnemy: function() {
        //adding the enemies to the game and their properties
        var enemy = this.enemies.getFirstDead();

        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },
    createWorld: function() {
        //creating the walls and sprites in the game
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls); 
        game.add.sprite(480, 0, 'wallV', 0, this.walls); 
        game.add.sprite(0, 0, 'wallH', 0, this.walls); 
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls); 
        game.add.sprite(300, 320, 'wallH', 0, this.walls); 
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); 
        game.add.sprite(400, 160, 'wallH', 0, this.walls); 
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },
	
	startMenu: function() {
		game.state.start('menu');
	},
	
    playerDie: function() {
		
		this.emitter.x = this.player.x;
    	this.emitter.y = this.player.y;
    	// Start the emitter by exploding 15 particles that will live 800ms
    	this.emitter.start(true, 800, null, 15);
        this.music.stop();
        this.deadSound.play();
        game.camera.flash(0xffffff, 300);
        game.camera.shake(0.02, 300);
        // When the player dies, we go to the menu
        game.state.start('menu');
    },
};