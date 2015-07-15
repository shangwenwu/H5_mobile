/**
 * @file tip提示框
 * Created by jinguangguo on 2015/7/10.
 */

var uiDialog = require('h5:ui-dialog');

var tplFn = __inline('./ui-tip.tmpl');

var TYPE_SUCCESS = 'success';
var TYPE_FAIL = 'fail';

var HIDE_TIME = 3000;

var _public = {
    /**
     * 提示
     * @param config
     * {
     *  @param {string} 提示类型，这个参数是可选参数。如果没有这个值，那么显示普通提示框
     *                      "success" 成功类型；"fail"失败类型。
     *  @param {string} content
     *  @param {Function} onShow 当页面显示的时候，执行的方法
     *  @autoHide {boolean|number} 默认3秒钟关闭，如果输入的是毫秒数，那么按照指定数字时间关闭。
     *  				如果是true，3秒钟后关闭；如果是false,则不会关闭
     *  @onHide {Function} 当tip关闭的时候执行的方法
     * }
     */
    show: function(config) {
        if (!config.content) {
            throw new Error('The content of config is must !');
        }
        var params = {
            id: 'Tip',
            fixed: true,
            width: '231px',
            padding: '35px 30px',
            ok: false
        };
        params.content = tplFn({
            type: config.type,
            html: config.content
        });
        var tipDialog = uiDialog(params);
        tipDialog.showModal();
        if (config.onShow && typeof config.onShow === 'function') {
            config.onShow();
        }
        if (config.autoHide) {
            if (config.autoHide === true) {
                setTimeout(function() {
                    tipDialog.remove();
                    if (config.onHide) {
                        config.onHide();
                    }
                }, HIDE_TIME);
            } else if (typeof config.autoHide === 'number') {
                setTimeout(function() {
                    tipDialog.remove();
                    if (config.onHide) {
                        config.onHide();
                    }
                }, config.autoHide);
            }
        } else {
            // 什么也不做
        }
        return tipDialog;
    }
};

module.exports = _public;