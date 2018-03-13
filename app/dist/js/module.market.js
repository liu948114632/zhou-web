define(function (require, exports, module) {
    var market = {};
    var $title = window.top.document.title;
    var oMarket;
    var usdtcny = 6.7;
    market.init = function (t) {
        // var $this = this;
        // var topAll = localStorage.topAll;
        // try {
        //     if (NEED_PUSH_DATA_PRICE == "true") {
        //         $this.getMarket();
        //         var readyFun = setInterval(function () {
        //             if (webSocket) {
        //                 webSocket.init(function () {
        //                     webSocket.sendMessage("{'event':'addChannel','channel':'top_all','isZip':'" + isZipData() + "'}")
        //                 });
        //                 clearInterval(readyFun)
        //             }
        //         }, 50);
        //         setInterval(function (t) {
        //             if (ajaxRun == false) {
        //                 return
        //             }
        //             $this.getMarket()
        //         }, t || 5000)
        //     }
        // } catch (e) {
        // }
    };
    market.getMarketSocket = function (json, callback) {
        // var $this = this;
        // $this.setTopAll(json, callback)
    };
    market.getMarket = function (callback) {
        // try {
        //     if (NEED_PUSH_DATA_PRICE == "true") {
        //         var $this = this;
        //         $.getJSON(DOMAIN_TRANS + "/line/topall?jsoncallback=?", function (json) {
        //             $this.setTopAll(json, callback)
        //         })
        //     }
        // } catch (e) {
        // }
    };
    market.getLineData = function (array) {
        var arr = array || [];
        if (arr.length > 0) {
            var min = arr[0];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] < min) {
                    min = arr[i]
                }
            }
            var arr2 = arr.map(function (item) {
                return item - min
            });
            return arr2
        } else {
            return ""
        }
    };
    // market.setTopAll = function (ojson, callback) {
    //     var $this = this;
    //     var json = ojson.datas;
    //     usdtcny = ojson.usdtcny ? ojson.usdtcny : 6.7;
    //     window.usdttocny = usdtcny;
    //     window.btccny = parseFloat(json[0].lastPrice) * parseFloat(usdtcny);
    //     var totalAsset = 0;
    //     for (var i = 0, ilength = json.length; i < ilength; i++) {
    //         var key = json[i].market.replace("/", "").toLowerCase();
    //         var mName = key + "Market";
    //         market[mName] = [];
    //         market[mName][0] = json[i].lastPrice;
    //         market[mName][1] = json[i].buy1Price;
    //         market[mName][2] = json[i].sell1Price;
    //         market[mName][3] = json[i].hightPrice;
    //         market[mName][4] = json[i].lowPrice;
    //         market[mName][5] = json[i].vol;
    //         market[mName][6] = parseFloat(json[i].riseRate) < 0 ? "down" : "up";
    //         market[mName][7] = parseFloat(json[i].riseRate);
    //         var topId = ".T_" + key + "LastPrice";
    //         var homeId = ".H_" + key + "Market";
    //         var rateClass = parseFloat(json[i].riseRate) < 0 ? "up" : "down";
    //         var rateNum = parseFloat(json[i].riseRate) > 0 ? "+" + json[i].riseRate + "%" : json[i].riseRate + "%";
    //         var topIdClass, arrowHtml;
    //         var arrowClass, arrowHtml2;
    //         var price = json[i].lastPrice == 0 ? "--" : json[i].lastPrice;
    //         var theMarket = json[i].market.split("/")[1];
    //         var usdttocny = isNaN(price) ? "--" : method.fixNumber(price * usdtcny, 2);
    //         var hightPircecny = "￥" + method.fixNumber(json[i].hightPrice * usdtcny, 2);
    //         var lowPircecny = "￥" + method.fixNumber(json[i].lowPrice * usdtcny, 2);
    //         var btctocny = isNaN(price) ? "--" : method.fixNumber(price * btccny, 2);
    //         var hightPircebtctocny = "￥" + method.fixNumber(json[i].hightPrice * btccny, 2);
    //         var lowPircebtctocny = "￥" + method.fixNumber(json[i].lowPrice * btccny, 2);
    //         if (price == "--") {
    //             usdtprice = price;
    //             usdttocny = usdttocny;
    //             btctocny = btctocny
    //         } else {
    //             usdtprice = "$" + price;
    //             usdttocny = "￥" + usdttocny;
    //             btctocny = "￥" + btctocny
    //         }
    //         if (oMarket && oMarket[i]) {
    //             topIdClass = parseFloat(json[i].riseRate) < 0 ? "text-second" : "text-primary";
    //             arrowHtml = parseFloat(json[i].riseRate) < 0 ? '<i class="fa fa-arrow-down fa-fw"></i>' : '<i class="fa fa-arrow-up fa-fw"></i>';
    //             arrowClass = parseFloat(json[i].riseRate) < 0 ? "text-second" : "text-primary";
    //             arrowHtml2 = parseFloat(json[i].riseRate) < 0 ? '<i class="iconfont icon-arrowdown"></i>' : '<i class="iconfont icon-arrowup"></i>';
    //             if (parseFloat(oMarket[i].lastPrice) != parseFloat(json[i].lastPrice)) {
    //                 $(topId).removeClass("text-second text-primary").addClass(topIdClass);
    //                 $(topId).html(price + arrowHtml);
    //                 $(homeId).find(".price").removeClass("text-second text-primary").addClass(arrowClass).html(price + arrowHtml2);
    //                 if (theMarket == "USDT") {
    //                     $(homeId).find(".cnyprice").html(usdttocny + arrowHtml2);
    //                     $(homeId).find(".cnyprice-high").html(hightPircecny);
    //                     $(homeId).find(".cnyprice-low").html(lowPircecny)
    //                 } else {
    //                     if (theMarket == "BTC") {
    //                         $(homeId).find(".cnyprice").html(btctocny + arrowHtml2);
    //                         $(homeId).find(".cnyprice-high").html(hightPircebtctocny);
    //                         $(homeId).find(".cnyprice-low").html(lowPircebtctocny)
    //                     } else {
    //                         $(homeId).find(".cnyprice").html(price + arrowHtml2);
    //                         $(homeId).find(".cnyprice-high").html(json[i].hightPrice);
    //                         $(homeId).find(".cnyprice-low").html(json[i].lowPrice)
    //                     }
    //                 }
    //                 $(homeId).find(".rise").removeClass("up down").addClass(rateClass).html(rateNum)
    //             }
    //         } else {
    //             topIdClass = parseFloat(json[i].riseRate) < 0 ? "text-second" : "text-primary";
    //             arrowHtml = parseFloat(json[i].riseRate) < 0 ? '<i class="fa fa-arrow-down fa-fw"></i>' : '<i class="fa fa-arrow-up fa-fw"></i>';
    //             arrowClass = parseFloat(json[i].riseRate) < 0 ? "text-second" : "text-primary";
    //             arrowHtml2 = parseFloat(json[i].riseRate) < 0 ? '<i class="iconfont icon-arrowdown"></i>' : '<i class="iconfont icon-arrowup"></i>';
    //             $(topId).removeClass("text-second text-primary").addClass(topIdClass);
    //             $(topId).html(price + arrowHtml);
    //             $(homeId).find(".price").removeClass("text-second text-primary").addClass(arrowClass).html((price || "--") + arrowHtml2);
    //             if (theMarket == "USDT") {
    //                 $(homeId).find(".cnyprice").html(usdttocny + arrowHtml2)
    //             } else {
    //                 if (theMarket == "BTC") {
    //                     $(homeId).find(".cnyprice").html(btctocny + arrowHtml2)
    //                 } else {
    //                     $(homeId).find(".cnyprice").html(price + arrowHtml2);
    //                     $(homeId).find(".cnyprice-high").html(json[i].hightPrice);
    //                     $(homeId).find(".cnyprice-low").html(json[i].lowPrice)
    //                 }
    //             }
    //             $(homeId).find(".rise").removeClass("up down").addClass(rateClass).html(rateNum)
    //         }
    //         $(homeId).find(".hightPrice").html(json[i].hightPrice);
    //         $(homeId).find(".lowPrice").html(json[i].lowPrice);
    //         if (theMarket == "USDT") {
    //             $(homeId).find(".cnyprice-high").html(hightPircecny);
    //             $(homeId).find(".cnyprice-low").html(lowPircecny)
    //         } else {
    //             if (theMarket == "BTC") {
    //                 $(homeId).find(".cnyprice-high").html(hightPircebtctocny);
    //                 $(homeId).find(".cnyprice-low").html(lowPircebtctocny)
    //             } else {
    //                 $(homeId).find(".cnyprice-high").html(json[i].hightPrice);
    //                 $(homeId).find(".cnyprice-low").html(json[i].lowPrice)
    //             }
    //         }
    //         var riseRate = json[i].riseRate;
    //         if (riseRate == undefined) {
    //             riseRate = "--"
    //         } else {
    //             if (riseRate >= 0) {
    //                 if (riseRate > 0) {
    //                     riseRate = "+" + riseRate
    //                 }
    //                 $(homeId).removeClass("down").addClass("up")
    //             } else {
    //                 $(homeId).removeClass("up").addClass("down")
    //             }
    //             riseRate = riseRate + " %"
    //         }
    //         $(homeId).find(".riseRate").html(riseRate);
    //         var kline = "";
    //         var prices = json[i].prices;
    //         var linePrice = $this.getLineData(prices);
    //         if (linePrice) {
    //             for (var j = 0; j < linePrice.length; j++) {
    //                 kline += linePrice[j] + (linePrice.length - 1 == j ? "" : ",")
    //             }
    //         }
    //         $(homeId).find(".klineImg").html(kline);
    //         var dayVolume = parseFloat(json[i].vol);
    //         var dayVolumeStr = parseFloat(json[i].vol);
    //         if (dayVolume > 10000) {
    //             dayVolumeStr = (dayVolume / 10000).toFixed(2) + "万"
    //         }
    //         if (dayVolume > 100000000) {
    //             dayVolumeStr = (dayVolume / 100000000).toFixed(4) + "亿"
    //         }
    //         $(homeId).find(".volume span").html(dayVolumeStr);
    //         var pathArry = top.location.pathname.split("/");
    //         if (pathArry[pathArry.length - 1].indexOf(json[i].market.replace("/", "").toLowerCase()) != -1) {
    //             top.document.title = json[i].lastPrice + " - " + $title
    //         }
    //         try {
    //             if (USER.isLogin()) {
    //                 var coins = json[i].market.split("/");
    //                 var coin = coins[0].toLowerCase();
    //                 if ("USDT" == coins[1] && ASSET[coin]) {
    //                     var price = market[mName][0];
    //                     totalAsset += parseFloat(ASSET[coin].total * price)
    //                 }
    //             }
    //         } catch (err) {
    //             console.log("waiting for asset、user initing...", err)
    //         }
    //     }
    //     try {
    //         if (USER.isLogin() && ASSET.usdt) {
    //             var btcUsdtPrice;
    //             if (ASSET.usdt.total > 0) {
    //                 totalAsset += ASSET.usdt.total
    //             }
    //             var assistCoin = localStorage.assistCoin;
    //             if (!assistCoin || assistCoin == undefined || assistCoin == "BTC") {
    //                 assistCoin = "CNY"
    //             }
    //             $("#Munit, #MunitTop").html(assistCoin);
    //             if (totalAsset != "" && totalAsset > 0) {
    //                 var precision = 2;
    //                 if ("CNY" == assistCoin) {
    //                     totalAsset = totalAsset * usdtcny;
    //                     totalAsset += ASSET.qc.total
    //                 } else {
    //                     totalAsset += ASSET.qc.total / usdtcny
    //                 }
    //                 $("#D_allAsset, #totalAssets").html(method.fixFloat(totalAsset, precision));
    //                 formatNum()
    //             }
    //         }
    //     } catch (err) {
    //         console.log("waiting for asset initing...", err)
    //     }
    //     oMarket = ojson.datas;
    //     if (typeof callback == "function") {
    //         callback()
    //     }
    //     var jsonStr = JSON.stringify(json);
    //     if (window.localStorage) {
    //         localStorage.topAll = jsonStr
    //     }
    // };
    module.exports = market;
    (function () {
        return this || (0, eval)("this")
    }()).MARKET = market
});