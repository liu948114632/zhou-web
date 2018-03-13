/*angular.module('i18n', []).value(lang, lang).controller('AgCtrl', ['$scope', '$interval', '$http', function($scope){
    $scope.lang = lang;
}]);*/

function isEmpty(val) {
	val = $.trim(val);
	if (val == null)
		return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
}

function intCheck(num){
    var format=/^[0-9]+$/;
    if(!num.match(format)){
        return false;
    }
    return true;
}

Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
		"H+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f"
								: "/u5468")
								: "")
								+ week[this.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};

function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function isEmail(email){
    if ((email.length > 128) || (email.length < 6)) {
    	return false;
    }
    var format = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!email.match(format)) {
    	return false;
    }
    return true;
}

function isMobile(phone){
    var format = /^\d+$/;
    if(!phone.match(format)) {
    	return false;
    }
    return true;
}

function isNumber(num){
    var format=/^[0-9]+\.?[0-9]*$/;
    if(!num.match(format)){
        return false;
    }
    return true;
}

function isInt(num){
    var format=/^[0-9]+$/;
    if(!num.match(format)){
        return false;
    }
    return true;
}

function getParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function center_size(id){
	var $this=$("#"+id);
	var height=$this.height();
	var width=$this.width();
	var left=($(window).width()-width)/2;
	var top=($(window).height()-height)/2;
	$this.css({"top":top,"left":left});
}

function center_box(id){
	center_size(id);
	$(window).resize(function(){
		center_size(id);
	});
}

(function ($) {
    var _ajax = $.ajax;
    $.ajax = function (opt) {
        var fn = {
            success: function (data, textStatus) {
            }
        };
        if (opt.success) {
            fn.success = opt.success;
        }
        var url = opt.url.indexOf("upload")!=-1 ? opt.url : basePath + opt.url;
        var _opt = $.extend(opt, {
            url: url,
            success: function (data, textStatus,jqXHR) {
                if ((typeof(data) == "string" && $.trim(data) == '{"code":401}') || (data && data.code == 401)) {
                    location.href = "/user/login";
                } else {
                    fn.success(data, textStatus,jqXHR);
                }
            }
        });
        return _ajax(_opt);
    };
    $.getError = function (error, url, data, success) {
        $.ajax({
            url: url,
            data: data,
            success: success,
            error: error,
            dataType: "json"
        });
    };
})(jQuery);

function tm_dialog(options){
    var width = 450;
    var height = 200;
    if(!isPC()){
        width = 300;
        height = 200;
    }
    var defaults = {
        title:lang.tips,
        content:"",
        bg_color: "#3aa1f1",
        hover_bg_color: "#288ede",
        width:width,
        height:height,
        sureText: lang.confirm,
        cancelText: lang.cancel,
        showDoubleButton:true,
        showSingleButton:false
    };

    var opts = $.extend({},defaults,options);
    if($("#dialogbox").length==1){
        return;
    }
    var cls = "";
    if(opts.type == "text"){
        cls = "content_cls";
    }
    $("body").append("<div class='b_l w460' id='dialogbox'>"+
        "	<div class='bcom_ti'>"+
        "		<a href='javascript:void(0);' class='bide layer_icon iconfont close fr'>&#xe999;</a><span>" + opts.title + "</span>" +
        "	</div>"+
        "	<div class='bcom_cent'>"+
        "		<p class='bcomti "+cls+"'>"+opts.content+"</p>"+
        "		<p class='bcoma double'>"+
        "			<a href='javascript:void(0);' class='bc_abut1 sure'>"+opts.sureText+"</a>"+
        "			<a href='javascript:void(0);' class='bc_abut2 close'>"+opts.cancelText+"</a>"+
        "		</p>"+
        "		<p class='bcoma single'>"+
        "			<a href='javascript:void(0);' class='bc_abut1 sure' style='margin:30px 0'>"+opts.sureText+"</a>"+
        "		</p>"+
        "	</div>"+
        "</div>").append("<div class='tmui-overlay' style='height:"+$(window).height()+"px'></div>");
    var $dialog = $("#dialogbox");
    if(!opts.showDoubleButton)$dialog.find(".double").remove();
    if(!opts.showSingleButton)$dialog.find(".single").remove();
    $dialog.width(opts.width);
    $dialog.height(opts.height);
    $(".bc_abut1").css({background: opts.bg_color});
    $(".bcom_ti .close").hover(function () {
        $(this).css({color: opts.bg_color});
    }, function () {
        $(this).css({color: "#000"});
    });
    $(".bc_abut1").hover(function () {
        $(this).css({background: opts.hover_bg_color});
    }, function () {
        $(this).css({background: opts.bg_color});
    });
    center_box("dialogbox");
    $dialog.find(".close").click(function(){
        $dialog.next().remove();
        $dialog.remove();
        if(opts.cancelCallback){
            opts.cancelCallback(true);
        }else if(opts.reload){
            location.reload();
        }
    });
    $dialog.find(".sure").click(function(){
        $dialog.next().remove();
        $dialog.remove();
        if(opts.callback){
            opts.callback(true);
        }else if(opts.reload){
            location.reload();
        }
    });
}
window.error_win = function(){
    var callback = arguments[1];
    tm_dialog({
        title: lang.errorTips,
        content:arguments[0],
        bg_color: "#fd383a",
        hover_bg_color: "#FA0009",
        showDoubleButton:false,
        showSingleButton:true,
        callback:function(){
            callback && callback();
        }
    })
};
window.success_win = function () {
    var callback = arguments[1];
    var opts = {
        title: lang.successTips,
        content: arguments[0],
        bg_color: "#50ad67",
        hover_bg_color: "#1f963d",
        showDoubleButton: false,
        showSingleButton: true,
        reload:1
    };
    if(callback){
        opts['callback'] = callback;
    }
    tm_dialog(opts);
};
window.confirm_win = function(){
    var callback = arguments[1];
    var cancelCallback = arguments[2];
    tm_dialog({
        title: lang.operTips,
        content:arguments[0],
        callback:function(){
            callback && callback();
        },
        cancelCallback: function(){
            cancelCallback && cancelCallback();
        }
    })
};
window.content_win = function(){
    var callback = arguments[2];
    var cancelCallback = callback;
    tm_dialog({
        width:600,
        height:300,
        title: arguments[0],
        content:arguments[1],
        bg_color: "#fd0202",
        hover_bg_color: "#fe6f6f",
        showDoubleButton:false,
        showSingleButton:false,
        callback:function(){
            callback && callback();
        },
        cancelCallback: function(){
            cancelCallback && cancelCallback();
        },
        type:"text"
    })
};