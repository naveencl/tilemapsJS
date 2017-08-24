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
      if (DEBUG) {
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
