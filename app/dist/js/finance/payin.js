var app = angular.module('app', ['i18n']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('payinController', ['$scope', '$http', '$location', '$interval',  function ($scope, $http, $location, $interval) {
    $scope.id = $location.search().id;
    $scope.userAssets= [];
    $scope.balancesTemp= [];
    $scope.ischarge = false;
    $scope.wallet = {
        frozen: 0,
        total: 0
    }
    function loadBalances() {
        $http.get(basePath + '/v1/account/balances')
            .then(function(res){
                $scope.userAssets = res.data.data;
                $scope.balancesTemp = res.data.data;
                var arr = $scope.userAssets;
                if(typeof($scope.id) != "undefined"){
                    for(var i=0; i< arr.length; i++){
                        if(arr[i].id == $scope.id){
                            $scope.selectAsset(arr[i]);
                        }
                    }
                }else {
                    $scope.selectAsset(arr[0]);
                }
            })
    }
    $scope.search = function ($event) {
        var content = $($($event.target)).val();
        if(content == ""){
            $scope.userAssets = $scope.balancesTemp;
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
        $scope.userAssets = temparr;
    }
    $scope.selectAsset = function (wallet) {
        $scope.wallet = wallet;
        $(".scrollStyle").hide();
        getCoinAddress(wallet.id,wallet.name);
    }
    $scope.showAssets = function () {
        $(".scrollStyle").toggle();
    }
    function getCoinAddress(symbol,shortname) {
        $scope.id = symbol;
        $http.get(basePath+'/v1/account/getCoinAddress?create=1&symbol='+symbol)
            .then(function(res){
                $scope.shortname = shortname;
                $scope.address = res.data.data;
                $scope.ischarge = true;
                if(res.data.code == 200 && $scope.address != ""){
                    makeCode("addressQrcode",$scope.address,100,100);
                }
            })
        $scope.totalPage= 0;
        $scope.all_pages = [];
        $scope.currency_page = 1;
        $scope.loadList(1);
    }
    loadBalances();


    function makeCode (boxId,content,width,height) {
        $("#addressQrcode").html("");
        new QRCode(document.getElementById(""+boxId), {
            width : width,
            height : height
        }).makeCode(content);
    }
    $scope.copyAddress = function (textAreaId,msgDiv) {
        var input = document.getElementById(""+textAreaId);
        input.value = $scope.address;
        input.select();
        document.execCommand("copy");
        $("#"+msgDiv).show();
        setTimeout(function () {
            $("#"+msgDiv).hide();
        },2000);
    }

    var pageSize = 8;
    $scope.totalPage= 0;
    $scope.all_pages = [];
    $scope.currency_page = 1;

    $scope.loadList = function(page) {
        if($scope.totalPage != 0 && $scope.totalPage != 1){
            page = page>$scope.totalPage? $scope.totalPage : page;
        }

        $scope.all_pages = [];
        $http.get(basePath+'/v1/account/coinIn?symbol='+$scope.id+"&page="+page+"&pageSize="+pageSize)
            .then(function (res) {
                $scope.rechargeLogs = res.data.data;
                $scope.currency_page = page;
                if (res.data.data.length === 0) {
                    $scope.NoOrder = true;
                    $scope.NewGroup = [];
                } else {
                    var all = res.data.totalCount/pageSize;
                    $scope.totalPage = all >parseInt(all)? parseInt(all) +1: parseInt(all);
                    for(var i =0; i<$scope.totalPage; i++){
                        $scope.all_pages.push(i+1);
                    }
                }
            })
    }
}]);