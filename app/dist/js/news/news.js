!(function(){
    var app = angular.module('app', ['i18n']);
    var id = getParams('type')? getParams('type'): 1;
    $("#news_nav").find(".type"+id).addClass("open");
    $('.articleType').text( $("#news_nav").find(".type"+id).find("a").text());
    var pageNum = 1;
    var pageSize = 10;
    function getTemplate(){
        $.getJSON('/v1/articleList',{type: id, page: pageNum, pageSize: pageSize}, function(data){
            if(data.code == 200){
                $(".title").html($("#news_nav li.type"+id+" a").text());
                var count = data.totalCount;
                data = data.data;
                var html = '', len = data.length;
                for(var i = 0; i < len; i++) {
                    var title = lang.lang == "en" ? data[i].enTitle: data[i].title;
                    html += '<li> <time class="cbp_tmtime"> <span>'+new Date(data[i].createTime).format('MM/dd/yyyy')+'</span> <span>'+new Date(data[i].createTime).format('HH:mm')+'</span> </time>'+
                 '   <div class="cbp_tmicon"> <i class="fa fa-pencil"></i> </div>'+
                 '       <div class="cbp_tmlabel"> <article class="envor-post"> '+
                 '       <header> <h3> <a href="/news/detail?id='+data[i].id+'" target="_blank"> '+title+' </a> </h3> </header>'+
                 '      </article> </div> </li>';
                }
                $("#list").html(html);
                tm_page(count);
            }
        });
    }
    getTemplate();
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
                $("#list").html(pending_center);
                getTemplate();
            }
        });
    }
})(jQuery);