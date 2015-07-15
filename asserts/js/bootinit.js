/**
 * @project jiuxin
 * @author jialaibin
 * @version 1.0
 */

//兼容IE9以下的map方法
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        var T, A, k;
        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A;
    };
}


if (typeof console == "undefined") {
    var noop = function () {
    };
    var console = {
        log: noop,
        assert: noop,
        info: noop,
        warn: noop,
        error: noop
    };
}

//覆盖原生方法
//汉字字符判断长度
String.prototype.len = (function () {
    var ascRegexp = /[^\x00-\xFF]/g;
    return this.replace(ascRegexp, '..').length;
});

String.prototype.chinesesubstr = (function (begin, num) {
    var ascRegexp = /[^\x00-\xFF]/g, i = 0;
    while (i < begin) (i++ && this.charAt(i).match(ascRegexp) && begin--);
    i = begin;
    var end = begin + num;
    while (i < end) (i++ && this.charAt(i).match(ascRegexp) && end--);
    return this.substring(begin, end);
});

String.prototype.toEntity = function () {
    return this.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

if (typeof String.prototype.trim == "undefined") {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/gi, "");
    };
}

if (typeof Array.isArray == "undefined") {
    Array.isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
}
Array.toStringify = function (arr) {
    if (Array.isArray(arr)) {
        return $.stringify(arr);
    }
    return arr;
};

(function (win) {

    var jiuxin = {
        DEBUG: true,
        getParam: function (name, src) {
            var re = new RegExp('(?:^|\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
            var m = re.exec(src || location.href);
            return m ? encodeURI(m[1]) : '';
        },
        setParam: function (name, str, src) {
            var re = new RegExp('(?:^|\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
            var m = re.exec(src || location.href);
            if (m != null) return src.replace(m[1], str);
            return null;
        },
        getSearch: function () {
            var url = decodeURI(location.search), param = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    param[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
                }
            }
            return param;
        },
        cookie: {
            set: function (key, value) {
                var Days = 30; //保存 30 天
                var exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                doc.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
            },
            get: function (key) {
                var arr = doc.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
                if (arr != null)
                    return unescape(arr[2]);
                return null;
            },
            remove: function (key) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var val = this.get(key);
                if (val != null) doc.cookie = key + "=" + val + ";expires=" + exp.toGMTString();
            }
        },
        Controllers: {}

    };

    win.J = jiuxin;

})(window);

(function () {
    /*var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var createEscaper = function (map) {
        var escaper = function (match) {
            return map[match];
        };

        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };*/
    window._ = {};
    window._.escape = function(s) {
        if (typeof s === 'number') {
            s = s + '';
        }
        return s.toEntity();
    }
})();