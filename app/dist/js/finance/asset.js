var app = angular.module('app', ['i18n']);
app.controller('assetController', ['$scope', '$http', '$location', '$interval',  function ($scope, $http, $location, $interval) {
    $scope.balances= [];
    $scope.init_load= false;
    $scope.balancesTemp= [];
    function loadBalances() {
        $http.get(basePath + '/v1/account/balances')
            .then(function(res){
                  $scope.init_load = true;
                  $scope.balances = res.data.data;
                  $scope.balancesTemp = res.data.data;
            })
    }
    loadBalances();
    $scope.search = function ($event) {
        var content = $($($event.target)).val();
        if(content == ""){
            $scope.balances = $scope.balancesTemp;
            return;
        }
        var arr = $scope.balancesTemp;
        var temparr = [];
        for(var i = 0; i < arr.length; i++){
            var name = arr[i].name;
            var allName = arr[i].allName;
            if(name.toUpperCase().indexOf(content.toUpperCase()) > -1 || allName.toUpperCase().indexOf(content.toUpperCase()) > -1){
                temparr.push(arr[i]);
            }
        }
        $scope.balances = temparr;
    }
    $scope.hideAccount = false;
    $scope.func = function (e) {
        if($scope.hideAccount){
            return e.total >0.000001;
        }else {
            return e.total >=0;
        }
    }
    function getCoins() {
        $http.get(basePath+'/v2/market/allcoins')
            .then(function(res){
                    $scope.allCoins = res.data
                }
            )
    }
    getCoins();
    
    $scope.goExchange = function (coinName) {
        var coins =  $scope.allCoins;
        for(var i=0;i<coins.length;i++){
            if(coinName == coins[i].fShortName){
                window.location.href = "/exchange#symbol="+coins[i].fid;
            }
        }
        window.location.href = "/exchange#symbol=11";
    }

}]);