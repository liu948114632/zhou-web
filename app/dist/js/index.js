var app = angular.module('app', ['i18n']);
app.controller('indexController', ['$scope', '$http', '$timeout', '$interval',  function ($scope, $http, $timeout, $interval) {
    $scope.markets= [];
    $scope.selectedMarket= "BTC";
    $scope.tickersTemp= [];
    $scope.selfTickers= [];
    $scope.isDesc = false;
    $scope.oderField = '';
    var coinList;
    function loadCoins() {
        $http.get(basePath + '/v2/market/coins')
            .then(function(res){
                coinList = res.data.dataMap;
                for(var k in coinList){
                    $scope.markets.push(k);
                }
                initSelfTickers();
                var param = location.hash.match(new RegExp(".*" + 'symbol' + "=([^\&]*)(\&?)","i"));
                var symbol;
                var right_ticker;
                if(param && !isNaN(param[1])){
                    symbol = param[1];
                    for (var i = 0; i < $scope.markets.length; i++) {
                        for(var j = 0; j < coinList[$scope.markets[i]].length; j++){
                            var ticker = coinList[$scope.markets[i]][j];
                            if (ticker.fid == symbol) {
                                right_ticker = ticker;
                            }
                        }
                    }
                }
                if(!right_ticker){
                    right_ticker = coinList[$scope.markets[0]][0];
                }
                $scope.money = $scope[right_ticker.group.toLowerCase() + "Price"];
                getCoinList(right_ticker.group);
                // $scope.setPair(right_ticker)
            })
    }
    var initfalg = false;
    function getCoinList(market){
        $scope.selectedMarket = market;
        $scope.tickers = coinList[market];
        $scope.tickersTemp = coinList[market];
        if(initfalg){
            $scope.search();
        }
        initfalg = true;
    }
    $scope.setMarket = function($event,market){
        $($($event.target)).addClass("active").siblings().removeClass("active");
        getCoinList(market);
    };
    $scope.setMarketBySelf = function($event){
        $($($event.target)).addClass("active").siblings().removeClass("active");
        $scope.tickers = $scope.selfTickers;
        $scope.tickersTemp = $scope.selfTickers;
        if(initfalg){
            $scope.search();
        }
    };
    $scope.orderByClick = function (field) {
        $scope.oderField = field;
        $scope.isDesc = !$scope.isDesc;
    };
    $scope.search = function () {
        var content = $("#searchInput").val();
        if (content == "") {
            $scope.tickers = $scope.tickersTemp;
            initSelfTickersOnly();
            return;
        }
        var arr = $scope.tickersTemp;
        var temparr = [];
        for (var i = 0; i < arr.length; i++) {
            var name = arr[i].fShortName;
            if (name.indexOf(content.toUpperCase()) > -1) {
                temparr.push(arr[i]);
            }
        }
        $scope.tickers = temparr;
        initSelfTickersOnly();
    };

    loadCoins();

    //Cookie存储token
    function getCookie(c_name){
        if (document.cookie.length>0){
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1){
                c_start=c_start + c_name.length+1;
                var c_end = document.cookie.indexOf(";",c_start);
                if (c_end==-1) {
                    c_end = document.cookie.length;
                }
                return document.cookie.substring(c_start,c_end);
            }
        }
        return "";
    }

    function setCookie(c_name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +value+((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
    }
    $scope.selfSelect = function (fid) {
        var self = getCookie("user_self_token");
        if(typeof(self) != "undefined" && self != ""){
            var arr = self.split(",");
            var length = arr.length;
            for(var i=0 ; i<arr.length ; i++){
                if(arr[i] == fid){
                    arr.splice(i,1);
                }
            }
            if(length == arr.length){
                arr.push(fid);
            }
            setCookie("user_self_token", arr.join(","),30);
        }else {
            setCookie("user_self_token",fid,30);
        }
        var temp = $scope.selfTickers;
        var tempLength = temp.length;
        for(var i=0 ; i<temp.length ; i++){
            if(temp[i].fid == fid){
                temp.splice(i,1);
            }
        }
        if(tempLength == temp.length){
            var temp2 = $scope.tickers;
            for(var i=0 ; i<temp2.length ; i++){
                if(temp2[i].fid == fid){
                    temp2[i].self = 1;
                    temp.push(temp2[i]);
                    return;
                }
            }
        }

        if(tempLength > temp.length){
            var temp3 = $scope.tickers;
            for(var i=0 ; i<temp3.length ; i++){
                if(temp3[i].fid == fid){
                    temp3[i].self = 0;
                    return;
                }
            }
        }
    }
    
    function initSelfTickers() {
        var self = getCookie("user_self_token");
        if($scope.markets.length > 0){
            var temp = $scope.markets;
            for(var i=0 ; i<temp.length ; i++){
                var list = coinList[$scope.markets[i]];
                for(var k=0; k<list.length; k++){
                    list[k].self = 0;
                    if(typeof(self) != "undefined" && self != ""){
                        var arr = self.split(",");
                        for(var j=0 ; j<arr.length ; j++){
                            if(arr[j] == list[k].fid){
                                list[k].self = 1;
                                $scope.selfTickers.push(list[k]);
                            }
                        }
                    }
                }
            }
        }
    }

    function initSelfTickersOnly() {
        var self = getCookie("user_self_token");
        var list = $scope.tickers;
        for(var k=0; k<list.length; k++){
            list[k].self = 0;
            if(typeof(self) != "undefined" && self != ""){
                var arr = self.split(",");
                for(var j=0 ; j<arr.length ; j++){
                    if(arr[j] == list[k].fid){
                        list[k].self = 1;
                    }
                }
            }
        }
    }
    
    
    function getArticles() {
        $http.get("/api/v1/articleList?page=1&pageSize=3&type=1").then(function (res) {
            $scope.articles = res.data.data == null? [] : res.data.data ;
        })
    }
    getArticles();


    $scope.trade = function(id){
        location.href= "/exchange#symbol=" + id;
    }

}])