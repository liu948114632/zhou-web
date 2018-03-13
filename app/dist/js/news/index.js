var app = angular.module('app',['i18n']);
app.controller('newsIndexCtrl',['$scope', '$http', '$timeout',function($scope, $http, $timeout){
    $scope.loaded = true;
    $scope.allNews = false;
    $scope.noNews = false;
    $scope.historyTotal = false;
    $scope.newsTotal = false;
    $scope.type = 1;
    function loadList() {
        $http.get('/api/v1/articleList', {params: {type: $scope.type, page : 1, pageSize : 5}})
            .then(function (res) {
                if (res.data.data.length == 0) {
                    $scope.NoOrder = true;
                    $scope.NewGroup = [];
                } else {
                    $scope.allNews = res.data.data;
                    console.log($scope.allNews);
                    $scope.noNews = true;
                }
                $scope.newsTotal = true;
            })
    }
    $timeout(loadList, 100)

}]);