/**
 * @file san config
 * @author Lohoyo <824591872@qq.com>
 *
 */

const clientAddonConfig = require('san-cli-ui/san.addon.config');

module.exports = {
    ...clientAddonConfig({
        id: 'san.webpack.client-addon.widget.reader',
        port: 8892
    })
};
