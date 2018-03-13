!(function(){
    var app = angular.module('app', ['i18n']);

    $("#inviteCode").attr("placeholder", lang.inviteCode).val($.cookie("intro") ? $.cookie("intro"):"");
    $("#name").attr("placeholder", lang.email);
    $("#code").attr("placeholder", lang.code);
    $("#pwd").attr("placeholder", lang.setPwd);
    $("#confirmPwd").attr("placeholder", lang.rePwd);
    $("#imgCode").attr("placeholder", lang.imageCode);

    $("input[name=password]").on({
        focus: function () {
            $("#pwdStrength").fadeIn()
        }, blur: function () {
            newcheckpwd($(this).val());
        }
    });

    $("#confirmPwd").on({
         blur: function () {
            var confirmPwd = $("#confirmPwd").val();
            var pwd = $("#pwd").val();
            if(confirmPwd !=pwd){
                error_win(lang.noSamePwd);
                return;
            }
        }
    });

    function newcheckpwd(pwd) {
        var level = getPwdStrength(pwd);
        if (level < 2) {
            error_win(lang.pwd.level1)
            return;
        }
        $("#pwdStrength").fadeOut();
    }

    var pending = false;
    $("#register-btn").click(function(){
        var name = $("#name").val().trim();
        var pwd = $("#pwd").val().trim();
        var code = $("#code").val().trim();
        var confirmPwd = $("#confirmPwd").val().trim();
        var pwdLevel = $("#pwdLevel").val() * 1;
        if($("#inviteCode").length > 0){
            var inviteCode = $("#inviteCode").val().trim();
        }else{
            var inviteCode = "";
        }
        var agreement = $("#agreement");
        if(pending){
            error_win(lang.pending);
            return;
        }
        if(isEmpty(name)){
            error_win(lang.emptyAccount);
            return;
        }
        if(!isEmail(name)){
            error_win(lang.emailFormatError);
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
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        if(!isEmpty(inviteCode) && !intCheck(inviteCode)){
            error_win(lang.inviteCodeTips);
            return;
        }
        if(!agreement.prop('checked')){
            error_win(lang.agree);
            return;
        }
        var param = {
            name: name,
            pwd: pwd,
            code: code
        };
        if(!isEmpty(inviteCode)){
            param['inviteCode'] = inviteCode;
        }
        pending = true;
        $.post('/v1/register', param, function(data){
            pending = false;
            if (data.code == 2) {
                error_win(lang.binded);
            } else if (data.code == 200) {
                success_win(lang.operationSuccess, function(){
                    location.href = "/account/auth";
                });
            } else if (data.code == 100) {
                error_win(lang.codeNotSendTips);
            }  else if (data.code == 101) {
                error_win(lang.codeFrequentTips);
            }else if (data.code == 102) {
                error_win(lang.codeErrorTips+data.data);
            }else {
                error_win(lang.error);
            }
        },"json");
    });
})(jQuery);