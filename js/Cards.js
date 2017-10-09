// --------------------
// トランプセットクラス
// --------------------
// 引数 aid: 表示エリア, count: カード枚数
function Cards(aid, count, chara, A) {

    const CARD_WIDTH = 37;     // トランプの幅
    const CARD_HEIGHT = 60;    // トランプの高さ
    const CARD_SPEED = FPS / 2;
    var _count = count;
    var _chara = chara;
    var _A = A;

    var _card = [0..count - 1]; // トランプオブジェクトの配列
    var _aid = aid; // 表示エリア
    var _msg = '';
    var _msg_time = 0;
    var _select = -1;
    var _turn = false;
    var _pass = 0;

    if (data[chara]) {
        $('#' + aid).css({"background": data[chara].background});
    }

    // トランプオブジェクトの作成
    for (var i = 0; i < count; i++) {
        _card[i] = new _Card(aid, i, i);
        _card[i].init();
    }

    // プロパティ
    this.count = function () {
        return _count;
    }; // カード枚数
    this.getCard = function (n) {
        return _card[n];
    };
    this.selectCard = _selectCard;
    this.putMsg = _putMsg;
    this.putMsgT = _putMsgT;
    this.checkCard = _checkCard;
    this.refresh = _refresh;
    this.getSelect = function () {
        return _select;
    };
    this.getPass = function () {
        return _pass;
    };

    // メソッド
    this.disp = _disps; // トランプセットオブジェクトの表示メソッド
    this.deal = _deal;
    this.add = _add;
    this.sort = _sort;
    this.select = _clickSelect;
    this.setTurn = _setTurn;
    this.setPass = _setPass;

    function _setPass(pass) {
        _pass = pass;
    }

    function _clickSelect(n) {
        _select = n;
    }


    return this;// トランプセットオブジェクトを返却

    // --------------
    // トランプクラス
    // --------------
    // 引数 aid: 表示エリアID、n: トランプの種類(0～)
    function _Card(aid, n, i) {

        var _side = 1; // トランプの向き 0: 表、1: 裏
        var _aid = aid;// トランプの表示エリア

        // トランプの種類 0: スペードのA, 51: ハートのK 52～: ジョーカー
        var _n = n;

        // マーク 0: スペード, 1: ダイヤ, 2: クラブ, 3:ハート, 4: ジョーカー
        var _mark = parseInt(n / 13);

        // 番号 1: A, 2: 2, ... 11: J, 12: Q, 13: K
        var _num = n % 13 + 1;

        var _cid = 'card_' + _mark + '-' + _num; // トランプ表示用divのID
        var _i = i;
        var _x, _y;
        var _anime = 0;

        // プロパティ
        this.mark = _mark;
        this.num = _num;
        this.n = _n;

        // メソッド
        this.init = _init;
        this.x = function () {
            return _x;
        };
        this.y = function () {
            return _y;
        };

        this.setSide = _setSide;
        this.setIndex = _setIndex;
        this.moveFrom = _moveFrom;
        this.resetPos = _resetPos;

        this.disp = _disp;// トランプ表示メソッド
        this.hide = _hide;

        return this;// トランプオブジェクトを返却

        function _getPos() {

            var _x = 0;
            var _y = 0;
            var _f = false;

            // 表示エリアのサイズ情報取得
            var awidth = parseInt($('#' + _aid).css("width"));
            var aheight = parseInt($('#' + _aid).css("height"));

            // 表示エリアの位置情報取得
            var pos = $('#' + _aid).position();
            var aleft = pos.left;
            var atop = pos.top;
            var step;

            // エリア別の表示位置
            if (_aid === 'Talon') {

                // 山エリアの表示位置
                _x = aleft + ( awidth - CARD_WIDTH  ) / 2;
                _y = atop + ( aheight - CARD_HEIGHT ) / 2
                    - parseInt(_i / 2) * 2;
            } else if (_aid === 'Area') {

                // 場エリアの表示位置
                _x = aleft + ( _num - 1 ) * ( CARD_WIDTH + 3 )
                    + ( awidth - ( CARD_WIDTH + 3 ) * 13 ) / 2;
                _y = atop + _mark * ( CARD_HEIGHT + 3 )
                    + ( aheight - ( CARD_HEIGHT + 3 ) * 4 ) / 2;
            } else if (_aid === 'Opp1' || _aid === 'Opp2' || _aid === 'Opp3') {

                // 敵手札エリアの表示位置
                step = ( awidth - CARD_WIDTH * 2 ) / _count;
                if (step > CARD_WIDTH + 4) {
                    step = CARD_WIDTH + 4;
                }
                _x = aleft + awidth - _i * step - CARD_WIDTH * 1.5;
                _y = atop + ( aheight - CARD_HEIGHT ) + _i / _count * 20 - 20;
            } else if (_aid === 'Player') {

                // プレイヤー手札エリアの表示位置
                step = ( awidth - CARD_WIDTH * 1.5 ) / _count;
                if (step > CARD_WIDTH * 1.5) {
                    step = CARD_WIDTH * 1.5;
                }
                var __canPut = _canPut(_A, _mark, _num);
                _x = aleft + _i * step + CARD_WIDTH * 2;
                _y = atop + ( aheight - CARD_HEIGHT ) / 2
                    - __canPut * 10;
                if (__canPut) {
                    _f = true;
                    /*$( '#' + _cid ).click(
                        function(){
                            P.select(_i);
                    })
                    .css({"cursor": "pointer"});*/
                }
            }

            // プロパティをセット
            this.x = _x;
            this.y = _y;
            this.canPut = _f;

            // 表示位置オブジェクトを返却
            return this;

        }

        function _init() {
            var a = getCardText(_mark, _num);
            $("<div id='" + _cid + "' class='card'>" +
                a + "</div>").appendTo('#Cards');
        }

        // トランプ表示メソッド(実体)
        function _disp() {

            if (_anime < 0) {
                return;
            }
            var z_index_p = 0;
            if (_aid === 'Talon') {
                z_index_p = 200;
            } else if (_aid === 'Area') {
                z_index_p = 100;
            } else if (_aid === 'Player') {
                z_index_p = 300;
            }
            // トランプのデフォルト表示位置(デフォルトエリアから計算)
            var _pos = new _getPos();
            if (_anime > 0) {
                _x = _x + ( _pos.x - _x ) / _anime * 1.1;
                _y = _y + ( _pos.y - _y ) / _anime * 1.1;
            } else if (_anime === 0) {
                _x = _pos.x;
                _y = _pos.y;
            }
            _anime--;
            if (_pos.canPut) {
                $('#' + _cid).click(
                    function () {
                        P.select(_i);
                    })
                    .css({"cursor": "pointer"});
            } else {
                $('#' + _cid).unbind("click")
                    .css({"cursor": ""});
            }

            // トランプの表示位置を指定
            $("#" + _cid).css({
                "left": ~~_x,
                "top": ~~_y
            });


            var a = getCardText(_mark, _num);
            $("#" + _cid).html(a);

            // トランプ表示用divに情報を追加
            $("#" + _cid)
            //.html( a ) // テキスト
                .removeClass()       // classを一旦削除
                .addClass('card') // デフォルトclassをセット
                .css({"z-index": _i + z_index_p});

            if (_side) {

                // トランプが裏向きだったら
                // 裏向き用classをセット
                $("#" + _cid).addClass('cardN');

            } else if (_mark === 4) {

                // トランプジョーカーだったら
                // ジョーカー用classをセット
                $("#" + _cid).addClass('cardJ');

            } else if (_mark % 2 === 0) {

                // トランプのマークがスペードかクラブだったら
                // 黒用classをセット
                $("#" + _cid).addClass('cardB');

            } else {

                // トランプのマークがダイヤかハートだったら
                // 赤用classをセット
                $("#" + _cid).addClass('cardR');
            }

            if (_i === _select) {
                $("#" + _cid).addClass('cardS');
            }

        }

        function _setSide(side) {
            _side = side;
        }

        function _setIndex(i) {
            _i = i;
        }

        function _hide() {
            $('#' + _cid).html('');
        }

        function _moveFrom(card, anime) {
            _x = card.x();
            _y = card.y();
            _anime = anime;
        }

        // トランプのテキストを取得する関数
        function getCardText(mark, num/*, side*/) {

            /*if( side ) {

                // 裏向き
                return "&nbsp;&nbsp;<br>&nbsp;&nbsp;";
            }*/
            if (mark === 4) {

                // ジョーカー
                return "Jo<br>ker";
            }

            // スペード、ダイヤ、クラブ、ハートのトランプ
            return getMarkText(mark) + "<br>" + getNumText(num);
        }

        // マークのテキストを取得する関数
        function getMarkText(mark) {

            if (mark === 0) {

                // スペード
                return "&spades;";

            } else if (mark === 1) {

                // ダイヤ
                return "&diams;";

            } else if (mark === 2) {

                // クラブ
                return "&clubs;";

            } else if (mark === 3) {

                // ハート
                return "&hearts;";

            }

            // 理論上ここには来ない
            return "err";
        }

        // トランプのナンバーを示すテキストを返す関数
        function getNumText(num) {

            if (num === 1) {

                // A
                return "A";

            } else if (num === 11) {

                // J
                return "J";

            } else if (num === 12) {

                // Q
                return "Q";

            } else if (num === 13) {

                // K
                return "K";

            }

            // 2～10
            return num;
        }

        function _resetPos() {
            var tmp = new _getPos();
            _x = tmp.x;
            _y = tmp.y;
        }

    }

    function _canPut(A, mark, num) {
        var f;
        var i, j;
        if (num === 6 || num === 8) {
            return true;
        }
        if (num < 7) {
            for (i = 6; i > num; i--) {
                f = false;
                for (j = 0; j < A.count(); j++) {
                    var aCard = A.getCard(j);
                    if (mark === aCard.mark && i === aCard.num) {
                        f = true;
                        break;
                    }
                }
                if (!f) {
                    return false;
                }
            }
            return true;
        }
        for (i = 8; i < num; i++) {
            f = false;
            for (j = 0; j < A.count(); j++) {
                aCard = A.getCard(j);
                if (mark === aCard.mark && i === aCard.num) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                return false;
            }
        }
        return true;
    }

    function _selectCard(A) {
        if (data[chara].level.base > 0) {
            // AやKを優先（level 1 以上）
            for (var i = 0; i < _count; i++) {
                var myCard = _card[i];
                var myMark = myCard.mark;
                var myNum = myCard.num;
                if ((myNum === 1 || myNum === 13 ) && _canPut(A, myMark, myNum)) {
                    return i;
                }
            }
        }
        if (data[chara].level.base > 1) {
            for (var i = 0; i < _count; i++) {
                var myCard = _card[i];
                var myMark = myCard.mark;
                var myNum = myCard.num;
                if (_canPut(A, myMark, myNum)) {
                    var f = true;
                    // 続きが出せるor端を優先（level 2 以上）
                    if (myNum < 7) {
                        if (_checkCard(myMark, myNum - 1)) {
                            return i;
                        }

                        for (var j = 1; j < myNum; j++) {
                            if (A.checkCard(myMark, j) === -1
                                && _checkCard(myMark, j) === -1) {
                                f = false;
                                break;
                            }
                        }
                        if (f) {
                            return i;
                        }
                    } else {
                        if (_checkCard(myMark, myNum + 1)) {
                            return i;
                        }
                        for (var j = 13; j > myNum; j--) {
                            if (A.checkCard(myMark, j) === -1
                                && _checkCard(myMark, j) === -1) {
                                f = false;
                                break;
                            }
                        }
                        if (f) {
                            return i;
                        }
                    }
                }
            }
        }
        if (data[chara].level.base > 2) {
            var count_me = 0;
            var count_en = 0;
            var select = -1;
            for (var i = 0; i < _count; i++) {
                var myCard = _card[i];
                var myMark = myCard.mark;
                var myNum = myCard.num;
                if (_canPut(A, myMark, myNum)) {
                    var tmp_count_me = 0;
                    var tmp_count_en = 0;
                    if (myNum < 7) {
                        for (var j = myNum; j >= 1; j--) {
                            if (_checkCard(myMark, j)) {
                                tmp_count_me++;
                            } else {
                                tmp_count_en++;
                            }
                        }
                    } else {
                        for (var j = myNum; j <= 13; j++) {
                            if (_checkCard(myMark, j)) {
                                tmp_count_me++;
                            } else {
                                tmp_count_en++;
                            }
                        }
                    }
                    if (count_me < tmp_count_me ||
                        ( count_me === tmp_count_me && count_en > tmp_count_en)) {
                        count_me = tmp_count_me;
                        count_en = tmp_count_en;
                        select = i;
                    }
                }
            }
            if (select !== -1) {
                return select;
            }
        }
        for (var i = 0; i < _count; i++) {
            var myCard = _card[i];
            var myMark = myCard.mark;
            var myNum = myCard.num;
            if (_canPut(A, myMark, myNum)) {
                return i;
            }
        }
        return -1;
    }

    function _checkCard(myMark, myNum) {
        for (i = 0; i < _count; i++) {
            var myCard = _card[i];
            var tmpMark = myCard.mark;
            var tmpNum = myCard.num;
            if (tmpMark === myMark && tmpNum === myNum) {
                return i;
            }
        }
        return -1;
    }

    function _refresh() {
        for (var i = 0; i < _count; i++) {
            _card[i].moveFrom(_card[i], 3);
        }
    }

    // トランプセット表示メソッド(実体)
    function _disps() {

        if (_chara) {
            $('#' + _aid + '_name').text(data[_chara].name);
        }

        // すべてのトランプを処理
        for (var i = 0; i < _count; i++) {

            // トランプクラスの表示メソッドを呼び出す
            if (_card[i]) {
                _card[i].disp();
            }
        }
        if (_count > 0) {
            $('#' + _aid + '_count').text(_count);
        } else {
            $('#' + _aid + '_count').text("");
        }

        if (_msg_time > 0) {
            $('#' + _aid + '_msg')
                .html(_msg)
                .css({"visibility": "visible"});
            _msg_time--;
        } else {
            $('#' + _aid + '_msg').css({"visibility": "hidden"});
        }

        if (_turn) {
            $('#' + _aid).css({"border-style": "ridge", "border-color": "red"});
            $('#Pass').click(
                function () {
                    P.select(-2);
                }).css({"cursor": "pointer", "border-color": "red"});
            if (_select === -2) {
                $("#Pass").css("color", "#ee9999");
            } else {
                $('#Pass').css("color", "#000000");
            }
        } else {
            $('#' + _aid).css({"border-style": "dotted", "border-color": "#000000"});
            $('#Pass').css({"color": "#000000", "border-color": "#000000"});
        }
        var tmp_html = '';
        for (i = 0; i < _pass; i++) {
            tmp_html += '<div class="pass">Pass</div>';
        }
        $('#' + _aid + '_pass').html(tmp_html);
    }

    // トランプを一枚引く
    // 引数 n -1: ランダム 0～:指定番号
    function _deal(n) {
        if (n === -1) {
            n = Math.floor(Math.random() * _count);
        }
        if (n > _count) {
            n = _count - 1;
        }
        var retval = _card[n];
        for (i = n; i < _count - 1; i++) {
            _card[i] = _card[i + 1];
            _card[i].setIndex(i);
            _card[i].moveFrom(_card[i + 1], CARD_SPEED);
        }
        _card[_count - 1].hide();
        _card[_count - 1] = null;
        _count = _count - 1;
        return retval;
    }

    // トランプを追加する
    // 引数 card: カードクラス
    function _add(card, side) {
        _card[_count] = new _Card(_aid, card.n, _count);
        _card[_count].moveFrom(card, CARD_SPEED);
        _card[_count].setSide(side);
        _count = _count + 1;
    }

    function _sort() {

        var tmp = [];
        for (i = 0; i < _count; i++) {
            tmp[i] = _card[i];
        }

        for (i = 0; i < _count - 1;) {
            if (_card[i].n > _card[i + 1].n) {
                var card = _card[i];
                _card[i] = _card[i + 1];
                _card[i + 1] = card;
                i--;
                if (i < 0) {
                    i = 0;
                }
            } else {
                i++;
            }
        }

        for (var i = 0; i < _count; i++) {
            _card[i].setIndex(i)
            _card[i].resetPos();
            _card[i].moveFrom(tmp[i], CARD_SPEED);
        }
    }

    function _putMsg(msg, msg_time) {
        _msg = msg;
        _msg_time = msg_time;
    }

    function _putMsgT(msg_type, msg_time) {
        _msg = data[_chara].msg[msg_type];
        _msg_time = msg_time;
    }

    function getCharaName(chara) {
        if (chara === 'mami') {
            return '真美';
        } else if (chara === 'yayoi') {
            return 'やよい';
        } else if (chara === 'ami') {
            return '亜美';
        }
        return '';
    }

    function _setTurn(f) {
        _turn = f;
    }
}
