// Main Game Controller
class GameController {
  static init() {
    this.setupEventListeners();
    this.loadGame();
    this.startAutoSave();
  }

  static setupEventListeners() {
    // Click button
    const clickBtn = document.getElementById("clickBtn");
    if (clickBtn) clickBtn.onclick = () => this.performClick(true);
    
    // Gacha button
    const gachaBtn = document.getElementById("gachaBtn");
    if (gachaBtn) gachaBtn.onclick = () => GachaSystem.spinGacha();
    
    // Auto click button
    const autoClickBtn = document.getElementById("autoClickBtn");
    if (autoClickBtn) autoClickBtn.onclick = () => this.toggleAutoClick();

    // Keyboard shortcuts
    window.onkeydown = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        this.performClick(true);
      }
      if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        GachaSystem.spinGacha();
      }
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        UI.toggleCodex();
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        UI.toggleRules();
      }
      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        if (gameState.autoClickUnlocked) this.toggleAutoClick();
      }
    };

    // Save on page unload
    window.addEventListener('beforeunload', () => gameState.save());
    
    // Initialize gacha button state immediately
    setTimeout(() => UI.updateGachaButton(), 0);
  }

  static performClick(showAnimation = true) {
    // Update combo system
    gameState.updateCombo();
    gameState.updateLastActiveTime();
    
    // Calculate experience with combo bonus
    const baseExp = 1;
    const comboBonus = gameState.getComboExpBonus();
    const totalExp = baseExp + Math.floor(baseExp * comboBonus / 100);
    
    gameState.experience += totalExp;
    gameState.totalClicks++;
    
    gameState.checkLevelUp();
    
    // Enhanced click animation with combo-based effects
    if (showAnimation) {
      const btn = document.getElementById("clickBtn");
      
      // 기존 애니메이션 클래스 제거
      btn.classList.remove("combo-hit", "combo-burst", "combo-epic");
      
      // 콤보 단계별 애니메이션 적용
      if (gameState.combo >= 50) {
        btn.classList.add("combo-epic");
      } else if (gameState.combo >= 25) {
        btn.classList.add("combo-burst");
      } else {
        btn.classList.add("combo-hit");
      }
      
      // 애니메이션 완료 후 클래스 제거
      setTimeout(() => {
        btn.classList.remove("combo-hit", "combo-burst", "combo-epic");
      }, 400);
    }
    
    // Enhanced instant gacha chance with combo bonus
    const baseLuckyChance = GAME_CONFIG.instantGachaChance;
    const comboLuckyBonus = gameState.getComboLuckyBonus();
    const totalLuckyChance = baseLuckyChance + comboLuckyBonus;
    
    if (rand() < totalLuckyChance) {
      GachaSystem.instantGacha();
    }
    
    // Ticket rewards (now every 1000 clicks)
    if (gameState.totalClicks % GAME_CONFIG.ticketInterval === 0) {
      gameState.tickets++;
      if (gameState.totalClicks % GAME_CONFIG.bonusTicketInterval === 0) {
        gameState.tickets++;
      }
      
      UI.showNotification(`🎫 Tickets Earned! (Total: ${gameState.tickets})`);
    }
    
    UI.updateDisplay();
    gameState.save();
  }

  static toggleAutoClick() {
    if (!gameState.autoClickUnlocked) return;
    
    const btn = document.getElementById("autoClickBtn");
    
    if (gameState.autoClickInterval) {
      clearInterval(gameState.autoClickInterval);
      gameState.autoClickInterval = null;
      btn.classList.remove("active");
      btn.textContent = "⚡ Auto Hunt";
      UI.showNotification("🛑 Auto Hunt Stopped");
    } else {
      gameState.autoClickInterval = setInterval(() => {
        this.performClick(false);
      }, 3000);
      btn.classList.add("active");
      btn.textContent = "🛑 Stop Auto";
      UI.showNotification("⚡ Auto Hunt Started! (Every 3 seconds)");
    }
    
    // Update UI to reflect auto hunt status
    UI.updateDisplay();
  }

  static loadGame() {
    const gameLoaded = gameState.load();

    // Collection system removed - no longer need to restore gallery display

    // Show auto-click button if unlocked
    if (gameState.autoClickUnlocked) {
      document.getElementById("autoClickBtn").style.display = "inline-block";
    }

    UI.initialize();

    if (gameLoaded) {
      UI.showNotification("🎮 Game loaded successfully!");
    }
  }

  static startAutoSave() {
    setInterval(() => gameState.save(), GAME_CONFIG.autoSaveInterval);
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  GameController.init();
});
