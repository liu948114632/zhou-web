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
            var texts = [lang.deal3, lang.deal2, '', lang.deal1, '',lang.deal4]
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
        var rootKey = sessionStorage.getItem("uid");
        var rootPass = sessionStorage.getItem("key");
        $scope.loaded= true;
        $scope.buyFee = 0;
        $scope.sellFee = 0;
        $scope.marketFilter = "typeOrder";
        $scope.marketFilterDirection = false;
        $scope.orderTab = 'current';
        $scope.collections = [];
        $scope.entrustList = [];
        $scope.entrustListLog = [];
        // $scope.orderTab = 'history'
        $scope.showDepthChart = function() {
            $scope.klineTab = 2
            loadScript('/js/depth-chart.js', function(){
                // console.log(Highcharts);
                $.getJSON('/api/v2/market/depthData', {symbol: $scope.selectedPair.fid}, function(data){
                    window.renderDepthChart(data)
                })
            })
        }

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

        function marketRefresh() {
            if ($scope.selectedPair) {
                var time =  (new Date()).valueOf();
                var iid = $scope.selectedPair.iid;
                var val = "msgtype=ReqQryDepth&iid="+$scope.selectedPair.iid+"&UserID=123"+"&TimeStamp="+time;
                var hash = CryptoJS.HmacSHA256(val, "123123");
                var sign = hash.toString();
                $http({
                    method:"POST",
                    url:"/api/v1",
                    data:val+"&Sign="+sign,
                    responseType :'arraybuffer',
                }).then(function (res) {
                    var result = toGbk(res.data);
                    var s = result.replace('"iid":'+iid+',',"");
                    var json_result = JSON.parse(s);
                    $scope.buyDepthList = json_result.bids;
                    for (var i =0 ;i<$scope.buyDepthList.length;i++){
                        $scope.buyDepthList[i][0] = scientificToNumber($scope.buyDepthList[i][0]);
                    }
                    $scope.sellDepthList = json_result.asks;
                    for (var j =0 ;j<$scope.sellDepthList.length;j++){
                        $scope.sellDepthList[j][0] = scientificToNumber($scope.sellDepthList[j][0]);
                    }
                })
            }
        }
        /*科学计数法转换数值*/
        function scientificToNumber(num) {
            if(isEmpty(num)){
                return;
            }
            var str = num.toString();
            var reg = /^(\d+)(e)([\-]?\d+)$/;
            var arr, len,
                zero = '';

            /*6e7或6e+7 都会自动转换数值*/
            if (!reg.test(str)) {
                return num;
            } else {
                /*6e-7 需要手动转换*/
                arr = reg.exec(str);
                len = Math.abs(arr[3]) - 1;
                for (var i = 0; i < len; i++) {
                    zero += '0';
                }

                return '0.' + zero + arr[1];
            }
        }
        function recentLog() {
            if ($scope.selectedPair) {
                var time =  (new Date()).valueOf();
                var val = "msgtype=ReqQryLastTrade&iid="+$scope.selectedPair.iid+"&UserID=123"+"&TimeStamp="+time;
                var hash = CryptoJS.HmacSHA256(val, "123123");
                var sign = hash.toString();
                $http({
                    method:"POST",
                    url:"/api/v1",
                    data:val+"&Sign="+sign,
                    responseType :'arraybuffer',
                }).then(function (res) {
                    var result = JSON.parse(toGbk(res.data));
                    $scope.recentDealList = result;
                })
            }
        }

        //msgtype=ReqQryOrder&isid=ltc_btc&osid=1&UserID=00001&TimeStamp=2112345678000
        function getOrders() {
            if ($scope.selectedPair) {
                $scope.entrustList = [];
                $scope.entrustListLog = [];
                var time =  (new Date()).valueOf();
                var val = "msgtype=ReqQryOrder&isid="+$scope.selectedPair.iid+"&UserID="+rootKey+"&TimeStamp="+time;
                var hash = CryptoJS.HmacSHA256(val, rootPass);
                var sign = hash.toString();
                $http({
                    method:"POST",
                    url:"/api/v1",
                    data:val+"&Sign="+sign,
                    responseType :'arraybuffer',
                }).then(function (res) {
                    var result = toGbk(res.data);
                    var orders = JSON.parse(result);
                    for(var i =0; i<orders.length; i++){
                        orders[i]['lp'] = scientificToNumber(orders[i]['lp']);
                        if(orders[i]['os'] == 1 || orders[i]['os'] == 3){
                            $scope.entrustList.push(orders[i]);
                        }else {
                            $scope.entrustListLog.push(orders[i]);
                        }
                    }
                })
            }
        }
        function checkOrder(type) {
            var order = $scope[type + 'Order'];
            if (!order.amount || order.amount <= 0) {
                setErrorMessage(type, lang.js.exchange.amountTips);
                return false;
            }
            if($scope.tradeType == "limit"){
                if (!order.total || order.total <= 0) {
                    setErrorMessage(type, lang.js.exchange.moneyTips);
                    return false;
                }
            }
            return true
        }

        function setErrorMessage(type, msg, fn) {
            if (msg) {
                error_win(msg, fn)
            }
        }


        //msgtype=ReqQryTradingAccount&cid=BTC&at=4&UserID=00001&TimeStamp=2112345678000
        function loadBalances() {
            if ($scope.selectedPair) {
                var group = $scope.selectedPair.iid.split("_")[1].toUpperCase();
                $scope.rootKey =  $scope.selectedPair.iid.split("_")[0].toUpperCase();
                getMoney(group);
                getMoney($scope.rootKey);
            }
        }
        function getMoney(cid) {
            var time =  (new Date()).valueOf();
            var val = "msgtype=ReqQryTradingAccount&cid="+cid+"&UserID="+rootKey+"&TimeStamp="+time;
            // var val = "msgtype=ReqQryTradingAccount&UserID=111@qq.com"+"&TimeStamp="+time;
            var hash = CryptoJS.HmacSHA256(val, rootPass);
            var sign = hash.toString();
            $http({
                method:"POST",
                url:"/api/v1",
                data:val+"&Sign="+sign,
                responseType :'arraybuffer',
            }).then(function (res) {
                var result = JSON.parse(toGbk(res.data));
                if(cid == $scope.rootKey){
                    $scope.keyMoney = result.a;
                }else {
                    $scope.groupMoney = result.a;
                }
            })
        }

        function loadCoins() {
            var time =  (new Date()).valueOf();
            var val = "msgtype=ReqQryDepthMarketData&UserID=123"+"&TimeStamp="+time;
            var hash = CryptoJS.HmacSHA256(val, "123");
            var sign = hash.toString();
            $http({
                method:"POST",
                // url:"http://47.97.219.235:8814"+"/api/v1",
                url:"/api/v1",
                data:val+"&Sign="+sign,
                responseType :'arraybuffer',
                header:{}
            }).then(function(res){
                    $scope.allCoins = JSON.parse(toGbk(res.data));
                    var tickers = $scope.allCoins;
                    var current = null;
                    var coinGroup = {};
                    var param = location.hash.match(new RegExp(".*" + 'symbol' + "=([^\&]*)(\&?)","i"));
                    var symbol = param && !isEmpty(param[1]) ? param[1] : tickers[0].iid;

                    for (var i = 0; i < tickers.length; i++) {
                        var ticker = tickers[i];
                        var sp = ticker.pcp ? ticker.pcp : 1;
                        ticker.up = (ticker.lsp - sp)/sp *100 ;
                        ticker.key = ticker.iid.replace('_','/');
                        current = i == 0? ticker: current;
                        var group = ticker.iid.split('_')[1];
                        if (coinGroup[group] === undefined) {
                            coinGroup[group] = []
                        }
                        coinGroup[group].push(ticker);
                        if (ticker.iid == symbol) {
                            current = ticker
                        }
                    }
                    if (current) {
                        var current_group = current.iid.split('_')[1];
                        $scope.setPair(current);
                        $scope.tickers = coinGroup[current_group];
                        $scope.coinGroup = coinGroup
                    }
                })
        }

        $scope.changeGroup = function(group) {
            $scope.selectedGroup = group
            $scope.tickers = $scope.coinGroup[group]
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
            location.hash = 'symbol=' + ticker.iid;
            $scope.selectedPair = ticker
            $scope.buyOrder = {price: '', amount: '', total: ''}
            $scope.sellOrder = {price: '', amount: '', total: ''}
            marketRefresh();
            recentLog();
            getOrders();
            loadBalances();
            $scope.klineUrl = '/exchange/kline-white?symbol=' + ticker.iid ;

            document.title = ticker.key.toUpperCase();
            if(!isCollection){
                $scope.selectedGroup = ticker.iid.split('_')[1];
            }
        };
        $scope.tradeType = 'limit';

        $scope.createOrder = function(type) {
            if (!checkOrder(type)) {
                return
            }
            var order = $scope[type + 'Order'];
            var time =  (new Date()).valueOf();
            var order_type = 0;
            if(type == "sell"){
                order_type =1;
            }
            var opt = 2;
            var val = "msgtype=ReqOrderInsert&iid="+rootKey+"&isid="+$scope.selectedPair.iid+"&olid=1&opt=";
            if($scope.tradeType == 'market'){
                opt =3;
                val = val + opt+"&d="+order_type+ "&vto="+order.amount+"&UserID="+rootKey+"&TimeStamp="+time;
            }else {
                val = val + opt+"&d="+order_type+ "&lp="+order.price+ "&vto="+order.amount+"&UserID="+rootKey+"&TimeStamp="+time;
            }
            var hash = CryptoJS.HmacSHA256(val, rootPass);
            var sign = hash.toString();
            $http({
                method:"POST",
                url:"/api/v1",
                data:val+"&Sign="+sign,
                responseType :'arraybuffer'
            }).then(function (res) {
                var result = JSON.parse(toGbk(res.data));
                console.log(result);
                if(order_type == 0){
                    $scope.buyOrder = {price: '', amount: '', total: ''}
                    getMoney($scope.selectedPair.iid.split("_")[1].toUpperCase());
                }else {
                    $scope.sellOrder = {price: '', amount: '', total: ''}
                    getMoney($scope.selectedPair.iid.split("_")[0].toUpperCase());
                }
                marketRefresh();
                getOrders();

            })
        };


        //msgtype=ReqOrderAction&alid=2&osid=1&af=0&UserID=00001&TimeStamp=2112345678000
        $scope.cancelOrder = function(order) {
            var time =  (new Date()).valueOf();
            var val = "msgtype=ReqOrderAction&osid="+order.osid+"&UserID="+rootKey+"&TimeStamp="+time;
            var hash = CryptoJS.HmacSHA256(val, rootPass);
            var sign = hash.toString();
            $http({
                method:"POST",
                url:"/api/v1",
                data:val+"&Sign="+sign,
                responseType :'arraybuffer',
            }).then(function (res) {
                getOrders();
                marketRefresh();
                // var result = toGbk(res.data);
                // var s = JSON.parse(result);
                // console.log(s);
            })
        }

        $scope.orderPercent = function(percent, type){
            var money = type == "sell" ? toDecimal2($scope.keyMoney || 0, 4) : toDecimal2($scope.groupMoney || 0, 4);
            var price = $scope[type+"Order"].price;
            if(isEmpty(price)){
                $scope[type+"Order"].price = $scope.selectedPair.lsp? $scope.selectedPair.lsp : '1';
            }
            if(type == "sell"){
                $scope[type+"Order"].amount = percent * money ;
            }else {
                $scope[type+"Order"].amount = percent * money /$scope[type+"Order"].price;
            }
            $scope.setTotalOrAmount(type+"Order");
        }

        $scope.setTotalOrAmount = function(type) {
            var order  = $scope[type]
            var price = order.price || 0;
            var amount = order.amount || 0;
            order.total = (parseFloat(price) * parseFloat(amount)).toFixed(4).trimRight("0");
            if (order.total.slice(-1) == ".") {
                order.total = order.total.trimRight(".")
            }
            $scope[type] = order
        };

        $scope.setBuy = function(sell) {
            $scope.buyOrder.price = sell[0];
            $scope.sellOrder.price = sell[0]
            // $scope.buyOrder.amount = (sell[1] * 1).toFixed(8)
            // $scope.setTotalOrAmount('buyOrder')
        }
        $scope.setSell = function(buy) {
            $scope.sellOrder.price = buy[0];
            $scope.buyOrder.price = buy[0]
            // $scope.sellOrder.amount = (buy[1] * 1).toFixed(8)
            // $scope.setTotalOrAmount('sellOrder')
        }
        $scope.setPrice = function(row) {
            $scope.sellOrder.price = row['p'];
            $scope.buyOrder.price = row['p']
        }
        $scope.search = function(res){
            if(isEmpty($scope.keyword)){
                return res;
            }else {
                var key = res.key.split("/")[0];
                if(key.toUpperCase().indexOf($scope.keyword.toUpperCase()) > -1){
                    return res;
                }
            }
        };

        loadCoins();
        $interval(marketRefresh,5000);
        $interval(recentLog,5000);
        $interval(getOrders,10000);
        function getCoins() {
            var time =  (new Date()).valueOf();
            var val = "msgtype=ReqQryDepthMarketData&UserID=123"+"&TimeStamp="+time;
            var hash = CryptoJS.HmacSHA256(val, "123");
            var sign = hash.toString();
            $http({
                method:"POST",
                url:"/api/v1",
                data:val+"&Sign="+sign,
                responseType :'arraybuffer',
                header:{}
            }).then(function(res){
                $scope.allCoins = JSON.parse(toGbk(res.data));
                var tickers = $scope.allCoins;
                var coinGroup = {};
                for (var i = 0; i < tickers.length; i++) {
                    var ticker = tickers[i];
                    var sp = ticker.pcp ? ticker.pcp : 1;
                    ticker.up = (ticker.lsp  - sp)/sp *100 ;
                    ticker.key = ticker.iid.replace('_','/');
                    var group = ticker.iid.split('_')[1];
                    if (coinGroup[group] === undefined) {
                        coinGroup[group] = []
                    }
                    coinGroup[group].push(ticker);
                }
                var ns  = $(".f-fr.f-nomargin.ng-binding.ng-scope.active").text();
                $scope.tickers = coinGroup[ns.toLowerCase()];
            })
        }
        $interval(getCoins,10000);
        function getReal() {
            var time =  (new Date()).valueOf();
            var val = "msgtype=ReqQryDepthMarketData&iid="+$scope.selectedPair.iid+"&UserID=123"+"&TimeStamp="+time;
            var hash = CryptoJS.HmacSHA256(val, "123");
            var sign = hash.toString();
            $http({
                method:"POST",
                url:"/api/v1",
                data:val+"&Sign="+sign,
                responseType :'arraybuffer',
                header:{}
            }).then(function(res){

                var ticker  = JSON.parse(toGbk(res.data));
                var sp = ticker.pcp ? ticker.pcp : 1;
                ticker.up = (ticker.lsp  - sp)/sp *100 ;
                ticker.key = ticker.iid.replace('_','/');
                $scope.selectedPair = ticker;
            })
        }
        $interval(getReal,5000);
        // loadBalances()

        // autoRefreshUserInfo();
        //
        // autoMarketRefresh();

        // refreshUserInfo();
        //
        // marketRefresh();
        // loadTicker();
    }]);

})();