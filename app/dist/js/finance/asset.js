var app = angular.module('app', ['i18n']);
app.controller('assetController',function ($scope,$http) {
    $scope.items = [];
    function getAsset() {
        var time =  (new Date()).valueOf();
        // var val = "msgtype=ReqQryTradingAccount&cid="+cid+"&UserID=111@qq.com"+"&TimeStamp="+time;
        var val = "msgtype=ReqQryTradingAccount&UserID=111@qq.com"+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, "123123");
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            $scope.init_load = true;
            $scope.items = JSON.parse(toGbk(res.data));

        })
    }
    getAsset();
});