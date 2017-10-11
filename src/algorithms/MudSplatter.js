(function() {
  var MudSplatter = {
    MudSplatInitScale: 0.5,
    MudSplatAnimTime: 200
  };

  MudSplatter.getRandomScale = function() {
    return 0.6 + Math.random() * 0.6; //random scale, min 0.6 and max 1.2
  };

  MudSplatter.getRandomRotation = function() {
    return Math.random() * (Math.PI * 2); //random rotation, 0 to 360 degrees
  };

  namespace("nature_art_box").MudSplatter = MudSplatter;
})();
