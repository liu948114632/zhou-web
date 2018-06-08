var app = angular.module('app', ['i18n']);
app.controller('indexController', ['$scope', '$http', '$interval',  function ($scope, $http,  $interval) {
    $scope.markets= {};
    $scope.groups = [];
    $scope.selfTickers = [];
    $scope.selectedMarket= "btc";
    $scope.orderKey = '';
    $scope.orderDesc = false;
    $scope.tickers = [];
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
            $scope.tickers = [];
            var result = JSON.parse(toGbk(res.data));
            if(! (result instanceof Array)){
                result = new Array(result);
            }
            var self = getCookie('user_self_token');
            for(var i =0;i<result.length;i++){
                if(self.indexOf(result[i].iid)>-1){
                    result[i].self = 1;
                }
                var group = result[i].iid.split('_')[1];
                var sp = result[i].pcp ? result[i].pcp : result[i].op;
                result[i].up = (result[i].lsp  - sp)/sp *100 ;
                result[i].key = result[i].iid.replace('_','/');
                result[i].lp = scientificToNumber(result[i].lp);
                result[i].lsp = scientificToNumber(result[i].lsp);
                result[i].hp = scientificToNumber(result[i].hp);
                $scope.tickers.push(result[i]);
                if( !isEmpty($scope.markets[group]) ){
                    deleteArray($scope.markets[group],result[i].iid);
                    $scope.markets[group].push(result[i]);
                }else {
                    $scope.markets[group]= [];
                    $scope.markets[group].push(result[i]);
                    $scope.groups.push(group);
                }
            }
            initSelfTickers();

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


    $scope.selfSelect = function (fid) {
        var self = getCookie('user_self_token');
        if (typeof self != 'undefined' && self != '') {
            var arr = self.split(',');
            var length = arr.length;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == fid) {
                    arr.splice(i, 1);
                }
            }
            if (length == arr.length) {
                arr.push(fid);
            }
            setCookie('user_self_token', arr.join(','), 30);
        } else {
            setCookie('user_self_token', fid, 30);
        }
        var temp = $scope.selfTickers;
        var tempLength = temp.length;
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].iid == fid) {
                temp.splice(i, 1);
            }
        }
        if (tempLength == temp.length) {
            var temp2 = $scope.tickers;
            for (var i = 0; i < temp2.length; i++) {
                if (temp2[i].iid == fid) {
                    temp2[i].self = 1;
                    temp.push(temp2[i]);
                    return;
                }
            }
        }

        if (tempLength > temp.length) {
            var temp3 = $scope.tickers;
            for (var i = 0; i < temp3.length; i++) {
                if (temp3[i].iid == fid) {
                    temp3[i].self = 0;
                    return;
                }
            }
        }
    };
    $scope.setMarketBySelf = function ($event) {
        $($($event.target))
            .addClass('active')
            .siblings()
            .removeClass('active');
        $scope.tickers = $scope.selfTickers;
        $scope.tickersTemp = $scope.selfTickers;
    };

    function initSelfTickers() {
        var self = getCookie('user_self_token');
        if ($scope.group.length > 0) {
            var temp = $scope.group;
            for (var i = 0; i < temp.length; i++) {
                var list = $scope.markets[$scope.group[i]];
                for (var k = 0; k < list.length; k++) {
                    list[k].self = 0;
                    if (typeof self != 'undefined' && self != '') {
                        var arr = self.split(',');
                        for (var j = 0; j < arr.length; j++) {
                            if (arr[j] == list[k].iid) {
                                list[k].self = 1;
                                $scope.selfTickers.push(list[k]);
                            }
                        }
                    }
                }
            }
        }
    }

    function initSelfTickersOnly() {
        var self = getCookie('user_self_token');
        var list = $scope.tickers;
        for (var k = 0; k < list.length; k++) {
            list[k].self = 0;
            if (typeof self != 'undefined' && self != '') {
                var arr = self.split(',');
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == list[k].iid) {
                        list[k].self = 1;
                    }
                }
            }
        }
    }

    //Cookie存储token
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + '=');
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(';', c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return document.cookie.substring(c_start, c_end);
            }
        }
        return '';
    }
    function setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie =
            c_name +
            '=' +
            value +
            (expiredays == null ? '' : '; expires=' + exdate.toGMTString());
    }

}])