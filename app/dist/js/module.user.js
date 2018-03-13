define(function (require, exports, module) {
    var user = {};
    var M = require("module_method");
    var RSA;
    var loginType = 0;
    var wsLoginStatus = false;
    var userType = 2;
    var lockRequest = false;
    var qrcodeTimer;
    var needImgCode = true, takeMsgCode = false, logRememberMe = false, codeCountTime = 60, submitBtn = "#submitBtn",
        getMsgBtn = "#sendMsgCode", getImgBtn = "img[role=imgCode]", userName, countryCode, logPassword, setPassword,
        repeatPassword, setSafePwd, repeatSafePwd, pwdLevel, imgCode, msgCode, googleCode, recommendId, cardId,
        rsaPublicKey, regAgreement;
    user.vipRate = 0;
    user.totalPoints = null;
    user.simpleAuth = null;
    user.depthAuth = null;
    user.emailAuth = null;
    user.mobileAuth = null;
    user.googleAuth = null;
    user.pwdStatus = null;
    user.safePwdStatus = null;
    user.init = function () {
        var $this = this;
        if (JuaBox.isMobile()) {
            $(".bk-app").slideDown()
        }
        var cruLink = document.location.href;
        var curPath = document.location.pathname;
        if (JuaBox.isMySelf() && curPath.indexOf("/u") == -1 && curPath.indexOf("/self/") == -1) {
            localStorage[ZNAME + "fromurl"] = cruLink
        }
        if ($this.isLogin()) {
            $(".logined").show();
            $(".nologin").hide();
            $("#M_userLevelIco").addClass("u-level-" + $.cookie(VIP));
            $("#D_userLevel").text("[VIP" + $.cookie(VIP) + "]");
            $("#M_userName").text($.cookie(UNAME));
            $("#tipList").on("click", ".switch", function () {
                $this = $(this);
                user.useOrCloseTip($this.data("type"), $this.data("status"), function () {
                    $this.toggleClass("on");
                    $this.data("status", $this.hasClass("on") ? 1 : 0);
                    $this.parents("li").find("span").text($this.hasClass("on") ? bitbank.L("已开启") : bitbank.L("已关闭")).removeClass($this.hasClass("on") ? "red" : "green").addClass($this.hasClass("on") ? "green" : "red")
                })
            });
            $this.getUserInfo(function () {
                $("#D_userTotal").html($this.totalPoints);
                $("#topMobileStatus").addClass($this.mobileAuth ? "pass" : "");
                $("#topEmailStatus").addClass($this.emailAuth ? "pass" : "");
                var isSimplePass = $this.simpleAuth || $this.depthAuth;
                $("#topAuthStatus").addClass(isSimplePass ? "pass" : "");
                if (isSimplePass) {
                    $("#topAuthStatus").attr("href", DOMAIN_VIP + "/u/safe")
                }
                if (!$this.simpleAuth && !$this.depthAuth) {
                    $("#topAuthDepth").remove();
                    $("#topAuthVideo").remove()
                } else {
                    $("#topAuthDepth").addClass($this.depthAuth ? "pass" : "");
                    if ($this.depthAuth) {
                        $("#topAuthDepth").attr("href", DOMAIN_VIP + "/u/safe")
                    }
                }
                $("#topGoogleStatus").addClass($this.googleAuth ? "pass" : "");
                $("#topAuthVideo").addClass($this.videoAuth ? "pass" : "");
                var pathName = location.pathname;
                var hrefName = location.href;
                if (pathName.indexOf("/user/") == -1 && pathName.indexOf("/service/") == -1 && pathName.indexOf("/mobile/") == -1 && pathName.indexOf("/recommend") == -1 && pathName.indexOf("/onekey/m") == -1 && pathName.indexOf("/safe/setSafePwd") == -1 && hrefName != DOMAIN_MAIN + "/") {
                    var A = require("module_asset");
                    A.getUserAsset(function () {
                        if ($this.simpleAuth || $this.depthAuth || $this.videoAuth) {
                            if (A.allTotal > 0) {
                                $(".bk-topGuide").hide()
                            } else {
                                $(".bk-topGuide").show();
                                $(".bk-topGuide li:eq(1)").addClass("pass");
                                $(".bk-topGuide li:eq(2)").addClass("active")
                            }
                        } else {
                            $(".bk-topGuide").show();
                            $(".bk-topGuide li:eq(1)").addClass("active")
                        }
                    })
                }
            })
        } else {
            $(".logined").hide();
            $(".nologin").show()
        }
    };
    user.commonPageInit = function () {
        var $this = this;
        userName = $.cookie(ZNAME + "logusername"), countryCode = $.cookie(ZNAME + "logcountrycode");
        if (userName != "" && userName != null) {
            $("#nike").val(userName).focus();
            $("#countryCode").val(countryCode);
            $("#countryText").text(countryCode);
            $("#countryGroup .dropdown-menu li").each(function () {
                if ($(this).data("value") == countryCode) {
                    $(this).addClass("active")
                } else {
                    $(this).removeClass("active")
                }
            })
        }
        $("#clearCookie").on("click", function () {
            $("#nike").val("").focus();
            $.cookie(ZNAME + "logusername", null, {expires: 7, path: "/", domain: DOMAIN_BASE});
            $.cookie(ZNAME + "logcountrycode", null, {expires: 7, path: "/", domain: DOMAIN_BASE});
            JuaBox.showTip(bitbank.L("成功清除cookies记录"))
        });
        $("#countryGroup").on("show.bs.dropdown", function () {
            $(this).find(".dropdown-menu").width($(".bk-sign-form").width() - 2)
        });
        $("#countryGroup .dropdown-menu").on("click", "li", function () {
            $("#countryCode").val($(this).data("value"));
            $("#countryText").text($(this).data("value"));
            $("#countryGroup .dropdown-menu li").removeClass("active");
            $(this).addClass("active")
        });
        $("input[name=nike]").on({
            keyup: function () {
                $this.checkUserNike($(this).val())
            }, blur: function () {
                $this.checkUserNike($(this).val())
            }, change: function () {
                $this.checkUserNike($(this).val())
            }
        });
        $("input[name=password]").on({
            focus: function () {
                $("#pwdStrength").fadeIn()
            }, keyup: function () {
                $this.checkPwdStrength($(this).val())
            }, blur: function () {
                $this.checkPwdStrength($(this).val());
                if ($("#pwdLevel").val() > 20) {
                    $("#pwdStrength").fadeOut()
                }
            }, change: function () {
                $this.checkPwdStrength($(this).val())
            }
        });
        $("input[name=setSafePwd]").on({
            focus: function () {
                $("#pwdStrength").fadeIn()
            }, keyup: function () {
                $this.checkSafePwdStrength($(this).val())
            }, blur: function () {
                $this.checkSafePwdStrength($(this).val());
                if ($("#pwdLevel").val() > 0) {
                    $("#pwdStrength").fadeOut()
                }
            }, change: function () {
                $this.checkSafePwdStrength($(this).val())
            }
        });
        $(getImgBtn).on("click", function () {
            $(this).attr("src", DOMAIN_VIP + "/imagecode/get/28/100/50/" + new Date().getTime())
        })
    };
    user.logPageInit = function () {
        var $this = this;
        $this.commonPageInit();
        if (user.isLogin()) {
            if (localStorage[ZNAME + "fromurl"]) {
                window.top.location.href = localStorage[ZNAME + "fromurl"]
            } else {
                location.href = "/u/asset"
            }
        }
        RSA = require("module_encrypt");
        $this.getPublicKey();
        $("body").keypress(function (e) {
            if (e.keyCode == 13) {
                $this.login()
            }
        });
        if ($.cookie("LoginCode") == "1") {
            $("#imgCodeForm").show()
        }
        $(submitBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.login()
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        });
        $(".bk-sign-swift .iconfont").on("click", function () {
            $(".bk-sign-swift .iconfont, #quickLogin, #zbLogin").toggle();
            loginType = loginType == 0 ? 1 : 0;
            if (loginType == 1) {
                user.refreshLoginQrcode()
            } else {
                clearInterval(user.qrcodeTimer);
                if (wsLoginStatus) {
                    webSocket.sendMessage('{"event":"removeChannel","channel":"pushLoginData"}')
                }
            }
        });
        $("#backtoLoginQrcode, #resetLoginQrcode").on("click", function () {
            user.refreshLoginQrcode()
        })
    };
    user.regPageInit = function () {
        var $this = this;
        $this.commonPageInit();
        if (user.isLogin()) {
            if (localStorage[ZNAME + "fromurl"]) {
                window.top.location.href = localStorage[ZNAME + "fromurl"]
            } else {
                location.href = "/u/asset"
            }
        }
        $("body").keypress(function (e) {
            if (e.keyCode == 13) {
                $this.register()
            }
        });
        $(submitBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.register()
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        });
        $(getMsgBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.getMsgCode("register", function () {
                    $("input[name=nike]").attr("readonly", "readonly");
                    $("#countryGroup .dropdown-toggle").on("click", function () {
                        return false
                    })
                })
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        })
    };
    user.pageIndexInit = function () {
        var $this = this;
        $this.getUserInfo(function () {
            $("#safeMobileStatus").addClass($this.mobileAuth ? "pass" : "");
            $("#safeEmailStatus").addClass($this.emailAuth ? "pass" : "");
            $("#safeAuthStatus").addClass($this.simpleAuth || $this.depthAuth ? "pass" : "");
            $("#safeGoogleStatus").addClass($this.googleAuth ? "pass" : "");
            $("#safePwdStatus").addClass($this.pwdStatus ? "pass" : "");
            $("#safeSafePwdStatus").addClass($this.safePwdStatus ? "pass" : "")
        });
        $("#openSafePwd").on("click", function () {
            $this.openSafePwd(function () {
                window.top.location.reload()
            })
        });
        $("#closeSafePwd").on("click", function () {
            $this.closeSafePwd(function () {
                window.top.location.reload()
            })
        })
    };
    user.findLoginPwdPageInit = function () {
        var $this = this;
        $this.commonPageInit();
        $("body").keypress(function (e) {
            if (e.keyCode == 13) {
                $this.findLoginPwd()
            }
        });
        $(submitBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.findLoginPwd()
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        });
        $(getMsgBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.getMsgCode("findLoginPwd", function () {
                    $("input[name=nike]").attr("readonly", "readonly");
                    $("#countryGroup .dropdown-toggle").on("click", function () {
                        return false
                    })
                })
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        })
    };
    user.resetLoginPwdPageInit = function () {
        var $this = this;
        $this.commonPageInit();
        RSA = require("module_encrypt");
        $this.getPublicKey();
        $("body").keypress(function (e) {
            if (e.keyCode == 13) {
                $this.resetLoginPwd()
            }
        });
        $(submitBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.resetLoginPwd()
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        })
    };
    user.findSafePwdPageInit = function () {
        if (!user.isLogin()) {
            JuaBox.sure(bitbank.L("请您登录后再进行操作"))
        }
        var $this = this;
        $this.commonPageInit();
        RSA = require("module_encrypt");
        $this.getPublicKey();
        $("body").keypress(function (e) {
            if (e.keyCode == 13) {
                $this.findSafePwd()
            }
        });
        $(submitBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.findSafePwd()
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        });
        $(getMsgBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.getMsgCode("findSafePwd", function () {
                    $("input[name=nike]").attr("readonly", "readonly");
                    $("#countryGroup .dropdown-toggle").on("click", function () {
                        return false
                    })
                })
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        })
    };
    user.resetSafePwdPageInit = function () {
        if (!user.isLogin()) {
            JuaBox.sure(bitbank.L("请您登录后再进行操作"))
        }
        var $this = this;
        $this.commonPageInit();
        $("body").keypress(function (e) {
            if (e.keyCode == 13) {
                $this.resetSafePwd()
            }
        });
        $(submitBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.resetSafePwd()
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        })
    };
    user.setSafePwdPageInit = function () {
        if (!user.isLogin()) {
            JuaBox.sure(bitbank.L("请您登录后再进行操作"))
        }
        var $this = this;
        $this.commonPageInit();
        $("body").keypress(function (e) {
            if (e.keyCode == 13) {
                $this.setSafePwd()
            }
        });
        $(submitBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.setSafePwd()
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        });
        $(getMsgBtn).on("click", function (event) {
            if (event.originalEvent) {
                $this.getMsgCode("setSafePwd")
            } else {
                return JuaBox.showWrong(bitbank.L("请勿使用非法脚本"))
            }
        })
    };
    user.formDataInit = function () {
        userName = $.trim($("#nike").val());
        countryCode = $.trim($("#countryCode").val());
        logPassword = $("#password").val();
        setPassword = $("#password").val();
        repeatPassword = $("#confirmPwd").val();
        setSafePwd = $("#setSafePwd").val();
        repeatSafePwd = $("#repeatSafePwd").val();
        pwdLevel = $("#pwdLevel").val();
        cardId = $("#cardId").val();
        needImgCode = $("#isSafe").val() || true;
        imgCode = $.trim($("#imgCode").val());
        msgCode = $.trim($("#msgCode").val());
        googleCode = $.trim($("#googleCode").val());
        logRememberMe = $("#rememberMe").is(":checked");
        recommendId = $("#recommendId").val() || $.cookie("tuijianid");
        regAgreement = $("#agreement").is(":checked")
    };
    user.isLogin = function () {
        return $.cookie(UON) == "1" && $.cookie(UNAME) != null && $.cookie(UID) != null
    };
    user.login = function () {
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (userName == "") {
            return JuaBox.showWrong(bitbank.L("请输入用户名"))
        }
        if (logPassword.length < 6) {
            return JuaBox.showWrong(bitbank.L("登录密码最少6位字符，请重新输入"))
        }
        if (imgCode.length < 4 && needImgCode == 0) {
            return JuaBox.showWrong(bitbank.L("图形验证码最少4位字符，请重新输入"))
        }
        var encrypt = new RSA();
        encrypt.setPublicKey(rsaPublicKey);
        logPassword = encrypt.encrypt(logPassword);
        lockRequest = true;
        $(submitBtn).button("loading");
        $.post(DOMAIN_VIP + "/user/doLogin?callback=?", {
            nike: userName,
            pwd: logPassword,
            code: imgCode,
            countryCode: countryCode,
            safe: needImgCode,
            pubTag: rsaPublicKey
        }, function (json) {
            lockRequest = false;
            $(submitBtn).button("reset");
            if (logRememberMe) {
                $.cookie(ZNAME + "logusername", userName, {expires: 7, path: "/", domain: DOMAIN_BASE});
                $.cookie(ZNAME + "logcountrycode", countryCode, {expires: 7, path: "/", domain: DOMAIN_BASE})
            }
            if (json.isSuc) {
                if (json.datas && json.datas.needJump) {
                    window.top.location.href = json.datas.jumpUrl
                } else {
                    var fromUrl = localStorage[ZNAME + "fromurl"];
                    if (fromUrl && fromUrl.indexOf(DOMAIN_MAIN) < 0) {
                        window.top.location.href = localStorage[ZNAME + "fromurl"]
                    } else {
                        window.top.location.href = DOMAIN_VIP + "/u/asset"
                    }
                }
            } else {
                if (json.datas && json.datas.needRefresh) {
                    JuaBox.sure(json.des, {
                        btnFun1: function (JuaId) {
                            JuaBox.close(JuaId, function () {
                                window.location.reload(true)
                            })
                        }
                    })
                } else {
                    $("#imgCode").val("");
                    $(getImgBtn).click();
                    JuaBox.sure(json.des);
                    if (json.datas && json.datas.status == 0) {
                        $("#isSafe").val(0);
                        $("#imgCodeForm").show()
                    }
                }
            }
        }, "json")
    };
    user.register = function () {
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (userType == 0) {
            return JuaBox.showWrong(bitbank.L("请输入正确的邮箱或者手机号码"))
        }
        if (userName.length < 6) {
            return JuaBox.showWrong(bitbank.L("用户名最少6位字符，请重新输入"))
        }
        if (userType == 2 && !M.isEmail(userName)) {
            return JuaBox.showWrong(bitbank.L("邮箱格式错误，请重新输入"))
        }
        if (userType == 1 && !M.isAllNumber(userName.replace(/[+,-]/g, ""))) {
            return JuaBox.showWrong(bitbank.L("手机号码格式错误，请重新输入"))
        }
        if (pwdLevel < 40) {
            return JuaBox.showWrong(bitbank.L("密码8~20位字符，且为字母、数字、符号等任意2种以上组合。"))
        }
        if (setPassword != repeatPassword) {
            return JuaBox.showWrong(bitbank.L("两次密码输入不一致，请重新输入"))
        }
        if (imgCode.length < 4 && needImgCode) {
            return JuaBox.showWrong(bitbank.L("图形验证码最少4位字符，请重新输入"))
        }
        if (userType == 1 && takeMsgCode == false) {
            return JuaBox.showWrong(bitbank.L("请先获取短信验证码"))
        }
        if (userType == 1 && msgCode.length < 6) {
            return JuaBox.showWrong(bitbank.L("短信验证码最少6位字符，请重新输入"))
        }
        if (regAgreement == false) {
            return JuaBox.showWrong(bitbank.L("请您同意ZB用户服务协议"))
        }
        lockRequest = true;
        $(submitBtn).button("loading");
        $.ajax({
            url: DOMAIN_VIP + "/user/" + (userType == 2 ? "emailReg" : "mobileReg"),
            type: "POST",
            data: {
                phonenumber: userName,
                email: userName,
                password: setPassword,
                code: imgCode,
                mobileCode: msgCode,
                pwdLevel: pwdLevel,
                tuijianId: recommendId,
                countryCode: countryCode,
                regAgreement: regAgreement
            },
            complete: function () {
                lockRequest = false;
                $(submitBtn).button("reset");
                $("#imgCode").val("");
                $(getImgBtn).click()
            },
            dataType: "json",
            success: function (json) {
                if (json.isSuc) {
                    if (userType == 2) {
                        window.top.location.href = DOMAIN_VIP + "/user/emailTips?type=1&nid=" + json.des
                    } else {
                        window.top.location.href = DOMAIN_VIP + "/u/safe/setSafePwd"
                    }
                } else {
                    JuaBox.info(json.des)
                }
            }
        })
    };
    user.findLoginPwd = function () {
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (userType == 0) {
            return JuaBox.showWrong(bitbank.L("请输入正确的邮箱或者手机号码"))
        }
        if (userName.length < 6) {
            return JuaBox.showWrong(bitbank.L("用户名最少6位字符，请重新输入"))
        }
        if (userType == 2 && !M.isEmail(userName)) {
            return JuaBox.showWrong(bitbank.L("邮箱格式错误，请重新输入"))
        }
        if (userType == 1 && !M.isAllNumber(userName.replace(/[+,-]/g, ""))) {
            return JuaBox.showWrong(bitbank.L("手机号码格式错误，请重新输入"))
        }
        if (imgCode.length < 4 && needImgCode) {
            return JuaBox.showWrong(bitbank.L("图形验证码最少4位字符，请重新输入"))
        }
        if (userType == 1 && takeMsgCode == false) {
            return JuaBox.showWrong(bitbank.L("请先获取短信验证码"))
        }
        if (userType == 1 && msgCode.length < 6) {
            return JuaBox.showWrong(bitbank.L("短信验证码最少6位字符，请重新输入"))
        }
        lockRequest = true;
        $(submitBtn).button("loading");
        $.ajax({
            url: DOMAIN_VIP + "/service/self/doLoginPwd",
            type: "POST",
            data: {
                userName: userName,
                method: userType == 1 ? "mobile" : "email",
                email: userName,
                mobile: userName,
                mobileCode: msgCode,
                countryCode: countryCode,
                code: imgCode,
                cardId: cardId
            },
            complete: function () {
                lockRequest = false;
                $(submitBtn).button("reset");
                $("#imgCode").val("");
                $(getImgBtn).click()
            },
            dataType: "json",
            success: function (json) {
                if (json.isSuc) {
                    if (userType == 2) {
                        JuaBox.info(bitbank.L("邮箱找回登录密码成功提示", "http://mail." + userName.split("@")[1]))
                    } else {
                        window.location.href = json.datas.url
                    }
                } else {
                    JuaBox.info(json.des)
                }
            }
        })
    };
    user.resetLoginPwd = function () {
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (pwdLevel < 40) {
            return JuaBox.showWrong(bitbank.L("密码8~20位字符，且为字母、数字、符号等任意2种以上组合。"))
        }
        if (setPassword != repeatPassword) {
            return JuaBox.showWrong(bitbank.L("两次密码输入不一致，请重新输入"))
        }
        var encrypt = new RSA();
        encrypt.setPublicKey(rsaPublicKey);
        logPassword = encrypt.encrypt(repeatPassword);
        lockRequest = true;
        $(submitBtn).button("loading");
        $.ajax({
            url: DOMAIN_VIP + "/service/self/doResetPwd",
            type: "POST",
            data: {
                pwd: logPassword,
                reNewPwd: logPassword,
                userId: $("#userId").val(),
                code: $("#code").val(),
                pwdLevel: pwdLevel
            },
            complete: function () {
                lockRequest = false;
                $(submitBtn).button("reset")
            },
            dataType: "json",
            success: function (json) {
                if (json.isSuc) {
                    JuaBox.sure(json.des, {
                        closeFun: function () {
                            window.location.href = DOMAIN_VIP + "/u/"
                        }
                    })
                } else {
                    JuaBox.sure(json.des)
                }
            }
        })
    };
    user.findSafePwd = function () {
        if (!user.isLogin()) {
            return JuaBox.showWrong(bitbank.L("请您登录后再进行操作"))
        }
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (userType == 0) {
            return JuaBox.showWrong(bitbank.L("请输入正确的邮箱或者手机号码"))
        }
        if (userName.length < 6) {
            return JuaBox.showWrong(bitbank.L("用户名最少6位字符，请重新输入"))
        }
        if (logPassword.length < 6) {
            return JuaBox.showWrong(bitbank.L("登录密码最少6位字符，请重新输入"))
        }
        if (userType == 2 && !M.isEmail(userName)) {
            return JuaBox.showWrong(bitbank.L("邮箱格式错误，请重新输入"))
        }
        if (userType == 1 && !M.isAllNumber(userName.replace(/[+,-]/g, ""))) {
            return JuaBox.showWrong(bitbank.L("手机号码格式错误，请重新输入"))
        }
        if (imgCode.length < 4 && needImgCode) {
            return JuaBox.showWrong(bitbank.L("图形验证码最少4位字符，请重新输入"))
        }
        if (userType == 1 && takeMsgCode == false) {
            return JuaBox.showWrong(bitbank.L("请先获取短信验证码"))
        }
        if (userType == 1 && msgCode.length < 6) {
            return JuaBox.showWrong(bitbank.L("短信验证码最少6位字符，请重新输入"))
        }
        var encrypt = new RSA();
        encrypt.setPublicKey(rsaPublicKey);
        logPassword = encrypt.encrypt(logPassword);
        lockRequest = true;
        $(submitBtn).button("loading");
        $.ajax({
            url: DOMAIN_VIP + "/service/self/doSafePwd",
            type: "POST",
            data: {
                userName: userName,
                passWord: logPassword,
                method: userType == 1 ? "mobile" : "email",
                email: userName,
                mobile: userName,
                mobileCode: msgCode,
                countryCode: countryCode,
                code: imgCode,
                pubTag: rsaPublicKey
            },
            complete: function () {
                lockRequest = false;
                $(submitBtn).button("reset");
                $("#imgCode").val("");
                $(getImgBtn).click()
            },
            dataType: "json",
            success: function (json) {
                if (json.isSuc) {
                    if (userType == 2) {
                        JuaBox.info(bitbank.L("邮箱找回登录密码成功提示", "http://mail." + userName.split("@")[1]))
                    } else {
                        window.location.href = json.datas.url
                    }
                } else {
                    JuaBox.info(json.des)
                }
            }
        })
    };
    user.resetSafePwd = function () {
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (pwdLevel != 20) {
            return JuaBox.showWrong(bitbank.L("资金密码格式错误，请输入6位数字"))
        }
        if (setSafePwd != repeatSafePwd) {
            return JuaBox.showWrong(bitbank.L("两次密码输入不一致，请重新输入"))
        }
        if ($("#googleCode").is(":hidden") == false && googleCode.length < 4) {
            return JuaBox.showWrong(bitbank.L("请输入Google验证码"))
        }
        lockRequest = true;
        $(submitBtn).button("loading");
        $.ajax({
            url: DOMAIN_VIP + "/service/self/doResetSafe",
            type: "POST",
            data: {
                safePwd: setSafePwd,
                userId: $("#userId").val(),
                safeLevel: pwdLevel,
                code: $("#code").val(),
                googleCode: $("#googleCode").val()
            },
            complete: function () {
                lockRequest = false;
                $(submitBtn).button("reset")
            },
            dataType: "json",
            success: function (json) {
                if (json.isSuc) {
                    JuaBox.sure(json.des, {
                        closeFun: function () {
                            window.location.href = DOMAIN_VIP + "/u/"
                        }
                    })
                } else {
                    JuaBox.sure(json.des)
                }
            }
        })
    };
    user.setSafePwd = function () {
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (pwdLevel != 20) {
            return JuaBox.showWrong(bitbank.L("资金密码格式错误，请输入6位数字"))
        }
        if (setSafePwd != repeatSafePwd) {
            return JuaBox.showWrong(bitbank.L("两次密码输入不一致，请重新输入"))
        }
        lockRequest = true;
        $(submitBtn).button("loading");
        $.ajax({
            url: DOMAIN_VIP + "/u/safe/doSetSafePwd",
            type: "POST",
            data: {safePwd: setSafePwd, mobileCode: msgCode, safeLevel: pwdLevel},
            complete: function () {
                lockRequest = false;
                $(submitBtn).button("reset")
            },
            dataType: "json",
            success: function (json) {
                if (json.isSuc) {
                    JuaBox.showRight(json.des, {
                        closeFun: function () {
                            window.top.location.href = "/u/auth/simple"
                        }
                    })
                } else {
                    if ("repeatSet" == json.des) {
                        JuaBox.sure(bitbank.L("您已设置资金安全密码，此方式设置无效，请直接修改。"), {
                            closeFun: function () {
                                window.top.location.href = "/u/safe/safeword"
                            }
                        })
                    } else {
                        JuaBox.sure(json.des)
                    }
                }
            }
        })
    };
    user.checkUserNike = function (nike) {
        if (typeof nike == "undefined" || nike.length == 0) {
            return $("#countryGroup,#msgCodeForm").hide()
        }
        var nike = $.trim(nike);
        if (M.hasLetter(nike) || M.hasOther(nike) || M.hasChinese(nike)) {
            if (M.isEmail(nike)) {
                $("#countryGroup,#msgCodeForm").hide();
                userType = 2
            } else {
                $("#countryGroup,#msgCodeForm").hide();
                userType = 0
            }
        } else {
            $("#countryGroup,#msgCodeForm").show();
            userType = 1
        }
    };
    user.checkPwdStrength = function (pwd, div) {
        var level = 0, index = 1, div = div || ".bk-pwdcheck";
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
        $(div).find("input[name='pwdLevel']").val(level * 20)
    };
    user.checkSafePwdStrength = function (pwd, div) {
        var level = 0, index = 1, div = div || ".bk-pwdcheck";
        if (pwd.length == 6) {
            if (/\d/.test(pwd)) {
                level++
            }
        }
        if (level == 0) {
            index = 1
        }
        if (level == 1) {
            index = 2
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
        $(div).find("input[name='pwdLevel']").val(level * 20)
    };
    user.getMsgCode = function (type, callback) {
        if (lockRequest) {
            return JuaBox.showWrong(bitbank.L("您有未完成的提交申请，请等待后重试"))
        }
        var $this = this;
        $this.formDataInit();
        if (type != "setSafePwd") {
            if (userName.length < 6) {
                return JuaBox.showWrong(bitbank.L("用户名最少6位字符，请重新输入"))
            }
            if (userType == 1 && !M.isAllNumber(userName.replace(/[+,-]/g, ""))) {
                return JuaBox.showWrong(bitbank.L("手机号码格式错误，请重新输入"))
            }
            if (imgCode.length < 4 && needImgCode) {
                return JuaBox.showWrong(bitbank.L("图形验证码最少4位字符，请重新输入"))
            }
        }
        var data = {phonenumber: userName, countryCode: countryCode, code: imgCode, codeType: 1};
        var url = DOMAIN_VIP + "/user/sendCode";
        if (type == "register") {
            data.codeType = 1
        }
        if (type == "findLoginPwd") {
            data.codeType = 2;
            data.cardId = cardId
        }
        if (type == "findSafePwd") {
            data.codeType = 43;
            url = DOMAIN_VIP + "/user/userSendCode"
        }
        if (type == "setSafePwd") {
            data.codeType = 20;
            url = DOMAIN_VIP + "/user/userSendCode"
        }
        lockRequest = true;
        $.ajax({
            url: url, type: "POST", data: data, complete: function () {
                lockRequest = false;
                takeMsgCode = true
            }, dataType: "json", success: function (json) {
                if (json.isSuc) {
                    JuaBox.showRight(json.des);
                    if ($.isFunction(callback)) {
                        callback()
                    }
                    return (function (getMsgBtn) {
                        var _arguments = arguments;
                        if (codeCountTime == 0) {
                            $(getMsgBtn).removeAttr("disabled").text(bitbank.L("点击获取"));
                            codeCountTime = 60
                        } else {
                            $(getMsgBtn).attr("disabled", true).text(bitbank.L("n秒后重试", codeCountTime));
                            codeCountTime--;
                            return setTimeout(function () {
                                _arguments.callee(getMsgBtn)
                            }, 1000)
                        }
                    })(getMsgBtn)
                } else {
                    JuaBox.sure(json.des);
                    $("#imgCode").val("");
                    $(getImgBtn).click()
                }
            }
        })
    };
    user.getPublicKey = function (callback) {
        var $this = this;
        $.getJSON(DOMAIN_VIP + "/user/getPubTag?d=" + new Date().getTime(), function (json) {
            $('input[name="publicKey"]').val(json.datas.pubTag);
            rsaPublicKey = json.datas.pubTag;
            if ($.isFunction(callback)) {
                callback()
            }
        })
    };
    user.getUserInfo = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        $.getJSON(DOMAIN_VIP + "/u/getUserInfo?callback=?", function (result) {
            $this.vipRate = result.vipRate;
            $this.totalPoints = result.totalPoints;
            $this.simpleAuth = result.simpleAuth;
            $this.depthAuth = result.depthAuth;
            $this.videoAuth = result.videoAuth;
            $this.emailAuth = result.emailAuth;
            $this.mobileAuth = result.mobileAuth;
            $this.googleAuth = result.googleAuth;
            $this.pwdStatus = result.pwdStatus;
            $this.safePwdStatus = result.safePwdStatus;
            if ($.isFunction(callback)) {
                callback()
            }
        })
    };
    user.safePwdForm = function () {
        var safePwdHtml = "";
        safePwdHtml += "<div id='safeWordForm' class='form-inline'>";
        safePwdHtml += "<div class='bk-tabList'>";
        safePwdHtml += "  <div class='bk-tabList-bd clearfix' style='padding:30px 20px 0px 20px;'>";
        safePwdHtml += "    <div class='form-group' style='width:100%; font-size:12px; margin-bottom:10px;'>";
        safePwdHtml += "      <label for='safePwd' class='control-label'>" + bitbank.L("请输入您的安全密码") + "</label>";
        safePwdHtml += "      <input type='password' class='form-control' id='safePwd' name='safePwd' style='width:200px'>";
        safePwdHtml += "      <a target='_blank' href='" + DOMAIN_VIP + "/service/self/forgetSafePwd'>" + bitbank.L("忘记安全密码") + "？</a>";
        safePwdHtml += "    </div>";
        safePwdHtml += "    <div class='form-group' style='width:100%; padding-left:125px; font-size:12px; margin-bottom:10px;'>";
        safePwdHtml += "      <label class='radio-inline'>";
        safePwdHtml += "        <input type='radio' name='closeStatu' value='6' checked='checked' style='margin-top:8px;'>" + bitbank.L("关闭6小时");
        safePwdHtml += "      </label>";
        safePwdHtml += "      <label class='radio-inline'>";
        safePwdHtml += "        <input type='radio' name='closeStatu' value='1' style='margin-top:8px;'>" + bitbank.L("永久关闭");
        safePwdHtml += "      </label>";
        safePwdHtml += "    </div>";
        safePwdHtml += "    <input type='hidden' id='needMobile' name='needMobile' value='false'/>";
        safePwdHtml += "    <input type='hidden' id='needPwd' name='needPwd' value='true'/>";
        safePwdHtml += "    <p style='font-size:12px;'>" + bitbank.L("温馨提示：您可以在安全中心重新开启交易安全密码。") + "</p>";
        safePwdHtml += "  </div>";
        safePwdHtml += "</div>";
        safePwdHtml += "</div>";
        return safePwdHtml
    };
    user.closeSafePwd = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        JuaBox.info($this.safePwdForm(), {
            btnFun1: function (JuaId) {
                if ($("#safePwd").val() == "" || $("#safePwd").val().length < 6) {
                    return JuaBox.info(bitbank.L("资金安全密码不能少于6位数，也不能为空。"))
                }
                $.post(DOMAIN_VIP + "/u/safe/useOrCloseSafePwd?callback=?", {
                    payPass: $("#safePwd").val(),
                    closeStatu: $('input[name="closeStatu"]:checked').val(),
                    needMobile: $("#needMobile").val(),
                    needPwd: $("#needPwd").val()
                }, function (json) {
                    var des = json.des;
                    if (json.isSuc) {
                        JuaBox.close(JuaId, function () {
                            JuaBox.info(des);
                            if ($.isFunction(callback)) {
                                callback()
                            }
                        })
                    } else {
                        JuaBox.info(des)
                    }
                }, "json")
            }, endFun: function (JuaId) {
                $("#JuaBox_" + JuaId).keypress(function (e) {
                    if (e.keyCode == 13) {
                        $("#JuaBtn_" + JuaId + "_1").click()
                    }
                })
            }
        })
    };
    user.openSafePwd = function (callback) {
        if (!user.isLogin()) {
            return false
        }
        JuaBox.info(bitbank.L("您确定要开启交易安全密码吗？"), {
            btnFun1: function (JuaId) {
                $.getJSON(DOMAIN_VIP + "/u/safe/useOrCloseSafePwd?callback=?", function (json) {
                    JuaBox.close(JuaId, function () {
                        JuaBox.showTip(json.des);
                        if ($.isFunction(callback)) {
                            callback()
                        }
                    })
                })
            }
        })
    };
    user.useOrCloseTip = function (type, status, callback) {
        if (!user.isLogin()) {
            return false
        }
        $.getJSON(DOMAIN_VIP + "/u/safe/useOrCloseFun?attr=" + type + "&closeStatu=" + status + "&callback=?", function (json) {
            JuaBox.showTip(json.des);
            if ($.isFunction(callback)) {
                callback()
            }
        })
    };
    user.hasSafePwd = function () {
        if (!user.isLogin()) {
            return false
        }
        var $this = this;
        $.ajax({
            async: false,
            url: DOMAIN_VIP + "/u/safe/isTransSafe?callback=?",
            type: "post",
            dataType: "json",
            success: function (json) {
                if (json.des == "false") {
                    return false
                } else {
                    return true
                }
            }
        })
    };
    user.qrcodeLoginInit = function (t) {
        var $this = this;
        clearInterval($this.qrcodeTimer);
        $this.qrcodeTimer = setInterval(function (t) {
            var qrcode = $("#qrcode").val();
            if (!qrcode) {
                return
            }
            $.ajax({
                async: false,
                url: DOMAIN_VIP + "/user/deteQrcodeStatus?qrcode=" + qrcode,
                type: "post",
                dataType: "json",
                success: function (json) {
                    console.info("deteQrcodeStatus", json);
                    if (json.isSuc) {
                        $this.handleQrcodeLogin(json, false)
                    }
                }
            })
        }, 500)
    };
    user.qrcodeLoginBySocket = function (result) {
        var $this = this;
        var jsonData = eval("(" + result.msg + ")");
        $this.handleQrcodeLogin(jsonData, true)
    };
    user.handleQrcodeLogin = function (jsonData, alert) {
        if (jsonData.isSuc) {
            if (jsonData.datas.type && jsonData.datas.type == 1) {
                $(".qk_login_fail").hide();
                $(".qk_login_succ").show()
            } else {
                if (jsonData.datas.type && jsonData.datas.type == 2) {
                    $.ajax({
                        async: false,
                        url: DOMAIN_VIP + "/user/qrcodeLogin?qrcode=" + $("#qrcode").val(),
                        type: "post",
                        dataType: "json",
                        success: function (json) {
                            if (json.isSuc) {
                                window.location.href = DOMAIN_VIP + "/u"
                            } else {
                                JuaBox.sure(json.des)
                            }
                        }
                    })
                } else {
                    if (jsonData.datas.type && jsonData.datas.type == 3) {
                        $(".qk_login_fail").show();
                        $(".qk_login_succ").hide()
                    }
                }
            }
        } else {
            if (alert) {
                JuaBox.sure(jsonData.des)
            }
        }
    };
    user.refreshLoginQrcode = function (t) {
        $.ajax({
            url: DOMAIN_VIP + "/user/refreshLoginQrcode", type: "post", dataType: "json", success: function (json) {
                if (json.isSuc) {
                    $("#qrcode").val(json.des);
                    $("#qrcodeImg").attr("src", DOMAIN_VIP + "/service/qrcode?code=" + DOMAIN_MAIN + "%2fmobile%2fapp%3fm%3dlogin%26qrcode%3d" + json.des + "&width=210&height=210");
                    $(".qk_login_fail").hide();
                    $(".qk_login_succ").hide();
                    user.qrcodeLoginInit()
                } else {
                    JuaBox.sure(json.des)
                }
            }
        })
    };
    module.exports = user;
    (function () {
        return this || (0, eval)("this")
    }()).USER = user
});