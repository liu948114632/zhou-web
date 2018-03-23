var _const = {
	EMAIL_CAPTCHA_KEY : "_e_",
	CAPTCHA_SECONDS : 60,
	SUBMIT_FLAG : "code"
};

var _handler = {
	showHandlerTips : function(btn, secs,type){
		var _this = $("#" + btn);
        var _span = _this.find("span");
		if(type){
            _span = _this;
		}
		if(secs > 0){
			if(type){
                _span.css({"background":"#ccc","cursor":"text"});
			}
			_span.html(secs + "s");
		}else{
            var color = _span.data("color")? _span.data("color"): "#ff4b33";
            if(type){
                $(".img_code").val('');
                $(".code_img").attr("src" ,basePath + '/v1/servlet/ImageCode?' + new Date().getTime());
                _span.css({"background":color,"cursor":"pointer"});
            }
			var name = _span.data('name')? _span.data('name'): lang.send;
			_span.html(name);
			_this.data(_const.SUBMIT_FLAG, false);
		}
	},
	updateTipsSeconds : function(btn, secs,type){
		if(secs <= 0){
			return;
		}
		var _this = $("#" + btn);
		_this.data(_const.SUBMIT_FLAG, true);
		secs = secs*1;
		for(var i=0; i<=secs; i++){
			setTimeout("_handler.showHandlerTips('" + btn + "', " + (secs - i) + ","+type+")", i * 1000);
		}
	},
	cleanTipsHandler : function(key){
		var strs = $.cookie(key);
		if(!strs || {} == strs){
			return;
		}
		var time = 0;
		var vals = strs.split("\|");
		for(var i=0; i<vals.length; i++){
			var val = vals[i];
			if(val){
				var btnVals = val.split(".");
				var _t = btnVals[1] * 1;
				var secs = _const.CAPTCHA_SECONDS - ((new Date().getTime() - (btnVals[1] * 1)) / 1000).toFixed(0);
				if(secs <= 0){
					strs.replace("\|" + val, '');
				}else if(_t > time){
					time = _t + (_const.CAPTCHA_SECONDS * 1000);
				}
			}
		}
		if("\|" == strs){
			$.removeCookie(key);
		}else{
			var date = new Date(time);
			$.cookie(key, strs, {expires : date, path : '/'});
		}
		return strs;
	},
	addTipsHandler : function(key, btn){
		_handler.cleanTipsHandler(key);
		var vals = $.cookie(key);
		if(!vals || {} == vals){
			vals = '|';
		}
		var date = new Date();
		var minsecs = date.getTime();
		vals += btn + "." + minsecs + "|";
		date.setSeconds(date.getSeconds() + _const.CAPTCHA_SECONDS);
		$.cookie(key, vals, {expires : date, path : '/'});
	},
	recoverHandler : function(key){
		var strs = _handler.cleanTipsHandler(key);
		if(!strs){
			return;
		}

		var vals = strs.split("\|");
		for(var i=0; i<vals.length; i++){
			var val = vals[i];
			if(val){
				var btnVals = val.split(".");
				var secs = _const.CAPTCHA_SECONDS - ((new Date().getTime() - (btnVals[1] * 1)) / 1000).toFixed(0);
				_handler.updateTipsSeconds(btnVals[0], secs,1);
			}
		}
	}
};

!(function($){
    _handler.recoverHandler(_const.EMAIL_CAPTCHA_KEY);

    $("form").find("input").on("keyup",function(e){
        var $this = $(this).closest("form");
        if(e.keyCode == 13){
            $this.find(".confirm").click();
        }
    });

    $("form").find(".code_img").click(function(){
        $(this).attr("src", basePath + '/v1/servlet/ImageCode?' + new Date().getTime());
    });
    if(!isPC() && $.cookie("ver") == "pc"){
        $("#to_mobile").show();
    }
    $("#to_mobile").click(function(){
        $.cookie("ver", "phone", {expires : 365, path : '/'});
    })

    var code_pending = false;
    // $("form").on("click",".code_btn",function(){
    //     var $this = $(this);
    //     var cate = $this.data('cate');
    //     cate = cate ? cate : "shit";
    //     var submit_state = $this.data(_const.SUBMIT_FLAG);
    //     if(code_pending){
    //         error_win(lang.pending);
    //         return;
    //     }
    //     if(submit_state){
    //         error_win(lang.codeTime + _const.CAPTCHA_SECONDS+"s");
    //         return;
    //     }
    //     var url = '/v1/sendLoginCode';
    //     if(cate == "inner"){
    //         url = '/v1/account/sendCode';
    //     }
    //     var param = {};
    //     var $form = $this.closest("form");
    //     var img_code = $form.find(".img_code");
    //     if(img_code.length > 0 || cate == "find" || cate.indexOf("bind")!=-1){
    //         var name = $form.find(".name").val();
    //         if(isEmpty(name)){
    //             error_win(lang.accountEmpty);
    //             return;
    //         }
    //         if(!isEmail(name)){
    //             error_win(lang.emailFormatError);
    //             return;
    //         }
    //        /* if($this.data('type') == 'mobile' && !isMobile(name)){
    //             error_win(lang.phoneFormatError);
    //             return;
    //         }*/
    //     }
    //     if(img_code.length > 0){
    //         var code = img_code.val();
    //         if(isEmpty(code)){
    //             error_win(lang.imageCodeEmpty);
    //             return;
    //         }
    //         url = '/v1/sendRegCode';
    //         param = {
    //             code: code,
    //             name: name
    //         };
    //     }
    //     if(cate == "find"){
    //         url = '/v1/sendFindCode';
    //         param = {
    //             name: name
    //         };
    //     }
    //     code_pending = true;
    //     $this.data(_const.SUBMIT_FLAG, true);
    //     var id = $this.attr("id");
    //     if(cate.indexOf('bind')!=-1){
    //         url = '/v1/account/sendBindCode';
    //         param['name'] = name;
    //         if(cate == "bind_check"){
    //             param['check'] = 1;
    //         }
    //     }
    //     $.post(url, param, function(res){
    //         $this.data(_const.SUBMIT_FLAG, false);
    //         code_pending = false;
    //         if(1 == res.code){
    //             error_win(lang.illegal);
    //         }else if(200 == res.code){
    //             _handler.addTipsHandler(_const.EMAIL_CAPTCHA_KEY, id);
    //             _handler.updateTipsSeconds(id, _const.CAPTCHA_SECONDS,1);
    //         }else if(2 == res.code){
    //             error_win(lang.noCorrectAccount);
    //         } else if(3 == res.code){
    //             error_win(lang.imageCodeErr);
    //         }else if(4 == res.code){
    //             error_win(lang.binded);
    //         }else if(5 == res.code){
    //             error_win(lang.noUse);
    //         }else if(6 == res.code){
    //             error_win(lang.forbid);
    //         }else{
    //             error_win(lang.error);
    //         }
    //     }, 'json');
    // });

    $("input[name=password],input[name=confirmPwd]").focus(function(){
        $(this).attr("type","password");
    });

    $(".exit").on("click", function(){
        $.post("/v1/logout", {}, function(data){
            if(data.code == 200){
                location.href="/user/login";
            }
        }, "json");
    });
    $(".close").click(function(){
       $(this).closest(".float_win").hide();
       $("#shadow").hide();
    });

    var qrcode_init = false;
    function getInfo() {
        $.getJSON('/v1/session?' + new Date().getTime(), {}, function(data){
            if(data && 200 == data.code){
                $("#newslogin").hide();
                $("#newsinfo").show();
                $('M_account').show();
                $('M_open').show();
                var res = data.data;
                $('#M_userName').text(res.id);
                $('#id_no').text(res.id);
                $('.logined').show();

                $('.login-register').hide();
                if(res.authDeep){
                    $("#topAuthDepth").addClass('pass');
                }
                if(res.auth){
                    $("#topAuthStatus").addClass('pass');
                }
                if(res.safeword){
                    $("#topSafewordStatus").addClass('pass');
                }
                if(res.mobile){
                    $("#topMobileStatus").addClass('pass');
                }
                if(res.email){
                    $("#topEmailStatus").addClass('pass');
                }
                if(data.totalCount > 0){
                    $("#dope_num").text(data.totalCount);
                    $("#dope_btn").show();
                }
                window.sessionCallback && window.sessionCallback(res);
                setTimeout(getInfo, 60*1000);
                if($("#qrcode").length > 0 && !qrcode_init){
                    var introHost = location.protocol + "//" + location.host + "?intro=";
                    qrcode_init = true;
                    $('#qrcode').qrcode({width: 115,height: 115,text:introHost+data.data.id});
                }
                if($("#spread-input").length > 0) $("#spread-input").val(introHost+data.data.id);
                if($("#spread-id").length > 0) $("#spread-id").text(data.data.id);
            }else{
                if($("#qrcode").length > 0 && !qrcode_init){
                    $('#qrcode').qrcode({width: 115,height: 115,text:lang.signIn});
                }
                $('.logined').hide();
                $('.login-register').show();
            }
        });
    }
    // getInfo();

    $('.lang_box').hover(function(){
        $(this).find(".next").show();
    },function(){
        $(this).find(".next").hide();
    });
    // $(".lang_box .next").click(function(){
    //     var $this = $(this);
    //    var language = $this.find("img").data("lang") ;
    //     $.cookie("lang", language, {expires : 365, path : '/'});
    //     location.reload();
    // });

    $(".languagenew").click(function(){
        var $this = $(this);
        var language = $this.data("lang") ;
        $.cookie("lang", language, {expires : 365, path : '/'});
        location.reload();
    });
    $(".dropdown-toggle").click(function(){
        var $this = $(this);
        var language = $this.data("lang") ;
        $.cookie("lang", language, {expires : 365, path : '/'});
        location.reload();
    });


    $('.dropdown').hover(function(){
        $(this).find('.dropdown-menu').show();
    },function () {
        $(this).find('.dropdown-menu').hide();
    });

    $("#wechat").hover(function(){
        $(this).find('img').show();
    },function(){
        $(this).find('img').hide();
    });

    $(window).scroll(function(){
        initTop();
    });
    initTop();
    function initTop(){
        var top = $(window).scrollTop();
        if(top > 300){
            $("#top").show();
        }else{
            $("#top").hide();
        }
    }
    $("#top").click(function(){
        $("html, body").animate({"scrollTop": 0}, 400);
    });
})(jQuery);
function checkPwdStrength (pwd, div) {
    var level = 0, index = 1, div = div || ".bk-pwdcheck";
    level = getPwdStrength(pwd);
    if (level < 1) {
        index = 1
    }
    if (level == 2) {
        index = 2
    }
    if (level == 3) {
        index = 3
    }
    if (level > 3) {
        index = 4
    }
    $(div).find(".strength").removeClass("active");
    $(div).find(".strength:lt(" + index + ")").addClass("active");
    $(div).find("input[name='pwdLevel']").val(level * 20);
}

function getPwdStrength(pwd){
    var level = 0;
    if (pwd.length >= 8 && pwd.length <= 20) {
        if (/\d/.test(pwd)) {
            level++
        }
        if (/[a-z]/.test(pwd)) {
            level++
        }
        if (/[A-Z]/.test(pwd)) {
            level++
        }
        if (/\W/.test(pwd)) {
            level++
        }
        if (level > 1 && pwd.length > 12) {
            level++
        }
    }
    return level;

}
var pending_center = '    <div class="col-xs-12 pending-box">'+
    '    <div class="spinner pending-spinner balance-spinner">'+
    '    <div class="rect1"></div>'+
    '    <div class="rect2"></div>'+
    '    <div class="rect3"></div>'+
    '    <div class="rect4"></div>'+
    '    <div class="rect5"></div>'+
    '    </div>'+
    '    </div>';