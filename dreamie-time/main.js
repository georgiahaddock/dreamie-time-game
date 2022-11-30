//import Phaser, { Game } from "phaser";

let dash;
let treeStump;
let mushroom1;
let mushroom2;
let mushroom3;
let floatingLog;
let cursors;
let isWalking;
let dreamies;
let collected = 0;
let complete = false;
// let meow_audio;

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1200,
  height: 700,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: true
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
    this.load.spritesheet('idle', './assets/cat-spritesheet.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('run', './assets/cat-spritesheet.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('jump', './assets/cat-spritesheet.png', { frameWidth: 32, frameHeight: 32 })

    //load floating log sprite
    this.load.spritesheet('floating-log', './assets/floatingLog.png', { frameWidth: 814, frameHeight: 140 })

    //load dreamie sprite
    this.load.spritesheet('dreamies', './assets/dreamies-spritesheet.png', { frameWidth: 716, frameHeight: 716 })

    // this.load.audio('meow url')
}

function create () {
    //setting up the background
    this.add.image(400, 300, "bg7");
    this.add.image(400, 300, "bg6");
    this.add.image(400, 300, "bg5");
    this.add.image(400, 300, "bg4");
    this.add.image(400, 300, "bg3");
    this.add.image(400, 400, "bg2");

    //initialise Dash the cat!
    dash = this.physics.add.sprite(0, 0, 'idle');
    dash.setScale(3);
    dash.setBounce(0.5);
    dash.setCollideWorldBounds(true);

    //initialise invisible platforms that match the background
    treeStump = this.physics.add.sprite(250, 470).setScale(5, 1);
    treeStump.body.immovable = true;
    treeStump.body.allowGravity = false;

    mushroom1 = this.physics.add.sprite(850, 200).setScale(3, 1);
    mushroom1.body.immovable = true;
    mushroom1.body.allowGravity = false;

    mushroom2 = this.physics.add.sprite(1000, 220).setScale(3, 1);
    mushroom2.body.immovable = true;
    mushroom2.body.allowGravity = false;

    mushroom3 = this.physics.add.sprite(150, 150).setScale(3, 1);
    mushroom3.body.immovable = true;
    mushroom3.body.allowGravity = false;

    floatingLog = this.physics.add.sprite(575, 200, "floating-log").setScale(0.25);
    floatingLog.body.immovable = true;
    floatingLog.body.allowGravity = false;

    //set up the dreamies!!
    this.dreamies = this.physics.add.group({
      setCollideWorldBounds: true,
      allowGravity: false,
    });

    for (var i = 0; i < 8; i++) {
      var x = Phaser.Math.RND.between(0, 1200);
      var y = Phaser.Math.RND.between(0, 700);

      var dreamiesAll = this.dreamies.create(x, y, 'dreamies');
      dreamiesAll.setScale(0.15);
      dreamiesAll.setCollideWorldBounds(true);
    }

    dreamies = this.dreamies;

    //how all the objects interact with each other
    //this.physics.add.collider(dash, dreamies);
    this.physics.add.collider(dash, treeStump);
    this.physics.add.collider(dash, mushroom1);
    this.physics.add.collider(dash, mushroom2);
    this.physics.add.collider(dash, mushroom3);
    this.physics.add.collider(dash, floatingLog);
    this.physics.add.collider(dash, this.dreamies, (player, dreamie)=>{dreamie.destroy();
      collected ++;
      console.log(collected);})

    cursors = this.input.keyboard.createCursorKeys();
    //meow = this.sound.add('meow')

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
}

function update () {
    floatingLog.anims.play('floating-log', true);

    dreamies.children.iterate(dreamie => {
      dreamie.anims.play('dreamies-anim', true);
    })


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
    } else if(cursors.up.isDown){
        isWalking= false
        dash.setVelocityY(-290)
        if(dash.flipX===true){
          dash.setVelocityX(-50)
        }else{
          dash.setVelocityX(50)
        }
        dash.anims.play('up', true)
    }else {
        isWalking = false
        dash.setVelocityX(0)
        dash.anims.play('idle', true)
    }

    // this.dreamies.getChildren().forEach(function(dreamie) {
    //   if(dash.x === dreamie.x && dash.y === dreamie.y){
    //     dreamie.destroy();
    //     collected ++;
    //     console.log(collected);
    //   }
    // }, this);


    if(collected === 8){
      complete = true;
    }

    // if(isWalking && !audio_feet.isPlaying) {
    //     audio_feet.play()
    // }

    // if(!isWalking && audio_feet.isPlaying) {
    //     audio_feet.stop()
    // }
}
