var agreement = require('h5:agreement/changeBankCard');
var bankCardTpl = __inline('./bankCardController.tmpl');

Router.addRules({
    //银行卡
    'account/bankCard' : function () {
        J.Controllers['bankCard'] ? J.Controllers['bankCard'].render() : J.Controllers['bankCard'] = new BankCardController();
    }
});
var BankCardController = function(){
	var t = this;
    t.el = $('<div id="bankCardModule" class="bank_card_module"></div>');
    t.render();
    t.listenFun();
    t.events();
};

BankCardController.prototype = {
	render: function(){
		var t = this;
		J.Common.renderTitle({
            id: 'mainHeader',
            text: '银行卡'
        });
        $('#mainBody').html(t.el);
	},
    listenFun: function(){
		var t = this;
		Transceiver.listen('userInfo','bankCardModule.init',function(data){
			var user = JSON.parse(data);
			if(!!location.hash.match(/bankCard/i)){
                t.el.html(bankCardTpl(user));
				if(user.isBindCard){
					t.fetch();
				}
			}
		});
    },
	events: function(){
        var t = this;
        t.data = {};
        GlobalTap.register('bank_card_module',{
            action: 'bankCardNa',
            fn: function (e,o) {
                t.el.find('.bank_item').removeClass('hide').addClass('show');
            }
        },{
            action: 'changeBank',
            fn: function (e,o) {
                t.data.bankCode = o.target.data('bank');
                t.el.find('#bankCardNa').text(J.Utils.bankName[t.data.bankCode]);
                t.el.find('.bank_item').removeClass('show').addClass('hide');
            }
        },{
            action: 'toBindCard',
            fn: function (e,o) {
                
                t.data.bankCardNo = t.el.find('#cardInput').val();
	        	if(!+(t.data.bankCardNo)){
	                J.Common.alert({
	                    content: '请输入正确储蓄卡！'
	                });
	                return false;
	        	}
				J.Utils.sendAjax({
					url:J.Api.bankCardInfo,
					type:'post',
					data: t.data,
					callback:function(data){
						// 绑定过银行卡
						if (data.last4BankCardNo) {
							J.Common.alert({
								content: '该银行卡已绑定过！'
							});
						} else {
							J.Utils.sendAjax({
								url:J.Api.bindBankCard,
								type:'get',
								data: t.data,
								callback:function(data){
									t.submitForm(data);
								}
							});
						}
					}
				});

            }
        },{
            action: 'changeCardHint',
            fn: function (e,o) {
                var w = document.body.clientWidth-70 + 'px';
                var dialog = J.Common.dialog({
                    content: agreement,
                    width: w,
                    title:'银行卡更换说明'
                });
                dialog.showModal();
            }
        },{
            action: 'openQuick',
            fn: function (e,o) {

            }
        },{
            action: 'changeCard',
            fn: function (e,o) {
                
                
            }
        });
	},
	submitForm: function(data){
        var t = this;
		J.Utils.submitForm({
			url:data.url,
			method:'post',
			param:data.param,
			onSubmit:function(){
				J.Common.confirm({
					content: '银行卡是否绑定成功！',
					okValue: '绑定成功',
					cancelValue: '绑定失败',
					onSureCallback: function(){
						t.confirmState();
					}
				});
			}
		});
	},
	confirmState: function(){
        var t = this;
        J.Utils.sendAjax({
			url:J.Api.bankCardInfo,
			type:'post',
			data: t.data,
			callback:function(data){
				if(data.last4BankCardNo){
					//跳转成功
					J.Common.succeed({
                        id:'bankCardModule',
						title:'您的银行卡绑定成功',
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
					J.DEBUG && console.log('绑定银行卡接口失败！');
				}
			}
		});
	},
	fetch: function(){
        var t = this;
        J.Utils.sendAjax({
        	url:J.Api.bankCardInfo,
        	type:'get',
        	callback:function(data){
        	    t.el.find('#cardImg').attr('class','card_img').addClass(data.bankCode);
                t.el.find('#cardNu').html(data.last4BankCardNo);
        	}
        });
	}
};

BankCardController.prototype.constructor = BankCardController;
module.exports = BankCardController;