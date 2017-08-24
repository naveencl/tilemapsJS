(function() {
  //Import classes
  var BasePanel = include("springroll.pixi.BasePanel");
  /**
     * Panel contains all of the visual elements for the title state
     * @class nature_art_box.GamePanel
     * @extends springroll.pixi.BasePanel
     */
  var GamePanel = function() {
    BasePanel.call(this);
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
