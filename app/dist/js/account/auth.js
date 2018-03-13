var app = angular.module('app',['i18n']);
app.controller('authController',['$scope', '$http',function($scope, $http){
    $scope.isShow = false;
    $scope.user1 = {
        authDeepPost: true,
        authDeep: true,
        auth : true
    };
    function getSession() {
        $http.get('/api/v1/frontSession?' + new Date().getTime())
            .then(function (res) {
                $scope.user1 = res.data.data;
                if($scope.user1.authDeep){
                    $scope.user1.authDeepPost = true;
                }
                $scope.isShow = true;
            })
    }
    getSession();

    $scope.auth = function () {
        let name = $scope.user1.name;
        let no = $scope.user1.no;
        if(isEmpty(name) || isEmpty(no)){
            error_win(lang.noempty)
        }
        let data = {
            name: name,
            no: no,
        };
        $http.post("/api/v1/account/auth",$.param(data),{headers:{'Content-Type' :'application/x-www-form-urlencoded' }})
            .then(function (res) {
                let code = res.data.code;
                if(code === 4){
                    error_win(lang.hasuser);
                    return;
                }
                if(code === 200){
                    success_win(lang.tt1, function(){
                        location.href = "/account/auth-deep";
                    });
                }
            })
    }

    $("input[name=img]").change(function(){
        var file= $(this).val();
        var strs = file.split('.');
        var suffix = strs[strs.length - 1].toLocaleLowerCase();
        if (suffix != 'jpg' && suffix != 'png' && suffix != 'jpeg') {
            error_win(lang.js.account.pic);
            return;
        }
        var $form = $(this).closest("form");
        var type = $form.find("input[name=type]").val();
        $("#img"+type).attr('src', resources + "/dist/images/identify/loading.gif");
        console.log("#img"+type);
        $form.submit();
        $(this).val('');
    });

    if($(".identify_img").length> 0){
        $(".identify_img").ajaxForm({
            dataType:'json',
            success: function(data) {
                var $target = $("#img"+data.totalCount);
                if(data.code!=200){
                    $target.attr("src", resources + $target.data('img'));
                }
                if(data.code == 200){
                    $target.attr("src",cdn+data.data + "?x-oss-process=image/resize,w_350,h_200,m_pad");
                    $("input[name=fIdentityPath"+data.totalCount+"]").val(data.data);
                }else if(data.code == 1){
                    error_win(lang.js.account.noExist);
                }else if(data.code == 2){
                    error_win(lang.js.account.tooLarge);
                }else if(data.code == 3){
                    error_win(lang.js.account.noValid);
                }else if(data.code == 4 || data.code == 5){
                    error_win(lang.error);
                }
            }
        });
    }

}]);