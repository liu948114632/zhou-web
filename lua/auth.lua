--访问权限拦截
local session = require "session"

local intercept_uri = {
    '/account',
    '/finance',
    '/support',
}

local logined_forbid_url = {
    '/user'
}

local not_intercept_uri = {}

local _M = { }
function testUrl(uri,arr)
    local flag = false
    for i = 1, #arr do
        local len = #arr[i]
        local str = string.sub(uri,1,len)
        if(str == arr[i]) then
            flag = true
        end
    end
    return flag
end

function _M.filter()
    local uri = ngx.var.uri

    if testUrl(uri, logined_forbid_url) then
        local user = session.get();
        if user ~= nil then
            ngx.redirect('/')
        end
    end

    if testUrl(uri,intercept_uri) and not testUrl(uri, not_intercept_uri) then
        local user = session.get();
        if user == nil then
            ngx.redirect('/user/login');
        else
            if string.find(uri, "/finance") ~= nil then
                --[[if  not user['auth'] then
                    ngx.redirect('/account/auth');
                end]]
               --[[ if  not user['authDeep'] then
                    ngx.redirect('/account/auth-deep');
                end]]
            end
        end
    end
end

return _M