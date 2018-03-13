local template = require "resty.template"

local _M = {}

function _M.login()
    template.render("tpl/user/login.html")
end

function _M.register()
    template.render("tpl/user/register.html")
end

function _M.forget()
    template.render("tpl/user/forget.html")
end

return _M
