local user_agent = ngx.var.http_user_agent

local is_program = string.find(user_agent, 'Apache%-HttpClient')

if is_program ~= nil then
    --ngx.exit(-1)
end
