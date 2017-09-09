/**
 * 場
 * @param id string
 * @constructor
 */
var TrumpTable = function(id){
    // コンスタラクタ
    // ⇒グローバル変数で定義する。
    //
    this._trumpTabel = $('<div>').text(id).attr('id', id);
    this._cards = new TrumpCards('hoge');
    // このタイミングでは未定義のメソッド、も指定可能。
    // ⇒「this」は実行時解決されるから。
    // this.itsLoadedStr = this.load();
};
(function(){
    //
    // 続いて、prototypeを用いてメソッドを定義
    // ⇒即時関数の中で行うことで、静的praivate変数／メソッドを実装可能。
    // 　クロージャーの仕組みを利用している。
    //
    // ⇒動的なpraivate変数は諦める。
    // 　（メソッドは、適宜thisを渡すことで動的な実装は可能）。
    //
    // ⇒JavaScriptの場合は、メソッドは「静的な枠」＋「動的なメンバ変数」で実装する。
    //
    // ※prototype内で function(){} 定義するときは、thisに注意。
    // 　⇒ function(){ の内部 } では、thisは呼び出し元になり、このクラスインスタンスを指さない。
    // 　⇒ function() の親側で var self = this; して、function(){ の内部 } では、
    // 　　 self.～の形式で呼ぶこと（selfはクロージャーになる）。
    //
    // var COOKIE_OPTION = { expires: 7 }; // 静的プライベート変数

    /**
     * 場を表示
     */
    TrumpTable.prototype.show = function(){
        $('body').append(this._trumpTabel);
        this._cards.show(this._trumpTabel);
    };
    // CookieBind.prototype.load = function(){
    //     return $.cookie( this._cookieName );
    // };
    // CookieBind.prototype.getValue = function(){
    //     return this.itsLoadedStr;
    // }
    // CookieBind.prototype.getCookieName = function(){
    //     return this._cookieName;
    // }
    // prototype = {}; は禁止。いろいろ破壊するので、扱いが面倒。
}());