var app = angular.module('app', ['i18n']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('payinController', ['$scope', '$http', '$location', '$interval',  function ($scope, $http, $location, $interval) {
    $scope.id = $location.search().id;
    $scope.wallet  = {};
    function getAsset() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryTradingAccount&cid="+$scope.id +"&UserID=111@qq.com"+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, "123123");
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            $scope.wallet = JSON.parse(toGbk(res.data));
        })
    }
    // msgtype=ReqQryDepositAddress&cid=BTC&UserID=00001&TimeStamp=2112345678000&
    function getAddress() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryDepositAddress&cid="+$scope.id +"&UserID=111@qq.com"+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, "123123");
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            if(isEmpty(result.da)){
                applyAddress();
            }
        })
    }
    //msgtype=ReqTransferInsert&iid=00001&tlid=1&tt=0&cid=BTC&at=4&UserID=00001&TimeStamp=2112345678000
    function applyAddress() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqTransferInsert&iid=111@qq.com&tt=0&cid="+$scope.id +"&at=4&UserID=111@qq.com"+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, "123123");
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            console.log(result);
        })
    }
    getAsset();
    getAddress();

}]);