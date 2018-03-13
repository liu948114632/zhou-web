var app = angular.module('app',['i18n']);
app.controller('safeCtrl',['$scope', '$http',function($scope, $http){
    function getSession() {
        $http.get('/api/v1/session?' + new Date().getTime())
            .then(function (res) {
                $scope.user = res.data.data;
                console.log($scope.user)
                if(res.data.code === 200){
                    $http.get("/api/v1/account/getLoginIp")
                        .then(function (res) {
                            $scope.loginIp = res.data.data;
                            $scope.lastLogin = $scope.loginIp[0];
                        })
                }
            })
    }
    getSession();

    $scope.showTip = false;

    $("#showText").click(function () {
        if ($("#jiantouBtn").hasClass("icon-xiajiantou")) {
            $("#jiantouBtn").addClass("icon-shangjiantou").removeClass("icon-xiajiantou");
            $(".showContent").show();
        } else {
            $("#jiantouBtn").addClass("icon-xiajiantou").removeClass("icon-shangjiantou");
            $(".showContent").hide();
        }
    });
}]);