var app = angular.module('app', ['i18n']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('payoutController', ['$scope', '$http', '$location', '$interval',  function ($scope, $http, $location, $interval) {
    var rootKey = sessionStorage.getItem("uid");
    var rootPass = sessionStorage.getItem("key");
    $scope.id = $location.search().id;
    $scope.ischarge = false;
    $scope.realAmount = 0;
    $scope.rechargeLogs = [];
    $scope.tip = lang.send;
    var send = lang.send;
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
    // msgtype=ReqQryTransfer&iid=00001&tsid=1&UserID=00001&TimeStamp=2112345678000&
    //获取提现记录
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
                if(r.cid == $scope.id && r.tt ==1){
                    $scope.rechargeLogs.push(r);
                }
            }
        })
    }

    //msgtype=ReqSmsCodeGenerate&em=zhangsan@163.com&sct=3
    $scope.sendCode = function () {
        if(send != $scope.tip){
            return;
        }
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqSmsCodeGenerate&em="+rootKey+"&sct=3&TimeStamp="+time;
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
            if(result.em == "正确"){
                $scope.tip = 60;
                $interval(function () {
                    if($scope.tip > 0){
                        $scope.tip = $scope.tip -1;
                    }else {
                        $scope.tip  =  send;
                        return;
                    }
                },1000)
            }else {
                error_win(result.em);
            }
        })
    };

    var isPending = false;
//msgtype=ReqTransferInsert&iid=00001&tlid=2&tt=1&d=1.0&cid=BTC&at=4&fp=123456&dca=26mhzjkJ71oMAMkKu4dy98dnUpkyQBHL37&adt=123123&UserID=00001&TimeStamp=2112345678000
   $scope.bindWithdraw = function () {
       if($scope.amount<=0){
           error_win(lang.js.payout.amountEmptyTips);
           return;
       }
       if(isEmpty($scope.amount) || isEmpty($scope.address) || isEmpty($scope.code)){
           error_win(lang.noempty);
           return;
       }
       if(isEmpty($scope.wallet.a) || $scope.amount >$scope.wallet.a  || $scope.wallet.a == 0){
           error_win(lang.sufficient);
           return;
       }
       var time =  (new Date()).valueOf();
       var val = "msgtype=ReqTransferInsert&iid="+rootKey+"&tt=1&d="+$scope.amount+"&cid="+$scope.id +
           "&at=4&fp="+$scope.code+"&dca="+$scope.address+"&UserID="+rootKey+"&TimeStamp="+time;
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
       })
   }

    getAsset();
    getLogs();



}]);