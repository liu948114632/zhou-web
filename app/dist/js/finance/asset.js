var app = angular.module('app', ['i18n']);
app.controller('assetController',function ($scope,$http) {
    $scope.items = [];
    $scope.allItems = [];
    $scope.hideAccount = false;
    var rootKey = sessionStorage.getItem("uid");
    var rootPass = sessionStorage.getItem("key");
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
            $scope.items = JSON.parse(toGbk(res.data));
            $scope.allItems = $scope.items;
        })
    }
    $scope.func = function(res){
        if($scope.hideAccount){
            if((res.a || 0 + w.fc || 0) > 0.00001){
                return res;
            }
        }else {
            return res;
        }

    };
    $scope.search = function(){
        if(isEmpty($scope.keyword)){
            $scope.items = $scope.allItems;
            return;
        }
        $scope.items = [];
        for (var i = 0;i<$scope.allItems.length ;i++){
            if($scope.allItems[i].cid.indexOf($scope.keyword.toUpperCase()) > -1){
                $scope.items.push($scope.allItems[i])
            }
        }
    };

    getAsset();
});