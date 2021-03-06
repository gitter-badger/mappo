"use strict"

const {T} = require(`../readFormat`)
const V1_VSPANIM = require(`./v1vspanim`)

module.exports = {
  version: T.u16,
  palette: T.list(T.u8, 3 * 256),
  numtiles: T.u16,
  imagedata: T.u16(({record}) => 16 * 16 * record.numtiles),
  vspanim: T.list(V1_VSPANIM, 100),
}
