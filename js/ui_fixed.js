// UI Management System
class UI {
  static notificationCount = 0;

  static updateDisplay() {
    document.getElementById("level").textContent = gameState.level;
    document.getElementById("tickets").textContent = gameState.tickets;
    document.getElementById("eggCount").textContent = gameState.eggs.length;
    document.getElementById("totalClicks").textContent = gameState.totalClicks.toLocaleString();

    // 레벨 진행률 표시 (퍼센트만)
    const currentExp = gameState.getCurrentLevelExp();
    const requiredExp = gameState.getExpToNextLevel();
    const progressPercent = Math.max(0, Math.floor((currentExp / requiredExp) * 100));
    
    const expProgressElement = document.getElementById("expProgress");
    if (expProgressElement) {
      expProgressElement.textContent = `${progressPercent}%`;
    }

    // Combo 표시 - 단계별 색상과 이펙트
    const comboElement = document.getElementById("combo");
    if (comboElement && gameState.combo > 0) {
      const expBonus = gameState.getComboExpBonus();
      comboElement.textContent = `${gameState.combo}x (+${expBonus}%)`;
      
      // 콤보 단계별 색상 설정
      if (gameState.combo >= 100) {
        comboElement.style.color = "#ff00ff"; // 무지개색 (마젠타)
        comboElement.style.textShadow = "0 0 10px #ff00ff, 0 0 20px #ff00ff";
      } else if (gameState.combo >= 50) {
        comboElement.style.color = "#ff0000"; // 빨간색
        comboElement.style.textShadow = "0 0 8px #ff0000";
      } else if (gameState.combo >= 25) {
        comboElement.style.color = "#ff8800"; // 주황색
        comboElement.style.textShadow = "0 0 6px #ff8800";
      } else if (gameState.combo >= 10) {
        comboElement.style.color = "#ffdd00"; // 노란색
        comboElement.style.textShadow = "0 0 4px #ffdd00";
      } else {
        comboElement.style.color = "#ffffff"; // 흰색
        comboElement.style.textShadow = "none";
      }
    } else if (comboElement) {
      comboElement.textContent = "0x";
      comboElement.style.color = "#666";
      comboElement.style.textShadow = "none";
    }

    // 새로운 UI 업데이트 함수들 호출
    this.updateComboDisplay();
    this.updateExpBar();

    gameState.checkUnlocks();
    this.updateRarityDisplay();
    this.updateGachaButton();
    this.updateCodexProgress();
  }

  // Update Combo Display
  static updateComboDisplay() {
    const comboDisplay = document.getElementById("comboDisplay");
    const comboCount = document.querySelector(".combo-count");
    const comboBonus = document.querySelector(".combo-bonus");
    
    if (gameState.combo > 0) {
      comboDisplay.style.display = "block";
      const luckyBonus = gameState.getComboLuckyBonus();
      comboCount.textContent = `🔥 ${gameState.combo}x COMBO`;
      comboBonus.textContent = `+${(luckyBonus * 100).toFixed(2)}% Luck`;
      
      // 콤보 단계별 애니메이션 효과
      comboDisplay.classList.remove("combo-hit", "combo-burst", "combo-epic");
      
      if (gameState.combo >= 100) {
        comboDisplay.classList.add("combo-epic");
        comboDisplay.style.animation = "comboGlow 1s ease-in-out infinite";
      } else if (gameState.combo >= 50) {
        comboDisplay.classList.add("combo-burst");
        comboDisplay.style.animation = "comboGlow 1.5s ease-in-out infinite";
      } else if (gameState.combo >= 10) {
        comboDisplay.classList.add("combo-hit");
        comboDisplay.style.animation = "comboGlow 2s ease-in-out infinite";
      } else {
        comboDisplay.style.animation = "none";
        setTimeout(() => {
          comboDisplay.style.animation = "comboGlow 2s ease-in-out infinite";
        }, 50);
      }
    } else {
      comboDisplay.style.display = "none";
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
    if (gameState.eggs.length === 0) {
      rarityBar.textContent = "Start hunting to discover rare eggs!";
      rarityBar.style.background = "linear-gradient(90deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 60, 0.9), rgba(0, 0, 0, 0.8))";
      return;
    }

    const rarityCounts = {};
    gameState.eggs.forEach(egg => {
      rarityCounts[egg.rarity] = (rarityCounts[egg.rarity] || 0) + 1;
    });

    const rarest = Object.keys(rarityCounts).reduce((a, b) => 
      GAME_CONFIG.rarities.indexOf(a) > GAME_CONFIG.rarities.indexOf(b) ? a : b
    );
    
    const rarityIndex = GAME_CONFIG.rarities.indexOf(rarest);
    const color = GAME_CONFIG.rarityColors[rarityIndex];
    
    rarityBar.textContent = `Rarest Discovery: ${rarest} (${rarityCounts[rarest]}x collected)`;
    rarityBar.style.background = `linear-gradient(90deg, ${color}20, ${color}40, ${color}20)`;
    rarityBar.style.borderColor = color;
  }

  static updateGachaButton() {
    const btn = document.getElementById("gachaBtn");
    btn.textContent = `🎰 Open Gacha (${gameState.tickets})`;
    btn.disabled = gameState.tickets === 0;
    
    console.log("🛠️ DEBUG: Updating gacha button - tickets:", gameState.tickets);
  }

  static updateCodexProgress() {
    const allEggTypes = Object.values(EGG_TYPES).flat();
    const discovered = [...new Set(gameState.eggs.map(egg => egg.name))];
    const progressElement = document.getElementById("codexProgress");
    
    if (progressElement) {
      const percentage = Math.floor((discovered.length / allEggTypes.length) * 100);
      progressElement.textContent = `Progress: ${discovered.length}/${allEggTypes.length} (${percentage}%)`;
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
      this.updateCodex();
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  }

  static updateCodex() {
    const codexContent = document.getElementById("codexContent");
    const fragment = document.createDocumentFragment();
    
    // Group eggs by rarity
    const eggsByRarity = {};
    gameState.eggs.forEach(egg => {
      if (!eggsByRarity[egg.rarity]) {
        eggsByRarity[egg.rarity] = {};
      }
      eggsByRarity[egg.rarity][egg.name] = (eggsByRarity[egg.rarity][egg.name] || 0) + 1;
    });
    
    // Create sections for each rarity with eggs
    GAME_CONFIG.rarities.forEach((rarity, rarityIdx) => {
      if (!eggsByRarity[rarity]) return;
      
      const section = document.createElement("div");
      section.className = "rarity-section";
      
      const header = document.createElement("h3");
      header.className = "rarity-header";
      header.style.color = GAME_CONFIG.rarityColors[rarityIdx];
      header.textContent = `${rarity} (${Object.keys(eggsByRarity[rarity]).length} types)`;
      
      const grid = document.createElement("div");
      grid.className = "egg-grid";
      
      Object.entries(eggsByRarity[rarity]).forEach(([name, count]) => {
        const item = document.createElement("div");
        item.className = "egg-item";
        item.style.borderColor = GAME_CONFIG.rarityColors[rarityIdx];
        
        const img = document.createElement("img");
        img.src = EGG_IMAGES[rarityIdx];
        img.alt = name;
        img.className = "egg-image";
        
        const info = document.createElement("div");
        info.className = "egg-info";
        info.innerHTML = `
          <div class="egg-name" style="color: ${GAME_CONFIG.rarityColors[rarityIdx]}">${name}</div>
          <div class="egg-rarity">${rarity}</div>
        `;
        
        if (count > 1) {
          const countBadge = document.createElement("div");
          countBadge.className = "count-badge";
          countBadge.textContent = `x${count}`;
          countBadge.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: ${GAME_CONFIG.rarityColors[rarityIdx]};
            color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            border: 1px solid ${GAME_CONFIG.rarityColors[rarityIdx]};
          `;
          item.appendChild(countBadge);
        }
        
        item.appendChild(img);
        item.appendChild(info);
        grid.appendChild(item);
      });
      
      section.appendChild(header);
      section.appendChild(grid);
      fragment.appendChild(section);
    });
    
    codexContent.innerHTML = "";
    codexContent.appendChild(fragment);
    
    // Update progress bar
    this.updateCodexProgress();
  }
}

// 전역 함수로 노출 (HTML onclick 이벤트용)
window.UI = UI;
