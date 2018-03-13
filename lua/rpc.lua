local cjson = require "cjson"
local params = require "params"

local _M = {}

function _M.call(...)
    local args = { ... }
    local res

    if not args[2] then
        args[2] = {}
    end

    local uri = params.getBasePath()..args[1]
    if ngx.ctx['cookie'] then
        ngx.req.set_header("cookie", ngx.ctx['cookie'])
    end

    if ngx.var.request_method == "POST" then
        res = ngx.location.capture(uri, {
            method = ngx.HTTP_POST,
            body = ngx.encode_args(args[2]),
        });
    else
        res = ngx.location.capture(uri, {
            method = ngx.HTTP_GET,
            args = args[2],
        });
    end

    local cookie = res.header["Set-Cookie"]

    if cookie ~= nil then
        ngx.header["Set-Cookie"] = cookie
        ngx.ctx['cookie'] = cookie
    end
    if not res or res.status ~= 200 then
        res.body = '{"data":null,"code":'..res.status..'}'
    end
    return cjson.decode(res.body)
end

return _M;