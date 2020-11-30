/**
 * @file 插件配置
 * @author Lohoyo <824591872@qq.com>
 *
 */

module.exports = api => {
    if (process.env.SAN_CLI_UI_DEV) {
        api.registerAddon({
            id: 'san.widgets.client-addon.dev2',
            url: 'http://localhost:8892/index.js'
        });
    }
    else {
        api.registerAddon({
            id: 'san.widgets.reader.client-addon',
            path: 'san-cli-ui-widget-reader/dist'
        });
    }

    api.registerWidget({
        id: 'san.widgets.reader',
        title: 'san-cli-ui-widget-reader.title',
        description: 'san-cli-ui-widget-reader.description',
        icon: 'read',
        component: 'san.widgets.components.reader',
        minWidth: 5,
        minHeight: 1,
        maxWidth: 5,
        maxHeight: 6,
        defaultWidth: 5,
        defaultHeight: 4,
        openDetailsButton: true,
        defaultConfig: () => ({
            url: 'https://www.zhihu.com/column/c_1184770014971883520'
        }),
        async onConfigOpen() {
            return {
                prompts: [
                    {
                        name: 'url',
                        type: 'input',
                        message: 'san-cli-ui-widget-reader.prompts.url',
                        validate: input => !!input
                    }
                ]
            };
        }
    });

    const newsCache = global['san.newsCache'] = global['san.newsCache'] || {};
    let parser;

    api.onAction('san-cli-ui-widget-reader.actions.fetch-news', async params => {
        if (!parser) {
            const Parser = require('rss-parser');
            parser = new Parser();
        }

        if (!params.force) {
            const cached = newsCache[params.url];
            if (cached) {
                return cached;
            }
        }

        let url = params.url;
        // GitHub repo
        if (url.match(/^[\w_.-]+\/[\w_.-]+$/)) {
            url = `https://github.com/${url}/releases.atom`;
        }

        const result = await parser.parseURL(url);
        newsCache[params.url] = result;
        return result;
    });
}
