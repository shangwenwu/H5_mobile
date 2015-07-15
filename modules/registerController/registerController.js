var agreement = require('h5:agreement/regist');

Router.addRules({
    'register' : function () {
        J.Controllers['register'] ? J.Controllers['register'].render() : J.Controllers['register'] = new RegisterController();
    }
});

var RegisterController = function(){
	var t = this;

	t.el = $('<div id="registerModule" class="register_module">'+
				'<div class="box1">'+
					'<p class="ui_error"></p>'+
					'<div class="g_box"><input class="g_flex1" id="mobile" type="text" placeholder="手机号" /></div>'+
					'<div class="g_mt10 g_box g_boxH"><input type="text" id="captcha" placeholder="验证码" class="g_flex1" /><button class="ui_btn ui_btn_white tap" id="sms" data-action="sms"><span></span>获取验证码</button></div>'+
					'<div class="g_mt10  g_box" id="verify"><input  class="g_flex1" type="password" id="password" placeholder="密码" /><a id="eye" class="closeEye"></a></div>'+
					'<div class="g_mt10 g_f14 "><span class="c6"> 注册即视为同意九信金融</span><a  class="link tap" data-action="agreement" id="agreement">注册服务协议</a></div>'+
					'<a class="ui_btn ui_btn_blue g_mt40 tap" data-action="register" id="register">注册</a>'+
					'<a href="#login" class="ui_btn ui_btn_white g_mt10" id="login">已有账户？去登录</a>'+
					'<div class="g_tar g_mt10 g_f14 "><a class="link tap" data-action="link">收不到验证码</a></div>'+
				'</div>'+
				'<div class="box2 g_hide" id="box2">'+
					'<!--div class="g_mt40 g_darkgray g_f14">在您进行投资前，需要开通第三方资金托管账户，以保证您的资金安全。<span id="QAImg"></span></div-->'+
				'</div>'+
			'</div>');
    t.init();
};
RegisterController.prototype = {
	init: function(){
		var t = this;
		$('#mainBody').html(t.el);
		t.findEl();
		J.Common.renderTitle({
		    id: 'mainHeader',
		    text: '注 册'
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
		t.mobile = t.el.find('#mobile');
		t.captcha = t.el.find('#captcha');
		t.password = t.el.find('#password');

		t.sms = t.el.find('#sms');
		t.eye = t.el.find('#eye');

		t.register = t.el.find('#register');
		t.login = t.el.find('#login');
	},
	events : function(){
	    var t = this;
	   
	    GlobalTap.register('register_module',{
            action: 'agreement',
            fn: function (e,o) {
            		var w = document.body.clientWidth-70 + 'px';
            		var dialog = J.Common.dialog({
				 		content: agreement,
				 		width: w,
				 		title:'注册服务协议'
            		});
            		dialog.showModal();
            }
        },{
            action: 'link',
            fn: function (e,o) {
            		var mobileReg = J.Common.regExpFun('checkMobile',{
							val:t.mobile.val(),
							callbackFun:function(info){
	                				t.err.text(J.Utils.errorMsg[info]).css('visibility', 'visible');
	                		}
	                })
            		if(mobileReg){
            			t.err.text('').css('visibility', 'hidden');
            			var params = {
							url: J.Api.sms_voice_code,
							data: {'mobile':t.mobile.val(),'captchaType':'VOICE'}
						}
						J.Utils.sendAjax(params);
	            		var w = document.body.clientWidth-70 + 'px';
	            		var con = "<div><div class='MobileIcon'></div><p class='g_blue g_f16'>客服正在拔打您的电话<br>请注意接听</p></div>";
	            		var dialog = J.Common.alert({
					 		content: con,
					 		width: w,
			 				okValue: '知道了'
	            		});
            		}
            		//dialog.showModal();
            }
        },{
            action: 'register',
            fn: function (e,o) {

                var mobileVal = t.mobile.val(),
                	passwordVal = t.password.val(),
                	captchaVal = t.captcha.val(),
                    callbackFun=function(info){
	                	t.err.text(J.Utils.errorMsg[info]).css('visibility', 'visible');
	                },
	                mobileCallbackBefore=function(callback){
					    var result;
	                	var text;
	                	$.ajax({
	                		url: J.Api.verify_user,
	                		data: {'mobile':mobileVal},
	                		dataType: 'JSON',
	                		async: false,
	                		success: function(responseObj) {
	                			responseObj = JSON.parse(responseObj);
								if (!responseObj.data.result) {
									result = true,text = null;
								} else {
									result = false,text = 'MOBILE_USED';
								}
	                		}
	                	});
	                	var getResult = callback(result, text);
	                	return getResult;
	                };



                   //alert(mobile+' '+password+' '+captcha);
                if(J.Common.regExpFun('checkMobile',{val:mobileVal,callbackFun:callbackFun,callbackFunBefore:mobileCallbackBefore}) && 
                	J.Common.regExpFun('checkPassword',{val:passwordVal,callbackFun:callbackFun}) && 
                	J.Common.regExpFun('checkSmsCaptcha',{val:captchaVal,callbackFun:callbackFun})){
	                	t.err.text('').css('visibility', 'hidden');
	    				$.post(J.Api.register,{"mobile":t.mobile.val(),"password":t.password.val(),'verify':t.captcha.val()},function(data){
							if(data.data.result){

								J.Common.succeed({
									id:'box2',
									title:'您的账号已注册成功',
									description:'在您进行投资前，需要开通第三方资金托管账户，以保证您的资金安全。',
									butOption:[
										{
											text:'去开通',
											event:function(){
												Router.navigate('trusteeship');
											}
										},{
											text:'稍候再说',
											event:function(){
												 Router.navigate('home');
											}
										}
									]
								});

								t.el.find('.box2').show().siblings('.box1').hide();
							}else{
								J.Utils.alert({
					                content: '您好：没有注册成功，请重新注册！',
					                onSureCallback:function(){
										t.render();
					                }
					            });
							}
			    		})
    			}	

            }
        },{
            action: 'sms',
            fn: function (e,o) {

	            	var mobile = t.mobile.val();
			    	J.Utils.validator.checkMobile(mobile,function(result,info){
			    		if(result){
			    				t.err.text('').css('visibility', 'hidden');
			    				$.post(J.Api.sms_voice_code,{'mobile':mobile,'captchaType':'SMS'},function(data){
						       		console.log(data.status);
							    });
						    	J.Common.timingFun(t,t.sms);
			    		}else{
			    			t.err.text(J.Utils.errorMsg[info]).css('visibility', 'visible');
			    		}
			    	});

	        }
		}
	);



		
	    t.el.delegate('#eye', 'click',function(e){
	    	e.preventDefault();
	    	if($(this).hasClass('openEye')) {
				$(this).removeClass('openEye').addClass('closeEye');
				$("#password").attr('type', 'password');
			} else {
				$(this).removeClass('closeEye').addClass('openEye');
				$("#password").attr('type', 'text');
			}
	    });


	}

};

RegisterController.prototype.constructor = RegisterController;
module.exports = RegisterController;