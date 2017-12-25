"use strict";

class Default extends require('./base') {
  constructor(map, layer) {
    super(map, layer)


    this.create('sign3', 'sign', {
        frame: 5
      })
      .create('weaponcannon', 'weapon', {
        type: 'cannon'
      })
      .create('crate1', 'crate')
      .create('crate2', 'crate')
      .create('sign1', 'sign', {
        frame: 1
      })
      .create('sign3', 'sign', {
        frame: 3
      })
      .create('sign4', 'sign', {
        frame: 4
      })
      .create('sign5', 'sign', {
        frame: 5
      })
      .create('sign6', 'sign', {
        frame: 6
      })
      .create('sign7', 'sign', {
        frame: 7
      })
      .create('sign8', 'sign', {
        frame: 8
      })
      .create('sign9', 'sign', {
        frame: 9,
        width: 80,
        height: 100
      })
      .createMultiple(4, 'health')
      .createMultiple(2, 'speed')
      .create('devil1', 'devil')
      .create('snowman1', 'snowman')


    this.generateTrees(60)
  }
}

module.exports = Default