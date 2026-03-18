import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { handleInventoryAction } from '../src/inventory.js';
import { handleProvisionAction } from '../src/handlers/provisions-handler.js';
import { handleSystemAction } from '../src/handlers/system-handler.js';

const uiHandlerSource = readFileSync('src/handlers/ui-handler.js', 'utf8');

test('GO_BACK delegates inventory close to CLOSE_INVENTORY', () => {
  assert.match(
    uiHandlerSource,
    /if \(state\.phase === 'inventory'\)\s*\{\s*return handleInventoryAction\(state, \{ type: 'CLOSE_INVENTORY' \}\);/m,
  );
});

test('GO_BACK closes inventory to inventoryState.returnPhase (via CLOSE_INVENTORY delegate)', () => {
  const state = { phase: 'inventory', inventoryState: { returnPhase: 'victory' }, log: [] };
  const next = handleInventoryAction(state, { type: 'CLOSE_INVENTORY' });

  assert.ok(next);
  assert.equal(next.phase, 'victory');
  assert.equal(next.inventoryState, undefined);
  assert.equal(next.log.at(-1), 'Closed inventory.');
});

test('GO_BACK delegates provisions close to CLOSE_PROVISIONS', () => {
  assert.match(
    uiHandlerSource,
    /if \(state\.phase === 'provisions'\)\s*\{\s*return handleProvisionAction\(state, \{ type: 'CLOSE_PROVISIONS' \}\);/m,
  );
});

test('GO_BACK closes provisions to previousPhase (via CLOSE_PROVISIONS delegate)', () => {
  const state = {
    phase: 'provisions',
    previousPhase: 'town',
    provisionsUI: { tab: 'use', message: null, selectedProvision: null },
  };
  const next = handleProvisionAction(state, { type: 'CLOSE_PROVISIONS' });

  assert.ok(next);
  assert.equal(next.phase, 'town');
  assert.equal(next.provisionsUI, undefined);
});

test('GO_BACK routes shop to CLOSE_SHOP (which uses shopState.previousPhase)', () => {
  assert.match(uiHandlerSource, /shop: 'CLOSE_SHOP'/);
  assert.match(uiHandlerSource, /const returnPhase = state\.shopState\?\.previousPhase \|\| 'exploration';/);
});

test('GO_BACK routes statistics-dashboard to CLOSE_STATISTICS_DASHBOARD (which uses previousPhase)', () => {
  assert.match(uiHandlerSource, /'statistics-dashboard': 'CLOSE_STATISTICS_DASHBOARD'/);
  assert.match(uiHandlerSource, /if \(type === 'CLOSE_STATISTICS_DASHBOARD'\)[\s\S]*phase: state\.previousPhase \|\| 'exploration'/);
});

test('GO_BACK closes save-slots to exploration via handleSystemAction', () => {
  const state = {
    phase: 'save-slots',
    saveSlotMode: 'save',
    saveSlots: [],
    log: [],
  };

  const next = handleSystemAction(state, { type: 'GO_BACK' });

  assert.ok(next);
  assert.equal(next.phase, 'exploration');
  assert.equal(next.saveSlotMode, 'save');
});
