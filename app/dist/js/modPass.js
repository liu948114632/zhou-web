var app = angular.module('app', ['i18n']);
app.controller('modController', ['$scope', '$http', '$interval', function ($scope, $http,$interval) {
    var rootKey = sessionStorage.getItem("uid");
    var rootPass = sessionStorage.getItem("key");
    $scope.tip = lang.send;
    var send = lang.send;
    $scope.name = "";
    $scope.sendCode = function () {
        if(send != $scope.tip){
            return;
        }
        var m = "em";
        if(isMobile(rootKey)){
            m = "m";
        }
        var val = "msgtype=ReqSmsCodeGenerate&"+m+"="+rootKey+"&sct=2";
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

    // msgtype=ReqUserPasswordUpdate&uid=15135130608&op=3688515672&np=123456&Sign=b2a44aedd4831bf4137a2f18552d8b62a45539f612283ac8a8649d5b20a783ae
    // msgtype=ReqUserPasswordUpdate&uid=00001&op=123456&np=222222&Sign=abce123435231543fdgfdgergerwgrtey34534tregfdbfdbfdvsdgvasdgv4567
    $scope.mod = function () {
        if(isEmpty($scope.code) || isEmpty($scope.pass)){
            error_win(lang.noempty);
            return;
        }
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqUserPasswordUpdate&uid="+rootKey+"&op="+$scope.code+"&np="+$scope.pass+"&UserID="+rootKey+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, $scope.code);
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
                success_win(lang.operationSuccess);
            }else {
                error_win(result.em);
            }
        })
    }
}]);