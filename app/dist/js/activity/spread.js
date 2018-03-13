(function(){
    var page1 = 1, page2= 1, pageNum = 20;
    var app = angular.module('app',['i18n','ngSanitize']);
    app.controller('HomeCtrl',function($scope,$sce){
        // $scope.rule1 = $sce.trustAsHtml($scope.lang.spread.rule1);
        // $scope.rule2 = $sce.trustAsHtml($scope.lang.spread.rule2);
    });
    function tm_page1(itemCount){
        $(".page1").pagination(itemCount, {
            num_display_entries : 3,
            num_edge_entries : 4,
            current_page : page1*1-1,
            items_per_page : pageNum,
            showGo:false,
            showSelect:false,
            callback : function(p) {
                page1 = p*1+1;
                getLog();
            }
        });
    }
    function tm_page2(itemCount){
        $(".page2").pagination(itemCount, {
            num_display_entries : 3,
            num_edge_entries : 4,
            current_page : page2*1-1,
            items_per_page : pageNum,
            showGo:false,
            showSelect:false,
            callback : function(p) {
                page2 = p*1+1;
                getAwardLog(p*1+1);
            }
        });
    }
    $("#copy").zclip({
        path: resources + "/dist/js/copy/ZeroClipboard.swf",
        copy: function(){
            return $("#spread-input").val();
        },
        afterCopy:function(){
            $(".copy-tips").show().fadeOut(3000);
        }
    });
    getAwardLog();
    getLog();
    function getAwardLog(){
        $.getJSON('/v1/spread/awardLog',{page: page2, pageNum: pageNum}, function(data){
            if(data.code == 200){
                var msg = data.data;
                var html = "";
                var len = msg.length;
                for(var i = 0; i < len; i++){
                    html += '<tr><td>'+msg[i].userLoginName+'</td>' +
                        '<td>'+msg[i].coinShortName+'</td>' +
                        '<td>'+msg[i].fee+'</td>' +
                        '<td>'+new Date(msg[i].createTime).format("yyyy-MM-dd HH:mm")+'</td>' +
                        '</tr>';
                }
                if(len == 0){
                    html = "<tr><td colspan='4'>"+lang.spread.no+"</td></tr>";
                }
                $("#awardLog").html(html);
                tm_page2(data.totalCount);
            }
        });
    }
    function getLog(){
        $.getJSON('/v1/spread/introLog',{page: page1, pageNum: pageNum}, function(data){
            if(data.code == 200){
                var msg = data.data;
                var intros = msg.intros;
                var html = "";
                var len = intros.length;
                for(var i = 0; i < len; i++){
                    html += '<tr><td>'+intros[i].loginName+'</td><td>'+intros[i].num+intros[i].coinName+'</td><td>'+new Date(intros[i].createTime).format('yyyy-MM-dd HH:mm')+'</td></tr>';
                }
                if(len == 0){
                    html = "<tr><td colspan='3'>"+lang.spread.no+"</td></tr>";
                }
                console.log(html);
                $("#log").html(html);
                var num = msg.num;
                var html1 = "";
                for(var j = 0; j < num.length; j++){
                    html1 += '<p class="value">'+ num[j].sum + num[j].coinName+'</p>';
                }
                if(html1 == ""){
                    html1 = '<p class="value">0</p>';
                }
                if(html.indexOf("null")){
                    html1 = '<p class="value">0</p>';
                }
                $("#award").html(html1);
                page1 = data.page;
                tm_page1(data.totalCount);
                $("#num").text(data.totalCount);
            }
        });
    }
    $.getJSON('/v1/spread/rank', function(data){
        if(data.code == 200){
            var msg = data.data.tops;
            var html = "";
            var len = msg.length;
            for(var i = 0; i < len; i++){
                var rank = '<i class="normal">'+(i+1)+'</i> ';
                if(i < 3){
                    var bg = resources + '/dist/images/activity/'+(i+1)+'.png';
                    rank = '<i class="rank" style="background: url('+bg+') no-repeat center"></i> ';
                }
                html += ' <tr> <td>'+rank+'</td><td>'+msg[i].floginName+'</td> <td>'+msg[i].total+'</td> </tr>';
            }
            if(len == 0){
                html = "<tr><td colspan='3'>"+lang.spread.no+"</td></tr>";
            }
            $("#rank").html(html);
        }
    });
    /*$.getJSON('/v1/on_sell_coins', function(data){
        if(data.code == 0){
            var msg = data.data;
            var html = "";
            var len = msg.length;
            for(var i = 0; i < len; i++){
                html += '<option value="'+msg[i].fid+'">'+msg[i].fshortName + "/" + msg[i].fkey +'</option> ';
            }
            $("#sel").html(html);
        }
    });*/
    $(".sell").click(function () {
        $.getJSON('/v1/on_sell_coins', function(data){
            if(data.code == 200){
                var msg = data.data;
                var html = "";
                var len = msg.length;
                for(var i = 0; i < len; i++){
                    html += '<option value="'+msg[i].fid+'">'+msg[i].fshortName + "/" + msg[i].fkey +'</option> ';
                }
                $("#sel").html(html);
            }
        });
    })
    $.getJSON('/v1/spread/getInfo', function(data){
        if(data.code == 200){
            var msg = data.data;
            $("#coin_name_amount").text(msg.registerSend+" " +msg.registerCoinName);
            $("#coin_name_amount2").text(" "+msg.introSend+" " +msg.introCoinName);
        }
    });
})();
