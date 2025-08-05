// Gacha System
class GachaSystem {
  static pickRarity() {
    let roll = rand();
    let acc = 0;
    for (let i = 0; i < GAME_CONFIG.probs.length; i++) {
      acc += GAME_CONFIG.probs[i];
      if (roll < acc) return i;
    }
    return 0; // fallback to COMMON
  }

  static pickEggType(rarityIndex) {
    const rarityName = GAME_CONFIG.rarities[rarityIndex];
    const types = EGG_TYPES[rarityName];
    return types[Math.floor(Math.random() * types.length)];
  }

  static createEggElement(egg) {
    const container = document.createElement("div");
    container.className = `egg-item rarity-${GAME_CONFIG.rarities[egg.rarity]}`;
    container.style.cssText = `
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border: 2px solid ${GAME_CONFIG.rarityColors[egg.rarity]};
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      height: 140px;
      cursor: pointer;
      contain: layout style paint;
      backface-visibility: hidden;
      transform: translate3d(0,0,0);
    `;
    
    container.onmouseenter = () => {
      container.style.transform = "scale(1.05) translate3d(0,0,0)";
      container.style.boxShadow = `0 8px 25px ${GAME_CONFIG.rarityColors[egg.rarity]}40`;
    };
    
    container.onmouseleave = () => {
      container.style.transform = "scale(1) translate3d(0,0,0)";
      container.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
    };
    
    const img = document.createElement("img");
    img.style.cssText = `
      width: 100%;
      height: 70%;
      object-fit: cover;
      border-bottom: 2px solid ${GAME_CONFIG.rarityColors[egg.rarity]};
    `;
    img.src = egg.img;
    img.alt = egg.name;
    img.loading = "lazy";
    
    const rarityLabel = document.createElement("div");
    rarityLabel.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 8px;
      font-size: 0.8rem;
      font-weight: 900;
      text-align: center;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: 'Orbitron', monospace;
      line-height: 1.2;
      min-height: 45px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(180deg, transparent 0%, ${GAME_CONFIG.rarityColors[egg.rarity]}80 100%);
    `;
    rarityLabel.innerHTML = `<div style="font-size: 0.8rem;">${egg.name}</div><div>${GAME_CONFIG.rarities[egg.rarity]}</div>`;
    
    container.appendChild(img);
    container.appendChild(rarityLabel);
    
    return container;
  }

  static instantGacha() {
    // 럭키 드롭 전용 애니메이션 (일반 가챠 애니메이션과 분리)
    this.showLuckyDropAnimation(() => {
      const idx = this.pickRarity();
      const eggName = this.pickEggType(idx);
      const imgUrl = EGG_IMAGES[idx];
      const newEgg = { rarity: idx, img: imgUrl, name: eggName };
      gameState.eggs.push(newEgg);

      gameState.experience += GAME_CONFIG.expValues[idx];

      const eggKey = `${GAME_CONFIG.rarities[idx]}-${eggName}`;
      const isNewDiscovery = !gameState.discoveredEggs.has(eggKey);
      gameState.discoveredEggs.add(eggKey);

      // 포켓몬 도감 스타일 결과 표시 (Lucky Drop 표시)
      this.showGachaResult(newEgg, isNewDiscovery, true); // true = isLuckyDrop
      
      gameState.checkLevelUp();
      gameState.save();
      UI.updateDisplay();
    });
  }
  
  static showGachaAnimation(callback) {
    // 가챠 애니메이션 모달 생성
    const modal = document.createElement('div');
    modal.className = 'gacha-animation-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `;
    
    const gachaBox = document.createElement('div');
    gachaBox.style.cssText = `
      width: 300px;
      height: 400px;
      background: linear-gradient(45deg, #1a1a2e, #16213e);
      border: 3px solid #00ff88;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    `;
    
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shimmer 2s infinite;
    `;
    
    const title = document.createElement('h2');
    title.textContent = '🎲 GACHA TIME! 🎲';
    title.style.cssText = `
      color: #00ff88;
      font-family: 'Orbitron', monospace;
      margin-bottom: 30px;
      text-align: center;
      animation: pulse 1s infinite;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Rolling...';
    loadingText.style.cssText = `
      color: white;
      font-family: 'Orbitron', monospace;
      font-size: 1.5rem;
      animation: blink 1s infinite;
    `;
    
    gachaBox.appendChild(shimmer);
    gachaBox.appendChild(title);
    gachaBox.appendChild(loadingText);
    modal.appendChild(gachaBox);
    document.body.appendChild(modal);
    
    // 2초 후 결과 표시
    setTimeout(() => {
      document.body.removeChild(modal);
      callback();
    }, 2000);
  }
  
  static showLuckyDropAnimation(callback) {
    // 럭키 드롭 전용 애니메이션 (일반 가챠와 일관성 유지)
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 5000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `;
    
    const luckyBox = document.createElement('div');
    luckyBox.style.cssText = `
      width: 300px;
      height: 400px;
      background: linear-gradient(45deg, #FFD700, #FFA500);
      border: 3px solid #FFD700;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    `;
    
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      animation: shimmer 1.5s infinite;
    `;
    
    const title = document.createElement('h2');
    title.textContent = '🎲✨ LUCKY DROP! ✨🎲';
    title.style.cssText = `
      color: #333;
      font-family: 'Orbitron', monospace;
      margin-bottom: 30px;
      text-align: center;
      animation: rainbow 2s infinite;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Free Roll!';
    loadingText.style.cssText = `
      color: #333;
      font-family: 'Orbitron', monospace;
      font-size: 1.5rem;
      animation: luckyDropPulse 1s infinite;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    `;
    
    luckyBox.appendChild(shimmer);
    luckyBox.appendChild(title);
    luckyBox.appendChild(loadingText);
    modal.appendChild(luckyBox);
    document.body.appendChild(modal);
    
    // 1.5초 후 결과 표시 (일반 가챠보다 빠름)
    setTimeout(() => {
      document.body.removeChild(modal);
      callback();
    }, 1500);
  }
  
  static showGachaResult(egg, isNewDiscovery, isLuckyDrop = false) {
    // 포켓몬 도감 스타일 결과 모달
    const modal = document.createElement('div');
    modal.className = 'gacha-result-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.5s ease;
    `;
    
    const resultBox = document.createElement('div');
    resultBox.style.cssText = `
      width: 85%;
      max-width: 420px;
      height: auto;
      max-height: 80vh;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 3px solid ${GAME_CONFIG.rarityColors[egg.rarity]};
      border-radius: 15px;
      padding: 20px;
      color: white;
      font-family: 'Orbitron', monospace;
      position: relative;
      overflow-y: auto;
      animation: slideIn 0.5s ease;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      text-align: center;
      margin-bottom: 15px;
      width: 100%;
    `;
    
    // Lucky Drop 표시 추가
    if (isLuckyDrop) {
      const luckyBadge = document.createElement('div');
      luckyBadge.innerHTML = '🎲✨ LUCKY DROP ✨🎲';
      luckyBadge.style.cssText = `
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #333;
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 10px;
        display: inline-block;
        animation: rainbow 2s infinite;
        box-shadow: 0 3px 10px rgba(255, 215, 0, 0.5);
      `;
      header.appendChild(luckyBadge);
    }
    
    const discoveryStatus = document.createElement('h2');
    discoveryStatus.textContent = isNewDiscovery ? '🆕 NEW DISCOVERY!' : '🔄 ALREADY DISCOVERED';
    discoveryStatus.style.cssText = `
      color: ${isNewDiscovery ? '#00ff88' : '#ffd700'};
      margin-bottom: 10px;
      font-size: 1.3rem;
      text-align: center;
      animation: ${isNewDiscovery ? 'gentleCelebration' : 'pulse'} 1.5s infinite;
    `;
    
    const eggImage = document.createElement('img');
    eggImage.src = egg.img;
    eggImage.style.cssText = `
      width: 160px;
      height: 160px;
      border-radius: 50%;
      border: 4px solid ${GAME_CONFIG.rarityColors[egg.rarity]};
      margin: 15px auto;
      display: block;
      animation: float 2s ease-in-out infinite;
    `;
    
    const eggName = document.createElement('h1');
    eggName.textContent = `${egg.name} EGG`;
    eggName.style.cssText = `
      color: ${GAME_CONFIG.rarityColors[egg.rarity]};
      text-align: center;
      margin: 15px 0;
      font-size: 1.6rem;
    `;
    
    const rarityBadge = document.createElement('div');
    rarityBadge.textContent = GAME_CONFIG.rarities[egg.rarity];
    rarityBadge.style.cssText = `
      background: ${GAME_CONFIG.rarityColors[egg.rarity]};
      color: black;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      text-align: center;
      margin: 15px auto;
      width: fit-content;
      font-size: 0.9rem;
      animation: glow 2s ease-in-out infinite;
    `;
    
    const expGain = document.createElement('div');
    expGain.textContent = `+${GAME_CONFIG.expValues[egg.rarity]} EXP`;
    expGain.style.cssText = `
      color: #00ff88;
      text-align: center;
      font-size: 1.2rem;
      margin: 15px 0 20px 0;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Continue';
    closeButton.style.cssText = `
      margin-top: 15px;
      padding: 12px 24px;
      background: linear-gradient(45deg, #00ff88, #00d4ff);
      border: none;
      border-radius: 20px;
      color: black;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    `;
    
    closeButton.onmouseover = () => {
      closeButton.style.transform = 'scale(1.05)';
    };
    
    closeButton.onmouseout = () => {
      closeButton.style.transform = 'scale(1)';
    };
    
    closeButton.onclick = () => {
      document.body.removeChild(modal);
      // 가챠 버튼 재활성화 (모달 닫힐 때)
      const gachaBtn = document.getElementById('gachaBtn');
      if (gachaBtn) {
        gachaBtn.disabled = false;
      }
      
      // Hunt Eggs 버튼 상태 초기화
      const clickBtn = document.getElementById('clickBtn');
      if (clickBtn) {
        clickBtn.style.transform = '';
        clickBtn.style.boxShadow = '';
        clickBtn.classList.remove('combo-hit', 'combo-burst', 'combo-epic');
      }
      
      // UI 업데이트
      UI.updateDisplay();
    };
    
    header.appendChild(discoveryStatus);
    resultBox.appendChild(header);
    resultBox.appendChild(eggImage);
    resultBox.appendChild(eggName);
    resultBox.appendChild(rarityBadge);
    resultBox.appendChild(expGain);
    resultBox.appendChild(closeButton);
    modal.appendChild(resultBox);
    document.body.appendChild(modal);
    
    // 모달 외부 클릭시 닫기
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        // 가챠 버튼 재활성화 (모달 외부 클릭시)
        const gachaBtn = document.getElementById('gachaBtn');
        if (gachaBtn) {
          gachaBtn.disabled = false;
        }
        
        // Hunt Eggs 버튼 상태 초기화
        const clickBtn = document.getElementById('clickBtn');
        if (clickBtn) {
          clickBtn.style.transform = '';
          clickBtn.style.boxShadow = '';
          clickBtn.classList.remove('combo-hit', 'combo-burst', 'combo-epic');
        }
        
        // UI 업데이트
        UI.updateDisplay();
      }
    };
  }

  static spinGacha() {
    console.log(`🛠️ DEBUG: Attempting gacha spin with ${gameState.tickets} tickets`);
    
    if (gameState.tickets <= 0) {
      console.log(`🛠️ DEBUG: Gacha blocked - tickets: ${gameState.tickets}`);
      UI.showNotification("❌ No tickets available!");
      return;
    }
    
    // 가챠 버튼 비활성화 (애니메이션 중 중복 클릭 방지)
    const gachaBtn = document.getElementById('gachaBtn');
    if (gachaBtn) {
      gachaBtn.disabled = true;
    }
    
    gameState.tickets--;
    console.log(`🛠️ DEBUG: Gacha successful - remaining tickets: ${gameState.tickets}`);
    
    // 즉시 UI 업데이트 (티켓 차감 반영)
    gameState.save();
    UI.updateDisplay();
    
    // 가챠 애니메이션 시작
    this.showGachaAnimation(() => {
      const idx = this.pickRarity();
      const eggName = this.pickEggType(idx);
      const imgUrl = EGG_IMAGES[idx];
      const newEgg = { rarity: idx, img: imgUrl, name: eggName };
      gameState.eggs.push(newEgg);

      gameState.experience += GAME_CONFIG.expValues[idx];

      const eggKey = `${GAME_CONFIG.rarities[idx]}-${eggName}`;
      const isNewDiscovery = !gameState.discoveredEggs.has(eggKey);
      gameState.discoveredEggs.add(eggKey);

      // 포켓몬 도감 스타일 결과 표시
      this.showGachaResult(newEgg, isNewDiscovery);
      
      gameState.checkLevelUp();
      gameState.save();
      UI.updateDisplay();
      
      // 가챠 버튼 재활성화
      if (gachaBtn) {
        gachaBtn.disabled = false;
      }
    });
  }
}
