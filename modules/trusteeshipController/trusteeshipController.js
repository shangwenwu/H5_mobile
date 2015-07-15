var agreement1 = require('h5:agreement/trusteeship');

Router.addRules({
    'trusteeship' : function () {
        J.Controllers['trusteeship'] ? J.Controllers['trusteeship'].render() : J.Controllers['trusteeship'] = new TrusteeshipController();
    }
});

var TrusteeshipController = function(){
	var t = this;

	t.el = $('<div id="trusteeshipModule" class="trusteeship_module">'+
				'<div class="box1">'+
					'<p class="ui_error"></p>'+
					'<div class="g_box"><input class="g_flex1" id="userName" type="text" placeholder="真实姓名" /></div>'+
					'<div class="g_mt10 g_box"><input class="g_flex1" id="card" type="text" placeholder="身份证号" /></div>'+
					'<div class="g_mt10 g_f14 "><span class="c6"> 开通即视为同意</span><a  class="link tap" data-action="agreement1">资金托管协议</a></div>'+
					'<a class="ui_btn ui_btn_blue g_mt40 tap" data-action="trusteeship" id="trusteeship">开通托管</a>'+
				'</div>'+
				'<div class="box2 g_hide" id="box2">'+
				'</div>'+
			'</div>');
    t.init();
};
TrusteeshipController.prototype = {
	init: function(){
		var t = this;
		$('#mainBody').html(t.el);
		t.findEl();
		J.Common.renderTitle({
		    id: 'mainHeader',
		    text: '开通托管'
		});
		t.events();
	},
	// Router.navigate(-1);
	render: function(){
		var t = this;
		t.init();
	},
	findEl:function(){
		var t = this;
		t.err = t.el.find('.ui_error');
		t.userName = t.el.find('#userName');
		t.card = t.el.find('#card');
		t.trusteeship = t.el.find('#trusteeship');
	},
	events : function(){
	    var t = this;
	   
	    GlobalTap.register('trusteeship_module',{
            action: 'agreement1',
            fn: function (e,o) {
            		var w = document.body.clientWidth-70 + 'px';
            		var dialog = J.Common.dialog({
				 		content: agreement1,
				 		width: w,
				 		title:'资金托管协议'
            		});
            		dialog.showModal();
            }
        },{
            action: 'trusteeship',
            fn: function (e,o) {

                var userNameVal = t.userName.val(),
                    cardVal      = t.card.val(),
                    callbackFun=function(info){
	                	t.err.text(J.Utils.errorMsg[info]).css('visibility', 'visible');
	                };



                   //alert(userName+' '+password+' '+captcha);
                if(J.Common.regExpFun('checkName',{val:userNameVal,callbackFun:callbackFun}) && 
                	J.Common.regExpFun('checkIdNumber',{val:cardVal,callbackFun:callbackFun})
                ){
	                	t.err.text('').css('visibility', 'hidden');
	    				//开通资金托管接口
			    		var params = {
							url: J.Api.bindTrusteeship,
							data: {
								userName:userNameVal,
		   						idNumber:cardVal
							},
							callback: function(data) {
								if(data.result){

									J.Common.succeed({
										id:'box2',
										title:'开通托管成功，交易密码将发至您的手机',
										description:'托管账户需要绑定一张银行卡进行充值和提现。为使您的投资更加方便快捷，请前往绑定银行卡。',
										butOption:[
											{
												text:'立即绑定',
												event:function(){
													Router.navigate('account');
												}
											},{
												text:'稍候再说',
												event:function(){
													 Router.navigate('login');
												}
											}
										]
									});

									t.el.find('.box2').show().siblings('.box1').hide();
								}else{
									t.err.text('开通没有成功，请重新开通！').css('visibility', 'visible');
								}
							}
						}
						J.Utils.sendAjax(params);

    			}	

            }
        });



		



	}

};

TrusteeshipController.prototype.constructor = TrusteeshipController;
module.exports = TrusteeshipController;