// Game Data Configuration
const GAME_CONFIG = {
  // Rarity system
  rarities: ["COMMON","UNCOMMON","RARE","EPIC","UNIQUE","LEGENDARY","MYSTIC","GALACTIC"],
  probs: [0.70, 0.18, 0.07, 0.03, 0.012, 0.006, 0.0015, 0.0005], // 확률을 0-1 범위로 변환
  expValues: [1, 3, 8, 20, 60, 200, 600, 2000],
  
  // Colors for each rarity
  rarityColors: ['#9e9e9e', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', '#e91e63', '#673ab7'],
  
  // Unlock thresholds
  unlocks: {
    idleReward: 3, // 레벨 3에서 방치 보상 해금
    bonusReward1: 5, // 레벨 5에서 첫 번째 보너스 보상
    bonusReward2: 7, // 레벨 7에서 두 번째 보너스 보상
    comboMaster: 10, // 레벨 10에서 콤보 마스터 해금
    bonusReward3: 13, // 레벨 13에서 세 번째 보너스 보상
    bonusReward4: 16, // 레벨 16에서 네 번째 보너스 보상
    bonusReward5: 19, // 레벨 19에서 다섯 번째 보너스 보상
    bonusReward6: 22, // 레벨 22에서 여섯 번째 보너스 보상
    bonusReward7: 26, // 레벨 26에서 일곱 번째 보너스 보상
    bonusReward8: 30, // 레벨 30에서 여덟 번째 보너스 보상
    bonusReward9: 34, // 레벨 34에서 아홉 번째 보너스 보상
    bonusReward10: 39, // 레벨 39에서 열 번째 보너스 보상
    bonusReward11: 45, // 레벨 45에서 열한 번째 보너스 보상
    bonusReward12: 50  // 레벨 50에서 열두 번째 보너스 보상
  },
  
  // Game mechanics
  instantGachaChance: 0.001, // 0.1% chance (기본 확률 낮춤)
  ticketInterval: 1000, // 1000 클릭마다 티켓 (increased from 100)
  bonusTicketInterval: 5000, // 5000 클릭마다 보너스 티켓 (increased from 1000)
  autoSaveInterval: 30000, // 30초마다 자동 저장
  
  // Combo system
  comboDecayTime: 5000, // 5초 후 콤보 초기화 (기본)
  comboDecayTimeMaster: 8000, // 8초 후 콤보 초기화 (마스터)
  maxCombo: 100, // 기본 최대 콤보
  maxComboMaster: 150, // 마스터 최대 콤보
  maxComboLuckyBonus: 0.002, // 기본 최대 0.2% 럭키 확률 증가 (0.1% + 0.2% = 0.3%)
  maxComboLuckyBonusMaster: 0.003, // 마스터 0.3% (0.1% + 0.3% = 0.4%) - 더 강력하게 수정
  maxComboExpBonus: 50, // 최대 50% EXP 보너스
  
  // Idle reward system (4시간마다 1티켓)
  idleRewardInterval: 14400000, // 4시간 = 14400000ms
  maxIdleTime: 86400000, // 24시간 최대 누적 (6티켓)
  
  // Level-up bonus rewards (6개월 플레이타임 기준)
  levelRewards: {
    5: { tickets: 3, name: "🎉 First Milestone!" },
    7: { tickets: 5, name: "⭐ Novice Hunter" },
    13: { tickets: 8, name: "🔥 Passionate Collector" },
    16: { tickets: 12, name: "💫 Skilled Explorer" },
    19: { tickets: 15, name: "🌟 Expert Hunter" },
    22: { tickets: 20, name: "💎 Master Collector" },
    26: { tickets: 25, name: "🏆 Elite Explorer" },
    30: { tickets: 35, name: "👑 Legendary Hunter" },
    34: { tickets: 45, name: "🌈 Rainbow Master" },
    39: { tickets: 60, name: "💫 Mythical Collector" },
    45: { tickets: 80, name: "⚡ Cosmic Conqueror" },
    50: { tickets: 100, name: "🌌 Galactic Champion" }
  }
};

// Egg types by rarity (Common has most, Galactic has least)
const EGG_TYPES = {
  "COMMON": [
    "Classic", "White", "Brown", "Speckled", "Small", "Plain", "Ordinary", "Basic", "Simple", "Regular",
    "Cream", "Beige", "Tan", "Ivory", "Vanilla", "Pale", "Natural", "Standard", "Normal", "Common",
    "Smooth", "Round", "Oval", "Tiny", "Large", "Medium", "Spotted", "Dotted", "Freckled", "Mottled"
  ],
  "UNCOMMON": [
    "Blue", "Green", "Golden", "Silver", "Striped", "Spotted", "Marbled", "Bright",
    "Yellow", "Orange", "Purple", "Pink", "Turquoise", "Lime", "Magenta", "Coral",
    "Banded", "Ringed", "Swirled", "Painted", "Glossy", "Shiny", "Lustrous", "Polished"
  ],
  "RARE": [
    "Crystal", "Rainbow", "Obsidian", "Pearl", "Sapphire", "Ruby",
    "Emerald", "Diamond", "Opal", "Amethyst", "Topaz", "Garnet",
    "Jade", "Moonstone", "Sunstone", "Aquamarine", "Peridot", "Onyx"
  ],
  "EPIC": [
    "Dragon", "Phoenix", "Unicorn", "Griffin",
    "Pegasus", "Sphinx", "Hydra", "Basilisk",
    "Wyvern", "Chimera", "Manticore", "Kraken"
  ],
  "UNIQUE": [
    "Cosmic", "Void", "Solar",
    "Lunar", "Stellar", "Nova",
    "Quantum", "Plasma", "Nebular"
  ],
  "LEGENDARY": [
    "Ancient", "Divine",
    "Eternal", "Primordial",
    "Sacred", "Celestial"
  ],
  "MYSTIC": [
    "Ethereal",
    "Spectral", "Astral",
    "Dimensional"
  ],
  "GALACTIC": [
    "Nebula", "Supernova", "Blackhole"
  ]
};

// Fallback images for each rarity
const EGG_IMAGES = [
  "https://images.unsplash.com/photo-1518450757707-d21c8c53c8df?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1544608276-d7b6bf7e08c7?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1561071559-3d212298bee8?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1589985253320-ba71e7593e5c?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1612365197533-4b0b0b6d65e8?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=200&fit=crop"
];

// Utility functions
const rand = () => Math.random(); // 0-1 범위로 수정 (기존 * 100은 확률 계산 오류 원인)

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_CONFIG, EGG_TYPES, EGG_IMAGES, rand };
}
