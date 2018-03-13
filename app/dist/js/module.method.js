define(function (require, exports, module) {
    var method = {};
    method.fixNumber = function (value, unit) {
        var value = isNaN(value) ? "0" : parseFloat(value).toFixed(9);
        var unit = unit || 0;
        var isInt = value.indexOf(".") == -1 ? true : false;
        var intNum = value.split(".")[0];
        var floatNum = !isInt ? value.split(".")[1] : "0";
        var floatArry = floatNum.split("");
        var newFloatNum = ".";
        for (var i = 0; i < unit; i++) {
            if (!floatArry[i]) {
                newFloatNum += "0"
            } else {
                newFloatNum += floatArry[i]
            }
        }
        return parseFloat(intNum + newFloatNum).toFixed(unit)
    };
    method.isFloat = function (num) {
        if (num) {
            var reg = /^[0-9]*\.?[0-9]*$/;
            if (!reg.test(num)) {
                return false
            }
        } else {
            return false
        }
        return true
    };
    method.fixDecimal = function (value, unit) {
        var $this = this;
        var result = $this.fixNumber(value, unit);
        if (unit > 0) {
            result = parseFloat(result)
        } else {
            result = parseInt(result)
        }
        if (result > 0 && result < 0.000001) {
            result = $this.fixNumber(value, unit)
        }
        return result
    };
    method.fixFloat = function (value, unit) {
        var $this = this;
        var result = $this.fixNumber(value, unit);
        if (unit > 0) {
            result = parseFloat(result)
        } else {
            result = parseInt(result)
        }
        return result
    };
    method.comptime = function (beginTime, endTime) {
        var beginTime = beginTime;
        var endTime = endTime;
        var beginTimes = beginTime.substring(0, 10).split("-");
        var endTimes = endTime.substring(0, 10).split("-");
        beginTime = beginTimes[1] + "-" + beginTimes[2] + "-" + beginTimes[0] + " " + beginTime.substring(10, 19);
        endTime = endTimes[1] + "-" + endTimes[2] + "-" + endTimes[0] + " " + endTime.substring(10, 19);
        var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
        if (a < 0) {
            return ">"
        } else {
            if (a > 0) {
                return "<"
            } else {
                if (a == 0) {
                    return "="
                } else {
                    return "exception"
                }
            }
        }
    };
    method.ceilNumber = function (value, unit) {
        var result = Math.ceil(value * Math.pow(10, unit)) / Math.pow(10, unit);
        return result
    };
    method.floorNumber = function (value, unit) {
        var result = Math.floor(value * Math.pow(10, unit)) / Math.pow(10, unit);
        return result
    };
    method.divNumber = function (s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse();
        r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "")
        }
        return t.split("").reverse().join("") + "." + r
    };
    method.isEmail = function (str) {
        var regExp = new RegExp("^([a-z0-9A-Z]+[-|_|.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?.)+[a-zA-Z]{2,}$");
        return regExp.test(str)
    };
    method.isPhone = function (str) {
        var regExp = new RegExp("((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)");
        return regExp.test(str)
    };
    method.isAllNumber = function (str) {
        var regExp = new RegExp("^[0-9]*$");
        return regExp.test(str)
    };
    method.hasLetter = function (str) {
        var regExp = new RegExp("[a-zA-Z]");
        return regExp.test(str)
    };
    method.hasNumber = function (str) {
        var regExp = new RegExp("[0-9]");
        return regExp.test(str)
    };
    method.hasChinese = function (str) {
        var regExp = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        return regExp.test(str)
    };
    method.hasOther = function (str) {
        var regExp = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……％&*（）——|{}【】‘；：”“'。，、？]");
        return regExp.test(str)
    };
    method.hasEmailOther = function (str) {
        var regExp = new RegExp("[`~!#$%^&*()=|{}':;',\\[\\].<>/?~！#￥……％&*（）——|{}【】‘；：”“'。，、？]");
        return regExp.test(str)
    };
    method.checkStrong = function (sValue) {
        var modes = 0;
        if (sValue.length < 6) {
            return modes
        }
        if (/\d/.test(sValue)) {
            modes++
        }
        if (/[a-z]/.test(sValue)) {
            modes++
        }
        if (/[A-Z]/.test(sValue)) {
            modes++
        }
        if (/\W/.test(sValue)) {
            modes++
        }
        if (modes < 4) {
            return modes
        } else {
            return sValue.length < 12 ? 3 : 4
        }
    };
    method.stringByte = function (str, charset) {
        var total = 0, charCode, i, len;
        charset = charset ? charset.toLowerCase() : "";
        if (charset === "utf-16" || charset === "utf16") {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 65535) {
                    total += 2
                } else {
                    total += 4
                }
            }
        } else {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 127) {
                    total += 1
                } else {
                    if (charCode <= 2047) {
                        total += 2
                    } else {
                        if (charCode <= 65535) {
                            total += 3
                        } else {
                            total += 4
                        }
                    }
                }
            }
        }
        return total
    };
    method.formatDate = function (timestamp, format) {
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                S: this.getMilliseconds()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
                }
            }
            return format
        };
        return new Date(timestamp).format(format)
    };
    method.preAddSubtract = function (n1, n2) {
        var oT = this.preHandle(n1, n2);
        return !(oT === oT) ? oT : (function () {
            if (oT.d1 - oT.d2 > 0) {
                oT.s2 = oT.s2 + (new Array(oT.d1 - oT.d2 + 1)).join("0")
            } else {
                oT.s1 = oT.s1 + (new Array(oT.d2 - oT.d1 + 1)).join("0")
            }
            return {s1: oT.s1, s2: oT.s2, n1: parseInt(oT.s1, 10), n2: parseInt(oT.s2, 10), d1: oT.d1, d2: oT.d2}
        })()
    }, method.add = function (n1, n2) {
        var oT = this.preAddSubtract(n1, n2),
            out = !(oT === oT) ? oT : ((oT.n1 + oT.n2) / Math.pow(10, Math.max(oT.d1, oT.d2))).toFixed(Math.max(oT.d1, oT.d2));
        return parseFloat(out)
    };
    method.subtract = function (n1, n2) {
        var oT = this.preAddSubtract(n1, n2),
            out = !(oT === oT) ? oT : ((oT.n1 - oT.n2) / Math.pow(10, Math.max(oT.d1, oT.d2))).toFixed(Math.max(oT.d1, oT.d2));
        return parseFloat(out)
    };
    method.preHandle = function (n1, n2) {
        if (!((typeof n1 === "number" || (typeof n1 === "string" && /^[\d]+(\.[\d]+)?$/g.test(n1))) && (typeof n2 === "number" || (typeof n2 === "string" && /^[\d]+(\.[\d]+)?$/g.test(n2))))) {
            return NaN
        }
        var s1 = n1.toString(), s2 = n2.toString(), a1 = s1.split("."), a2 = s2.split(".");
        s1 = s1.replace(".", "");
        s2 = s2.replace(".", "");
        return {
            s1: s1,
            s2: s2,
            n1: parseInt(s1, 10),
            n2: parseInt(s2, 10),
            d1: a1.length > 1 ? a1[1].length : 0,
            d2: a2.length > 1 ? a2[1].length : 0
        }
    };
    method.multiply = function (n1, n2) {
        var oT = this.preHandle(n1, n2),
            out = !(oT === oT) ? oT : (oT.n1 * oT.n2 / Math.pow(10, oT.d1 + oT.d2)).toFixed(oT.d1 + oT.d2);
        return parseFloat(out)
    };
    method.divide = function (n1, n2) {
        var oT = this.preHandle(n1, n2), out = !(oT === oT) ? oT : (oT.n1 / oT.n2 / Math.pow(10, oT.d1 - oT.d2));
        return parseFloat(out)
    };
    method.insertFlg = function (str, flg, sn) {
        var newstr = "";
        for (var i = 0; i < str.length; i += sn) {
            var tmp = str.substring(i, i + sn);
            newstr += tmp + flg
        }
        return newstr
    };
    method.checkDecimal = function (_this, unit) {
        var value = _this.val();
        if (value != "") {
            if ($.isNumeric(value) && value >= 0) {
                var valueStr = value + "";
                if (valueStr.indexOf(".") != -1) {
                    var newStr, intStr = valueStr.split(".")[0] + "", floatStr = valueStr.split(".")[1] + "";
                    if (unit == 0) {
                        _this.val(intStr)
                    } else {
                        if (floatStr.split("").length > unit) {
                            newStr = intStr + "." + floatStr.substr(0, unit);
                            _this.val(newStr)
                        }
                    }
                }
            } else {
                _this.val("")
            }
        }
    };
    method.detectZoom = function () {
        var ratio = 0, screen = window.screen, ua = navigator.userAgent.toLowerCase();
        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio
        } else {
            if (~ua.indexOf("msie")) {
                if (screen.deviceXDPI && screen.logicalXDPI) {
                    ratio = screen.deviceXDPI / screen.logicalXDPI
                }
            } else {
                if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
                    ratio = window.outerWidth / window.innerWidth
                }
            }
        }
        if (ratio) {
            ratio = Math.round(ratio * 100)
        }
        return ratio
    };
    method.getMaxNumber = function (arry1, arry2) {
        var tempArry = arry1.concat(arry2);
        for (i = 0; i < tempArry.length; i++) {
            tempArry[i] = Math.abs(tempArry[i])
        }
        return Math.max.apply(Math, tempArry)
    };
    module.exports = method;
    (function () {
        return this || (0, eval)("this")
    }()).method = method
});