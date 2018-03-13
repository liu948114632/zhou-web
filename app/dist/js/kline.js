$(".cnyonoff").on("click",function(){
    $(this).toggleClass("on");
    $(".nocny").toggleClass("on");
    $(".iscny").toggleClass("on");
})
$(".bk-tabList").slide({
    mainCell: ".bk-tabList-bd",
    titCell: ".btn-group .btn",
    effect: "fade",
    trigger: "click",
    titOnClassName: "active"
});
function toggleFoot(){
    $(".bk-kMarket").toggle();
    var sHeight = $(window).height() - $(".bk-kHeader").height() - $(".bk-kMarket:visible").height() - 10;
    $("#marketFrame").css("height",sHeight);
    $(".toggle-foot").toggleClass("active");
}
function toggleRight(){
    $(window.frames['marketFrame'].document.body).find("#trade_container").toggle();
    $(window.frames['marketFrame'])[0].on_size();
    $(".toggle-right").toggleClass("active");
}
$("#h_import").remove();
$(function(){
    var sHeight = $(window).height() - $(".bk-kHeader").height() - $(".bk-kMarket:visible").height() - 10;
    $("#marketFrame").css("height",sHeight);

    $(".down-market-table .d-hd a").on('mouseenter',function(){
        $(this).addClass("on").siblings("a").removeClass("on");
        $(this).parents(".down-market-table").find("table").eq($(this).index()).addClass("on").siblings("table").removeClass("on");
    })

    $(".kmarket-down .titlelist a").on('mouseenter',function(){
        $(this).addClass("on").siblings("a").removeClass("on");
        $(this).parents(".kmarket-down").find("ul").eq($(this).index()).addClass("on").siblings("ul").removeClass("on");
    })
});

$(window).resize(function() {
    var sHeight = $(window).height() - $(".bk-kHeader").height() - $(".bk-kMarket:visible").height() - 10;
    $("#marketFrame").css("height",sHeight);
});
$(document).ready(function() { //add by zhanglinbo 20160808
    seajs.use(["module_trans","module_market","module_asset","module_common"],function(trans,market,asset){
        trans.pageIndexInit("btcusdt",2000);
        market.init();
        asset.init();
    });
});