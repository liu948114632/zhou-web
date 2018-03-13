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

        $scope.login = function(){
            ajax_exit();
        };

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

        var socket;
        function connectWs() {
            socket && socket.close()
            socket = io(location.protocol + '//' + host + '/trade?deep=4&token=dev&symbol=' + $scope.selectedPair.fid, {transports: ['websocket', 'pull']});
            // ng fix
            var _on = socket.on
            socket.on = function(event, fn) {
                _on.call(socket, event, function(msg){
                    $scope.$apply(function(){
                        fn(msg)
                    })
                })
            }

            socket.on('entrust-buy', function (msg) {
                $scope.buyDepthList = JSON.parse(msg);
            });
            socket.on('entrust-sell', function (msg) {
                // var arr = JSON.parse(msg).reverse();
                // $scope.sellDepthList = arr.slice(arr.length > 10 ? arr.length - 10 : 0)
                $scope.sellDepthList = JSON.parse(msg).reverse();
            });
            socket.on('entrust-log', function (msg) {
                $scope.recentDealList = JSON.parse(msg);
            });
            socket.on('real', function (msg) {
                var ticker = JSON.parse(msg);
                $scope.selectedPair.lastDealPrize = ticker.last
                $scope.selectedPair.volumn = ticker.vol
                $scope.selectedPair.fupanddown = ticker.fupanddown * 100
            });
            socket.on('entrust-update', function (msg) {
                var newData = JSON.parse(msg);
                if ($scope.selectedPair.fid == newData.symbol) {
                    $scope.user.rmbfrozen = newData.rmbfrozen
                    $scope.user.rmbtotal = newData.rmbtotal
                    $scope.user.virtotal = newData.virtotal
                    $scope.user.virfrozen = newData.virfrozen
                    $scope.user.entrustList = newData.entrustList
                    $scope.user.entrustListLog = newData.entrustListLog
                } else {
                    $scope.user.rmbfrozen = newData.rmbfrozen
                    $scope.user.rmbtotal = newData.rmbtotal
                }
            });
        }

        function refreshUserInfo() {
            if ($scope.selectedPair) {
                $http.get('/api/v2/market/refreshUserInfo?symbol=' + $scope.selectedPair.fid)
                    .then(function(res) {
                        $scope.user = res.data
                    })
            }
        }

        function marketRefresh() {
            if ($scope.selectedPair) {
                $http.get('/api/v2/market/marketRefresh?deep=4&symbol=' + $scope.selectedPair.fid + '&t=' + new Date().getTime())
                    .then(function(res) {
                        $scope.buyDepthList = res.data.buyDepthList
                        // var arr = res.data.sellDepthList.reverse()
                        // $scope.sellDepthList = arr.slice(arr.length > 10 ? arr.length - 10 : 0)
                        $scope.sellDepthList = res.data.sellDepthList.reverse()
                        $scope.recentDealList = res.data.recentDealList
                    })
            }
        }

        function loadFee() {
            if ($scope.selectedPair) {
                $http.get('/api/v2/market/getFee?symbol=' + $scope.selectedPair.fid + '&t=' + new Date().getTime())
                    .then(function(res) {
                        $scope.buyFee = res.data.buyFee
                        $scope.sellFee = res.data.sellFee
                    })
            }
        }

        function autoRefreshUserInfo() {
            $interval(refreshUserInfo, 1000)
        }

        function autoMarketRefresh() {
            $interval(marketRefresh, 1000)
        }

        function checkLogin(type) {
            if (!$scope.user || $scope.user.isLogin != 1) {
                setErrorMessage(type, lang.signIn, function(){
                    location.href = "/user/login"
                });
                return false
            }
            return true
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
            // msg && error_win(msg)
            // errMsgTimer && $timeout.cancel(errMsgTimer)
            // $scope.errorMessage = ''
            // $scope.errorMessage = msg || ''
            // if (msg) {
            //     errMsgTimer = $timeout(function(){
            //         $scope.errorMessage = ''
            //     }, 2500)
            // }
            // if (type === 'buy') {
            //     $scope.buyErrorMessage = msg || ''
            // } else {
            //     $scope.sellErrorMessage = msg || ''
            // }
        }

        function loadTicker() {
            $http.get('/api/v2/market/real?symbol=' + $scope.selectedPair.fid)
                .then(function(res){

                })
        }

        function loadBalances() {
            $http.get('/api/v1/account/balances')
                .then(function(res){
                    $scope.balances = res.data.data
                })
        }

        function loadCoins() {
            return $http.get('/api/v2/market/allcoins')
                .then(function(res){
                    $scope.allCoins = res.data
                    var tickers = res.data;
                    var current = null
                    var coinGroup = {}
                    var param = location.hash.match(new RegExp(".*" + 'symbol' + "=([^\&]*)(\&?)","i"));
                    var symbol = param && !isNaN(param[1]) ? param[1] : tickers[0].fid

                    /*收藏*/
                    var collections = $.cookie('user_self_token');
                    if(collections){
                        var collectionsArr = collections.split(',');
                    }else{
                        $scope.collections = [];
                        collectionsArr = [];
                    }

                    for (var i = 0; i < tickers.length; i++) {
                        var ticker = tickers[i]
                        current = i == 0? ticker: current;
                        var repeatJudge = {}
                        /*判断收藏*/
                        for(var j =0 ; j< collectionsArr.length; j ++){
                            if(ticker.fid == collectionsArr[j]){
                                ticker.pro = true;
                                /*避免重复*/
                                if(!repeatJudge[ticker.fid]){
                                    $scope.collections.push(ticker);
                                    repeatJudge[ticker.fid] = true;
                                }
                            }
                        }
                        if (coinGroup[ticker.group] === undefined) {
                            coinGroup[ticker.group] = []
                        }
                        coinGroup[ticker.group].push(ticker)
                        if (ticker.fid == symbol) {
                            current = ticker
                        }
                    }
                    if (current) {
                        $scope.setPair(current)
                        $scope.tickers = coinGroup[current.group]
                        $scope.tickersTemp = coinGroup[current.group]
                        $scope.coinGroup = coinGroup
                    }
                })
        }
        $scope.search = function () {
            var content = $scope.searchInput;
            if (content == "") {
                $scope.tickers = $scope.tickersTemp;
                return;
            }
            var arr = $scope.tickersTemp;
            var temparr = [];
            for (var i = 0; i < arr.length; i++) {
                var name = arr[i].fShortName;
                var group = arr[i].group;
                if (name.indexOf(content.toUpperCase()) > -1 || group.indexOf(content.toUpperCase()) > -1) {
                    temparr.push(arr[i]);
                }
            }
            $scope.tickers = temparr;
        };
        $scope.changeGroup = function(group) {
            // if ($scope.selectedPair.group !== group) {
            $scope.selectedGroup = group;
            $scope.tickers = $scope.coinGroup[group];
            $scope.tickersTemp = $scope.coinGroup[group];
            $scope.search();
            // $scope.setPair($scope.tickers[0])
            // }
        }

        $scope.favoriteFun = function (e, ticker){
            var collections = $.cookie("user_self_token");
            var collectionsArr = collections ? collections.split(','): [];
            if(ticker.pro){
                //取消收藏
                $scope.refreshTicker(ticker, false);
                for(var i =0;i < collectionsArr.length ; i++){
                    if(collectionsArr[i] == ticker.fid){
                        collectionsArr.splice(i, 1);
                    }
                }
            }else{
                //收藏
                $scope.refreshTicker(ticker, true);
                collections += ','+ticker.fid;
            }
            $.cookie("user_self_token", collections, {expires : 365, path : '/'});
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

        // var $target = $("#market_kline_sel").find("li[data-default=1]");
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
            connectWs()

            $scope.klineUrl = '/exchange/kline-white?symbol=' + ticker.fid + '&name=' + ticker.fShortName + '/' + ticker.group

            document.title = ticker.fShortName + ' / ' + ticker.group
            if(!isCollection){
                $scope.selectedGroup = ticker.group
            }
            // $scope.buyOrder = {price: ticker.lowestSellPrize, amount: 0, total: 0}
            // $scope.sellOrder = {price: ticker.higestBuyPrize, amount: 0, total: 0}

        };

        $scope.data = {

        }

        $scope.judgePassword  = function(){
            $scope.passwordEmpty = false;
        }

        $scope.passwordConfirm = function() {
            if(isEmpty($scope.tradePassword)){
                $scope.passwordEmpty = true;
                return;
            }
            $("#tm_yy, #password-box").hide();
            $scope.data.tradePwd = $scope.tradePassword
            $scope.trade($scope.data.type);
        }

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
                            // refreshUserInfo();
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
            //if (amount !== 0) {
                order.total = (parseFloat(price) * parseFloat(amount)).toFixed(4).trimRight("0");
                if (order.total.slice(-1) == ".") {
                    order.total = order.total.trimRight(".")
                }
                $scope[type] = order
            //}
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
            // var order  = $scope[type]
            // if (order.total && !order.amount) {
            //     $scope.setAmount(type);
            // }
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

        loadCoins()

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