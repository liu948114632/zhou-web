$(function(){
    var rmb = $("#box").data("rmb");
    var rest = $("#box").data("rest")*1;
    var min = $("#box").data("min") * 1;
    var max = $("#box").data("max") * 1;
    var left = $("#box").data("left") * 1;
    var id = $("#ico_id").val();

    left = left < 0 ? 0 : left;

    $("input.num").keyup(function(){
        var $this = $(this);
        var num = $this.val() * 1.0;
        num = num > left ? left : num;
        $this.val(num);
        var rate = $(this).data('rate') ? $(this).data('rate') * 1.0 : 1.0;
        if (num.length > 0 && (num.length > 11 || !numCheck(num))) {
            $this.val(0);
            $("#total_" + $(this).data('symbol')).text(0);
            return;
        }
        $("#total_" + $(this).data('symbol')).text((num/rate).toFixed(4));
    });
    $(".ico_buy").click(function(){
        var $input = $("#" + $(this).data('input'));
        var amount = $input.val();
        var rate = $input.data('rate') * 1.0;
        var bal = $input.data("bal") * 1.0;
        if(isEmpty(amount)){
            alert("认购数量不能为空！");
            return;
        }
        if (!numCheck(amount)) {
            alert("认购数量不合法");
            return;
        }
        if(max!=0 && amount * 10000 > max * 10000 - rest * 10000){
            alert("剩余认购数量不足");
            return;
        }
        if(max!=0 && amount * 1 > max){
            alert("最高限制数量为"+max+"个");
            return;
        }
        if(amount * 1 < min){
            alert("最低限制数量为"+min+"个");
            return;
        }
        if(amount / rate > bal){
            alert("您的余额不足");
            return;
        }
        $('#buyCoinType').val($input.data('coin'));
        $('#buyAmount').val(amount);
        $('#buyCoinText').html($input.data('symbol'));
        $('#buyAmountText').html(amount);
        center_box("win");
        $("#tm_yy").show();
        $("#win").show();
    });
    $("#buy_sec").click(function(){
        var $this = $(this);
        if($this.text()=="认购中"){
            alert("认购中，请稍后！");
            return;
        }
        var amount = $("input.num").val();
        var params = {
            id: id,
            coinType:$('#buyCoinType').val(),
            amount: $('#buyAmount').val()
        };
        var tradePassword = $("#tradePassword").val();
        if(tradePassword.length < 6){
            alert("交易密码位数不符！");
            return;
        }
        params['password'] = tradePassword;
        $this.text("认购中");
        $.post('/account/icoSupport', params, function(data){
            $this.text("购买");
            if(data.code == 200){
                location.reload();
            } else if (data.code == 101) {
                alert('非法操作');
            } else if (data.code == 102) {
                alert('非法操作');
            } else if (data.code == 103) {
                alert('不在认购时间内')
            } else if (data.code == 105) {
                alert('项目已满额');
            } else if (data.code == 107) {
                alert('交易密码不正确');
            } else if (data.code == 109) {
                alert('认购已超出额度，' + "您还能买" + data.leftAmount);
            } else if (data.code == 111) {
                alert('最小购买份额为' + data.amount);
            } else if (data.code == 113) {
                alert('已达到限额，您还能买' + (data.leftAmount <= 0 ? 0 : data.leftAmount));
            } else if (data.code == 115) {
                alert('当前时间段没有对应兑换率');
            } else if (data.code == 117) {
                alert('您的余额不足');
            } else {
                alert('购买失败');
            }
        },"json");
    });

});