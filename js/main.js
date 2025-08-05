// Main Game Controller
class GameController {
  static init() {
    this.setupEventListeners();
    this.setupMobileOptimizations();
    this.loadGame();
    this.startAutoSave();
  }

  static setupMobileOptimizations() {
    // 모바일 스크롤 방지
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // 더블탭 줌 방지만 처리 (터치 이벤트는 최소한으로)
      let lastTouchEnd = 0;
      document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
      
      // 핀치 줌 방지 (모든 영역에서)
      document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
      
      document.addEventListener('touchmove', function(e) {
        // 핀치 줌 방지
        if (e.touches.length > 1) {
          e.preventDefault();
          return;
        }
        
        // 스크롤이 필요한 영역은 허용
        if (!e.target.closest('.modal-content') && 
            !e.target.closest('#eggBox') && 
            !e.target.closest('.codex-scroll') &&
            !e.target.closest('.rules-content') &&
            !e.target.closest('button') &&
            !e.target.closest('.controls')) {
          if (e.target === document.body || 
              e.target === document.documentElement ||
              e.target.classList.contains('container')) {
            e.preventDefault();
          }
        }
      }, { passive: false });
      
      // 제스처 이벤트 방지 (추가 보안)
      document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
      }, false);
      
      document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
      }, false);
      
      document.addEventListener('gestureend', function(e) {
        e.preventDefault();
      }, false);
    }
    
    // Hunt Eggs 버튼을 항상 기본 큰 상태로 유지 (클릭 시만 제외)
    const clickBtn = document.getElementById("clickBtn");
    if (clickBtn) {
      // 기본 스타일을 큰 상태로 설정하되 클릭 효과는 방해하지 않음
      const ensureLargeButton = () => {
        // 현재 클릭 중이 아닐 때만 큰 상태로 설정
        if (!clickBtn.style.transform.includes("0.95")) {
          clickBtn.style.transform = "scale(1) translate3d(0,0,0)";
        }
      };
      
      // 페이지 로드시 즉시 적용
      ensureLargeButton();
      
      // DOM이 변경될 때마다 확인 (하지만 클릭 효과는 방해하지 않음)
      setTimeout(ensureLargeButton, 500);
      
      // 주기적으로 확인해서 버튼이 작아지지 않도록 보장 (클릭 중이 아닐 때만)
      setInterval(() => {
        if (!clickBtn.style.transform.includes("0.95")) {
          ensureLargeButton();
        }
      }, 2000);
    }
  }

  static setupEventListeners() {
    // Click button - 모바일 터치와 마우스 클릭 모두 지원
    const clickBtn = document.getElementById("clickBtn");
    if (clickBtn) {
      // 마우스 클릭
      clickBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.performClick(true);
      });
      
      // 터치 이벤트 (모바일)
      clickBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.performClick(true);
      }, { passive: false });
      
      // 키보드 접근성
      clickBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.performClick(true);
        }
      });
    }
    
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
    
    // Enhanced click animation with combo-based effects and button shrink
    if (showAnimation) {
      const btn = document.getElementById("clickBtn");
      
      // 버튼 클릭 시 즉시 shrink 효과 적용
      btn.style.transform = "scale(0.95) translate3d(0,0,0)";
      btn.style.transition = "transform 0.1s ease";
      
      // 짧은 시간 후 원래 크기로 복원
      setTimeout(() => {
        btn.style.transform = "scale(1) translate3d(0,0,0)";
        btn.style.transition = "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-position 0.3s ease";
      }, 100);
      
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
