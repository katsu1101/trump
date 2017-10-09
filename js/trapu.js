// ToDo: AIの強化
// ToDo: 設定画面
// ToDo: タイトル画面
// ToDo: キャラ選択＆キャラ入れ替え

FPS = 60;// フレームレート
if ((navigator.userAgent.indexOf('iPhone') > 0 
	&& navigator.userAgent.indexOf('iPad') == -1) 
	|| navigator.userAgent.indexOf('iPod') > 0 
	|| navigator.userAgent.indexOf('Android') > 0) {
    FPS = 20;
}

CARD_MAX_COUNT = 52; // トランプセットの合計枚数
PASS_MAX = 3;

var Scene = {
	op:   1,
	menu: 2,
	game: 3,
}

var Turn = {
	hello: 1,
	T2P:   2,
	start: 3,
	PTurn: 4,
	reset: 5,
}

$(document).ready(function(){

	WAIT_T = 0;//FPS/100;
	WAIT_A = FPS/3;
	WAIT_F = FPS/2;
	
	var F = 0;// フレーム番号
	var wait = 5;
	var wait2 = 0;

	// 直ぐに処理を始めるとtdの幅などが取れない事があったため
	$(this).delay(10).queue(function() {
		
		// トランプセットオブジェクトの新規作成
		T  = new Cards('Talon' , CARD_MAX_COUNT, '', {});
		A  = new Cards('Area'  , 0, '', {});
		O1 = new Cards('Opp1'  , 0, 'marisa', A);
		O2 = new Cards('Opp2'  , 0, 'reimu' , A);
		O3 = new Cards('Opp3'  , 0, 'marupo', A);
		P  = new Cards('Player', 0, '', A);

		var scene = Scene.op;
		var turn;
		var activeP = 0;
		
		$(window).resize(function() {
			A.refresh();
			O1.refresh();
			O2.refresh();
			O3.refresh();
			P.refresh();
			T.refresh();
		});
		// メインループ
	  setInterval(function(){
			
			if( scene == Scene.op ) {
				
				// OP
				if( F > FPS  ){
					scene = Scene.menu;
				}
				
			}else if(scene == Scene.menu ) {
				
				// メニュー
				scene = Scene.game;
				turn = Turn.hello;
				
			}else if(scene == Scene.game ) {
				
				// ゲーム
				if( wait > 0 ){
					wait--;
				}else if( turn == Turn.hello ){
					
					clear_count = 0;
					pass_count = 0;
					O1.setPass( PASS_MAX );
					O2.setPass( PASS_MAX );
					O3.setPass( PASS_MAX );
					P.setPass( PASS_MAX );
					P.select( -1 );
					
					A.putMsg( '<h1>スタート</h1>', FPS*3 );
					O1.putMsgT( 'start', FPS*2.5 );
					O2.putMsgT( 'start', FPS*2.5 );
					O3.putMsgT( 'start', FPS*2.5 );
					
					turn = Turn.T2P;
				}else if( turn == Turn.T2P ) {
					
					if( activeP == 0 ) {
						activeP =  Math.floor( Math.random() * 4 ) + 1;
					}
					if( activeP == 1 ) {
						// 山から敵１へ
						if( T.count() > 0 ){
							card = T.deal( -1 );
							O1.add( card, 1 );
							wait = WAIT_T;
							activeP = 2;
						}else{
							wait = WAIT_F;
							P.select( -1 );
							activeP = 0;
							turn = Turn.start;
						}
					}else if( activeP == 2 ){
					
						// 山から敵２へ
						if( T.count() > 0 ){
							card = T.deal( -1 );
							O2.add( card, 1 );
							wait = WAIT_T;
							activeP = 3;
						}else{
							wait = WAIT_F;
							activeP = 0;
							turn = Turn.start;
						}
					}else if( activeP == 3 ){
						
						// 山から敵３へ
						if( T.count() > 0 ){
							card = T.deal( -1 );
							O3.add( card, 1 );
							wait = WAIT_T;
							activeP = 4;
						}else{
							wait = WAIT_F;
							activeP = 0;
							turn = Turn.start;
						}
					}else if( activeP == 4 ){
						
						// 山からプレイヤーへ
						if( T.count() > 0 ){
							card = T.deal( -1 );
							P.add( card, 0 );
							wait = WAIT_T;
							activeP = 1;
						}else{
							activeP = 0;
							turn = Turn.start;
						}
					}
				}else if( turn == Turn.start ) {
					
					// 手札の７を場へ
					for( i = O1.count() - 1 ; i >= 0 ; i-- ){
						card = O1.getCard( i );
						if( card.num == 7 ){
							card = O1.deal( i );
							A.add( card, 0 );
							if( card.mark == 1 ){
								activeP = 1;
								O1.putMsgT('d7', FPS*2.5);
							}
						}
					}
					for( i = O2.count() - 1 ; i >= 0 ; i-- ){
						card = O2.getCard( i );
						if( card.num == 7 ){
							card = O2.deal( i );
							A.add( card, 0 );
							if( card.mark == 1 ){
								activeP = 2;
								O2.putMsgT('d7', FPS*2.5);
							}
						}
					}
					for( i = O3.count() - 1 ; i >= 0 ; i-- ){
						card = O3.getCard( i );
						if( card.num == 7 ){
							card = O3.deal( i );
							A.add( card, 0 );
							if( card.mark == 1 ){
								activeP = 3;
								O3.putMsgT('d7', FPS*2.5);
							}
						}
					}
					for( i = P.count() - 1 ; i >= 0 ; i-- ){
						card = P.getCard( i );
						if( card.num == 7 ){
							card = P.deal( i );
							A.add( card, 0 );
							if( card.mark == 1 ){
								activeP = 4;
								O1.putMsgT('Pd7', FPS*2.5);
								O2.putMsgT('Pd7', FPS*2.5);
								O3.putMsgT('Pd7', FPS*2.5);
							}
						}
					}
					P.sort();
					wait = FPS*3;
					turn = Turn.PTurn;
				}else if( turn == Turn.PTurn ){
					
					if( activeP == 0 ) {
						activeP =  Math.floor( Math.random() * 4 ) + 1;
					}
					
					if( activeP == 1 ) {
						O = O1;
					}else if( activeP == 2 ) {
						O = O2;
						O1.setTurn(false);
					}else if( activeP == 3 ) {
						O = O3;
						O2.setTurn(false);
					}
					if( activeP == 1 || activeP == 2 || activeP == 3 ) {
						// 敵のターン
						if( O.count() > 0 ){
							O.setTurn(true);
							n = O.selectCard( A );
							if( n > -1 ){
								card = O.deal( n );
								O.refresh();
								A.add( card, 0 );
								if( O.count() == 0 ){
									clear_count++;
									if( clear_count == 1 ){
										O.putMsgT('clear-1', FPS*2.5);
									}else if( clear_count == 2 ){
										O.putMsgT('clear-2', FPS*2.5);
									}else if( clear_count == 3 ){
										O.putMsgT('clear-3', FPS*2.5);
									}else{
										O.putMsgT('clear-4', FPS*2.5);
									}
								}else{
									O.putMsgT('put', FPS/2);
								}
							}else{
								if( O.getPass() == 0 ) {
									O.putMsgT('clear-'+(4-pass_count), FPS*2.5);
									A.putMsg( '<h1>ギブアップ</h1>', FPS*3 );
									wait = FPS*3;
									while( O.count() > 0 ){
										card = O.deal( -1 );
										A.add( card, 0 );
									}
									pass_count++;
								}else{
									O.setPass( O.getPass() - 1 );
									O.putMsgT('pass', FPS*2.5);
								}
							}
							if( clear_count < 3 && wait == 0 ) {
								wait = WAIT_A;
							}
						}
						wait2 = 0;
						activeP++;
					}else{
					
						P.refresh();
						// プレイヤーのターン
						O3.setTurn(false);
						P.setTurn(true);
						if( P.count() > 0 ){
							if( O1.count() == 0 && O2.count() == 0 && O3.count() == 0 ){
								while( P.count() > 0 ){
									card = P.deal( -1 );
									A.add( card, 0 );
								}
								O1.putMsgT( 'p-clear-'+clear_count, FPS*3 );
								O2.putMsgT( 'p-clear-'+clear_count, FPS*3 );
								O3.putMsgT( 'p-clear-'+clear_count, FPS*3 );
								if( clear_count == 0 ){
									A.putMsg( data.p.msg.clear1, FPS*3 );
								}else if( clear_count == 1 ){
									A.putMsg( data.p.msg.clear2, FPS*3 );
								}else if( clear_count == 2 ){
									A.putMsg( data.p.msg.clear3, FPS*3 );
								}else{
									A.putMsg( data.p.msg.clear4, FPS*3 );
								}
								wait = WAIT_F;
								P.setTurn(false);
								turn = Turn.reset;
							}else if( P.getSelect() == -2 ) {
								//Pass
								if( P.getPass() > 0 ) {
									P.setPass( P.getPass() - 1 );
									P.select( -1 );
									activeP = 1;
								}else{
									while( P.count() > 0 ){
										card = P.deal( -1 );
										A.add( card, 0 );
									}
									if( pass_count == 0 ){
										A.putMsg( data.p.msg.clear4, FPS*3 );
									}else if( pass_count == 1 ){
										A.putMsg( data.p.msg.clear3, FPS*3 );
									}else if( pass_count == 2 ){
										A.putMsg( data.p.msg.clear2, FPS*3 );
									}else{
										A.putMsg( data.p.msg.clear1, FPS*3 );
									}
									pass_count++;
									O1.putMsgT( 'p-clear-4', FPS*5 );
									O2.putMsgT( 'p-clear-4', FPS*5 );
									O3.putMsgT( 'p-clear-4', FPS*5 );
								}
							}else if( P.getSelect() > -1){
								
								card = P.deal( P.getSelect() );
								A.add( card, 0 );
								P.select( -1 );
								if( P.count() == 0 ){
									if( clear_count == 0 ){
										A.putMsg( data.p.msg.clear1, FPS*3 );
									}else if( clear_count == 1 ){
										A.putMsg( data.p.msg.clear2, FPS*3 );
									}else if( clear_count == 2 ){
										A.putMsg( data.p.msg.clear3, FPS*3 );
									}else{
										A.putMsg( data.p.msg.clear4, FPS*3 );
									}
									clear_count++;
									O1.putMsgT( 'p-clear-'+clear_count, FPS*5 );
									O2.putMsgT( 'p-clear-'+clear_count, FPS*5 );
									O3.putMsgT( 'p-clear-'+clear_count, FPS*5 );
									wait = WAIT_F*5;
								}else{
									wait = WAIT_A;
								}
								P.setTurn(false);
								activeP = 1;
							}
							wait2++;
						}else if( O1.count() == 0 && O2.count() == 0 && O3.count() == 0){
							wait = WAIT_F;
							P.setTurn(false);
							turn = Turn.reset;
						}else{
							P.setTurn(false);
							activeP = 1;
						}
					}
				}else if( turn == Turn.reset ){
					if( A.count() > 0 ){
						card = A.deal( -1 );
						T.add( card, 1 );
						wait = WAIT_T;
					}else{
						turn = Turn.hello;
						wait = FPS;
					}
				}
				// トランプセットオブジェクトの表示
				A.disp();
				O1.disp();
				O2.disp();
				O3.disp();
				P.disp();
				T.disp();
				//$('#Discard').html(F);
				
			}
			F++;// フレーム番号をカウント
	  },1000/FPS);
	});
  
})