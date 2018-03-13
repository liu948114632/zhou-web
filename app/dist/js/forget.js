!(function(){
    var app = angular.module('app', ['i18n']);
    $("#name").attr("placeholder", lang.account);
    $("#code").attr("placeholder", lang.code);
    $("#pwd").attr("placeholder", lang.setPwd);
    $("#confirmPwd").attr("placeholder", lang.rePwd);

    var isPending = false;
    $("#forgotPwd-btn").click(function(){
        if(isPending){
            error_win(lang.pending);
            return;
        }
        var name = $("#name").val();
        var pwd = $("#pwd").val();
        var confirmPwd = $("#confirmPwd").val();
        var code = $("#code").val();
        var pwdLevel = $("#pwdLevel").val() * 1;
        if(isEmpty(name)){
            error_win(lang.emptyAccount);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        if(isEmpty(pwd)){
            error_win(lang.emptyPwd);
            return;
        }
        if(pwdLevel < 40){
            error_win(lang.pwd1);
            return;
        }
        if(confirmPwd != pwd){
            error_win(lang.noSamePwd);
            return;
        }
        isPending = true;
        $.post('/v1/findPwd',{pwd: pwd, name: name, code: code},function(data){
            isPending = false;
            if (data.code == 4) {
                error_win(lang.noUse)
            } else if (data.code == 200) {
                success_win(lang.reset ,function(){
                    location.href = "/user/login";
                },function(){
                    location.href="/";
                });
            } else if (data.code == 100) {
                error_win(lang.codeNotSendTips);
            }  else if (data.code == 101) {
                error_win(lang.codeFrequentTips);
            }else if (data.code == 102) {
                error_win(lang.codeErrorTips+data.data);
            } else {
                error_win(lang.error);
            }
        },"json");
    });
    $("input[name=password]").on({
        focus: function () {
            $("#pwdStrength").fadeIn()
        }, keyup: function () {
            checkPwdStrength($(this).val())
        }, blur: function () {
            checkPwdStrength($(this).val());
            if ($("#pwdLevel").val() > 20) {
                $("#pwdStrength").fadeOut()
            }
        }, change: function () {
            checkPwdStrength($(this).val())
        }
    });
})(jQuery);
