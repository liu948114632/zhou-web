var app = angular.module('app', ['i18n']);
app.controller('loginCtrl',function ($scope,$http) {
    $scope.login = function () {
        if(isEmpty($scope.name) || isEmpty($scope.password)){
            error_win("参数不能为空");
            return;
        }
        var time =  (new Date()).valueOf();
        // var val = "msgtype=ReqQryInstrument&iid=ltc_btc&UserID="+$scope.name+"&TimeStamp="+time;
        var val = "msgtype=ReqQryDepthMarketData&UserID="+sessionStorage.getItem("uid")+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, $scope.password);
        var sign = hash.toString();
        $http.post("/api/v1",val+"&Sign="+sign)
            .then(function (res) {
            console.log(res.data);
            sessionStorage.setItem("uid",$scope.name);
            sessionStorage.setItem("key",$scope.password);
        })
        // $http({
        //     method:"POST",
        //     url:"/api/v1",
        //     data:val+"&Sign="+sign,
        //     responseType :'arraybuffer'
        // }).then(function (res) {
        //     var result = unzip(res.data);
        //     console.log(JSON.parse(result))
        // })
    }

})



