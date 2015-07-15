Router.addRules({
    'account/withdraw' : function () {
        J.Controllers['withdraw'] ? J.Controllers['withdraw'].render() : J.Controllers['withdraw'] = new WithdrawController();
    }
});
var tplFn = __inline('./withdrawController.tmpl');

var WithdrawController = function(){
	var t = this;
	t.el = $('<div id="withdrawModule" class="withdraw_module">'+
		        
			'</div>');

    t.render();
    t.events();
};

WithdrawController.prototype = {
	render: function(){
		var t = this;
		var t = this;
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '提&nbsp;&nbsp;&nbsp;&nbsp;现'
        });
        $('#mainBody').html(t.el);
        t.fetchBankInfo();

	},
    fetchBankInfo: function() {
        var t = this;
        J.Utils.sendAjax({
            url: J.Api.bankCardInfo,
            type: 'GET',
            callback: function(result) {
                t.amount = result.availableWithdrawAmount;
                t.el.html(tplFn({
                	"amount": J.Utils.formatAmount(result.availableWithdrawAmount,2),
                    "last4BankCardNo": result.last4BankCardNo,
                    "bankCode": result.bankCode,
                    "bankName": J.Utils.bankName[result.bankCode]
                }));
            }
        });
    },
	events: function(){
        var t = this;
        t.cash = '';
        GlobalTap.register('withdraw_module',{
		    action: 'hint',
		    fn: function (e,o) {
		    	
		    }
		},{
		    action: 'withdrawValue',
		    fn: function (e,o) {
		    	t.el.find('#tipError').empty().css({
                    visibility: 'hidden'
                });
		    }
		},{
		    action: 'toRecharge',
		    fn: function (e,o) {
                var $tip = t.el.find('#tipError');
                var showTip = function(text) {
                    $tip.text(text).css({
                        visibility: 'visible'
                    });
                };
                var hideTip = function() {
                    $tip.empty().css({
                        visibility: 'hidden'
                    });
                };
		    	var v = t.el.find('#withdrawValue').val();

	        	if (v === '') {
					showTip('请输入提现金额');
					return;
				} else if (!parseFloat(v)) {
					showTip('请输入正确提现金额');
					return;
				} else if (parseFloat(v) > t.amount) {
					showTip('您的可用余额不足');
					return;
				} else if (t.amount < 100 && parseFloat(v) != t.amount) {
					showTip('不足100元时请全部提现');
					return;
				} else {
					hideTip();
					t.cash = v;
				}

		    	J.Utils.sendAjax({
	        	    url:J.Api.withdraw,
		        	type:'get',
		        	data: {amount: v},
		        	callback:function(data){
		        		t.submitForm(data);
		        	}
		        });
		    }

		});
	},
	submitForm: function(data){
        var t = this;
		var orderId = data.orderId;
		J.Utils.submitForm({
			url:data.url,
			method:'post',
			param:data.param,
			onSubmit:function(){
				J.Common.confirm({
					content: '提现金额是否成功！',
					okValue: '提现成功',
					cancelValue: '提现失败',
					onSureCallback: function(){
                        t.confirmState(orderId);
					}
				});
			}
		});
	},
	confirmState: function(orderId){
        var t = this;
        J.Utils.sendAjax({
    	    url:J.Api.getWithdraw,
        	type:'post',
        	data: {orderId:orderId},
        	callback:function(data){ 
        		if(data.result){
					//跳转成功
					J.Common.succeed({
                        id:'bankCardModule',
						title:'您的提现成功',
						// description:'描述',
						butOption:[
							{
								text:'知道了',
								event:function(){
									Router.navigate('account');
								}
							}
						]
					});
        		}else{
        			J.DEBUG && console.log('提现接口失败！');
        		}
        	}
        });  

	}

};

WithdrawController.prototype.constructor = WithdrawController;
module.exports = WithdrawController;