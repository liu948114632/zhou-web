var app = angular.module('app',['i18n']);
app.controller('supportIndexCtrl',['$scope', '$http', '$timeout',function($scope, $http){

    $scope.showTip = false;
    $scope.showTip2 = false;
    $scope.submit = function () {
        if( $scope.email === undefined || $scope.title === undefined || $scope.content === undefined || $scope.askType === undefined){
            $scope.showTip =true;
        }else {
            if($scope.askType !=3 && ($scope.address === undefined || $scope.coinName === undefined)){
                $scope.showTip =true;
            }else {
                let data = {
                    email : $scope.email,
                    address : $scope.address,
                    txid : $scope.txid,
                    content : $scope.content,
                    coinName : $scope.coinName,
                    askType : $scope.askType,
                    title : $scope.title,
                };
                $http.post("/api/v1/account/submitAsk",$.param(data), {headers :{'Content-Type' :'application/x-www-form-urlencoded' }})
                    .then(res=>{
                        if(res.data.code === -1){
                            $scope.showTip =true;
                            return;
                        }
                        if(res.data.code === -2){
                            $scope.showTip2 =true;
                        }else {
                            location.href ="/support/mine";
                        }
                    })
            }
        }
    };
    $scope.change = function () {
        $scope.showTip = false;
        $scope.showTi2 = false;
        $scope.email = '';
        $scope.txid = '';
        $scope.content = '';
        $scope.coinName = '';
        $scope.title = '';
        $scope.coinName = '';
    };


}]);