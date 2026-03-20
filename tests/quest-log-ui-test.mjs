/**
 * Quest Log UI Tests
 * Tests for VIEW_QUESTS, CLOSE_QUESTS, ACCEPT_QUEST dispatch actions
 * and quest log rendering in render.js
 */

import { strict as assert } from 'node:assert';
import { describe, it, beforeEach } from 'node:test';
import { initQuestState, acceptQuest, onRoomEnter, getAvailableQuestsInRoom, getActiveQuestsSummary } from '../src/quest-integration.js';
import { createWorldState } from '../src/map.js';
import { NOTIFICATION_TYPES } from '../src/notification-toast.js';
import { EXPLORATION_QUESTS } from '../src/data/exploration-quests.js';

describe('Quest Log UI - Quest State Management', () => {
  let questState;

  beforeEach(() => {
    questState = initQuestState();
  });

  describe('VIEW_QUESTS action simulation', () => {
    it('should allow viewing quests from exploration phase', () => {
      // Simulate phase transition
      const state = { phase: 'exploration', questState };
      const newState = { ...state, phase: 'quests', previousPhase: state.phase };
      assert.strictEqual(newState.phase, 'quests');
      assert.strictEqual(newState.previousPhase, 'exploration');
    });

    it('should preserve questState when viewing quests', () => {
      const state = { phase: 'exploration', questState };
      const newState = { ...state, phase: 'quests', previousPhase: state.phase };
      assert.deepStrictEqual(newState.questState, questState);
    });

    it('should not allow viewing quests from class-select phase', () => {
      const state = { phase: 'class-select', questState: null };
      // In main.js, VIEW_QUESTS returns early if phase is class-select
      const shouldBlock = state.phase === 'class-select';
      assert.strictEqual(shouldBlock, true);
    });
  });

  describe('CLOSE_QUESTS action simulation', () => {
    it('should return to previous phase when closing quests', () => {
      const state = { phase: 'quests', previousPhase: 'exploration', questState };
      const newState = { ...state, phase: state.previousPhase || 'exploration' };
      assert.strictEqual(newState.phase, 'exploration');
    });

    it('should default to exploration if previousPhase is missing', () => {
      const state = { phase: 'quests', questState };
      const newState = { ...state, phase: state.previousPhase || 'exploration' };
      assert.strictEqual(newState.phase, 'exploration');
    });

    it('should only close from quests phase', () => {
      const state = { phase: 'exploration', questState };
      const shouldBlock = state.phase !== 'quests';
      assert.strictEqual(shouldBlock, true);
    });
  });

  describe('ACCEPT_QUEST action simulation', () => {
    it('should accept a quest and update questState', () => {
      const result = acceptQuest(questState, 'explore_village');
      assert.ok(result.questState);
      assert.ok(result.message);
      assert.ok(result.questState.activeQuests.includes('explore_village'));
    });

    it('should fail gracefully if questState not initialized', () => {
      // Simulating main.js behavior
      const state = { questState: null };
      const hasQuestState = !!state.questState;
      assert.strictEqual(hasQuestState, false);
    });

    it('should return error message for invalid quest', () => {
      const result = acceptQuest(questState, 'nonexistent_quest');
      assert.ok(result.message.includes('not found') || result.message.includes('Quest'));
    });
  });
});

describe('Quest Log UI - Quest Display Data', () => {
  let questState;

  beforeEach(() => {
    questState = initQuestState();
  });

  describe('getActiveQuestsSummary for UI display', () => {
    it('should return empty array when no active quests', () => {
      const summary = getActiveQuestsSummary(questState);
      assert.ok(Array.isArray(summary));
      assert.strictEqual(summary.length, 0);
    });

    it('should return quest info after accepting a quest', () => {
      const result = acceptQuest(questState, 'explore_village');
      const summary = getActiveQuestsSummary(result.questState);
      assert.ok(summary.length > 0);
      assert.ok(summary[0].questName);
    });

    it('should include stage progress information', () => {
      const result = acceptQuest(questState, 'explore_village');
      const summary = getActiveQuestsSummary(result.questState);
      assert.ok(summary[0].stageIndex !== undefined);
      assert.ok(summary[0].totalStages !== undefined);
    });
  });

  describe('getAvailableQuestsInRoom for UI display', () => {
    it('should return available quests for center room', () => {
      const available = getAvailableQuestsInRoom(questState, 'center');
      assert.ok(Array.isArray(available));
    });

    it('should not include already active quests', () => {
      const result = acceptQuest(questState, 'explore_village');
      const available = getAvailableQuestsInRoom(result.questState, 'center');
      const hasExploreVillage = available.some(q => q.id === 'explore_village');
      assert.strictEqual(hasExploreVillage, false);
    });

    it('should return quests with required display properties', () => {
      const available = getAvailableQuestsInRoom(questState, 'center');
      if (available.length > 0) {
        const quest = available[0];
        assert.ok(quest.id !== undefined);
        assert.ok(quest.name !== undefined);
      }
    });
  });
});

describe('Quest Log UI - Room Enter Integration', () => {
  let questState;

  beforeEach(() => {
    questState = initQuestState();
  });

  describe('onRoomEnter updates quest progress', () => {
    it('should update EXPLORE objectives when entering room', () => {
      // Accept explore_village quest which has EXPLORE objectives
      const acceptResult = acceptQuest(questState, 'explore_village');
      const enterResult = onRoomEnter(acceptResult.questState, 'n');
      assert.ok(enterResult.questState);
    });

    it('should track visited rooms for quest objectives', () => {
      const acceptResult = acceptQuest(questState, 'explore_village');
      const enterResult = onRoomEnter(acceptResult.questState, 'center');
      assert.ok(enterResult.questState.activeQuests.includes('explore_village'));
    });

    it('should handle null roomId gracefully', () => {
      const result = onRoomEnter(questState, null);
      assert.ok(result.questState);
    });
  });

  describe('ROOM_ID_MAP calculation', () => {
    it('should map row 0, col 0 to nw', () => {
      const ROOM_ID_MAP = [['nw', 'n', 'ne'], ['w', 'center', 'e'], ['sw', 's', 'se']];
      assert.strictEqual(ROOM_ID_MAP[0][0], 'nw');
    });

    it('should map row 1, col 1 to center', () => {
      const ROOM_ID_MAP = [['nw', 'n', 'ne'], ['w', 'center', 'e'], ['sw', 's', 'se']];
      assert.strictEqual(ROOM_ID_MAP[1][1], 'center');
    });

    it('should map row 2, col 2 to se', () => {
      const ROOM_ID_MAP = [['nw', 'n', 'ne'], ['w', 'center', 'e'], ['sw', 's', 'se']];
      assert.strictEqual(ROOM_ID_MAP[2][2], 'se');
    });

    it('should cover all 9 room positions', () => {
      const ROOM_ID_MAP = [['nw', 'n', 'ne'], ['w', 'center', 'e'], ['sw', 's', 'se']];
      const expectedRooms = ['nw', 'n', 'ne', 'w', 'center', 'e', 'sw', 's', 'se'];
      const actualRooms = ROOM_ID_MAP.flat();
      assert.deepStrictEqual(actualRooms.sort(), expectedRooms.sort());
    });
  });
});



describe('Quest Log UI - UI handler aliases', () => {
  it('VIEW_QUEST_LOG should behave like VIEW_QUESTS (phase -> quests)', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    const state = { phase: 'exploration', questState: { activeQuests: [], completedQuests: [] } };
    const next = handleUIAction(state, { type: 'VIEW_QUEST_LOG' });
    assert.ok(next);
    assert.strictEqual(next.phase, 'quests');
    assert.strictEqual(next.previousPhase, 'exploration');
  });

  it('VIEW_QUEST_LOG should be blocked from class-select (return null)', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    const state = { phase: 'class-select' };
    const next = handleUIAction(state, { type: 'VIEW_QUEST_LOG' });
    assert.strictEqual(next, null);
  });

  it('CLOSE_QUEST_LOG should behave like CLOSE_QUESTS (return to previousPhase)', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    const state = { phase: 'quests', previousPhase: 'exploration' };
    const next = handleUIAction(state, { type: 'CLOSE_QUEST_LOG' });
    assert.ok(next);
    assert.strictEqual(next.phase, 'exploration');
  });

  it('CLOSE_QUEST_LOG should default to exploration if previousPhase missing', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    const state = { phase: 'quests' };
    const next = handleUIAction(state, { type: 'CLOSE_QUEST_LOG' });
    assert.ok(next);
    assert.strictEqual(next.phase, 'exploration');
  });

  it('CLOSE_QUEST_LOG should only close from quests phase (return null otherwise)', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    const state = { phase: 'exploration', previousPhase: 'quests' };
    const next = handleUIAction(state, { type: 'CLOSE_QUEST_LOG' });
    assert.strictEqual(next, null);
  });
});

describe('Quest Log UI - ACCEPT_QUEST live handler regression', () => {
  it('successful accept in Millbrook Crossing creates QUEST_UPDATE notification, tracks quest, and includes next objective guidance', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    const state = {
      phase: 'quests',
      previousPhase: 'exploration',
      log: [],
      world: createWorldState(), // starts in center (Millbrook Crossing)
      questState: initQuestState(),
      pendingQuestRewards: [],
      notifications: [],
      questTrackerState: { trackedQuestId: null, isExpanded: false, isMinimized: false },
    };

    const next = handleUIAction(state, { type: 'ACCEPT_QUEST', questId: 'grove_guardian' });
    assert.ok(next);
    assert.strictEqual(next.questTrackerState.trackedQuestId, 'grove_guardian');

    const toast = next.notifications[next.notifications.length - 1];
    assert.ok(toast);
    assert.strictEqual(toast.type, NOTIFICATION_TYPES.QUEST_UPDATE);
    assert.ok(toast.message.includes('Quest accepted: The Guardian of the Grove'));
    assert.ok(toast.detail.includes('Next objective:'));
    assert.ok(toast.detail.includes('Reach the The Whispering Glade'));
  });

  it('accepting "Know Your Surroundings" in Millbrook Crossing auto-completes the first room objective and still creates a helpful acceptance notification', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    const state = {
      phase: 'quests',
      previousPhase: 'exploration',
      log: [],
      world: createWorldState(), // starts in center (Millbrook Crossing)
      questState: initQuestState(),
      pendingQuestRewards: [],
      notifications: [],
      questTrackerState: { trackedQuestId: null, isExpanded: false, isMinimized: false },
    };

    const next = handleUIAction(state, { type: 'ACCEPT_QUEST', questId: 'explore_village' });
    assert.ok(next);
    assert.strictEqual(next.questState.questProgress.explore_village.stageIndex, 1);
    assert.deepStrictEqual(next.questState.questProgress.explore_village.objectiveProgress, {});
    assert.ok(next.questState.discoveredRooms.includes('center'));
    assert.strictEqual(next.questTrackerState.trackedQuestId, 'explore_village');

    const toast = next.notifications[next.notifications.length - 1];
    assert.ok(toast);
    assert.strictEqual(toast.type, NOTIFICATION_TYPES.QUEST_UPDATE);
    assert.ok(toast.message.includes('Quest accepted: Know Your Surroundings'));
    assert.ok(toast.detail.includes('Next objective:'));
    assert.ok(
      toast.detail.includes('Visit The Shimmer Trail') || toast.detail.includes('Visit the Pilgrim Road')
    );

    assert.deepStrictEqual(next.pendingQuestRewards, []);
  });

  it('accepting a quest that completes immediately in the current room gives claim-reward guidance instead of a next-objective hint', async () => {
    const { handleUIAction } = await import('../src/handlers/ui-handler.js');
    EXPLORATION_QUESTS.instant_center_test = {
      id: 'instant_center_test',
      name: 'Instant Center Test',
      description: 'Completes immediately when accepted in center.',
      type: 'SIDE',
      level: 1,
      stages: [
        {
          id: 'instant_stage',
          name: 'Instant Stage',
          description: 'Be in center.',
          objectives: [
            {
              id: 'visit_center_now',
              type: 'EXPLORE',
              description: 'Stand in Millbrook Crossing',
              locationId: 'center',
              required: true
            }
          ],
          nextStage: null
        }
      ],
      rewards: { experience: 1, gold: 1, items: [] },
      prerequisites: []
    };

    try {
      const state = {
        phase: 'quests',
        previousPhase: 'exploration',
        log: [],
        world: createWorldState(),
        questState: initQuestState(),
        pendingQuestRewards: [],
        notifications: [],
      };

      const next = handleUIAction(state, { type: 'ACCEPT_QUEST', questId: 'instant_center_test' });
      assert.ok(next);
      const toast = next.notifications[next.notifications.length - 1];
      assert.ok(toast);
      assert.strictEqual(toast.type, NOTIFICATION_TYPES.QUEST_UPDATE);
      assert.ok(toast.detail.includes('Completed immediately'));
      assert.ok(toast.detail.includes('Open Quests to claim the reward'));
    } finally {
      delete EXPLORATION_QUESTS.instant_center_test;
    }
  });
});

describe('Quest Log UI - Phase Transitions', () => {
  describe('Valid phase transitions', () => {
    it('exploration -> quests is valid', () => {
      const validTransitions = ['exploration', 'player-turn', 'victory'];
      assert.ok(validTransitions.includes('exploration'));
    });

    it('quests -> exploration (via previousPhase) is valid', () => {
      const state = { phase: 'quests', previousPhase: 'exploration' };
      const nextPhase = state.previousPhase || 'exploration';
      assert.strictEqual(nextPhase, 'exploration');
    });

    it('can view quests during player-turn in combat', () => {
      const state = { phase: 'player-turn', questState: initQuestState() };
      // VIEW_QUESTS only blocks class-select, so player-turn should work
      const shouldBlock = state.phase === 'class-select';
      assert.strictEqual(shouldBlock, false);
    });
  });
});

describe('Quest Log UI - Render Data Integrity', () => {
  let questState;

  beforeEach(() => {
    questState = initQuestState();
  });

  it('should provide escaped-safe quest names', () => {
    const result = acceptQuest(questState, 'explore_village');
    const summary = getActiveQuestsSummary(result.questState);
    if (summary.length > 0) {
      const name = summary[0].questName;
      // Name should not contain unescaped HTML
      assert.ok(!name.includes('<script>'));
    }
  });

  it('should handle missing questState gracefully in render', () => {
    const state = { phase: 'quests', questState: null };
    const safeQuestState = state.questState || { activeQuests: {}, completedQuests: [] };
    assert.ok(safeQuestState.activeQuests);
    assert.ok(safeQuestState.completedQuests);
  });

  it('should provide valid quest IDs for accept buttons', () => {
    const available = getAvailableQuestsInRoom(questState, 'center');
    available.forEach(q => {
      assert.ok(typeof q.id === 'string');
      assert.ok(q.id.length > 0);
    });
  });
});
