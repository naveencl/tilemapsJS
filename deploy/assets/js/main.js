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
  p.setup = function() {
    //background
    this.background = new PIXI.Sprite(this.app.getCache("GameBackground"));
    this.addChild(this.background);

    //title
    this.titleText = new PIXI.Text("Nature Art Box", {
      font: "bold 45px Arial",
      fill: "#F7EDCA"
    });
    this.titleText.anchor.set(0.5);
    this.addChild(this.titleText);

    //container for adding all mud splats
    this.container = new PIXI.Container();
    this.addChild(this.container);

    var renderTexture = new PIXI.RenderTexture(100, 100);
    //console.log(PIXI.RenderTexture());
    //var baseRenderTexture = new PIXI.BaseRenderTexture(100, 100);
    console.log(this.app);
  };

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
    this.removeChild(this.background);
    this.background = null;
  };

  //Assign to namespace
  namespace("nature_art_box").GamePanel = GamePanel;
})();

(function() {
  //Import classes
  var BasePanel = include("springroll.pixi.BasePanel");
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
  };
  /**
     * Un-setup the panel when exiting the state
     */
  p.teardown = function() {
    s.teardown.call(this);
    this.removeChild(this.background);
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
  };

  //super
  var s = BaseState.prototype;

  // Extend the base class
  var p = extend(GameState, BaseState);

  /**
	 * When the transition is done playing and we're fully in
	 */
  p.enterDone = function() {
    this.app.display.stage.interactive = true;
    this.app.display.stage.on("mousedown", this.onDown);
    this.app.display.stage.on("touchstart", this.onDown);
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

  p.exitStart = function() {
    // Release event listeners
    this.app.display.stage.interactive = false;
    this.app.display.stage.off("mousedown", this.onDown);
    this.app.display.stage.off("touchstart", this.onDown);
  };
  /**
	 * When the state fully exits
	 * @method  exit
	 */
  p.exit = function() {
    // Release event listeners
    this.app.display.stage.interactive = false;
    this.app.display.stage.off("mousedown", this.onDown);
    this.app.display.stage.off("touchstart", this.onDown);
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
  };

  //super
  var s = BaseState.prototype;

  // Extend the base class
  var p = extend(TitleState, BaseState);

  /**
	 * When the transition is done playing and we're fully in
	 */
  p.enterDone = function() {};

  p.exitStart = function() {
    // Release event listeners
  };
  /**
	 * When the state fully exits
	 * @method  exit
	 */
  p.exit = function() {
    // Release event listeners
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
    state: "game",
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