!(function(){

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth() + 1,
            "d+" : this.getDate(),
            "h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
            "H+" : this.getHours(),
            "m+" : this.getMinutes(),
            "s+" : this.getSeconds(),
            "q+" : Math.floor((this.getMonth() + 3) / 3),
            "S" : this.getMilliseconds()
        };
        var week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt
                .replace(
                    RegExp.$1,
                    ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f"
                        : "/u5468")
                        : "")
                    + week[this.getDay() + ""]);
        }
        for ( var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
                    : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    String.prototype.trimRight = function(charlist) {
        if (charlist === undefined)
            charlist = "\s";
        return this.replace(new RegExp("[" + charlist + "]+$"), "");
    };

    String.prototype.exp = function(){
        var result = this.toString();
        if (this.toString().split("-").length > 1) {
            var feeExp = this.toString().replace(".","")
            var feeFixed = "";
            for (var x = 0; x < this.toString().split("-")[1]; x++) {
                if (x != 0) {
                    feeFixed += "0"
                }
                else{
                    feeFixed += "0."
                }
            }
            if (feeFixed.split(".").length > 1) {
                if (feeFixed.split(".")[1].length < 8) {
                    for (var x = 0; x < 9 - feeFixed.split(".")[1].length; x++) {
                        feeFixed += feeExp[x]
                    }
                }
            }
            result = feeFixed;
        }
        return result;
    }
})()

!(function(){
    //var host = '192.168.0.168';
    var host = location.host;

    var WARN_TEXT = {
        '-1': lang.minTxNumber,
        '-2': lang.pwdError,
        '-3': lang.offerNumber,
        '-4': lang.sufficient,
        '-5': lang.tradePwdSet,
        '-6': lang.priceOver,
        '-8': lang.tradePwdEnter,
        '-100': lang.noCoinTips,
        '-101': lang.pauseExchange,
        '-400': lang.offTime,
        '-50': lang.tradePwdEmpty,
        '-200': lang.netTimeout,
        '-900': lang.priceLarge,
        '-111': lang.minAmountTrade,
        '-112': lang.tooLittle,
        '-113': lang.numberTooLow,
        '-35': lang.singleAmount,
        '-19': lang.priceDiff,
        '-20': lang.maxAmountTrade
    };

    var app = angular.module('app', ['i18n', 'ng-inputdecimalseparator']);
    angular.configHttpProvider(app)

    // app.directive('navAccount', navAccount)
    // app.directive('footerNav', footerNav)

    // app.directive('content', function(){
    //     return {
    //         templateUrl: 'content'
    //     }
    // })


    function toDecimal2(x, pos) {
        pos = pos || 2;
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x * Math.pow(10, pos)) / Math.pow(10, pos);
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + pos) {
            s += '0';
        }
        return s;
    }

    app.filter('fixed', function(){
        return function(num, dec){
            return toDecimal2(num, dec);
        }
    })

    app.filter('gg', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text.replace('.','<g>.') + '</g>');
        };
    }])

    app.filter('asUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl(val);
        };
    }])

    app.filter('html', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])

    app.filter('trimZero', [function(){
        return function(text){
            return parseFloat(text)
        }
    }])

    app.filter('formatEntrustStatus', [function(){
        return function(status){
            var texts = ['', lang.deal1, lang.deal2, lang.deal3, lang.deal4]
            return texts[status]
        }
    }])

    app.filter('orderObjectBy', function() {
        return function (items, field, reverse) {
            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            var filtered = [];
            angular.forEach(items, function(item, key) {
                item.key = key;
                filtered.push(item);
            });
            function index(obj, i) {
                return obj[i];
            }
            filtered.sort(function (a, b) {
                var comparator;
                var reducedA = field.split('.').reduce(index, a);
                var reducedB = field.split('.').reduce(index, b);
                if (isNumeric(reducedA) && isNumeric(reducedB)) {
                    reducedA = Number(reducedA);
                    reducedB = Number(reducedB);
                }
                if (reducedA === reducedB) {
                    comparator = 0;
                } else {
                    comparator = reducedA > reducedB ? 1 : -1;
                }
                return comparator;
            });
            if (reverse) {
                filtered.reverse();
            }
            return filtered;
        };
    });

    angular.module('ng-inputdecimalseparator', [])
        .directive('inputDecimalSeparator', [
            '$locale',
            function ($locale, undefined) {
                return {
                    restrict: 'A',
                    require: '?ngModel',
                    compile: function (_element, tAttrs) {
                        return function (scope, element, attrs, ctrl, undefined) {
                            if (!ctrl) {
                                return;
                            }

                            var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
                                thousandsDelimiter = "",
                                defaultDelimiter=".";
                            var decimalMax=isNaN(attrs.decimalMax)?null:parseFloat(attrs.decimalMax);
                            var decimalMin=isNaN(attrs.decimalMin)?null:parseFloat(attrs.decimalMin);
                            var noOfDecimal=null;

                            if (noOfDecimal || noOfDecimal != '')
                            {
                                noOfDecimal= isNaN(attrs.inputDecimalSeparator)?2:Number(attrs.inputDecimalSeparator);
                                noOfDecimal=Math.floor(noOfDecimal);
                            }

                            // Parser starts here...
                            ctrl.$parsers.push(function (value) {
                                if (!value || value === '') {
                                    return null;
                                }

                                var str = "[^0-9" + decimalDelimiter + "]";
                                var regularExpression = new RegExp(str, 'g');

                                var outputValue = value.replace(regularExpression, '');

                                var tokens = outputValue.split(decimalDelimiter);
                                tokens.splice(2, tokens.length - 2);

                                if (noOfDecimal && tokens[1])
                                    tokens[1] = tokens[1].substring(0, noOfDecimal);

                                var result = tokens.join(decimalDelimiter);
                                var actualNumber =tokens.join(defaultDelimiter);

                                ctrl.$setValidity('max', true);
                                ctrl.$setValidity('min', true);

                                if (decimalMax && Number(actualNumber) > decimalMax)
                                    ctrl.$setValidity('max', false);

                                if (decimalMin && Number(actualNumber) < decimalMin)
                                    ctrl.$setValidity('min', false);

                                // apply thousand separator
                                if (result) {
                                    tokens = result.split($locale.NUMBER_FORMATS.DECIMAL_SEP);
                                    if (tokens[0])
                                        tokens[0] = tokens[0].split( /(?=(?:...)*$)/ ).join("");

                                    result = tokens.join($locale.NUMBER_FORMATS.DECIMAL_SEP);
                                }

                                if (result != value) {
                                    ctrl.$setViewValue(result);
                                    ctrl.$render();
                                }

                                return actualNumber;

                            }); // end Parser

                            // Formatter starts here
                            ctrl.$formatters.push(function (value) {

                                if (!value || value === '') {
                                    return null;
                                }

                                value = value.toString();

                                var tokens = value.split(defaultDelimiter);
                                tokens.splice(2, tokens.length - 2);

                                if (noOfDecimal && tokens[1])
                                    tokens[1] = tokens[1].substring(0, noOfDecimal);

                                var result = tokens.join(decimalDelimiter);
                                var actualNumber =Number(tokens.join(defaultDelimiter));

                                if (decimalMax && actualNumber > decimalMax)
                                    ctrl.$setValidity('max', false);

                                if (decimalMin && actualNumber < decimalMin)
                                    ctrl.$setValidity('min', false);

                                // apply thousand separator
                                if (result) {
                                    tokens = result.split($locale.NUMBER_FORMATS.DECIMAL_SEP);
                                    if (tokens[0])
                                        tokens[0] = tokens[0].split( /(?=(?:...)*$)/ ).join("");

                                    result = tokens.join($locale.NUMBER_FORMATS.DECIMAL_SEP);
                                }
                                return result;
                            });
                        };  // end link function
                    } // end compile function
                };
            }
        ]);

    function loadScript(url, callback){
        var script = document.createElement ("script")
        script.type = "text/javascript";
        if (script.readyState){ //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function(){
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    app.controller('ExchangeCtrl', ['$scope', '$http', '$timeout', '$interval', '$sce', function($scope, $http, $timeout, $interval){
        $scope.loaded= true;
        $scope.buyFee = 0;
        $scope.sellFee = 0;
        $scope.marketFilter = "typeOrder";
        $scope.marketFilterDirection = false;
        $scope.orderTab = 'current';
        $scope.collections = [];
        // $scope.orderTab = 'history'

        $scope.$watch('buyDepthList', function(list){
            if (list) {
                var maxBuyCount = 0
                for (var i = 0; i < list.length; i++) {
                    if (maxBuyCount < list[i][1]) {
                        maxBuyCount = list[i][1]
                    }
                }
                $scope.maxBuyCount = maxBuyCount
            }
        })

        $scope.$watch('sellDepthList', function(list){
            if (list) {
                var maxSellCount = 0
                for (var i = 0; i < list.length; i++) {
                    if (maxSellCount < list[i][1]) {
                        maxSellCount = list[i][1]
                    }
                }
                $scope.maxSellCount = maxSellCount
            }
        })
        $scope.markets= {};
        $scope.groups = [];
        $scope.selectedMarket= "btc";
        var ws = new WebSocket(wsHost);
        var result;
        ws.onopen = function() {
            ws.send("msgtype=ReqSyncRandomString");
        };
        ws.onmessage = function(event){
            var fr = new FileReader();
            fr.onload = function() {
                result = JSON.parse(this.result);
                if(result.msgtype == "RspSyncRandomString"){
                    var time =  (new Date()).valueOf();
                    var val = "msgtype=ReqLogin&uid="+sessionStorage.getItem("uid")+"&ps=-1&td=20180101&TimeStamp="+time+"&RandomString="+result.rs;
                    var hash = CryptoJS.HmacSHA256(val, sessionStorage.getItem("key"));
                    var sign = hash.toString();
                    var msg = val+"&Sign="+sign;
                    ws.send(msg);
                }
                if(result.msgtype == "RspLogin"){
                    if(result.em == "正确"){
                        ws.send("msgtype=ReqQryDepthMarketData");
                    }else {
                        error_win("登录失败，"+result.em);
                    }
                }
                if(result.msgtype == "RspQryDepthMarketData"){
                    var group = result.iid.split('_')[1];
                    var sp = result.pcp == undefined? 1 : result.pcp;
                    result.up = (result.lsp == undefined? 1 :result.lsp - sp)/sp *100 ;
                    result.key = result.iid.replace('_','/');
                    if($scope.markets[group] != undefined){
                        deleteArray($scope.markets[group],result.iid);
                        $scope.markets[group].push(result);
                    }else {
                        $scope.markets[group]= [];
                        $scope.markets[group].push(result);
                        $scope.groups.push(group);
                    }
                    $scope.$apply();
                }
                console.log(result);
            };
            fr.readAsText(event.data,'gbk');
        };
        ws.onclose = function() {
            console.log("连接已关闭...");
        };
        $scope.setMarket = function (group) {
            $scope.selectedMarket= group;
        }
        $interval(function () {
            // rootws.send("msgtype=HeartBeat");
            ws.send("msgtype=ReqQryDepthMarketData");
        },10000);

        //删除数组中元素
        function deleteArray(arr,iid) {
            for (var i = 0; i < arr.length; i++){
                if(arr[i].iid == iid ){
                    arr.splice(i,1);
                    break;
                }
            }
        }

        function marketRefresh() {
            if ($scope.selectedPair) {
                $http.get('/api/v2/market/marketRefresh?deep=4&symbol=' + $scope.selectedPair.fid + '&t=' + new Date().getTime())
                    .then(function(res) {
                        $scope.buyDepthList = res.data.buyDepthList
                        $scope.sellDepthList = res.data.sellDepthList.reverse()
                        $scope.recentDealList = res.data.recentDealList
                    })
            }
        }


        function checkOrder(type) {
            var order = $scope[type + 'Order'];
            if (!order.amount || order.amount <= 0) {
                setErrorMessage(type, lang.js.exchange.amountTips);
                return false;
            }
            if (!order.total || order.total <= 0) {
                setErrorMessage(type, lang.js.exchange.moneyTips);
                return false;
            }
            return true
        }

        // var errMsgTimer = null
        function setErrorMessage(type, msg, fn) {
            if (msg) {
                error_win(msg, fn)
            }
        }

        $scope.refreshTicker = function(ticker, flag){
            for(var i = 0; i < $scope.coinGroup[ticker.group].length; i++){
                if($scope.coinGroup[ticker.group][i].fid ==  ticker.fid){
                    $scope.coinGroup[ticker.group][i].pro = flag;
                    break;
                }
            }
            if(flag){
                ticker.pro = true;
                $scope.collections.push(ticker)
            }else {
                var collection_temp = $scope.collections;
                $scope.collections = [];
                for(var i = 0; i < collection_temp.length; i++){
                    if(collection_temp[i].fid !=  ticker.fid){
                        $scope.collections.push(collection_temp[i]);
                    }
                }
            }
        }

        $scope.setPair = function(ticker, isCollection) {
            if($scope.selectedPair == ticker){
                return
            }
            location.hash = 'symbol=' + ticker.fid;
            $scope.selectedPair = ticker
            $scope.buyOrder = {price: '', amount: '', total: ''}
            $scope.sellOrder = {price: '', amount: '', total: ''}
            refreshUserInfo();
            marketRefresh();
            loadFee()
            $scope.klineUrl = '/exchange/kline-white?symbol=' + ticker.fid + '&name=' + ticker.fShortName + '/' + ticker.group
            document.title = ticker.fShortName + ' / ' + ticker.group
            if(!isCollection){
                $scope.selectedGroup = ticker.group
            }
        };

        $scope.createOrder = function(type) {
            setErrorMessage(type, null)
            if (!checkLogin(type) || !checkOrder(type)) {
                return
            }

            var order = $scope[type + 'Order']
            $scope.data = {
                symbol: $scope.selectedPair.fid,
                tradeAmount: order.amount,
                tradeCnyPrice: order.price,
                type: type
            };

            if($scope.user.needTradePasswd){
                center_box('password-box');
                $("#password-box").show();
                $("#tm_yy").show();
                return;
            }
            $scope.trade(type);
        }

        $scope.trade = function(type) {
            if (type === 'buy' && !$scope.buying) {
                $scope.buying = true
                $http.post('/api/v2/market/buyBtcSubmit', $scope.data)
                    .then(function(res){
                        $scope.buying = false;
                        var resText = res.data.value ? res.data.value : "";
                        if (res.data.resultCode !== 0) {
                            setErrorMessage(type, WARN_TEXT[res.data.resultCode] + resText)
                        } else {
                            $scope.user.needTradePasswd = false;
                            $scope.buyOrder = {price: '', amount: '', total: ''}
                        }
                    })
            } else if (type === 'sell' & !$scope.selling) {
                $scope.selling = true
                $http.post('/api/v2/market/sellBtcSubmit', $scope.data)
                    .then(function(res){
                        $scope.selling = false;
                        var resText = res.data.value ? res.data.value : "";
                        if (res.data.resultCode !== 0) {
                            setErrorMessage(type, WARN_TEXT[res.data.resultCode] + resText)
                        } else {
                            $scope.user.needTradePasswd = false;
                            $scope.sellOrder = {price: '', amount: '', total: ''}
                            // refreshUserInfo();
                        }
                    })
            }
        }

        $scope.cancelOrder = function(order) {
            $http.post('/api/v2/market/cancelEntrust', {id: order[3]})
                .then(refreshUserInfo)
        }

        $scope.setTotal = function(type) {
            var order  = $scope[type]
            var price = order.price || 0;
            var amount = order.amount || 0;
                order.total = (parseFloat(price) * parseFloat(amount)).toFixed(4).trimRight("0");
                if (order.total.slice(-1) == ".") {
                    order.total = order.total.trimRight(".")
                }
                $scope[type] = order
        };

        $scope.orderPercent = function(percent, type){
            var money = type == "sell" ? toDecimal2($scope.user.virtotal || 0, 4) : toDecimal2($scope.user.rmbtotal || 0, 4);
            $scope[type+"Order"].amount = percent * money;
            $scope.setTotalOrAmount(type+"Order");
        }

        $scope.setAmount = function(type) {
            var order  = $scope[type]
            var price = order.price || 0;
            var total = order.total || 0;
            var amount = parseFloat(total) / (parseFloat(price || 0));
            $scope[type].amount = isFinite(amount) ? amount.toString().exp() : 0;
        }

        $scope.setTotalOrAmount = function(type) {
            $scope.setTotal(type);
        }

        $scope.setBuy = function(sell) {
            $scope.buyOrder.price = sell[0]
            $scope.buyOrder.amount = (sell[1] * 1).toFixed(8)
            $scope.setTotal('buyOrder')
        }
        $scope.setSell = function(buy) {
            $scope.sellOrder.price = buy[0]
            $scope.sellOrder.amount = (buy[1] * 1).toFixed(8)
            $scope.setTotal('sellOrder')
        }

    }]);

})();