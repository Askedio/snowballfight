module.exports.get = () => {
  return {
    default: {
      name: 'default',
      speed: 800,
      fireRate: 700,
      total: 1,
      sprite: 'bullet',
      bulletAngleOffset: 90,
      bulletAngleVariance: 0,
      damage: 1,
      bulletSpeedVariance: 0,
      fireRateVariance: 0,
      bulletLifespan: 940
    },
    cannon: {
      name: 'cannon',
      speed: 800,
      fireRate: 900,
      total: 2,
      sprite: 'cannon',
      bulletAngleOffset: 0,
      bulletAngleVariance: 0,
      damage: 1,
      bulletSpeedVariance: 10,
      fireRateVariance: 0,
      bulletLifespan: 1000,
      timeout: 15000,
    },
    freeze: {
      name: 'freeze',
      speed: 800,
      fireRate: 1500,
      total: 1,
      sprite: 'bullet',
      bulletAngleOffset: 0,
      bulletAngleVariance: 0,
      damage: 1,
      bulletSpeedVariance: 10,
      fireRateVariance: 0,
      bulletLifespan: 1000,
      timeout: 15000,
      onDamagedEnemy: (player, remotePlayer) => {
        remotePlayer.moveable = false
        remotePlayer.damageable = false

        setTimeout((remotePlayer) => {
          if(!remotePlayer) {
            return
          }
          remotePlayer.moveable = true
          remotePlayer.damageable = true
        }, 1000, remotePlayer)
      }
    },
    devil: {
      name: 'devil',
      speed: 800,
      fireRate: 100,
      total: 10,
      sprite: 'cannon',
      bulletAngleOffset: 0,
      bulletAngleVariance: 0,
      damage: 1,
      bulletSpeedVariance: 10,
      fireRateVariance: 0,
      bulletLifespan: 400,
      timeout: 7000,
    }
  }
}