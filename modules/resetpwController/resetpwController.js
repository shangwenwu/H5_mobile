//var agreement = require('pc:agreement/regist');

Router.addRules({
    'resetpw' : function () {
        J.Controllers['resetpw'] ? J.Controllers['resetpw'].render() : J.Controllers['resetpw'] = new ResetpwController();
    },
    'resetpw/mobile=:num' : function (type, num) {
        J.Controllers['resetpw'] ? J.Controllers['resetpw'].render(num) : J.Controllers['resetpw'] = new ResetpwController(num);
    }
});

var ResetpwController = function(num){
	var t = this;
	t.num = num || '';
	t.html = '<div id="resetpwModule" class="resetpw_module">'+
				'<div class="box1">'+
					'<div class="g_darkgray g_mt20 g_f14">请输入注册的手机号用于找回密码。<span id="QAImg"></span></div>'+
					'<div class="g_box g_mt10"><input class="g_flex1" id="mobile" type="text" placeholder="手机号" /></div>'+
					'<p class="ui_error" id="ui_error1"></p>'+
					'<a class="ui_btn ui_btn_blue g_mt10 tap" data-action="nextStep" id="nextStep">下一步</a>'+
				'</div>'+
				'<div class="box2 g_hide">'+
					'<div class="g_darkgray g_tac g_mt30 g_f14">短信验证码已发送至<span id="mobileNum"></span><span id="QAImg"></span></div>'+
					'<div class="g_mt30 g_box g_boxH"><input type="text" id="captcha" placeholder="验证码" class="g_flex1" /><button class="ui_btn ui_btn_white tap" id="sms" data-action="sms"><span></span>获取验证码</button></div>'+
					'<div class="g_mt10 g_box"><input class="g_flex1" id="card" type="text" placeholder="身份证号码" /></div>'+
					'<div class="g_mt10  g_box" id="verify"><input  class="g_flex1" type="password" id="password" placeholder="密码" /><a id="eye" class="closeEye"></a></div>'+
					'<p class="ui_error" id="ui_error2"></p>'+
					'<a class="ui_btn ui_btn_blue g_mt40 tap" data-action="resetpw" id="resetpw">确定</a>'+
					'<div class="g_tar g_mt10 g_f14 "><a class="link tap" data-action="link">收不到验证码</a></div>'+
				'</div>'+
				'<div class="box3 g_hide" id="box3">'+
				'</div>'+
			'</div>';
	t.el = $(t.html);
	
    t.init();
   
};
ResetpwController.prototype = {
	init: function(){
		var t = this;
		t.el.find("#mobile").val(t.num);
		$('#mainBody').html(t.el);
		t.findEl();
		J.Common.renderTitle({
		    id: 'mainHeader',
		    text: '重置密码'
		});
		t.events();
	},
	// Router.navigate(-1);
	render: function(num){
		var t = this;
		t.num = num || '';
		t.el = $(t.html);
		t.init();
	},
	findEl:function(){
		var t = this;
		t.err1 = t.el.find('#ui_error1');
		t.err2 = t.el.find('#ui_error2');
		t.mobile = t.el.find('#mobile');
		t.captcha = t.el.find('#captcha');
		t.password = t.el.find('#password');

		t.sms = t.el.find('#sms');
		t.eye = t.el.find('#eye');

		t.card = t.el.find("#card");
		t.login = t.el.find('#login');
		console.log(location.hash);
	},
	events : function(){
	    var t = this;
	    
	    GlobalTap.register('resetpw_module',{
            action: 'link',
            fn: function (e,o) {
            		var mobileReg = J.Common.regExpFun('checkMobile',{
							val:t.mobile.val(),
							callbackFun:function(info){
	                				//t.err2.text(J.Utils.errorMsg[info]).css('visibility', 'visible');
	                		}
	                })
            		if(mobileReg){
            			//t.err2.text('').css('visibility', 'hidden');

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
            }
        },{
            action: 'resetpw',
            fn: function (e,o) {

                var mobileVal = t.mobile.val(),
                	passwordVal = t.password.val(),
                	captchaVal = t.captcha.val(),
                	cardVal = t.card.val(),
                    callbackFun=function(info,isShow){
	                	t.err2.text(J.Utils.errorMsg[info]).css('visibility', isShow);
	                },
	                captchaCallbackFunBefore = function(callback){
	                	var result;
	                	var text;
	                	$.ajax({
	                		url: J.Api.sms_voice_verify,
	                		data: {"verify":captchaVal},
	                		dataType: 'JSON',
	                		async: false,
	                		success: function(responseObj) {
	                			responseObj = JSON.parse(responseObj);
								if (responseObj.data.result) {
									result = true,text = null;
								} else {
									result = false,text = 'SMSCAPTCHA_INVALID';
								}
	                		}
	                	});
	                	var getResult = callback(result, text);
	                	return getResult;
	                },
	                cardCallbackFunBefore = function(callback){
	                	var result;
	                	var text;
	                	$.ajax({
	                		url: J.Api.checkIdNum,
	                		data: {"mobile":mobileVal,"idNum":cardVal},
	                		dataType: 'JSON',
	                		async: false,
	                		success: function(responseObj) {
	                			responseObj = JSON.parse(responseObj);
								if (responseObj.data.result) {
									result = true,text = null;
								} else {
									result = false,text = 'IDNUMBER_INVALID';
								}
	                		}
	                	});
	                	var getResult = callback(result, text);
	                	return getResult;
	                };
                
                if(J.Common.regExpFun('checkSmsCaptcha',{val:captchaVal,callbackFun:callbackFun,callbackFunBefore:captchaCallbackFunBefore}) && 
                   (t.card.parent().is(":visible") ? J.Common.regExpFun('checkIdNumber',{val:cardVal,callbackFun:callbackFun,callbackFunBefore:cardCallbackFunBefore}) : true) && 
                   J.Common.regExpFun('checkPassword',{val:passwordVal,callbackFun:callbackFun}) ){
	                	//t.err2.text('').css('visibility', 'hidden');
	                	$.post(J.Api.find_password,{"mobile":mobileVal,"password":passwordVal},function(data){
		    				if(data.data.result){

		    					J.Common.succeed({
									id:'box3',
									title:'恭喜您，重置密码成功！',
									butOption:[
										{
											text:'立即登录',
											event:function(){
												Router.navigate('login');
											}
										}
									]
								});

		    					$('.box1').hide();$('.box2').hide();$('.box3').show();
		    				}else{
					            t.err2.text('没有找回密码，请重新找回！').css('visibility', 'visible');
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
			    				t.err1.text('').css('visibility', 'hidden');
			    				$.post(J.Api.sms_voice_code,{'mobile':mobile,'captchaType':'SMS'},function(data){
						       		console.log(data.status);
							    });
						    	J.Common.timingFun(t,t.sms);
			    		}else{
			    			t.err1.text(J.Utils.errorMsg[info]).css('visibility', 'visible');
			    		}
			    	});

	        }
		},{
            action: 'nextStep',
            fn: function (e,o) {

	            	var mobile = t.mobile.val();
			    	J.Utils.validator.checkMobile(mobile,function(result,info){
			    		if(result){

			    			$.post(J.Api.verify_user,{'mobile':mobile},function(data){
			    				console.log(data);
				    			if(data.data.result){
				    				t.err1.text('').css('visibility', 'hidden');
				    				if(!data.data.haveIdNum){
				    					t.card.parent().hide();
				    				}
							    	$.post(J.Api.sms_voice_code,{'mobile':mobile,'captchaType':'SMS'},function(data){
							       		console.log(data.status);
								    });
								    J.Common.timingFun(t,t.sms);
								    $('#mobileNum').text(mobile);
								    $('.box1').hide();$('.box3').hide();$('.box2').show();
							    }else{
							    	t.err1.text('没有该用户！').css('visibility', 'visible');
							    }
						    });

			    		}else{
			    			t.err1.text(J.Utils.errorMsg[info]).css('visibility', 'visible');
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

ResetpwController.prototype.constructor = ResetpwController;
module.exports = ResetpwController;