var BerriesBrush = fabric.util.createClass(fabric.BaseBrush, {
  initialize: function initialize(canvas, options) {
    this.canvas = canvas;
    this.aspectRatio = 1;
    var images = options.images;
    this.imageElements = [];
    var host = location.toString();
    images = [
      host + "assets/images/splatters/splat2.png",
      host + "assets/images/splatters/splat3.png",
      host + "assets/images/splatters/splat4.png",
      host + "assets/images/splatters/splat5.png"
    ];
    this.shuffle(images);
    for (var i = 0; i < images.length; i++) {
      this.loadImage(images[i]);
    }
  },
  shuffle: function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  },
  onLoadImage: function onLoadImage(image) {
    this.imageElements.push(image);
  },
  getRandomImage: function getRandomImage() {
    var ran = Math.floor(Math.random() * (this.imageElements.length - 1));
    return this.imageElements[ran];
  },
  loadImage: function loadImage(url) {
    var image = new Image();
    image.onload = this.onLoadImage.bind(this, image);
    image.src = url;
  },

  createRandomBitmap: function createRandomBitmap() {
    //clear canvas
    if (this.tempCanvas) {
      this.context.clearRect(
        0,
        0,
        this.tempCanvas.width,
        this.tempCanvas.height
      );
    }
    this.shuffle(this.imageElements);

    var no = 10;
    for (var i = 0; i < no; i++) {
      this.createBitmap(this.getRandomImage());
    }
  },

  createBitmap: function createBitmap(image) {
    // draw the image to a canvas
    if (!this.tempCanvas) {
      this.tempCanvas = document.createElement("canvas");
      this.tempCanvas.width = image.width;
      this.tempCanvas.height = image.height;
      this.context = this.tempCanvas.getContext("2d");
    }

    //random rotation
    var x = this.tempCanvas.width / 2;
    var y = this.tempCanvas.height / 2;
    var width = this.tempCanvas.width;
    var height = this.tempCanvas.height;
    var angleInRadians = this.getRandomAngleInRadians();
    this.context.translate(x, y);
    this.context.rotate(angleInRadians);
    this.context.drawImage(image, -width / 2, -height / 2, width, height);
    this.context.rotate(-angleInRadians);
    this.context.translate(-x, -y);

    var currentRgbaColor = this.getRgbColor("#324D95");
    // Now, update the raw image data to be the current color
    var rawImageData = this.context.getImageData(
      0,
      0,
      image.width,
      image.height
    );
    for (var i = 0; i < rawImageData.data.length; i += 4) {
      rawImageData.data[i] = currentRgbaColor[0];
      rawImageData.data[i + 1] = currentRgbaColor[1];
      rawImageData.data[i + 2] = currentRgbaColor[2];
    }
    this.context.clearRect(0, 0, image.width, image.height);
    this.context.putImageData(rawImageData, 0, 0);

    this.bitmap = this.tempCanvas;
    this.aspectRatio = image.width / image.height;
  },

  getRgbColor: function getRgbColor(color) {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    var context = canvas.getContext("2d");
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1).data;
  },

  stampImage: function stampImage(pointer) {
    if (!this.bitmap) {
      return;
    }
    var dataUrl = this.bitmap.toDataURL();
    fabric.Image.fromURL(
      dataUrl,
      function(image) {
        var scale = this.getRandomScale();
        image.set({ selectable: false, maxScale: scale });
        this.animate(image);
      }.bind(this),
      {
        originX: "center",
        originY: "center",
        top: pointer.y,
        left: pointer.x,
        angle: this.getRandomAngleInDegrees()
      }
    );
  },
  getRandomScale: function getRandomScale() {
    //random scale, min 0.4 and max 1
    return 0.15 + Math.random() * 0.1;
  },
  getRandomAngleInRadians: function getRandomAngleInRadians() {
    //angle 0 to 360 in radians
    return Math.random() * (Math.PI * 2);
  },
  getRandomAngleInDegrees: function getRandomAngleInDegrees() {
    //angle 0 to 360 in degrees
    return Math.random() * 360;
  },
  onMouseDown: function onMouseDown(pointer) {
    this.canvas.contextTop.fillStyle = this.color;
    this.createRandomBitmap();
    this.stampImage(pointer);
  },
  onMouseMove: function onMouseMove(pointer) {},
  onMouseUp: function onMouseUp() {},
  animate: function animate(image) {
    image.set({ opacity: 0 });
    image.scale(0);
    this.canvas.add(image);
    image.animate(
      { scaleX: image.maxScale, scaleY: image.maxScale, opacity: 1 },
      {
        onChange: this.canvas.renderAll.bind(this.canvas),
        duration: 300,
        easing: fabric.util.ease.easeOutQuad,
        onComplete: this.applyFilter.bind(this, image)
      }
    );
    //image.filters.push(new fabric.Image.filters.Pixelate({ blocksize: 8 }));
    image.applyFilters();
  },
  applyFilter: function applyFilter(image) {
    //matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1]
    var filter = new fabric.Image.filters.Convolute({
      matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1]
    });
    image.filters.push(filter);
    image.applyFilters(this.canvas.renderAll.bind(this.canvas));
    this.canvas.add(image);
  }
});
