/**
 * カード（複数）
 * @param PIXI PIXI
 * @constructor
 */
var TrumpCards = function (PIXI) {
    this._PIXI = PIXI;
    this._trumpCards = [];
    for (var i = 1; i < 53; i++) {
        this._trumpCards[i] = new TrumpCard(PIXI, i);
    }
    // $('<div style="background-color: red;">').text(id).attr('id', id);
};
(function () {
    /**
     * カード（複数）を表示
     * @param trumpTable 場
     */
    TrumpCards.prototype.show = function (trumpTable) {
        //trumpTable.append(this._trumpCards);
        for (var i = 1; i < 53; i++) {
            this._trumpCards[i].show(trumpTable);
        }
    };
}());
