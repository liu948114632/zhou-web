--
-- Created by IntelliJ IDEA.
-- User: liuyuanbo
-- Date: 2018/4/9
-- Time: 9:35
-- To change this template use File | Settings | File Templates.
--
local template = require "resty.template"
local _M = {}
function _M.contactUs()
template.render("tpl/aboutus/contactUs.html", {aboutus = 'active', contactUs = 'active'})
end

function _M.about()
    template.render("tpl/aboutus/about.html", {aboutus = 'active', about = 'active'})
end

function _M.team()
    template.render("tpl/aboutus/team.html", {aboutus = 'active', team = 'active'})
end

return _M
