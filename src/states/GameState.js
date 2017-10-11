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
