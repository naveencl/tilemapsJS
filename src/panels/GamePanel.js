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
