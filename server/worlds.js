module.exports.get = (world) => {
  var worlds = {
    winter: {
      map: 'winter',
      image: 'Tileset',
      tile: 'winterTilemap',
      gameModes: [
        'ctf',
        'teamsurvivor',
        'suddendeath',
        'ctf',
        'tdm',
        'teamsurvivor',

        'suddendeath',
        'default',
        'treeland',
      ],
      healthFrame: 4,
      // All layers that belong to this map, no matter the game mode.
      layers: {
        colissions: 'Colissins',
        land: 'Tile Layer 1',
        spawnLayer: 'spawns',
      },
      offset: {
        x: 0,
        y: 0
      },
      size: {
        width: 2240,
        height: 1344,
        tile: 32
      }
    }
  }

  return worlds[world]
}