export function getHelpStyles() {
  return `
    .help-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--overlay-bg);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .help-modal {
      background: var(--bg);
      border: 2px solid var(--border);
      padding: 20px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      color: var(--text);
      font-family: monospace;
      box-shadow: 0 0 20px var(--overlay-bg);
    }
    .help-modal h2 {
      margin-top: 0;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      color: var(--text);
    }
    .help-section {
      margin-bottom: 20px;
    }
    .help-section h3 {
      color: var(--muted);
      margin-bottom: 8px;
    }
    .key-list {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 16px;
    }
    .key-badge {
      background: var(--border);
      border: 1px solid var(--dim-text);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
      color: var(--text);
      display: inline-block;
      text-align: center;
      min-width: 20px;
    }
    .close-help-btn {
      margin-top: 20px;
      padding: 8px 16px;
      background: var(--border);
      color: white;
      border: none;
      cursor: pointer;
      width: 100%;
    }
    .close-help-btn:hover {
      background: var(--dim-text);
    }
    .help-tip {
      background: var(--card);
      border-left: 3px solid var(--accent);
      padding: 8px 12px;
      margin-top: 15px;
      font-size: 0.9em;
      color: var(--accent);
    }
  `;
}

export function renderHelpModal() {
  return `
    <div class="help-overlay">
      <div class="help-modal">
        <h2>Game Controls & Help</h2>
        
        <div class="help-section">
          <h3>Movement</h3>
          <div class="key-list">
            <div><span class="key-badge">W</span> / <span class="key-badge">↑</span></div>
            <div>Move North</div>
            
            <div><span class="key-badge">S</span> / <span class="key-badge">↓</span></div>
            <div>Move South</div>
            
            <div><span class="key-badge">A</span> / <span class="key-badge">←</span></div>
            <div>Move West</div>
            
            <div><span class="key-badge">D</span> / <span class="key-badge">→</span></div>
            <div>Move East</div>
          </div>
        </div>

        <div class="help-section">
          <h3>Quick Access</h3>
          <div class="key-list">
            <div><span class="key-badge">B</span></div>
            <div>Open Bestiary</div>
            
            <div><span class="key-badge">?</span> / <span class="key-badge">H</span></div>
            <div>Toggle Help Menu</div>
          </div>
        </div>

        <div class="help-section">
          <h3>Combat</h3>
          <div class="key-list">
            <div><span class="key-badge">Click</span></div>
            <div>Select Actions & Targets</div>
          </div>
          <p style="color:var(--dim-text);font-size:0.9em;margin-top:8px;">
            Hover over abilities to see damage, MP cost, and effects.
            Use the battle log to track combat events.
          </p>
        </div>

        <div class="help-section">
          <h3>Game Systems</h3>
          <p style="color:var(--muted);font-size:0.9em;">
            <b>Shield/Break:</b> Enemies have elemental shields. Hit weaknesses to break shields and deal bonus damage!<br><br>
            <b>Companions:</b> Recruit allies to fight alongside you. Build loyalty through combat and gifts.<br><br>
            <b>Crafting:</b> Combine materials to create powerful equipment and consumables.<br><br>
            <b>Quests:</b> Accept quests from NPCs to earn rewards and reputation.
          </p>
        </div>

        <div class="help-section">
          <h3>Tutorial Progress</h3>
          <p style="color:var(--muted);font-size:0.9em;">
            Track your tutorial progress, view completed steps, and re-enable hints.
          </p>
          <button id="btnViewTutorialProgress" class="close-help-btn">View Tutorial Progress</button>
        </div>

        <div class="help-tip">
          💡 <b>Tip:</b> Check the Bestiary to learn enemy weaknesses and plan your strategy!
        </div>

        <button id="btnHelpClose" class="close-help-btn">Close</button>
      </div>
    </div>
  `;
}

export function attachHelpHandlers(dispatch) {
  const btn = document.getElementById('btnHelpClose');
  if (btn) {
    btn.onclick = () => dispatch({ type: 'CLOSE_HELP' });
  }

  const tutorialBtn = document.getElementById('btnViewTutorialProgress');
  if (tutorialBtn) {
    tutorialBtn.onclick = () => dispatch({ type: 'VIEW_TUTORIAL_PROGRESS' });
  }
  
  // Also close on overlay click
  const overlay = document.querySelector('.help-overlay');
  if (overlay) {
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        dispatch({ type: 'CLOSE_HELP' });
      }
    };
  }
}
