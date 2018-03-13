!(function(){
    var app = angular.module('app', ['i18n']);
    var id = getParams('id');
    $.getJSON('/v1/articleDetail',{id: id}, function(data){
        if(data.code == 200){
            data = data.data;
            var title = lang.lang == "en" ? data.enTitle: data.title;
            var content = lang.lang == "en" ? data.enContent: data.content;
            $(".title").html($("#news_nav li.type"+data.type+" a").text());
            $("#content").html('<h2 class="align-center" style="display: block"> '+title+'</h2>'+
          '     <p class="align-center" style="border-bottom: 1px dashed #ddd; margin-bottom: 20px; padding-bottom: 20px;"> '+lang.js.news.time+'<span>'+new Date(data.createTime).format('yyyy-MM-dd HH:mm:ss')+'</span></p>'+
          '<article class="page-content clearfix" style="font-size: 16px;">'+content+'</article>');
        }
    });
})(jQuery);