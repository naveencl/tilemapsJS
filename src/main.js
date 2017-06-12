/*global include, window */
(function () {
    "use strict";

    // Library dependencies
    var Application = include('springroll.Application'),
        Display = include('springroll.pixi.PixiDisplay'),
        app = new Application({ // Create a new application
            name: "P_New_P",
            canvasId: "stage",
            configPath: "assets/config/config.json",
            display: Display,
            displayOptions:    {
                clearView: true
            },
            enableHiDPI: true,
            preload: [
                {"id": "buttons",        "src": "assets/images/buttons.png"},
                {"id": "mookie",         "src": "assets/images/mookie.png"},
                {"id": "game-sprites",   "src": "assets/images/game-sprites.png"}, 	 
                {"id": "nature-cat",   "src": "assets/images/nature-cat.png"}, 	 
                {"id": "CaveCartoon",   "src": "assets/images/CaveCartoon.png"},   
                {"id": "CaveBaseForeground",   "src": "assets/images/CaveBaseForeground.png"},   
                {"id": "Cave_platforms",   "src": "assets/images/Cave_platforms.png"},   
                {"id": "title-screen",   "src": "assets/images/title-screen.png"}
                
            ],
            responsive: true,
            state: "menu",
            version: "0.0.3"
        });

    // Handle when app is ready to use
    app.on('init', function () {
        // Start game
    });

    // Assign to the window for easy access
    window.app = app;
}());
