(function() {
  //Import classes
  var Container = include("PIXI.Sprite");

  var MudSplat = function(panel, data) {
    this.panel = panel;
    this.app = panel.app;
    Container.call(this, this.app.getCache(data.name));
    this.anchor.set(0.5);
    this.name = data.name;

    //rotate randomly
    this.rotation = this.getRandomRotation();

    //scale
    this.scale.x = this.getRandomScale();
    this.scale.y = this.getRandomScale();
  };

  var p = extend(MudSplat, Container);

  p.getRandomScale = function() {
    return 0.6 + Math.random() * 0.6;
  };

  p.getRandomRotation = function() {
    return Math.random() * (Math.PI * 2);
  };

  //Assign to namespace
  namespace("nature_art_box").MudSplat = MudSplat;
})();
