(function(w){

	var uiTitle = require('h5:ui-title');
	var uiLoading = require('h5:ui-loading');
	var uiBottomLoading = require('h5:ui-bottom-loading');
	var uiDialog = require('h5:ui-dialog');
	var uiTip = require('h5:ui-tip');

	var uiSucceed = require('h5:succeed');

	var Common = {
		regExpFun:function(checkName,obj){
			var data = {};
				if(typeof obj == 'object' && obj != null){
						data.callbackFun       = obj.callbackFun,
						data.callbackFunBefore = obj.callbackFunBefore;
						var obj = obj.val;
				}
			var result = J.Utils.validator[checkName](obj,data);
			return result;
		},
		timingFun: function(currentObj, butEle) {
			var t = currentObj;
			var num = 59;
			if (arguments[2] == 'clear') {
				butEle.find('span').html('');
				clearInterval(t.timing);
				butEle.addClass("tap");
				butEle.css({
					"background": '#fff'
				});
			} else {
				butEle.css({
					"background": '#c2c2c2'
				});
				butEle.removeClass('tap');
				t.timing = setInterval(function() {
					butEle.find('span').html('(' + num + ')');

					if (num < 1) {
						butEle.find('span').html('');
						clearInterval(t.timing);
						butEle.css({
							"background": '#fff'
						});
						butEle.addClass("tap");
					}
					num--;
				}, 1000);
			}
		},

		
		bindscroll: function (params) {
			$(window).scroll(function(){
	          	if(document.body.scrollTop >= $(document).height()-$(window).height()){
	          		params.callback && params.callback.call(params.scope, '');
	          	}
	        });
		},

		/**
		 * 渲染title
		 * @param config 配置
		 *  {
		 *  @param {string} id 嵌入的container的id，可以是'#mainHeader'或者'mainHeader'
		 *  @param {string} text 文本内容
		 *  @param {Function} onReturn 点击返回时候的回调函数
		 *  @param {boolean} isHideReturn 是否隐藏返回按钮
		 *  }
		 * @example
		 J.common.renderTitle({
            id: 'mainHeader',
            text: '首页',
            onReturn: function() {
                alert('ok...');
            },
            isHideReturn: false
        });
		 */
		renderTitle: function(config) {
			return uiTitle.render(config);
		},

		succeed: function(config) {
			return uiSucceed.init(config);
		},

		/**
		 * 滚动到底部后，加载数据时显示loading
		 * @param config
		 * {
		 *   @param {string} id 嵌入的container的id，可以是'#mainHeader'或者'mainHeader'
		 *   @param {string} text 文本提示内容
		 * }
		 */
		renderLoading: function(config) {
			return uiLoading.show(config);
		},

		/**
		 * 显示loading条
		 * @param config
		 * {
		 *   @param {string} id 嵌入的container的id，可以是'#mainHeader'或者'mainHeader'
		 * }
		 */
		renderBottomLoading: function(config) {
			return uiBottomLoading.render(config);
		},

        //存储计时器
		intervalArray: [],

        //倒计时
		getCountDownTime: function(time, serverDate, dom, one) {
			time = parseInt(time, 10);
			if (!time || time === null) {
				return;
			}

			var checkTime = function(i) {
				if (i < 10) {
					i = "0" + i;
				}
				return i;
			};

			var leftTime = time - serverDate,
				timeout = dom + 1;

			if (leftTime < 0) {
				return;
			}

			var dd = Math.floor(leftTime / 1000 / 60 / 60 / 24);
			leftTime -= dd * 1000 * 60 * 60 * 24;
			var hh = Math.floor(leftTime / 1000 / 60 / 60);
			leftTime -= hh * 1000 * 60 * 60;
			var mm = Math.floor(leftTime / 1000 / 60);
			leftTime -= mm * 1000 * 60;
			var ss = Math.floor(leftTime / 1000);
			leftTime -= ss * 1000;
			hh = checkTime(hh);
			mm = checkTime(mm);
			ss = checkTime(ss);

			var timeStr = dd ? (dd + '日' + hh + '时' + mm + '分' + ss + '秒') : (hh + '时' + mm + '分' + ss + '秒');
			$("#" + dom).html('开抢倒计时 '+timeStr);

			if (one) {
				return timeStr;
			}
		},

		dialog: function(options) {
			var o = J.Common.agreementHeight(options);
			return uiDialog(o);
		},

		
		agreementHeight:function(options){
			var html = $(options.content)[0];
			if(html.getAttribute('class') == 'g_agreement'){
				html.style.height = window.screen.availHeight-125 + 'px';
				options.content = html;
			}
			return options;
		},

		/**
		 * alert对话框
		 * @param {Object} option 配置
		 * 配置参数说明——
		 *	@param {string} content 提示内容
		 *
		 * @example
		 * 	J.Common.alert({
		 *		content: '我是内容',
		 *		onSureCallback: function(){},
		 *		okValue: '支付成功'
		 *	})
		 */
		alert: function(config) {
			if (!config.content) {
				throw new Error('The content of alertDialog is must !');
			}
			if (config.onSureCallback && typeof config.onSureCallback !== 'function') {
				throw new Error('The onSureCallback of alertDialog is must be a function !');
			}
			var params = {
				id: 'Alert',
				fixed: true,
				width: '231px',
				padding: '35px 30px',
				content: config.content,
				okValue: config.okValue || '确定',
				ok: function() {
					if (typeof config.onSureCallback === 'function') {
						config.onSureCallback.call(this);
					}
				}
			};
			if (config.hideClose === true) {
				params.cancel = false;
			}
			var alertDialog = uiDialog(params);
			alertDialog.showModal();
		},
		/**
		 * 确认对话框
		 * @param {Object} option 配置
		 * 配置参数说明——
		 *	@param {string} content 提示内容
		 *
		 * @example
		 * 	J.Common.confirm({
		 *		content: '我是气泡的内容',
		 *		onSureCallback: function(){},
		 *		onCancelCallback: function(){}
		 *		okValue: '支付成功',
		 *		cancelValue: '支付失败'
		 *	})
		 */
		confirm: function(config) {
			if (!config.content) {
				throw new Error('The content of confirmDialog is must !');
			}
			if (config.onSureCallback && typeof config.onSureCallback !== 'function') {
				throw new Error('The onSureCallback of confirmDialog is must be a function !');
			}
			if (config.onCancelCallback && typeof config.onCancelCallback !== 'function') {
				throw new Error('The onCancelCallback of confirmDialog is must be a function !');
			}
			var params = {
				id: 'Confirm',
				fixed: true,
				width: '231px',
				padding: '35px 30px',
				content: config.content,
				okValue: config.okValue || '确定',
				ok: function() {
					if (typeof config.onSureCallback === 'function') {
						config.onSureCallback.call(this);
					}
				}
			};
			if (config.onCancelCallback) {
				params.cancel = config.onCancelCallback;
			} else {
				params.cancel = true;
			}
			var confirmDialog = uiDialog(params);
			confirmDialog.showModal();
		},
		confirmStrongly: function(config) {
			if (!config.content) {
				throw new Error('The content of confirmDialog is must !');
			}
			if (config.onSureCallback && typeof config.onSureCallback !== 'function') {
				throw new Error('The onSureCallback of confirmDialog is must be a function !');
			}
			if (config.onCancelCallback && typeof config.onCancelCallback !== 'function') {
				throw new Error('The onCancelCallback of confirmDialog is must be a function !');
			}
			var params = {
				id: 'ConfirmStrongly',
				fixed: true,
				title: ' ',
				width: '231px',
				padding: '10px 30px 35px 30px;',
				content: config.content,
				okValue: config.okValue || '确定',
				ok: function() {
					if (typeof config.onSureCallback === 'function') {
						config.onSureCallback.call(this);
					}
				}
			};
			if (config.onCancelCallback) {
				params.cancel = config.onCancelCallback || true;
				params.cancelDisplay = false;
			}
			var confirmDialog = uiDialog(params);
			confirmDialog.showModal();
		},

		/**
		 * 提示
		 * @param config
		 * {
		 *  @param {string} type 提示类型，这个参数是可选参数。如果没有这个值，那么显示普通提示框
		 *                      "success" 成功类型；"fail"失败类型。
		 *  @param {string} content 提示文本
		 *  @param {Function} onShow 当页面显示的时候，执行的方法
		 *  @autoHide {boolean|number} 默认3秒钟关闭，如果输入的是毫秒数，那么按照指定数字时间关闭。
		 *  				如果是true，3秒钟后关闭；如果是false,则不会关闭
		 *  @onHide {Function} 当tip关闭的时候执行的方法
		 * }
		 */
		tip: function(config) {
			return uiTip.show(config);
		},

		/**
		 * 判断是否开通的一些逻辑
		 * @param config
		 * {
		 * @param {obj} userInfo 用户基本信息
		 * @param {string} hash  如果都开通需要跳转的页面hashname
		 * }
		 */
		isOpen: function(config){
	        var t = this,
	        userInfo = config.userInfo || {}, 
	        hash = config.hash|| 'home';

	        if(!userInfo.isAccount){
	    		t.alert({
			 		content: '您还没有开通托管！',
			 		onSureCallback: function(){
			 			Router.navigate('trusteeship');
			 		},
			  		okValue: '去开通'
			 	});
	    	}else if(!userInfo.leftMoney){
	    		if(!userInfo.isBindCard){
	    			t.alert({
				 		content: '您还没有绑定银行卡！',
				 		onSureCallback: function(){
				 			Router.navigate('account/bankCard');
				 		},
				  		okValue: '去绑定'
				 	});
	    		}
	    	}else if(!userInfo.isAgreement || !userInfo.isRechargeAgreement){
	    		var agrType = !userInfo.isAgreement  && !userInfo.isRechargeAgreement ? 1 : !userInfo.isAgreement ? 2 : 3;
	            var agrText = {
	                1:'无密双协议',
	                2:'无密投资协议',
	                3:'无密充值协议'
	            };
	    		t.alert({
			 		content: '您还没有开通'+agrText[agrType] +'！',
			 		onSureCallback: function(){

			 			 //无密双协议
			 		},
			  		okValue: '去开通'
			 	});
	    	}else{
	    		Router.navigate(hash);
	    	}
		}
	};

	w.J.Common = Common;

})(window);