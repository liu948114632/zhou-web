var app = angular.module('app',['i18n']);

app.controller('billCtrl',['$scope', '$http', '$location',function($scope, $http, $location){
    var pageSize = 15;
    $scope.totalPage= 0;
    $scope.all_pages = [];
    $scope.init_load = false;
    $scope.currency_page = 0;

    $http.get("/api/v1/coins").then(function (res) {
        $scope.coins = res.data.data;
        if($scope.coins.length > 0){
            $scope.coin = $scope.coins[0];
        }
        for(var i =0;i<$scope.coins.length;i++){
            $scope.coins[i].group = $scope.coins[i].name + "/" + $scope.coins[i].key;

        }
        $scope.nowGroup = $scope.coins[0].group
        $scope.loadList(1);
    });


    $scope.loadList = function(page) {
        $scope.allOrders = []
        $scope.init_load = false;
        var params = {id: $scope.coin.id, page: page, pageSize: pageSize};
        $scope.all_pages = [];
        if(!isEmpty($scope.type)){
            params['type'] = $scope.type;
        }
        if(!isEmpty($scope.status)){
            params['status'] = $scope.status;
        }
        $http.get('/api/v1/account/history',{params:params})
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
                    $scope.nowGroup = $scope.coin.group;
                }
            })
    };
    
    $scope.cancleEntrust = function (id) {
        confirm_win("确定撤销吗？", function(){
            var data = {id: id};
            $http.post("/api/v2/market/cancelEntrust",$.param(data),{headers :{'Content-Type' :'application/x-www-form-urlencoded' }})
                .then(function (res) {
                    if(res.status === 200){
                        $scope.loadList(1);
                    }
                })
        })}
}]);
