/*
 * author: jialaibin@baidu.com|real
 */

;(function (win, $) {
    var debug = true;
    var slice = Array.prototype.slice;

    var noop = function () {};

    var now = function () {
        return +new Date();
    };

    var supportTouch = 'ontouchstart' in window;

    var START  = supportTouch ? 'touchstart' : 'mousedown';
    var MOVE   = supportTouch ? 'touchmove'  : 'mousemove';
    var END    = supportTouch ? 'touchend'   : 'mouseup';
    var CANCEL = supportTouch ? 'touchcancel': 'mouseup';

    var bind = function(fn, context){
        if (arguments.length < 2 && context===undefined) return fn;
        var method = fn,
            args   = slice.call(arguments, 2);
        return function(){
            var array = slice.call(arguments, 0);
            method.apply(context,args.concat(array));
        };
    };

    /*

    */

    var Tap = function(options){
        var t = this;
        t.currentHoverTarget = null;
        t.init(options);
    };  
    Tap.prototype = {
        init : function (options) {
            var t = this;
            if (!options.selector) throw Error('"selector" is not defined.');

            options = t.options = $.extend({
                context    : 'body',
                toggle     : false,
                cls        : 'hover',
                rangeLimit : 8,   // 有效距离
                timeLimit  : 400, // 有效时间
                fn         : noop
            }, options);

            // outer config
            t.context            = $(options.context);
            t.selector           = options.selector;
            t.toggle             = options.toggle;
            t.cls                = options.cls;
            t.rangeLimit         = options.rangeLimit;
            t.timeLimit          = options.timeLimit;
            t.fn                 = options.fn;
            
            // inner config
            t.timeBeforeStylize  = 30;
            
            // privite properties
            t._timer             = null;
            t._startX            = 0;
            t._startY            = 0;
            t._diffX             = 0;
            t._diffY             = 0;
            t._startTime         = 0;
            t._lastFireTime      = 0;
            t._isFinish          = false;
            t.currentHover       = null;

            // NOTE: this._currentToggleTarget是局部的，而Tap.currentHoverTarget的全局的
            if (t.toggle) {
                t._currentToggleTarget = null;
                t._currentToggleStylized  = false; // true|false
            }
            
            t._startFn = bind(t._touchStart, t);
            t._moveFn  = bind(t._touchMove, t);
            t._endFn   = bind(t._touchEnd, t);

            t.context.on(START, t.selector, t._startFn);
        },
        // 返回true表示可用 否则不可用 /////////////
        check : function (target) {
            return !target.hasClass('disabled');
        },
        isTooFast : function () {
            var t = this;
            var time = now();
            if (time - t._lastFireTime < 310) {
                return true;
            }
            t._lastFireTime = time;
            return false;
        },
        _touchStart : function (e) {
            var t      = this,
                cls    = t.cls,
                point  = supportTouch ? e.touches[0] : e,
                target = $(e.target).closest(t.selector);
           
            // 如果不可用 则不响应
            if (!t.check(target)) {return;}

            // 各种初始状态赋值
            t._isFinish  = false;
            t._startX    = point.pageX;
            t._startY    = point.pageY;
            t._startTime = now();

            if (!t.toggle) {
                t.currentHover = Tap.currentHoverTarget;

                // 如果不是toggle状态，先移除当前的（如果上一次没有移除）高亮的hover元素
                t.currentHover && t.currentHover.removeClass(cls);

                // 更新全局target
                Tap.currentHoverTarget = target;
            } else {
                t._currentToggleTarget = target;
                t._currentToggleStylized  = target.hasClass(cls);
            }

            // 添加样式
            t._timer = setTimeout(function () {
                target.addClass(cls);
            }, t.timeBeforeStylize);

            target.on(MOVE, t._moveFn).on(END, t._endFn);
        },
        _touchMove : function (e) {
            var t = this,
                cls = t.cls,
                point = supportTouch ? e.touches[0] : e,
                rangeLimit = t.rangeLimit;

            t._diffX = Math.abs(point.pageX - t._startX);
            t._diffY = Math.abs(point.pageY - t._startY);

            if (t._diffX > rangeLimit || t._diffY > rangeLimit ) {
                t.finish(true);
            }
        },
        _touchEnd : function (e) {
            var t          = this,
                context    = t.context,
                cls        = t.cls,
                fn         = t.fn,
                toggle     = t.toggle,
                point      = supportTouch ? e.changedTouches[0] : e,
                target     = toggle ? t._currentToggleTarget : Tap.currentHoverTarget,
                rangeLimit = t.rangeLimit,
                timeLimit  = t.timeLimit;

            t._diffX = Math.abs(point.pageX - t._startX);
            t._diffY = Math.abs(point.pageY - t._startY);

            // 触发事件的条件：位置 + 时间
            if (t._diffX < rangeLimit && t._diffY < rangeLimit 
                && now() - t._startTime < timeLimit) {
                
                var callback = function () {
                    if (t.isTooFast()) return;
                    fn.call(target[0], e, {
                        context  : context,
                        target   : target,
                        stylized : toggle ? t._currentToggleStylized : null
                    });
                }		

                callback();
                t.finish();
            } else {
                t.finish(true);
            }
        },
        /*
         * @param cancel {Boolean} 是否是由取消行为调用的
         */
        finish : function (cancel) {
            cancel = !!cancel;
            var t = this,
                cls = t.cls,
                target = t.toggle === false ? Tap.currentHoverTarget : t._currentToggleTarget;

            if (t._isFinish) return;
            t._isFinish = true;

            // 去除事件
            target.off(MOVE, t._moveFn).off(END, t._endFn);

            if (t.toggle) {
                var todo = '';
                if ((t._currentToggleStylized && !cancel) || (!t._currentToggleStylized && cancel)) {
                    todo = 'removeClass';
                    t._currentToggleStylized = false;
                } else {
                    todo = 'addClass';
                    t._currentToggleStylized = true;
                }
                target[todo](cls);
            } else {
                target.removeClass(cls);
            }

            // 终止计时
            clearTimeout(t._timer);
        },
        destroy : function () {
            var t = this;
            t.context.off(START, t.selector, t._startFn);
        }
    };

    Tap.prototype.constructor = Tap;
    
    
    var globalTap = new Tap({
        context : 'body',
        selector : '.tap',
        cls : 'down',
        fn : function (e, o) {
            var target = o.target
            var action = target.attr('data-action')
            var hash = target.attr('data-hash')
            var href = target.attr('data-href')

            // 如果有指定动作
            if (action) {
                var globalActions = globalTap._globalActions
                var moduleActions = globalTap._moduleActions

                var fn;

                if (moduleActions[action]) {
                    var _moduleActions = moduleActions[action]
                    for (var moduleClass in _moduleActions) {
                        if (target.closest('.'+moduleClass).length) {
                            fn = _moduleActions[moduleClass]
                        }
                    }
                }

                if (!fn && $.isFunction(globalActions[action])) {
                    fn = globalActions[action]
                }

                if (fn) {
                    fn.call(null, e, o)
                } else {
                    debug && console.log('tap action: "'+o.target.attr('data-action')+'" missing!')
                }
            }

            // 如果有指定hash
            if (hash) {
                var frag = hash.split('#')
                B.Router.navigate(frag[1], {
                    replace : frag[0] === 'replace'
                })
            }

            // 如果有指定href
            if (href) {
                location.href = href;
            }

        }
    });
    $.extend(globalTap, {
        _globalActions : {},
        _moduleActions : {},
        /*
         * 为模块注册全局Tap
         * globalTap.register('session-class', {}, {}, ...);
         *
         * 为整个App注册Tap
         * globalTap.register({}, {}, ...);
         *
         * @param module
         * @param options
         */
        register : function () {
            var t = this,
                actions = t._actions,
                module = '',
                action,
                fn,
                item,
                global = true

            var params = Array.prototype.slice.call(arguments);

            // 如果第一个参数是模块名
            if (typeof params[0] === 'string') {
                module = params.shift()
                global = false
            }

            for (var i=0, l=params.length; i<l; i++) {
                item   = params[i]
                action = item.action
                fn     = item.fn

                if (global) {
                    var globalActions = globalTap._globalActions
                    if (!globalActions[action]) {
                        globalActions[action] = fn
                    } else {
                        debug & console.error('tap action name "'+action+'" conflict!!')
                    }
                } else {
                    var moduleActions = globalTap._moduleActions

                    if (!moduleActions[action]) {
                        moduleActions[action] = {}
                    }
                    moduleActions[action][module] = fn

                }
            }
        }
    });


    win.GlobalTap = globalTap;

})(window, Zepto);

