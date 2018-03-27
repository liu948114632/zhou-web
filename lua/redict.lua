
-- 根据post转移到不同的地址

--
--ngx.log(ngx.ALERT, m ~= nil and not isPc)

--if isPc then
--    ngx.log(ngx.ALERT,"============= not pc");
--end
local request_method = ngx.var.request_method

if "POST" == request_method then
    -- ngx.exec("@c")
    ngx.req.read_body()
    local arg = ngx.req.get_post_args()["msgtype"]
    if arg == "ReqQryDepthMarketData"  or arg == "ReqQryDepth" or arg == "ReqQryOrder" or arg =="ReqQryTradingAccount" or arg =="ReqQryDepositAddress" then
        ngx.exec("@c")
    else
        ngx.exec("@b")
    end
end

-- local request_method = ngx.var.request_method
-- if request_method == "GET" then
--     local arg = ngx.req.get_uri_args()["clientVersion"] or 0
--     ngx.var.version = arg
-- elseif request_method == "POST" then
--     ngx.req.read_body()
--     local arg = ngx.req.get_post_args()["clientVersion"] or 0
--     ngx.var.version = arg
-- end;
-- if ngx.var.version == "2.5.0" then
--     ngx.var.rbbackend_server = "pool_2.5"
-- end;

