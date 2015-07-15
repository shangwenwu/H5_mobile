/*
 * @file 我的账户
 * @author jinguangguo
 * @date 2015/7/8
 */

Router.addRules({
	'account': function() {
		J.Controllers['account'] ? J.Controllers['account'].render() : J.Controllers['account'] = new AccountController();
	}
});

var tplFn = __inline('./accountController.tmpl');

var topImg = __inline('./img/top-bg.jpg');
require('h5:base/base64');

var AccountController = function() {
	var t = this;
	t.el = $('<article class="module_account"></article>');
	t.listenFun();
	t.events();
	t.render();
};

AccountController.prototype = {
	listenFun: function() {
		var t = this;
		Transceiver.listen('userInfo', 'accountModule.init', function(data) {
			if(!!location.hash.match(/^#account$/i)){
				t.userInfo = JSON.parse(data);
				t.fetch();
			}
		});
	},
	render: function() {
		var t = this;
		J.Common.renderTitle({
			id: 'mainHeader',
			text: '我的账户'
		});
		$('#mainBody').html(t.el);
		
	},
	fetch: function() {
		var t = this;
		J.Utils.sendAjax({
			url: J.Api.getInvestEarnings,
			type: 'GET',
			callback: function(result) {
				t.el.html(tplFn({
					agreement: t.userInfo.isRechargeAgreement || false,
					topImg: topImg || '',
					username: result.username || '',
					totalEarnings: result.totalEarnings || 0,
					availableBalance: result.availableBalance || 0,
					dueinInterest: result.dueinInterest || 0,
					totalAmount: result.totalAmount || 0
				}));
			}
		});
	},
	events: function() {
		var t = this;
		GlobalTap.register('module_account', {
			action: 'recharge',
			fn: function(e, o) {
				J.Common.isOpen({
	    			userInfo: t.userInfo,
	    			hash: 'account/recharge'
	    		});
			}
		}, {
			action: 'withdraw',
			fn: function(e, o) {
				J.Common.isOpen({
	    			userInfo: t.userInfo,
	    			hash: 'account/withdraw'
	    		});
			}
		}, {
			action: 'protocol',
			fn: function(e, o) {
				//无密充值协议
			}
		}, {
			action: 'bankCard',
			fn: function(e, o) {
				 if(!t.userInfo.isAccount){
		    		J.Common.alert({
				 		content: '您还没有开通托管！',
				 		onSureCallback: function(){
				 			Router.navigate('trusteeship');
				 		},
				  		okValue: '去开通'
				 	});
		    	} else {
					Router.navigate('account/bankCard');
				}
			}
		}, {
			action: 'logout',
			fn: function(e, o) {
				var options = {
					url: J.Api.logout,
					notLoginCallback: function() {
						location.href = location.origin + location.pathname;
					}
				};
				J.Utils.sendAjax(options);
			}
		});
	}
};

AccountController.prototype.constructor = AccountController;
module.exports = AccountController;