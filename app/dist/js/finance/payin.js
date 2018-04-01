var app = angular.module('app', ['i18n']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('payinController', ['$scope', '$http', '$location', '$interval',  function ($scope, $http, $location, $interval) {
    var rootKey = sessionStorage.getItem("uid");
    var rootPass = sessionStorage.getItem("key");
    $scope.id = $location.search().id;
    $scope.wallet  = {};
    $scope.rechargeLogs = [];
    function getAsset() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryTradingAccount&cid="+$scope.id +"&UserID="+rootKey+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, rootPass);
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
        var val = "msgtype=ReqQryDepositAddress&cid="+$scope.id +"&UserID="+rootKey+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, rootPass);
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            console.log(result);
            if(isEmpty(result.da)){
                // applyAddress();
                $scope.address = "";
            }else {
                $scope.address = result.da;
            }
        })
    }
    //msgtype=ReqTransferInsert&iid=00001&tlid=1&tt=0&cid=BTC&at=4&UserID=00001&TimeStamp=2112345678000
    $scope.applyAddress = function() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqTransferInsert&iid="+rootKey+"&tlid=1&tt=0&cid="+$scope.id +"&at=4&UserID="+rootKey+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, rootPass);
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            // console.log(result);
            $scope.address = result.osid;
        })
    }
    function getLogs() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryTransfer&iid="+rootKey+"&UserID="+rootKey+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, rootPass);
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            for(var i =0;i<result.length;i++){
                var r = result[i];
                if(r.cid == $scope.id && r.tt ==0){
                    $scope.rechargeLogs.push(r);
                }
            }
        })
    }
    getLogs();
    getAsset();
    getAddress();


}]);