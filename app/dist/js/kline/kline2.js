!function(){
    var app = angular.module('app', [])

    app.filter('html', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])

    app.filter('fixed', function(){
        //制保留N位小数，如：2，会在2后面补上00.即2.00
        function toDecimal2(x, pos) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(x * Math.pow(10, pos)) / Math.pow(10, pos);
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + pos) {
                s += '0';
            }
            return s;
        }

        return function(num, dec){
            return toDecimal2(num, dec || 2);
        }
    })

    app.filter('gg', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text.replace('.','<g>.') + '</g>');
        };
    }])

    app.controller('KlineCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval){

        $scope.depth = {
            asks: [],
            bids: [],
            tradeLogs: []
        }

        function getDepth() {
            var symbol = kline.symbol;
            var url = DOMAIN_TRANS + "/api/v2/market/marketRefresh?symbol=" + symbol + "&&depth=4";
            $http.get(url).then(function(res){
                $scope.depth = {
                    asks: res.data.sellDepthList.reverse(),
                    bids: res.data.buyDepthList,
                    tradeLogs: res.data.recentDealList
                }
                updateDepth()
            })
        }

        getDepth()

        function updateDepth() {
            _set_current_depth({
                bids: $scope.depth.bids,
                asks: $scope.depth.asks,
            })
        }

        $scope.setBuy = function(sell) {
            parent.setBuy && parent.setBuy(sell)
        }

        $scope.setSell = function(buy) {
            parent.setSell && parent.setSell(buy)
        }

        window.updateMarket = function(data) {
            // console.log('update data', data);
            if (data.buyDepthList) {
                $scope.depth.bids = data.buyDepthList
            } else if (data.sellDepthList) {
                $scope.depth.asks = data.sellDepthList
            } else if (data.recentDealList) {
                $scope.depth.tradeLogs = data.recentDealList
            }
            updateDepth()
            $scope.$apply()
        }

        $scope.tradeName = getQueryString('name');
        



    }])

    

}()