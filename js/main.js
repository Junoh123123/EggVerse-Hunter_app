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
    
    // 디버깅용 로그 (매 100번째 클릭마다)
    if (gameState.totalClicks % 100 === 0) {
      console.log(`[Lucky Drop Debug] Clicks: ${gameState.totalClicks}, Combo: ${gameState.combo}, Base: ${baseLuckyChance}, Bonus: ${comboLuckyBonus}, Total: ${totalLuckyChance}`);
    }
    
    const randomRoll = rand();
    if (randomRoll < totalLuckyChance) {
      console.log(`[Lucky Drop] SUCCESS! Roll: ${randomRoll}, Chance: ${totalLuckyChance}`);
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
    
    // 방치 보상 자동 체크 (게임 로드 후 1초 뒤)
    setTimeout(() => {
      if (gameState.idleRewardUnlocked) {
        const idleReward = gameState.calculateIdleReward();
        if (idleReward && idleReward.tickets > 0) {
          // 방치 보상 모달 표시
          this.showIdleRewardModal(idleReward);
        }
      }
    }, 1000);
  }

  static showIdleRewardModal(reward) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content" style="text-align: center; max-width: 400px;">
        <div class="modal-header">
          <h3>😴 Welcome Back!</h3>
        </div>
        <div style="padding: 20px;">
          <p>🕐 You were away for <strong>${reward.hours} hours</strong></p>
          <div style="margin: 20px 0; padding: 15px; background: rgba(0,212,255,0.1); border-radius: 10px;">
            <p>✨ <strong>+${reward.experience} EXP</strong></p>
            <p>🎫 <strong>+${reward.tickets} Tickets</strong></p>
          </div>
          <button onclick="gameState.claimIdleReward(); this.parentElement.parentElement.parentElement.remove();" 
                  style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
            Collect Rewards
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  static startAutoSave() {
    setInterval(() => gameState.save(), GAME_CONFIG.autoSaveInterval);
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  GameController.init();
});
