/**
 * Created by jinguangguo on 2015/7/7.
 */
var _private = {
    $canvas: null,
    referCount: 0,  // 记录同时出现多个遮罩层
    /**
     * 显示
     */
    getCanvasHtml: function() {
        var winWidth = window.screen.width;
        var winHeight = window.screen.height;
        var $canvas = $('<div class="module-canvas"></div>');
        $canvas.css({
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            opacity: 0.6,
            width: winWidth + 'px',
            height: winHeight + 'px'
        });
        this.$canvas = $canvas;
        return this.$canvas;
    },
    bindCanvas: function() {
        var that = this;
        $(window).off('resize.canvas').on('resize.canvas', function() {
            var $win = $(this),
                w = $win.width(),
                h = $win.height();
            that.$canvas.width(w);
            that.$canvas.height(h);
        });
    },
    unbindCanvas: function() {
        $(window).off('resize.canvas');
    }
};

var _public = {
    /**
     * 显示遮罩
     * @param config
     * {
     *  @param {string} id 嵌入的container的id，可以为空，可以是'#mainbody'或者'mainbody'
     *  @param {Function} onRender 渲染时候要执行的函数，可以为空
     * }
     */
    show: function(config) {
        var $container;
        var containerId = config.id;
        if (config.$container) {
            $container = config.$container;
        } else {
            if (!config.id) {
                $container = $('body');
            } else {
                if (containerId.indexOf('#') >= 0) {
                    $container = $(containerId);
                } else {
                    $container = $('#' + containerId);
                }
            }
        }
        _private.referCount ++;
        var html = _private.getCanvasHtml();
        $container.html(html);
        _private.bindCanvas();
        if (config.onRender && typeof config.onRender === 'function') {
            config.onRender.call(this, _private.$canvas);
        }
    },
    /**
     * 隐藏遮罩
     */
    hide: function() {
        _private.referCount --;
        if (_private.referCount <= 0) {
            _private.referCount = 0;
            _private.$canvas && _private.$canvas.remove();
            _private.unbindCanvas();
        }
    }
};

module.exports = _public;