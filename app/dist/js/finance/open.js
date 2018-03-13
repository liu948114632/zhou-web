var app = angular.module('app',['i18n']);

app.controller('openCtrl',['$scope', '$http',function($scope, $http){
    var pageSize = 15;
    $scope.totalPage= 0;
    $scope.all_pages = [];
    $scope.currency_page = 0;
    $scope.init_load = false;


    $scope.loadList = function(page) {
        $scope.allOrders = []
        $scope.init_load = false;
        var params = {page: page, pageSize: pageSize};
        $scope.all_pages = [];
        if(!isEmpty($scope.type)){
            params['type'] = $scope.type;
        }

        $http.get('/api/v1/account/opening',{params:params})
            .then(function (res) {
                $scope.init_load = true;
                $scope.currency_page = page;
                if (res.data.data.length === 0) {
                    $scope.NoOrder = true;
                    $scope.allOrders = [];
                } else {
                    $scope.allOrders = res.data.data;
                    var all = res.data.totalCount/pageSize;
                    $scope.totalPage = all >parseInt(all)? parseInt(all) +1: parseInt(all);
                    for(var i =0; i<$scope.totalPage; i++){
                        $scope.all_pages.push(i+1);
                    }
                }
            })
    };
    $scope.loadList(1);
    var isPending = false;
    $scope.cancleEntrust = function (id) {
        confirm_win("确定撤销吗？", function(){
            var data = {id: id};
            isPending = true;
            $http.post("/api/v2/market/cancelEntrust",$.param(data),{headers :{'Content-Type' :'application/x-www-form-urlencoded' }})
                .then(function (res) {
                    isPending = false;
                    if(res.status === 200){
                        $scope.loadList(1);
                    }
                })
        })
    }


}]);
