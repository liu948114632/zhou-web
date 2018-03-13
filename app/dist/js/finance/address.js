!(function(){
    var app = angular.module('app', ['i18n']);
    var id = getParams('id')? getParams("id"): 0;
    var coin = false;
    $.getJSON('/v1/coinList', function(data){
        if(data.code == 200){
            data = data.data;
            var len = data.length, html = [];
            for(var i = 0; i < len; i++){
                var cls = "";
                if(id == data[i].id){
                    coin = data[i];
                    cls = 'on';
                }
                html.push('<a href="/finance/address?id='+data[i].id+'" class="'+cls+'"><em class="iconfont">&#xe6cd;</em>'+data[i].name+'</a>');
            }
            if(len > 0 && !coin){
                coin = data[0];
                html[0] = '<a href="/finance/address?id='+data[0].id+'" class="on"><em class="iconfont">&#xe6cd;</em>'+data[0].name+'</a>';
            }
            $('#coins').html(html);
            getTemplate();
        }
    });
    var isPending = false;

    function getTemplate(){
        $.getJSON('/v1/account/getAddressByCoin', {id: coin.id}, function(data){
            if(data.code == 200){
                data = data.data;
                var html = '<li class="empty col-xs-6 col-md-4"> <div class="inner" id="addBlock_usdt"> <span class="add"><i class="ft24">+</i><br>'+lang.js.address.add+'</span> </div></li>', len = data.length;
                for(var i = 0; i < len; i++){
                    html += '<li class="item col-xs-6 col-md-4">'+
                   '     <div class="inner">'+
                   '     <div class="head"> <p>('+data[i].flag+')</p> </div>'+
                   '     <div class="body"> <p class="card"> '+data[i].address+' </p> </div>'+
                   '     <div class="foot">'+
                   '     <a href="/finance/payout?id='+coin.id+'" class="mr15">'+lang.withdrawCoin+'</a>'+
                   '     <a href="javascript:void(0);" data-address="'+data[i].address+'" data-flag="'+data[i].flag+'" class="remark" data-id="'+data[i].id+'">'+lang.change+'</a>'+
                   '     </div>'+
                   '     <span class="delete" data-id="'+data[i].id+'" title="'+lang.delete+'"><i class="iconfont ft18">&#xe611;</i></span>'+
                   ' </div>'+
                   '</li>';
                }
                $('#list').html(html);
            }
        });
    }

    $("#list").on("click", ".delete", function(){
        if(isPending ){
            error_win(lang.pending);
            return;
        }
       var $this = $(this);
       confirm_win(lang.deleteTips, function(){
           isPending = true;
           $.getJSON('/v1/account/deleteAddress', {id: $this.data("id")}, function(data){
               isPending = false;
               if(data.code == 200){
                   $("#list").html(pending_center);
                   getTemplate();
               }
           });
       })
    });

    $("#list").on("click", ".empty", function(){
        center_box('float_win');
        $("#float_win .title").text(lang.add+coin.name+lang.withdrawAddress);
        $("#address").show();
        $("#update_address").hide();
        $(".code_area").show();
       $("#shadow, #float_win").show();
       $(".confirm").data("type","add");
    });

    $("#list").on("click", ".remark", function(){
        var $this = $(this);
        center_box('float_win');
        $("#float_win .title").text(lang.change+coin.name+lang.js.address.note);
        $("#address").hide();
        $("#update_address").val($this.data("address")).show();
        $("#flag").val($this.data("flag"));
        $(".code_area").hide();
       $("#shadow, #float_win").show();
       $(".confirm").data("type","update").data("id", $this.data("id"));
    });
    $(".confirm").click(function(){
        if(isPending ){
            error_win(lang.pending);
            return;
        }
        var $this = $(this);
        var type = $this.data("type" ) == 'add'? true: false;
        var flag = $("#flag").val().trim();
        if(isEmpty(flag)){
            error_win(lang.js.address.noteTips);
            return;
        }
       if(type){
           var address = $("#address").val().trim();
           var code =$(".code").val().trim();
           if(isEmpty(address) || address.length < 10){
               error_win(lang.js.address.addressTips);
               return;
           }
           if(isEmpty(code)){
               error_win(lang.codeEmptyTips);
               return;
           }
       }
        var params = {
            address: address,
            flag: flag,
            code: code
        };
        params['id'] = type ? coin.id: $this.data("id");
        isPending = true;
        var url = type ? 'addAddress': 'updateFlag';
        $.post('/v1/account/'+ url, params, function(data){
            isPending = false;
            if(data.code == 200){
                $("#list").html(pending_center);
                $(".close").click();
                getTemplate();
            }else if (data.code == 100) {
                error_win(lang.codeNotSendTips);
            }  else if (data.code == 101) {
                error_win(lang.codeFrequentTips);
            }else if (data.code == 102) {
                error_win(lang.codeErrorTips+data.data);
            }
        },"json");
    });
})(jQuery);