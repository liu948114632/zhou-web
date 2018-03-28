var app = angular.module('app', ['i18n']);
app.controller('loginCtrl',function ($scope,$http) {
    $scope.login = function () {
        if(isEmpty($scope.name) || isEmpty($scope.password)){
            error_win("参数不能为空");
            return;
        }
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryTradingAccount&cid="+$scope.id +"&UserID="+$scope.name+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, $scope.password);
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            if(result.em == "用户名或密码错误"){
                error_win(result.em);
                $scope.name ="";
                $scope.password ="";
            }else {
                sessionStorage.setItem("uid",$scope.name);
                sessionStorage.setItem("key",$scope.password);
                location.href = "/"
            }
        })
    }

})



