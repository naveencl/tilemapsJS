(function() {
  //Import classes
  var BaseState = include("springroll.pixi.BaseState"),
    GamePanel = include("nature_art_box.GamePanel");

  /**
	 * The logic for the title state
	 * @class nature_art_box.GameState
	 * @extends springroll.easeljs.BaseState
	 */
  var GameState = function(options) {
    BaseState.call(this, new GamePanel(), options);
  };

  //super
  var s = BaseState.prototype;

  // Extend the base class
  var p = extend(GameState, BaseState);

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
  namespace("nature_art_box").GameState = GameState;
})();
