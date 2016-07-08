var game = new Phaser.Game(500, 340);

game.global = {
    score: 0
};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('level_1', playState);
game.state.add('level_2', playState1);

game.state.start('boot');