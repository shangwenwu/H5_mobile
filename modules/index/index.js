require('h5:base/common');



// J.Api = require('h5:api');
var Rewrite = require('h5:rewrite');
J.Api = new Rewrite();

var HomeController = require('h5:homeController');
require('h5:loginController');
require('h5:projectController');
require('h5:repayRecordController');
require('h5:underRepayController');
require('h5:investDetailController');
require('h5:payController');
require('h5:accountController');
require('h5:fundsRecordController');
require('h5:rechargeController');
require('h5:withdrawController');
require('h5:couponController');

require('h5:registerController');
require('h5:resetpwController');
require('h5:trusteeshipController');
require('h5:bankCardController');

Router.init({
    indexType : 'home',
    index : function (type) {
        //页面路由首次要执行的对象；
        J.Controllers['home'] ? J.Controllers['home'].init() : J.Controllers['home'] = new HomeController();
    },
    rules : {

        //有可能首次打开的页面路由
        /*'redirect/from=passport/' : function () {
            var t = this;
            // 正式用户登录转跳方式
            // 如果没有lastHash，说明是由外部域进入app
            // 如果lastHash是home，说明是点击了浏览器的回退
            if (!t.lastHash.length || t.lastHash === 'home') {
                t.navigate('home');

            }
        }*/


    },
    //路由跳转检测的事件
    onValid : function () {
        // 加载loading条
        J.Common.renderLoading({
            id: 'mainBody'
        });
    },
    onRoute : function () {
        //获取用户信息
        var getUserInfo =  function  () {
            var t = this, user = {};
            J.Utils.getUserInfo({
                scopt: t,
                type: 'GET',
                callback: function (data) {
                    user = data;
                    user.isLogin = true;
                    Transceiver.trigger('userInfo',[JSON.stringify(user)]);
                },
                notLoginCallback: function  () {
                    user.isLogin = false;
                    Transceiver.trigger('userInfo',[JSON.stringify(user)]);
                }
            })
        }();
    }
});


