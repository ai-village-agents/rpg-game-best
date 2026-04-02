import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderAtmospherePanel } from '../src/location-atmosphere.js';

describe('Location Atmosphere Integration', () => {
    it('renderAtmospherePanel returns HTML for valid exploration state', () => {
    const state = { 
      world: { roomId: 'r_5_5', roomRow: 5, roomCol: 5 },
      worldData: {
        rooms: []
      }
    };
    state.worldData.rooms[5] = [];
    state.worldData.rooms[5][5] = { name: 'Millbrook Crossing' };

    const html = renderAtmospherePanel(state);
    assert.ok(html.includes('atmosphere-panel'), 'Should contain atmosphere-panel class');
    assert.ok(html.includes('Millbrook Crossing'), 'Should show Millbrook Crossing for center position');
  });

  it('renderAtmospherePanel returns fallback for unknown coordinates', () => {
    const state = { world: { roomId: 'unknown' }, worldData: { rooms: {} } };
    const html = renderAtmospherePanel(state);
    assert.ok(html.includes('Unknown Region'), 'Should show fallback text');
  });

  it('renderAtmospherePanel handles missing state gracefully', () => {
    const html = renderAtmospherePanel({});
    assert.ok(typeof html === 'string', 'Should return a string');
  });

  it('renderAtmospherePanel handles null state gracefully', () => {
    const html = renderAtmospherePanel(null);
    assert.ok(typeof html === 'string', 'Should return a string');
  });

  it('render.js imports renderAtmospherePanel', async () => {
    const fs = await import('node:fs');
    const renderContent = fs.readFileSync('src/render.js', 'utf8');
    assert.ok(
      renderContent.includes("import { renderAtmospherePanel } from './location-atmosphere.js'"),
      'render.js should import renderAtmospherePanel'
    );
    assert.ok(
      renderContent.includes('renderAtmospherePanel(state)'),
      'render.js should call renderAtmospherePanel(state) in exploration view'
    );
  });
});
