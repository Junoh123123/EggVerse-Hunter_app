// UI Management System
class UI {
  static notificationCount = 0;

  static updateDisplay() {
    document.getElementById("level").textContent = gameState.level;
    document.getElementById("tickets").textContent = gameState.tickets;
    document.getElementById("eggCount").textContent = gameState.eggs.length;
    document.getElementById("totalClicks").textContent = gameState.totalClicks.toLocaleString();

    // 새로운 UI 업데이트 함수들 호출
    this.updateComboDisplay();
    this.updateExpBar();

    gameState.checkUnlocks();
    this.updateRarityDisplay();
    this.updateGachaButton();
    // updateCodexProgress 제거 - 무한루프 방지
  }

  // Update Combo Display
  static updateComboDisplay() {
    const comboDisplay = document.getElementById("comboDisplay");
    const comboCount = document.querySelector(".combo-count");
    const comboBonus = document.querySelector(".combo-bonus");
    
    if (gameState.combo > 0) {
      comboDisplay.style.visibility = "visible";
      const luckyBonus = gameState.getComboLuckyBonus();
      comboCount.textContent = `🔥 ${gameState.combo}x COMBO`;
      comboBonus.textContent = `+${(luckyBonus * 100).toFixed(2)}% Luck`;
      
      // Color based on combo tier
      if (gameState.combo >= 50) {
        comboCount.style.color = "#ff0000";
        comboBonus.style.color = "#ff4444";
      } else if (gameState.combo >= 25) {
        comboCount.style.color = "#ff8800";
        comboBonus.style.color = "#ffaa44";
      } else if (gameState.combo >= 10) {
        comboCount.style.color = "#ffdd00";
        comboBonus.style.color = "#ffee77";
      } else {
        comboCount.style.color = "#ffffff";
        comboBonus.style.color = "#cccccc";
      }
    } else {
      comboDisplay.style.visibility = "hidden";
    }
  }

  // Update EXP Bar
  static updateExpBar() {
    const expBar = document.getElementById("expBar");
    const expText = document.getElementById("expText");
    
    if (expBar && expText) {
      const currentExp = gameState.getCurrentLevelExp();
      const requiredExp = gameState.getExpToNextLevel();
      const progressPercent = Math.max(0, (currentExp / requiredExp) * 100);
      
      expBar.style.width = `${progressPercent}%`;
      expText.textContent = `${currentExp} / ${requiredExp}`;
    }
  }

  static initialize() {
    this.updateDisplay();
    
    // Check for idle rewards on first load
    this.checkIdleRewards();
  }

  static checkIdleRewards() {
    if (gameState.level < GAME_CONFIG.unlocks.idleReward) return;
    
    const now = Date.now();
    const lastActive = gameState.lastActive || now;
    const timeDifference = now - lastActive;
    
    if (timeDifference > GAME_CONFIG.idleRewardInterval) {
      const eligibleTime = Math.min(timeDifference, GAME_CONFIG.maxIdleTime);
      const rewardCount = Math.floor(eligibleTime / GAME_CONFIG.idleRewardInterval);
      
      if (rewardCount > 0) {
        this.showNotification(`🌙 You were away! Earned ${rewardCount} idle reward tickets!`);
        gameState.tickets += rewardCount;
        this.updateDisplay();
      }
    }
    
    gameState.lastActive = now;
  }

  static updateRarityDisplay() {
    const rarityBar = document.getElementById("rarityBar");
    if (gameState.discoveredEggs.size === 0) {
      rarityBar.textContent = "Start hunting to discover rare eggs!";
      rarityBar.style.background = "linear-gradient(45deg, #333, #555)";
      return;
    }

    const rarestTier = this.getRarestDiscoveredTier();
    if (rarestTier) {
      const tierIndex = GAME_CONFIG.rarities.indexOf(rarestTier);
      const color = GAME_CONFIG.rarityColors[tierIndex];
      rarityBar.textContent = `🏆 Your Rarest Discovery: ${rarestTier} tier`;
      rarityBar.style.background = `linear-gradient(45deg, ${color}22, ${color}44)`;
      rarityBar.style.borderColor = color;
    }
  }

  static getRarestDiscoveredTier() {
    let rarestTier = null;
    let rarestIndex = -1;
    
    gameState.discoveredEggs.forEach(eggKey => {
      const [rarity] = eggKey.split('-');
      const index = GAME_CONFIG.rarities.indexOf(rarity);
      if (index > rarestIndex) {
        rarestIndex = index;
        rarestTier = rarity;
      }
    });
    
    return rarestTier;
  }

  static updateGachaButton() {
    const btn = document.getElementById("gachaBtn");
    btn.textContent = `🎰 Open Gacha (${gameState.tickets})`;
    btn.disabled = gameState.tickets === 0;
    
    console.log("🛠️ DEBUG: Updating gacha button - tickets:", gameState.tickets);
  }

  static updateCodexProgress() {
    // 무한루프 방지를 위한 플래그 체크
    if (this._updatingCodex) return;
    
    const allEggTypes = Object.values(EGG_TYPES).flat();
    const discoveredCount = gameState.discoveredEggs.size;
    const progressElement = document.getElementById("codexProgress");
    
    if (progressElement) {
      const percentage = Math.floor((discoveredCount / allEggTypes.length) * 100);
      progressElement.textContent = `Progress: ${discoveredCount}/${allEggTypes.length} (${percentage}%)`;
    }
  }

  static showNotification(message) {
    this.notificationCount++;
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: ${20 + (this.notificationCount - 1) * 60}px;
      right: 20px;
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
      z-index: 10000;
      font-family: 'Orbitron', monospace;
      font-size: 0.9rem;
      max-width: 300px;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
          this.notificationCount--;
        }
      }, 300);
    }, 3000);
  }

  static toggleRules() {
    const modal = document.getElementById("rulesModal");
    modal.style.display = modal.style.display === "none" ? "block" : "none";
  }

  static toggleCodex() {
    const modal = document.getElementById("codexModal");
    
    if (modal.style.display === "none" || modal.style.display === "") {
      modal.style.display = "block";
      // 모달이 열릴 때만 진행률 업데이트
      this.updateCodexProgress();
      this.updateCodex();
    } else {
      modal.style.display = "none";
    }
  }

  static updateCodex() {
    const codexContent = document.getElementById("codexContent");
    if (!codexContent) return;
    
    // 간단한 메시지만 표시하여 무한루프 방지
    codexContent.innerHTML = `
      <div style="text-align:center; padding:20px; color:#00ff88;">
        <h3>🥚 Egg Collection</h3>
        <p>발견한 알들이 여기에 표시됩니다.</p>
        <p>현재 ${gameState.discoveredEggs.size}개의 알을 발견했습니다!</p>
      </div>
    `;
  }
}

// 전역 함수로 노출 (HTML onclick 이벤트용)
window.UI = UI;
