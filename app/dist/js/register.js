var app = angular.module('app', ['i18n']);
app.controller('registerCtrl',function ($scope,$interval) {
    var send = lang.send;
    $scope.tip = lang.send;
    $scope.host = location.host;
    // var ws = new WebSocket(wsHost);
    var ws = new WebSocket("ws://47.97.219.235:8811");
    ws.onopen = function() {
    };
    ws.onmessage = function(event){
        var fr = new FileReader();
        fr.onload = function() {
            var result = JSON.parse(this.result);
            console.log(result);
            if(result.msgtype == "RspSmsCodeGenerate"){
                if(result.em == "正确"){
                    $scope.tip = 60;
                    $interval(function () {
                        if($scope.tip > 0){
                            $scope.tip = $scope.tip -1;
                        }else {
                            $scope.tip  =  send;
                            return;
                        }
                    },1000)
                }else {
                    error_win(result.em);
                }
            }
            if(result.msgtype == "RspInvestorRegister"){
               if(result.em == "正确"){
                   success_win("注册成功",function () {
                       location.href = '/user/login';
                   })
               }else {
                   error_win("注册失败，"+result.em);
               }
            }
        };
        fr.readAsText(event.data,'gbk');
    };
    ws.onclose = function() {
        console.log("连接已关闭...");
    };

    $scope.sendCode = function () {
        if(isEmpty($scope.name)){
            error_win("邮箱或手机号不能为空");
            return;
        }
        if(!isEmail($scope.name)){
            error_win(lang.emailFormatError);
            return;
        }
        ws.send("msgtype=ReqSmsCodeGenerate&em="+$scope.name);
    };

    $scope.register = function(){
        if(isEmpty($scope.password) ){
            error_win("登录密码不能为空");
            return;
        }
        if(isEmpty($scope.name) ){
            error_win("邮箱或手机号不能为空");
            return;
        }
        if(isEmpty($scope.code) ){
            error_win("验证码不能为空");
            return;
        }
        if($scope.password != $scope.confirmPwd){
            error_win("两次密码不一样");
            return;
        }
        ws.send("msgtype=ReqInvestorRegister&em="+$scope.name+"&p="+$scope.password+"&sc="+$scope.code);
    };
    $interval(function () {
        ws.send("msgtype=HeartBeat");
    },30000);


});

