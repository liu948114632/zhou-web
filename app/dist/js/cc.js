(function($){
    var oldBank = "";
    var ccCoin = {
        name: "QC",
        id: 1
    }
    $(".coin-name").text(ccCoin.name);
    var app = angular.module('app', ['i18n']);
    center_box("JuaBox_1");
    if(!$.cookie("c2cTips")){
        $("#tips").show();
    }
    $("#JuaBtn_1_1").click(function(){
        $("#tips").hide();
        $.cookie("c2cTips", 1, {expires : 1, path : '/'});
    });

    $("#bank").click(function(){
        showBank();
    });

    var pending = false;
    $("#buyBtn,#sellBtn").click(function(){
        if(pending){
            error_win("请求中，请稍后");
            return;
        }
        var $this = $(this);
       var type = $this.data("type");
       var amount = $this.closest(".col-xs-6").find(".amount").val();
       if(isEmpty(amount) || !isNumber(amount) || amount <= 0){
           error_win("数量不合法");
           return;
       }
       if(amount < 100 || amount > 1000000){
           error_win("只能输入100-1000,000之间的数量");
           return;
       }
       pending = true;
       $.post('/v1/account/ccTrade', {amount: amount, type: type, cid: ccCoin.id}, function(data){
           pending = false;
           if(data.code == 200){
               $this.closest(".col-xs-6").find(".amount").val("");
                if(type == 0){
                    showDetail(data.data);
                }else{
                    success_win("申请成功，请耐心等待商户打款，处理时间为24小时之内");
                }
           }else if(data.code == -2){
               error_win("暂无商户接单");
           }else if(data.code == -3){
               error_win("您未绑定银行卡，或绑定的银行卡有误", function(){
                   showBank();
               });
           }
       },"json");
    });

    function showBank(){
        center_box("float_win");
        $("#float_win, #shadow").show();
    }

    function showDetail(data){
        $("#id").text(data.id);
        $("#amount").text(data.amount);
        $("#account").text(data.seller.account);
        $("#name").text(data.seller.name);
        $("#branch").text(data.seller.branch);
        $("#tips").hide();
        center_box('JuaBox_2');
        $("#msg").show();
    }

    $("#list").on("click", ".detailshow", function(){
        var id = $(this).data("id");
        $.getJSON('/v1/account/ccDetail', {id: id}, function(data){
           if(data.code == 200){
               showDetail(data.data);
           }
        });
    });

    $("#addForm").find(".confirm").click(function(){
        if(pending){
            error_win("请求中，请稍后");
            return;
        }
        var account = $("#addForm").find(".memo").val();
        var code = $("#addForm").find(".code").val();
        if(isEmpty(account) || !isInt(account) || account.length < 10){
            error_win("银行卡格式不正确");
            return;
        }
        if(account == oldBank){
            error_win("已绑定该账号，无需重新绑定");
            return;
        }
        if(isEmpty(code)){
            error_win('请先输入验证码');
            return;
        }
        pending = true;
        $.post("/v1/account/saveBank", {account: account, code: code}, function(data){
            pending = false;
            if(data.code == 200){
                success_win("绑定成功");
            }else if(data.code == -2){
                error_win('请先填写实名认证');
            }else if (data.code == 100) {
                error_win(lang.codeNotSendTips);
            }  else if (data.code == 101) {
                error_win(lang.codeFrequentTips);
            }else if (data.code == 102) {
                error_win(lang.codeErrorTips+data.data);
            }
        },"json")
    });

    $.getJSON('/v1/ccLog', {size: 2}, function(data){
        if(data.code == 200){
            data = data.data;
            var buy = data.buy;
            var sell = data.sell;
            var buyHtml = "";
            var sellHtml = "";
            for(var i = 0 ; i < buy.length; i++){
                buyHtml += '<li><span><i class="fa fa-user fa-fw"></i>'+buy[i].seller.contactWay+'</span><b>'+Math.floor(buy[i].amount * buy[i].price *100) / 100+ ' '+ buy[i].coin.fShortName +'</b><span class="typeshow">买入</span><a>交易完成</a></li>';
            }
            for(var j = 0 ; j < sell.length; j++){
                sellHtml += '<li><span><i class="fa fa-user fa-fw"></i>'+sell[j].seller.contactWay+'</span><b>'+Math.floor(sell[j].amount * sell[j].price *100) / 100+ ' '+ sell[j].coin.fShortName +'</b><span class="typeshow">卖出</span><a>交易完成</a></li>';
            }
            $("#sellList").html(sellHtml);
            $("#buyList").html(buyHtml);
        }
    });

    $("#JuaWinBtn_2_3").click(function(){
       $("#msg").hide();
        getMyLog();
    });

    var html_template = '<tr><td colspan="7"> <div class="bk-norecord"> <p> <i class="iconfont" >&#xe7af;</i>'+lang.noRecord+'</p> </div> </td></tr> ';
    $.getJSON('/v1/session?' + new Date().getTime(), {}, function(data){
        if(data && 200 == data.code){
            $("#address").val(data.data.real);
            oldBank = data.data.bank;
            if(oldBank == null){
                $("#bank_item").append(' <input type="text" class="form-control memo"  name="memo">');
            }else{
                $("#bank_item").append(' <input type="text" class="form-control memo"  placeholder="已绑定，账号为：'+oldBank+'"  name="memo">');
            }
            getMyLog();
        }else {
            $("#bank_item").append(' <input type="text" class="form-control memo"  name="memo">');
            $('#list').html(html_template);
        }
    });

    function getMyLog(){
        $.getJSON("/v1/account/myCcLog", function(data){
            if(data.code == 200){
                data = data.data;
                var html = "";
                var len = data.length;
                if(len == 0){
                    html += html_template
                }
                for(var i = 0; i< len; i++){
                    var type = data[i].type == "BUY" ? "买入":"卖出";
                    var type_cls = data[i].type == "BUY" ? "c_red":"c_green";
                    var status = data[i].status == "UN_CHECK"? "等待处理": data[i].status == "PASSED" ? "交易完成": "交易取消";
                    var status_cls = data[i].status == "UN_CHECK"? "c_blue": data[i].status == "PASSED" ? "c_green": "c_hui";
                    var status_oper = data[i].status == "UN_CHECK" && data[i].type == "BUY" ?  '<a class="detailshow"  title="点击查看付款信息" data-id="'+data[i].id+'" href="javascript:void(0)">付款信息</a>': "--";
                    html += '<tr class="wait">'+
                        '       <td>'+new Date(data[i].createTime).format("yyyy-MM-dd HH:mm:ss")+'</td>'+
                        '   <td class="text-left in}">'+
                        '       <p class="text-muted '+type_cls+'">'+type+' '+data[i].coin.fShortName+'/CNY</p>'+
                        '   <p>流水号: '+new Date(data[i].createTime).format("yyyyMMddHH")+ data[i].id+'</p>'+
                        '   </td>'+
                        '   <td class="text-left">'+
                        '       <p>'+data[i].amount+' </p>'+
                        '       </td>'+
                        '       <td class="text-left">'+
                        '       <p>'+data[i].price+' </p>'+
                        '       </td>'+
                        '       <td class="text-left">'+
                        '       <p>'+Math.floor(data[i].amount*data[i].price * 100)/100+' </p>'+
                        '       </td>'+
                        '       <td class="exlist-icon text-center">'+
                        '       <a class="'+status_cls+'">'+status+'</a>'+
                        '       </td>'+
                        '       <td>'+
                        '       <p>'+ status_oper
                    '       </p>'+
                    '       </td>'+
                    '      </tr>'
                }
                $('#list').html(html);
            }
        });
    }
})(jQuery);































