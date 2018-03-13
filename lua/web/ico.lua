local template = require "resty.template"

local _M = {}

function _M.index()
    template.render("tpl/ico/list.html", {ico = 'active'})
end

function _M.detail()
    template.render("tpl/ico/detail.html", {ico = 'active'})
end

function _M.index()
    template.render("tpl/ico/log.html", {account = 'active'})
end

return _M