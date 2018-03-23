var app = angular.module('app', ['i18n']);
app.controller('indexController', ['$scope', '$http', '$timeout', '$interval',  function ($scope, $http, $timeout, $interval) {
    // $scope.markets= [];
    // $scope.selectedMarket= "BTC";
    // $scope.tickersTemp= [];
    // $scope.isDesc = false;
    // $scope.oderField = '';
    // var coinList;
    // function loadCoins() {
    //     $http.get(basePath + '/v2/market/coins')
    //         .then(function(res){
    //             coinList = res.data.dataMap;
    //             for(var k in coinList){
    //                 $scope.markets.push(k);
    //             }
    //             var param = location.hash.match(new RegExp(".*" + 'symbol' + "=([^\&]*)(\&?)","i"));
    //             var symbol;
    //             var right_ticker;
    //             if(param && !isNaN(param[1])){
    //                 symbol = param[1];
    //                 for (var i = 0; i < $scope.markets.length; i++) {
    //                     for(var j = 0; j < coinList[$scope.markets[i]].length; j++){
    //                         var ticker = coinList[$scope.markets[i]][j];
    //                         if (ticker.fid == symbol) {
    //                             right_ticker = ticker;
    //                         }
    //                     }
    //                 }
    //             }
    //             if(!right_ticker){
    //                 right_ticker = coinList[$scope.markets[0]][0];
    //             }
    //             $scope.money = $scope[right_ticker.group.toLowerCase() + "Price"];
    //             getCoinList(right_ticker.group);
    //         })
    // }
    // var initfalg = false;
    // function getCoinList(market){
    //     $scope.selectedMarket = market;
    //     $scope.tickers = coinList[market];
    //     $scope.tickersTemp = coinList[market];
    //     if(initfalg){
    //         $scope.search();
    //     }
    //     initfalg = true;
    // }
    // $scope.setMarket = function($event,market){
    //     $($($event.target)).addClass("active").siblings().removeClass("active");
    //     getCoinList(market);
    // };
    // loadCoins();
    // $scope.trade = function(id){
    //     location.href= "/exchange#symbol=" + id;
    // };



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
            }
            console.log(result);
            result = "";
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
    },5000);

    //删除数组中元素
    function deleteArray(arr,iid) {
        for (var i = 0; i < arr.length; i++){
            if(arr[i].iid == iid ){
                arr.splice(i,1);
                break;
            }
        }
    }

}])