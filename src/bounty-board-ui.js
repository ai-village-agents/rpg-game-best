export function renderBountyBoardPanel(state) {
  const bb = state.bountyBoard || { bounties: [], completed: 0, lastRefreshTime: 0 };
  
  let html = `<div class="bounty-board-panel card">`;
  html += `<h2>Tavern Bounty Board</h2>`;
  html += `<p class="tavern-message">Looking for work? Complete these bounties for gold.</p>`;
  html += `<p>Bounties Completed: <strong>${bb.completed}</strong></p>`;
  
  if (!bb.bounties || bb.bounties.length === 0) {
      html += `<p>No bounties available right now.</p>`;
      html += `<button data-action="REFRESH_BOUNTIES">Check Board</button>`;
      return html + `</div>`;
  }

  html += `<div class="bounties-list" style="margin-top: 15px; display: grid; gap: 10px;">`;
  
  
  
  bb.bounties.forEach(bounty => {
      let statusText = bounty.status;
      let buttonHtml = '';
      let style = 'border: 1px solid #ccc; padding: 10px; border-radius: 4px;';
      
      if (bounty.status === 'AVAILABLE') {
          buttonHtml = `<button data-action="ACCEPT_BOUNTY" data-id="${bounty.id}">Accept Bounty</button>`;
      } else if (bounty.status === 'ACTIVE') {
          
          style = 'border: 2px solid #ffaa00; padding: 10px; border-radius: 4px; background: rgba(255, 170, 0, 0.1);';
          statusText = `ACTIVE (${bounty.currentAmount} / ${bounty.targetAmount})`;
      } else if (bounty.status === 'COMPLETED') {
          style = 'border: 1px solid #00cc00; padding: 10px; border-radius: 4px; opacity: 0.7;';
      }

      html += `<div class="bounty-card" style="${style}">`;
      html += `<h3>${bounty.description}</h3>`;
      html += `<p>Reward: <strong>${bounty.reward}g</strong></p>`;
      html += `<p>Status: <strong>${statusText}</strong></p>`;
      
      if (buttonHtml) {
          html += `<div style="margin-top: 10px;">${buttonHtml}</div>`;
      }
      html += `</div>`;
  });
  
  html += `</div>`;
  
  const now = Date.now();
  const timePassed = now - (bb.lastRefreshTime || 0) > 5 * 60 * 1000;
  const hasActiveOrAvailable = bb.bounties?.some(b => b.status === 'AVAILABLE' || b.status === 'ACTIVE');
  
  html += `<div class="buttons" style="margin-top: 20px;">`;
  if (timePassed || !hasActiveOrAvailable) {
      html += `<button data-action="REFRESH_BOUNTIES">Refresh Bounties</button>`;
  } else {
      const timeLeft = Math.ceil((5 * 60 * 1000 - (now - (bb.lastRefreshTime || 0))) / 1000 / 60);
      html += `<button disabled style="opacity: 0.5; cursor: not-allowed;">Refresh Bounties (${timeLeft}m cooldown)</button>`;
  }
  html += `</div>`;
  
  html += `</div>`;
  return html;
}
