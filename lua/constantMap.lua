local rpc = require "rpc"

local _M = {}

function _M.getParams(res)
    local params = rpc.call('/v1/webInfo')
    local result = {}
    local data = params['data']
    if data == nil then
        res['param'] = {}
        return res
    end
    for k, v in pairs(data) do
        result[k] = v
    end
    res['param'] = result
    return res
end

return _M;