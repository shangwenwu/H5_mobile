/**
 * Created by jinguangguo on 2015/7/7.
 */

var _private = {
    el: null,
    getHtmlByData: function(text, isHideReturn) {
        var tmplFn = __inline('./ui-title.tmpl');
        var html = tmplFn({
            text: text,
            isHideReturn: isHideReturn || false
        });
        this.el = $(html);
        return this.el;
    },
    bindReturnEvent: function(callback) {
        GlobalTap.register('module_title',{
            action: 'return',
            fn: function (e, o) {
                if (callback) {
                    callback();
                } else {
                    window.history.go(-1);
                }
            }
        });
    }
};

var _public = {
    /**
     * 渲染title
     * @param config 配置
     *  {
     *  @param {string} id 嵌入的container的id，可以是'#mainHeader'或者'mainHeader'
     *  @param {string} text 文本内容
     *  @param {Function} onReturn 点击返回时候的回调函数
     *  @param {boolean} isHideReturn 是否隐藏返回按钮
     *  }
     * @example
     * var uiTitle = require('h5:ui-title');
        uiTitle.render({
            id: 'mainHeader',
            text: '首页',
            onReturn: function() {
                alert('ok...');
            },
            isHideReturn: false
        });
     */
    render: function(config) {
        if (!config.id) {
            throw new Error('The id of config is must !');
        }
        if (!config.text) {
            throw new Error('The text of config is must !');
        }
        var containerId = config.id;
        var html = _private.getHtmlByData(config.text, config.isHideReturn);
        if (containerId.indexOf('#') >= 0) {
            $(containerId).html(html);
        } else {
            $('#' + containerId).html(html);
        }
        if (!config.isHideReturn) {
            _private.bindReturnEvent(config.onReturn);
        }
    }
};

module.exports = _public;