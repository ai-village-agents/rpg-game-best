import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderAreaScene, getAreaSceneStyles } from '../src/area-scene-renderer.js';

describe('Area Scene Renderer', () => {
  it('returns empty string when phase is not exploration', () => {
    const state = { phase: 'combat', world: { roomRow: 1, roomCol: 1 } };
    assert.equal(renderAreaScene(state), '');
  });

  it('returns empty string for null state', () => {
    assert.equal(renderAreaScene(null), '');
  });

  it('returns empty string for undefined state', () => {
    assert.equal(renderAreaScene(undefined), '');
  });

  it('returns empty string for missing world data', () => {
    const state = { phase: 'exploration' };
    assert.equal(renderAreaScene(state), '');
  });

    it('renders area scene for Millbrook Crossing', () => {
    const state = { 
      phase: 'exploration', 
      world: { roomId: 'r_5_5', roomRow: 5, roomCol: 5 },
      worldData: {
        rooms: []
      }
    };
    state.worldData.rooms[5] = [];
    state.worldData.rooms[5][5] = { name: 'Millbrook Crossing' };

    const html = renderAreaScene(state);
    assert.ok(html.includes('area-scene'), 'Should contain area-scene class');
    assert.ok(html.includes('data-room-name="Millbrook Crossing"'), 'Should identify center room');
    assert.ok(html.includes('Millbrook Crossing'), 'Should show Millbrook Crossing label');
  });

    it('player marker position uses state coordinates', () => {
    const state = {
      phase: 'exploration',
      world: { roomId: 'r_5_5', roomRow: 5, roomCol: 5, x: 3, y: 2 },
      worldData: {
        roomWidth: 4,
        roomHeight: 4,
        rooms: []
      },
    };
    state.worldData.rooms[5] = [];
    state.worldData.rooms[5][5] = { name: 'Millbrook Crossing', grid: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]] };
    
    const html = renderAreaScene(state);
    assert.ok(html.includes('area-player-marker'), 'Should have player marker');
    assert.ok(html.includes('left:'), 'Player marker should have left style');
    assert.ok(html.includes('bottom:'), 'Player marker should have bottom style');
  });

});

describe('Area Scene Styles', () => {
  it('returns a non-empty CSS string', () => {
    const css = getAreaSceneStyles();
    assert.ok(typeof css === 'string', 'Should return a string');
    assert.ok(css.length > 100, 'Should have substantial CSS content');
  });

  it('includes key CSS classes', () => {
    const css = getAreaSceneStyles();
    assert.ok(css.includes('.area-scene'), 'Should style .area-scene');
    assert.ok(css.includes('.area-scene-label'), 'Should style .area-scene-label');
    assert.ok(css.includes('.area-player-marker'), 'Should style .area-player-marker');
    assert.ok(css.includes('.area-scene-npc'), 'Should style .area-scene-npc');
  });

  it('includes exit lock styles', () => {
    const css = getAreaSceneStyles();
    assert.ok(css.includes('.area-scene-exit-lock'), 'Should style exit locks');
  });

  it('includes exit cue styles', () => {
    const css = getAreaSceneStyles();
    assert.ok(css.includes('.area-scene-exit-cue'), 'Should style exit cues');
    assert.ok(css.includes('.cue-ready'), 'Should style ready cues');
  });
});
