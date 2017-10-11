(function() {
  //Import classes
  var Container = include("PIXI.Container"),
    MudSplatter = include("nature_art_box.MudSplatter"),
    MudSplat = include("nature_art_box.MudSplat");

  var MudSplatGroup = function(panel, count, mudSplatData) {
    this.panel = panel;
    this.app = panel.app;
    Container.call(this);

    this.mudSplatData = mudSplatData;
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
    var mudSplat = new MudSplat(
      this,
      this.mudSplatData[
        Math.round(Math.random() * (this.mudSplatData.length - 1))
      ]
    );
    return mudSplat;
  };
  p.animate = function() {
    this.scale.set(MudSplatter.MudSplatInitScale);
    createjs.Tween
      .get(this.scale)
      .to({ x: 1, y: 1 }, MudSplatter.MudSplatAnimTime, createjs.Ease.quadOut);
  };

  //Assign to namespace
  namespace("nature_art_box").MudSplatGroup = MudSplatGroup;
})();
