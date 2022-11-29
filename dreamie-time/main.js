//import './style.css'
//import Phaser, { Game } from "phaser";

let dash;
let treeStump;
let mushroom1;
let mushroom2;
let cursors;
let isWalking;
let platforms;
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
    this.load.image("bg1", "./assets/shroom-background/1.png");
    this.load.image("bg2", "./assets/shroom-background/2.png");
    this.load.image("bg3", "./assets/shroom-background/3.png");
    this.load.image("bg4", "./assets/shroom-background/4.png");
    this.load.image("bg5", "./assets/shroom-background/5.png");
    this.load.image("bg6", "./assets/shroom-background/6.png");
    this.load.image("bg7", "./assets/shroom-background/7.png");

    this.load.spritesheet('idle', './assets/cat-spritesheet.png', {frameWidth: 32, frameHeight: 32})
    this.load.spritesheet('run', './assets/cat-spritesheet.png', {frameWidth: 32, frameHeight: 32})
    this.load.spritesheet('jump', './assets/cat-spritesheet.png', {frameWidth: 32, frameHeight: 32})
    // this.load.audio('meow url')
}

function create () {
    //setting up the background
    this.add.image(400, 300, "bg7");
    this.add.image(400, 300, "bg6");
    this.add.image(400, 300, "bg5");
    this.add.image(400, 300, "bg4");
    this.add.image(400, 300, "bg3");

    //set up platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 400, "bg2").refreshBody();
    platforms.create(500, 200, "bg1").setScale(0.3).refreshBody();

    //initialise Dash the cat!
    dash = this.physics.add.sprite(0, 0, 'idle');
    dash.setScale(2.5);

    //initialise invisible platforms that match the background
    treeStump = this.physics.add.sprite(250, 470);
    treeStump.body.immovable = true;
    treeStump.body.allowGravity = false;
    treeStump.setScale(5, 1);

    mushroom1 = this.physics.add.sprite(850, 200);
    mushroom1.body.immovable = true;
    mushroom1.body.allowGravity = false;
    mushroom1.setScale(3, 1);

    mushroom2 = this.physics.add.sprite(1000, 220);
    mushroom2.body.immovable = true;
    mushroom2.body.allowGravity = false;
    mushroom2.setScale(3, 1);

    //dash.setBounce(0.1)
    dash.setCollideWorldBounds(true);
    this.physics.add.collider(dash, platforms);
    this.physics.add.collider(dash, treeStump);
    this.physics.add.collider(dash, mushroom1);
    this.physics.add.collider(dash, mushroom2);


    cursors = this.input.keyboard.createCursorKeys();
    //meow = this.sound.add('meow')

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
}

function update () {
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

    // if(isWalking && !audio_feet.isPlaying) {
    //     audio_feet.play()
    // }

    // if(!isWalking && audio_feet.isPlaying) {
    //     audio_feet.stop()
    // }
}
