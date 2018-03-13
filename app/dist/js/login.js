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
})(jQuery);
