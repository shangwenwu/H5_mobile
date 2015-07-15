
fis.config.merge({
    project: {
        charset: 'utf8',
        md5Length: 7
    },
    statics: '/static',
    templates: 'template',
    namespace: 'h5'
});

fis.config.merge({
    modules: {
        parser: {
            less: 'less',
            tmpl: 'utc'
        },
        postprocessor: {
            js: "jswrapper, require-async",
            html: "require-async"
        },
        postpackager: ['autoload', 'simple'],
        lint: {
            js: 'jshint'
        }
    },
    pack: {
        'pkg/common.min.css': [
            '/asserts/**.css'
        ],
        'pkg/common.min.js': [
            '/asserts/**.js'
        ]
    },
    roadmap: {
        ext: {
            less: 'css'
        },
        path: [
            {
                reg: '/asserts/**',
                useCache: false,
                isMod: false,
                release: '${statics}/${namespace}/$&'
            },
            {
                reg: '/page/**.html',
                useCache: false,
                release: '${templates}/${namespace}/$&'
            },
            {
                reg: /^\/modules\/([^\/]+)\/\1\.(js)$/i,
                isMod: true,
                id: '$1',
                release: '${statics}/${namespace}/$&'
            },
            {
                reg: /^\/modules\/(.*)\.(js)$/i,
                isMod: true,
                id: '$1',
                release: '${statics}/${namespace}/$&'
            },
            {
                reg: /^(.*)mixin\.less$/i,
                release: false
            },
            {
                reg: /^(.*)\.(css|less)$/i,
                release: '${statics}/${namespace}/$&'
            },
            {
                reg: '**.tmpl',
                isJsLike: true,
                release: false
            },
            {
                reg: /.*\.(html|jsp|tpl|vm|htm|asp|aspx|php)$/,
                useCache: false,
                release: '$&'
            },
            {
                reg: /^\/(config|test)\/(.*\.json$)/i,
                isMod: false,
                charset: 'utf8',
                release: '/$1/${namespace}/$2'
            },
            {
                reg: "**",
                release: '${statics}/${namespace}/$&'
            }
        ]
    },
    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        },
        lint: {
            jshint: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                node: true
            }
        }
    }
});

// console.log(JSON.stringify(fis.config));