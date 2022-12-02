let dash;
let treeStump;
let mushroom1;
let mushroom2;
let mushroom3;
let floatingLogs;
let cursors;
let isWalking;
let deployedDreamies;
let isJumping;
let dreamies;
let collected = 0;
let complete = false;
let music;
let meow_audio;
let button
let clock;

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1350,
  height: 700,
  pixelArt: true,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 500 },
          debug: false
      }
  },
  scene: { preload, create, update }
})

function preload () {
  //load background layers
  this.load.image("bg2", "./assets/shroom-background/2.png");
  this.load.image("bg3", "./assets/shroom-background/3.png");
  this.load.image("bg4", "./assets/shroom-background/4.png");
  this.load.image("bg5", "./assets/shroom-background/5.png");
  this.load.image("bg6", "./assets/shroom-background/6.png");
  this.load.image("bg7", "./assets/shroom-background/7.png");

  //load Dash the cat sprites
  this.load.spritesheet('idle', './assets/cat-spritesheet.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('run', './assets/cat-spritesheet.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('jump', './assets/cat-spritesheet.png', { frameWidth: 32, frameHeight: 32 });

  //load floating log sprite
  this.load.spritesheet('floating-log', './assets/floatingLog.png', { frameWidth: 814, frameHeight: 140 });

  //load dreamie sprite
  this.load.spritesheet('dreamies', './assets/dreamies-spritesheet.png', { frameWidth: 716, frameHeight: 716 });

  //load good boy button
  this.load.spritesheet('button', './assets/button/button.png', { frameWidth: 1007 , frameHeight: 926 });

  //audio files
  this.load.audio("music", './assets/audio/ELEVATOR.mp3')
  this.load.audio('meow','./assets/audio/meow 1.mp3');
}


function create () {
  //setting up the background
  this.add.image(400, 300, "bg7");
  this.add.image(400, 300, "bg6");
  this.add.image(400, 300, "bg5");
  this.add.image(400, 300, "bg4");
  this.add.image(400, 300, "bg3");
  this.add.image(420, 400, "bg2");

  //initialise audio
  meow_audio = this.sound.add('meow');
  music = this.sound.add('music');
  music.play();


  dash = this.physics.add.sprite(0, 0, 'idle');
  dash.setScale(3);
  dash.setBounce(0);
  dash.setCollideWorldBounds(true);
  dash.setSize(5, 10).setOffset(15, 22);

  //floating log sprites!
  this.floatingLogs = this.physics.add.group({
    setCollideWorldBounds: true,
    allowGravity: false
  })

  for (var i = 0; i < 4; i++) {
    var x = Phaser.Math.RND.between(0, 400);
    var y = Phaser.Math.RND.between(160, 600);

    var logsAll = this.floatingLogs.create(x, y, 'floating-log');
    logsAll.setScale(0.16);
    logsAll.setCollideWorldBounds(true);
  }
  for (var i = 0; i < 4; i++) {
    var x = Phaser.Math.RND.between(400, 800);
    var y = Phaser.Math.RND.between(160, 600);

    var logsAll = this.floatingLogs.create(x, y, 'floating-log');
    logsAll.setScale(0.16);
    logsAll.setCollideWorldBounds(true);
  }
  for (var i = 0; i < 4; i++) {
    var x = Phaser.Math.RND.between(800, 1200);
    var y = Phaser.Math.RND.between(160, 600);

    var logsAll = this.floatingLogs.create(x, y, 'floating-log');
    logsAll.setScale(0.16);
    logsAll.setCollideWorldBounds(true);
  }

  floatingLogs = this.floatingLogs;

  floatingLogs.children.iterate(log => {
    log.body.immovable = true;
  })

  button = this.physics.add.sprite(1100, 100, 'button');
  button.setScale(0.2);
  button.setCollideWorldBounds(true);
  button.body.immovable = true;
  button.body.allowGravity = false;
  button.setSize(300, 300).setOffset(390,600)

  //set up the dreamies!!
  dreamies = this.physics.add.group({
    setCollideWorldBounds: true,
    allowGravity: false,
  });

  function countDownOver(){
    document.getElementById("time").innerText = "X";
  }

clock = this.time.addEvent({
  delay: 20000,
  callback: countDownOver,
  repeat: 0
});
clock.paused = true;


function deployDreamies(dash, button){
  deployedDreamies = true;
  for (var i = 0; i < 10; i++) {
    var x = Phaser.Math.RND.between(0, 1200);
    var y = Phaser.Math.RND.between(0, 700);

  while((x>1000 && y<250)){
    x = Phaser.Math.RND.between(0, 1200);
    y = Phaser.Math.RND.between(0, 700);
  }

  var dreamiesAll = dreamies.create(x, y, 'dreamies').setScale(0.15);
  dreamiesAll.setCollideWorldBounds(true);
  dreamiesAll.setSize(300, 550).setOffset(170, 60);

  button.destroy();

  clock.paused = false;

  }

}

  //how all the objects interact with each other
  this.physics.add.collider(dash, this.floatingLogs);
  this.physics.add.collider(dreamies, this.floatingLogs);
  this.physics.add.collider(dash, dreamies, (player, dreamie)=>{
    dreamie.destroy();
    collected ++;
    document.getElementById("collected").innerHTML = collected;
    meow_audio.play();
  })
  this.physics.add.collider(dash, button, deployDreamies, ()=> {
    return !deployedDreamies;
  });

  cursors = this.input.keyboard.createCursorKeys();

  //Dash the cat animations
  this.anims.create({
      key: 'idle',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 3 })
  })

  this.anims.create({
      key: 'left',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('run', { start: 32, end: 39 })
  })

  this.anims.create({
      key: 'right',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('run', { start: 32, end: 39 })
  })

  this.anims.create({
      key: 'up',
      repeat: -1,
      frames: this.anims.generateFrameNumbers('jump', { start: 40, end: 45 }),
      frameRate: 5
  })

  //floating log animation
  this.anims.create({
      key: 'floating-log',
      repeat: -1,
      frames: this.anims.generateFrameNumbers('floating-log', {end: 3}),
      frameRate: 6
  })

  //dreamies animation
  this.anims.create({
    key: 'dreamies-anim',
    repeat: -1,
    frames: this.anims.generateFrameNumbers('dreamies', {end: 2}),
    frameRate: 6
  })

  //button animation
  this.anims.create({
    key: 'button',
    repeat: -1,
    frames: this.anims.generateFrameNumbers('button', {end: 3}),
    frameRate: 8
  })
  button.anims.play('button', true);

}

function update () {
  floatingLogs.children.iterate(log => {
    log.anims.play('floating-log', true);
  })

  dreamies.children.iterate(dreamie => {
    dreamie.anims.play('dreamies-anim', true);
  })



  if(cursors.up.isDown && (dash.body.touching.down || dash.body.onFloor())){
    isWalking= false;
    dash.setVelocityY(-600)
    if(dash.flipX===true){
      dash.setVelocityX(-50)
    }else{
      dash.setVelocityX(50)
    }
    dash.anims.play('up', true)
  }

  if (cursors.left.isDown) {
      isWalking = true
      dash.setVelocityX(-290)
      dash.flipX = true
      dash.anims.play('left', true)
  } else if (cursors.right.isDown) {
      isWalking = true
      dash.flipX = false
      dash.setVelocityX(290)
      dash.anims.play('right', true)
  }else {
      isWalking = false
      dash.setVelocityX(0)
      dash.anims.play('idle', true)
  }


  if(collected === 8){
    complete = true;
  }

  document.getElementById("time").innerText = Math.round(clock.getRemainingSeconds());

  // if(isWalking && !audio_feet.isPlaying) {
  //     audio_feet.play()
  // }


}
