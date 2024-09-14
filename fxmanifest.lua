fx_version 'cerulean'
game 'gta5'

name 'qbx_p7_garages'
description 'Garage system for Qbox with UI'
repository 'https://github.com/fproject7/qbx_p7_garages'
version '1.1.1'

ox_lib 'locale'

shared_scripts {
    '@ox_lib/init.lua',
    '@qbx_core/modules/lib.lua',
    'shared/*',
}

ui_page 'web/build/index.html'

client_scripts {
    '@qbx_core/modules/playerdata.lua',
    'client/main.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/spawn-vehicle.lua',
}

files {
    'config/client.lua',
    'locales/*.json',
    'web/build/index.html',
    'web/build/assets/*.css',
    'web/build/assets/*.js',  
}

lua54 'yes'
use_experimental_fxv2_oal 'yes'