/**
 * @project jiuxin
 * @author jialaibin
 * @version 1.0
 */

;(function (win) {

var noop = function () {};
var slice = Array.prototype.slice;
var bind = function(fn, context){
    if (arguments.length < 2 && context===undefined) return fn;
    var method = fn,
        args   = slice.call(arguments, 2);
    return function(){
        var array = slice.call(arguments, 0);
        method.apply(context,args.concat(array));
    };
};

var decode = function (text) {
    var ret;
    try{
        ret = decodeURIComponent(text);
    }catch(e){
        ret = decodeURIComponent(escape(text));
    }
    return ret;
};

// hashchange的响应由浏览器触发 有异步的问题 类似ajax刚发完请求时不能直接使用数据
// 不准确的写法：
//      Router.navigate('inbox');
//      这句打印历史是不准确的 因为浏览器的hashchange事件可能没有执行完成
//      console.log(InboxController.type);
var Router = {
    lastHash : '',
    currentHash : '',
    currentType : '',
    getHash : function (key) {
        // 为兼容firefox下对location.hash的自动decode
        // 所以需要从location.href里取出hash值
        var hash = location.href.match(/#(.*)$/);
        hash = hash ? hash[1].replace(/^#/, '') : '';

        // 如果指定key 返回对应的值
        if (!key) {
            return hash;
        } else {
            var match = hash.match(new RegExp('\\/'+key+'=([^\\/]*)'));
            return match ? match[1] : '';
        }
    },
    /*
     * options.replace
     */
    setHash : function (hash, options) {
        options = options || {};
        var t = this,
            current = t.currentHash,
            changed = (current !== hash && t.getHash() !== hash), // 使用getHash确认真正有变化
            replace = !!options.replace;

        if (changed) {
            if (!!options.replace) {
                location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + hash);
            } else {
                location.hash = hash;
            }
        }

        return changed;
    },
    /*
     * 综合路由方法
     * options.replace
     * options.trigger
     */
    navigate : function (hash, options) {
        options = options || {};
        options.replace = !!options.replace;

        var t = this;
        // 标记本次路由是有App内部触发的
        t._innerFire = true;
        t._trigger = typeof options.trigger === 'boolean' ? options.trigger : true;

        if (typeof hash === 'number') {
            history.go(+hash);
        } else {
            setTimeout(function () {
                t.setHash(hash, options);
            }, 10);
        }
    },
    _routeCount : 0,
    // 匹配路由
    parseHash : function(currentHash) {
        var t = this,
            callback      = noop,
            callbackParam = [],
            rules   = t._rules,
            prefix  = t._prefix,
            reg,
            matched = false,
            matches = null;

        currentHash = currentHash || t.getHash();

        for (var i in rules) {
        
            reg = '^' + i.replace(new RegExp(':[^\\/]+','g'), '([^\\/]+)') + '$';
            matches = currentHash.replace(new RegExp('^' + prefix), '').match(new RegExp(reg));
            
            if (matches) {
                /*
                 * 整理路由回调函数的参数
                 * demo
                 *      rule : 'session/sid=:sid/at=:at'
                 *      hash : #session/sid=888/at=0
                 * result
                 *      callbackParam : ['session', '888', '0']
                 */
                // 把第1项匹配改成 如 session/sid=888/at=0 >>> session
                matches[0] = matches[0].replace(/\/.*$/, '');
                for (var x=0, y=matches.length; x<y; x++) {
                    matches[x] = decode(matches[x]);
                }
                callbackParam = matches;
                callback = rules[i];
                // 当点击浏览器的前进后退时 也要保持currentHash的正确
                t.currentHash = currentHash;
                t.currentType = matches[0];
                matched = true;
                // 节省资源 + 防止傻帽 防止一个hash匹配到多个rule!!!
                break;
            }
        }

        return matched ? {
            callback : callback,
            callbackParam : callbackParam,
            matched : true
        } : {
            matched : false
        };
    },
    _listener : function () {
        //C.log('appR:'+this._innerFire);
        var t           = this;

        t.lastHash = t.currentHash;
        var currentHash = t.getHash();
        
        // 如果有hash值
        if (currentHash) {

            var parsedCurrentHash = t.parseHash(currentHash);
            // 如果当前的hash有匹配
            if (parsedCurrentHash.matched) {

                t.currentHash     = currentHash;
                var callback      = parsedCurrentHash.callback;
                var callbackParam = parsedCurrentHash.callbackParam;
                
                // 响应前的检查
                t.fire('valid', callbackParam);

                // 执行正常route回调
                t._trigger && callback.apply(t, callbackParam);

                // 非中转路由响应route回调
                if (callbackParam[0].indexOf('redirect') === -1) {
                    t.fire('route', callbackParam);
                } 
                
                t._reset();
                t._routeCount++;
            }
            // 如果当前的hash没有匹配
            else {
                t.currentHash = 'NoRouterRuleIsMatched';
                // 如果没有匹配到任何路由 进行提示
                console.log('No router rule is matched!!');
            }
        }
        // 如果没有hash值
        else {
          
            // 当hash为空时 执行默认route
            // NOTE: 首次匹配不是hashchange事件触发的
            // Router.navigate(t._indexType, {
                // replace : true
            // });
            t.currentHash = '';
            t.currentType = '';
            t.fire('route', []);
            t._index.apply(t);
            
        }
    },
    /*
     * 规则举例
     * session         => ^session$
     * session/sk=:sk  => ^session\\/sk=([^/]+)$
     */
    _rules : {},
    _index : noop,
    _indexType : 'default',
    _prefix : '',
    // hash变化时的通用回调
    // 通常将hash变化时的UI状态管理写入该回调 避免在所有的rule中都写一遍
    _onRoute : noop,
    _callbacks : {
        valid : [],
        route : []
    },
    on : function (type, fn) {
        var t = this;
        t._callbacks[type].push(fn);
    },
    off : function (type, fn) {
        var t = this;
        if (!fn) {
            t._callbacks[type] = [];
        } else {
            var callbacks = t._callbacks[type];
            callbacks.splice(callbacks.indexOf(fn), 1);
        }
    },
    fire : function (type, param) {
        var t = this, 
            callbacks = t._callbacks[type];
        
        if (!callbacks) return;
        
        for (var i=0, callback; callback = callbacks[i]; i++) {
            var ret = callback.apply(t, param);
            if (type === 'valid' && ret === false) {
                t._trigger = false;
                break;
            }
        }
    },
    /*
     * Router.init({
     *    prefix : '/'
     *    rules : {
     *        'home' : goHome,
     *        'list' : goList
     *    },
     *    // 默认回调
     *    index : function () {},
     *    // 当执行默认路由时 指定一个默认的type 通常是表示"首页"的type
     *    indexType : 'xxx',
     *    onRoute : function () {}
     * });
     *
     */
    init : function (options) {
        var t        = this,
            listener = t._listener,
            options  = options || {};

        t._index         = options.index || noop;
        t._indexType     = options.indexType || 'default';
        t._prefix        = options.prefix || '';
        
        if (typeof options.onRoute === 'function') {
            t.on('route', options.onRoute);
        }
        
        if (typeof options.onValid === 'function') {
            t.on('valid', options.onValid);
        }

        t.addRules(options.rules);

        // 绑定监听事件
        if ('onhashchange' in window) {
            window.onhashchange = bind(t._listener, t);
            // 初始化时就直接开始匹配当前url 免得再独立写start之类的方法
            t._listener();
        } else {
            console.log('onhashchange is NOT support');
            setInterval(bind(t._listener, t), 100);
        }

        t.init = noop;
    },
    addRules : function (rules) {
        rules = rules || {};
        var t = this;
        for (var rule in rules) {
            if (rules.hasOwnProperty(rule)) {
                t._rules[rule] = rules[rule];
            }
        }
    },
    _reset : function () {
        var t = this;
        t._innerFire = false;
        t._trigger = true;
    },
    _innerFire : false,
    // 是否执行路由对应的回调函数
    _trigger : true,
    log : function () {
        var t = this;
        console.log('> currentHash:');
        console.log(t.currentHash);
        console.log('> lastHash:');
        console.log(t.lastHash);
    }
};

win.Router = Router;
    
})(window);

