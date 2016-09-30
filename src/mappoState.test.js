"use strict"

const expect = require(`expect`)
const deepFreeze = require(`deep-freeze`)
const filler = require(`./filler`)
const createStore = require(`./createStore`)
const mappoState = require(`./mappoState`)

{
  // can set map
  const store = createStore(mappoState)
  expect(store.getState()).toEqual({})

  store.dispatch({type: `SET_MAP`, map: {tileLayers: []}})
  expect(store.getState().map).toEqual({tileLayers: []})
}

{
  // SET_MAP holds a direct reference to the map
  const store = createStore(mappoState)
  expect(store.getState()).toEqual({})

  const map = {tileLayers: []}
  store.dispatch({type: `SET_MAP`, map})
  expect(store.getState().map).toBe(map)
}

{
  // can undo set map
  const store = createStore(mappoState)
  const tileLayers = [{width: 2, height: 2, tileIndexGrid: filler(2 * 2, 0)}]
  deepFreeze(tileLayers)
  store.dispatch({type: `SET_MAP`, map: {tileLayers}})
  store.dispatch({type: `UNDO`})
  expect(store.getState().map).toBe(undefined)
}

{
  // can plot a tile
  const store = createStore(mappoState)

  const tileLayers = [{width: 2, height: 2, tileIndexGrid: filler(2 * 2, 0)}]
  deepFreeze(tileLayers)
  store.dispatch({type: `SET_MAP`, map: {tileLayers}})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual(filler(2 * 2, 0))

  store.dispatch({type: `PLOT_TILE`, x: 0, y: 1, layerIndex: 0, tileIndex: 99})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual([0, 0, 99, 0])
}

{
  // can undo a plotted tile
  const store = createStore(mappoState)

  const tileLayers = [{width: 2, height: 2, tileIndexGrid: filler(2 * 2, 0)}]
  store.dispatch({type: `SET_MAP`, map: {tileLayers}})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual(filler(2 * 2, 0))

  store.dispatch({type: `PLOT_TILE`, x: 0, y: 1, layerIndex: 0, tileIndex: 99})
  store.dispatch({type: `UNDO`})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual(filler(2 * 2, 0))
}

{
  // can undo a group of plotted tiles
  const store = createStore(mappoState)

  const tileLayers = [{width: 2, height: 2, tileIndexGrid: filler(2 * 2, 0)}]
  store.dispatch({type: `SET_MAP`, map: {tileLayers}})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual(filler(2 * 2, 0))

  store.dispatch({type: `PLOT_TILE`, x: 0, y: 1, layerIndex: 0, tileIndex: 99})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual([0, 0, 99, 0])

  store.dispatch({type: `PLOT_GROUP_BEGIN`})
  store.dispatch({type: `PLOT_TILE`, x: 0, y: 0, layerIndex: 0, tileIndex: 88})
  store.dispatch({type: `PLOT_TILE`, x: 1, y: 0, layerIndex: 0, tileIndex: 88})
  store.dispatch({type: `PLOT_TILE`, x: 1, y: 1, layerIndex: 0, tileIndex: 88})
  store.dispatch({type: `PLOT_GROUP_END`})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual([88, 88, 99, 88])

  store.dispatch({type: `UNDO`})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual([0, 0, 99, 0])

  store.dispatch({type: `UNDO`})
  expect(store.getState().map.tileLayers[0].tileIndexGrid).toEqual([0, 0, 0, 0])
}

