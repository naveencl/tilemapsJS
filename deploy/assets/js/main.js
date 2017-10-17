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

var MudBrush = fabric.util.createClass(fabric.BaseBrush, {
  initialize: function initialize(canvas, options) {
    this.canvas = canvas;
    this.aspectRatio = 1;
    var images = options.images;
    this.imageElements = [];
    var host = location.toString();
    images = [
      host + "assets/images/splatters/splat1.png",
      host + "assets/images/splatters/splat2.png",
      host + "assets/images/splatters/splat3.png",
      host + "assets/images/splatters/splat4.png",
      host + "assets/images/splatters/splat5.png",
      host + "assets/images/splatters/splat6.png",
      host + "assets/images/splatters/splat7.png",
      host + "assets/images/splatters/splat8.png",
      host + "assets/images/splatters/splat9.png",
      host + "assets/images/splatters/splat10.png",
      host + "assets/images/splatters/splat11.png",
      host + "assets/images/splatters/splat12.png",
      host + "assets/images/splatters/splat13.png",
      host + "assets/images/splatters/splat14.png"
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
    for (var i = 0; i < 2; i++) {
      this.createBitmap(this.imageElements[i]);
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
    //this.context.drawImage(image, 0, 0);

    var currentRgbaColor = this.getRgbColor(this.color);
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
    this.canvas.contextTop.fillStyle = this.color;
    this.createRandomBitmap();
    this.stampImage(pointer);
  },
  onMouseMove: function onMouseMove(pointer) {},
  onMouseUp: function onMouseUp() {},
  animate: function animate(image) {
    image.set({ opacity: 0 });
    image.scale(0.1);
    this.canvas.add(image);
    image.animate(
      { scaleX: image.maxScale, scaleY: image.maxScale, opacity: 1 },
      {
        onChange: this.canvas.renderAll.bind(this.canvas),
        duration: 200,
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

(function() {
  var MudSplatter = {
    MudSplatInitScale: 0.5,
    MudSplatAnimTime: 200
  };

  MudSplatter.getRandomScale = function() {
    return 0.6 + Math.random() * 0.6; //random scale, min 0.6 and max 1.2
  };

  MudSplatter.getRandomRotation = function() {
    return Math.random() * (Math.PI * 2); //random rotation, 0 to 360 degrees
  };

  namespace("nature_art_box").MudSplatter = MudSplatter;
})();

(function() {
  //Import classes
  var Sprite = include("PIXI.Sprite"),
    MudSplatter = include("nature_art_box.MudSplatter");

  var MudSplat = function(panel, data) {
    this.panel = panel;
    this.app = panel.app;
    Sprite.call(this, this.app.getCache(data.name));
    this.anchor.set(0.5);
    this.name = data.name;

    //rotate randomly
    this.rotation = MudSplatter.getRandomRotation();

    //scale
    this.scale.x = MudSplatter.getRandomScale();
    this.scale.y = MudSplatter.getRandomScale();
    this.tint = 0x00ff00;
  };

  var p = extend(MudSplat, Sprite);

  //Assign to namespace
  namespace("nature_art_box").MudSplat = MudSplat;
})();

(function() {
  //Import classes
  var Container = include("PIXI.Container"),
    MudSplatter = include("nature_art_box.MudSplatter"),
    MudSplat = include("nature_art_box.MudSplat");

  var MudSplatGroup = function(panel, count, mudSplatData) {
    this.panel = panel;
    this.app = panel.app;
    Container.call(this);

    this.mudSplatData = mudSplatData;
    this.totalMudSplats = count;
    this.mudSplats = [];

    this.init();
  };

  var p = extend(MudSplatGroup, Container);

  p.init = function() {
    for (var i = 0; i < this.totalMudSplats; i++) {
      var mudSplat = this.getRandomMudSplat();
      this.addChild(mudSplat);
      this.mudSplats.push(mudSplat);
    }
  };

  p.getRandomMudSplat = function() {
    var mudSplat = new MudSplat(
      this,
      this.mudSplatData[
        Math.round(Math.random() * (this.mudSplatData.length - 1))
      ]
    );
    return mudSplat;
  };
  p.animate = function() {
    this.scale.set(MudSplatter.MudSplatInitScale);
    createjs.Tween
      .get(this.scale)
      .to({ x: 1, y: 1 }, MudSplatter.MudSplatAnimTime, createjs.Ease.quadOut);
  };

  //Assign to namespace
  namespace("nature_art_box").MudSplatGroup = MudSplatGroup;
})();

/**
 * @module Pixi States
 * @namespace springroll.pixi
 * @requires Core, States, UI, Sound, Pixi Display, Pixi UI
 */
(function() {
  //Import classes
  var Container = include("PIXI.Container"),
    Application;

  /**
	 * Panel with convenience properties to the config, background and app.
	 * @class BasePanel
	 * @extends PIXI.Container
	 * @constructor
	 */
  var BasePanel = function() {
    if (!Application) {
      Application = include("springroll.Application");
    }

    Container.call(this);

    /**
		 * Reference to the app
		 * @property {Application} app
		 */
    this.app = Application.instance;

    /**
		 * Reference to the app's config
		 * @property {object} config
		 */
    this.config = this.app.config;
  };

  //Extend the container
  var p = extend(BasePanel, Container);

  /**
	 * Should be called whenever a state enters this panel, Implementation-specific
	 * @method setup
	 */
  p.setup = function() {
    //Implementation specific
  };

  /**
	 * Should be called whenever a state exits this panel, the default
	 * behavior is to remove all children of the panel. It will stop
	 * any movieclip, destroy any objects, remove DwellTimers, etc.
	 * @method teardown
	 */
  p.teardown = function() {
    //TODO: This is default framework implementation for Easel panels. Need to check if we need it here at all since we use Pixi panels.
  };

  /**
	 * Removes a collection of objects from the stage and destroys them if we cant.
	 * @example this.removeChildren(this.skipButton, this.character);
	 * @method cleanupChildren
	 * @param {array|*} children Assets to clean can either be individual children or collections of children
	 */
  p.cleanupChildren = function(children) {
    var child,
      i,
      j,
      len = arguments.length;

    for (i = 0; i < len; i++) {
      child = arguments[i];

      // Check for null/undefined arguments
      if (!child) continue;

      // test the current argument to see if itself is
      // an array, if it is, run .cleanupChildren() recursively
      if (Array.isArray(child) && child.length > 0) {
        this.cleanupChildren.apply(this, child);
        continue;
      }

      // If there's an animation playing stop it
      if (this.app.animator) this.app.animator.stop(child, true);

      // Stop movie clips
      if (child.stop) child.stop();

      // Destroy anything with a destroy method
      if (child.destroy) child.destroy();

      // Recurisvely remove all children
      if (child.children) child.removeChildren();
    }
  };

  /**
	 * Destroy and don't use after this
	 * @method destroy
	 */
  p.destroy = function() {
    this.app = null;
    this.config = null;
    if (this.children) this.removeChildren();
  };

  //Assign to namespace
  namespace("springroll.pixi").BasePanel = BasePanel;
})();

(function() {
  //Import classes
  var BasePanel = include("springroll.pixi.BasePanel"),
    MudSplatGroup = include("nature_art_box.MudSplatGroup");
  /**
     * Panel contains all of the visual elements for the title state
     * @class nature_art_box.GamePanel
     * @extends springroll.pixi.BasePanel
     */
  var GamePanel = function() {
    BasePanel.call(this);

    this.mudSplatGroups = [];
  };

  //Super prototype
  var s = BasePanel.prototype;

  //Extend the base panel
  var p = extend(GamePanel, BasePanel);

  /**
     * Setup the state, this happens on each state entering
     */
  p.setup = function() {};

  p.addMudSplats = function() {
    //mud splats - combination of 2 images
    var mud_splats = this.app.config.data.mud_splats;
    var startX = 100;
    var offsetX = 200;
    var offsetY = 180;
    var mudSplatGroup,
      i = 0;

    var totalMudSplats = 2;
    var startY = 120;

    for (i = 0; i < 10; i++) {
      mudSplatGroup = new MudSplatGroup(this, totalMudSplats, mud_splats);
      mudSplatGroup.x = startX + offsetX * (i % 5);
      mudSplatGroup.y = startY + offsetY * Math.floor(i / 5);
      this.container.addChild(mudSplatGroup);
      this.mudSplatGroups.push(mudSplatGroup);
    }

    //mud splats - combination of 3 images
    totalMudSplats = 3;
    startY = 520;

    for (i = 0; i < 10; i++) {
      mudSplatGroup = new MudSplatGroup(this, totalMudSplats, mud_splats);
      mudSplatGroup.x = startX + offsetX * (i % 5);
      mudSplatGroup.y = startY + offsetY * Math.floor(i / 5);
      this.container.addChild(mudSplatGroup);
      this.mudSplatGroups.push(mudSplatGroup);
    }
  };

  /**
     * Un-setup the panel when exiting the state
     */
  p.teardown = function() {
    s.teardown.call(this);
  };

  //Assign to namespace
  namespace("nature_art_box").GamePanel = GamePanel;
})();

(function() {
  //Import classes
  var BasePanel = include("springroll.pixi.BasePanel"),
    PixiButton = include("springroll.pixi.Button");
  /**
     * Panel contains all of the visual elements for the title state
     * @class nature_art_box.TitlePanel
     * @extends springroll.pixi.BasePanel
     */
  var TitlePanel = function() {
    BasePanel.call(this);
  };

  //Super prototype
  var s = BasePanel.prototype;

  //Extend the base panel
  var p = extend(TitlePanel, BasePanel);

  /**
     * Setup the state, this happens on each state entering
     */
  p.setup = function() {
    //background
    this.background = new PIXI.Sprite(this.app.getCache("TitleBackground"));
    this.addChild(this.background);

    //title
    this.titleText = new PIXI.Text("Nature Art Box", {
      font: "bold 45px Arial",
      fill: "#F7EDCA"
    });
    this.titleText.anchor.set(0.5);
    this.addChild(this.titleText);

    var buttonAtlas = this.app.getCache("ButtonAtlas");
    this.playButton = new PixiButton(
      {
        up: buttonAtlas.getFrame("button_up"),
        down: buttonAtlas.getFrame("button_down")
      },
      {
        text: "Play",
        style: {
          font: "20px Arial",
          fill: "#ffffff"
        }
      }
    );
    this.addChild(this.playButton);
  };
  /**
     * Un-setup the panel when exiting the state
     */
  p.teardown = function() {
    s.teardown.call(this);
    this.removeChild(this.background);
    this.removeChild(this.playButton);
    this.removeChild(this.titleText);
    this.titleText = null;
    this.playButton = null;
    this.background = null;
  };

  //Assign to namespace
  namespace("nature_art_box").TitlePanel = TitlePanel;
})();

(function(undefined) {
  var State = include("springroll.State"),
    Debug,
    BasePanel;

  var BaseState = function(panel, options) {
    if (!BasePanel) {
      BasePanel = include("springroll.pixi.BasePanel");
      Debug = include("springroll.Debug", false);
    }

    if (!(panel instanceof BasePanel)) {
      throw "springroll.State requires the panel be a springroll.pixi.BasePanel";
    }

    options = options || {};

    if (options.manifest) {
      options.preload = options.manifest;
      if (true) {
        console.warn(
          "The BaseState option 'manifest' is deprecated, use 'preload' instead"
        );
      }
    }

    // Parent class constructor
    State.call(this, panel, options);

    var priority = 100;

    // @deprecated method for adding assets dynamically to task
    this.on("loading", function(assets) {}, priority)
      // Handle when assets are preloaded
      .on(
        "loaded",
        function(assets) {
          this.panel.setup();
        },
        priority
      )
      // Handle the panel exit
      .on(
        "exit",
        function() {
          this.panel.teardown();
        },
        priority
      );
  };

  // Reference to the parent prototype
  var s = State.prototype;

  // Reference to current prototype
  var p = State.extend(BaseState);

  p.destroy = function() {
    this.panel.destroy();
    s.destroy.call(this);
  };

  // Assign to the namespace
  namespace("springroll.pixi").BaseState = BaseState;
})();

(function() {
  //Import classes
  var BaseState = include("springroll.pixi.BaseState"),
    MudSplatGroup = include("nature_art_box.MudSplatGroup"),
    GamePanel = include("nature_art_box.GamePanel");

  /**
	 * The logic for the title state
	 * @class nature_art_box.GameState
	 * @extends springroll.easeljs.BaseState
	 */
  var GameState = function(options) {
    BaseState.call(this, new GamePanel(), options);
    this.onDown = this.onDown.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onBrush = this.onBrush.bind(this);
  };

  //super
  var s = BaseState.prototype;

  // Extend the base class
  var p = extend(GameState, BaseState);

  /**
	 * When the transition is done playing and we're fully in
	 */
  p.enterDone = function() {
    document.getElementById("stage").classList.add("hidden");
    document.getElementById("stickerbook-container").classList.remove("hidden");

    this.initStickerBook();

    this.backButton = document.getElementById("back");
    this.backButton.addEventListener("click", this.onBack);

    this.addClickEventListener("pencil");
    this.addClickEventListener("mud");
    this.addClickEventListener("eraser");
    this.addClickEventListener("bitmap");
    this.addClickEventListener("bitmap-eraser");
    this.addClickEventListener("marker");
    this.addClickEventListener("spray");
    this.addClickEventListener("pattern");
    this.addClickEventListener("fill");
  };
  p.addClickEventListener = function(name) {
    var button = document.getElementById(name);
    button.addEventListener("click", this.onBrush.bind(this, name));
  };
  p.onBack = function() {
    this.manager.state = "title";
  };

  p.onBrush = function(name) {
    if (!this.stickerbook) {
      return;
    }
    var host = location.toString();
    var brushConfig = {};

    if (name === "pattern") {
      this.stickerbook.setBrushWidth(50);
      brushConfig = {
        images: [
          host + "assets/images/playCircle.svg",
          host + "assets/images/coin.svg",
          host + "assets/images/star.svg"
        ]
      };
    } else if (name === "bitmap" || name === "bitmap-eraser") {
      this.stickerbook.setBrushWidth(50);
      brushConfig = {
        image: host + "assets/images/playCircle.svg"
      };
    }
    this.stickerbook.setBrush(name, brushConfig);
  };

  p.initStickerBook = function() {
    var Stickerbook = window.Stickerbook;
    var host = location.toString();

    // initialize stickerbook.
    this.stickerbook = new Stickerbook({
      container: document.getElementById("stickerbook-canvas-container"),
      stickers: [
        host + "assets/images/mudSplat1.png",
        host + "assets/images/playCircle.svg",
        host + "assets/images/star.svg"
      ],
      background: {
        enabled: [host + "assets/images/bg1.jpg"],
        default: host + "assets/images/bg1.jpg"
      },
      brush: {
        widths: [1, 10, 50],
        enabled: [
          "eraser",
          "bitmap",
          "bitmap-eraser",
          "fill",
          "marker",
          "pattern",
          "pencil",
          "spray",
          "mud",
          "berries",
          "berriessquash"
        ],
        colors: ["#654321", "#906c3f", "#0000FF", "#FF0000"],
        custom: {
          mud: MudBrush,
          berries: BerriesSplat,
          berriessquash: BerriesBrush
        }
      },
      stickerControls: {
        cornerColor: "rgba(0,0,0,0.5)",
        cornerSize: 20
      },
      mobileEnabled: true,
      useDefaultEventHandlers: true
    });

    //Made it available, as it is not available by adding them in config
    this.stickerbook.availableBrushes.mud = MudBrush;
    this.stickerbook.availableBrushes.berries = BerriesSplat;
    this.stickerbook.availableBrushes.berriessquash = BerriesBrush;

    // go ahead and set some initial state
    this.stickerbook.backgroundManager.setPositioning("fit-width");
    //this.stickerbook.setColor("#0000FF");
    this.stickerbook.setBrush("pencil");
  };

  p.onDown = function(e) {
    var mousePosition = e.data.getLocalPosition(this.panel.container);
    var mud_splats = this.app.config.data.mud_splats;
    var mudSplatGroup = new MudSplatGroup(this, 2, mud_splats);
    mudSplatGroup.x = mousePosition.x;
    mudSplatGroup.y = mousePosition.y;
    mudSplatGroup.animate();
    this.panel.container.addChild(mudSplatGroup);
    this.panel.mudSplatGroups.push(mudSplatGroup);
  };

  /**
	 * When the state fully exits
	 * @method  exit
	 */
  p.exit = function() {
    // Release event listeners
    this.stickerbook.destroy();
    delete this.stickerbook;
    if (this.backButton) {
      this.backButton.removeEventListener("click", this.onBack);
    }
    document.getElementById("stage").classList.remove("hidden");
    document.getElementById("stickerbook-container").classList.add("hidden");
  };

  p.destroy = function() {
    this.panel.destroy();
    s.destroy.call(this);
  };

  //Assign to namespace
  namespace("nature_art_box").GameState = GameState;
})();

(function() {
  //Import classes
  var BaseState = include("springroll.pixi.BaseState"),
    TitlePanel = include("nature_art_box.TitlePanel");

  /**
	 * The logic for the title state
	 * @class nature_art_box.TitleState
	 * @extends springroll.easeljs.BaseState
	 */
  var TitleState = function(options) {
    BaseState.call(this, new TitlePanel(), options);
    this.onPlay = this.onPlay.bind(this);
  };

  //super
  var s = BaseState.prototype;

  // Extend the base class
  var p = extend(TitleState, BaseState);

  /**
	 * When the transition is done playing and we're fully in
	 */
  p.enterDone = function() {
    this.panel.playButton.on("buttonPress", this.onPlay);
  };

  p.onPlay = function() {
    this.manager.state = "game";
  };

  p.exitStart = function() {
    // Release event listeners
    this.panel.playButton.off("buttonPress", this.onPlay);
    this.panel.playButton.enabled = false;
    this.panel.playButton.interactive = false;
  };
  /**
	 * When the state fully exits
	 * @method  exit
	 */
  p.exit = function() {
    // Release event listeners
    this.panel.playButton.off("buttonPress", this.onPlay);
    this.panel.playButton.enabled = false;
    this.panel.playButton.interactive = false;
  };

  p.destroy = function() {
    this.panel.destroy();
    s.destroy.call(this);
  };

  //Assign to namespace
  namespace("nature_art_box").TitleState = TitleState;
})();

(function() {
  // Library depencencies
  var DebugOptions = include("springroll.DebugOptions", false),
    TitleState = include("nature_art_box.TitleState"),
    GameState = include("nature_art_box.GameState"),
    Application = include("springroll.Application"),
    Display = include("springroll.PixiDisplay");

  var app = new Application({
    fps: 60,
    name: "Nature Art Box",
    state: "title",
    canvasId: "stage",
    configPath: "assets/config/config.json",
    manifestsPath: "assets/config/manifests.json",
    captionsPath: "assets/config/captions.json",
    display: Display,
    displayOptions: {
      clearView: true,
      transparent: true,
      antiAlias: true
    }
  });

  // Log out the qeury options
  if (true && DebugOptions) {
    DebugOptions.string("state", "title, game")
      .boolean("mute", "mute all sounds")
      .log();
  }

  // App has been initialized
  app.on("init", function() {
    var assets = this.config.assets;
    var scaling = this.config.scaling;
    var fla = this.manifests;

    // Set the states to use
    this.states = {
      title: new TitleState({
        next: "game",
        preload: assets.title,
        scaling: scaling.title
      }),
      game: new GameState({
        next: "title",
        previous: "title",
        preload: assets.game,
        scaling: scaling.game
      })
    };
  });

  // Give window access to the app
  window.app = app;
})();

//# sourceMappingURL=main.js.map