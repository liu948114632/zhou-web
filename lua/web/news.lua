local template = require "resty.template"

local _M = {}

function _M.detail()
    template.render("tpl/news/newsDetail.html", {news = 'active', detail = true})
end

function _M.index()
    template.render("tpl/news/index.html", {news = 'active', detail = true})
end

function _M.list()
    template.render("tpl/news/list.html", {news = 'active'})
end
function _M.all()
    template.render("tpl/news/all.html", {news = 'active'})
end
function _M.search()
    template.render("tpl/news/search.html", {news = 'active'})
end

return _M
