var app = angular.module('app',['i18n']);
app.controller('supportMineCtrl',['$scope', '$http', '$timeout',function($scope, $http){


    var pageSize = 15;
    $scope.totalPage= 1;
    $scope.all_pages = [];
    $scope.currency_page = 0;

    $scope.loadList = function(page) {
        page = page>$scope.totalPage ? $scope.totalPage:page;
        $scope.all_pages = [];
        $http.get("/api/v1/account/getAsks?page="+page+"&pageSize="+pageSize)
            .then(function (res) {
                $scope.currency_page = page;
                if (res.data.data.length === 0) {
                    $scope.NoOrder = true;
                    $scope.NewGroup = [];
                } else {
                    $scope.asks = res.data.data;
                    console.log($scope.asks)
                    var all = res.data.totalCount/pageSize;
                    $scope.totalPage = all >parseInt(all)? parseInt(all) +1: parseInt(all);
                    for(var i =0; i<$scope.totalPage; i++){
                        $scope.all_pages.push(i+1);
                    }
                }
            })
    }
    $scope.loadList(1);

    $scope.deleteAsk =  function (id) {
        $http.get("/api/v1/account/deleteAsk?id="+id).then(()=>{
            $scope.loadList(1);
        })
    };
    $scope.current= -1;
    $scope.detail = function(id){
        if($scope.current === id){
            $scope.current= -1;
        }else {
            $scope.current = id;
        }
    }

}]);