import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { handleUIAction } from '../src/handlers/ui-handler.js';
import {
  recruitSporelingCompanion,
  getSporeling,
} from '../src/sporeling-integration.js';

const createBaseState = (overrides = {}) => ({
  phase: 'exploration',
  log: [],
  companions: [],
  player: { name: 'Hero' },
  ...overrides,
});

describe('Sporeling UI integration', () => {
  let baseState;

  beforeEach(() => {
    baseState = createBaseState();
  });

  it('OPEN_SPORELING sets phase to sporeling', () => {
    const result = handleUIAction(baseState, { type: 'OPEN_SPORELING' });
    assert.ok(result, 'handler should return new state');
    assert.strictEqual(result.phase, 'sporeling');
    assert.strictEqual(result.previousPhase, 'exploration');
  });

  it('CLOSE_SPORELING returns to previous phase', () => {
    const sporelingState = createBaseState({ phase: 'sporeling', previousPhase: 'quests' });
    const result = handleUIAction(sporelingState, { type: 'CLOSE_SPORELING' });

    assert.ok(result, 'handler should return new state');
    assert.strictEqual(result.phase, 'quests');
  });

  it('DISMISS_SPORELING removes the sporeling', () => {
    let withSporeling = recruitSporelingCompanion(baseState, 'Buddy');
    withSporeling = { ...withSporeling, phase: 'sporeling', previousPhase: 'exploration' };

    const result = handleUIAction(withSporeling, { type: 'DISMISS_SPORELING' });

    assert.ok(result, 'handler should return new state');
    assert.strictEqual(getSporeling(result), null, 'sporeling should be removed');
    assert.ok(result.log.length > withSporeling.log.length, 'dismissal should push a log entry');
  });

  it('handles invalid transitions gracefully', () => {
    const preAdventure = createBaseState({ phase: 'class-select' });
    const openDuringIntro = handleUIAction(preAdventure, { type: 'OPEN_SPORELING' });
    assert.strictEqual(openDuringIntro, null, 'should not open during pre-adventure');

    const notSporelingPhase = createBaseState({ phase: 'exploration' });
    const closeResult = handleUIAction(notSporelingPhase, { type: 'CLOSE_SPORELING' });
    assert.strictEqual(closeResult, null, 'should not close when not viewing sporeling');

    const dismissWithoutSporeling = handleUIAction(notSporelingPhase, { type: 'DISMISS_SPORELING' });
    assert.ok(dismissWithoutSporeling, 'dismiss without sporeling should still return state with log');
    assert.strictEqual(getSporeling(dismissWithoutSporeling), null);
    assert.ok(dismissWithoutSporeling.log.length > notSporelingPhase.log.length, 'should log missing sporeling message');
  });
});
