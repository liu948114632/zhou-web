var app = angular.module('app',['i18n']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('allCtrl',['$scope', '$http', '$location',function($scope, $http, $location){
    var pageSize = 15;
    $scope.totalPage= 0;
    $scope.all_pages = [];
    $scope.currency_page = 0;

    $scope.loadList = function(page) {
        $scope.all_pages = [];
        $scope.type = $location.search().type;
        $scope.title = lang.newss.help;
        if($scope.type == 1){
            $scope.title = lang.newss.announce;
        }
        $http.get('/api/v1/articleList?type='+$scope.type+"&page="+page+"&pageSize="+pageSize)
            .then(function (res) {
                $scope.currency_page = page;
                if (res.data.data.length === 0) {
                    $scope.NoOrder = true;
                    $scope.NewGroup = [];
                } else {
                    $scope.allNews = res.data.data;
                    var all = res.data.totalCount/pageSize;
                    $scope.totalPage = all >parseInt(all)? parseInt(all) +1: parseInt(all);
                    for(var i =0; i<$scope.totalPage; i++){
                        $scope.all_pages.push(i+1);
                    }
                }
            })
    }
    $scope.loadList(1);

}]);