let digitPanelTemplate = `
<div class="panel panel-primary panel-modest pull-right">
  <div class="panel-heading">
    <h4 class="panel-title">
      <a data-toggle="collapse" href="#collapse{digit}">Digit: {digit}. Quantity: {quantity}</a>
    </h4>
  </div>
  <div id="collapse{digit}" class="panel-collapse collapse">
    <div class="panel-body">
      <canvas id="digit{digit}" width="900"></canvas>
    </div>
  </div>
</div>
`

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

let sketchPanel = document.getElementById('colors_sketch');
let tmpContext = document.getElementById('myCanvas').getContext('2d');
let secondDisplay = document.getElementById('second_colors_sketch');

let numPerRow = 40;
let dimension = 30;

class DigitCanvas {
  constructor(mnist, digit) {
    this.digits = mnist[digit];
    let template = replaceAll(digitPanelTemplate, '{digit}', digit);
    template = template.replace('{quantity}', this.digits.length)
    $('#digit-panel').append(template);
    this.canvas = document.getElementById('digit' + digit);
    let self = this;
    setTimeout(function () {
      self.setup();
    }, 0)
  }

  setup() {
    this.context = this.canvas.getContext('2d');
    this.secondDisplay = secondDisplay;
    this.secondDisplayContext = this.secondDisplay.getContext('2d');
    this.currentDisplay = -1; 
    let self = this;
    this.canvas.onmousemove = function(e) {
      let rect = this.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
      let col = Math.floor(x / dimension);
      let row = Math.floor(y / dimension);
      let index = row * numPerRow + col;

      if (index < self.digits.length && self.currentDisplay !== index) {
        self.currentDisplay = index;
        let imageData = self.context.getImageData(col * 30, row * 30, 28, 28);
        let newCanvas = $("<canvas>")
            .attr("width", imageData.width)
            .attr("height", imageData.height)[0];

        // Inverse image
        let data = imageData.data;
        for(let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }

        newCanvas.getContext("2d").putImageData(imageData, 0, 0);
        self.secondDisplayContext.drawImage(newCanvas, 0, 0, 280, 280);
      }
    };

    this.canvas.addEventListener('click', function(e) {
      let rect = this.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

      let col = Math.floor(x / dimension);
      let row = Math.floor(y / dimension);
      let index = row * numPerRow + col;

      if (index < self.digits.length) {
        let imageData = self.context.getImageData(col * 30, row * 30, 28, 28);
        let newCanvas = $("<canvas>")
            .attr("width", imageData.width)
            .attr("height", imageData.height)[0];

        // Inverse image
        let data = imageData.data;
        for(let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }

        newCanvas.getContext("2d").putImageData(imageData, 0, 0);
        sketchPanel.getContext('2d').drawImage(newCanvas, 0, 0, 280, 280);
      }
    }, false);

    this.paintCanvas();
  } 

  putImageData(ctx, imageData, dx, dy,
      dirtyX, dirtyY, dirtyWidth, dirtyHeight) 
  {
    let data = imageData.data;
    let height = imageData.height;
    let width = imageData.width;
    dirtyX = dirtyX || 0;
    dirtyY = dirtyY || 0;
    dirtyWidth = dirtyWidth !== undefined? dirtyWidth: width;
    dirtyHeight = dirtyHeight !== undefined? dirtyHeight: height;
    let limitBottom = dirtyY + dirtyHeight;
    let limitRight = dirtyX + dirtyWidth;
    for (let y = dirtyY; y < limitBottom; y++) {
      for (let x = dirtyX; x < limitRight; x++) {
        let pos = y * width + x;
        ctx.fillStyle = 'rgba(' + data[pos*4+0]
                          + ',' + data[pos*4+1]
                          + ',' + data[pos*4+2]
                          + ',' + (data[pos*4+3]/255) + ')';
        ctx.fillRect(x + dx, y + dy, 1, 1);
      }
    }
  }

  paintCanvas() {
    this.canvas.height = Math.ceil(this.digits.length / numPerRow) * dimension;
    for (let i = 0; i < this.digits.length; i++) {
      let x = Math.floor(i / numPerRow);
      let y = i % numPerRow;
      this.putImageData(this.context, 
                  this.constructImage(this.digits.get(i)), 
                  y * dimension, x * dimension);
      // putImageData(this.context, 
      //             this.constructImage(digit, this.canvas), 
      //             x * dimension, y * dimension);
    }
  }

  constructImage(digit, width = 28, height = 28, options = {}) {
    let imageData = this.context.getImageData(0, 0, width, height);
    for (let i = 0; i < digit.length; i++) {
      if (options.reverse) {
        imageData.data[i * 4] = 255 - digit[i] * 255;
        imageData.data[i * 4 + 1] = 255 - digit[i] * 255;
        imageData.data[i * 4 + 2] = 255 - digit[i] * 255;
      } else {
        imageData.data[i * 4] = digit[i] * 255;
        imageData.data[i * 4 + 1] = digit[i] * 255;
        imageData.data[i * 4 + 2] = digit[i] * 255;
      }

      if (options.blackWhite) {
        imageData.data[i * 4] = imageData.data[i * 4] === 255 ? 255 : 0;
        imageData.data[i * 4 + 1] = imageData.data[i * 4] === 255 ? 255 : 0;
        imageData.data[i * 4 + 2] = imageData.data[i * 4] === 255 ? 255 : 0;
      }

      imageData.data[i * 4 + 3] = 255;
    }
    return imageData;
  }
}

for (var i = 0; i < 10; i++) {
  new DigitCanvas(mnist, i);
}

// let src = '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'

let mentality = require('../');
let Network = mentality.Network;
let networkJson = require('../try1.json');
let network = Network.fromJSON(networkJson);
// let image = new Image();
// image.onload = function() {
//   let canvas = document.createElement('canvas');
//   canvas.width = image.width;
//   canvas.height = image.height;

//   // let context = canvas.getContext('2d');
//   let context = document.getElementById('myCanvas').getContext('2d');
//   context.drawImage(image, 0, 0);

//   let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//   let number = detectNumber(canvas, imageData);
//   console.log(number);
// };
// image.src = 'data:image/png;base64,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';

let canvas = document.getElementById('colors_sketch');
function detect() {
  let context = canvas.getContext('2d');
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = [];
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let index = (imageData.width * x + y) * 4;
      let alpha = imageData.data[index + 3]; 
      let value = alpha === 0 ? 0 : 1;
      pixels.push(value);
    }
  }
  pixels = resizeImage(pixels, 280, 280, 28, 28);

  // draw(pixels, tmpContext, 0, 0);
  let number = detectNumber(pixels);
}

let button = document.getElementById('detect_button');
button.addEventListener('click', detect);

function detectNumber(pixels) {
  let res = network.activate(pixels);
  let index = 0;
  // console.log(res);
  for (let i = 1; i < res.length; i++) {
    if (res[i] > res[index]) {
      index = i;
    }
  }
  return index;
}

function resizeImage(bits, originX, originY, desiredX, desiredY) {
  let ratioX = Math.ceil(originX / desiredX);
  let ratioY = Math.ceil(originY / desiredY);
  let reduced = [];
  for (let x = 0; x < desiredX; x++) {
    for (let y = 0; y < desiredY; y++) {
      let startX = x * ratioX;
      let startY = y * ratioY;

      let sum = 0;
      for (let iX = 0; iX < ratioX; iX++) {
        for (let iY = 0; iY < ratioY; iY++) {
          let index = (startX + iX) * originX + (startY + iY);
          sum += bits[index];
        }
      }
      sum /= (ratioX * ratioY);
      if (sum < 0.1) reduced.push(0);
      else reduced.push(1);
    }
  }
  return reduced;
}