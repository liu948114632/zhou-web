local cache = ngx.shared.cache

local _M = {}

local __version = "1.0.0.18" -- param_version

function _M.getResources()
    if ngx.var.env == 'production' then
--        return "//bilaxy.s3.ca-central-1.amazonaws.com" --oss css/js
        return "" --oss css/js
    else
        return ""
    end
end

function _M.getImgResources()
    return "//bilaxy.s3.ca-central-1.amazonaws.com/"
--    return ""
end

function _M.getBasePath()
    return "/api"
end

function _M.changeVersion(v)
    cache:set("version", v)
end

function _M.getVersion()
    local version = cache:get("version")
    if version~=nil then
        return version
    end
    return __version
end

return _M;