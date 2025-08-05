// Debug System - Only for development
class DebugSystem {
  static isDebugMode = false;
  static debugPanel = null;

  static init() {
    // Simple debug key: Ctrl + ` (backtick) only
    window.addEventListener('keydown', (e) => {
      // Ctrl + ` (backtick) for debug toggle
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        this.toggleDebugMode();
        console.log('🛠️ Ctrl+` Debug key pressed');
      }
    });
    
    // Console command for backup access
    window.debugToggle = () => {
      this.toggleDebugMode();
      console.log('🛠️ Debug toggled via console command');
    };
    
    console.log('🛠️ Debug system initialized. Use Ctrl+` to toggle debug mode');
    console.log('🛠️ Or type "debugToggle()" in console');
  }

  static toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode;
    
    if (this.isDebugMode) {
      this.showDebugPanel();
      console.log("🛠️ DEBUG MODE ACTIVATED");
    } else {
      this.hideDebugPanel();
      console.log("🛠️ DEBUG MODE DEACTIVATED");
    }
  }

  static showDebugPanel() {
    if (this.debugPanel) return;

    this.debugPanel = document.createElement('div');
    this.debugPanel.id = 'debugPanel';
    this.debugPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #ff0000;
      border-radius: 10px;
      padding: 15px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 9999;
      box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
    `;

    this.debugPanel.innerHTML = `
      <div style="color: #ff0000; font-weight: bold; margin-bottom: 10px;">
        🛠️ DEBUG PANEL<br>
        <small style="color: #ffff00;">Ctrl+Backtick to toggle | debugToggle() in console</small>
      </div>
      <button onclick="DebugSystem.addExp(1000)">+1000 EXP</button>
      <button onclick="DebugSystem.addTickets(10)">+10 Tickets</button><br><br>
      <button onclick="DebugSystem.setLevel(3)">Set Level 3</button>
      <button onclick="DebugSystem.setLevel(5)">Set Level 5</button>
      <button onclick="DebugSystem.setLevel(10)">Set Level 10</button><br><br>
      <button onclick="DebugSystem.setCombo(50)">Set Combo 50x</button>
      <button onclick="DebugSystem.setCombo(100)">Set Combo 100x</button><br><br>
      <button onclick="DebugSystem.addRareEgg()">Add GALACTIC Egg</button>
      <button onclick="DebugSystem.completeCodex()">Complete Codex</button><br><br>
      <button onclick="DebugSystem.simulateIdleTime()">Simulate 4h Idle</button><br><br>
      <button onclick="DebugSystem.clearSave()">Clear Save Data</button>
      <button onclick="DebugSystem.toggleDebugMode()" style="color: #ff0000;">Close</button>
    `;

    // Style all buttons
    const buttons = this.debugPanel.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.cssText = `
        margin: 2px;
        padding: 5px 8px;
        background: #333;
        color: #fff;
        border: 1px solid #666;
        border-radius: 3px;
        cursor: pointer;
        font-size: 10px;
      `;
    });

    document.body.appendChild(this.debugPanel);
  }

  static hideDebugPanel() {
    if (this.debugPanel) {
      document.body.removeChild(this.debugPanel);
      this.debugPanel = null;
    }
  }

  // Debug functions
  static addExp(amount) {
    gameState.experience += amount;
    gameState.checkLevelUp();
    UI.updateDisplay();
    console.log(`🛠️ Added ${amount} EXP`);
  }

  static addTickets(amount) {
    gameState.tickets += amount;
    UI.updateDisplay();
    console.log(`🛠️ Added ${amount} tickets`);
  }

  static setLevel(level) {
    gameState.level = level;
    gameState.experience = gameState.getRequiredExp(level);
    gameState.checkUnlocks();
    UI.updateDisplay();
    console.log(`🛠️ Set level to ${level}`);
  }

  static setCombo(combo) {
    gameState.combo = combo;
    gameState.lastClickTime = Date.now();
    UI.updateDisplay();
    console.log(`🛠️ Set combo to ${combo}x`);
  }

  static addRareEgg() {
    const rarity = 7; // GALACTIC
    const eggName = EGG_TYPES.GALACTIC[0];
    const imgUrl = EGG_IMAGES[rarity];
    const newEgg = { rarity: rarity, img: imgUrl, name: eggName };
    
    gameState.eggs.push(newEgg);
    const eggKey = `GALACTIC-${eggName}`;
    gameState.discoveredEggs.add(eggKey);
    
    UI.updateDisplay();
    console.log(`🛠️ Added GALACTIC egg: ${eggName}`);
  }

  static completeCodex() {
    Object.keys(EGG_TYPES).forEach(rarity => {
      EGG_TYPES[rarity].forEach(eggName => {
        const eggKey = `${rarity}-${eggName}`;
        gameState.discoveredEggs.add(eggKey);
      });
    });
    UI.updateDisplay();
    console.log(`🛠️ Completed entire codex`);
  }

  static simulateIdleTime() {
    const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000); // 4 hours ago
    gameState.lastActiveTime = fourHoursAgo;
    UI.checkIdleRewards();
    console.log(`🛠️ Simulated 4 hours of idle time`);
  }

  static clearSave() {
    if (confirm("⚠️ This will delete all save data. Continue?")) {
      localStorage.removeItem('eggVerseHunter_save');
      gameState.reset();
      UI.initialize();
      console.log("🛠️ Save data cleared and game reset");
    }
  }
}

// Initialize debug system
document.addEventListener('DOMContentLoaded', () => {
  DebugSystem.init();
});

// Expose to global for panel buttons
window.DebugSystem = DebugSystem;
