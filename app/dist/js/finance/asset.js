var app = angular.module('app', ['i18n']);
app.controller('assetController',function ($scope,$http) {
    $scope.items = [];
    $scope.allItems = [];
    $scope.hideAccount = false;
    $scope.allCoins = [];
    var rootKey = sessionStorage.getItem("uid");
    var rootPass = sessionStorage.getItem("key");

    // msgtype=ReqQryInstrument&iid=ltc_btc&UserID=00001&TimeStamp=2112345678000
    function getAllCoin() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryInstrument&UserID="+rootKey+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, rootPass);
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            var all =[];
            for(var i = 0;i< result.length ; i++){
                all.push(result[i].pid);
            }
            $scope.allCoins = Array.from(new Set(all))
            getAsset();
        })
    }
    getAllCoin();

    function getAsset() {
        var time =  (new Date()).valueOf();
        // var val = "msgtype=ReqQryTradingAccount&cid="+cid+"&UserID=111@qq.com"+"&TimeStamp="+time;
        var val = "msgtype=ReqQryTradingAccount&UserID="+rootKey+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, rootPass);
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            $scope.init_load = true;
            var result = JSON.parse(toGbk(res.data));
            //没有记录
            if(JSON.stringify(result).indexOf("正确") != -1){
                for (var j =0;j<$scope.allCoins.length;j++){
                    $scope.allItems.push({'cid':$scope.allCoins[j]})
                }
            }else {
                if(result instanceof Array){
                    $scope.allItems = result;
                }else {
                    $scope.allItems.push(result);
                }
                var coins = [];
                for (var i = 0; i<result.length;i++){
                    coins.push(result[i].cid.toUpperCase());
                }
                var srt = coins.toString();
                for (var k = 0;k< $scope.allCoins.length; k++){
                    if(srt.indexOf($scope.allCoins[k])  == -1){
                        $scope.allItems.push({'cid':$scope.allCoins[k]})
                    }
                }
            }
            // $scope.allItems = $scope.items;
            console.log($scope.allItems)
        })
    }
    $scope.func = function(res){
        if($scope.hideAccount){
            if((res.a || 0 + res.fc || 0) > 0.00001){
                return res;
            }
        }else {
            return res;
        }

    };
    $scope.search = function(res){
        if(isEmpty($scope.keyword)){
            return res;
        }else {
            if(res.cid.indexOf($scope.keyword.toUpperCase()) > -1){
                return res;
            }
        }
    };

    // getAsset();
});