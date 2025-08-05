// Game State Management
class GameState {
  constructor() {
    this.experience = 0;
    this.level = 1;
    this.tickets = 0;
    this.totalClicks = 0;
    this.idleRewardUnlocked = false;
    this.comboMasterUnlocked = false;
    this.eggs = [];
    this.discoveredEggs = new Set();
    this.claimedRewards = new Set(); // 받은 보상 추적
    
    // Combo system
    this.combo = 0;
    this.lastClickTime = 0;
    this.comboTimeout = null;
    
    // Idle reward system
    this.lastActiveTime = Date.now();
    this.totalIdleTime = 0;
  }

  // Reset all game data
  reset() {
    this.experience = 0;
    this.level = 1;
    this.tickets = 0;
    this.totalClicks = 0;
    this.idleRewardUnlocked = false;
    this.comboMasterUnlocked = false;
    this.eggs = [];
    this.discoveredEggs = new Set();
    this.claimedRewards = new Set(); // 받은 보상 초기화
    this.combo = 0;
    this.lastClickTime = 0;
    this.comboTimeout = null;
    this.lastActiveTime = Date.now();
    this.totalIdleTime = 0;
  }

  // Level system functions
  getRequiredExp(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  getCurrentLevelExp() {
    let totalExp = 0;
    for (let i = 1; i < this.level; i++) {
      totalExp += this.getRequiredExp(i);
    }
    return this.experience - totalExp;
  }

  getExpToNextLevel() {
    return this.getRequiredExp(this.level);
  }

  checkLevelUp() {
    const currentExp = this.getCurrentLevelExp();
    const requiredExp = this.getExpToNextLevel();
    
    if (currentExp >= requiredExp) {
      this.level++;
      
      // 기본 레벨업 보상 (티켓 1개)
      this.tickets += 1;
      UI.showNotification(`🎉 Level ${this.level} Reached! +1 Ticket`);
      
      this.checkUnlocks();
      return true;
    }
    return false;
  }

  // Unlock system
  checkUnlocks() {
    const unlocks = GAME_CONFIG.unlocks;
    
    if (!this.idleRewardUnlocked && this.level >= unlocks.idleReward) {
      this.idleRewardUnlocked = true;
      UI.showNotification("🔓 Idle Rewards Unlocked! Get rewards while away!");
      this.save();
    }
    
    if (!this.comboMasterUnlocked && this.level >= unlocks.comboMaster) {
      this.comboMasterUnlocked = true;
      UI.showNotification("🔥 COMBO MASTER UNLOCKED! Enhanced combo system activated!");
      this.save();
    }
    
    // 보너스 보상 체크
    this.checkBonusRewards();
  }
  
  checkBonusRewards() {
    // 새로운 레벨별 보상 시스템 - 중복 보상 방지
    const levelReward = GAME_CONFIG.levelRewards[this.level];
    
    console.log(`🛠️ DEBUG: Level ${this.level} - Checking rewards:`, levelReward);
    console.log(`🛠️ DEBUG: Already claimed levels:`, Array.from(this.claimedRewards));
    
    if (levelReward && !this.claimedRewards.has(this.level)) {
      this.claimedRewards.add(this.level);
      this.tickets += levelReward.tickets;
      console.log(`🎉 DEBUG: Level reward claimed! +${levelReward.tickets} tickets`);
      UI.showNotification(`🎁 Level ${this.level} Reward! ${levelReward.name} +${levelReward.tickets} Tickets!`);
      this.save();
    }
  }

  // Combo system
  updateCombo() {
    const now = Date.now();
    const decayTime = this.comboMasterUnlocked ? GAME_CONFIG.comboDecayTimeMaster : GAME_CONFIG.comboDecayTime;
    const maxCombo = this.comboMasterUnlocked ? GAME_CONFIG.maxComboMaster : GAME_CONFIG.maxCombo;
    
    const timeSinceLastClick = now - this.lastClickTime;
    
    if (timeSinceLastClick > decayTime) {
      this.combo = 0;
    }
    
    this.combo = Math.min(this.combo + 1, maxCombo);
    this.lastClickTime = now;
    
    // Reset combo timeout
    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout);
    }
    
    this.comboTimeout = setTimeout(() => {
      this.combo = 0;
      UI.updateDisplay();
    }, decayTime);
  }

  getComboLuckyBonus() {
    const maxCombo = this.comboMasterUnlocked ? GAME_CONFIG.maxComboMaster : GAME_CONFIG.maxCombo;
    const maxBonus = this.comboMasterUnlocked ? GAME_CONFIG.maxComboLuckyBonusMaster : GAME_CONFIG.maxComboLuckyBonus;
    
    const comboRatio = this.combo / maxCombo;
    return comboRatio * maxBonus;
  }

  getComboExpBonus() {
    const maxCombo = this.comboMasterUnlocked ? GAME_CONFIG.maxComboMaster : GAME_CONFIG.maxCombo;
    const comboRatio = this.combo / maxCombo;
    return Math.floor(comboRatio * GAME_CONFIG.maxComboExpBonus);
  }

  // Idle reward system
  calculateIdleReward() {
    if (!this.idleRewardUnlocked) return null;
    
    const now = Date.now();
    const idleTime = Math.min(now - this.lastActiveTime, GAME_CONFIG.maxIdleTime);
    const rewardPeriods = Math.floor(idleTime / GAME_CONFIG.idleRewardInterval); // 4시간마다
    
    if (rewardPeriods > 0) {
      const baseReward = rewardPeriods * this.level * 2; // 4시간마다 (레벨 * 2) EXP
      const ticketReward = rewardPeriods; // 4시간마다 1티켓
      const hours = Math.floor(idleTime / (1000 * 60 * 60)); // 실제 시간 표시용
      
      return {
        experience: baseReward,
        tickets: ticketReward,
        hours: hours,
        periods: rewardPeriods
      };
    }
    
    return null;
  }

  claimIdleReward() {
    const reward = this.calculateIdleReward();
    console.log(`🛠️ DEBUG: Claiming idle reward:`, reward);
    console.log(`🛠️ DEBUG: Before claim - tickets: ${this.tickets}`);
    
    if (reward) {
      this.experience += reward.experience;
      this.tickets += reward.tickets;
      this.lastActiveTime = Date.now();
      
      console.log(`🛠️ DEBUG: After claim - tickets: ${this.tickets}`);
      
      UI.showNotification(`💤 Idle Reward: +${reward.experience} EXP, +${reward.tickets} Tickets (${reward.hours}h)`);
      this.checkLevelUp();
      this.save(); // 상태 저장
      UI.updateDisplay(); // UI 즉시 업데이트
      return true;
    }
    return false;
  }

  updateLastActiveTime() {
    this.lastActiveTime = Date.now();
  }

  // Save/Load system
  save() {
    const gameState = {
      experience: this.experience,
      level: this.level,
      tickets: this.tickets,
      totalClicks: this.totalClicks,
      eggs: this.eggs.map(egg => ({
        rarity: egg.rarity,
        name: egg.name,
        img: egg.img
      })),
      discoveredEggs: Array.from(this.discoveredEggs),
      claimedRewards: Array.from(this.claimedRewards), // 받은 보상 저장
      idleRewardUnlocked: this.idleRewardUnlocked,
      comboMasterUnlocked: this.comboMasterUnlocked,
      combo: this.combo,
      lastActiveTime: this.lastActiveTime,
      lastSaved: Date.now()
    };
    
    try {
      localStorage.setItem('eggVerseHunter_save', JSON.stringify(gameState));
    } catch (e) {
      console.warn('Failed to save game state:', e);
    }
  }

  load() {
    try {
      const saved = localStorage.getItem('eggVerseHunter_save');
      if (!saved) return false;
      
      const gameState = JSON.parse(saved);
      
      this.experience = gameState.experience || 0;
      this.level = gameState.level || 1;
      this.tickets = gameState.tickets || 0;
      this.totalClicks = gameState.totalClicks || 0;
      this.idleRewardUnlocked = gameState.idleRewardUnlocked || false;
      this.comboMasterUnlocked = gameState.comboMasterUnlocked || false;
      this.combo = gameState.combo || 0;
      this.lastActiveTime = gameState.lastActiveTime || Date.now();
      
      if (gameState.eggs) {
        this.eggs.length = 0;
        this.eggs.push(...gameState.eggs);
      }
      
      if (gameState.discoveredEggs) {
        this.discoveredEggs.clear();
        gameState.discoveredEggs.forEach(egg => this.discoveredEggs.add(egg));
      }
      
      if (gameState.claimedRewards) {
        this.claimedRewards.clear();
        gameState.claimedRewards.forEach(level => this.claimedRewards.add(level));
      }
      
      return true;
    } catch (e) {
      console.warn('Failed to load game state:', e);
      return false;
    }
  }
}

// Global game state instance
const gameState = new GameState();
