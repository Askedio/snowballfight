export default class {
  constructor(app) {
    this.app = app
    this.game = this.app.game
    this.state = this.app.state

    process.env.NODE_ENV != 'production' && console.log('new map class', this.state)

    window.addEventListener('resize', this.onResize.bind(this), false)
  }

  destroyLayers() {
    this.colissionLayer.kill()
    this.spawnLayer.kill()
    this.land.kill()
    this.base.kill()

  }

  createLayers() {
    var gameMapData = this.state.data.gameMode

    this.land = this.map.createLayer(gameMapData.layers.land).sendToBack()
    this.land.fixedToCamera = true

    this.base = this.map.createLayer(gameMapData.layers.base).sendToBack()
    this.base.fixedToCamera = true

    this.colissionLayer = this.map.createLayer(gameMapData.layers.colissions).sendToBack()
    this.spawnLayer = this.map.createLayer(gameMapData.layers.spawnLayer).sendToBack()

    this.map.setCollisionBetween(500, 3000, true, gameMapData.layers.colissions)
    this.map.setCollisionBetween(500, 3000, true, gameMapData.layers.robotColissions)
  }

  create() {
    process.env.NODE_ENV != 'production' && console.log('creating the map...', this.state)

    var mapData = this.state.data.world

    this.map = this.game.add.tilemap(mapData.tile)
    this.map.addTilesetImage(mapData.image, mapData.map)

    this.createLayers()


    this.game.world.setBounds(mapData.offset.x, mapData.offset.y, mapData.size.width, mapData.size.height)
    this.game.enemyGroup = this.game.add.group()
    this.game.topLayerGroup = this.game.add.group()
    this.game.obsticalGroup = this.game.add.group()

  }


  destroy() {
    process.env.NODE_ENV != 'production' && console.log('destroying the map...')

    if (!this.land) {
      return
    }

    this.land.kill()

    this.colissionLayer.kill()
    this.map.destroy()
    this.game.enemyGroup.destroy()
    this.game.obsticalGroup.destroy()


    window.removeEventListener('resize', this.onResize)
  }

  onResize() {
    this.game.scale.setGameSize(window.innerWidth, window.innerHeight)
    this.game.scale.refresh()
    if (this.land) {
      this.land.resize(window.innerWidth, window.innerHeight)
      this.base.resize(window.innerWidth, window.innerHeight)
    }
  }
}