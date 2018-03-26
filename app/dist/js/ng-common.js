angular.module('i18n', []).value(lang, lang).controller('gCtrl', ['$scope', '$interval', '$http', function($scope, $interval, $http){
    $scope.lang = lang;
    // function checkLogin() {
    //     $http.get('/api/v1/session?' + new Date().getTime())
    //         .then(function(res){
    //             $scope.userLoaded = true
    //             $scope.loginUser = res.data.data
    //         })
    // }
    // checkLogin()
    // $interval(checkLogin, 10 * 1000)
}]);

angular.configHttpProvider = function(app) {
    app.config(['$httpProvider', function($httpProvider){
        // $httpProvider.defaults.headers.post = {"Content-Type": "application/x-www-form-urlencoded"}
        // $httpProvider.defaults.transformRequest = function(obj) {
        //     var str = [];
        //     for (var p in obj) {
        //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        //     }
        //     return str.join("&");
        // }
    }])
}