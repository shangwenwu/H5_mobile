Router.addRules({
    'login' : function () {
        J.Controllers['login'] ? J.Controllers['login'].render() : J.Controllers['login'] = new LoginController();
    },

    'login/url=:url' : function (type, url) {
        var options = {url : url};
        J.Controllers['login'] ? J.Controllers['login'].render() : J.Controllers['login'] = new LoginController(options);
    }
});

var loginTpl = require('h5:loginController/loginTpl');
require('h5:base/base64');

var LoginController = function(options){
	var t = this;
	this.url = options && options.url || '';
    t.init();
    // t.listenFun();
};


LoginController.prototype = {
	init: function(){
		var t = this;
        t.el = $(loginTpl);
		$('#mainBody').html(t.el);
		J.Common.renderTitle({
		    id: 'mainHeader',
		    text: '登录'
		});
    	t.events();
	},
	render: function(){
		var t = this;
		t.init();
	},

	events : function(){
	    var t = this;
        GlobalTap.register('login_page_module', {
            action: 'login',
            fn: function(e, o) {
				var result = t.checkLogin();
				if(result) {
					t.login();
				}
            }
        }, {
            action: 'forgetPass',
            fn: function(e, o) {
				var mobile = $.trim($("#userName").val());
				var url = mobile ? 'resetpw/mobile=' + mobile : 'resetpw';
				Router.navigate(url);
            }
        }, {
            action: 'showPass',
            fn: function(e, o) {
            	var node = $(e.target)
				if(node.hasClass('open')) {
					node.removeClass('open');
					$("#password").attr('type', 'password');
				} else {
					node.addClass('open');
					$("#password").attr('type', 'text');
				}
            }
        });
	},

    listenFun: function(){
        var t = this;
        Transceiver.listen('userInfo','login.init',function(data){
        	if(!!location.hash.match(/^#login/i)){
	            var user = JSON.parse(data);
	            if(user.isLogin) {
	            	if(t.url) {
	            		location.href = new Base64().decode(t.url);
	            	} else {
	            		Router.navigate('home');
	            	}
	            }
	        }
        	// Transceiver.destroy('userInfo','login.init');
        });
    },

    check: function (err, _val, check) {
        var _result;
        J.Utils.validator[check] && J.Utils.validator[check](_val, function (result, status) {
            if(result) {
               // err.siblings('.err').hide();
            } else {
                err.text(J.Utils.errorMsg[status]).css('visibility', 'visible');
            }
            _result = result;
        });
        return _result;
    },

    /**
     * 校验登录字段
     * @method checkLogin
     * */
	checkLogin: function () {
		var t = this;
		var name = $.trim($("#userName").val()),
			pass = $.trim($("#password").val()),
			err = $(".ui_error");
		
		if(t.check(err, name, $("#userName").data('check'))) {
			if(!t.check(err, pass, $("#password").data('check'))) {
				return false;
			}
		} else {
			return false;
		}
		err.css('visibility', 'hidden');
		return true;
	},

    /**
     * 登录
     * @method login
     * */
	login: function  () {
		var err = $(".ui_error"),
			t = this;
		var name = $.trim($("#userName").val()),
			pass = $.trim($("#password").val());
		var data = {
			username: name,
			password: pass	
		};
		var options = {
			url: J.Api.login,
			scopt: t,
			data: data,
			callback: function(data) {
				if(data.result == true) {
					if(t.url) {
						location.href = new Base64().decode(t.url);
					} else {
						Router.navigate('home');
						// location.href = '#home'
					}
				} else {
					err.text('用户名或密码错误').css('visibility', 'visible');
				}
			}
		};
		J.Utils.sendAjax(options);
	}
};

LoginController.prototype.constructor = LoginController;
module.exports = LoginController;