(function() {
  //Import classes
  var Sprite = include("PIXI.Sprite"),
    MudSplatter = include("nature_art_box.MudSplatter");

  var MudSplat = function(panel, data) {
    this.panel = panel;
    this.app = panel.app;
    Sprite.call(this, this.app.getCache(data.name));
    this.anchor.set(0.5);
    this.name = data.name;

    //rotate randomly
    this.rotation = MudSplatter.getRandomRotation();

    //scale
    this.scale.x = MudSplatter.getRandomScale();
    this.scale.y = MudSplatter.getRandomScale();
    this.tint = 0x00ff00;
  };

  var p = extend(MudSplat, Sprite);

  //Assign to namespace
  namespace("nature_art_box").MudSplat = MudSplat;
})();
