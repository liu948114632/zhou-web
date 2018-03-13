!(function(){
    var app = angular.module('app', ['i18n']);
    var pageNum = 1;
    var pageSize = 15;
    getTemplate();
    function getTemplate(){
        var param = {page: pageNum, pageSize: pageSize};
        $.post("/v1/account/messages", param, function(data){
            if(data.code == 200){
                var $data = data.data;
                var count = data.totalCount;
                var length = $data.length;
                var html = "";
                for(var i = 0; i<length; i++){
                    var msg = $data[i];
                    var status = msg.status == 1? lang.unread: lang.read;
                    html +='<tr data-id="'+msg.id+'">'+
                        ' <td class="selectDeleteNew">'+
                        '      <i class="iconfont">&#xe615;</i>'+
                        '  </td>'+
                        '  <td class="detail">'+status+
                        // '      <i class="iconfont '+status+'">&#xe647;</i>'+
                        '  </td>'+
                        '  <td class="detail">'+msg.title+'</td>'+
                        '  <td>'+new Date(msg.time).format('yyyy-MM-dd hh:mm:ss')+'</td>'+
                        ' </tr>'
                }
                if(html == ""){
                    html = "<tr><td colspan='4'>"+lang.noRecord+"</td></tr>"
                }
                $("#content").html(html);
                tm_page(count);
            }
        },"json");
    }
    function tm_page(itemCount){
        $(".page").pagination(itemCount, {
            num_display_entries : 3,
            num_edge_entries : 4,
            current_page : pageNum*1-1,
            items_per_page : pageSize,
            showGo:false,
            showSelect:false,
            callback : function(pageN) {
                pageNum = pageN*1+1;
                $("#content").html(pending_center);
                getTemplate();
            }
        });
    }

    $("#selectAll").click(function(){
        var $this = $(this);
        if($this.data('select')){
            cancelAllSelected($this);
            $("#content .selectDeleteNew").each(function(){
                cancelSelect($(this));
            });
        }else{
            allSelected($this);
            $("#content .selectDeleteNew").each(function(){
                selected($(this));
            });
        }
    });

    function allSelected($this){
        $this.data('select', true);
        $this.html('<i class="iconfont">&#xe668;</i>');
    }

    function cancelAllSelected($this){
        $this.data('select', false);
        $this.html('<i class="iconfont">&#xe615;</i>');
    }

    function selected($target){
        $target.html('<i class="iconfont">&#xe668;</i>');
        $target.addClass("selected");
    }

    function cancelSelect($target){
        $target.html('<i class="iconfont">&#xe615;</i>');
        $target.removeClass("selected");
    }

    $("#content").on('click','.selectDeleteNew',function(){
        var $this = $(this);
        if($this.hasClass("selected")){
            cancelSelect($this);
            if($(".selectDeleteNew.selected").length != pageSize){
                cancelAllSelected($("#selectAll"));
            }
        }else{
            selected($this);
            if($(".selectDeleteNew.selected").length == pageSize){
                allSelected($("#selectAll"));
            }
        }
    });

    $("#content").on('click','.detail',function(){
        var $this = $(this);
        var url = "/v1/account/messageDetail";
        var param = {id: $this.closest("tr").data("id")};
        jQuery.post(url, param, function (data) {
            if(data.code == 200){
                content_win(data.data.title, data.data.content);
            }
            $this.closest("tr").find(".c_blue").removeClass("c_blue");
        }, "json");
    });


    var isPending = false;

    $("#flag_all, #delete_news").on('click', function () {
        var $this = $(this);
        if(isPending){
            error_win(lang.pending);
            return;
        }
        var ids = "";
        $(".selectDeleteNew.selected").each(function () {
            var id = $(this).closest("tr").data('id');
            ids += id + ","
        });
        ids = ids.substring(0, ids.length - 1);
        if (ids == "") {
            error_win(lang.js.message.solve);
            return;
        }
        var url = $this.data('url');
        isPending = true;
        $.post(url, {ids: ids}, function(data){
            isPending = false;
            if(data.code == 200){
                pageNum = 1;
                getTemplate();
                cancelAllSelected();
            }else{
                error_win(lang.error);
            }
        },"json");
    });
})(jQuery);