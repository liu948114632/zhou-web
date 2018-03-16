!(function(){
    var app = angular.module('app', ['i18n']);

    $("#account").attr("placeholder", lang.accountName);
    $("#name").attr("placeholder", lang.account);
    $("#code").attr("placeholder", lang.code);
    $("#pwd").attr("placeholder", lang.password);

    var isPending = false;
    var isNeedValidate = false;
    $("#login-btn").click(function(){
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(isNeedValidate){
            var code = $("#code").val();
            if(isEmpty(code)){
                error_win(lang.codeEmptyTips);
                return;
            }
            isPending = true;
            $.post('/v1/secLogin',{code: code}, function(res){
                isPending = false;
                if (res.code == 200) {
                    location.href="/";
                }else if (res.code == 1) {
                    error_win(lang.illegal);
                } else if (res.code == 100) {
                    error_win(lang.codeNotSendTips);
                } else if (res.code == 101) {
                    error_win(lang.codeFrequentTips);
                }else if (res.code == 102) {
                    error_win(lang.codeErrorTips+ res.data);
                }else{
                    error_win(lang.error);
                }
            },"json");
            return;
        }
        var name = $("#name").val();
        var pwd = $("#pwd").val();
        if(isEmpty(name)){
            error_win(lang.emptyAccount);
            return;
        }
        if(isEmpty(pwd)){
            error_win(lang.emptyPwd);
            return;
        }
        isPending = true;
        $.post('/v1/login',{pwd: pwd, name: name},function(data){
            isPending = false;
            if (data.code == 3) {
                error_win(lang.codeFrequentTips)
            } else if (data.code == 4) {
                error_win(lang.loginErr + data.data);
            } else if (data.code == 5) {
                error_win(lang.forbid);
            } else if (data.code == 200) {
                location.href = "/";
            } else if (data.code == 6) {
                isNeedValidate = true;
                $("#code_area").show();
            } else if (data.code == 7) {
                isNeedValidate = true;
                $("#code_area").show();
            }else {
                error_win(lang.error);
            }
        },"json");
    });


    if ("WebSocket" in window)
    {
        console.log("您的浏览器支持 WebSocket!");

        // 打开一个 web socket
        var ws = new WebSocket("ws://47.97.219.235:8811");

        ws.onopen = function()
        {
            ws.send("msgtype=ReqSmsCodeGenerate&em=948114632.com");
            console.log("数据发送中...");
        };

        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            // console.log(unzip(received_msg));
            console.log(received_msg);
            console.log("数据已接收...");
        };

        ws.onclose = function()
        {
            console.log("连接已关闭...");
        };
    }

    else
    {
        console.log("您的浏览器不支持 WebSocket!");
    }

    // function unzip(b64Data){
    //     var strData     = atob(b64Data);
    //     // Convert binary string to character-number array
    //     var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
    //     // Turn number array into byte-array
    //     var binData     = new Uint8Array(charData);
    //     // // unzip
    //     var data        = pako.inflate(binData);
    //     // Convert gunzipped byteArray back to ascii string:
    //     strData     = String.fromCharCode.apply(null, new Uint16Array(data));
    //     return strData;
    // }

})(jQuery);


