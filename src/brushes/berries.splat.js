var BerriesSplat = fabric.util.createClass(fabric.BaseBrush, {
  initialize: function initialize(canvas, options) {
    this.canvas = canvas;
    this.aspectRatio = 1;
    var images = options.images;
    this.imageElements = [];
    var host = location.toString();
    images = [
      host + "assets/images/berries/blue-berry1.png",
      host + "assets/images/berries/blue-berry2.png",
      host + "assets/images/berries/blue-berry3.png"
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
  loadImage: function loadImage(url) {
    var image = new Image();
    image.onload = this.onLoadImage.bind(this, image);
    image.src = url;
  },
  onLoadImage: function onLoadImage(image) {
    this.imageElements.push(image);
  },
  getRandomImage: function getRandomImage() {
    var ran = Math.floor(Math.random() * (this.imageElements.length - 1));
    return this.imageElements[ran];
  },
  stampBerries: function stampBerries(pointer) {
    var no = 3 + Math.round(Math.random() * 3);
    var scale = this.getRandomScale();
    var group = new fabric.Group();
    var berry = null;
    for (var i = 0; i < no; i++) {
      var imgElement = this.imageElements[i];
      berry = new fabric.Image(this.getRandomImage(), {
        angle: this.getRandomAngleInDegrees(),
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale
      });
      var max = berry.width * scale;
      var min = max * 0.5;
      berry.set({
        top: min - Math.random() * max,
        left: min - Math.random() * max
      });
      berry.on("mouse:down", this.berryClick.bind(this));
      group.add(berry);
    }
    group.set({ left: pointer.x, top: pointer.y });
    this.canvas.add(group);
  },
  berryClick: function berryClick(e) {
    console.log("berry click");
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
        image.set({ selectable: false, maxScale: this.getRandomScale() });
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
    return 0.2 + Math.random() * 0.4;
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
    this.stampBerries(pointer);
  },
  onMouseMove: function onMouseMove(pointer) {},
  onMouseUp: function onMouseUp() {}
});
