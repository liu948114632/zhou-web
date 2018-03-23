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
                return;
            }
            if(result.msgtype == "RspLogin"){
                if(result.em == "正确"){
                    ws.send("msgtype=ReqQryTradingAccount&cid="+$scope.id+"&at=4");
                    // ws.send("msgtype=ReqQryTradingAccount&at=4");
                }else {
                    error_win("登录失败，"+result.em);
                }
                return;
            }
            if(result.msgtype == "RspQryTradingAccount"){
                $scope.wallet = result;
                $scope.$apply();
                return;
            }
        };
        fr.readAsText(event.data,'gbk');
    };
    ws.onclose = function() {
        console.log("连接已关闭...");
    };
}]);