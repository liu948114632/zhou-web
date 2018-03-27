var app = angular.module('app', ['i18n']);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller('payoutController', ['$scope', '$http', '$location', '$interval',  function ($scope, $http, $location, $interval) {
    $scope.id = $location.search().id;
    $scope.userAssets= [];
    $scope.balancesTemp= [];
    $scope.ischarge = false;
    $scope.params = {
        feeAmount:0,
        feeRatio:0,
        min:0,
        total:0
    };
    $scope.realAmount = 0;
    function getAsset() {
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryTradingAccount&cid="+$scope.id +"&UserID=111@qq.com"+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, "123123");
        var sign = hash.toString();
        $http({
            method:"POST",
            url:"/api/v1",
            data:val+"&Sign="+sign,
            responseType :'arraybuffer',
        }).then(function (res) {
            $scope.wallet = JSON.parse(toGbk(res.data));
        })
    }
    getAsset();

    var isPending = false;
    $scope.bindWithdraw = function () {
        if(isPending){
            error_win(lang.pending);
            return;
        }
        var address = $scope.withdrawAddress;
        var amount = $scope.amount;
        var code = $scope.emailCode2;
        var safeWord = $scope.safeWord;
        if(isEmpty(address)){
            error_win(lang.js.payout.addressEmptyTips);
            return;
        }
        if(isEmpty(amount) || !isNumber(amount) || amount <= 0){
            error_win(lang.js.payout.amountEmptyTips);
            return;
        }
        amount = amount * 1.0;
        var max = $scope.params.max * 1.0;
        var min = $scope.params.min * 1.0;
        if(max != 0 && amount > $scope.params.total){
            error_win(lang.js.payout.fundsTips);
            return;
        }
        if(min != 0 && amount < min){
            error_win(lang.js.payout.minTips + min);
            return;
        }
        if(isEmpty(safeWord)){
            error_win(lang.safeEmptyTips);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        if($("#googlecode").length > 0 && isEmpty($scope.googlecode)){
            error_win(lang.goo.tip4);
            return;
        }
        isPending = true;
        $.post('/v1/account/withdrawCoin',{ googleCode:$scope.googlecode, code: code, address: address, amount:amount, id: $scope.id, safeWord:safeWord },function(data){
            isPending = false;
            if (data.code == 1) {
                error_win(lang.js.payout.authTips,function(){
                    location.href="/account/auth-deep";
                });
            }else if (data.code == 2) {
                error_win(lang.js.payout.minTips +data.data);
            } else if (data.code == 3) {
                error_win(lang.js.payout.maxTips+data.data);
            } else if (data.code == 4) {
                error_win(lang.js.payout.forbidTips);
            } else if (data.code == 5){
                error_win(lang.js.payout.fundsTips);
            } else if (data.code == 6) {
                error_win(lang.js.payout.feesTips);
            } else if (data.code == 7) {
                error_win(lang.js.payout.timesTips);
            } else if (data.code == 8) {
                error_win(lang.js.payout.safeNoneTips,function(){
                    location.href="/account/safeword";
                });
            } else if (data.code == 9) {
                error_win(lang.js.payout.safeErrorTips);
            }else if (data.code == 10) {
                error_win(lang.goo.tip6);
            }  else if (data.code == 100) {
                error_win(lang.codeNotSendTips);
            }  else if (data.code == 101) {
                error_win(lang.codeFrequentTips);
            }else if (data.code == 102) {
                error_win(lang.codeErrorTips+data.data);
            }else if (data.code == 200) {
                success_win(lang.operationSuccess);
            } else {
                error_win(lang.error);
            }
        },"json");
    }
}]);