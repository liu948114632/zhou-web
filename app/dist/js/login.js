var app = angular.module('app', ['i18n']);
app.controller('loginCtrl',function ($scope,$http) {
    $scope.login = function () {
        if(isEmpty($scope.name) || isEmpty($scope.password)){
            error_win("参数不能为空");
            return;
        }
        var time =  (new Date()).valueOf();
        var val = "msgtype=ReqQryTradingAccount&at=4&UserID="+$scope.name+"&TimeStamp="+time;
        var hash = CryptoJS.HmacSHA256(val, $scope.password);
        var sign = hash.toString();
        //msgtype=ReqQryTradingAccount&cid=BTC&at=4&UserID=00001&TimeStamp=2112345678000&Sign=abce123435231543fdgfdgergerwgrtey34534tregfdbfdbfdvsdgvasdgv4567
        // var data = {
        $http.post("/api/v1",val+"&Sign="+sign)
            .then(function (res) {
                // var data = unzip(res);
                console.log(res.data);
                // console.log(JSON.parse(res.data));
            });

        $.post("/api/v1",val+"&Sign="+sign,function (res) {
            console.log(res)
        })
    }

    var xmlHttpRequest;
//XmlHttpRequest对象
    function createXmlHttpRequest(){
        if(window.ActiveXObject){ //如果是IE浏览器
            return new ActiveXObject("Microsoft.XMLHTTP");
        }else if(window.XMLHttpRequest){ //非IE浏览器
            return new XMLHttpRequest();
        }
    }

    // $scope.login = function(){
    //     if(isEmpty($scope.name) || isEmpty($scope.password)){
    //         error_win("参数不能为空");
    //         return;
    //     }
    //
    //     var time =  (new Date()).valueOf();
    //     var val = "msgtype=ReqQryTradingAccount&at=4&UserID="+$scope.name+"&TimeStamp="+time;
    //     var hash = CryptoJS.HmacSHA256(val, $scope.password);
    //     var sign = hash.toString();
    //
    //     //1.创建XMLHttpRequest组建
    //     xmlHttpRequest = createXmlHttpRequest();
    //
    //     //2.设置回调函数
    //     xmlHttpRequest.onreadystatechange = zswFun;
    //     xmlHttpRequest.withCredentials = true;
    //
    //
    //     //3.初始化XMLHttpRequest组建
    //     xmlHttpRequest.open("POST","http://47.97.219.235:8814/api/v1?"+val+"&Sign="+sign,true);
    //     // xmlHttpRequest.setRequestHeader("User-Agent","headertest");
    //     xmlHttpRequest.setRequestHeader('Content-Type' ,'application/x-www-form-urlencoded');
    //
    //     //4.发送请求
    //     xmlHttpRequest.send(null);
    // }


//回调函数
    function zswFun(){
        if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){
            var b = xmlHttpRequest.response;
            console.log(b);
            console.log(unzip(b));
        }
    }


    function unzip(b64Data) {
        var strData     = atob(b64Data);
        // Convert binary string to character-number array
        var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
        // Turn number array into byte-array
        var binData     = new Uint8Array(charData);
        // // unzip
        var data        = pako.inflate(binData);
        // Convert gunzipped byteArray back to ascii string:
        strData     = String.fromCharCode.apply(null, new Uint16Array(data));
        return strData;
    }

})



