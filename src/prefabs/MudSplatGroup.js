(function() {
  //Import classes
  var Container = include("PIXI.Container"),
    MudSplat = include("nature_art_box.MudSplat");

  var MudSplatGroup = function(panel, count) {
    this.panel = panel;
    this.app = panel.app;
    Container.call(this);

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
    var mud_splats = this.app.config.data.mud_splats;
    var mudSplat = new MudSplat(
      this,
      mud_splats[Math.round(Math.random() * (mud_splats.length - 1))]
    );
    return mudSplat;
  };

  //Assign to namespace
  namespace("nature_art_box").MudSplatGroup = MudSplatGroup;
})();
