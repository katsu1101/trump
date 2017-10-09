var TrumpCard = function (_PIXI, id) {
    this._PIXI = _PIXI;
    this._id = id;

    this._markStr = {
        '0': 's',
        '1': 'd',
        '2': 'h',
        '3': 'c'
    };
    this._numStr = {
        1:'01', 2:'02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09',
        10: '10', 11: '11', 12: '12', 13: '13'
    };

};
(function () {
    TrumpCard.prototype.show = function () {

        var s = this._getTrumpMarkAndNum(this._id);
        var self = this;

        this._PIXI.loader.add(s, 'img/png/' + s + '.png')
            .load(function(loader, resources) {

                // This creates a texture from a 'bunny.png' image.
                self._bunny = new PIXI.Sprite(resources[s].texture);

                var num = ((self._id - 1) % 13);
                var mark = (self._id - num) / 13;

                // Setup the position of the bunny
                self._bunny.x = app.renderer.width * Math.random();
                self._bunny.y = app.renderer.height * Math.random();

                // Rotate around the center
                self._bunny.anchor.x = 0.5;
                self._bunny.anchor.y = 0.5;
                // load the texture we need
                // Add the bunny to the scene we are building.
                app.stage.addChild(this._bunny);

                var self2 = this;
                // Listen for frame updates
                app.ticker.add(function() {
                    // each frame we spin the bunny around a bit
                    self2._bunny.rotation += 0.02;
                });

            });
    };

    TrumpCard.prototype._getTrumpMarkAndNum = function (id) {
        var num = ((id - 1) % 13) + 1;
        var mark = (id - num) / 13;
        return　this._markStr[mark] + this._numStr[num];
    }
}());
