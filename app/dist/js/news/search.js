var app = angular.module('app',['i18n']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('searchCtrl',['$scope', '$http', '$location',function($scope, $http, $location){
    $scope.currency_page = 1;
    $scope.totalPage= 1;
    $scope.all_pages = [];
    $scope.loadList= function(page) {
        var language = $.cookie("lang");
        $scope.keyWord = $location.search().keyWord;
        page = page > $scope.totalPage? $scope.totalPage : page;
        $http.get('/api/v1/result?keyword='+$scope.keyWord+'&currentPage='+page)
            .then(function (res) {
                $scope.currency_page = page;
                $scope.total = res.data.total;
                $scope.list = res.data.items;
                $scope.farticletypes = res.data.farticletypes;
                $scope.pageSize = res.data.pageSize;
                if($scope.total > 0){
                    var all = $scope.total/$scope.pageSize;
                    $scope.totalPage = all >parseInt(all)? parseInt(all) +1: parseInt(all);
                    for(var j =0; j<$scope.totalPage; j++){
                        $scope.all_pages.push(j+1);
                    }
                    for (var i = 0;i<$scope.list.length;i++){
                        var index =-1;
                        if(language == 'cn'){
                            index = ($scope.list[i].content).indexOf($scope.keyWord.trim());
                            $scope.list[i].hasContent = false;
                            $scope.list[i].showTitle = $scope.list[i].title;
                            if(index >=0){
                                $scope.list[i].hasContent = true;
                                $scope.list[i].showContent = ($scope.list[i].content).substr(index+$scope.keyWord.length,200);
                            }
                        }else {
                            index = ($scope.list[i].enContent).indexOf($scope.keyWord.trim());
                            $scope.list[i].hasContent = false;
                            $scope.list[i].showTitle = $scope.list[i].enTitle;
                            if(index >=0){
                                $scope.list[i].hasContent = true;
                                $scope.list[i].showContent = ($scope.list[i].enContent).substr(index+$scope.keyWord.length,200);
                            }
                        }

                    }
                }
            })
    }
    $scope.loadList(1);

}]);