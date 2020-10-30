/**
 * @file san config
 * @author Lohoyo <824591872@qq.com>
 *
 */

import Reader from './components/reader';
import locales from './locales.json';

/* global ClientAddonApi */
if (window.ClientAddonApi) {
    ClientAddonApi.addLocales(locales);
    ClientAddonApi.defineComponent('san.widgets.components.reader', Reader);
}
