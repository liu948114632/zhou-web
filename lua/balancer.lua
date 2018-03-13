local balancer = require "ngx.balancer"
local upstream = require "ngx.upstream"

local upstream_name = 'server_front'

local srvs = upstream.get_servers(upstream_name)

function get_server()
    local cache = ngx.shared.cache
    local key = "req_index"
    local index = cache:get(key)
    if index == nil or index > #srvs then
        index = 1
        cache:set(key, index)
    end
    cache:incr(key, 1)
    return index
end

function hashConvert(v,ext)
    local ch = 0
    local val = 0
    if(v) then
        for i=1,#v do
            ch = v:byte(i)
            if( ch >= 65 and ch <= 90 ) then
                ch = ch + 32
            end
            val = val*0.7 + ch
        end
    end
    val = val .. ''
    val = val:gsub("+","")
    val = val:gsub("%.","")
    if(ext)then
        return string.format('%s.%s',val,ext)
    else
        return string.format('%s',val)
    end
end

function is_down(server)
    local down = false
    local perrs = upstream.get_primary_peers(upstream_name)
    for i = 1, #perrs do
        local peer = perrs[i]
        if server == peer.name and peer.down == true then
            down = true
        end
    end
    return down
end

----------------------------

local route = ngx.var.cookie_route

local server

if route then
    for k, v in pairs(srvs) do
        if ngx.md5(v.name) == route then
            server = v.addr
        end
    end
    if not server or is_down(server) then
        route = nil
    end
end
--
if not route then
--    local index = hashConvert(ngx.var.remote_addr) % #srvs
--    server = srvs[index + 1].addr
    for i = 1, #srvs do
        if not server or is_down(server) then
            server = srvs[get_server()].addr
        end
    end
    ngx.header["Set-Cookie"] = 'route=' .. ngx.md5(server) .. '; path=/;'
end

if server then
    local index = string.find(server, ':')
    local host = string.sub(server, 1, index - 1)
    local port = string.sub(server, index + 1)
    balancer.set_current_peer(host, tonumber(port))
else
    ngx.log(ngx.ERR, "========== not server ", server, route)
end


