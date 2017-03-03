var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
tempCanvas = document.createElement('canvas'),
tempCtx = tempCanvas.getContext('2d'),
width = window.innerWidth - 3,
height = window.innerHeight - 3,
threshold = 150,
points = [];

canvas.width = tempCanvas.width = width;
canvas.height = tempCanvas.height = height;

var reset = function () {
  points = [];
  for (var i = 0; i < 30; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: -1 + Math.random() * 2,
      dy: -1 + Math.random() * 2,
      size: 50 + Math.random() * 50
    });
  }
};

var update = function () {
  tempCtx.clearRect(0, 0, width, height);
  var point;
  var gradient;
  for (var i = 0; i < points.length; i++) {
    point = points[i];
    point.x += point.dx;
    point.y += point.dy;

    if (point.new) {
      point.size += 5;
    }

    if (point.x - point.size > width) {
      point.x = -point.size;
    }
    if (point.x + point.size < 0) {
      point.x = width + point.size;
    }
    if (point.y - point.size > height) {
      point.y = -point.size;
    }
    if (point.y + point.size < 0) {
      point.y = height + point.size;
    }
    gradient = tempCtx.createRadialGradient(point.x, point.y, 1, point.x, point.y, point.size);
    gradient.addColorStop(0, 'rgba(48, 194, 146, 1)');
    gradient.addColorStop(1, 'rgba(55, 195, 43, 0)');
    tempCtx.beginPath();
    tempCtx.fillStyle = gradient;
    tempCtx.arc(point.x, point.y, point.size, 0, Math.PI * 2, true);
    tempCtx.fill();
    tempCtx.closePath();
  }
  render();
  requestAnimationFrame(update);
};

var render = function () {
  var imgData = tempCtx.getImageData(0, 0, width, height);
  var pixels = imgData.data;

  for (var i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < threshold) {
      pixels[i + 3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
};


canvas.addEventListener('mousedown', function (e) {
  if (e.which === 3) {
    return false;
  }
  points.shift();
  var point = {};
  point.x = e.pageX;
  point.y = e.pageY;
  point.dx = 0;
  point.dy = 0;
  point.size = 10;
  point.new = true;
  points.push(point);
}, false);

canvas.addEventListener('mousemove', function (e) {
  var end = points.length - 1;
  if (points[end].new) {
    points[end].x = e.pageX;
    points[end].y = e.pageY;
  }
}, false);

canvas.addEventListener('mouseup', function (e) {
  var end = points.length - 1;
  points[end].dx = -1 + Math.random() * 2;
  points[end].dy = -1 + Math.random() * 2;
  delete points[end].new;
}, false);

reset();
update();
