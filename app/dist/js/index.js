var app = angular.module('app', ['i18n']);
app.controller('indexController', ['$scope', '$http', '$interval',  function ($scope, $http,  $interval) {
    $scope.markets= {};
    $scope.groups = [];
    $scope.selectedMarket= "btc";
    $scope.orderKey = '';
    $scope.orderDesc = false;
    function loadMarkets() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryDepthMarketData&UserID=123"+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, "123");
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer'
        }).then(function (res) {
            var result = JSON.parse(toGbk(res.data));
            for(var i =0;i<result.length;i++){
                var group = result[i].iid.split('_')[1];
                var sp = result[i].pcp ? result[i].pcp : result[i].op;
                result[i].up = (result[i].lsp  - sp)/sp *100 ;
                result[i].key = result[i].iid.replace('_','/');
                if( !isEmpty($scope.markets[group]) ){
                    deleteArray($scope.markets[group],result[i].iid);
                    $scope.markets[group].push(result[i]);
                }else {
                    $scope.markets[group]= [];
                    $scope.markets[group].push(result[i]);
                    $scope.groups.push(group);
                }
            }

        })
    }
    loadMarkets();
    $scope.setMarket = function (group) {
        $scope.selectedMarket= group;
    };
    $scope.trade = function(id){
        location.href= "/exchange#symbol=" + id;
    };

    $scope.search = function(res){
        if(isEmpty($scope.keyword)){
            return res;
        }else {
            var key = res.key.split("/")[0];
            if(key.toUpperCase().indexOf($scope.keyword.toUpperCase()) > -1){
                return res;
            }
        }
    };
    $scope.trade = function(iid){
        location.href = "/exchange#symbol="+iid;
    };
    $scope.orderByClick = function(key){
        $scope.orderKey = key;
        $scope.orderDesc = !$scope.orderDesc;
    };

    $interval(function () {
        loadMarkets();
    },5000);

    //删除数组中元素
    function deleteArray(arr,iid) {
        for (var i = 0; i < arr.length; i++){
            if(arr[i].iid == iid ){
                arr.splice(i,1);
                break;
            }
        }
    }
}])