/**
 * カード（複数）
 * @param id
 * @constructor
 */
var TrumpCards = function(id){
    this._trumpCards = $('<div>').text(id).attr('id', id);
};
(function(){
    /**
     * カード（複数）を表示
     * @param trumpTable 場
     */
    TrumpCards.prototype.show = function(trumpTable){
        trumpTable.append(this._trumpCards);
    };
}());
