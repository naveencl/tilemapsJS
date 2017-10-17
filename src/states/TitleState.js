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
