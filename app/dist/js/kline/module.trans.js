Array.prototype.getSpeObject = function (a, b) {
    var c = this.filter(function (d) {
        return d[a] == b
    })[0];
    return c ? c : {}
};
Array.prototype.remove = function () {
    var e, c = arguments, b = c.length, d;
    while (b && this.length) {
        e = c[--b];
        while ((d = this.indexOf(e)) !== -1) {
            this.splice(d, 1)
        }
    }
    return this
};
define(function (require, exports, module) {
    var M = require("module_method");
    var markets = require("module_market");
    var asset = require("module_asset");
    var user = require("module_user");
    var tmpl_s = require("module_tmpl");
    var range_s = require("module_range");
    var trans = {};
    var socket;
    var oldChannel;
    var market;
    var numberBi;
    var numberBiEn;
    var numberBiNote;
    var numberBixNormal;
    var numberBixShow;
    var numberBixDian;
    var exchangeBi;
    var exchangeBiEn;
    var exchangeBiNote;
    var exchangeBixNormal;
    var exchangeBixShow;
    var exchangeBixDian;
    var entrustUrlBase;
    var marketLength = $("#bkLength dd[class='active']").data("length") || $("#bkLength dd:eq(0)").data("length") || 5;
    var marketDepth = $("#bkDepth dd[class='active']").data("depth") || $("#bkDepth dd:eq(0)").data("depth") || 0.01;
    var marketPrice = [];
    marketPrice[0] = 0;
    marketPrice[1] = [0];
    marketPrice[2] = [0];
    marketPrice[3] = "up";
    var maxPrice = 0, minPrice = 0, dayVolume = 0;
    var marketProtect = {
        "BCC/BTC": 1.05,
        "LTC/BTC": 1.1,
        "ETH/BTC": 1.05,
        "ETC/BTC": 1.1,
        "BTS/BTC": 1.1,
        "XRP/BTC": 1.1,
        "QTUM/BTC": 1.1,
        "HSR/BTC": 1.1,
        "EOS/BTC": 1.1,
        "BCD/BTC": 1.1,
        "DASH/BTC": 1.1,
        "BTC/USDT": 1.05,
        "BCC/USDT": 1.05,
        "LTC/USDT": 1.1,
        "ETH/USDT": 1.05,
        "ETC/USDT": 1.1,
        "BTS/USDT": 1.1,
        "QTUM/USDT": 1.1,
        "HSR/USDT": 1.1,
        "EOS/USDT": 1.1,
        "XRP/USDT": 1.1,
        "BCD/USDT": 1.1,
        "DASH/USDT": 1.1,
        "BTC/QC": 1.05,
        "BCC/QC": 1.05,
        "LTC/QC": 1.1,
        "ETH/QC": 1.05,
        "ETC/QC": 1.1,
        "BTS/QC": 1.1,
        "QTUM/QC": 1.1,
        "HSR/QC": 1.1,
        "EOS/QC": 1.1,
        "XRP/QC": 1.1,
        "BCD/QC": 1.1,
        "DASH/QC": 1.1
    };
    var loanProtect = {BTC: 0.1, BCC: 0.1, LTC: 10, ETH: 1, ETC: 10, EOS: 10, BTS: 10, QTUM: 10, HSR: 10, CNY: 100};
    var amountDecial = {
        "BCC/BTC": 9,
        "LTC/BTC": 9,
        "ETH/BTC": 9,
        "ETC/BTC": 8,
        "BTS/BTC": 8,
        "QTUM/BTC": 8,
        "HSR/BTC": 8,
        "EOS/BTC": 7,
        "XRP/BTC": 8,
        "BCD/BTC": 9,
        "DASH/BTC": 9,
        "BTC/USDT": 6,
        "BCC/USDT": 5,
        "LTC/USDT": 5,
        "ETH/USDT": 5,
        "ETC/USDT": 4,
        "BTS/USDT": 4,
        "QTUM/USDT": 4,
        "HSR/USDT": 4,
        "EOS/USDT": 4,
        "XRP/USDT": 4,
        "BCD/USDT": 5,
        "DASH/USDT": 5,
        "BTC/QC": 6,
        "BCC/QC": 5,
        "LTC/QC": 5,
        "ETH/QC": 5,
        "ETC/QC": 4,
        "BTS/QC": 4,
        "QTUM/QC": 4,
        "HSR/QC": 4,
        "EOS/QC": 4,
        "XRP/QC": 4,
        "BCD/QC": 5,
        "DASH/QC": 5
    };
    var marketProtectCur, amountDecialCur;
    var lastTime = new Date().getTime();
    var lastTimeTrans = 0;
    var lastTimeRecord = 0;
    var lockEntrust = false, lockRepeatEntrust = false;
    var type = -1, entrustType = 1, status = 0, timeFrom = 0, timeTo = 0, numberFrom = 0, numberTo = 0, priceFrom = 0,
        priceTo = 0, dateTo = 0, pageSize = 10, pageIndex = 1;
    var needSafeWord = false;
    var ajaxIng = false;
    var doEntrustStatus = false;
    var buyRangeMp;
    var sellRangeMp;
    var buyPlanRangeMp;
    var sellPlanRangeMp;
    var buyStrategy = 0;
    var sellStrategy = 0;
    var leverFlagBuy = false;
    var leverFlagSell = false;
    var canLoanInMoney, canLoanInCoin;
    var userRecord = null;
    var userRecordLastTime = 0;
    var initDishFlag = true;
    var initRecordFlag = true;
    var setFirstPrice = false;
    trans.pageIndexInit = function (type, t) {
        var $this = this;
        $this.hasSafePwd();
        $this.getMarket(type, function () {
            if (window.top.location.pathname.indexOf("/markets") == -1) {
                $this.getTrans()
            }
            // if (user.isLogin()) {
            //     var userId = $.cookie(UID);
            //     var readyFun = setInterval(function () {
            //         if (webSocket) {
            //             webSocket.init(function () {
            //                 webSocket.sendMessage("{'event':'addChannel','channel':'push_user_record','userId':'" + userId + "','market':'" + market + "','isZip':'" + isZipData() + "'}")
            //             });
            //             clearInterval(readyFun)
            //         }
            //     }, 50)
            // }
            $this.getEntrustRecord({listDiv: "#entrustRecord", lastTimeRecord: lastTime, status: 3});
            $this.upP2Pstatus();
            asset.getUserAsset(function () {
                $this.upAsset()
            });
            if ($("#lever-trans").length) {
                asset.getUserLeverAsset(function () {
                })
            }
            setInterval(function (t) {
                $this.upAsset();
                if ($("#lever-trans").length) {
                    asset.getUserLeverAsset(function () {
                    })
                }
                $this.getEntrustRecord({listDiv: "#entrustRecord", status: 3})
            }, t || 2000);
            setInterval(function (t) {
                $this.upP2Pstatus()
            }, 60000)
        });
        buyRangeMp = new range_s({
            range: "#buySlider", step: 1, point: 4, delay: 15, slide: function (value, obj) {
                var canUseMoney = parseFloat(asset[exchangeBi.toLowerCase()]["usable"]);
                var isLeverPage = $("#lever-trans").length;
                if (isLeverPage && asset.marketLeverData.key) {
                    canUseMoney = parseFloat(asset.marketLeverData.fAvailable)
                }
                if (leverFlagBuy) {
                    canUseMoney += asset[exchangeBi.toLowerCase()].canLoanIn
                }
                canUseMoney = M.fixNumber(canUseMoney, exchangeBixDian);
                var buyUnitPrice = $("#buyUnitPrice").val();
                if ($.isNumeric(canUseMoney) && $.isNumeric(buyUnitPrice) && buyUnitPrice > 0) {
                    var buyTotal = M.fixNumber(value / 100 * canUseMoney / buyUnitPrice, numberBixDian);
                    $("#buyNumber").val(buyTotal);
                    $this.upAccount("buy")
                }
            }
        });
        sellRangeMp = new range_s({
            range: "#sellSlider", step: 1, point: 4, delay: 15, slide: function (value, obj) {
                var canUseCoin = parseFloat(asset[numberBi.toLowerCase()]["usable"]);
                var isLeverPage = $("#lever-trans").length;
                if (isLeverPage && asset.marketLeverData.key) {
                    canUseCoin = parseFloat(asset.marketLeverData.cAvailable)
                }
                if (leverFlagSell) {
                    canUseCoin += asset[numberBi.toLowerCase()].canLoanIn
                }
                canUseCoin = M.fixNumber(canUseCoin, numberBixDian);
                if ($.isNumeric(canUseCoin)) {
                    var sellTotal = M.fixNumber(value / 100 * canUseCoin, numberBixDian);
                    $("#sellNumber").val(sellTotal);
                    $this.upAccount("sell")
                }
            }
        });
        buyPlanRangeMp = new range_s({
            range: "#buyPlanSlider",
            step: 1,
            point: 4,
            delay: 15,
            slide: function (value, obj) {
                var canUseMoney = parseFloat(asset[exchangeBi.toLowerCase()]["usable"]);
                var buyPlanMoney = $("#buyPlanMoney").val();
                var buyPlanHighPrice = $("#buyPlanHighPrice").val();
                var buyPlanLowPrice = $("#buyPlanLowPrice").val();
                canUseMoney = M.fixNumber(canUseMoney, exchangeBixDian);
                if ($.isNumeric(canUseMoney)) {
                    var slideMoney = M.fixNumber(value / 100 * canUseMoney, exchangeBixDian);
                    $("#buyPlanMoney").val(slideMoney);
                    $this.upPlanAccount("buy")
                }
            }
        });
        sellPlanRangeMp = new range_s({
            range: "#sellPlanSlider",
            step: 1,
            point: 4,
            delay: 15,
            slide: function (value, obj) {
                var canUseCoin = parseFloat(asset[numberBi.toLowerCase()]["usable"]);
                canUseCoin = M.fixNumber(canUseCoin, numberBixDian);
                if ($.isNumeric(canUseCoin)) {
                    var slideCoin = M.fixNumber(value / 100 * canUseCoin, numberBixDian);
                    $("#sellPlanNumber").val(slideCoin);
                    $this.upPlanAccount("sell")
                }
            }
        });
        $("#buyUnitPrice").on({
            keyup: function () {
                pricecny(this.value, "#computedbuyPrice")
            }, blur: function () {
                pricecny(this.value, "#computedbuyPrice")
            }, change: function () {
                pricecny(this.value, "#computedbuyPrice")
            }
        });
        $("#sellUnitPrice").on({
            keyup: function () {
                pricecny(this.value, "#computedsellPrice")
            }, blur: function () {
                pricecny(this.value, "#computedsellPrice")
            }, change: function () {
                pricecny(this.value, "#computedsellPrice")
            }
        });

        function pricecny(value, positionlist) {
            var value = value || 0;
            var price = 0;
            if (marketData[0].exchangeBi == "BTC") {
                price = method.fixNumber(parseFloat(value) * btccny, 2)
            } else {
                price = method.fixNumber(parseFloat(value) * usdttocny, 2)
            }
            if (value == "") {
                $(positionlist).text("")
            } else {
                $(positionlist).text("≈ ￥" + price)
            }
        }

        if (marketData[0].exchangeBi == "USDT") {
            $("#computedbuyPrice, #computedsellPrice").show()
        } else {
            if (marketData[0].exchangeBi == "BTC") {
                $("#computedbuyPrice, #computedsellPrice").show()
            } else {
                $("#computedbuyPrice, #computedsellPrice").hide()
            }
        }
        $("#sellMarket, #buyMarket").on("click", "tr", function () {
            $("#sellUnitPrice, #buyUnitPrice").val($(this).find("td").eq(1).text());
            pricecny($(this).find("td").eq(1).text(), "#computedsellPrice,#computedbuyPrice");
            var depthNumber = 0;
            if ($(this).parents("#sellMarket").length > 0) {
                for (i = $("#sellMarket tr").length - $(this).index() - 1; i >= 0; i--) {
                    depthNumber = parseFloat(depthNumber) + parseFloat(marketPrice[2][i][1])
                }
                var canSellMoney = $("#canSellMoney").text();
                if ($("#lever-trans").length) {
                    canSellMoney = $("#canUseCoin").text()
                }
                canSellMoney = canSellMoney == "--" ? 0 : canSellMoney;
                var num = canSellMoney > depthNumber ? M.fixNumber(depthNumber, numberBixDian) : M.fixNumber(canSellMoney, numberBixDian);
                $("#sellNumber").val(num)
            } else {
                for (i = 0; i <= $(this).index(); i++) {
                    depthNumber = parseFloat(depthNumber) + parseFloat(marketPrice[1][i][1])
                }
                var canBuyCoin = $("#canBuyCoin").text();
                if ($("#lever-trans").length) {
                    var canUseLeverMoney = $("#canUseMoney").text();
                    var buyUnitPrice = $("#buyUnitPrice").val();
                    canBuyCoin = M.fixNumber(canUseLeverMoney / buyUnitPrice, numberBixDian)
                }
                canBuyCoin = canBuyCoin == "--" ? 0 : canBuyCoin;
                var num = canBuyCoin > depthNumber ? M.fixNumber(depthNumber, numberBixDian) : M.fixNumber(canBuyCoin, numberBixDian);
                $("#buyNumber").val(num)
            }
            $this.upAccount("buy");
            $this.upAccount("sell");
            if ($(document).scrollTop() > $(".bk-trans-form").offset().top) {
                goScrollTo(".bk-trans-form", 0)
            }
        });
        $("#leverSwitchBuy").on("click", function () {
            leverFlagBuy = this.checked;
            $this.upAccount("buy");
            $("#leverAccountBuyLabel").removeClass("open");
            if (leverFlagBuy) {
                $("#leverAccountBuyLabel").addClass("open");
                JuaBox.showRight(bitbank.L("您已开启买入交易的一键杠杆服务，请注意平仓风险！"))
            }
        });
        $("#leverSwitchSell").on("click", function () {
            leverFlagSell = this.checked;
            $this.upAccount("sell");
            $("#leverAccountSellLabel").removeClass("open");
            if (leverFlagSell) {
                $("#leverAccountSellLabel").addClass("open");
                JuaBox.showRight(bitbank.L("您已开启卖出交易的一键杠杆服务，请注意平仓风险！"))
            }
        });
        $("#buyBtn").on("click", function (event) {
            if (!user.isLogin()) {
                return JuaBox.showWrong(bitbank.L("请先登录后再进行交易"))
            }
            if (event.originalEvent) {
                $this.doEntrust(1)
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        });
        $("#sellBtn").on("click", function (event) {
            if (!user.isLogin()) {
                return JuaBox.showWrong(bitbank.L("请先登录后再进行交易"))
            }
            if (event.originalEvent) {
                $this.doEntrust(0)
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        });
        $(".bk-entrust").on("click", ".cancelEntrust", function () {
            $this.doCancelEntrust($(this).data("id"), $(this).data("type"), $(this).data("plantype"), function () {
                setTimeout(function () {
                    $this.getEntrustRecord({
                        listDiv: "#entrustRecord",
                        lastTimeRecord: lastTime,
                        status: 3,
                        opEntrust: true
                    })
                }, 1000)
            })
        });
        $(".bk-entrust").on("click", ".detailEntrust", function () {
            $this.getEntrustDetail($(this).data("id"), function () {
                JuaBox.sure($("#tradeList").html(), {width: 600, btnNum: 0})
            })
        });
        $("[id='batchCancel']").on("click", function () {
            $this.batchCancelEntrust($(this).data("plantype"), function () {
                setTimeout(function () {
                    $this.getEntrustRecord({
                        listDiv: "#entrustRecord",
                        lastTimeRecord: lastTime,
                        isPage: true,
                        pageIndex: pageIndex,
                        opEntrust: true
                    })
                }, 1000)
            })
        });
        $("#batchCancelPlan").on("click", function () {
            $this.batchCancelPlanEntrust(function () {
                setTimeout(function () {
                    $this.getEntrustRecord({
                        listDiv: "#historyRecord",
                        lastTimeRecord: lastTime,
                        isPage: true,
                        pageIndex: pageIndex,
                        opEntrust: true
                    })
                }, 2000)
            })
        });
        $("#bkDepth").on("click", "dd", function () {
            if ($(this).hasClass("active")) {
                return false
            }
            if ($(this).index() > 0) {
                $("#bkLength").removeClass("active");
                $("#bkDepth").addClass("active");
                $("#bkLength dd:eq(0)").click()
            }
            $("#bkDepth dd").removeClass("active");
            $(this).addClass("active");
            $("#bkDepth span").text($(this).text());
            $this.changeDepth($(this).data("depth"))
        });
        $("#bkLength").on("click", "dd", function () {
            if ($(this).hasClass("active")) {
                return false
            }
            if ($(this).index() > 0) {
                $("#bkDepth").removeClass("active");
                $("#bkLength").addClass("active");
                $("#bkDepth dd:eq(0)").click()
            }
            $("#bkLength dd").removeClass("active");
            $(this).addClass("active");
            $("#bkLength span").text($(this).text());
            $this.changeLength($(this).data("length"))
        });
        $("#buyUnitPrice,#buyMinPrice,#sellUnitPrice,#sellMaxPrice,#sellTriggerHighPrice,#sellPlanHighPrice,#sellTriggerLowPrice,#sellPlanLowPrice,#buyTriggerHighPrice,#buyPlanHighPrice,#buyTriggerLowPrice,#buyPlanLowPrice,#buyPlanMoney").on({
            keyup: function () {
                $this.checkNumber($(this), exchangeBixDian)
            }, blur: function () {
                $this.checkNumber($(this), exchangeBixDian)
            }, change: function () {
                $this.checkNumber($(this), exchangeBixDian)
            }
        });
        $("#buyNumber,#sellNumber,#sellPlanNumber").on({
            keyup: function () {
                $this.checkNumber($(this), numberBixDian)
            }, blur: function () {
                $this.checkNumber($(this), numberBixDian)
            }, change: function () {
                $this.checkNumber($(this), numberBixDian)
            }
        });
        $("#buyDefaultForm input").on({
            keyup: function () {
                $this.upAccount("buy")
            }, blur: function () {
                $this.upAccount("buy")
            }, change: function () {
                $this.upAccount("buy")
            }
        });
        $("#sellDefaultForm input").on({
            keyup: function () {
                $this.upAccount("sell")
            }, blur: function () {
                $this.upAccount("sell")
            }, change: function () {
                $this.upAccount("sell")
            }
        });
        $("#buyPlanForm input").on({
            keyup: function () {
                $this.upPlanAccount("buy")
            }, blur: function () {
                $this.upPlanAccount("buy")
            }, change: function () {
                $this.upPlanAccount("buy")
            }
        });
        $("#sellPlanForm input").on({
            keyup: function () {
                $this.upPlanAccount("sell")
            }, blur: function () {
                $this.upPlanAccount("sell")
            }, change: function () {
                $this.upPlanAccount("sell")
            }
        });
        $("#canUseMoney, #leverCanUseMoney, #canBuyCoin").on("click", function () {
            if (!user.isLogin()) {
                return false
            }
            var canBuyCoin = $("#canBuyCoin").text();
            if ($("#lever-trans").length) {
                var canUseLeverMoney = $("#canUseMoney").text();
                var buyUnitPrice = $("#buyUnitPrice").val();
                canBuyCoin = M.fixNumber(canUseLeverMoney / buyUnitPrice, numberBixDian)
            }
            $("#buyNumber").val(canBuyCoin);
            $this.upAccount("buy")
        });
        $("#canUseCoin, #leverCanUseCoin, #canSellMoney").on("click", function () {
            if (!user.isLogin()) {
                return false
            }
            var canUseCoin = $("#canUseCoin").text();
            if ($("#lever-trans").length) {
                canUseCoin = $("#canUseCoin").text()
            }
            $("#sellNumber").val(M.fixNumber(parseFloat(canUseCoin), numberBixDian));
            $this.upAccount("sell")
        });
        $("#curPrice").on("click", function () {
            $("#sellUnitPrice, #buyUnitPrice").val(marketPrice[0])
        });
        var buyBtnText = function (text) {
            return bitbank.L(text)
        };
        var sellBtnText = function (text) {
            return bitbank.L(text)
        };
        $("#bkBuyType").on("click", "li", function () {
            if ($(this).hasClass("active")) {
                return false
            }
            $("#bkBuyType li").removeClass("active");
            $(this).addClass("active");
            buyStrategy = $(this).data("type");
            if (buyStrategy == 0) {
                $("#buyBtn").html(buyBtnText(bitbank.L("立即买入")));
                $("#buyBtn").data("reset-text", buyBtnText(bitbank.L("立即买入")));
                $("#buyPlanForm, .buyBatLabel").hide();
                $("#buyDefaultForm, .buyDefaultLabel").show()
            }
            if (buyStrategy == 1) {
                $("#buyBtn").html(buyBtnText(bitbank.L("计划买入")));
                $("#buyBtn").data("reset-text", buyBtnText(bitbank.L("计划买入")));
                $("#buyDefaultForm").hide();
                $("#buyPlanForm").show()
            }
            if (buyStrategy == 2) {
                $("#buyBtn").html(buyBtnText(bitbank.L("批量分散买入")));
                $("#buyBtn").data("reset-text", buyBtnText(bitbank.L("批量分散买入")));
                $("#buyDefaultForm,  .buyBatLabel").show();
                $("#buyPlanForm, .buyDefaultLabel").hide()
            }
        });
        $("#bkSellType").on("click", "li", function () {
            if ($(this).hasClass("active")) {
                return false
            }
            $("#bkSellType li").removeClass("active");
            $(this).addClass("active");
            sellStrategy = $(this).data("type");
            if (sellStrategy == 0) {
                $("#sellBtn").html(sellBtnText(bitbank.L("立即卖出")));
                $("#sellBtn").data("reset-text", sellBtnText(bitbank.L("立即卖出")));
                $("#sellPlanForm, .sellBatLabel").hide();
                $("#sellDefaultForm, .sellDefaultLabel").show()
            }
            if (sellStrategy == 1) {
                $("#sellBtn").html(sellBtnText(bitbank.L("计划卖出")));
                $("#sellBtn").data("reset-text", sellBtnText(bitbank.L("计划卖出")));
                $("#sellDefaultForm").hide();
                $("#sellPlanForm").show()
            }
            if (sellStrategy == 2) {
                $("#sellBtn").html(sellBtnText(bitbank.L("批量分散卖出")));
                $("#sellBtn").data("reset-text", sellBtnText(bitbank.L("批量分散卖出")));
                $("#sellDefaultForm,  .sellBatLabel").show();
                $("#sellPlanForm, .sellDefaultLabel").hide()
            }
        });
        $("#bkEntrustTab").slide({
            titCell: ".bk-tabList-hd .btn-group .btn",
            mainCell: ".bk-tabList-bd",
            titOnClassName: "active",
            trigger: "click"
        })
    };
    trans.pageRecordInit = function (market) {
        var $this = this;
        $this.getMarket(market, function () {
            $this.getEntrustRecord({listDiv: "#historyRecord", lastTimeRecord: lastTime, isPage: true})
        });
        $("#historyRecord").on("click", ".cancelEntrust", function () {
            $this.doCancelEntrust($(this).data("id"), $(this).data("type"), $(this).data("plantype"), function () {
                setTimeout(function () {
                    $this.getEntrustRecord({
                        listDiv: "#historyRecord",
                        lastTimeRecord: lastTime,
                        isPage: true,
                        pageIndex: pageIndex,
                        opEntrust: true
                    })
                }, 2000)
            })
        });
        $(".bk-entrust").on("click", ".detailEntrust", function () {
            $this.getEntrustDetail($(this).data("id"), function () {
                JuaBox.sure($("#tradeList").html(), {width: 600, btnNum: 0})
            })
        });
        $(".bk-entrust").on("click", "#batchCancel", function () {
            $this.batchCancelEntrust("ALL", function () {
                setTimeout(function () {
                    $this.getEntrustRecord({
                        listDiv: "#historyRecord",
                        lastTimeRecord: lastTime,
                        isPage: true,
                        pageIndex: pageIndex,
                        opEntrust: true
                    })
                }, 2000)
            })
        });
        $(".bk-entrust").on("click", "#batchCancelPlan", function () {
            $this.batchCancelPlanEntrust(function () {
                setTimeout(function () {
                    $this.getEntrustRecord({
                        listDiv: "#historyRecord",
                        lastTimeRecord: lastTime,
                        isPage: true,
                        pageIndex: pageIndex,
                        opEntrust: true
                    })
                }, 2000)
            })
        });
        $("#entrustTypeDrop .dropdown-menu").on("click", "li", function () {
            $("#entrustTypeDrop .text-g").text($(this).text());
            $("#entrustType").val($(this).data("value"))
        });
        $("#transTypeDrop .dropdown-menu").on("click", "li", function () {
            $("#transTypeDrop .text-g").text($(this).text());
            $("#transType").val($(this).data("value"))
        });
        $("#transStatusDrop .dropdown-menu").on("click", "li", function () {
            $("#transStatusDrop .text-g").text($(this).text());
            $("#transStatus").val($(this).data("value"))
        });
        $("#transRangeDrop .dropdown-menu").on("click", "li", function () {
            $("#transRangeDrop .text-g").text($(this).text());
            $("#transRange").val($(this).data("value"))
        });
        $("#reSetBtn").on("click", function () {
            $("#transTypeDrop .text-g, #transStatusDrop .text-g").text(bitbank.L("不限"));
            $("#entrustTypeDrop .text-g").text(bitbank.L("限价委托"));
            $("#transRangeDrop .text-g").text(bitbank.L("最近委托"));
            $("#transRange").val("0");
            $("#entrustType").val("1");
            $("#transType").val("-1");
            $("#transStatus").val("0");
            type = -1;
            entrustType = 1;
            status = 0;
            timeFrom = 0;
            timeTo = 0;
            numberFrom = 0;
            numberTo = 0;
            priceFrom = 0;
            priceTo = 0;
            dateTo = 0;
            pageSize = 10;
            pageIndex = 1;
            lockRepeatEntrust = false;
            $this.getEntrustRecord({
                listDiv: "#historyRecord",
                lastTimeRecord: lastTime,
                isPage: true,
                pageIndex: pageIndex,
                opEntrust: true
            })
        });
        $("#doSearchBtn").on("click", function () {
            type = $("#transType").val() == null ? type : $("#transType").val();
            entrustType = $("#entrustType").val() == null ? entrustType : $("#entrustType").val();
            status = $("#transStatus").val() == null ? status : $("#transStatus").val();
            timeFrom = $("#startDate").val() == "" ? 0 : Date.parse($("#startDate").val());
            timeTo = $("#endDate").val() == "" ? 0 : Date.parse($("#endDate").val());
            numberFrom = $("#startNumber").val() == "" ? numberFrom : $this.formatNumberUse($("#startNumber").val());
            numberTo = $("#endNumber").val() == "" ? numberTo : $this.formatNumberUse($("#endNumber").val());
            priceFrom = $("#startPrice").val() == "" ? priceFrom : $this.formatMoneyUse($("#startPrice").val());
            priceTo = $("#endPrice").val() == "" ? priceTo : $this.formatMoneyUse($("#endPrice").val());
            dateTo = $("#transRange").val() == null ? dateTo : $("#transRange").val();
            pageSize = 10;
            pageIndex = 1;
            lockRepeatEntrust = false;
            $this.getEntrustRecord({
                listDiv: "#historyRecord",
                lastTimeRecord: lastTime,
                isPage: true,
                pageIndex: pageIndex,
                opEntrust: true
            })
        })
    };
    trans.checkNumber = function (_this, unit) {
        var value = _this.val();
        if (value != "") {
            if ($.isNumeric(value)) {
                var valueStr = value + "";
                if (valueStr.indexOf(".") != -1) {
                    var newStr, intStr = valueStr.split(".")[0] + "", floatStr = valueStr.split(".")[1] + "";
                    if (floatStr.split("").length > unit) {
                        newStr = intStr + "." + floatStr.substr(0, unit);
                        _this.val(newStr)
                    }
                    if (unit == 0) {
                        newStr = intStr;
                        _this.val(newStr)
                    }
                }
            } else {
                _this.val("")
            }
        }
    };
    trans.upP2Pstatus = function () {
        $("#leverSwitchBuy, #leverSwitchSell").attr("disabled", user.isLogin() ? false : true);
        asset.getLoanAsset(function () {
            $("#canLoanBTC").html(asset.btc.canLoanIn);
            $("#canLoanCNY").html(asset.cny.canLoanIn);
            $("#canLoanLTC").html(asset.ltc.canLoanIn);
            $("#canLoanETH").html(asset.eth.canLoanIn);
            $("#canLoanETC").html(asset.etc.canLoanIn);
            canLoanInMoney = asset[exchangeBi.toLowerCase()].canLoanIn;
            canLoanInCoin = asset[numberBi.toLowerCase()].canLoanIn;
            if (canLoanInMoney < loanProtect[exchangeBi]) {
                $("#leverSwitchBuy").attr("disabled", true)
            }
            if (canLoanInCoin < loanProtect[numberBi]) {
                $("#leverSwitchSell").attr("disabled", true)
            }
        })
    };
    trans.upAccount = function (type) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        var isLeverPage = $("#lever-trans").length;
        var buyUnitPrice = parseFloat($("#buyUnitPrice").val()), buyNumber = parseFloat($("#buyNumber").val()),
            sellUnitPrice = parseFloat($("#sellUnitPrice").val()), sellNumber = parseFloat($("#sellNumber").val()),
            buyMinPrice = parseFloat($("#buyMinPrice").val());
        sellMaxPrice = parseFloat($("#sellMaxPrice").val());
        var canUseMoney = parseFloat(asset[exchangeBi.toLowerCase()]["usable"]);
        var canUseCoin = parseFloat(asset[numberBi.toLowerCase()]["usable"]);
        if (isLeverPage && asset.marketLeverData.key) {
            canUseCoin = parseFloat(asset.marketLeverData.cAvailable);
            canUseMoney = parseFloat(asset.marketLeverData.fAvailable)
        }
        var canUseLeverMoney = leverFlagBuy ? (canUseMoney + canLoanInMoney) : canUseMoney;
        var canUseLeverCoin = leverFlagSell ? (canUseCoin + canLoanInCoin) : canUseCoin;
        canUseMoney = M.fixFloat(canUseMoney, exchangeBixDian);
        canUseLeverMoney = M.fixFloat(canUseLeverMoney, exchangeBixDian);
        canUseCoin = M.fixFloat(canUseCoin, numberBixDian);
        canUseLeverCoin = M.fixFloat(canUseLeverCoin, numberBixDian);
        if (type == "buy") {
            if (buyUnitPrice > 0 && buyNumber > 0) {
                var countBuyMoney = M.fixNumber(buyUnitPrice * buyNumber, amountDecialCur);
                var canBuyCoin = M.fixNumber(canUseLeverMoney / buyUnitPrice, numberBixDian);
                if (countBuyMoney > canUseLeverMoney) {
                    var leverMoney = M.ceilNumber((canUseLeverMoney > canUseMoney ? canUseLeverMoney - canUseMoney : 0), exchangeBixDian);
                    if (leverMoney > 0 && leverMoney < loanProtect[exchangeBi] && canLoanInMoney >= loanProtect[exchangeBi]) {
                        leverMoney = loanProtect[exchangeBi]
                    }
                    if (canLoanInMoney < loanProtect[exchangeBi]) {
                        leverMoney = 0
                    }
                    $("#buyNumber").val(canBuyCoin);
                    $("#realBuyAccount").text(M.fixNumber(canUseLeverMoney, amountDecialCur));
                    $("#leverAccountBuy").text(leverMoney);
                    buyRangeMp.Update(100);
                    $("#buySlider .sliderPercent").html("100%");
                    return false
                } else {
                    var leverMoney = M.ceilNumber((countBuyMoney > canUseMoney ? countBuyMoney - canUseMoney : 0), exchangeBixDian);
                    if (leverMoney > 0 && leverMoney < loanProtect[exchangeBi]) {
                        leverMoney = loanProtect[exchangeBi]
                    }
                    if (canLoanInMoney < loanProtect[exchangeBi]) {
                        leverMoney = 0
                    }
                    var buysliderPercent = (countBuyMoney / canUseLeverMoney * 100).toFixed(2);
                    $("#realBuyAccount").text(countBuyMoney);
                    $("#leverAccountBuy").text(leverMoney);
                    buyRangeMp.Update(buysliderPercent);
                    $("#buySlider .sliderPercent").html((buysliderPercent || "0.00") + "%");
                    return false
                }
            } else {
                $("#realBuyAccount").text("0.00");
                $("#leverAccountBuy").text("0.00");
                buyRangeMp.Update(0);
                $("#buySlider .sliderPercent").html("0.00%")
            }
        } else {
            if (sellUnitPrice > 0 && sellNumber > 0) {
                var countSellMoney = M.fixNumber(sellUnitPrice * sellNumber, amountDecialCur);
                var canSellMoney = M.fixNumber(sellUnitPrice * canUseLeverCoin, amountDecialCur);
                if (sellNumber > canUseLeverCoin) {
                    var leverCoin = M.ceilNumber((canUseLeverCoin > canUseCoin ? canUseLeverCoin - canUseCoin : 0), numberBixDian);
                    if (leverCoin > 0 && leverCoin < loanProtect[numberBi] && canLoanInCoin >= loanProtect[numberBi]) {
                        leverCoin = loanProtect[numberBi]
                    }
                    if (canLoanInCoin < loanProtect[numberBi]) {
                        leverCoin = 0
                    }
                    $("#leverAccountSell").text(leverCoin);
                    $("#sellNumber").val(M.fixNumber(canUseLeverCoin, numberBixDian));
                    $("#realSellAccount").text(canSellMoney);
                    sellRangeMp.Update(100);
                    $("#sellSlider .sliderPercent").html("100%");
                    return false
                } else {
                    var leverCoin = M.ceilNumber((sellNumber > canUseCoin ? sellNumber - canUseCoin : 0), numberBixDian);
                    if (leverCoin > 0 && leverCoin < loanProtect[numberBi]) {
                        leverCoin = loanProtect[numberBi]
                    }
                    if (canLoanInCoin < loanProtect[numberBi]) {
                        leverCoin = 0
                    }
                    $("#leverAccountSell").text(leverCoin);
                    var sellsliderPercent = (sellNumber / canUseLeverCoin * 100).toFixed(2);
                    $("#realSellAccount").text(countSellMoney);
                    sellRangeMp.Update(sellsliderPercent);
                    $("#sellSlider .sliderPercent").html((sellsliderPercent || "0.00") + "%");
                    return false
                }
            } else {
                $("#realSellAccount").text("0.00");
                $("#leverAccountSell").text("0.00");
                sellRangeMp.Update(0);
                $("#sellSlider .sliderPercent").html("0.00%")
            }
        }
    };
    trans.upPlanAccount = function (type) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        var buyPlanMoney = parseFloat($("#buyPlanMoney").val()),
            buyTriggerHighPrice = parseFloat($("#buyTriggerHighPrice").val()),
            buyPlanHighPrice = parseFloat($("#buyPlanHighPrice").val()),
            buyTriggerLowPrice = parseFloat($("#buyTriggerLowPrice").val()),
            buyPlanLowPrice = parseFloat($("#buyPlanLowPrice").val()),
            sellPlanNumber = parseFloat($("#sellPlanNumber").val()),
            sellTriggerHighPrice = parseFloat($("#sellTriggerHighPrice").val()),
            sellPlanHighPrice = parseFloat($("#sellPlanHighPrice").val()),
            sellTriggerLowPrice = parseFloat($("#sellTriggerLowPrice").val()),
            sellPlanLowPrice = parseFloat($("#sellPlanLowPrice").val());
        var canUseMoney = M.fixNumber(asset[exchangeBi.toLowerCase()]["usable"], exchangeBixDian);
        var canUseCoin = M.fixNumber(asset[numberBi.toLowerCase()]["usable"], numberBixDian);
        if (type == "buy") {
            if (buyPlanMoney >= 0) {
                var canBuyHighCoin = 0;
                var canBuyLowCoin = 0;
                if (buyPlanMoney > canUseMoney) {
                    $("#buyPlanMoney").val(canUseMoney);
                    buyPlanRangeMp.Update(100);
                    $("#buyPlanSlider .sliderPercent").html("100%");
                    return false
                } else {
                    var sliderPercent = (buyPlanMoney / canUseMoney * 100).toFixed(2);
                    buyPlanRangeMp.Update(sliderPercent);
                    $("#buyPlanSlider .sliderPercent").html(sliderPercent || "0.00%");
                    if (buyPlanHighPrice > 0) {
                        canBuyHighCoin = M.fixNumber(buyPlanMoney / buyPlanHighPrice, numberBixDian)
                    }
                    if (buyPlanLowPrice > 0) {
                        canBuyLowCoin = M.fixNumber(buyPlanMoney / buyPlanLowPrice, numberBixDian)
                    }
                    $("#buyPlanHighAmount").text(canBuyHighCoin);
                    $("#buyPlanLowAmount").text(canBuyLowCoin)
                }
            } else {
                $("#buyPlanMoney").val("");
                $("#buyPlanHighAmount").text("0.00");
                $("#buyPlanLowAmount").text("0.00");
                buyPlanRangeMp.Update(0);
                $("#buyPlanSlider .sliderPercent").html("0.00%")
            }
        } else {
            if (sellPlanNumber >= 0) {
                var canSellHighMoney = 0;
                var canSellLowMoney = 0;
                if (sellPlanNumber > canUseCoin) {
                    $("#sellPlanNumber").val(canUseCoin);
                    sellPlanRangeMp.Update(100);
                    $("#sellPlanSlider .sliderPercent").html("100%");
                    return false
                } else {
                    var sliderPercent = (sellPlanNumber / canUseCoin * 100).toFixed(2);
                    sellPlanRangeMp.Update(sliderPercent);
                    $("#sellPlanSlider .sliderPercent").html((sliderPercent || "0.00") + "%");
                    if (sellPlanHighPrice > 0) {
                        canSellHighMoney = M.fixNumber(sellPlanNumber * sellPlanHighPrice, exchangeBixDian)
                    }
                    if (sellPlanLowPrice > 0) {
                        canSellLowMoney = M.fixNumber(sellPlanNumber * sellPlanLowPrice, exchangeBixDian)
                    }
                    $("#sellPlanHighAmount").text(canSellHighMoney);
                    $("#sellPlanLowAmount").text(canSellLowMoney)
                }
            } else {
                $("#sellPlanNumber").val("");
                $("#sellPlanHighAmount").text("0.00");
                $("#sellPlanLowAmount").text("0.00");
                sellPlanRangeMp.Update(0);
                $("#sellPlanSlider .sliderPercent").html("0.00%")
            }
        }
    };
    trans.getMarket = function (type, callback) {
        var type = type || "btc";
        var json = null;
        if (typeof marketData === "undefined") {
            $.getJSON(DOMAIN_TRANS + "/getMarket?callback=?&type=" + type, function (result) {
                if (result.isSuc && result.datas.length > 0) {
                    json = result.datas[0];
                    market = json.market;
                    numberBi = json.numberBi;
                    numberBiEn = json.numberBiEn;
                    numberBiNote = json.numberBiNote;
                    numberBixNormal = parseFloat(json.numberBixNormal);
                    numberBixShow = parseFloat(json.numberBixShow);
                    numberBixDian = parseInt(json.numberBixDian);
                    exchangeBi = json.exchangeBi;
                    exchangeBiEn = json.exchangeBiEn;
                    exchangeBiNote = json.exchangeBiNote;
                    exchangeBixNormal = parseFloat(json.exchangeBixNormal);
                    exchangeBixShow = parseFloat(json.exchangeBixShow);
                    exchangeBixDian = parseInt(json.exchangeBixDian);
                    entrustUrlBase = json.entrustUrlBase;
                    amountDecialCur = amountDecial[numberBi.toUpperCase() + "/" + exchangeBi.toUpperCase()];
                    marketProtectCur = marketProtect[numberBi.toUpperCase() + "/" + exchangeBi.toUpperCase()];
                    if ($.isFunction(callback)) {
                        callback()
                    }
                }
            })
        } else {
            json = marketData[0];
            market = json.market;
            numberBi = json.numberBi;
            numberBiEn = json.numberBiEn;
            numberBiNote = json.numberBiNote;
            numberBixNormal = parseFloat(json.numberBixNormal);
            numberBixShow = parseFloat(json.numberBixShow);
            numberBixDian = parseInt(json.numberBixDian);
            exchangeBi = json.exchangeBi;
            exchangeBiEn = json.exchangeBiEn;
            exchangeBiNote = json.exchangeBiNote;
            exchangeBixNormal = parseFloat(json.exchangeBixNormal);
            exchangeBixShow = parseFloat(json.exchangeBixShow);
            exchangeBixDian = parseInt(json.exchangeBixDian);
            entrustUrlBase = json.entrustUrlBase;
            amountDecialCur = amountDecial[numberBi.toUpperCase() + "/" + exchangeBi.toUpperCase()];
            marketProtectCur = marketProtect[numberBi.toUpperCase() + "/" + exchangeBi.toUpperCase()];
            if ($.isFunction(callback)) {
                callback()
            }
        }
    };
    trans.getTrans = function (length, depth) {
        var $this = this;
        if (market.indexOf("btq") != -1) {
            $this.getTransAjax();
            setInterval(function (t) {
                $this.getTransAjax()
            }, 2000)
        } else {
            if (initDishFlag) {
                $this.getTransAjax();
                initDishFlag = false
            }
            var channel = "";
            var cdepth = marketDepth.toString();
            cdepth = cdepth.replace(".", "");
            channel = "dish_depth_" + cdepth + "_" + market;
            oldChannel = channel;
            // var readyFun = setInterval(function () {
            //     if (webSocket) {
            //         webSocket.init(function () {
            //             webSocket.sendMessage("{'event':'addChannel','channel':'" + channel + "','isZip':'" + isZipData() + "'}")
            //         });
            //         clearInterval(readyFun)
            //     }
            // }, 50);
            setInterval(function (t) {
                if (ajaxRun == false) {
                    return
                }
                if (!webSocket || !webSocket.socket || (webSocket.socket && webSocket.socket.readyState != WebSocket.OPEN)) {
                    $this.getTransAjax()
                }
            }, 2000)
        }
    };
    trans.getTransAjax = function (length, depth) {
        var $this = this;
        marketLength = length || marketLength;
        marketDepth = depth || marketDepth;
        var jsonUrl;
        if (marketLength > 5) {
            jsonUrl = DOMAIN_TRANS + "" + entrustUrlBase + "Line/GetTrans-" + market + "?"
        } else {
            jsonUrl = DOMAIN_TRANS + "" + entrustUrlBase + "dish/data-" + market + "?"
        }
        jsonUrl += "lastTime=" + lastTimeTrans + "&";
        jsonUrl += "length=" + marketLength + "&";
        jsonUrl += "depth=" + marketDepth + "&";
        jsonUrl += "jsoncallback=?";
        $.getJSON(jsonUrl, function (result) {
            $this.setDish(result)
        })
    };
    trans.getTransWebsocket = function (length, depth) {
        var $this = this;
        marketLength = length || marketLength;
        marketDepth = depth || marketDepth;
        var channel = "";
        if (marketLength > 5) {
            channel = "dish_length_" + marketLength + "_" + market
        } else {
            var cdepth = marketDepth.toString();
            cdepth = cdepth.replace(".", "");
            channel = "dish_depth_" + cdepth + "_" + market
        }
        if (webSocket.socket && webSocket.socket.readyState == WebSocket.OPEN) {
            if (oldChannel != channel && oldChannel != null) {
                webSocket.sendMessage('{"event":"removeChannel","channel":"' + oldChannel + '"}');
                var message = '{"event":"addChannel","channel":"' + channel + '","isZip":"' + isZipData() + '"}';
                oldChannel = channel;
                webSocket.sendMessage(message)
            } else {
                if (oldChannel != channel && oldChannel == null) {
                    var message = '{"event":"addChannel","channel":"' + channel + '","isZip":"' + isZipData() + '"}';
                    oldChannel = channel;
                    webSocket.sendMessage(message)
                }
            }
        }
    };
    trans.setDish = function (result) {
        if (result[0].listUp.length > 0) {
            var maxSellNumber = 0;
            for (var i = 0; i < result[0].listUp.length; i++) {
                if (result[0].listUp[i][1] > maxSellNumber) {
                    maxSellNumber = result[0].listUp[i][1]
                }
            }
            for (var i = 0; i < result[0].listUp.length; i++) {
                marketPrice[2][i] = [];
                marketPrice[2][i][0] = result[0].listUp[i][0] = M.fixNumber(new Number(result[0].listUp[i][0]), exchangeBixDian);
                marketPrice[2][i][1] = result[0].listUp[i][1] = M.fixNumber(new Number(result[0].listUp[i][1]), numberBixDian);
                result[0].listUp[i][2] = (result[0].listUp[i][1] / maxSellNumber * 100).toFixed(2)
            }
            if ($("#sellMarket").length > 0) {
                $("#sellMarket").html(tmpl("tmpl-sellMarket", result[0].listUp))
            }
        }
        if (result[0].listDown.length > 0) {
            var maxBuyNumber = 0;
            for (var i = 0; i < result[0].listDown.length; i++) {
                if (result[0].listDown[i][1] > maxBuyNumber) {
                    maxBuyNumber = result[0].listDown[i][1]
                }
            }
            for (var i = 0; i < result[0].listDown.length; i++) {
                marketPrice[1][i] = [];
                marketPrice[1][i][0] = result[0].listDown[i][0] = M.fixNumber(new Number(result[0].listDown[i][0]), exchangeBixDian);
                marketPrice[1][i][1] = result[0].listDown[i][1] = M.fixNumber(new Number(result[0].listDown[i][1]), numberBixDian);
                result[0].listDown[i][2] = (result[0].listDown[i][1] / maxBuyNumber * 100).toFixed(2)
            }
            if ($("#buyMarket").length > 0) {
                $("#buyMarket").html(tmpl("tmpl-buyMarket", result[0].listDown))
            }
        }
        var currentPrice = M.fixNumber(new Number(result[0].currentPrice), exchangeBixDian);
        marketPrice[3] = parseFloat(marketPrice[0]) > parseFloat(currentPrice) ? "down" : "up";
        marketPrice[3] = parseFloat(marketPrice[0]) == parseFloat(currentPrice) ? "equal" : marketPrice[3];
        marketPrice[0] = currentPrice;
        maxPrice = M.fixNumber(new Number(result[0].high), exchangeBixDian);
        minPrice = M.fixNumber(new Number(result[0].low), exchangeBixDian);
        dayVolume = M.fixNumber(new Number(result[0].totalBtc), numberBixDian);
        var marketClass = marketPrice[3] == "up" ? "text-primary" : "text-second";
        if (marketPrice[3] != "equal") {
            if (marketData[0].exchangeBi == "USDT") {
                $("#curPrice").fadeOut(300, function () {
                    var cnyPrice = "";
                    try {
                        cnyPrice = "<span>/ ￥" + M.fixNumber(marketPrice[0] * usdttocny, 2) + "</span>"
                    } catch (e) {
                    }
                    $(this).removeClass().addClass(marketClass).html(exchangeBiNote + "" + marketPrice[0] + cnyPrice + "<i class='iconfont icon-arrow" + marketPrice[3] + "'></i>").fadeIn(800)
                })
            } else {
                if (marketData[0].exchangeBi == "BTC") {
                    $("#curPrice").fadeOut(300, function () {
                        var cnyPrice = "";
                        try {
                            cnyPrice = "<span>/ ￥" + M.fixNumber(marketPrice[0] * btccny, 2) + "</span>"
                        } catch (e) {
                        }
                        $(this).removeClass().addClass(marketClass).html(exchangeBiNote + "" + marketPrice[0] + cnyPrice + "<i class='iconfont icon-arrow" + marketPrice[3] + "'></i>").fadeIn(800)
                    })
                } else {
                    $("#curPrice").fadeOut(300, function () {
                        $(this).removeClass().addClass(marketClass).html(exchangeBiNote + "" + marketPrice[0] + "<i class='iconfont icon-arrow" + marketPrice[3] + "'></i>").fadeIn(800)
                    })
                }
            }
        }
        try {
            if (!setFirstPrice) {
                $("#sellUnitPrice").val(marketPrice[1][0][0]);
                $("#buyUnitPrice").val(marketPrice[2][0][0]);
                setFirstPrice = true
            }
        } catch (e) {
            console.log("等待MARKET模块初始化...")
        }
        $("#maxHeightPrice").html(exchangeBiNote + "" + maxPrice);
        $("#minLowPrice").html(exchangeBiNote + "" + minPrice);
        if (parseFloat(dayVolume) < 10000) {
            $("#dayVolume").html(dayVolume)
        } else {
            var dayVolumeStr;
            if (LANG == "cn") {
                if (dayVolume > 10000) {
                    dayVolumeStr = (dayVolume / 10000).toFixed(2) + "万"
                }
                if (dayVolume > 100000000) {
                    dayVolumeStr = (dayVolume / 100000000).toFixed(4) + "亿"
                }
            } else {
                dayVolumeStr = M.divNumber(parseFloat(dayVolume), 2)
            }
            $("#dayVolume").html(dayVolumeStr)
        }
        $("#dayVolume").attr("title", numberBiNote + " " + dayVolume);
        if (marketLength > 5) {
            $(".bk-trans-record").removeClass("col-xs-12").addClass("col-xs-8")
        } else {
            $(".bk-trans-record").removeClass("col-xs-8").addClass("col-xs-12")
        }
    };
    trans.changeDepth = function (depth) {
        var $this = this;
        JuaBox.showRight(bitbank.L("合并深度到n", depth));
        marketDepth = parseFloat(depth) || 0;
        lastTimeTrans = lastTime;
        $this.getTransWebsocket()
    };
    trans.changeLength = function (length) {
        var $this = this;
        JuaBox.showRight(bitbank.L("更改档位到n", length));
        marketLength = parseFloat(length) || 5;
        lastTimeTrans = lastTime;
        $this.getTransWebsocket()
    };
    trans.upAsset = function () {
        if (!user.isLogin()) {
            return false
        }
        $this = this;
        var canUseMoney = parseFloat(asset[exchangeBi.toLowerCase()]["usable"]);
        var canUseCoin = parseFloat(asset[numberBi.toLowerCase()]["usable"]);
        if ($("#lever-trans").length && asset.marketLeverData.key) {
            canUseMoney = parseFloat(asset.marketLeverData.fAvailable);
            canUseCoin = parseFloat(asset.marketLeverData.cAvailable)
        }
        if (isNaN(canUseMoney) || isNaN(canUseCoin)) {
            return false
        }
        var canUseLeverMoney = leverFlagBuy ? (canUseMoney + asset[exchangeBi.toLowerCase()].canLoanIn) : canUseMoney;
        var canUseLeverCoin = leverFlagSell ? (canUseCoin + asset[numberBi.toLowerCase()].canLoanIn) : canUseCoin;
        canUseMoney = M.fixNumber(canUseMoney, exchangeBixDian);
        canUseLeverMoney = M.fixNumber(canUseLeverMoney, exchangeBixDian);
        canUseCoin = M.fixNumber(canUseCoin, numberBixDian);
        canUseLeverCoin = M.fixNumber(canUseLeverCoin, numberBixDian);
        var marketName = numberBi.toLowerCase() + "" + (exchangeBi.toLowerCase() == "cny" ? "" : exchangeBi.toLowerCase()) + "Market";
        var canBuyCoin = 0;
        var canSellMoney = 0;
        try {
            canBuyCoin = canUseLeverMoney / markets[marketName][2];
            canSellMoney = canUseLeverCoin * markets[marketName][1];
            canBuyCoin = M.fixNumber(canBuyCoin, numberBixDian);
            canSellMoney = M.fixNumber(canSellMoney, exchangeBixDian)
        } catch (e) {
            console.log(bitbank.L("获取市场行情信息失败"))
        }
        if ($.isNumeric(canUseMoney)) {
            $("#canUseMoney").html(canUseMoney)
        }
        if ($.isNumeric(canUseCoin)) {
            $("#canUseCoin").html(canUseCoin)
        }
        if ($.isNumeric(canBuyCoin)) {
            $("#canBuyCoin").html(canBuyCoin)
        }
        if ($.isNumeric(canSellMoney)) {
            $("#canSellMoney").html(canSellMoney)
        }
    };
    trans.upLeverAsset = function () {
        if (!user.isLogin()) {
            return false
        }
        $this = this;
        console.log(asset)
    };
    trans.showPage = function (listDiv, pageIndex, rsCount, pageSize) {
        var $this = this;
        var $pageDiv = $(listDiv + "_Page");
        if (rsCount < pageSize && pageIndex == 1) {
            $pageDiv.html("");
            return false
        }
        $pageDiv.createPage({
            noPage: true,
            pageSize: pageSize,
            rsCount: rsCount,
            current: pageIndex || 1,
            backFn: function (pageNum) {
                $this.getEntrustRecord({listDiv: listDiv, lastTimeRecord: lastTime, isPage: true, pageIndex: pageNum})
            }
        })
    };
    trans.setEntrustRecordSocket = function (result) {
        var $this = this;
        $this.userRecord = result;
        $this.userRecordLastTime = new Date().getTime()
    };
    trans.getEntrustRecord = function (option) {
        var $this = this;
        var userOption = option || {};
        var listDiv = userOption.listDiv;
        var htmlNoLogin = "<tr><td colspan='8'>" + bitbank.L("通用未登录提示") + "</td><tr>";
        var htmlNoRecord = "<tr><td colspan='8'>" + bitbank.L("通用没有任何记录") + "</td><tr>";
        if (!user.isLogin()) {
            $(listDiv).html(htmlNoLogin);
            $("#historyRecord").html(htmlNoLogin);
            $("#readyRecord").html(htmlNoLogin);
            $(listDiv + "_Page").html("");
            return false
        }
        var isPage = userOption.isPage === true ? true : false;
        type = userOption.type || type;
        entrustType = userOption.entrustType || entrustType;
        status = userOption.status || status;
        timeFrom = userOption.timeFrom || timeFrom;
        timeTo = userOption.timeTo || timeTo;
        dateTo = userOption.dateTo || dateTo;
        pageSize = userOption.pageSize || pageSize;
        pageIndex = userOption.pageIndex || pageIndex;
        lastTimeRecord = userOption.lastTimeRecord || lastTimeRecord;
        opEntrust = userOption.opEntrust || false;
        if (!isPage) {
            pageSize = 0;
            if (lockEntrust) {
            }
        } else {
            if (lockRepeatEntrust) {
                return false
            }
        }
        lockRepeatEntrust = true;
        var result = $this.userRecord;
        var userRecordLastTime = isNaN($this.userRecordLastTime) ? 0 : $this.userRecordLastTime;
        var nowTime = new Date().getTime();
        if (!result || ajaxRun == true || (opEntrust == true && nowTime - userRecordLastTime >= 2000) || initRecordFlag == true) {
            var jsonUrl = DOMAIN_TRANS + "" + entrustUrlBase + "Record/Get-" + market + "?";
            jsonUrl += "lastTime=" + lastTimeRecord + "&";
            jsonUrl += "type=" + type + "&";
            jsonUrl += "entrustType=" + entrustType + "&";
            jsonUrl += "status=" + status + "&";
            jsonUrl += "timeFrom=" + timeFrom + "&";
            jsonUrl += "timeTo=" + timeTo + "&";
            jsonUrl += "dateTo=" + dateTo + "&";
            jsonUrl += "pageSize=" + pageSize + "&";
            jsonUrl += "pageIndex=" + pageIndex + "&";
            jsonUrl += "jsoncallback=?";
            $.getJSON(jsonUrl, function (result) {
                var rCount = typeof result[0].count == "undefined" ? 0 : result[0].count;
                var nRecord = typeof result[0].record == "undefined" ? [] : result[0].record;
                var pRecord = typeof result[0].precord == "undefined" ? [] : result[0].precord;
                var hRecord = typeof result[0].hrecord == "undefined" ? [] : result[0].hrecord;
                var rLastTime = typeof result[0].lastTime == "undefined" ? lastTime : result[0].lastTime;
                if (rLastTime == 0) {
                    JuaBox.showWrong(bitbank.L("系统忙碌，请稍候！"));
                    return lockRepeatEntrust = false
                }
                if (rLastTime == -1) {
                    JuaBox.showWrong(bitbank.L("请先登录后再进行交易"));
                    return lockRepeatEntrust = false
                }
                if (!userOption.lastTimeRecord) {
                    if (lastTimeRecord != rLastTime) {
                        setTimeout(function () {
                            lastTimeRecord = rLastTime
                        }, 2000)
                    } else {
                        return lockRepeatEntrust = false
                    }
                }
                if (!isPage) {
                    $this.userRecord = result;
                    if (nRecord.length == 0 && pRecord.length == 0) {
                        lockEntrust = true
                    }
                    if (nRecord.length == 0) {
                        $(listDiv).html(htmlNoRecord)
                    } else {
                        $(listDiv).html(tmpl("tmpl-" + (listDiv.replace(/[#,.]/g, "")), $this.formatEntrustRecord(nRecord)))
                    }
                    if (pRecord.length == 0) {
                        $("#readyRecord").html(htmlNoRecord)
                    } else {
                        $("#readyRecord").html(tmpl("tmpl-readyRecord", $this.formatEntrustRecord(pRecord)))
                    }
                    if (hRecord.length == 0) {
                        $("#historyRecord").html(htmlNoRecord)
                    } else {
                        $("#historyRecord").html(tmpl("tmpl-historyRecord", $this.formatEntrustRecord(hRecord)))
                    }
                    formatNum()
                }
                if (isPage) {
                    if (nRecord.length == 0) {
                        $(listDiv).html(tmpl("tmpl-" + (listDiv.replace(/[#,.]/g, "")), $this.formatEntrustRecord(nRecord)));
                        $(listDiv).html($(listDiv).html() + htmlNoRecord);
                        if (pageIndex == 1) {
                            $(listDiv + "_Page").html("")
                        } else {
                            $this.showPage(listDiv, pageIndex, 0, pageSize)
                        }
                    } else {
                        $(listDiv).html(tmpl("tmpl-" + (listDiv.replace(/[#,.]/g, "")), $this.formatEntrustRecord(nRecord)));
                        formatNum();
                        $this.showPage(listDiv, pageIndex, nRecord.length, pageSize)
                    }
                }
                initRecordFlag = false;
                return lockRepeatEntrust = false
            })
        } else {
            var rCount = typeof result[0].count == "undefined" ? 0 : result[0].count;
            var nRecord = typeof result[0].record == "undefined" ? [] : result[0].record;
            var pRecord = typeof result[0].precord == "undefined" ? [] : result[0].precord;
            var hRecord = typeof result[0].hrecord == "undefined" ? [] : result[0].hrecord;
            var rLastTime = typeof result[0].lastTime == "undefined" ? lastTime : result[0].lastTime;
            if (rLastTime == 0) {
                JuaBox.showWrong(bitbank.L("系统忙碌，请稍候！"));
                return lockRepeatEntrust = false
            }
            if (rLastTime == -1) {
                JuaBox.showWrong(bitbank.L("请先登录后再进行交易"));
                return lockRepeatEntrust = false
            }
            if (!userOption.lastTimeRecord) {
                if (lastTimeRecord != rLastTime) {
                    setTimeout(function () {
                        lastTimeRecord = rLastTime
                    }, 2000)
                } else {
                    return lockRepeatEntrust = false
                }
            }
            if (!isPage) {
                if (nRecord.length == 0 && pRecord.length == 0) {
                    lockEntrust = true
                }
                if (nRecord.length == 0) {
                    $(listDiv).html(htmlNoRecord)
                } else {
                    $(listDiv).html(tmpl("tmpl-" + (listDiv.replace(/[#,.]/g, "")), $this.formatEntrustRecord(nRecord)))
                }
                if (pRecord.length == 0) {
                    $("#readyRecord").html(htmlNoRecord)
                } else {
                    $("#readyRecord").html(tmpl("tmpl-readyRecord", $this.formatEntrustRecord(pRecord)))
                }
                if (hRecord.length == 0) {
                    $("#historyRecord").html(htmlNoRecord)
                } else {
                    $("#historyRecord").html(tmpl("tmpl-historyRecord", $this.formatEntrustRecord(hRecord)))
                }
                formatNum()
            }
            if (isPage) {
                if (nRecord.length == 0) {
                    $(listDiv).html(tmpl("tmpl-" + (listDiv.replace(/[#,.]/g, "")), $this.formatEntrustRecord(nRecord)));
                    $(listDiv).html($(listDiv).html() + htmlNoRecord);
                    if (pageIndex == 1) {
                        $(listDiv + "_Page").html("")
                    } else {
                        $this.showPage(listDiv, pageIndex, 0, pageSize)
                    }
                } else {
                    $(listDiv).html(tmpl("tmpl-" + (listDiv.replace(/[#,.]/g, "")), $this.formatEntrustRecord(nRecord)));
                    formatNum();
                    $this.showPage(listDiv, pageIndex, nRecord.length, pageSize)
                }
            }
            return lockRepeatEntrust = false
        }
    };
    trans.formatEntrustRecord = function (json) {
        var record = [];
        var nameStatus = {
            "-1": bitbank.L("计划中"),
            "0": bitbank.L("待成交"),
            "1": bitbank.L("已取消"),
            "2": bitbank.L("已完成"),
            "3": bitbank.L("待成交"),
            "4": bitbank.L("部分成交"),
        };
        var entrustSource = {
            "9": bitbank.L("平仓挂单"),
            "8": bitbank.L("网页"),
            "5": bitbank.L("手机APP"),
            "6": bitbank.L("API"),
            "9": bitbank.L("P2P平仓")
        };
        var planNameStatus = {"-1": bitbank.L("等待委托"), "1": bitbank.L("已取消"), "2": bitbank.L("已委托")};
        for (var i = 0; i < json.length; i++) {
            var entrustId = json[i][0];
            var unitPrice = json[i][1];
            var numbers = json[i][2];
            var completeNumber = json[i][3];
            var completeTotalMoney = json[i][4];
            var types = json[i][5];
            var submitTime = json[i][6];
            var status = json[i][7];
            if (status == 3 && completeNumber > 0) {
                status = 4
            }
            var feeRate = 0;
            if (json[i].length > 8 && json[i][8] != null) {
                feeRate = json[i][8]
            }
            var triggerPrice = 0;
            if (json[i].length >= 10) {
                triggerPrice = json[i][9]
            }
            var webId = 8;
            if (json[i].length >= 11) {
                webId = json[i][10];
                if (webId == 0) {
                    webId = 8
                }
            }
            var triggerPriceProfit = 0;
            if (json[i].length >= 12) {
                triggerPriceProfit = json[i][11]
            }
            var unitPriceProfit = 0;
            if (json[i].length >= 13) {
                unitPriceProfit = json[i][12]
            }
            var totalMoney = 0;
            if (json[i].length >= 14) {
                totalMoney = json[i][13]
            }
            var formalEntrustId = "";
            if (json[i].length >= 15) {
                formalEntrustId = json[i][14]
            }
            var plantype = "false";
            if (json[i].length >= 16) {
                plantype = json[i][15]
            }
            var actualTriggerPrice = "--";
            if (json[i].length >= 17) {
                actualTriggerPrice = json[i][16]
            }
            record[i] = {};
            record[i].submitTime = new Date(submitTime).format("yyyy-MM-dd hh:mm:ss");
            record[i].nameClass = types == 0 ? "text-second" : "text-primary";
            record[i].nameType = types == 0 ? bitbank.L("卖S") : bitbank.L("买B");
            record[i].numbers = M.fixNumber(numbers, numberBixDian) == 0 ? "--" : M.fixNumber(numbers, numberBixDian);
            record[i].unitPrice = M.fixNumber(unitPrice, exchangeBixDian) == 0 ? "--" : M.fixNumber(unitPrice, exchangeBixDian);
            record[i].completeNumber = M.fixNumber(completeNumber, numberBixDian);
            record[i].noCompleteNumber = M.fixNumber(numbers - completeNumber, numberBixDian);
            record[i].averagePrice = completeNumber > 0 ? M.fixNumber(completeTotalMoney / completeNumber, exchangeBixDian) : "--";
            record[i].completeTotalMoney = completeTotalMoney > 0 ? M.fixNumber(completeTotalMoney, numberBixDian + exchangeBixDian) : "--";
            record[i].nameStatus = plantype == "true" ? planNameStatus[String(status)] : nameStatus[String(status)];
            record[i].operat = status == 0 || status == 3 || status == 4 || status == -1 ? bitbank.L("取消") : "";
            record[i].entrustId = entrustId;
            record[i].types = types;
            record[i].tradeFee = types == 0 ? M.fixDecimal(M.multiply(completeTotalMoney, feeRate), 8) + "(" + exchangeBi + ")" : M.fixDecimal(M.multiply(completeNumber, feeRate), 8) + "(" + numberBi + ")";
            record[i].triggerPrice = M.fixNumber(triggerPrice, exchangeBixDian) == 0 ? "--" : M.fixNumber(triggerPrice, exchangeBixDian);
            record[i].triggerPriceProfit = M.fixNumber(triggerPriceProfit, exchangeBixDian) == 0 ? "--" : M.fixNumber(triggerPriceProfit, exchangeBixDian);
            record[i].unitPriceProfit = M.fixNumber(unitPriceProfit, exchangeBixDian) == 0 ? "--" : M.fixNumber(unitPriceProfit, exchangeBixDian);
            record[i].totalMoney = M.fixNumber(totalMoney, exchangeBixDian);
            record[i].formalEntrustId = formalEntrustId;
            record[i].plantype = plantype;
            record[i].source = entrustSource[String(webId)];
            record[i].actualTriggerPrice = M.fixNumber(actualTriggerPrice, exchangeBixDian)
        }
        return record
    };
    trans.getEntrustDetail = function (id, callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        var listDiv = "#tradeRecord";
        var jsonUrl = DOMAIN_TRANS + "" + entrustUrlBase + "Record/GetDetails-" + market + "-" + id;
        $.getJSON(jsonUrl, function (result) {
            if (result[0].record == undefined) {
                return false
            }
            if (result[0].record.length == 0) {
                $(listDiv).html("<tr><td colspan='7'>" + bitbank.L("通用没有任何记录") + "</td><tr>");
                JuaBox.sure($("#tradeList").html(), {width: 600, btnNum: 0});
                return false
            }
            var json = result[0].record;
            var record = [];
            for (var i = 0; i < json.length; i++) {
                var tradeId = json[i][0];
                var unitPrice = json[i][1];
                var totalMoney = json[i][2];
                var numbers = json[i][3];
                var types = json[i][4];
                var submitTime = json[i][5];
                var feeRate = 0;
                if (json[i].length > 6 && json[i][6] != null) {
                    feeRate = json[i][6]
                }
                record[i] = {};
                record[i].submitTime = new Date(submitTime).format("yyyy-MM-dd hh:mm:ss");
                record[i].nameClass = types == 0 ? "text-second" : "text-primary";
                record[i].nameType = types == 0 ? bitbank.L("卖S") : bitbank.L("买B");
                record[i].numbers = M.fixNumber(numbers, numberBixDian);
                record[i].unitPrice = M.fixNumber(unitPrice, exchangeBixDian);
                record[i].totalMoney = M.fixNumber(totalMoney, numberBixDian + exchangeBixDian);
                record[i].tradeId = tradeId;
                record[i].types = types;
                record[i].tradeFee = types == 0 ? M.fixDecimal(M.multiply(totalMoney, feeRate), 8) + "(" + exchangeBi + ")" : M.fixDecimal(M.multiply(numbers, feeRate), 8) + "(" + numberBi + ")"
            }
            if ($(listDiv).length > 0) {
                $(listDiv).html(tmpl("tmpl-" + (listDiv.replace(/[#,.]/g, "")), record));
                formatNum()
            }
            if ($.isFunction(callback)) {
                callback()
            }
        })
    };
    trans.getDealRecord = function (option) {
        var jsonUrl = DOMAIN_TRANS + "" + entrustUrlBase + "Record/traderecord-" + market + "?";
        jsonUrl += "lastTime=" + lastTimeRecord + "&";
        jsonUrl += "type=" + type + "&";
        jsonUrl += "status=" + status + "&";
        jsonUrl += "timeFrom=" + timeFrom + "&";
        jsonUrl += "timeTo=" + timeTo + "&";
        jsonUrl += "numberFrom=" + numberFrom + "&";
        jsonUrl += "numberTo=" + numberTo + "&";
        jsonUrl += "priceFrom=" + priceFrom + "&";
        jsonUrl += "priceTo=" + priceTo + "&";
        jsonUrl += "dateTo=" + dateTo + "&";
        jsonUrl += "pageSize=" + pageSize + "&";
        jsonUrl += "pageIndex=" + pageIndex + "&";
        jsonUrl += "jsoncallback=?"
    };
    trans.doEntrust = function (isBuy) {
        if (!user.isLogin()) {
            return JuaBox.showWrong(bitbank.L("请先登录后再进行交易"))
        }
        var $this = this;
        var safeEntrust = function () {
            if (needSafeWord) {
                $this.checkSafePwd(function () {
                    $this.doSubmit(isBuy)
                })
            } else {
                $this.doSubmit(isBuy)
            }
        };
        $this.hasSafePwd(function () {
            $this.reConfirm(isBuy, function () {
                var leverAccountBuy = parseFloat($("#leverAccountBuy").text());
                var leverAccountSell = parseFloat($("#leverAccountSell").text());
                if (((isBuy && leverFlagBuy) || (!isBuy && leverFlagSell)) && (leverAccountBuy > 0 || leverAccountSell > 0)) {
                    $this.doLoan(isBuy, function () {
                        asset.getLoanAsset(function () {
                            $("#canLoanBTC").html(asset.btc.canLoanIn);
                            $("#canLoanCNY").html(asset.cny.canLoanIn);
                            $("#canLoanLTC").html(asset.ltc.canLoanIn);
                            $("#canLoanETH").html(asset.eth.canLoanIn);
                            $("#canLoanETC").html(asset.etc.canLoanIn)
                        });
                        safeEntrust()
                    })
                } else {
                    safeEntrust()
                }
            })
        })
    };
    trans.doLoan = function (isBuy, callback) {
        if (!user.isLogin()) {
            return JuaBox.showWrong(bitbank.L("请先登录后再进行交易"))
        }
        if (ajaxIng) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        ajaxIng = true;
        if (isBuy == 1) {
            $("#buyBtn").data("loading-text", bitbank.L("正在申请杠杆..."));
            $("#buyBtn").button("loading")
        } else {
            $("#sellBtn").data("loading-text", bitbank.L("正在申请杠杆..."));
            $("#sellBtn").button("loading")
        }
        var moneyType = parseInt($("#moneyType").val()) + 1;
        var coinType = parseInt($("#coinType").val()) + 1;
        var fundsType = isBuy ? moneyType : coinType;
        var leverAccountBuy = parseFloat($("#leverAccountBuy").text());
        var leverAccountSell = parseFloat($("#leverAccountSell").text());
        var amount = isBuy ? leverAccountBuy : leverAccountSell;
        $.ajax({
            type: "post",
            url: DOMAIN_P2P + "/u/loan/doLoan?ftype=" + fundsType + "&amount=" + amount + "&onekeyentrust=1",
            dataType: "jsonp",
            error: function (json) {
                ajaxIng = false;
                JuaBox.sure(json.des);
                $("#buyBtn, #sellBtn").button("reset")
            },
            success: function (json) {
                ajaxIng = false;
                $("#buyBtn, #sellBtn").button("reset");
                if ($.isFunction(callback)) {
                    callback()
                }
            }
        })
    }, trans.doSubmit = function (isBuy, callback) {
        if (!user.isLogin()) {
            return JuaBox.showWrong(bitbank.L("请先登录后再进行交易"))
        }
        if (ajaxIng) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        if (!doEntrustStatus) {
            return JuaBox.showWrong(bitbank.L("请勿非法提交数据"))
        }
        var $this = this;
        ajaxIng = true;
        var buyUnitPrice = parseFloat($("#buyUnitPrice").val()), buyMinPrice = parseFloat($("#buyMinPrice").val()),
            buyNumber = parseFloat($("#buyNumber").val()), sellUnitPrice = parseFloat($("#sellUnitPrice").val()),
            sellMaxPrice = parseFloat($("#sellMaxPrice").val()), sellNumber = parseFloat($("#sellNumber").val()),
            safePwd = $("#safePwd").val(), acctype = $("#acctype").val(),
            buyPlanMoney = parseFloat($("#buyPlanMoney").val()),
            buyTriggerHighPrice = parseFloat($("#buyTriggerHighPrice").val()),
            buyTriggerLowPrice = parseFloat($("#buyTriggerLowPrice").val()),
            buyPlanHighPrice = parseFloat($("#buyPlanHighPrice").val()),
            buyPlanLowPrice = parseFloat($("#buyPlanLowPrice").val()),
            sellPlanNumber = parseFloat($("#sellPlanNumber").val()),
            sellTriggerHighPrice = parseFloat($("#sellTriggerHighPrice").val()),
            sellTriggerLowPrice = parseFloat($("#sellTriggerLowPrice").val()),
            sellPlanHighPrice = parseFloat($("#sellPlanHighPrice").val()),
            sellPlanLowPrice = parseFloat($("#sellPlanLowPrice").val());
        var acctype = 0;
        var sacctype = $("#acctype").val();
        if (sacctype && (sacctype == "1")) {
            acctype = 1
        }
        var coinPrice, coinPriceMax, coinPriceMin, coinNumber, isReal, isBatch;
        if (isBuy == 1) {
            coinPrice = buyUnitPrice;
            coinPriceMax = buyUnitPrice;
            coinPriceMin = buyMinPrice;
            coinNumber = buyNumber;
            isReal = buyStrategy == 1 ? false : true;
            isBatch = buyStrategy == 2 ? true : false;
            $("#buyBtn").data("loading-text", bitbank.L("正在提交委托..."));
            $("#buyBtn").button("loading")
        } else {
            coinPrice = sellUnitPrice;
            coinPriceMax = sellMaxPrice;
            coinPriceMin = sellUnitPrice;
            coinNumber = sellNumber;
            isReal = sellStrategy == 1 ? false : true;
            isBatch = sellStrategy == 2 ? true : false;
            $("#sellBtn").data("loading-text", bitbank.L("正在提交委托..."));
            $("#sellBtn").button("loading")
        }
        if (isBatch) {
            $.post(DOMAIN_TRANS + "" + entrustUrlBase + "entrust/doEntrustMore-" + market, {
                safePassword: safePwd,
                priceLow: coinPriceMin,
                priceHigh: coinPriceMax,
                numbers: coinNumber,
                isbuy: isBuy,
                acctype: acctype
            }, function (result) {
                var des = result.des;
                if (isBuy == 1) {
                    $("#buyBtn").button("reset")
                } else {
                    $("#sellBtn").button("reset")
                }
                $this.upP2Pstatus();
                ajaxIng = false;
                if (result.isSuc) {
                    if (des.indexOf(":") > 0) {
                        var data = des.split(":");
                        if (data[0] != "0") {
                            if (isBuy == 1) {
                                $("#buyUnitPrice").val("").change();
                                $("#buyMinPrice").val("").change();
                                $("#buyNumber").val("").change()
                            } else {
                                $("#sellUnitPrice").val("").change();
                                $("#sellMaxPrice").val("").change();
                                $("#sellNumber").val("").change()
                            }
                            if (needSafeWord) {
                                JuaBox.closeAll()
                            }
                            lockEntrust = false;
                            doEntrustStatus = false;
                            setTimeout(function () {
                                $this.getEntrustRecord({
                                    listDiv: "#entrustRecord",
                                    lastTimeRecord: lastTime,
                                    status: 3,
                                    opEntrust: true
                                })
                            }, 1000);
                            JuaBox.sure(bitbank.L("成功批量委托m笔，一共na，总金额va", data[0], data[1], numberBi, data[2], exchangeBi), {btnNum: 1})
                        } else {
                            JuaBox.showWrong(bitbank.L("批量委托失败！"))
                        }
                    } else {
                        JuaBox.showWrong(bitbank.L("批量委托失败！"))
                    }
                } else {
                    if (needSafeWord) {
                        JuaBox.closeAll(function () {
                            JuaBox.sure(des)
                        })
                    } else {
                        JuaBox.sure(des)
                    }
                }
            }, "json")
        } else {
            if (!isReal) {
                $.post(DOMAIN_TRANS + "" + entrustUrlBase + "entrust/doPlanEntrust-" + market, {
                    safePassword: safePwd,
                    isBuy: isBuy,
                    acctype: acctype,
                    buyPlanMoney: isNaN(buyPlanMoney) ? 0 : buyPlanMoney,
                    buyTriggerHighPrice: isNaN(buyTriggerHighPrice) ? 0 : buyTriggerHighPrice,
                    buyTriggerLowPrice: isNaN(buyTriggerLowPrice) ? 0 : buyTriggerLowPrice,
                    buyPlanHighPrice: isNaN(buyPlanHighPrice) ? 0 : buyPlanHighPrice,
                    buyPlanLowPrice: isNaN(buyPlanLowPrice) ? 0 : buyPlanLowPrice,
                    sellPlanNumber: isNaN(sellPlanNumber) ? 0 : sellPlanNumber,
                    sellTriggerHighPrice: isNaN(sellTriggerHighPrice) ? 0 : sellTriggerHighPrice,
                    sellTriggerLowPrice: isNaN(sellTriggerLowPrice) ? 0 : sellTriggerLowPrice,
                    sellPlanHighPrice: isNaN(sellPlanHighPrice) ? 0 : sellPlanHighPrice,
                    sellPlanLowPrice: isNaN(sellPlanLowPrice) ? 0 : sellPlanLowPrice
                }, function (json) {
                    var code = json.datas.code;
                    var des = json.des;
                    if (isBuy == 1) {
                        $("#buyBtn").button("reset")
                    } else {
                        $("#sellBtn").button("reset")
                    }
                    $this.upP2Pstatus();
                    ajaxIng = false;
                    if (code == 100) {
                        if (isBuy == 1) {
                            $("#buyPlanMoney").val("").change();
                            $("#buyTriggerHighPrice").val("").change();
                            $("#buyTriggerLowPrice").val("").change();
                            $("#buyPlanHighPrice").val("").change();
                            $("#buyPlanLowPrice").val("").change()
                        } else {
                            $("#sellPlanNumber").val("").change();
                            $("#sellTriggerHighPrice").val("").change();
                            $("#sellTriggerLowPrice").val("").change();
                            $("#sellPlanHighPrice").val("").change();
                            $("#sellPlanLowPrice").val("").change()
                        }
                        if (needSafeWord) {
                            JuaBox.closeAll()
                        }
                        JuaBox.showRight(des);
                        lockEntrust = false;
                        doEntrustStatus = false;
                        setTimeout(function () {
                            $this.getEntrustRecord({
                                listDiv: "#entrustRecord",
                                lastTimeRecord: lastTime,
                                status: 3,
                                opEntrust: true
                            })
                        }, 1000)
                    } else {
                        if (needSafeWord) {
                            JuaBox.closeAll(function () {
                                JuaBox.sure(des)
                            })
                        } else {
                            JuaBox.sure(des)
                        }
                    }
                }, "json")
            } else {
                $.post(DOMAIN_TRANS + "" + entrustUrlBase + "entrust/doEntrust-" + market, {
                    safePassword: safePwd,
                    unitPrice: coinPrice,
                    number: coinNumber,
                    isBuy: isBuy,
                    acctype: acctype
                }, function (json) {
                    var code = json.datas.code;
                    var des = json.des;
                    if (isBuy == 1) {
                        $("#buyBtn").button("reset")
                    } else {
                        $("#sellBtn").button("reset")
                    }
                    $this.upP2Pstatus();
                    ajaxIng = false;
                    if (code == 100) {
                        if (isBuy == 1) {
                            $("#buyUnitPrice").val("").change();
                            $("#buyNumber").val("").change()
                        } else {
                            $("#sellUnitPrice").val("").change();
                            $("#sellNumber").val("").change()
                        }
                        if (needSafeWord) {
                            JuaBox.closeAll()
                        }
                        JuaBox.showRight(des);
                        lockEntrust = false;
                        doEntrustStatus = false;
                        setTimeout(function () {
                            $this.getEntrustRecord({
                                listDiv: "#entrustRecord",
                                lastTimeRecord: lastTime,
                                status: 3,
                                opEntrust: true
                            })
                        }, 1000)
                    } else {
                        if (needSafeWord) {
                            JuaBox.closeAll(function () {
                                JuaBox.sure(des)
                            })
                        } else {
                            JuaBox.sure(des)
                        }
                    }
                }, "json")
            }
        }
        if (isReal === false) {
            $("#bkEntrustTab .btn-group .btn").eq(1).click()
        } else {
            $("#bkEntrustTab .btn-group .btn").eq(0).click()
        }
        if (isBuy == 1 && $("#leverSwitchBuy:checked").length > 0) {
            $("#leverSwitchBuy").click()
        }
        if (isBuy != 1 && $("#leverSwitchSell:checked").length > 0) {
            $("#leverSwitchSell").click()
        }
    };
    trans.reConfirm = function (isBuy, callback, tryCode) {
        if (!user.isLogin()) {
            return JuaBox.showWrong(bitbank.L("请先登录后再进行交易"))
        }
        if (ajaxIng) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        if ((isBuy == 1 && buyStrategy == 1 && leverFlagBuy) || (isBuy == 0 && sellStrategy == 1 && leverFlagSell)) {
            return JuaBox.showWrong(bitbank.L("计划委托暂不支持使用一键杠杆，请关闭一键杠杆后再提交。"))
        }
        var $this = this;
        var tryCode = tryCode || 0;
        if (tryCode == 99) {
            doEntrustStatus = true;
            if ($.isFunction(callback)) {
                callback()
            }
            return false
        }
        var canUseMoney = parseFloat(asset[exchangeBi.toLowerCase()]["usable"]);
        var canUseLeverMoney = leverFlagBuy ? (canUseMoney + asset[exchangeBi.toLowerCase()].canLoanIn) : canUseMoney;
        var canUseCoin = parseFloat(asset[numberBi.toLowerCase()]["usable"]);
        var canUseLeverCoin = leverFlagSell ? (canUseCoin + asset[numberBi.toLowerCase()].canLoanIn) : canUseCoin;
        var buyUnitPrice = parseFloat($("#buyUnitPrice").val()), buyMinPrice = parseFloat($("#buyMinPrice").val()),
            buyNumber = parseFloat($("#buyNumber").val()), sellUnitPrice = parseFloat($("#sellUnitPrice").val()),
            sellMaxPrice = parseFloat($("#sellMaxPrice").val()), sellNumber = parseFloat($("#sellNumber").val()),
            safePwd = $("#safePwd").val(), buyPlanMoney = parseFloat($("#buyPlanMoney").val()),
            buyTriggerHighPrice = parseFloat($("#buyTriggerHighPrice").val()),
            buyTriggerLowPrice = parseFloat($("#buyTriggerLowPrice").val()),
            buyPlanHighPrice = parseFloat($("#buyPlanHighPrice").val()),
            buyPlanLowPrice = parseFloat($("#buyPlanLowPrice").val()),
            sellPlanNumber = parseFloat($("#sellPlanNumber").val()),
            sellTriggerHighPrice = parseFloat($("#sellTriggerHighPrice").val()),
            sellTriggerLowPrice = parseFloat($("#sellTriggerLowPrice").val()),
            sellPlanHighPrice = parseFloat($("#sellPlanHighPrice").val()),
            sellPlanLowPrice = parseFloat($("#sellPlanLowPrice").val());
        var canSellLowMoney = M.fixNumber(sellPlanNumber * sellPlanLowPrice, exchangeBixDian);
        var canSellHighMoney = M.fixNumber(sellPlanNumber * sellPlanHighPrice, exchangeBixDian);
        var canBuyHighCoin = M.fixNumber(buyPlanMoney / buyPlanHighPrice, numberBixDian);
        var canBuyLowCoin = M.fixNumber(buyPlanMoney / buyPlanLowPrice, numberBixDian);
        var coinPrice, coinNumber, isReal, isBatch;
        var moneyRegEx = new RegExp("^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0," + exchangeBixDian + "})?$");
        var coinRegEx = new RegExp("^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0," + numberBixDian + "})?$");
        if (isBuy == 1) {
            if (buyStrategy == 1) {
                if (!moneyRegEx.test(M.fixNumber(buyPlanMoney, exchangeBixDian)) || buyPlanMoney == 0) {
                    $("#buyPlanMoney").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的委托金额"))
                }
                if (buyPlanMoney > canUseMoney) {
                    console.log("buyPlanMoney" + buyPlanMoney);
                    console.log("canUseMoney" + canUseMoney);
                    $("#buyPlanMoney").focus();
                    return JuaBox.showWrong(bitbank.L("您的可用资金不足，请核实后再提交。", buyPlanMoney, exchangeBi))
                }
                if (isNaN(buyTriggerHighPrice) && isNaN(buyTriggerLowPrice)) {
                    return JuaBox.showWrong(bitbank.L("请至少填写一个追高触发价或抄底触发价"))
                }
                if ((isNaN(buyTriggerHighPrice) && !isNaN(buyPlanHighPrice)) || (!isNaN(buyTriggerHighPrice) && isNaN(buyPlanHighPrice))) {
                    $("#buyPlanHighPrice").focus();
                    return JuaBox.showWrong(bitbank.L("追高策略必须填写追高触发价和追高委托价"))
                }
                if ((isNaN(buyTriggerLowPrice) && !isNaN(buyPlanLowPrice)) || (!isNaN(buyTriggerLowPrice) && isNaN(buyPlanLowPrice))) {
                    $("#buyPlanLowPrice").focus();
                    return JuaBox.showWrong(bitbank.L("抄底策略必须填写抄底触发价和抄底委托价"))
                }
                if (!isNaN(buyTriggerHighPrice) && buyTriggerHighPrice <= parseFloat(marketPrice[2][0][0])) {
                    $("#buyTriggerHighPrice").focus();
                    return JuaBox.showWrong(bitbank.L("追高触发价必须大于当前行情的卖一价m", marketPrice[2][0][0]))
                }
                if (!isNaN(buyTriggerLowPrice) && buyTriggerLowPrice >= parseFloat(marketPrice[1][0][0])) {
                    $("#buyTriggerLowPrice").focus();
                    return JuaBox.showWrong(bitbank.L("抄底触发价必须小于当前行情的买一价m", marketPrice[1][0][0]))
                }
                if (!isNaN(buyPlanHighPrice) && !isNaN(buyPlanLowPrice) && buyPlanHighPrice <= buyPlanLowPrice) {
                    return JuaBox.showWrong(bitbank.L("追高委托价必须高于抄底委托价", buyPlanHighPrice, buyPlanLowPrice))
                }
                if (!isNaN(buyPlanHighPrice) && parseFloat(canBuyHighCoin) <= 0) {
                    return JuaBox.showWrong(bitbank.L("追高计划委托成交量必须大于0，请增加委托金额或降低追高委托价。"))
                }
                if (!isNaN(buyPlanLowPrice) && parseFloat(canBuyLowCoin) <= 0) {
                    return JuaBox.showWrong(bitbank.L("抄底计划委托成交额必须大于0，请增加委托金额或降低抄底委托价。"))
                }
            } else {
                coinPrice = buyUnitPrice;
                coinNumber = buyNumber;
                isReal = buyStrategy == 1 ? false : true;
                isBatch = buyStrategy == 2 ? true : false;
                if (!moneyRegEx.test(M.fixNumber(coinPrice, exchangeBixDian)) || coinPrice == 0) {
                    $("#buyUnitPrice").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的价格", exchangeBixDian))
                } else {
                    coinPrice = parseFloat(coinPrice)
                }
                if (isBatch && (!moneyRegEx.test(buyMinPrice) || buyMinPrice == 0)) {
                    $("#buyMinPrice").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的价格", exchangeBixDian))
                } else {
                    buyMinPrice = parseFloat(buyMinPrice)
                }
                if (!coinRegEx.test(coinNumber) || coinNumber == 0) {
                    $("#buyNumber").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的数量", numberBixDian))
                } else {
                    coinNumber = parseFloat(coinNumber)
                }
                if (M.fixNumber(coinPrice * coinNumber, amountDecialCur) > canUseLeverMoney) {
                    $("#buyNumber").focus();
                    return JuaBox.showWrong(bitbank.L("您的可用资金不足，请核实后再提交。", M.fixNumber(coinPrice * coinNumber, amountDecialCur), exchangeBi))
                }
                if (isBatch && coinPrice < buyMinPrice) {
                    return JuaBox.showWrong(bitbank.L("批量分散买入的最高限定价格m应高于最低限定价格n，请重设价格。", coinPrice, buyMinPrice))
                }
                if (isReal && (coinPrice / parseFloat(marketPrice[1][0][0])) > parseFloat(marketProtectCur) && tryCode < 1) {
                    return JuaBox.info(bitbank.L("买单价格高于市场价n%", M.fixNumber(coinPrice, amountDecialCur), marketPrice[1][0][0], parseInt(marketProtectCur * 100 - 100)), {
                        btnNum: 2,
                        btnFun1: function (JuaId) {
                            JuaBox.close(JuaId, function () {
                                $this.reConfirm(isBuy, callback, 2)
                            })
                        }
                    })
                }
            }
            if (buyUnitPrice * market.exchangeBixNormal * buyNumber * market.numberBixNormal > 9223372036854776000) {
                return JuaBox.showWrong(bitbank.L("委托金额过大，请分批下单"))
            }
        } else {
            coinPrice = sellUnitPrice;
            coinNumber = sellNumber;
            isReal = sellStrategy == 1 ? false : true;
            isBatch = sellStrategy == 2 ? true : false;
            if (sellStrategy == 1) {
                if (!coinRegEx.test(sellPlanNumber) || sellPlanNumber == 0) {
                    $("#sellPlanNumber").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的委托数量"))
                }
                if (sellPlanNumber > canUseCoin) {
                    $("#sellPlanNumber").focus();
                    return JuaBox.showWrong(bitbank.L("您的可用资金不足，请核实后再提交。", sellPlanNumber, NumberBi))
                }
                if (isNaN(sellTriggerHighPrice) && isNaN(sellTriggerLowPrice)) {
                    return JuaBox.showWrong(bitbank.L("请至少填写一个止盈触发价或止损触发价"))
                }
                if ((!isNaN(sellTriggerHighPrice) && isNaN(sellPlanHighPrice)) || (isNaN(sellTriggerHighPrice) && !isNaN(sellPlanHighPrice))) {
                    $("#sellPlanHighPrice").focus();
                    return JuaBox.showWrong(bitbank.L("止盈策略必须填写止盈触发价和止盈委托价"))
                }
                if ((!isNaN(sellTriggerLowPrice) && isNaN(sellPlanLowPrice)) || (isNaN(sellTriggerLowPrice) && !isNaN(sellPlanLowPrice))) {
                    $("#sellPlanLowPrice").focus();
                    return JuaBox.showWrong(bitbank.L("止损策略必须填写止损触发价和止损委托价"))
                }
                if (!isNaN(sellTriggerHighPrice) && sellTriggerHighPrice <= parseFloat(marketPrice[2][0][0])) {
                    $("#sellTriggerHighPrice").focus();
                    return JuaBox.showWrong(bitbank.L("止盈触发价必须大于当前行情的卖一价m", marketPrice[2][0][0]))
                }
                if (!isNaN(sellTriggerLowPrice) && sellTriggerLowPrice >= parseFloat(marketPrice[1][0][0])) {
                    $("#sellTriggerLowPrice").focus();
                    return JuaBox.showWrong(bitbank.L("止损触发价必须小于当前行情的买一价m", marketPrice[1][0][0]))
                }
                if (!isNaN(sellPlanHighPrice) && !isNaN(sellPlanLowPrice) && sellPlanHighPrice <= sellPlanLowPrice) {
                    return JuaBox.showWrong(bitbank.L("止盈委托价必须高于止损委托价", sellPlanHighPrice, sellPlanLowPrice))
                }
                if (!isNaN(sellPlanHighPrice) && parseFloat(canSellHighMoney) <= 0) {
                    return JuaBox.showWrong(bitbank.L("止盈计划委托成交额必须大于0，请增加委托数量或止盈委托价。"))
                }
                if (!isNaN(sellPlanLowPrice) && parseFloat(canSellLowMoney) <= 0) {
                    return JuaBox.showWrong(bitbank.L("止损计划委托成交额必须大于0，请增加委托数量或止损委托价。"))
                }
            } else {
                if (!moneyRegEx.test(M.fixNumber(coinPrice, exchangeBixDian)) || coinPrice == 0) {
                    $("#sellUnitPrice").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的价格", exchangeBixDian))
                } else {
                    coinPrice = parseFloat(coinPrice)
                }
                if (isBatch && (!moneyRegEx.test(sellMaxPrice) || sellMaxPrice == 0)) {
                    $("#sellMaxPrice").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的价格", exchangeBixDian))
                } else {
                    sellMaxPrice = parseFloat(sellMaxPrice)
                }
                if (!coinRegEx.test(coinNumber) || coinNumber == 0) {
                    $("#sellNumber").focus();
                    return JuaBox.showWrong(bitbank.L("请输入正确的数量", numberBixDian))
                } else {
                    coinNumber = parseFloat(coinNumber)
                }
                if (coinNumber > canUseLeverCoin) {
                    $("#sellNumber").focus();
                    return JuaBox.showWrong(bitbank.L("您的可卖数量不足，请核实后再提交。", coinNumber, numberBi))
                }
                if (isBatch && coinPrice > sellMaxPrice) {
                    return JuaBox.showWrong(bitbank.L("批量分散卖出的最低限定价格m应低于最高限定价格n，请重设价格。", coinPrice, sellMaxPrice))
                }
                if (isReal && (parseFloat(marketPrice[2][0][0]) / coinPrice) > parseFloat(marketProtectCur) && tryCode < 1) {
                    return JuaBox.info(bitbank.L("卖单价格低于市场价n%", M.fixNumber(coinPrice, amountDecialCur), marketPrice[2][0][0], parseInt(marketProtectCur * 100 - 100)), {
                        btnNum: 2,
                        btnFun1: function (JuaId) {
                            JuaBox.close(JuaId, function () {
                                $this.reConfirm(isBuy, callback, 2)
                            })
                        }
                    })
                }
            }
            if (sellUnitPrice * market.exchangeBixNormal * sellNumber * market.numberBixNormal > 9223372036854776000) {
                return JuaBox.showWrong(bitbank.L("委托金额过大，请分批下单"))
            }
        }
        return $this.reConfirm(isBuy, callback, 99)
    };
    trans.safePwdForm = function () {
        var safePwdHtml = "";
        safePwdHtml += "<div id='safeWordForm' class='form-inline'>";
        safePwdHtml += "<div class='bk-tabList'>";
        safePwdHtml += "  <div class='bk-tabList-bd clearfix' style='padding:30px 20px 0px 20px;'>";
        safePwdHtml += "    <div class='form-group' style='width:100%; font-size:12px; margin-bottom:10px;'>";
        safePwdHtml += "      <label for='safePwd' class='control-label'>" + bitbank.L("请输入您的资金安全密码：") + "</label>";
        safePwdHtml += "      <input type='password' class='form-control' id='safePwd' name='safePwd' style='width:200px'>";
        safePwdHtml += "      <a target='_blank' href='" + DOMAIN_VIP + "/service/self/forgetSafePwd'>" + bitbank.L("忘记资金安全密码") + "？</a>";
        safePwdHtml += "    </div>";
        safePwdHtml += "    <p style='font-size:12px;'>" + bitbank.L("温馨提示：您可以临时关闭交易安全密码。") + "</p>";
        safePwdHtml += "  </div>";
        safePwdHtml += "</div>";
        safePwdHtml += "</div>";
        return safePwdHtml
    };
    trans.checkSafePwd = function (callback) {
        var $this = this;
        JuaBox.info($this.safePwdForm(), {
            btnName1: bitbank.L("提交"), btnName2: bitbank.L("取消"), btnFun1: function () {
                if ($("#safePwd").val() == "" || $("#safePwd").val().length < 6) {
                    return JuaBox.showWrong(bitbank.L("安全密码不能少于6位数，也不能为空。"))
                }
                if ($.isFunction(callback)) {
                    callback()
                }
            }, endFun: function (JuaId) {
                $("#closeSafePwd").on("click", function () {
                    JuaBox.closeAll(function () {
                        $("#buyBtn,#sellBtn").button("reset");
                        user.closeSafePwd(function () {
                            $this.hasSafePwd()
                        })
                    })
                });
                $("#JuaBox_" + JuaId).keypress(function (e) {
                    if (e.keyCode == 13) {
                        $("#JuaBtn_" + JuaId + "_1").click()
                    }
                })
            }
        })
    };
    trans.cancelEntrust = function (id, type, plantype) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        JuaBox.info(bitbank.L("确定取消当前委托？"), {
            btnFun1: function (JuaId) {
                JuaBox.close(JuaId, function () {
                    $this.doCancelEntrust(id, type, plantype, function () {
                        setTimeout(function () {
                            $this.getEntrustRecord({
                                listDiv: "#entrustRecord",
                                lastTimeRecord: lastTime,
                                status: 3,
                                opEntrust: true
                            })
                        }, 2000)
                    })
                })
            }
        })
    };
    trans.doCancelEntrust = function (id, type, plantype, callback) {
        if (!user.isLogin()) {
            return false
        }
        if (ajaxIng) {
            return JuaBox.showWrong(bitbank.L("您有未完成的请求，请等待后重试"))
        }
        var $this = this;
        ajaxIng = true;
        $.ajax({
            url: DOMAIN_TRANS + "" + entrustUrlBase + "Entrust/cancle-" + market + "-" + id + "-" + plantype,
            type: "post",
            dataType: "JSON",
            error: function (json) {
                ajaxIng = false;
                JuaBox.showWrong(json.des)
            },
            success: function (json) {
                ajaxIng = false;
                var code = json.datas;
                var des = json.des;
                if (code == 200) {
                    JuaBox.showRight(des)
                } else {
                    JuaBox.showWrong(des)
                }
                if ($.isFunction(callback)) {
                    callback()
                }
                setTimeout(function () {
                    lastTimeRecord = lastTime
                }, 2000)
            }
        })
    };
    trans.batchCancelEntrust = function (planType, callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        var cancelHtml = "";
        cancelHtml += "<form role='form' id='batchCancelForm' class='form-inline' method='post' autocomplete='off'>";
        cancelHtml += "<input type='hidden' id='types' name='types' value='0'>";
        cancelHtml += "<div class='bk-tabList'>";
        cancelHtml += "  <div class='bk-tabList-hd clearfix'>";
        cancelHtml += "    <div class='btn-group bk-btn-group' role='group'>";
        cancelHtml += "      <a class='btn active' role='button' onclick='$(\"#types\").val(0)'>" + bitbank.L("全部取消") + "</a>";
        cancelHtml += "      <a class='btn' role='button' onclick='$(\"#types\").val(1)'>" + bitbank.L("取消买单") + "</a>";
        cancelHtml += "      <a class='btn' role='button' onclick='$(\"#types\").val(2)'>" + bitbank.L("取消卖单") + "</a>";
        cancelHtml += "    </div>";
        cancelHtml += "  </div>";
        cancelHtml += "  <div class='bk-tabList-bd clearfix' style='padding:30px 20px 0px 40px;'>";
        cancelHtml += "    <div class='form-group' style='width:100%; font-size:12px; margin-bottom:10px;'>";
        cancelHtml += "      <label for='minPrice' class='control-label'>" + bitbank.L("限定单价高于：") + "</label>";
        cancelHtml += "      <input type='number' class='form-control' id='minPrice' name='minPrice' placeholder='" + bitbank.L("可不填写") + "' style='width:200px'>";
        cancelHtml += "    </div>";
        cancelHtml += "    <div class='form-group' style='width:100%; font-size:12px; margin-bottom:10px;'>";
        cancelHtml += "      <label for='maxPrice' class='control-label'>" + bitbank.L("限定单价低于：") + "</label>";
        cancelHtml += "      <input type='number' class='form-control' id='maxPrice' name='maxPrice' placeholder='" + bitbank.L("可不填写") + "' style='width:200px'>";
        cancelHtml += "    </div>";
        cancelHtml += "  </div>";
        cancelHtml += "</div>";
        cancelHtml += "</form>";
        JuaBox.info(cancelHtml, {
            btnFun1: function (JuaId) {
                $this.doBatchCancelEntrust(planType, callback)
            }, endFun: function () {
                $("#batchCancelForm .bk-tabList").slide({
                    titCell: ".btn-group .btn",
                    effect: "fade",
                    trigger: "click",
                    titOnClassName: "active"
                })
            }
        })
    };
    trans.doBatchCancelEntrust = function (plantype, callback) {
        if (!user.isLogin()) {
            return false
        }
        if (ajaxIng) {
            return JuaBox.showWrong(bitbank.L("您有未完成的请求，请等待后重试"))
        }
        var $this = this;
        var maxPrice = 0, minPrice = 0;
        if ($("#maxPrice").val() != "") {
            maxPrice = parseFloat($("#maxPrice").val())
        }
        if ($("#minPrice").val() != "") {
            minPrice = parseFloat($("#minPrice").val())
        }
        if (maxPrice < minPrice) {
            return JuaBox.showWrong(bitbank.L("最高价m应该大于最低价n！", maxPrice, minPrice))
        }
        ajaxIng = true;
        $.ajax({
            type: "post",
            url: DOMAIN_TRANS + "/entrust/cancleMore-" + market + "-" + plantype,
            data: $("#batchCancelForm").serialize(),
            dataType: "JSON",
            error: function (json) {
                ajaxIng = false;
                JuaBox.closeAll();
                JuaBox.showWrong(json.des)
            },
            success: function (json) {
                ajaxIng = false;
                JuaBox.closeAll();
                var des = json.des;
                if (json.isSuc) {
                    if (des == 0) {
                        JuaBox.showTip(bitbank.L("没有需要取消的相关委托"))
                    } else {
                        JuaBox.showRight(bitbank.L("成功取消n条委托！", des))
                    }
                } else {
                    JuaBox.sure(des)
                }
                if ($.isFunction(callback)) {
                    callback()
                }
                setTimeout(function () {
                    lastTimeRecord = lastTime
                }, 2000)
            }
        })
    };
    trans.batchCancelPlanEntrust = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        JuaBox.info(bitbank.L("确定取消全部计划委托？"), {
            btnFun1: function (JuaId) {
                JuaBox.close(JuaId, function () {
                    $this.doBatchCancelPlanEntrust(callback)
                })
            }
        })
    };
    trans.doBatchCancelPlanEntrust = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        if (ajaxIng) {
            return JuaBox.showWrong(bitbank.L("您有未完成的请求，请等待后重试"))
        }
        ajaxIng = true;
        $.ajax({
            type: "post",
            url: DOMAIN_TRANS + "/entrust/cancelmorePlanEntrust-" + market,
            data: $("#batchCancelForm").serialize(),
            dataType: "JSON",
            error: function (json) {
                ajaxIng = false;
                JuaBox.closeAll();
                JuaBox.showWrong(json.des)
            },
            success: function (json) {
                ajaxIng = false;
                JuaBox.closeAll();
                var des = json.des;
                if (des == 0) {
                    JuaBox.showTip(bitbank.L("没有需要取消的相关委托"))
                } else {
                    JuaBox.showRight(bitbank.L("成功取消n条委托！", des))
                }
                if ($.isFunction(callback)) {
                    callback()
                }
                setTimeout(function () {
                    lastTimeRecord = lastTime
                }, 2000)
            }
        })
    };
    trans.hasSafePwd = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        $.ajax({
            async: false,
            url: DOMAIN_VIP + "/u/safe/isTransSafe?callback=?",
            type: "post",
            dataType: "json",
            success: function (json) {
                if (json.des == "false") {
                    needSafeWord = false;
                    if ($.isFunction(callback)) {
                        callback()
                    }
                    return false
                } else {
                    needSafeWord = true;
                    if ($.isFunction(callback)) {
                        callback()
                    }
                    return true
                }
            }
        })
    };
    trans.isSameIp = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        $.ajax({
            async: false,
            url: DOMAIN_VIP + "/u/safe/isNotIpTransSafe?callback=?",
            type: "post",
            dataType: "json",
            success: function (json) {
                if (json.des == "true") {
                    needSafeWord = true;
                    JuaBox.info(bitbank.L("您当前IP与登录IP不一致，请输入资金安全密码验证。"), {
                        btnFun1: function (JuaId) {
                            JuaBox.close(JuaId, function () {
                                if ($.isFunction(callback)) {
                                    callback()
                                }
                            })
                        }
                    });
                    return true
                } else {
                    if ($.isFunction(callback)) {
                        callback()
                    }
                    return false
                }
            }
        })
    };
    trans.formatNumberUse = function (num) {
        num = parseFloat(num);
        if (numberBixNormal != numberBixShow) {
            num = Math.floor(num);
            return Math.floor(num * Math.pow(10, numberBixDian))
        } else {
            return Math.floor(accMul(num, numberBixNormal))
        }
    };
    trans.formatMoneyUse = function (num) {
        num = parseFloat(num);
        if (exchangeBixNormal != exchangeBixShow) {
            num = Math.floor(num);
            return Math.floor(num * Math.pow(10, exchangeBixDian))
        } else {
            return Math.floor(accMul(num, exchangeBixNormal))
        }
    };
    module.exports = trans;
    (function () {
        return this || (0, eval)("this")
    }()).trans = trans
});

function formatNumber(a) {
    a = parseFloat(a) / numberBixNormal;
    if (numberBixNormal != numberBixShow) {
        return Math.floor(Math.pow(10, numberBixDian) * parseFloat(a))
    } else {
        return parseFloat(a.toFixed(numberBixDian))
    }
}

function formatNumberUse(a) {
    a = parseFloat(a);
    if (numberBixNormal != numberBixShow) {
        a = Math.floor(a);
        return Math.floor(a * Math.pow(10, numberBixDian))
    } else {
        return Math.floor(accMul(a, numberBixNormal))
    }
}

function accMul(d, b) {
    var a = 0, f = d.toString(), c = b.toString();
    try {
        a += f.split(".")[1].length
    } catch (g) {
    }
    try {
        a += c.split(".")[1].length
    } catch (g) {
    }
    return Number(f.replace(".", "")) * Number(c.replace(".", "")) / Math.pow(10, a)
}

function accDiv_old(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1)
    }
}

function formatMoney(a) {
    a = parseFloat(a) / exchangeBixNormal;
    if (exchangeBixNormal != exchangeBixShow) {
        return Math.floor(Math.pow(10, exchangeBixDian) * parseFloat(a))
    } else {
        return parseFloat(a.toFixed(exchangeBixDian))
    }
}

function formatMoneyUse(a) {
    a = parseFloat(a);
    if (exchangeBixNormal != exchangeBixShow) {
        a = Math.floor(a);
        return Math.floor(a * Math.pow(10, exchangeBixDian))
    } else {
        return Math.floor(accMul(a, exchangeBixNormal))
    }
}

Date.prototype.format = function (b) {
    var c = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(y+)/.test(b)) {
        b = b.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var a in c) {
        if (new RegExp("(" + a + ")").test(b)) {
            b = b.replace(RegExp.$1, RegExp.$1.length == 1 ? c[a] : ("00" + c[a]).substr(("" + c[a]).length))
        }
    }
    return b
};