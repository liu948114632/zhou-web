local template = require "resty.template"
local _M = {}

function _M.index()
    template.render("tpl/support/index.html")
end

function _M.mine()
    template.render("tpl/support/mine.html")
end

return _M
