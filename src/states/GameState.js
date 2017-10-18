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
    //this.app.on("resize", this.onResize.bind(this));
    this.onResize(this.app.realWidth, this.app.realHeight);
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
  p.onResize = function(width, height) {
    var aspectRatio = width / height;
    var scaleH = (100 / aspectRatio) | 0;
    console.log("Aspect Ratio: " + aspectRatio);
    console.log("width: " + width, "height: " + height);
    console.log("ScaleH: " + scaleH);
    var resizeElement = document.getElementById("stickerbook-canvas-container");
    resizeElement.style.width = "100vw";
    resizeElement.style.height = scaleH + "vw";
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
    this.stickerbook.backgroundManager.setPositioning("fit-height");
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
