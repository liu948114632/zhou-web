var app = angular.module('app', ['i18n']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('payoutController', ['$scope', '$http', '$location', '$interval',  function ($scope, $http, $location, $interval) {
    $scope.id = $location.search().id;
    $scope.ischarge = false;
    $scope.realAmount = 0;
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
    getAsset();

    var isPending = false;
//    msgtype=ReqTransferInsert&iid=00001&tlid=2&tt=1&d=1.0&cid=BTC&at=4&dca=26mhzjkJ71oMAMkKu4dy98dnUpkyQBHL37&UserID=00001
//    $scope.bindWithdraw = function () {
//        if(isEmpty($scope.amount) || isEmpty($scope.address)){
//            error_win("参数不能为空");
//            return;
//        }
//        if($scope.amount >$scope.wallet.a){
//            error_win("最大提现"+$scope.wallet.a);
//            return;
//        }
//        var time =  (new Date()).valueOf();
//        var val = "msgtype=ReqTransferInsert&iid="+"111@qq.com"+"&tt=1&d="+$scope.amount+"&cid="+$scope.id +"&at=4&dca="+$scope.address+"&UserID=111@qq.com"+"&TimeStamp="+time;
//        var hash = CryptoJS.HmacSHA256(val, "123123");
//        var sign = hash.toString();
//        $http({
//            method:"POST",
//            url:"/api/v1",
//            data:val+"&Sign="+sign,
//            responseType :'arraybuffer',
//        }).then(function (res) {
//            var result = JSON.parse(toGbk(res.data));
//            console.log(result);
//        })
//    }



    var rootws;
    var rootresult;
    function loginCommon(callback) {
        rootws = new WebSocket(wsHost);
        rootws.onopen = function()
        {
            rootws.send("msgtype=ReqSyncRandomString");
        };
        rootws.onmessage = function(event){
            var fr = new FileReader();
            fr.onload = function() {
                rootresult = JSON.parse(this.result);
                console.log(rootresult);
                if(rootresult.msgtype == "RspSyncRandomString"){
                    var time =  (new Date()).valueOf();
//                    var val = "msgtype=ReqLogin&uid="+sessionStorage.getItem("uid")+"&ps=-1&td=20180101&TimeStamp="+time+"&RandomString="+rootresult.rs;
//                    var hash = CryptoJS.HmacSHA256(val, sessionStorage.getItem("key"));
                    var val = "msgtype=ReqLogin&uid="+"111@qq.com"+"&ps=-1&td=20180101&TimeStamp="+time+"&RandomString="+rootresult.rs;
                    var hash = CryptoJS.HmacSHA256(val, "123123");
                    var sign = hash.toString();
                    var msg = val+"&Sign="+sign;
                    rootws.send(msg);
                }
                if(rootresult.msgtype == "RspLogin"){
                    if(rootresult.em == "正确"){
                        (callback && typeof(callback)==="function") && callback();
                    }
                }
                rootresult = "";
            };
            fr.readAsText(event.data,'gbk');
        };
        rootws.onclose = function()
        {
            console.log("连接已关闭...");
        };

    }
//    loginCommon();
    $scope.sendCode = function() {
        var ws = new WebSocket("ws://47.97.219.235:8811");
        ws.onopen = function() {
           ws.send("msgtype=ReqSmsCodeGenerate&em="+"111@qq.com")
        };
        ws.onmessage = function(event){
            var fr = new FileReader();
            fr.onload = function() {
                var result = JSON.parse(this.result);
                console.log(result);
            };
            fr.readAsText(event.data,'gbk');
        };
        ws.onclose = function() {
            console.log("连接已关闭...");
        };
    }

    $scope.bindWithdraw = function () {
            if(isEmpty($scope.amount) || isEmpty($scope.address) || isEmpty($scope.code)){
                error_win("参数不能为空");
                return;
            }
            if($scope.amount >$scope.wallet.a){
                error_win("最大提现"+$scope.wallet.a);
                return;
            }
            loginCommon(function(){
               rootws.send("msgtype=ReqTransferInsert&iid="+"111@qq.com"+"&tt=1&d="+$scope.amount+"&cid="+$scope.id+"&at=4&fp="+$scope.code+"&dca="+$scope.address);
            });
//            msgtype=ReqTransferInsert&iid=00001&tlid=2&tt=1&d=1.0&cid=BTC&at=4&fp=123456&dca=26mhzjkJ71oMAMkKu4dy98dnUpkyQBHL37

        }
     $interval(function(){
        rootws.send("msgtype=HeartBeat");
     },30000)
}]);