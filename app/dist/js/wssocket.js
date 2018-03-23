var rootws;
var rootresult;
function loginCommon(callback) {
    rootws = new WebSocket(wsHost);
    rootws.onopen = function()
    {
        rootws.send("msgtype=ReqSyncRandomString");
    };
    rootws.onmessage = function(event){
        var fr = new FileReader();
        fr.onload = function() {
            rootresult = JSON.parse(this.result);
            console.log(rootresult);
            if(rootresult.msgtype == "RspSyncRandomString"){
                var time =  (new Date()).valueOf();
                var val = "msgtype=ReqLogin&uid="+sessionStorage.getItem("uid")+"&ps=-1&td=20180101&TimeStamp="+time+"&RandomString="+rootresult.rs;
                var hash = CryptoJS.HmacSHA256(val, sessionStorage.getItem("key"));
                var sign = hash.toString();
                var msg = val+"&Sign="+sign;
                console.log(msg);
                rootws.send(msg);
            }
            if(rootresult.msgtype == "RspLogin"){
                if(rootresult.em == "正确"){
                    (callback && typeof(callback)==="function") && callback();
                }
            }
            rootresult = "";
        };
        fr.readAsText(event.data,'gbk');
    };
    rootws.onclose = function()
    {
        console.log("连接已关闭...");
    };

}