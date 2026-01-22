const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let t = 0;

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 動いていることが分かる最低限の表現
  ctx.fillStyle = "#888";
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2 + Math.cos(t) * 50,
    canvas.height / 2 + Math.sin(t) * 50,
    10,
    0,
    Math.PI * 2
  );
  ctx.fill();

  t += 0.02;
  requestAnimationFrame(draw);
}

draw();
