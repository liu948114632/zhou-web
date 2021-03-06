define(function (require, exports, module) {
    var user = require("module_user");
    var market = require("module_market");
    var M = require("module_method");
    var asset = {};
    asset.init = function (t) {
        var $this = this;
        if (typeof user == "object") {
            user.init()
        } else {
            try {
                var userInit = setInterval(function () {
                    user = require("module_user");
                    if (typeof user == "object") {
                        user.init();
                        clearInterval(userInit)
                    }
                }, 50)
            } catch (e) {
                console.log("user.init failed")
            }
        }
        if (!user.isLogin()) {
            return false
        }
        // var userId = $.cookie(UID);
        // var readyFun = setInterval(function () {
        //     if (webSocket) {
        //         webSocket.init(function () {
        //             webSocket.sendMessage('{"event":"addChannel","channel":"push_user_asset","userId":"' + userId + '","isZip":"' + false + '", "binary":"false"}')
        //         });
        //         clearInterval(readyFun)
        //     }
        // }, 50);
        setInterval(function () {
            if (ajaxRun == false) {
                return
            }
            $this.getUserAsset()
        }, 5000)
    };
    asset.getUserAssetBySocket = function (result, callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        $this.setUserAssetToPage(result, callback)
    };
    asset.getUserAsset = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        $.getJSON(DOMAIN_VIP + "/u/getAssets?callback=?", function (result) {
            $this.setUserAssetToPage(result, callback)
        })
    };
    asset.getUserLeverAsset = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        $.getJSON(DOMAIN_VIP + "/u/lever/getAssets?callback=?", function (result) {
            $this.setLeverAssetToPage(result, callback)
        })
    };
    asset.setUserAssetToPage = function (result, callback) {
        var $this = this;
        var coins = result.coins;
        var usdtcny = result.usdtcny;
        var dropAssetHtml = "";
        var indexAssetHtml = "";
        var totalAsset = 0;
        if (coins.length > 0) {
            for (var i = 0, ilength = coins.length; i < ilength; i++) {
                if (coins[i].unitDecimal == 0 && coins[i].key == "cny") {
                    coins[i].unitDecimal = 4
                }
                if (coins[i].unitDecimal == 0 && coins[i].key != "cny") {
                    coins[i].unitDecimal = 8
                }
                $this[coins[i].key] = {};
                $this[coins[i].key].usable = M.fixFloat(coins[i].available, coins[i].unitDecimal);
                $this[coins[i].key].freeze = M.fixFloat(coins[i].freez, coins[i].unitDecimal);
                $this[coins[i].key].enName = coins[i].enName;
                $this[coins[i].key].cnName = coins[i].cnName;
                $this[coins[i].key].unitTag = coins[i].unitTag;
                $this[coins[i].key].key = coins[i].key;
                $this[coins[i].key].loan = 0;
                $this[coins[i].key].canLoanIn = 0;
                $this[coins[i].key].decimal = coins[i].unitDecimal;
                $this[coins[i].key].total = M.fixFloat(parseFloat(coins[i].available) + parseFloat(coins[i].freez), coins[i].unitDecimal);
                dropAssetHtml += "<tr>";
                dropAssetHtml += "<td>" + coins[i].enName + "</td>";
                dropAssetHtml += "<td><span class='assetNum text-primary'>" + M.fixDecimal(coins[i].available, coins[i].unitDecimal) + "</span></td>";
                dropAssetHtml += "<td><span class='assetNum'>" + M.fixDecimal(coins[i].freez, coins[i].unitDecimal) + "</span></td>";
                dropAssetHtml += "</tr>";
                indexAssetHtml += '<div class="row">';
                indexAssetHtml += '<div class="col-sm-5 list1">';
                indexAssetHtml += "<h6><i class='icon-" + coins[i].enName + "'></i><span>" + coins[i].enName + "</span></h6>";
                indexAssetHtml += "<p>" + bitbank.L("可用") + ': <span class="bkNum">' + M.fixDecimal(coins[i].available, coins[i].unitDecimal) + "</span> " + coins[i].enName + "</p>";
                indexAssetHtml += "</div>";
                indexAssetHtml += '<div class="col-sm-3 list2">';
                indexAssetHtml += "<span>" + bitbank.L("冻结") + "：<b>" + M.fixDecimal(coins[i].freez, coins[i].unitDecimal) + "</b> " + coins[i].enName + "</span>";
                indexAssetHtml += "</div>";
                indexAssetHtml += '<div class="col-sm-4 list3">';
                if (coins[i].isCanRecharge || coins[i].isCanRecharge == undefined) {
                    indexAssetHtml += '<a class="btn btn-sm btn-primary" href="/u/payin/' + coins[i].key + '" target="_self"><i class="bk-ico incoin"></i>' + bitbank.L("充值") + "</a>"
                }
                if (coins[i].isCanWithdraw || coins[i].isCanWithdraw == undefined) {
                    indexAssetHtml += '<a class="btn btn-sm btn-second" href="/u/payout/' + coins[i].key + '" target="_self"><i class="bk-ico outcoin"></i>' + bitbank.L("提现") + "</a>"
                }
                indexAssetHtml += "</div>";
                indexAssetHtml += "</div>";
                try {
                    if ("usdt" == coins[i].key) {
                        totalAsset += parseFloat($this[coins[i].key].total)
                    } else {
                        if ("qc" == coins[i].key) {
                            totalAsset += parseFloat($this[coins[i].key].total / usdtcny)
                        } else {
                            var price = market[coins[i].key + "usdtMarket"][0];
                            totalAsset += parseFloat($this[coins[i].key].total * price)
                        }
                    }
                } catch (err) {
                    console.log("waiting for market init...")
                }
            }
        }
        $this.allTotal = totalAsset;
        $("#D_dropAssetData").html(dropAssetHtml);
        $("#useAssetList").html(indexAssetHtml);
        var assistCoin = localStorage.assistCoin;
        if (!assistCoin || assistCoin == undefined || assistCoin == "BTC") {
            assistCoin = "CNY"
        }
        $("#Munit, #MunitTop").html(assistCoin);
        if (totalAsset != "" && totalAsset > 0) {
            var precision = 2;
            if ("CNY" == assistCoin) {
                totalAsset = totalAsset * usdtcny
            }
            $("#D_allAsset, #totalAssets").html(M.fixFloat(totalAsset, precision))
        }
        formatNum();
        if ($.isFunction(callback)) {
            callback()
        }
    };
    asset.setLeverAssetToPage = function (result, callback) {
        var $this = this;
        var currentMarket = marketName ? marketName : "";
        var marketLeverData = result.levers.getSpeObject("key", currentMarket);
        $this.levers = result.levers;
        $this.marketLeverData = marketLeverData
    };
    asset.selection = function (unit) {
        $("#Munit, #MunitTop").html(unit);
        localStorage.assistCoin = unit;
        event.stopPropagation()
    };
    asset.transferAsset = function (coins) {
        var usable = asset[coins.toLowerCase()].usable;
        if (!usable) {
            return JuaBox.sure(bitbank.L("x可用余额不足，不可以进行划账", coins))
        }
        JuaBox.info(this.transferAssetForm(coins, usable), {
            width: 600, showClose: false, btnFun1: function (JuaId) {
                var transferAsset = $("#transferAsset").val();
                var safePwd = $("#safePwd").val();
                if (isNaN(transferAsset) || !$.isNumeric(transferAsset)) {
                    return JuaBox.sure(bitbank.L("请输入您的划账金额。"))
                }
                if (parseFloat(transferAsset) > usable) {
                    return JuaBox.sure(bitbank.L("超出可用金额，请重新输入。"))
                }
                if (safePwd == "" || safePwd.length < 6) {
                    return JuaBox.sure(bitbank.L("资金安全密码不能少于6位数，也不能为空。"))
                }
                $.post(DOMAIN_VIP + "/u/payout/transferAsset?callback=?", {
                    safePwd: safePwd,
                    transferAsset: transferAsset,
                    currency: coins
                }, function (json) {
                    var des = json.des;
                    if (json.isSuc) {
                        JuaBox.close(JuaId, function () {
                            JuaBox.sure(des, {
                                btnFun1: function () {
                                    JuaBox.closeAll(function () {
                                        top.location.reload()
                                    })
                                }
                            })
                        })
                    } else {
                        JuaBox.sure(des)
                    }
                }, "json")
            }
        })
    };
    asset.transferAssetForm = function (coins, usable) {
        var safePwdHtml = "";
        safePwdHtml += "<div id='transferAssetForm' class='form-inline'>";
        safePwdHtml += "<h3>" + bitbank.L("划账至x", "ZB.COM") + "</h3>";
        safePwdHtml += "<div class='bk-tabList'>";
        safePwdHtml += "  <div class='bk-tabList-bd clearfix' style='padding:30px 20px 0px 20px;'>";
        safePwdHtml += "    <p style='font-size:14px;'>" + bitbank.L("可用[$1]：[$2]", coins, usable) + "</p>";
        safePwdHtml += "    <div class='form-group' style='width:100%; font-size:14px; margin-bottom:10px;'>";
        safePwdHtml += "      <label for='transferAsset' class='control-label'>" + bitbank.L("请输入划账金额") + "：</label>";
        safePwdHtml += "      <input type='text' class='form-control ft14' id='transferAsset' name='transferAsset' style='width:200px'>";
        safePwdHtml += "    </div>";
        safePwdHtml += "    <div class='form-group' style='width:100%; font-size:14px; margin-bottom:10px;'>";
        safePwdHtml += "      <label for='safePwd' class='control-label'>" + bitbank.L("请输入安全密码") + "：</label>";
        safePwdHtml += "      <input type='password' class='form-control ft14' id='safePwd' name='safePwd' style='width:200px'>";
        safePwdHtml += "      <a target='_blank' href='" + DOMAIN_VIP + "/service/self/forgetSafePwd'>" + bitbank.L("忘记安全密码") + "？</a>";
        safePwdHtml += "    </div>";
        safePwdHtml += "    <p style='font-size:14px;'>" + bitbank.L("温馨提示：资金将划账至[$1]的同名账户下，实时到账。", "ZB.COM") + "</p>";
        safePwdHtml += "  </div>";
        safePwdHtml += "</div>";
        safePwdHtml += "</div>";
        return safePwdHtml
    };
    asset.getTotalAsset = function (coins) {
    };
    asset.getLoanAsset = function (callback) {
        return false;
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        $.getJSON(DOMAIN_P2P + "/getNetFund?callback=?", function (result) {
            if (result.isSuc) {
                $this.cny.canLoanIn = M.fixFloat(result.datas.canLoanCny, $this.cny.decimal);
                $this.btc.canLoanIn = M.fixFloat(result.datas.canLoanBtc, $this.btc.decimal);
                $this.ltc.canLoanIn = M.fixFloat(result.datas.canLoanLtc, $this.ltc.decimal);
                $this.eth.canLoanIn = M.fixFloat(result.datas.canLoanEth, $this.eth.decimal);
                $this.etc.canLoanIn = M.fixFloat(result.datas.canLoanEtc, $this.etc.decimal);
                $this.bts.canLoanIn = M.fixFloat(result.datas.canLoanBts, $this.bts.decimal);
                $this.eos.canLoanIn = M.fixFloat(result.datas.canLoanEos, $this.eos.decimal);
                if ($.isFunction(callback)) {
                    callback()
                }
            }
        })
    };
    module.exports = asset;
    (function () {
        return this || (0, eval)("this")
    }()).ASSET = asset
});