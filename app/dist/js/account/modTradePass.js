var app = angular.module('app',['i18n']);
app.controller('modTradeCtrl',['$scope', '$http',function($scope, $http){

    $scope.mod = function () {
        if(isEmpty($scope.pass) || isEmpty($scope.code) || isEmpty($scope.oldPwd) || isEmpty($scope.reNewPwd)){
            return error_win(lang.noempty);
        }
        if($scope.pass != $scope.reNewPwd){
            return error_win(lang.noSamePwd);
        }
        if(getPwdStrength($scope.pass) < 2){
            return error_win(lang.pwd1);
        }

        var data = {
            code: $scope.code,
            pwd : $scope.pass,
            oldPwd : $scope.oldPwd
        }
        $http.post("/api/v1/account/modSafeWord",$.param(data),{headers :{'Content-Type' :'application/x-www-form-urlencoded' }})
            .then(function (res) {
                if(res.data.code === 200){
                    success_win("修改成功",function () {
                        location.href ="/account/safe"
                    });
                    return;
                }
                if(res.data.code === 1){
                    error_win("不能和原密码一样");
                }else if(res.data.code === 104){
                    error_win(lang.goo.tip9);
                }else {
                    error_win("验证码不正确");
                }
            })
    }
}]);