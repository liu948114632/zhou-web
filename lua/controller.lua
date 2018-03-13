local auth = require "auth"
auth.filter()
local uri = ngx.var.uri
local gsub = string.gsub
local is_debug = true -- 调试阶段
local m, err = ngx.re.match(uri, '/([a-zA-Z0-9-]+)/*([a-zA-Z0-9-]*)')

if m ==nil then
    m = {}
    m[1] = "index"
    m[2] = ""
end

if err then
    ngx.exit(404)
end

local moduleName = m[1] -- 模块名
local method = m[2] -- 方法名

if moduleName == nil or method == nil then
    ngx.exit(404)
end

if method == "" then
    method = 'index'
end

method = (gsub(method, '-', '_'))

local prefix = "web."
local path = prefix .. moduleName
local ret, ctrl = pcall(require, path)

if ret == false then
    if is_debug then
        ngx.status = 404
        ngx.say("<p style='font-size: 50px'>Error: <span style='color#ff4b33'>" .. moduleName .. "</span> module not found !</p>")
    end
    ngx.exit(404)
end

local req_method = ctrl[method]

if req_method == nil then
    if is_debug then
        ngx.status = 404
        ngx.say("<p style='font-size: 50px'>Error: <span style='color#ff4b33'>" .. method .. "()</span> method not found in <span style='color#ff4b33'>" .. moduleName .. "</span> lua module !</p>")
    end
    ngx.exit(404)
end

ret, err = pcall(req_method)

if ret == false then
    if is_debug then
        ngx.status = 404
        ngx.say("<p style='font-size: 50px'>Error: <span style='color#ff4b33'>" .. err .. "</span></p>")
    else
        ngx.exit(500)
    end
end