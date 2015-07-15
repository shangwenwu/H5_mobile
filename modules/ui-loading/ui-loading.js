/**
 * Created by jinguangguo on 2015/7/7.
 */


var uiCanvas = require('h5:ui-canvas');

var tmplFn = __inline('./ui-loading.tmpl');

var _public = {
    /**
     * 显示loading条
     * @param config
     * {
     *   @param {string} id 嵌入的container的id，可以是'#mainHeader'或者'mainHeader'
     * }
     */
    show: function(config) {
        if (!config.id) {
            throw new Error('The id of config is must !');
        }
        var $container;
        var containerId = config.id;
        if (containerId.indexOf('#') >= 0) {
            $container = $(containerId);
        } else {
            $container = $('#' + containerId);
        }
        uiCanvas.show({
            $container: $container,
            onRender: function($canvas) {
                $canvas.append(tmplFn({
                    text: config.text
                }));
            }
        });
    }
};

module.exports = _public;