local template = require "resty.template"
local session = require "session"

local _M = {}

function _M.auth()
    local user = session.get()
    if(user['no'] ~= ngx.null and #user['no'] > 12) then
        user['no'] = string.sub(user['no'], 1, 4) .. '********' ..string.sub(user['no'], 13, #user['no'])
    end
    template.render("tpl/account/auth.html", {account = 'active', user = user})
end

function _M.auth_deep()
    local user = session.get();
    if(user['no'] ~= ngx.null and #user['no'] > 12) then
        user['no'] = string.sub(user['no'], 1, 4) .. '********' ..string.sub(user['no'], 13, #user['no'])
    end
    if user['auth'] then
        template.render("tpl/account/auth_deep.html", {account = 'active' ,  user = user})
    else
        template.render("tpl/account/auth.html", {account = 'active' , user = user})
    end
end

function _M.message()
    template.render("tpl/account/message.html", {account = 'active', message = 'on'})
end

function _M.email()
    template.render("tpl/account/email.html", {account = 'active', email = 'on'})
end

function _M.phone()
    template.render("tpl/account/phone.html", {account = 'active', phone = 'on' })
end

function _M.password()
    template.render("tpl/account/password.html", {account = 'active'})
end

function _M.safe()
    local user = session.get();
    template.render("tpl/account/safe.html", {account = 'active', user = user})
end

function _M.safeword()
    template.render("tpl/account/safeword.html", {account = 'active'})
end

function _M.google()
    local user = session.get();
    local flag = user.googleBind;
    template.render("tpl/account/google.html", {account = 'active', googleBind = flag})
end

return _M