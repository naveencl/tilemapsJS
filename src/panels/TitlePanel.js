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
