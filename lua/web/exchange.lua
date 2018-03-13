local template = require "resty.template"

local _M = {}

function _M.index()
    template.render("tpl/exchange.html", {exchange = 'active'})
end

function _M.kline()
    template.render("tpl/kline.html")
end

function _M.kline_white()
    template.render("tpl/kline-white.html")
end

function _M.official()
    template.render("tpl/official.html", {exchange = 'active'})
end

return _M