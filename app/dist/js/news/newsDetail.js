var app = angular.module('app',['i18n']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('newsDetailCtrl',['$scope', '$http', '$location',function($scope, $http, $location){
    function loadList() {
        $scope.id = $location.search().id;
        $http.get('/api/v1/articleDetail?id='+$scope.id)
            .then(function (res) {
                $scope.detail = res.data.data.content;
                $scope.items = res.data.data.items;
                // console.log(res.data.data);
                $scope.title = lang.newss.help;
                if($scope.detail.type == 1){
                    $scope.title = lang.newss.announce;
                }
            })
    }
    loadList();

}]);