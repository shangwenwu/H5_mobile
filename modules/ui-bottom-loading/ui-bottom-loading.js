/**
 * Created by tangliang on 2015/7/7.
 */


var tpl = '<div class="ui_loading"><span class="img"></span>加载中</div>';

var _public = {
    /**
     * @param config
     * {
     *   @param {string} container id
     * }
     */
    render: function(config) {
        if (!config.id) {
            throw new Error('The id of config is must !');
        }
        var containerId = config.id;
        if (containerId.indexOf('#') >= 0) {
            $(containerId).append(tpl);
        } else {
            $('#' + containerId).append(tpl);
        }
    }
};

module.exports = _public;