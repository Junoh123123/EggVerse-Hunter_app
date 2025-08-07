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
    "Stone", "Grass", "Wood", "Leaf", "Sand", "Clay", "Mud", "Bark", "Moss", "Twig",
    "Acorn", "Pebble", "Shell", "Coral", "Seaweed", "Driftwood", "Bamboo", "Vine", "Fern", "Root",
    "Mushroom", "Berry", "Seed", "Nut", "Flower", "Petal", "Branch", "Herb", "Weed", "Sprout"
  ],
  "UNCOMMON": [
    "Flame", "Ice", "Lightning", "Wind", "Earth", "Ocean", "Lava", "Steam",
    "Frost", "Thunder", "Storm", "Gale", "Wave", "Blizzard", "Volcano", "Quake",
    "Magma", "Glacier", "Cyclone", "Tempest", "Avalanche", "Mist", "Dew", "Aurora"
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
    "Time", "Shadow", "Light",
    "Chaos", "Order", "Memory",
    "Dream", "Nightmare", "Echo"
  ],
  "LEGENDARY": [
    "Atlantis", "Excalibur",
    "Mjolnir", "Pandora",
    "Eden", "Olympus"
  ],
  "MYSTIC": [
    "Soul",
    "Love", "Essence",
    "Aura"
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

// Individual egg images - each egg has its own unique image
const INDIVIDUAL_EGG_IMAGES = {
  // COMMON eggs
  "Stone": "./images/eggs/common/stone.png",
  "Grass": "./images/eggs/common/grass.png",
  "Wood": "./images/eggs/common/wood.png",
  "Leaf": "./images/eggs/common/leaf.png",
  "Sand": "./images/eggs/common/sand.png",
  "Clay": "./images/eggs/common/clay.png",
  "Mud": "./images/eggs/common/mud.png",
  "Bark": "./images/eggs/common/bark.png",
  "Moss": "./images/eggs/common/moss.png",
  "Twig": "./images/eggs/common/twig.png",
  "Acorn": "./images/eggs/common/acorn.png",
  "Pebble": "./images/eggs/common/pebble.png",
  "Shell": "./images/eggs/common/shell.png",
  "Coral": "./images/eggs/common/coral.png",
  "Seaweed": "./images/eggs/common/seaweed.png",
  "Driftwood": "./images/eggs/common/driftwood.png",
  "Bamboo": "./images/eggs/common/bamboo.png",
  "Vine": "./images/eggs/common/vine.png",
  "Fern": "./images/eggs/common/fern.png",
  "Root": "./images/eggs/common/root.png",
  "Mushroom": "./images/eggs/common/mushroom.png",
  "Berry": "./images/eggs/common/berry.png",
  "Seed": "./images/eggs/common/seed.png",
  "Nut": "./images/eggs/common/nut.png",
  "Flower": "./images/eggs/common/flower.png",
  "Petal": "./images/eggs/common/petal.png",
  "Branch": "./images/eggs/common/branch.png",
  "Herb": "./images/eggs/common/herb.png",
  "Weed": "./images/eggs/common/weed.png",
  "Sprout": "./images/eggs/common/sprout.png",
  
  // UNCOMMON eggs
  "Flame": "./images/eggs/uncommon/flame.png",
  "Ice": "./images/eggs/uncommon/ice.png",
  "Lightning": "./images/eggs/uncommon/lightning.png",
  "Wind": "./images/eggs/uncommon/wind.png",
  "Earth": "./images/eggs/uncommon/earth.png",
  "Ocean": "./images/eggs/uncommon/ocean.png",
  "Lava": "./images/eggs/uncommon/lava.png",
  "Steam": "./images/eggs/uncommon/steam.png",
  "Frost": "./images/eggs/uncommon/frost.png",
  "Thunder": "./images/eggs/uncommon/thunder.png",
  "Storm": "./images/eggs/uncommon/storm.png",
  "Gale": "./images/eggs/uncommon/gale.png",
  "Wave": "./images/eggs/uncommon/wave.png",
  "Blizzard": "./images/eggs/uncommon/blizzard.png",
  "Volcano": "./images/eggs/uncommon/volcano.png",
  "Quake": "./images/eggs/uncommon/quake.png",
  "Magma": "./images/eggs/uncommon/magma.png",
  "Glacier": "./images/eggs/uncommon/glacier.png",
  "Cyclone": "./images/eggs/uncommon/cyclone.png",
  "Tempest": "./images/eggs/uncommon/tempest.png",
  "Avalanche": "./images/eggs/uncommon/avalanche.png",
  "Mist": "./images/eggs/uncommon/mist.png",
  "Dew": "./images/eggs/uncommon/dew.png",
  "Aurora": "./images/eggs/uncommon/aurora.png",
  
  // RARE eggs - Gemstone/Crystal theme
  "Crystal": "./images/eggs/rare/crystal.png",
  "Rainbow": "./images/eggs/rare/rainbow.png",
  "Obsidian": "./images/eggs/rare/obsidian.png",
  "Pearl": "./images/eggs/rare/pearl.png",
  "Sapphire": "./images/eggs/rare/sapphire.png",
  "Ruby": "./images/eggs/rare/ruby.png",
  "Emerald": "./images/eggs/rare/emerald.png",
  "Diamond": "./images/eggs/rare/diamond.png",
  "Opal": "./images/eggs/rare/opal.png",
  "Amethyst": "./images/eggs/rare/amethyst.png",
  "Topaz": "./images/eggs/rare/topaz.png",
  "Garnet": "./images/eggs/rare/garnet.png",
  "Jade": "./images/eggs/rare/jade.png",
  "Moonstone": "./images/eggs/rare/moonstone.png",
  "Sunstone": "./images/eggs/rare/sunstone.png",
  "Aquamarine": "./images/eggs/rare/aquamarine.png",
  "Peridot": "./images/eggs/rare/peridot.png",
  "Onyx": "./images/eggs/rare/onyx.png",
  
  // EPIC eggs - Mythical Creatures
  "Dragon": "./images/eggs/epic/dragon.png",
  "Phoenix": "./images/eggs/epic/phoenix.png",
  "Unicorn": "./images/eggs/epic/unicorn.png",
  "Griffin": "./images/eggs/epic/griffin.png",
  "Pegasus": "./images/eggs/epic/pegasus.png",
  "Sphinx": "./images/eggs/epic/sphinx.png",
  "Hydra": "./images/eggs/epic/hydra.png",
  "Basilisk": "./images/eggs/epic/basilisk.png",
  "Wyvern": "./images/eggs/epic/wyvern.png",
  "Chimera": "./images/eggs/epic/chimera.png",
  "Manticore": "./images/eggs/epic/manticore.png",
  "Kraken": "./images/eggs/epic/kraken.png",
  
  // UNIQUE eggs - Abstract Concepts
  "Time": "./images/eggs/unique/time.png",
  "Shadow": "./images/eggs/unique/shadow.png",
  "Light": "./images/eggs/unique/light.png",
  "Chaos": "./images/eggs/unique/chaos.png",
  "Order": "./images/eggs/unique/order.png",
  "Memory": "./images/eggs/unique/memory.png",
  "Dream": "./images/eggs/unique/dream.png",
  "Nightmare": "./images/eggs/unique/nightmare.png",
  "Echo": "./images/eggs/unique/echo.png",
  
  // LEGENDARY eggs - Legendary Places/Artifacts
  "Atlantis": "./images/eggs/legendary/atlantis.png",
  "Excalibur": "./images/eggs/legendary/excalibur.png",
  "Mjolnir": "./images/eggs/legendary/mjolnir.png",
  "Pandora": "./images/eggs/legendary/pandora.png",
  "Eden": "./images/eggs/legendary/eden.png",
  "Olympus": "./images/eggs/legendary/olympus.png",
  
  // MYSTIC eggs - Spiritual/Soul themes
  "Soul": "./images/eggs/mystic/soul.png",
  "Love": "./images/eggs/mystic/love.png",
  "Essence": "./images/eggs/mystic/essence.png",
  "Aura": "./images/eggs/mystic/aura.png",
  
  // GALACTIC eggs - Space phenomena
  "Nebula": "./images/eggs/galactic/nebula.png",
  "Supernova": "./images/eggs/galactic/supernova.png",
  "Blackhole": "./images/eggs/galactic/blackhole.png"
};

// Special effects for high-rarity eggs (LEGENDARY and above)
const EGG_SPECIAL_EFFECTS = {
  // LEGENDARY effects
  "Atlantis": { type: "glow", color: "#00d4ff", intensity: "medium", animation: "pulse" },
  "Excalibur": { type: "shimmer", color: "#ffd700", intensity: "medium", animation: "shine" },
  "Mjolnir": { type: "lightning", color: "#4169e1", intensity: "medium", animation: "spark" },
  "Pandora": { type: "mystery", color: "#9932cc", intensity: "medium", animation: "swirl" },
  "Eden": { type: "bloom", color: "#32cd32", intensity: "medium", animation: "grow" },
  "Olympus": { type: "divine", color: "#ffd700", intensity: "medium", animation: "ascend" },
  
  // MYSTIC effects
  "Soul": { type: "ethereal", color: "#e6e6fa", intensity: "high", animation: "float" },
  "Love": { type: "heartly", color: "#ff69b4", intensity: "high", animation: "pulse" },
  "Essence": { type: "energy", color: "#dda0dd", intensity: "high", animation: "flow" },
  "Aura": { type: "radiance", color: "#da70d6", intensity: "high", animation: "radiate" },
  
  // GALACTIC effects
  "Nebula": { type: "cosmic", color: "#ff1493", intensity: "extreme", animation: "nebula" },
  "Supernova": { type: "explosion", color: "#ffd700", intensity: "extreme", animation: "burst" },
  "Blackhole": { type: "void", color: "#000000", intensity: "extreme", animation: "absorb" }
};

// Helper function to get egg image
const getEggImage = (eggName, rarity) => {
  return INDIVIDUAL_EGG_IMAGES[eggName] || EGG_IMAGES[GAME_CONFIG.rarities.indexOf(rarity)] || EGG_IMAGES[0];
};

// Helper function to check if egg has special effects
const hasSpecialEffect = (eggName) => {
  return EGG_SPECIAL_EFFECTS.hasOwnProperty(eggName);
};

// Helper function to get special effect data
const getSpecialEffect = (eggName) => {
  return EGG_SPECIAL_EFFECTS[eggName] || null;
};

// Utility functions
const rand = () => Math.random(); // 0-1 범위로 수정 (기존 * 100은 확률 계산 오류 원인)

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    GAME_CONFIG, 
    EGG_TYPES, 
    EGG_IMAGES, 
    INDIVIDUAL_EGG_IMAGES,
    EGG_SPECIAL_EFFECTS,
    getEggImage,
    hasSpecialEffect,
    getSpecialEffect,
    rand 
  };
}
