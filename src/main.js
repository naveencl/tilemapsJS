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
    state: "title",
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
  if (DEBUG && DebugOptions) {
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
