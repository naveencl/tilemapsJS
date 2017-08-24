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

    //mud splats - combination of 2 images
    var startX = 100;
    var offsetX = 200;
    var offsetY = 180;
    var mudSplatGroup,
      i = 0;

    var totalMudSplats = 2;
    var startY = 120;

    for (i = 0; i < 10; i++) {
      mudSplatGroup = new MudSplatGroup(this, totalMudSplats);
      mudSplatGroup.x = startX + offsetX * (i % 5);
      mudSplatGroup.y = startY + offsetY * Math.floor(i / 5);
      this.container.addChild(mudSplatGroup);
      this.mudSplatGroups.push(mudSplatGroup);
    }

    //mud splats - combination of 3 images
    totalMudSplats = 3;
    startY = 520;

    for (i = 0; i < 10; i++) {
      mudSplatGroup = new MudSplatGroup(this, totalMudSplats);
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
