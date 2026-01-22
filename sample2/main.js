
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ---------- 1. デバッグ設定 ----------
const DEBUG_CONFIG = {
  enabled: false,
  timeScale: 360,
  startTime: Date.now()
};

// ---------- 2. resize & DPI ----------
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

// ---------- 3. Constants (元の比率に戻し、半径だけ大きく) ----------
const SAFE_BOTTOM = 48;         // 元の値
const MINUTE_LINE_WIDTH = 24;   // 元の値
const HOUR_RADIUS = 28;         // 半径のみ大きく (元の14から変更)

// ---------- 4. Time Calculation ----------
function getVirtualTime() {
  const now = Date.now();
  let timeStamp;
  if (DEBUG_CONFIG.enabled) {
    const elapsed = (now - DEBUG_CONFIG.startTime) * DEBUG_CONFIG.timeScale;
    timeStamp = new Date(DEBUG_CONFIG.startTime + elapsed);
  } else {
    timeStamp = new Date(now);
  }
  return {
    h: timeStamp.getHours() % 12,
    m: timeStamp.getMinutes(),
    s: timeStamp.getSeconds(),
    ms: timeStamp.getMilliseconds(),
    totalSeconds: timeStamp.getTime() / 1000
  };
}

// ---------- 5. Geometry (元の位置に戻す) ----------
function getKeyPoints() {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1) - SAFE_BOTTOM;
  const cx = w / 2;
  const cy = h / 2;

  // 座標を元の位置（画面の端ぴったり）に戻しました
  return [
    { min: 0,    x: cx, y: 0  },
    { min: 7.5,  x: w,  y: 0  },
    { min: 15,   x: w,  y: cy },
    { min: 22.5, x: w,  y: h  },
    { min: 30,   x: cx, y: h  },
    { min: 37.5, x: 0,  y: h  },
    { min: 45,   x: 0,  y: cy },
    { min: 52.5, x: 0,  y: 0  },
    { min: 60,   x: cx, y: 0  }
  ];
}

function getPointFromMinute(minute) {
  const points = getKeyPoints();
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (minute >= p1.min && minute <= p2.min) {
      const t = (minute - p1.min) / (p2.min - p1.min);
      return {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t
      };
    }
  }
  return points[0];
}

// ---------- 6. Minutes Drawing ----------
function drawMinutes(time) {
  const currentMinute = time.m + time.s / 60 + (time.ms / 60000);
  ctx.beginPath();
  const start = getPointFromMinute(currentMinute);
  ctx.moveTo(start.x, start.y);
  const step = 0.5;
  for (let m = currentMinute + step; m <= 60; m += step) {
    const p = getPointFromMinute(m);
    ctx.lineTo(p.x, p.y);
  }
  const end = getPointFromMinute(60);
  ctx.lineTo(end.x, end.y);

  ctx.strokeStyle = "#d14b4b";
  ctx.lineWidth = MINUTE_LINE_WIDTH;
  ctx.lineCap = "round";
  ctx.stroke();
}

// ---------- 7. Hour & Animation Logic ----------
let hourCount = null;
let lastTotalMinutes = null;
let throwingBall = false;
let ballAnimProgress = 0;
let ballStartPos = null;
let ballEndPos = null;
let ballTargetHour = 0;

function hourPoint(index) {
  const minute = (index * 5);
  return getPointFromMinute(minute);
}

function triggerHourAnimation(targetHour) {
  throwingBall = true;
  ballAnimProgress = 0;
  ballStartPos = getPointFromMinute(0);
  ballTargetHour = targetHour;
  ballEndPos = hourPoint(targetHour);
}

function drawHours(time) {
  if (hourCount === null) {
    hourCount = time.h;
  }

  const currentTotalMinutes = Math.floor(time.totalSeconds / 60);
  if (lastTotalMinutes !== null && currentTotalMinutes > lastTotalMinutes) {
    for (let i = lastTotalMinutes + 1; i <= currentTotalMinutes; i++) {
      if (i % 60 === 0) {
        hourCount = (hourCount + 1) % 12;
        triggerHourAnimation(hourCount);
      }
    }
  }
  lastTotalMinutes = currentTotalMinutes;

  // 玉の描画
  for (let i = 1; i <= 12; i++) {
    const isTargetOfAnimation = throwingBall && i === ballTargetHour;
    if (i <= hourCount && !isTargetOfAnimation) {
      const p = hourPoint(i);
      ctx.beginPath();
      ctx.arc(p.x, p.y, HOUR_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#e0b84c";
      ctx.fill();
    }
  }

  // アニメーション
  if (throwingBall) {
    ballAnimProgress += 0.03;
    if (ballAnimProgress >= 1.0) {
      throwingBall = false;
      ballAnimProgress = 1.0;
    }
    const t = ballAnimProgress;
    const easeT = t * (2 - t);
    const currentX = ballStartPos.x + (ballEndPos.x - ballStartPos.x) * easeT;
    const currentY = ballStartPos.y + (ballEndPos.y - ballStartPos.y) * easeT;
    const arcHeight = -100 * Math.sin(t * Math.PI);

    // 影
    ctx.beginPath();
    ctx.arc(currentX, currentY, HOUR_RADIUS * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();
    // 玉
    ctx.beginPath();
    ctx.arc(currentX, currentY + arcHeight, HOUR_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#e0b84c";
    ctx.fill();
  }
}

// ---------- 8. Cat Character ----------
let catImages = [new Image(), new Image(), new Image(), new Image()];
let imagesLoaded = 0;
let animationFrame = 0;
catImages.forEach((img, i) => {
  img.src = `cat${i + 1}.png`;
  img.onload = () => imagesLoaded++;
});

function drawCat() {
  const p = getPointFromMinute(0);
  if (imagesLoaded === 4) {
    animationFrame++;
    const imageIndex = Math.floor(animationFrame / 75) % 4;
    const currentImage = catImages[imageIndex];
    ctx.drawImage(currentImage, p.x - 150, p.y - 10, 300, 150);
  }
}

// ---------- 9. Debug Overlay ----------
function drawDebugOverlay(time) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(20, 20, 220, 60);
  ctx.fillStyle = "#00ff00";
  ctx.font = "16px monospace";
  const h = String(time.h).padStart(2, '0');
  const m = String(time.m).padStart(2, '0');
  const s = String(time.s).padStart(2, '0');
  ctx.fillText(`TIME: ${h}:${m}:${s}`, 35, 45);
  ctx.fillText(`SCALE: x${DEBUG_CONFIG.timeScale}`, 35, 65);
  ctx.restore();
}

// ---------- 10. Main Loop ----------
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const time = getVirtualTime();
  drawCat();
  drawMinutes(time);
  drawHours(time);
  if (DEBUG_CONFIG.enabled) drawDebugOverlay(time);
  requestAnimationFrame(loop);
}

loop();