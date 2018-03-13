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
    $scope.wallet = {
        frozen:0,
        total:0
    };
    $scope.shortname = "--"
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
        $scope.id = wallet.id;
        $(".scrollStyle").hide();
        $scope.shortname = wallet.name;
        getAddressByCoin();
        getParamsByCoin();
        $scope.loadList(1);
    }
    $scope.showAssetss = function () {
        $(".scrollStyle").toggle();
    }

    loadBalances();

    var pageSize = 8;
    $scope.totalPage= 0;
    $scope.all_pages = [];
    $scope.currency_page = 1;

    $scope.loadList = function(page) {
        if($scope.totalPage != 0 && $scope.totalPage != 1){
            page = page>$scope.totalPage? $scope.totalPage : page;
        }

        $scope.all_pages = [];
        $http.get(basePath+'/v1/account/coinOut?symbol='+$scope.id+"&page="+page+"&pageSize="+pageSize)
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
    $scope.addNewAddress = function ($event) {
        $("#addresses").hide();
        center_box("float_win");
        $("#shadow, #float_win").show();
    }
    $scope.showaddresses = function () {
        $("#addresses").toggle();
    }
    $scope.confrmAddNewAddress = function () {
        if(isPending){
            error_win(lang.pending);
            return;
        }
        var address = $scope.address;
        var addresstag = $scope.addresstag;
        var emailcode = $scope.emailcode;
        if(isEmpty(address)){
            error_win(lang.noempty);
            return;
        }
        if(isEmpty(addresstag)){
            error_win(lang.noempty);
            return;
        }
        if(isEmpty(emailcode)){
            error_win(lang.noempty);
            return;
        }

        var data = {
            address:address,
            flag:addresstag,
            id:$scope.id,
            code:emailcode
        }
        isPending = true;
        $http.post(basePath+"/v1/account/addAddress",$.param(data), {headers :{'Content-Type' :'application/x-www-form-urlencoded' }})
            .then(function(res){
                isPending = false;
                var data = res.data
                if(res.data.code == 200){
                    success_win(lang.operationSuccess);
                }else if (data.code == 100) {
                    error_win(lang.codeNotSendTips);
                }  else if (data.code == 101) {
                    error_win(lang.codeFrequentTips);
                }else if (data.code == 102) {
                    error_win(lang.codeErrorTips+data.data);
                }else {
                    error_win(lang.error);
                }
            })
    }

    function getAddressByCoin() {
        $http.get(basePath + '/v1/account/getAddressByCoin?id='+$scope.id)
            .then(function(res){
                $scope.addresses = res.data.data;
            })
    }

    $scope.selectAddress = function (row) {
        $scope.withdrawAddress = row.address;
        $("#addresses").toggle();
    }

    function getParamsByCoin() {
        $http.get(basePath + '/v1/account/getParamsByCoin?id='+$scope.id)
            .then(function(res){
                var param = res.data.data;
                $scope.wallet.total = param.total;
                $scope.wallet.frozen = param.frozen;
                $scope.params = param;
            })
    }
    $scope.calcTotal = function () {
        var amount = $("#amount").val().replace(/(^\s+)|(\s+$)/g, "");
        if(!isNumber(amount) || amount >1000000000){
            return;
        }
        $scope.realAmount = amount - (amount * $scope.params.feeRatio) - $scope.params.feeAmount;
    }
    $scope.withdrawAll = function () {
        $("#amount").val($scope.params.total);
        $scope.realAmount = $scope.params.total - ( $scope.params.total * $scope.params.feeRatio) - $scope.params.feeAmount;
    }

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