local _M = {}

local rpc = require "rpc"
local null = ngx.null

_M.get = function()
    local user_cache = ngx.ctx['user']
    if not user_cache then
        local res = rpc.call('/v1/frontSession');
        if res.code == 200 and res.data ~= null then
            ngx.ctx['user'] = res.data
            user_cache = res.data
        end
    end
    return user_cache
end

return _M;