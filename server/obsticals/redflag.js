"use strict";

class Redflag extends require('./flag') {
  constructor(name, state) {
    super(name)


    this.tint = 0xff0000
    this.team = 'red'

    this.changesSettings = (player) => {
      player.hasFlag = this.name
      player.addSprite[this.name] = {
        sprite: this.sprite,
        scaleX: .05,
        scaleY: .05,
        anchorX: -.5,
        tint: 0xff0000
          //  anchorY: 1
      }
    }


  }

}

module.exports = Redflag