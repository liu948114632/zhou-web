(function (i) {
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var f = document.createElement("style");
        f.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}"));
        document.getElementsByTagName("head")[0].appendChild(f)
    }
    var g = i("body").width(), p = false;
    i(".code").each(function (q, r) {
        i(this).attr("id", "codeId_" + q);
        if (i(this).is(":hidden") == false) {
            CodeMirror.fromTextArea(document.getElementById("codeId_" + q), {
                lineNumbers: true,
                mode: "text/javascript",
                matchBrackets: true
            })
        }
    });
    i(".api-link").on("click", function () {
        var t = i(this), s = t.parents("td").find(".api-detail"), q = s.find(".code"), r = s.find(".CodeMirror");
        t.toggleClass("open");
        s.fadeToggle(100, function () {
            q.each(function (u, v) {
                if (i(this).is(":hidden") == false) {
                    CodeMirror.fromTextArea(document.getElementById(i(this).attr("id")), {
                        lineNumbers: true,
                        mode: "text/javascript",
                        matchBrackets: true
                    })
                }
            });
            i("body").scrollspy("refresh")
        })
    });
    i("body").scrollspy({target: "aside.envor-widget"});
    i(window).scroll(function () {
        if (i(this).scrollTop() > 40) {
            i("#to-the-top").fadeIn()
        } else {
            i("#to-the-top").fadeOut()
        }
    });
    if (g > 992 && i("aside.envor-widget").outerHeight() < 450) {
        i("aside.envor-widget").affix({offset: {top: 360, bottom: 110}})
    }
    i("#to-the-top").click(function () {
        i("body,html").animate({scrollTop: 0}, 500)
    });
    i("aside.envor-widget li").on("click", "a", function () {
        i("aside.envor-widget li").not(i(this).parent()).removeClass("open");
        i(this).parent().toggleClass("open")
    });
    i(".envor-about-widget p.contacts").first().css({"border-top-width": "1px", "margin-top": "30px"});
    i(".envor-content").find(".envor-section").each(function () {
        i(this).each(function () {
            i(this).find(".row").each(function () {
                if (g < 992) {
                }
            })
        })
    });
    if (g > 768) {
        i(".envor-section").each(function () {
            i(this).find('[class*="col-"]').each(function () {
            })
        })
    }
    i("blockquote").each(function () {
        var q = i(this).text();
        i(this).html('<i class="fa fa-quote-left"></i>' + q + '<i class="fa fa-quote-right"></i>');
        i(this).wrapInner('<div class="blockquote-inner"></div>')
    });
    i(".envor-partner-1").each(function () {
    }).last().css("border-bottom-width", "1px");
    i(".envor-projects-listing").each(function () {
        var s = i(this), t = parseInt(s.find(".envor-listing-item").css("padding-left")),
            q = parseInt(s.parents('[class*="col-"]').width()) + t, r = 0, u = s.find(".envor-listing-item");
        s.css({"margin-left": -t, width: q});
        if (s.hasClass("envor-projects-listing-3-cols")) {
            if (g < 768) {
                u.width(100 + "%")
            } else {
                u.width(s.width() / 3 - 30)
            }
        }
        if (s.hasClass("envor-projects-listing-4-cols")) {
            if (g < 768) {
                u.width(100 + "%")
            } else {
                u.width(s.width() / 4 - 30)
            }
        }
        if (s.hasClass("envor-projects-listing-5-cols")) {
            if (g < 768) {
                u.width(100 + "%")
            } else {
                u.width(s.width() / 5 - 30)
            }
        }
    });
    i(".envor-property-2, .envor-property-3").each(function () {
        var q = parseInt(i(this).find("figure").height());
        i(this).find(".envor-property-1-inner").height(q + 2)
    });
    i(".envor-single-estate").each(function () {
        var s = i(this), r = s.find(".envor-propert-details"), q = parseInt(r.parents('[class*="col-"]').width());
        if (g > 768) {
            r.width(q / 3 + 10).first().css("margin-left", "-31px");
            r.find(".inner").css({"padding-left": "30px"})
        } else {
            r.width(q).first().css("margin-left", "0px");
            r.find(".inner").css({"padding-left": "0px", "margin-bottom": "30px"});
            r.last().find(".inner").css("margin-bottom", "0px")
        }
    });
    i(".shoppin-cart-table").find("tr").each(function () {
        var u = i(this), t = u.find("i.fa"), v = u.find("input[name*=qty]"), r = u.find("span.total"),
            q = u.find(".qty-fld"), s = u.find("input[name*=price]").val();
        t.click(function () {
            var w = parseInt(q.html());
            if (i(this).hasClass("fa-plus")) {
                q.html(w + 1);
                r.html("$" + (w + 1) * s)
            }
            if (i(this).hasClass("fa-minus")) {
                if (w != 1) {
                    q.html(w - 1);
                    r.html("$" + (w - 1) * s)
                }
            }
        })
    }).hover(function () {
        i(this).addClass("hover")
    }, function () {
        i(this).removeClass("hover")
    });
    i("#prod-qty").find("i.fa").click(function () {
        var r = i(this).parents("#prod-qty").find(".qty-fld"), s = i("#prod-qty-fld"), q = parseInt(r.html());
        if (i(this).hasClass("fa-plus")) {
            r.html(q + 1);
            s.val(q + 1)
        }
        if (i(this).hasClass("fa-minus")) {
            if (q != 1) {
                r.html(q - 1);
                s.val(q - 1)
            }
        }
    });
    i(".envor-tabs").each(function () {
        var s = i(this), r = s.find("header span"), q = s.find("article");
        i('<div class="arrow"></div>').appendTo(r);
        q.first().show();
        r.first().addClass("active").end().click(function () {
            r.removeClass("active");
            i(this).addClass("active");
            q.hide().eq(i(this).index()).fadeIn()
        })
    });
    i(".envor-msg").each(function () {
        var q = i(this);
        q.find(".fa").click(function () {
            q.fadeOut()
        })
    });
    i(".envor-social-button-2").hover(function () {
        i(this).find(".esb-tooltip").stop(true, true).fadeIn()
    }, function () {
        i(this).find(".esb-tooltip").stop(true, true).fadeOut()
    });
    i(".envor-toggle").each(function () {
        var t = i(this), s = t.find("article"), q = s.find("header"), r = s.find(".detail");
        r.hide();
        q.removeClass("active");
        s.last().css("margin-bottom", "0px");
        s.each(function () {
            var u = i(this);
            if (u.hasClass("open")) {
                u.find(".fa").addClass("fa-minus");
                u.find("header").addClass("active");
                u.find(".detail").show()
            }
        });
        q.click(function () {
            q.parent().removeClass("open");
            if (i(this).hasClass("active")) {
                i(this).find(".fa").removeClass("fa-minus");
                i(this).removeClass("active");
                i(this).parent().find(".detail").slideUp()
            } else {
                q.removeClass("active");
                r.slideUp();
                q.find(".fa").removeClass("fa-minus");
                i(this).find(".fa").addClass("fa-minus");
                i(this).addClass("active");
                i(this).parent().find(".detail").slideDown()
            }
        })
    });
    i(".envor-feature").each(function () {
        i('<span class="arrow-color"></span>').appendTo(i(this).find("header"))
    });
    if (g < 768) {
        i(".envor-feature, .envor-feature-2").last().css("margin-bottom", "0px")
    }
    i(".envor-header-2 .envor-header-bg .social-buttons ul li a").hover(function () {
        i(this).find("i").addClass("animated rotateIn")
    }, function () {
        i(this).find("i").removeClass("animated rotateIn")
    });
    i(".envor-section-twitter-1").hover(function () {
        i(this).find("i.fa-twitter").addClass("animated bounceIn")
    }, function () {
        i(this).find("i.fa-twitter").removeClass("animated bounceIn")
    });
    i(".envor-feature-store").each(function () {
        i('<span class="arrow"></span>').prependTo(i(this))
    }).hover(function () {
        i(this).find("i").addClass("animated rotateIn")
    }, function () {
        i(this).find("i").removeClass("animated rotateIn")
    });
    i(".envor-feature-3, .envor-feature-3").hover(function () {
        i(this).find(".fa, .glyphicon").addClass("animated rotateIn")
    }, function () {
        i(this).find(".fa, .glyphicon").removeClass("animated rotateIn")
    });
    i(".envor-estate-search-type span").on("click", function () {
        i(".envor-estate-search-type span").removeClass("active");
        i(this).addClass("active").parent().find("input").val(i(this).attr("data-val"))
    });
    i(".envor-estate-form-item").each(function () {
        var t = i(this), q = t.find("span.val"), s = t.find(".envor-efi-list"), r = s.find("input[type=checkbox]");
        if (s.find("> p").length > 8) {
            s.css({overflow: "scroll", "overflow-x": "hidden"})
        }
        t.find("i.fa-caret-down").click(function () {
            s.slideToggle();
            i(this).toggleClass("fa-caret-up")
        });
        r.on("click", function () {
            var u = r.filter(":checked");
            if (u.length == 1) {
                q.html(u.val())
            }
            if (u.length == 0) {
                q.html("Choose...")
            }
            if (u.length > 1) {
                q.html("Multiple")
            }
        })
    });
    i(".envor-top-bar").find("ul.social-btns li").each(function () {
        var s = i(this), r = s.find("a"), q = r.first();
        r.addClass("regular").clone().removeClass("regular").addClass("hover").appendTo(s);
        s.hover(function () {
            i(this).find("a.regular").stop(true, true).animate({top: "-40px"}, 200);
            i(this).find("a.hover").stop(true, true).animate({top: "0px"}, 200)
        }, function () {
            i(this).find("a.regular").stop(true, true).animate({top: "0px"}, 200);
            i(this).find("a.hover").stop(true, true).animate({top: "40px"}, 200)
        })
    });
    i(".envor-top-bar .shopping-cart").each(function () {
        i(this).find(" > span i.fa").addClass("regular").clone().removeClass("regular").appendTo(i(this).find(" > span")).addClass("hover");
        i(this).hover(function () {
            i(this).find(" > span i.regular").stop(true, true).animate({top: "-40px"}, 200);
            i(this).find(" > span i.hover").stop(true, true).animate({top: "0px"}, 200);
            i(this).find(".cart").stop(true, true).fadeIn()
        }, function () {
            i(this).find(" > span i.regular").stop(true, true).animate({top: "0px"}, 200);
            i(this).find(" > span i.hover").stop(true, true).animate({top: "40px"}, 200);
            i(this).find(".cart").stop(true, true).fadeOut()
        });
        var q = i(this).find(".cart .cart-entry");
        i("#topbarcart").mCustomScrollbar();
        i(this).find(".cart").hide()
    });
    var k = 0;
    i(".envor-header-1 .envor-header-bg nav > ul > li, .envor-header-1 .envor-header-bg nav > ul > li ul > li, .envor-header-2 .envor-desktop-menu-bg nav li, .envor-header-3 .envor-desktop-menu-bg nav li").filter(":not(.envor-mega li)").each(function () {
        i('<span class="hover"></span>').appendTo(i(this))
    }).hover(function () {
        i(this).find("> .hover").stop(true, true).fadeIn(200)
    }, function () {
        i(this).find("> .hover").stop(true, true).fadeOut(200)
    });
    i(".envor-header-1 .envor-header-bg nav li, .envor-header-2 .envor-desktop-menu-bg nav li, .envor-header-3 .envor-desktop-menu-bg nav li").hover(function () {
        var r = i(this).find("> ul"), q = i(this).find(".envor-mega");
        if (r.length > 0) {
            if (p) {
                r.show().addClass("animated flipInY")
            } else {
                r.stop(true, true).fadeIn()
            }
        }
        if (q.length > 0) {
            if (p) {
                q.show().addClass("animated flipInY")
            } else {
                q.fadeIn()
            }
        }
    }, function () {
        var r = i(this).find("> ul"), q = i(this).find(".envor-mega");
        if (p) {
            r.removeClass("animated flipInY").fadeOut(200);
            q.removeClass("animated flipInY").fadeOut(200)
        } else {
            r.stop(true, true).fadeOut();
            q.stop(true, true).fadeOut()
        }
    });
    i(".envor-header-1 .envor-header-bg nav > ul > li, .envor-header-2 .envor-desktop-menu-bg nav > ul > li").each(function () {
        var q = i(this).find(".envor-mega");
        if (q.length != 0) {
            k = i(this).index()
        }
    }).hover(function () {
        var q = i(".envor-header nav > ul > li").length;
        if (i(this).index() == (q - 1)) {
            i(this).find("> ul").addClass("left")
        }
    });
    function n() {
        if (i(".envor-header-1 .envor-mega").length != 0) {
            var t = i(".envor-mega"), x = t.find(".envor-mega-section"),
                q = i(".envor-header-1 .envor-header-bg nav > ul > li"), y = 0, v = 0, z = 100 / x.length;
            q.slice(k + 1).each(function () {
                y = y + i(this).width() + parseInt(i(this).css("padding-left")) + parseInt(i(this).css("padding-right")) + parseInt(i(this).css("border-left-width")) + parseInt(i(this).css("border-right-width"))
            });
            t.width(i(".col-lg-12").width()).css("right", "-" + y + "px");
            x.each(function () {
                i(this).width(i(".col-lg-12").width() / x.length - 31)
            }).first().css("border-left-width", "0px");
            x.each(function () {
                i(this).find("li").last().css("border-bottom-width", "0px");
                if (i(this).height() > v) {
                    v = i(this).height()
                }
            }).css("height", v + parseInt(x.css("padding-top")) + parseInt(x.css("padding-bottom")) + "px");
            t.height(v + parseInt(x.css("padding-top")) + parseInt(x.css("padding-bottom")) + "px").hide()
        }
        if (i(".envor-header-2 .envor-mega").length != 0) {
            var t = i(".envor-mega"), x = t.find(".envor-mega-section"),
                q = i(".envor-header-2 .envor-desktop-menu-bg nav > ul > li"), r = 0, v = 0, z = 100 / x.length;
            q.slice(0, k).each(function () {
                r = r + i(this).width() + parseInt(i(this).css("padding-left")) + parseInt(i(this).css("padding-right")) + parseInt(i(this).css("border-left-width")) + parseInt(i(this).css("border-right-width"))
            });
            t.width(i(".col-lg-12").width()).css("left", "-" + r + "px");
            x.each(function () {
                i(this).width(i(".col-lg-12").width() / x.length - 31)
            }).first().css("border-left-width", "0px");
            x.each(function () {
                i(this).find("li").last().css("border-bottom-width", "0px");
                if (i(this).height() > v) {
                    v = i(this).height()
                }
            }).css("height", v + parseInt(x.css("padding-top")) + parseInt(x.css("padding-bottom")) + "px");
            t.height(v + parseInt(x.css("padding-top")) + parseInt(x.css("padding-bottom")) + "px").hide()
        }
        if (i(".envor-header-3 .envor-mega").length != 0) {
            var t = i(".envor-mega"), x = t.find(".envor-mega-section"), u, s = 0, v = 0, z = 100 / x.length;
            u = t.offset();
            s = u.left - (i(window).width() - i(".col-lg-12").width()) / 2 - parseInt(i(".col-lg-12").css("padding-left"));
            t.width(i(".col-lg-12").width()).css("left", "-" + s + "px");
            x.each(function () {
                i(this).width(i(".col-lg-12").width() / x.length - 31)
            }).first().css("border-left-width", "0px");
            x.each(function () {
                i(this).find("li").last().css("border-bottom-width", "0px");
                if (i(this).height() > v) {
                    v = i(this).height()
                }
            }).css("height", v + parseInt(x.css("padding-top")) + parseInt(x.css("padding-bottom")) + "px");
            t.height(v + parseInt(x.css("padding-top")) + parseInt(x.css("padding-bottom")) + "px").hide()
        }
    }

    n();
    i('<span class="border"></span>').appendTo(i(".envor-links-widget li"));
    i(".envor-links-widget ul > li").last().find(".border").remove().detach();
    i(".envor-category-widget ul li").hover(function () {
        i(this).find("p span").addClass("hovered")
    }, function () {
        i(this).find("p span").removeClass("hovered")
    });
    i("#envor-mobile-menu nav").append(i("#envor-header-menu nav").html());
    var j = i(".envor-mobile-menu nav"), c = 1;
    j.css("max-height", i(window).height() - 40);
    //j.mCustomScrollbar();
    i('<span class="border"></span>').appendTo(j.find("ul li"));
    i('<span class="border"></span>').appendTo(j);
    j.find("li").each(function () {
        var q = i(this).find("> ul");
        if (q.length > 0) {
            i('<i class="glyphicon glyphicon-plus-sign"></i>').appendTo(i(this))
        }
        var r = i(this).find("> i.glyphicon-plus-sign");
        r.click(function () {
            i(this).toggleClass("glyphicon-minus-sign");
            if (i(this).hasClass("glyphicon-minus-sign")) {
                i(this).parent("li").find("> ul").show()
            } else {
                i(this).parent("li").find("> ul").hide()
            }
            j.mCustomScrollbar("update")
        })
    });
//    j.mCustomScrollbar("update");
    i("#envor-mobile-menu-btn").click(function () {
        if (c) {
            i("#envor-mobile-menu").animate({right: "0px"});
            i(this).animate({right: "270px"});
            c = 0
        } else {
            i("#envor-mobile-menu").animate({right: "-270px"});
            i(this).animate({right: "0px"});
            c = 1
        }
        i(this).toggleClass("clicked")
    });
    i("#envor-mobile-cart-btn").click(function () {
        if (c) {
            i("#envor-mobile-cart").animate({right: "0px"});
            i(this).animate({right: "200px"});
            c = 0
        } else {
            i("#envor-mobile-cart").animate({right: "-200px"});
            i(this).animate({right: "0px"});
            c = 1
        }
        i(this).toggleClass("clicked")
    });
    var b = i(".envor-header-2 .envor-header-bg .header-search form");
    b.find("input[type=text]").on("focus", function () {
        b.addClass("focus");
        i(this).animate({width: "150px"});
        b.find("button[type=submit]").addClass("focus")
    });
    b.find("input[type=text]").on("blur", function () {
        b.removeClass("focus");
        i(this).animate({width: "80px"});
        b.find("button[type=submit]").removeClass("focus")
    });
    function a() {
        var q = i(".envor-project");
        q.each(function () {
        })
    }

    setTimeout(function () {
        a()
    }, 1000);
    i(".envor-project, .envor-property-1, .envor-product-1, .envor-post-preview, .envor-post").hover(function () {
        i(this).find("figure figcaption").stop(true, true).fadeIn(200).find("i").stop(true, true).animate({top: "50%"}, 200)
    }, function () {
        i(this).find("figure figcaption").find("i").stop(true, true).animate({top: "0"}, 200).end().stop(true, true).fadeOut(200)
    });
   // i("a.colorbox").colorbox();
    var e = 0;
    i(".envor-partner-logo").each(function () {
        i(this).find("img").fadeTo(0, 0.3);
        if (i(this).find("img").height() > e) {
            e = i(this).height()
        }
    }).height(e - parseInt(i(".envor-partner-logo .inner").css("padding-left")) - parseInt(i(".envor-partner-logo .inner").css("padding-right"))).hover(function () {
        i(this).find("img").stop(true, true).fadeTo(400, 1)
    }, function () {
        i(this).find("img").stop(true, true).fadeTo(400, 0.3)
    });
    i(".envor-career-1").each(function () {
        var q = i(this);
        i(this).find("a.show-details").click(function (r) {
            r.preventDefault();
            i(this).find("i.fa").toggleClass("fa-minus");
            q.find(".details").slideToggle()
        })
    }).last().css("border-bottom-width", "1px");
    i(".envor-pricing-1 header .plan-price").each(function () {
        i('<span class="arrow"></span>').prependTo(i(this))
    });
    function m() {
        i(".envor-pricing-2").each(function () {
            var r = i(this), t = r.find(".envor-pricing-2-item"), q = 0, s = t.length;
            t.each(function () {
                if (i("body").width() > 768) {
                    i(this).width(r.width() / s)
                } else {
                    i(this).css("width", "100%")
                }
                if (i(this).hasClass("envor-pricing-2-item-featured")) {
                    q = i(this).index()
                }
            }).last().css("border-right-width", "1px").end().eq(q + 1).css("border-left-width", "0px")
        })
    }

    m();
    i(".envor-domain-search form .envor-domain-search-inner div.zone i").on("click", function () {
        i(this).toggleClass("fa-caret-up");
        i(this).parent().find("> ul").slideToggle()
    });
    var d = i(".envor-domain-search form .envor-domain-search-inner div.zone span");
    var l = i(".envor-domain-search form .envor-domain-search-inner div.zone ul li");
    l.click(function () {
        d.html("." + i(this).attr("data-val"));
        i(this).parent().slideUp();
        i(".envor-domain-search form .envor-domain-search-inner input[name=domain_zone]").val(i(this).attr("data-val"));
        i(".envor-domain-search form .envor-domain-search-inner div.zone i").removeClass("fa-caret-up")
    });
    i(".envor-domain-price").each(function () {
    }).hover(function () {
        i(this).css("position", "relative").stop(true, true).animate({"margin-top": "-5px"}, 200)
    }, function () {
        i(this).css("position", "relative").stop(true, true).animate({"margin-top": "0px"}, 200)
    });
    setTimeout(function () {
        i(".envor-simple-twiiter-widget ul li").each(function () {
            i('<i class="fa fa-twitter"></i>').appendTo(i(this))
        }).last().css({"margin-bottom": "0px"})
    }, 2000);
    i(".envor-mobile-cart-list").css("max-height", i(window).height() - 40);
    i('<span class="border"></span>').appendTo(i(".envor-mobile-cart-list p"));
    i('<span class="border"></span>').appendTo(i("#envor-mobile-cart h3"));
//    i(".envor-mobile-cart-list").mCustomScrollbar();
    function h() {
        i(".envor-skill-1").each(function () {
            var v = i(this), q = v.width(), x = v.find(".value").attr("data-value"), t = v.find(".color-1"),
                s = v.find(".color-2"), u = v.find(".color-2-wrapper"), y = v.find(".inner"), r = v.find(".value p");
            t.height(q);
            s.height(q);
            y.height(q - 20).width(q - 20).css("line-height", (q - 20) + "px");
            u.animate({height: (q * x / 100) + "px"}, 400)
        })
    }

    h();
    i(".envor-skill-2").each(function () {
        var s = i(this), t = i('<span class="color"></span>'), r = i('<span class="bg"></span>'), q = i("<p></p>");
        t.appendTo(s).width(s.attr("data-value"));
        q.appendTo(s).html(s.attr("data-name") + ": <strong>" + s.attr("data-value") + "</strong>").width(s.attr("data-value"));
        r.appendTo(t).fadeTo(0, 0.05)
    }).last().css("margin-bottom", "0px");
    i(".envor-msg").each(function () {
        var q = i(this);
        q.find(".fa").click(function () {
            q.fadeOut()
        })
    });
    i(".envor-content-404, .envor-content-404-gradient").height(i(window).height() - 40);
    i(".envor-content-404-inner").height(i(window).height() - 40 - i("#socials").height() - parseInt(i("#socials").css("padding-top")) - parseInt(i("#socials").css("padding-bottom")));
    if (i(window).height() < 900) {
        i(".envor-content-404 .envor-soc-buttons-list").css("position", "relative").css("margin-top", "50px")
    }
    i('<span class="line"></span>').appendTo(i(".riva-countdown .riva-countdown-item .value"));
    i("#create-an-account-div").hide();
    i("#create-an-account").change(function () {
        if (i(this).is(":checked")) {
            i("#create-an-account-div").fadeIn()
        } else {
            i("#create-an-account-div").hide()
        }
    });
    i("#ship-to-billing-address-div").hide();
    i("#ship-to-billing-address").change(function () {
        if (i(this).is(":checked")) {
            i("#ship-to-billing-address-div").hide()
        } else {
            i("#ship-to-billing-address-div").fadeIn()
        }
    });
    i(".payment-option span").click(function () {
        i(".payment-option").removeClass("payment-option-active");
        i(this).parents(".payment-option").addClass("payment-option-active");
        i("input[name=payment-option]").val(i(this).parents(".payment-option").attr("data-payment"))
    });
    var o = 0;
    i(".envor-settings i.fa-cog").click(function () {
        if (o) {
            i(this).parents(".envor-settings").animate({left: "-240px"});
            o = 0
        } else {
            i(this).parents(".envor-settings").animate({left: "0px"});
            o = 1
        }
    });
    i('.envor-settings ul [class*="p"]').click(function () {
        i(".envor-boxed-bg").css("background-image", "url(../img/settings/pat" + i(this).attr("data-value") + ".png)")
    });
    i('.envor-settings ul [class*="s"]').click(function () {
        i("#envor-site-color").attr("href", "css/color" + i(this).attr("data-value") + ".css");
        i("#envor-site-boxed-color").attr("href", "../css/color" + i(this).attr("data-value") + ".css")
    });
    i(window).resize(function () {
        a();
        n();
        g = i("body").width();
        if (g > 768 && g < 992) {
            i("section .col-sm-6").css("margin-top", "60px").eq(0).css("margin-top", "0px").end().eq(1).css("margin-top", "0px")
        } else {
            i("section .col-sm-6, .envor-footer .col-sm-6").css("margin-top", "0px")
        }
        if (g < 768) {
            i(".envor-feature").last().css("margin-bottom", "0px")
        }
        h();
        if (i(window).height() < 900) {
            i(".envor-content-404 .envor-soc-buttons-list").css("position", "relative")
        }
        i(".envor-projects-listing").each(function () {
            var s = i(this), t = parseInt(s.find(".envor-listing-item").css("padding-left")),
                q = parseInt(s.parents('[class*="col-"]').width()), r, u = s.find(".envor-listing-item");
            s.css({"margin-left": -t, width: q + t});
            if (s.hasClass("envor-projects-listing-3-cols")) {
                if (g < 768) {
                    u.width(q)
                }
                if (g > 768 && g < 992) {
                    u.width((q + t) / 2 - t)
                }
                if (g > 992) {
                    u.width((q + t) / 3 - t)
                }
            }
            if (s.hasClass("envor-projects-listing-4-cols")) {
                if (g < 768) {
                    u.width(q)
                }
                if (g > 768 && g < 992) {
                    u.width((q + t) / 2 - t)
                }
                if (g > 992) {
                    u.width((q + t) / 4 - t)
                }
            }
            if (s.hasClass("envor-projects-listing-5-cols")) {
                if (g < 768) {
                    u.width(q)
                }
                if (g > 768 && g < 992) {
                    u.width((q + t) / 2 - t)
                }
                if (g > 992) {
                    u.width((q + t) / 5 - t)
                }
            }
        });
        i(".envor-single-estate").each(function () {
            var s = i(this), r = s.find(".envor-propert-details"), q = parseInt(r.parents('[class*="col-"]').width());
            if (g > 768) {
                r.width(q / 3 + 10).first().css("margin-left", "-31px");
                r.find(".inner").css({"padding-left": "30px"})
            } else {
                r.width(q).first().css("margin-left", "0px");
                r.find(".inner").css({"padding-left": "0px", "margin-bottom": "30px"});
                r.last().find(".inner").css("margin-bottom", "0px")
            }
        })
    })
})(jQuery);