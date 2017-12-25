"use strict";

class Default extends require('./base') {
  constructor(map, layer) {
    super(map, layer)


    this.create('redflag', 'redflag', {
        forTeam: 'red'
      })
      .create('blueFlag', 'flag', {
        forTeam: 'blue'
      })
      .create('blueflagCapPoint', 'flagCapPoint', {
        forTeam: 'blue',
        tint: 0x0000ff
      })
      .create('redflagCapPoint', 'flagCapPoint', {
        forTeam: 'red',
        tint: 0xff0000
      })
      .createMultiple(4, 'health')
      .createMultiple(1, 'speed')
      .create('snowman1', 'snowman')


    this.generateTrees(600)
  }
}

module.exports = Default