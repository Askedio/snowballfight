


export default class extends Phaser.State {
  init() {
    process.env.NODE_ENV != 'production' && console.log('starting preload state..')
    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE

    this.stage.backgroundColor = "#cce4f0"
  }

  preload() {
    this.load.atlas('health', 'assets/sprites/health.png', 'assets/sprites/health.json')

    this.load.atlas('kaboom', 'assets/sprites/explosion.png', 'assets/sprites/explosion.json')
    this.load.atlas('explosion2', 'assets/sprites/explosion2.png', 'assets/sprites/explosion2.json')
    this.load.atlas('explosiongrey', 'assets/sprites/explosiongrey.png', 'assets/sprites/explosiongrey.json')

    this.load.atlas('winterobjects', 'assets/sprites/winterobjects.png', 'assets/sprites/winterobjects.json')
    this.load.atlas('players', 'assets/sprites/players.png', 'assets/sprites/players.json')

    this.load.image('cannon', 'assets/images/snowballfire.png')
    this.load.image('bullet', 'assets/images/snowball.png')
    this.load.image('109', 'assets/images/109.png')
    this.load.image('tree', 'assets/maps/winter/png/128/objects/non-tileable/Tree.png')
    this.load.image('snowman', 'assets/maps/winter/png/128/objects/non-tileable/IceMan.png')

    this.load.image('devil', 'assets/images/devil.png')
    this.load.image('wings', 'assets/images/wings.png')


    this.load.tilemap('winterTilemap', "assets/maps/winter/map.json", null, Phaser.Tilemap.TILED_JSON)
    this.load.image('winter', 'assets/maps/winter/map.png')

    //  this.load.audio('foota', 'assets/sounds/footsteps/Footstep_Snow_Run_02.mp3');
    this.load.audio('explosion', 'assets/sounds/explosion.mp3');
    this.load.audio('bullet1', 'assets/sounds/impacts/bullet_impact_snow_01.mp3');
    this.load.audio('bullet2', 'assets/sounds/impacts/bullet_impact_snow_02.mp3');
    this.load.audio('bullet3', 'assets/sounds/impacts/bullet_impact_snow_03.mp3');
    this.load.audio('bullet4', 'assets/sounds/impacts/bullet_impact_snow_04.mp3');
    this.load.audio('bullet5', 'assets/sounds/impacts/bullet_impact_snow_05.mp3');
    this.load.audio('chime1', 'assets/sounds/chime1.mp3');
    this.load.audio('chime2', 'assets/sounds/chime2.wav');
    this.load.audio('chime3', 'assets/sounds/chime3.wav');
    this.load.audio('laugh1', 'assets/sounds/laugh1.mp3');
    this.load.audio('move1', 'assets/sounds/move1.wav');
    this.load.audio('shoot1', 'assets/sounds/shoot1.mp3');

    this.load.audio('smash1', 'assets/sounds/smashes/Snow_Ball_Smash_Hard_01.mp3');
    this.load.audio('smash2', 'assets/sounds/smashes/Snow_Ball_Smash_Hard_02.mp3');
    this.load.audio('smash3', 'assets/sounds/smashes/Snow_Ball_Smash_Medium_04.mp3');
    this.load.audio('smash4', 'assets/sounds/smashes/Snow_Ball_Smash_Hard_05.mp3');

    this.game.camera.deadzone = new Phaser.Rectangle((window.innerWidth / 2) - 50, (window.innerHeight / 2) - 50, 100, 100)
    this.game.camera.focusOnXY(0, 0)
  }

  render() {
    this.game.loaded = true
    this.game.state.start('SocketState')
  }

}