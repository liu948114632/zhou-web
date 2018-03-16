var rootws;
var rootresult;
function login(callback) {
    rootws = new WebSocket("ws://47.97.219.235:8811");
    rootws.onopen = function()
    {
        ws.send("msgtype=ReqSyncRandomString");
    };
    rootws.onmessage = function(event){
        var fr = new FileReader();
        fr.onload = function() {
            rootresult = JSON.parse(this.rootresult);
            if(rootresult.msgtype == "RspSyncRandomString"){
                var time =  (new Date()).valueOf();
                var val = "msgtype=ReqLogin&uid="+sessionStorage.getItem("uid")+"&ps=-1&td=20180101&TimeStamp="+time+"&RandomString="+rootresult.rs;
                var hash = CryptoJS.HmacSHA256(val, sessionStorage.getItem("key"));
                var sign = hash.toString();
                var msg = val+"&Sign="+sign;
                console.log(msg);
                ws.send(msg);
            }
            if(rootresult.msgtype == "ReqLogin"){
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