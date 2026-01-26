const fs = require('fs-extra');
const path = require('path');

const sharedDir = path.join(__dirname, '../shared');
const desktopDir = path.join(__dirname, '../desktop');
const mobileWwwDir = path.join(__dirname, '../mobile/www');

console.log('🔄 Syncing shared files...');

// デスクトップへコピー
console.log('📋 Copying to desktop...');
const filesToCopy = ['index.html', 'clock.js', 'cat1.png', 'cat2.png', 'cat3.png', 'cat4.png'];

filesToCopy.forEach(file => {
  const src = path.join(sharedDir, file);
  const dest = path.join(desktopDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} not found`);
  }
});

// モバイルへコピー
console.log('📋 Copying to mobile...');
fs.ensureDirSync(mobileWwwDir);
fs.ensureDirSync(path.join(mobileWwwDir, 'assets'));

// HTML と JS
fs.copyFileSync(
  path.join(sharedDir, 'index.html'),
  path.join(mobileWwwDir, 'index.html')
);
console.log('  ✓ index.html');

fs.copyFileSync(
  path.join(sharedDir, 'clock.js'),
  path.join(mobileWwwDir, 'clock.js')
);
console.log('  ✓ clock.js');

// 画像ファイル
['cat1.png', 'cat2.png', 'cat3.png', 'cat4.png'].forEach(file => {
  const src = path.join(sharedDir, file);
  const dest = path.join(mobileWwwDir, 'assets', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ assets/${file}`);
  }
});

console.log('✅ Shared files synced successfully!');