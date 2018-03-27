local template = require "resty.template"
local session = require "session"

local _M = {}

function _M.address()
    local user = session.get();
    local codeType = 'mobile';
    if string.find(user['loginName'], '@') then
        codeType = 'email'
    end
    template.render("tpl/finance/address.html", {funds = 'active', address = 'on', codeType = codeType})
end

function _M.asset()
    template.render("tpl/finance/asset.html", {funds = 'active', asset = 'on'})
end

function _M.open()
    template.render("tpl/finance/open.html", {orders = 'active', asset = 'on'})
end

function _M.bill()
    template.render("tpl/finance/bill.html", {orders = 'active', bill = 'on'})
end

function _M.payin()
    template.render("tpl/finance/payin.html", {funds = 'active', payin = 'on'})
end

function _M.payout()
    template.render("tpl/finance/payout.html", {funds = 'active', payout = 'on'})
end

return _M