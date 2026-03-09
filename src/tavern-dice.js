export function createTavernDiceState() {
  return {
    isActive: false,
    pot: 0,
    currentRoll: null,
    streak: 0,
    wager: 0,
    message: 'Welcome to the High-Low Dice Game! Place your wager.',
  };
}

export function startTavernDice(state, wagerAmount) {
  if ((state.player.gold || 0) < wagerAmount || wagerAmount <= 0) {
    return {
      ...state,
      tavernDice: {
        ...(state.tavernDice || createTavernDiceState()),
        message: 'Not enough gold to place that wager.',
      }
    };
  }

  const seed = state.rngSeed || Date.now();
  const firstRoll = (Math.abs(seed) % 6) + 1;

  return {
    ...state,
    player: { ...state.player, gold: state.player.gold - wagerAmount },
    rngSeed: (seed * 48271) % 2147483647,
    tavernDice: {
      isActive: true,
      pot: wagerAmount,
      currentRoll: firstRoll,
      streak: 0,
      wager: wagerAmount,
      message: `You wagered ${wagerAmount}g. The starting roll is a ${firstRoll}. Higher or Lower?`,
    }
  };
}

export function guessTavernDice(state, guess) {
  if (!state.tavernDice?.isActive) return state;

  const seed = state.rngSeed || Date.now();
  const nextRoll = (Math.abs(seed) % 6) + 1;
  const nextRngSeed = (seed * 48271) % 2147483647;

  const prevRoll = state.tavernDice.currentRoll;
  let won = false;

  if (guess === 'higher' && nextRoll > prevRoll) won = true;
  if (guess === 'lower' && nextRoll < prevRoll) won = true;

  if (won) {
    const newStreak = state.tavernDice.streak + 1;
    const newPot = state.tavernDice.pot * 2;
    return {
      ...state,
      rngSeed: nextRngSeed,
      tavernDice: {
        ...state.tavernDice,
        currentRoll: nextRoll,
        pot: newPot,
        streak: newStreak,
        message: `Rolled ${nextRoll}! Correct! Pot is now ${newPot}g. Streak: ${newStreak}.`,
      }
    };
  } else {
    return {
      ...state,
      rngSeed: nextRngSeed,
      tavernDice: {
        isActive: false,
        pot: 0,
        currentRoll: null,
        streak: 0,
        wager: 0,
        message: `Rolled ${nextRoll}. You guessed wrong! You lost the pot.`,
      }
    };
  }
}

export function cashOutTavernDice(state) {
  if (!state.tavernDice?.isActive) return state;

  let finalPot = state.tavernDice.pot;

  if (state.tavernDice.streak >= 3) {
    finalPot = Math.floor(finalPot * 1.5);
  }

  const houseCut = Math.floor(finalPot * 0.05);
  const winnings = finalPot - houseCut;

  return {
    ...state,
    player: {
      ...state.player,
      gold: (state.player.gold || 0) + winnings
    },
    tavernDice: {
      isActive: false,
      pot: 0,
      currentRoll: null,
      streak: 0,
      wager: 0,
      message: `Cashed out! House took ${houseCut}g. You received ${winnings}g.`,
    }
  };
}
