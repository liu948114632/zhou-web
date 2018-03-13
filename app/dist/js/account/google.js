(function($){
    var app = angular.module('app',['i18n']);
    app.controller('googleCtrl', ['$scope', '$http', '$timeout', '$interval',  function ($scope, $http, $timeout, $interval) {
        $scope.tabs = [true];
        $scope.google = {};

        $scope.setstep = function(i){
            $scope.tabs = [];
            $scope.tabs[i] = true;
        }

        if($("#qrcode-google").length > 0){
            $http.get('/api/v1/account/genGoogle').then(function(res) {
                res = res.data;
                if(res.code == 200){
                    jQuery('#qrcode-google').qrcode({
                        render: "canvas", //也可以替换为table
                        width: 115,
                        height: 115,
                        text: res.data.url
                    });
                    $scope.google.secret = res.data.secret;
                }
            })
        }

        $scope.setPassword = function(){
            console.log($scope.google.password)
        }

        var isPending = false;
        $scope.clicksubmit = function(){
            if(isPending){
                error_win(lang.pending);
                return;
            }
            if($scope.google.secretinput != $scope.google.secret){
                error_win(lang.goo.tip1);
                return;
            }
            if(isEmpty($scope.google.password)){
                error_win(lang.goo.tip2);
                return;
            }
            if(isEmpty($scope.google.emailcode)){
                error_win(lang.goo.tip3);
                return;
            }
            if(isEmpty($scope.google.code)){
                error_win(lang.goo.tip4);
                return;
            }
            var params = {
                secret: $scope.google.secretinput,
                password: $scope.google.password,
                emailCode: $scope.google.emailcode,
                code: $scope.google.code
            }
            isPending = true;
            $.post('/v1/account/authGoogle', params, function(data){
                isPending = false;
                if(data.code == 200){
                    success_win(lang.operationSuccess, function(){
                        location.href = "/account/safe";
                    })
                }else if(data.code == -2){
                    error_win(lang.goo.tip7)
                }else if(data.code == -3){
                    error_win(lang.goo.tip5)
                }else if(data.code == -4){
                    error_win(lang.goo.tip6)
                }else if (data.code == 100) {
                    error_win(lang.codeNotSendTips);
                }  else if (data.code == 101) {
                    error_win(lang.codeFrequentTips);
                }else if (data.code == 102) {
                    error_win(lang.codeErrorTips+data.data);
                }else {
                    error_win(lang.error);
                }
            },"json")
        }
        $scope.unbind = function(){
            if(isPending){
                error_win(lang.pending);
                return;
            }
            if(isEmpty($scope.google.password)){
                error_win(lang.goo.tip2);
                return;
            }
            if(isEmpty($scope.google.code)){
                error_win(lang.goo.tip4);
                return;
            }
            var params = {
                password: $scope.google.password,
                code: $scope.google.code
            }
            isPending = true;
            $.post('/v1/account/unbindGoogle', params, function(data){
                isPending = false;
                if(data.code == 200){
                    success_win(lang.operationSuccess, function(){
                        location.href = "/account/safe";
                    })
                }else if(data.code == -3){
                    error_win(lang.goo.tip8)
                }else if(data.code == -2){
                    error_win(lang.goo.tip5)
                }else if(data.code == -4){
                    error_win(lang.goo.tip6)
                }else {
                    error_win(lang.error);
                }
            },"json")
        }
    }])
})(jQuery)