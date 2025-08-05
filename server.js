const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname)));

// 메인 페이지 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index_optimized_fixed.html'));
});

// 모든 경로를 메인 페이지로 리다이렉트 (SPA 처리)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index_optimized_fixed.html'));
});

app.listen(PORT, () => {
  console.log(`🥚 EggVerse Hunter is running on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} to play!`);
});
