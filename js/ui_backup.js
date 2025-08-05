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
      comboElement.style.color = "#ffffff";
      comboElement.style.textShadow = "none";
    }

    // 새로운 UI 업데이트 함수들 호출
    this.updateComboDisplay();
    this.updateExpBar();
      } else if (gameState.combo >= 25) {
        comboElement.style.color = "#ff6b35"; // 주황색
        comboElement.style.textShadow = "0 0 6px #ff6b35";
      } else if (gameState.combo >= 10) {
        comboElement.style.color = "#ffcc02"; // 노란색
        comboElement.style.textShadow = "0 0 4px #ffcc02";
      } else {
        comboElement.style.color = "#ffffff"; // 흰색
        comboElement.style.textShadow = "none";
      }
    } else {
      comboElement.textContent = "0x";
      comboElement.style.color = "#666";
      comboElement.style.textShadow = "none";
    }

    gameState.checkUnlocks();
    this.updateRarityDisplay();
    this.updateGachaButton();
    this.updateCodexProgress();
  }

  static initialize() {
    this.updateDisplay();
    
    // Check for idle rewards on first load
    this.checkIdleRewards();
  }

  static checkIdleRewards() {
    const idleReward = gameState.calculateIdleReward();
    if (idleReward && idleReward.periods > 0) {
      // Show idle reward modal or notification
      const claimReward = confirm(`💤 Welcome back! You were away for ${idleReward.hours} hours.\n\nIdle Rewards (${idleReward.periods} periods):\n+${idleReward.experience} EXP\n+${idleReward.tickets} Tickets\n\nClaim rewards?`);
      
      if (claimReward) {
        gameState.claimIdleReward();
        this.updateDisplay();
      } else {
        gameState.updateLastActiveTime(); // Reset timer without claiming
      }
    }
  }

  static updateRarityDisplay() {
    const counts = GAME_CONFIG.rarities.map((_, i) => 
      gameState.eggs.filter(e => e.rarity === i).length
    );
    
    let rarityText = "";
    if (gameState.eggs.length > 0) {
      const nonZeroRarities = counts.map((c, i) => c > 0 ? {
        text: `${GAME_CONFIG.rarities[i]} ${c}`,
        color: GAME_CONFIG.rarityColors[i]
      } : null).filter(Boolean);
      
      if (nonZeroRarities.length > 0) {
        rarityText = nonZeroRarities.map(r => 
          `<span style="color: ${r.color}; font-weight: bold;">${r.text}</span>`
        ).join(" | ");
      } else {
        rarityText = "No eggs collected yet";
      }
    } else {
      rarityText = "Start hunting to discover rare eggs!";
    }
    document.getElementById("rarityBar").innerHTML = rarityText;
  }

  static updateGachaButton() {
    const gachaBtn = document.getElementById("gachaBtn");
    console.log(`🛠️ DEBUG: Updating gacha button - tickets: ${gameState.tickets}`);
    
    gachaBtn.disabled = gameState.tickets <= 0;
    gachaBtn.textContent = gameState.tickets > 0 ? 
      `🎰 Open Gacha (${gameState.tickets})` : "🎰 No Tickets";
  }

  static updateCodexProgress() {
    const totalEggs = Object.values(EGG_TYPES).flat().length;
    const discoveredCount = gameState.discoveredEggs.size;
    const percentage = Math.floor((discoveredCount / totalEggs) * 100);
    
    const progressElement = document.getElementById("codexProgress");
    if (progressElement) {
      progressElement.textContent = `Progress: ${discoveredCount}/${totalEggs} (${percentage}%)`;
      
      if (percentage >= 100) {
        progressElement.style.color = "#ffd700";
      } else if (percentage >= 75) {
        progressElement.style.color = "#ff6b35";
      } else if (percentage >= 50) {
        progressElement.style.color = "#4caf50";
      } else {
        progressElement.style.color = "#a1887f";
      }
    }
  }

  static showNotification(message) {
    this.notificationCount++;
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: ${20 + (this.notificationCount * 80)}px;
      right: 20px;
      background: linear-gradient(45deg, rgba(0, 0, 0, 0.9), rgba(30, 30, 60, 0.9));
      border: 2px solid #00ff88;
      color: #00ff88;
      padding: 15px 25px;
      border-radius: 12px;
      z-index: 1000;
      font-size: 0.9rem;
      font-weight: 700;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
      max-width: 350px;
      word-wrap: break-word;
      font-family: 'Orbitron', monospace;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
            this.notificationCount = Math.max(0, this.notificationCount - 1);
          }
        }, 300);
      }
    }, 2500);
  }

  // Modal management

  static toggleCodex() {
    const modal = document.getElementById("codexModal");
    if (!modal) {
      console.error("Codex modal not found!");
      return;
    }
    
    const isOpen = modal.style.display !== "none";
    
    if (isOpen) {
      modal.style.opacity = "0";
      modal.style.transform = "scale(0.8) translateY(-30px)";
      setTimeout(() => {
        modal.style.display = "none";
        modal.style.opacity = "";
        modal.style.transform = "";
      }, 200);
    } else {
      modal.style.display = "flex";
      if (window.requestIdleCallback) {
        requestIdleCallback(() => this.updateCodex(), { timeout: 100 });
      } else {
        setTimeout(() => this.updateCodex(), 0);
      }
    }
  }

  static toggleRules() {
    let modal = document.getElementById("rulesModal");
    
    if (!modal) {
      // 모달이 없으면 생성
      modal = document.createElement("div");
      modal.id = "rulesModal";
      modal.className = "modal";
      modal.style.display = "none";
      
      const modalContent = document.createElement("div");
      modalContent.className = "modal-content";
      
      const modalHeader = document.createElement("div");
      modalHeader.className = "modal-header";
      
      const title = document.createElement("h3");
      title.textContent = "🎮 Game Rules";
      
      const closeBtn = document.createElement("span");
      closeBtn.className = "close-btn";
      closeBtn.innerHTML = "&times;";
      closeBtn.onclick = () => this.toggleRules();
      
      modalHeader.appendChild(title);
      modalHeader.appendChild(closeBtn);
      
      const rulesContent = document.createElement("div");
      rulesContent.className = "rules-content";
      rulesContent.innerHTML = `
        <p>🥚 Click to hunt eggs and gain experience</p>
        <p>📈 Level up for bonus rewards and new features</p>
        <p>🎫 Earn tickets every 100 clicks for gacha spins</p>
        <p>🎰 Use gacha tickets for guaranteed rare egg discoveries</p>
        <p>🔥 Combo system boosts experience with consecutive clicks</p>
        <p>📚 Collect eggs to fill your Pokédex-style codex</p>
        <p>💎 8 rarity tiers: Common → Galactic (most rare)</p>
        <p>🆕 New discoveries give bonus experience</p>
        <p>💤 Idle rewards when returning after time away</p>
        
        <div class="shortcuts">
          <h4>🎮 Keyboard Shortcuts</h4>
          <div class="shortcut-grid">
            <div>SPACE/ENTER</div><div>Hunt Eggs</div>
            <div>G</div><div>Open Gacha</div>
            <div>D</div><div>Toggle Codex</div>
            <div>R</div><div>Toggle Rules</div>
            <div>A</div><div>Auto Hunt</div>
          </div>
        </div>
        
        <div class="exp-table">
          <h4>🎯 Level Bonuses</h4>
          <div class="exp-grid">
            <div>Level 5, 7, 13, 16</div><div>+3 Tickets</div>
            <div>Level 19, 22, 26</div><div>+5 Tickets</div>
            <div>Level 30, 34, 39</div><div>+10 Tickets</div>
            <div>Level 45, 50</div><div>+100 Tickets</div>
          </div>
        </div>
      `;
      
      modalContent.appendChild(modalHeader);
      modalContent.appendChild(rulesContent);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // 모달 외부 클릭시 닫기
      modal.onclick = (e) => {
        if (e.target === modal) {
          this.toggleRules();
        }
      };
    }
    
    const isOpen = modal.style.display !== "none";
    
    if (isOpen) {
      modal.style.opacity = "0";
      modal.style.transform = "scale(0.8) translateY(-30px)";
      setTimeout(() => {
        modal.style.display = "none";
        modal.style.opacity = "";
        modal.style.transform = "";
      }, 200);
    } else {
      modal.style.display = "flex";
    }
  }

  static updateCodex() {
    const codexContent = document.getElementById("codexContent");
    if (!codexContent) return;
    
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
      grid.className = "codex-grid";
      
      eggTypesForRarity.forEach(eggName => {
        const eggKey = `${rarity}-${eggName}`;
        const discovered = gameState.discoveredEggs.has(eggKey);
        
        // Count how many of this specific egg type the player has
        const eggCount = gameState.eggs.filter(egg => 
          egg.rarity === rarityIdx && egg.name === eggName
        ).length;
        
        const item = document.createElement("div");
        item.className = `codex-item ${discovered ? `rarity-${rarity}` : 'undiscovered'}`;
        item.style.position = 'relative';
        
        const img = document.createElement("img");
        img.className = "codex-egg-img";
        img.src = discovered ? EGG_IMAGES[rarityIdx] : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Pz88L3RleHQ+PC9zdmc+";
        img.alt = discovered ? eggName : "???";
        img.loading = "lazy";
        
        const info = document.createElement("div");
        info.className = "codex-egg-info";
        info.textContent = discovered ? `${eggName} EGG` : "???";
        
        // Add count badge if discovered and player has multiples
        if (discovered && eggCount > 1) {
          const countBadge = document.createElement("div");
          countBadge.className = "egg-count-badge";
          countBadge.textContent = `×${eggCount}`;
          countBadge.style.cssText = `
            position: absolute;
            bottom: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
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
}

// 전역 함수로 노출 (HTML onclick 이벤트용)
window.UI = UI;
