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
            parser = new Parser({
                headers: {
                    // 以下两个请求头参数用于避免订阅知乎专栏时的人机验证
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
                    "cookie": '__cfduid=d0546c8e79d64b5830dc24559264809cc1611663676; cf_chl_1=85ad4ac3065c374; cf_chl_prog=a17; cf_clearance=38ffa64db1e6530637e74c15889d25c7b697377e-1611664131-0-250'
                }
            });
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
