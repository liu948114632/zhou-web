
-- 手机访问重定向到移动版

local ck = require "resty.cookie"
local cookie, err = ck:new()
local field = cookie:get("ver")
local isPc = (field == "pc") or false

local agent = ngx.var.http_user_agent
--
--ngx.log(ngx.ALERT, m ~= nil and not isPc)

--if isPc then
--    ngx.log(ngx.ALERT,"============= not pc");
--end

if agent ~= nil then
    local m, ret = ngx.re.match(agent, "Android|webOS|iPhone|iPod|BlackBerry")
    if m ~= nil and not isPc then

        local queryString = ngx.var.args
        if queryString == nil then queryString = "" end

        local rewrite_urls = {}
        rewrite_urls["/"] = "/app/index.html?"..queryString

        local redirect_uri = rewrite_urls[ngx.var.uri]

        if redirect_uri then
            ngx.redirect(redirect_uri, ngx.HTTP_MOVED_TEMPORARILY)
        end
    end
end

