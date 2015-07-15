var _id, user = {}, couponList = [];
Router.addRules({
    'investDetail/id=:id' : function (type, id) {
    	_id = id;
        var options = {id : id};
        J.Controllers['investDetail'] ? J.Controllers['investDetail'].render(options) : J.Controllers['investDetail'] = new InvestDetailController(options);
    }
});

var investModule = {},
    tpl = require('h5:investDetailController/wrapperTpl');
var InvestDetailController = function(options){
	var t = this;
	// this.url = options && options.url || '';
	t.el = $('<div id="InvestDetailPageModule" class="investDetail_page_module"></div>');
    t.init(options);
    t.listenFun();
};

InvestDetailController.prototype = {
	init: function(options){
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '投资详情'
        });
		var t = this;
		$('#mainBody').html(t.el);
        t.fetch(options);
	},

	render: function(options){
		var t = this;
		t.init(options);
	},

	reduceTime: function () {
		var _dom = $('.waiting_time'),
        	timestamp = parseInt(_dom.attr("data-leftTime")),
            down = setInterval(function () {
                var str = J.Utils.timeElapsed(timestamp);
                _dom.html('开抢倒计时 ' + str);
                timestamp = timestamp - 1000;
                if(timestamp == 0) {
                	$("#InvestDetailPageModule .waiting_time").remove()
                	$("#InvestDetailPageModule").append('<a class="ui_btn_blue to_invest tap" href="javascript:void(0);" data-action="invest">立即投资</a>');
                    clearInterval(down);
                }
            }, 1000);		
	},

    //投资标的详情数据
	fetch : function(){
	    var t =this;
		var options = {
			url: J.Api.investDetail,
			data: {
				id: _id
			},
			scopt: t,
            // type: 'GET',
			callback: function(data) {
				t.el.html($(tpl({ moduleData : data })))
                t.events();
                investModule = data;
			    if($('.waiting_time').size()) {
			    	t.reduceTime();
			    }
			}
		};
		J.Utils.sendAjax(options);
	},


    listenFun: function(){
        var t = this;
        Transceiver.listen('userInfo','investDetail.init',function(data){
        	if(!!location.hash.match(/^#investDetail/i)){
	            investModule.user = {};
	            investModule.user = JSON.parse(data);
	            if(investModule.isLogin == false) {
	                require('h5:base/base64');
	            }
	        }
        });
    },

	events : function(){
	    var t = this;
        GlobalTap.register('investDetail_page_module', {
            action: 'invest',
            fn: function(e, o) {
	            var user = investModule.user;
	            if(user.isLogin == false) {
				 	J.Common.alert({
						content: '您还没有登录',
						onSureCallback: function(){
							Router.navigate('login/url=' + new Base64().encode(location.href));
						},
						okValue: '去登录'
					})
	            } else if(!user.isAccount) {
				 	J.Common.alert({
						content: '您还没有开通第三方支付托管账户',
						onSureCallback: function(){
							Router.navigate('account/trusteeship');
						},
						okValue: '去开通'
					})
	            } else if(!user.isAgreement) {
				 	J.Common.alert({
						content: '您还没有签订快速投资协议',
						onSureCallback: function(){
							Router.navigate('account/protocol');
						},
						okValue: '去签订'
					})
	            } else {
					Router.navigate('pay/id=' + _id);
	            }
            }
        });
    }
};

InvestDetailController.prototype.constructor = InvestDetailController;

module.exports = InvestDetailController;