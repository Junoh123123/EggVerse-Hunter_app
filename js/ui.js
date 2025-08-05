// UI Management System
class UI {
  static notificationCount = 0;

  static updateDisplay() {
    document.getElementById("level").textContent = gameState.level;
    document.getElementById("totalClicks").textContent = gameState.totalClicks.toLocaleString();

    // 새로운 UI 업데이트 함수들 호출
    this.updateComboDisplay();
    this.updateExpBar();
    this.updateTicketBar();
    this.updateCodexProgress(); // Codex 버튼 텍스트 업데이트

    gameState.checkUnlocks();
    this.updateRarityDisplay();
    this.updateGachaButton();
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

  // Update Ticket Progress Bar
  static updateTicketBar() {
    const ticketBar = document.getElementById("ticketBar");
    const ticketText = document.getElementById("ticketText");
    
    if (ticketBar && ticketText) {
      const clicksToNext = gameState.totalClicks % GAME_CONFIG.ticketInterval;
      const remaining = GAME_CONFIG.ticketInterval - clicksToNext;
      const progressPercent = (clicksToNext / GAME_CONFIG.ticketInterval) * 100;
      
      ticketBar.style.width = `${progressPercent}%`;
      ticketText.textContent = `${remaining} clicks left`;
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
    
    // Codex 버튼 텍스트 업데이트
    const dexToggle = document.getElementById("dexToggle");
    if (dexToggle) {
      dexToggle.textContent = `📖 Egg Codex (${discoveredCount}/${allEggTypes.length})`;
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
    // 무한루프 방지
    if (this._updatingCodex) {
      console.log("🚫 updateCodex already running, skipping");
      return;
    }
    this._updatingCodex = true;
    
    const codexContent = document.getElementById("codexContent");
    if (!codexContent) {
      this._updatingCodex = false;
      return;
    }
    
    console.log("🛠️ DEBUG: Updating Codex, discovered eggs:", gameState.discoveredEggs.size);
    
    // Calculate egg quantities for each type
    const eggQuantities = {};
    gameState.eggs.forEach(egg => {
      const rarityName = typeof egg.rarity === 'number' ? GAME_CONFIG.rarities[egg.rarity] : egg.rarity;
      const eggKey = `${rarityName}-${egg.name}`;
      eggQuantities[eggKey] = (eggQuantities[eggKey] || 0) + 1;
    });
    
    console.log("🛠️ DEBUG: Egg quantities:", eggQuantities);
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    GAME_CONFIG.rarities.forEach((rarity, rarityIdx) => {
      const section = document.createElement("div");
      section.className = "rarity-section";
      
      const header = document.createElement("div");
      header.className = `rarity-header rarity-${rarity}`;
      header.style.cssText = `color: ${GAME_CONFIG.rarityColors[rarityIdx]}; border-color: ${GAME_CONFIG.rarityColors[rarityIdx]};`;
      
      const eggTypesForRarity = EGG_TYPES[rarity];
      const discoveredInRarity = eggTypesForRarity.filter(eggName => 
        gameState.discoveredEggs.has(`${rarity}-${eggName}`)
      ).length;
      
      header.innerHTML = `${rarity} <span class="rarity-progress">(${discoveredInRarity}/${eggTypesForRarity.length})</span>`;
      
      const grid = document.createElement("div");
      grid.className = "egg-grid";
      
      // Batch create all items for this rarity
      const gridFragment = document.createDocumentFragment();
      
      eggTypesForRarity.forEach(eggName => {
        const eggKey = `${rarity}-${eggName}`;
        const isDiscovered = gameState.discoveredEggs.has(eggKey);
        const quantity = eggQuantities[eggKey] || 0;
        
        const item = document.createElement("div");
        item.className = `egg-item ${isDiscovered ? 'discovered' : 'undiscovered'}`;
        item.style.borderColor = GAME_CONFIG.rarityColors[rarityIdx];
        
        const img = document.createElement("img");
        img.className = "egg-image";
        img.loading = "lazy";
        img.decoding = "async";
        
        if (isDiscovered) {
          img.src = EGG_IMAGES[rarityIdx];
          img.onerror = function() {
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23" + GAME_CONFIG.rarityColors[rarityIdx].substring(1) + "'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='12'%3E🥚%3C/text%3E%3C/svg%3E";
          };
        } else {
          // Silhouette for undiscovered eggs
          img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23333'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='%23666' font-size='14'%3E???%3C/text%3E%3C/svg%3E";
        }
        
        const info = document.createElement("div");
        info.className = "egg-info";
        
        // Show full egg names for better readability
        const shortName = isDiscovered ? eggName : '???';
        
        info.innerHTML = `
          <div class="egg-name" style="color: ${isDiscovered ? GAME_CONFIG.rarityColors[rarityIdx] : '#666'};">${shortName}</div>
        `;
        
        if (isDiscovered) {
          const badge = document.createElement("div");
          badge.className = "discovery-badge";
          badge.textContent = "✓";
          badge.style.cssText = `
            position: absolute;
            top: 1px;
            left: 1px;
            background: #00ff88;
            color: white;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.5rem;
            font-weight: bold;
            z-index: 10;
          `;
          item.appendChild(badge);
          
          if (quantity > 1) {
            const quantityBadge = document.createElement("div");
            quantityBadge.className = "quantity-badge";
            quantityBadge.textContent = quantity > 99 ? '99+' : quantity;
            quantityBadge.style.cssText = `
              position: absolute;
              top: 1px;
              right: 1px;
              background: ${GAME_CONFIG.rarityColors[rarityIdx]};
              color: white;
              border-radius: 8px;
              padding: 1px 4px;
              font-size: 0.4rem;
              font-weight: bold;
              z-index: 10;
              line-height: 1;
            `;
            item.appendChild(quantityBadge);
          }
        }
        
        item.appendChild(img);
        item.appendChild(info);
        gridFragment.appendChild(item);
      });
      
      grid.appendChild(gridFragment);
      section.appendChild(header);
      section.appendChild(grid);
      fragment.appendChild(section);
    });
    
    // Single DOM update instead of multiple
    codexContent.innerHTML = "";
    codexContent.appendChild(fragment);
    
    console.log("🛠️ DEBUG: Codex updated with pokedex style");
    
    // 무한루프 방지 플래그 해제
    this._updatingCodex = false;
  }
}

// 전역 함수로 노출 (HTML onclick 이벤트용)
window.UI = UI;
