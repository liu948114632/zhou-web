!(function(){
    var app = angular.module('app', ['i18n']);

    window.sessionCallback = function(res){
        if(res.safeword){
            $("#safeword_status").html('<span class="green">'+lang.js.account.hasSet+'</span>');
            $("#safeword_btn").html('<a class="btn btn-blue" href="/account/safeword"><i class="iconfont">&#xe8ad;</i>'+lang.js.account.goChange+'</a>');
        }else{
            $("#safeword_status").html('<span class="red">'+lang.js.account.noSet+'</span>');
            $("#safeword_btn").html('<a class="btn btn-blue" href="/account/safeword"><i class="iconfont">&#xe7da;</i>'+lang.js.account.goSet+'</a>');
        }

        if(res.post){
            if(res.auth){
                $("#auth_status").html('<span class="green">'+lang.js.account.passed+'</span>');
            }else{
                $("#auth_status").html('<span class="blue">'+lang.js.account.posted+'</span>');
            }
            $("#auth_btn").html('<a class="btn btn-blue" href="/account/auth"><i class="iconfont">&#xe8ad;</i>'+lang.js.account.goSee+'</a>');
        }else{
            $("#auth_status").html('<span class="red">'+lang.js.account.noAuth+'</span>');
            $("#auth_btn").html('<a class="btn btn-blue" href="/account/auth"><i class="iconfont">&#xe7da;</i>'+lang.js.account.goAuth+'</a>');
        }

        if(res.authDeep){
            $("#authDeep_status").html('<span class="green">'+lang.js.account.passed+'</span>');
            $("#authDeep_btn").html('<a class="btn btn-blue" href="/account/auth-deep"><i class="iconfont">&#xe8ad;</i>'+lang.js.account.goSee+'</a>');
        }else if(res.authDeepPost){
            $("#authDeep_status").html('<span class="blue">'+lang.js.account.posted+'</span>');
            $("#authDeep_btn").html('<a class="btn btn-blue" href="/account/auth-deep"><i class="iconfont">&#xe8ad;</i>'+lang.js.account.goSee+'</a>');
        }else{
            $("#authDeep_status").html('<span class="red">'+lang.js.account.noAuth+'</span>');
            $("#authDeep_btn").html('<a class="btn btn-blue" href="/account/auth-deep"><i class="iconfont">&#xe7da;</i>'+lang.js.account.goAuth+'</a>');
        }
        if(res.email){
            $("#email_status").html('<span>'+res.email_num+'</span>');
            $("#email_btn").html('<a class="btn btn-blue" href="/account/email"><i class="iconfont">&#xe8ad;</i>'+lang.js.account.goChange+'</a>');
        }else{
            $("#email_status").html('<span class="red">'+lang.js.account.noAuth+'</span>');
            $("#email_btn").html('<a class="btn btn-blue" href="/account/email"><i class="iconfont">&#xe7da;</i>'+lang.js.account.goAuth+'</a>');
        }
        if(res.mobile){
            $("#mobile_status").html('<span>'+res.mobile_num+'</span>');
            $("#mobile_btn").html('<a class="btn btn-blue" href="/account/phone"><i class="iconfont">&#xe8ad;</i>'+lang.js.account.goChange+'</a>');
        }else{
            $("#mobile_status").html('<span class="red">'+lang.js.account.noAuth+'</span>');
            $("#mobile_btn").html('<a class="btn btn-blue" href="/account/phone"><i class="iconfont">&#xe7da;</i>'+lang.js.account.goAuth+'</a>');
        }
        $("#pwd_status").html('<span class="green">'+lang.js.account.hasSet+'</span>');
        $("#pwd_btn").html('<a class="btn btn-blue" href="/account/password"><i class="iconfont">&#xe8ad;</i>'+lang.js.account.goChange+'</a>');
    }
    var isPending = false;
    $('#safe—word-btn').click(function(){
        var pwd = $("#pwd").val().trim();
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        var confirmPwd = $("#safePwd").val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(isEmpty(pwd)){
            error_win(lang.js.account.safewordEmpty);
            return;
        }
        if(pwd.length != 6 || !isInt(pwd)){
            error_win(lang.js.account.safewordShort);
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
        var param = {
            pwd: pwd,
            code: code
        };
        isPending = true;
        $.post('/v1/account/modSafeWord', param, function(data){
            isPending = false;
            if (data.code == 1) {
                error_win(lang.js.account.safewordSame);
            } else if (data.code == 200) {
                success_tip();
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
    $('#password-btn').click(function(){
        var pwd = $("#pwd").val().trim();
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        var confirmPwd = $("#safePwd").val().trim();
        if(isPending){
            error_win(lang.error);
            return;
        }
        if(getPwdStrength(pwd) < 2){
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
        var param = {
            pwd: pwd,
            code: code
        };
        isPending = true;
        $.post('/v1/account/modPassWord', param, function(data){
            isPending = false;
            if (data.code == 200) {
                success_tip();
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
    $('#email-add-btn').click(function(){
        var email = $("#email").val().trim();
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(!isEmail(email)){
            error_win(lang.emailFormatError);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        var param = {
            email: email,
            code: code
        };
        isPending = true;
        $.post('/v1/account/addEmail', param, function(data){
            isPending = false;
            if(data.code == 2) {
                error_win(lang.emailUsedError);
            } else if (data.code == 200) {
                success_tip();
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
    $('#email-bind-btn').click(function(){
        var email = $("#newEmail").val().trim();
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(!isEmail(email)){
            error_win(lang.emailFormatError);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        var param = {
            email: email,
            code: code
        };
        isPending = true;
        $.post('/v1/account/modEmail2', param, function(data){
            isPending = false;
            if(data.code == 2) {
                error_win(lang.emailUsedError);
            } else if (data.code == 200) {
                success_tip();
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
    $('#email-unbind-btn').click(function(){
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        var param = {
            code: code
        };
        isPending = true;
        $.post('/v1/account/modEmail', param, function(data){
            isPending = false;
            if (data.code == 200) {
                $("#mainForm").hide();
                $("#secForm").show();
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
    $('#mobile-add-btn').click(function(){
        var mobile = $("#mobile").val().trim();
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(!isMobile(mobile)){
            error_win(lang.emailFormatError);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        var param = {
            mobile: mobile,
            code: code
        };
        isPending = true;
        $.post('/v1/account/addMobile', param, function(data){
            isPending = false;
           if(data.code == 2) {
                error_win(lang.phoneUsedError);
            }  else if (data.code == 200) {
                success_tip();
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
    $('#mobile-bind-btn').click(function(){
        var mobile = $("#newMobile").val().trim();
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(!isMobile(mobile)){
            error_win(lang.emailFormatError);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        var param = {
            mobile: mobile,
            code: code
        };
        isPending = true;
        $.post('/v1/account/modMobile2', param, function(data){
            isPending = false;
            if(data.code == 2) {
                error_win(lang.phoneUsedError);
            } else if (data.code == 200) {
                success_tip();
            }else if (data.code == 100) {
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
    $('#mobile-unbind-btn').click(function(){
        var code = $(this).closest('.form').find('input[name=code]').val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(isEmpty(code)){
            error_win(lang.codeEmptyTips);
            return;
        }
        var param = {
            code: code
        };
        isPending = true;
        $.post('/v1/account/modMobile', param, function(data){
            isPending = false;
            if (data.code == 200) {
                $("#mainForm").hide();
                $("#secForm").show();
            }else if (data.code == 100) {
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
    $('#auth-btn').click(function(){
        var name = $('#name').val().trim();
        var no = $('#no').val().trim();
        if(isPending){
            error_win(lang.pending);
            return;
        }
        if(isEmpty(name)){
            error_win(lang.js.account.realEmptyTips);
            return;
        }
        if(isEmpty(no)){
            error_win(lang.js.account.numEmptyTips);
            return;
        }
        var param = {
            name: name,
            no: no
        };
        confirm_win(lang.js.account.identifySure, function(){
            isPending = true;
            $.post('/v1/account/auth', param, function(data){
                isPending = false;
                if (data.code == 4) {
                    error_win(lang.js.account.bind);
                }else if (data.code == 200) {
                    location.href='/account/auth-deep';
                }else {
                    error_win(lang.error);
                }
            },"json");
        })
    });
    $("input[name=img]").change(function(){
        var file= $(this).val();
        var strs = file.split('.');
        var suffix = strs[strs.length - 1].toLocaleLowerCase();
        if (suffix != 'jpg' && suffix != 'png' && suffix != 'jpeg') {
            error_win(lang.js.account.pic);
            return;
        }
        var $form = $(this).closest("form");
        var type = $form.find("input[name=type]").val();
        $("#img"+type).attr('src', resources + "/dist/images/identify/loading.gif");
        console.log("#img"+type);
        $form.submit();
        $(this).val('');
    });

    $('#auth-deep-btn').click(function(){
       $('#form').submit();
    });

    if($("#form").length > 0){
        $("#form").ajaxForm({
            dataType:'json',
            success: function(data) {
                isPending = false;
                if(data.code == 200){
                    success_tip();
                }else if(data.code == 1){
                    error_win(lang.js.account.none)
                }else if(data.code == 2){
                    error_win(lang.js.account.refresh)
                }
            },
            beforeSubmit: function(){
                if(isPending){
                    error_win(lang.pending);
                    return false;
                }
                if(isEmpty($("input[name=fIdentityPath1]").val())){
                    error_win(lang.js.account.hold);
                    return false;
                }
                if(isEmpty($("input[name=fIdentityPath2]").val())){
                    error_win(lang.js.account.front);
                    return false;
                }
                if(isEmpty($("input[name=fIdentityPath3]").val())){
                    error_win(lang.js.account.back);
                    return false;
                }
                isPending = true;
            }
        });
    }
    if($(".identify_img").length> 0){
        $(".identify_img").ajaxForm({
            dataType:'json',
            success: function(data) {
                var $target = $("#img"+data.totalCount);
                if(data.code!=200){
                    $target.attr("src", resources + $target.data('img'));
                }
                if(data.code == 200){
                    $target.attr("src",cdn+data.data + "?x-oss-process=image/resize,w_350,h_200,m_pad");
                    $("input[name=fIdentityPath"+data.totalCount+"]").val(data.data);
                }else if(data.code == 1){
                    error_win(lang.js.account.noExist);
                }else if(data.code == 2){
                    error_win(lang.js.account.tooLarge);
                }else if(data.code == 3){
                    error_win(lang.js.account.noValid);
                }else if(data.code == 4 || data.code == 5){
                    error_win(lang.error);
                }
            }
        });
    }

    function success_tip(){
        success_win(lang.operationSuccess, function(){
            location.href = "/account/safe";
        });
    }

    if($(".safeword_pwd").length > 0){
        $(".safeword_pwd").attr("placeholder", lang.js.account.safe);
        $(".re_safeword_pwd").attr("placeholder", lang.js.account.reSafe);
    }
})(jQuery);