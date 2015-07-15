/**
 * @project jiuxin
 * @author jialaibin
 * @version 1.0
 */
;(function (win) {
    
    var PROTOTYPE = 'prototype';
    var breaker = {};
    var ArrProto = Array[PROTOTYPE],
    ObjProto = Object[PROTOTYPE],
    FunProto = Function[PROTOTYPE];
    
    var nativeForEach = ArrProto.forEach,
    slice = ArrProto.slice;
    
    var ext = function (o, offer) {
        for (var i in offer) {
            offer.hasOwnProperty(i) && (o[i] = offer[i]);
        }
        return o;
    }
    
    var getConstructorName = function (o) {
        return o != null && toString.call(o).slice(8, -1);
    }
    
    var isArray = function (o) {
        return getConstructorName(o) == 'Array';
    }
    
    // Has own property?
    var own = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    
    each = function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
          }
        } else {
          for (var key in obj) {
            if (own(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
          }
        }
    };
    
    // Escape a string for HTML interpolation.
    escape = function (string) {
        return ('' + string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    };
    
    // Fill in a given object with default properties.
    defaults = function (obj) {
        each(slice.call(arguments, 1), function (source) {
            for (var prop in source) {
                if (obj[prop] == null)
                    obj[prop] = source[prop];
            }
        });
        return obj;
    };
    
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    templateSettings = {
        evaluate : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape : /<%-([\s\S]+?)%>/g
    };
    
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /.^/;
    
    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        '\\' : '\\',
        "'" : "'",
        'r' : '\r',
        'n' : '\n',
        't' : '\t',
        'u2028' : '\u2028',
        'u2029' : '\u2029'
    };
    
    for (var p in escapes) {
        escapes[escapes[p]] = p;
    }
    
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;
    
    // Within an interpolation, evaluation, or escaping, remove HTML escaping
    // that had been previously added.
    var unescape = function (code) {
        return code.replace(unescaper, function (match, escape) {
            return escapes[escape];
        });
    };
    
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    var template = function (text, data, settings) {
    
        settings = defaults(settings || {}, templateSettings);
        
		if (!text) {
			console.error('template missing');
			// debug_start
			console.dir(data);
			// debug_end
			return;
		} 
        // Compile the template source, taking care to escape characters that
        // cannot be included in a string literal and then unescape them in code
        // blocks.
        var source = "__p+='" + text
            .replace(escaper, function (match) {
                return '\\' + escapes[match];
            })
            .replace(settings.escape || noMatch, function (match, code) {
                return "'+\nescape(" + unescape(code) + ")+\n'";
            })
            .replace(settings.interpolate || noMatch, function (match, code) {
                return "'+\n(" + unescape(code) + ")+\n'";
            })
            .replace(settings.evaluate || noMatch, function (match, code) {
                return "';\n" + unescape(code) + "\n;__p+='";
            }) + "';\n";
        
        // If a variable is not specified, place data values in local scope.
        if (!settings.variable)
            source = 'with(obj||{}){\n' + source + '}\n';
        
        source = "var __p='';\n" + source + "\nreturn __p;\n";
        
        var render = new Function(settings.variable || 'obj', source);
        if (data)
            return render(data);
        var tpl = function (data) {
            return render.call(this, data);
        };
        
        // Provide the compiled function source as a convenience for build time
        // precompilation.
        tpl.source = 'function(' + (settings.variable || 'obj') + '){\n' +
            source + '}';
        
        return tpl;
    };
    win.Template = template;

})(window);
