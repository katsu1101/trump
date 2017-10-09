var app = new PIXI.Application();
document.body.appendChild(app.view);
$(function () {
    var trumpTable = new TrumpTable(app);
    trumpTable.show();
});
