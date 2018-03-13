local template = require "resty.template"

local _M = {}

function _M.spread()
    template.render("tpl/activity/spread.html", {spread = 'active'})
end
return _M
