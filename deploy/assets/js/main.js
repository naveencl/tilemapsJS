!function(){"use strict";var a=include("springroll.Application"),b=include("springroll.pixi.PixiDisplay"),c=new a({name:"P_New_P",canvasId:"stage",configPath:"assets/config/config.json",display:b,displayOptions:{clearView:!0},enableHiDPI:!0,preload:[{id:"buttons",src:"assets/images/buttons.png"},{id:"mookie",src:"assets/images/mookie.png"},{id:"game-sprites",src:"assets/images/game-sprites.png"},{id:"nature-cat",src:"assets/images/nature-cat.png"},{id:"CaveCartoon",src:"assets/images/CaveCartoon.png"},{id:"CaveBaseForeground",src:"assets/images/CaveBaseForeground.png"},{id:"Cave_platforms",src:"assets/images/Cave_platforms.png"},{id:"title-screen",src:"assets/images/title-screen.png"}],responsive:!0,state:"menu",version:"0.0.3"});c.on("init",function(){}),window.app=c}(),function(){"use strict";return platypus.createComponentClass({id:"NameOfComponent",properties:{propertyName1:"property-value"},publicProperties:{propertyName2:"property-value"},initialize:function(){},events:{},methods:{},publicMethods:{}})}();