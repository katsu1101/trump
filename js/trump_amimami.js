// ToDo: AIの強化
// ToDo: 設定画面
// ToDo: タイトル画面
// ToDo: キャラ選択＆キャラ入れ替え

const FPS = 60;// フレームレート


const CARD_MAX_COUNT = 52; // トランプセットの合計枚数
const PASS_MAX = 3;

let Scene = {
    op: 1,
    menu: 2,
    game: 3
};

let Turn = {
    hello: 1,
    T2P: 2,
    start: 3,
    PTurn: 4,
    reset: 5
};

let T, A, O1, O2, P, O;
let clear_count ,pass_count;

$(document).ready(function () {

    const WAIT_T = 0;//FPS/100;
    const WAIT_A = FPS / 3;
    const WAIT_F = FPS / 2;

    let F = 0;// フレーム番号
    let wait = 5;
    let wait2 = 0;

    // 直ぐに処理を始めるとtdの幅などが取れない事があったため
    $(this).delay(10).queue(function () {

        // トランプセットオブジェクトの新規作成
        T = new Cards('Talon', CARD_MAX_COUNT, '', {});
        A = new Cards('Area', 0, '', {});
        O1 = new Cards('Opp1', 0, 'ami', A);
        O2 = new Cards('Opp2', 0, 'mami', A);
        P = new Cards('Player', 0, '', A);

        let scene = Scene.op;
        let turn;
        let activeP = 0;
        $(window).resize(function () {
            A.refresh();
            O1.refresh();
            O2.refresh();
            //O3.refresh();
            P.refresh();
            T.refresh();
        });
        // メインループ
        setInterval(function () {

            if (scene === Scene.op) {

                // OP
                if (F > FPS) {
                    scene = Scene.menu;
                }

            } else if (scene === Scene.menu) {

                // メニュー
                scene = Scene.game;
                turn = Turn.hello;

            } else if (scene === Scene.game) {

                // ゲーム
                if (wait > 0) {
                    wait--;
                } else if (turn === Turn.hello) {

                    clear_count = 0;
                    pass_count = 0;
                    O1.setPass(PASS_MAX);
                    O2.setPass(PASS_MAX);
                    P.setPass(PASS_MAX);
                    P.select(-1);

                    A.putMsg('<h1>スタート</h1>', FPS * 3);
                    O1.putMsgT('start', FPS * 2.5);
                    O2.putMsgT('start', FPS * 2.5);

                    turn = Turn.T2P;
                } else if (turn === Turn.T2P) {

                    if (activeP === 0) {
                        activeP = Math.floor(Math.random() * 3) + 1;
                    }
                    if (activeP === 1) {
                        // 山から敵１へ
                        if (T.count() > 0) {
                            O1.add(T.deal(-1), 1);
                            wait = WAIT_T;
                            activeP = 2;
                        } else {
                            wait = WAIT_F;
                            P.select(-1);
                            activeP = 0;
                            turn = Turn.start;
                        }
                    } else if (activeP === 2) {

                        // 山から敵２へ
                        if (T.count() > 0) {
                            O2.add(T.deal(-1), 1);
                            wait = WAIT_T;
                            activeP = 3;
                        } else {
                            wait = WAIT_F;
                            activeP = 0;
                            turn = Turn.start;
                        }
                    } else if (activeP === 3) {

                        // 山からプレイヤーへ
                        if (T.count() > 0) {
                            P.add(T.deal(-1), 0);
                            wait = WAIT_T;
                            activeP = 1;
                        } else {
                            activeP = 0;
                            turn = Turn.start;
                        }
                    }
                } else if (turn === Turn.start) {

                    // 手札の７を場へ
                    for (let i = O1.count() - 1; i >= 0; i--) {

                        if (O1.getCard(i).num === 7) {
                            let card = O1.deal(i);
                            A.add(card, 0);
                            if (card.mark === 1) {
                                activeP = 1;
                                O1.putMsgT('d7', FPS * 2.5);
                            }
                        }
                    }
                    for (let i = O2.count() - 1; i >= 0; i--) {

                        if (O2.getCard(i).num === 7) {
                            let card = O2.deal(i);
                            A.add(card, 0);
                            if (card.mark === 1) {
                                activeP = 2;
                                O2.putMsgT('d7', FPS * 2.5);
                            }
                        }
                    }
                    for (let i = P.count() - 1; i >= 0; i--) {
                        if (P.getCard(i).num === 7) {
                            let card = P.deal(i);
                            A.add(card, 0);
                            if (card.mark === 1) {
                                activeP = 4;
                                O1.putMsgT('Pd7', FPS * 2.5);
                                O2.putMsgT('Pd7', FPS * 2.5);
                            }
                        }
                    }
                    P.sort();
                    wait = FPS * 3;
                    turn = Turn.PTurn;
                } else if (turn === Turn.PTurn) {

                    if (activeP === 0) {
                        activeP = Math.floor(Math.random() * 4) + 1;
                    }

                    if (activeP === 1) {
                        O = O1;
                    } else if (activeP === 2) {
                        O = O2;
                        O1.setTurn(false);
                    }
                    if (activeP === 1 || activeP === 2) {
                        // 敵のターン
                        if (O.count() > 0) {
                            O.setTurn(true);
                            let n = O.selectCard(A);
                            if (n > -1) {
                                let card = O.deal(n);
                                O.refresh();
                                A.add(card, 0);
                                if (O.count() === 0) {
                                    clear_count++;
                                    if (clear_count === 1) {
                                        O.putMsgT('clear-1', FPS * 2.5);
                                    } else if (clear_count === 2) {
                                        O.putMsgT('clear-2', FPS * 2.5);
                                    } else {
                                        O.putMsgT('clear-3', FPS * 2.5);
                                    }
                                } else {
                                    O.putMsgT('put', FPS / 2);
                                }
                            } else {
                                if (O.getPass() === 0) {
                                    O.putMsgT('clear-' + (3 - pass_count), FPS * 2.5);
                                    A.putMsg('<h1>ギブアップ</h1>', FPS * 3);
                                    wait = FPS * 3;
                                    while (O.count() > 0) {
                                        card = O.deal(-1);
                                        A.add(card, 0);
                                    }
                                    pass_count++;
                                } else {
                                    O.setPass(O.getPass() - 1);
                                    O.putMsgT('pass', FPS * 2.5);
                                }
                            }
                            if (clear_count < 2 && wait === 0) {
                                wait = WAIT_A;
                            }
                        }
                        wait2 = 0;
                        activeP++;
                    } else {

                        P.refresh();
                        // プレイヤーのターン
                        O2.setTurn(false);
                        P.setTurn(true);
                        if (P.count() > 0) {
                            if (O1.count() === 0 && O2.count() === 0) {
                                while (P.count() > 0) {
                                    card = P.deal(-1);
                                    A.add(card, 0);
                                }
                                O1.putMsgT('p-clear-' + clear_count, FPS * 3);
                                O2.putMsgT('p-clear-' + clear_count, FPS * 3);
                                if (clear_count === 0) {
                                    A.putMsg(data.p.msg.clear1, FPS * 3);
                                } else if (clear_count === 1) {
                                    A.putMsg(data.p.msg.clear2, FPS * 3);
                                } else {
                                    A.putMsg(data.p.msg.clear3, FPS * 3);
                                }
                                wait = WAIT_F;
                                P.setTurn(false);
                                turn = Turn.reset;
                            } else if (P.getSelect() === -2) {
                                //Pass
                                if (P.getPass() > 0) {
                                    P.setPass(P.getPass() - 1);
                                    P.select(-1);
                                    activeP = 1;
                                } else {
                                    while (P.count() > 0) {
                                        card = P.deal(-1);
                                        A.add(card, 0);
                                    }
                                    if (pass_count === 0) {
                                        A.putMsg(data.p.msg.clear3, FPS * 3);
                                    } else if (pass_count === 1) {
                                        A.putMsg(data.p.msg.clear2, FPS * 3);
                                    } else {
                                        A.putMsg(data.p.msg.clear1, FPS * 3);
                                    }
                                    pass_count++;
                                    O1.putMsgT('p-clear-4', FPS * 5);
                                    O2.putMsgT('p-clear-4', FPS * 5);
                                }
                            } else if (P.getSelect() > -1) {

                                A.add(P.deal(P.getSelect()), 0);
                                P.select(-1);
                                if (P.count() === 0) {
                                    if (clear_count === 0) {
                                        A.putMsg(data.p.msg.clear1, FPS * 3);
                                    } else if (clear_count === 1) {
                                        A.putMsg(data.p.msg.clear2, FPS * 3);
                                    } else {
                                        A.putMsg(data.p.msg.clear3, FPS * 3);
                                    }
                                    clear_count++;
                                    O1.putMsgT('p-clear-' + clear_count, FPS * 5);
                                    O2.putMsgT('p-clear-' + clear_count, FPS * 5);
                                    wait = WAIT_F * 5;
                                } else {
                                    wait = WAIT_A;
                                }
                                P.setTurn(false);
                                activeP = 1;
                            }
                            wait2++;
                        } else if (O1.count() === 0 && O2.count() === 0) {
                            wait = WAIT_F;
                            P.setTurn(false);
                            turn = Turn.reset;
                        } else {
                            P.setTurn(false);
                            activeP = 1;
                        }
                    }
                } else if (turn === Turn.reset) {
                    if (A.count() > 0) {
                        T.add(A.deal(-1), 1);
                        wait = WAIT_T;
                    } else {
                        turn = Turn.hello;
                        wait = FPS;
                    }
                }
                // トランプセットオブジェクトの表示
                A.disp();
                O1.disp();
                O2.disp();
                P.disp();
                T.disp();
                //$('#Discard').html(F);

            }
            F++;// フレーム番号をカウント
        }, 1000 / FPS);
    });

});