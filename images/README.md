# Egg Images Directory Structure

## 디렉토리 구조
```
images/
└── eggs/
    ├── common/     (36개 알)
    ├── uncommon/   (24개 알)
    ├── rare/       (18개 알)
    ├── epic/       (12개 알)
    ├── unique/     (9개 알)
    ├── legendary/  (6개 알)
    ├── mystic/     (4개 알)
    └── galactic/   (3개 알)
```

## 파일 명명 규칙
- 파일명: `{알이름}.png` (소문자, 공백 없음)
- 예시: `stone.png`, `flame.png`, `crystal.png`

## 각 등급별 알 목록

### COMMON (36개)
- stone, grass, wood, leaf, sand, clay, mud, bark, moss, twig
- acorn, pebble, shell, coral, seaweed, driftwood, bamboo, vine, fern, root
- mushroom, berry, seed, nut, flower, petal, branch, herb, weed, sprout

### UNCOMMON (24개)
- flame, ice, lightning, wind, earth, ocean, lava, steam
- frost, thunder, storm, gale, wave, blizzard, volcano, quake
- magma, glacier, cyclone, tempest, avalanche, mist, dew, aurora

### RARE (18개)
- crystal, rainbow, obsidian, pearl, sapphire, ruby
- emerald, diamond, opal, amethyst, topaz, garnet
- jade, moonstone, sunstone, aquamarine, peridot, onyx

### EPIC (12개)
- dragon, phoenix, unicorn, griffin
- pegasus, sphinx, hydra, basilisk
- wyvern, chimera, manticore, kraken

### UNIQUE (9개)
- time, shadow, light
- chaos, order, memory
- dream, nightmare, echo

### LEGENDARY (6개)
- atlantis, excalibur
- mjolnir, pandora
- eden, olympus

### MYSTIC (4개)
- soul, love, essence, aura

### GALACTIC (3개)
- nebula, supernova, blackhole

## 이미지 요구사항
- 해상도: 200x200px 이상 권장
- 형식: PNG (투명 배경 권장) 또는 JPG
- 크기: 1MB 이하 권장

## 사용법
이미지를 해당 등급 폴더에 넣으시면, data.js의 INDIVIDUAL_EGG_IMAGES에서 자동으로 로컬 경로로 업데이트할 수 있습니다.
