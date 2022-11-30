let dash;
let treeStump;
let mushroom1;
let mushroom2;
let mushroom3;
let floatingLogs;
let cursors;
let isWalking;
let isJumping;
let dreamies;
let collected = 0;
let complete = false;
let meow_audio;
let button

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

    dash = this.physics.add.sprite(0, 0, 'idle');
    dash.setScale(3);
    dash.setBounce(0.1);
    dash.setCollideWorldBounds(true);
    dash.setSize(15, 15).setOffset(10,18);

    button = this.physics.add.sprite(1100, 100, 'button');
    button.setScale(0.2);
    button.setCollideWorldBounds(true);
    button.body.immovable = true;
    button.body.allowGravity = false;

    //initialise invisible platforms that match the background
    // treeStump = this.physics.add.sprite(250, 470).setScale(5, 1);
    // treeStump.body.immovable = true;
    // treeStump.body.allowGravity = false;

    // mushroom1 = this.physics.add.sprite(850, 200).setScale(3, 1);
    // mushroom1.body.immovable = true;
    // mushroom1.body.allowGravity = false;

    // mushroom2 = this.physics.add.sprite(1000, 220).setScale(3, 1);
    // mushroom2.body.immovable = true;
    // mushroom2.body.allowGravity = false;

    // mushroom3 = this.physics.add.sprite(150, 150).setScale(3, 1);
    // mushroom3.body.immovable = true;
    // mushroom3.body.allowGravity = false;

    // floatingLog = this.physics.add.sprite(575, 200, "floating-log").setScale(0.25);
    // floatingLog.body.immovable = true;
    // floatingLog.body.allowGravity = false;

    //floating log sprites!
    this.floatingLogs = this.physics.add.group({
      setCollideWorldBounds: true,
      allowGravity: false
    })

    for (var i = 0; i < 15; i++) {
      var x = Phaser.Math.RND.between(0, 1200);
      var y = Phaser.Math.RND.between(150, 700);

      var logsAll = this.floatingLogs.create(x, y, 'floating-log');
      logsAll.setScale(0.16);
      logsAll.setCollideWorldBounds(true);
    }

    floatingLogs = this.floatingLogs;

    floatingLogs.children.iterate(log => {
      log.body.immovable = true;
    })


    //set up the dreamies!!
    this.dreamies = this.physics.add.group({
      setCollideWorldBounds: true,
      allowGravity: false,
      immovable: true
    });

    for (var i = 0; i < 10; i++) {
      var x = Phaser.Math.RND.between(0, 1200);
      var y = Phaser.Math.RND.between(0, 700);

      while((x>1000 && y<250)){
        x = Phaser.Math.RND.between(0, 1200);
        y = Phaser.Math.RND.between(0, 700);
      }

      var dreamiesAll = this.dreamies.create(x, y, 'dreamies').setScale(0.15);
      dreamiesAll.setCollideWorldBounds(true);
    }

    dreamies = this.dreamies;

    //how all the objects interact with each other
    this.physics.add.collider(dash, this.floatingLogs);
    this.physics.add.collider(dash, this.dreamies, (player, dreamie)=>{dreamie.destroy();
      collected ++;
      console.log(collected);
      document.getElementById("collected").innerHTML = collected;
      meow_audio.play();
    })

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
}

function update () {
    floatingLogs.children.iterate(log => {
      log.anims.play('floating-log', true);
    })

    dreamies.children.iterate(dreamie => {
      dreamie.anims.play('dreamies-anim', true);
    })

    button.anims.play('button', true);


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
    } else if(cursors.up.isDown && !isJumping){
        isWalking= false;
        isJumping=true;
        dash.setVelocityY(-290)
        if(dash.flipX===true){
          dash.setVelocityX(-50)
        }else{
          dash.setVelocityX(50)
        }
        dash.anims.play('up', true)
        function stopJumping () {isJumping=false};
        setTimeout(stopJumping, 500);
    }else {
        isWalking = false
        dash.setVelocityX(0)
        dash.anims.play('idle', true)
    }


    if(collected === 8){
      complete = true;
    }

    // if(isWalking && !audio_feet.isPlaying) {
    //     audio_feet.play()
    // }


}
