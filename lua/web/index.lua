local template = require "resty.template"
local rpc = require "rpc"
local req = require "req"
local ck = require "resty.cookie"

local _M = {}

function _M.index()
    local args = req.getArgs();
    local intro = args['intro'];
    local cookie, err = ck:new()
    if not cookie then
        ngx.say("Enable ur browser cookie please")
        ngx.log(ngx.ERR, err)
        return
    end
    cookie:set({ key = "intro", value = intro, path = '/', max_age = 60 * 60 * 24 * 365 })
    local res = rpc.call('/v1/banner')
    template.render("tpl/index.html", {  home = "active", res = res })
end

return _M