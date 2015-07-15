var loginTpl = '<div class="login_page_module">' +
		// '<div class="ui_error_wrapper"><p class="ui_error"></p></div>' +
		'<p class="ui_error"></p>' +
		'<div class="item">' +
			'<input class="login_input" id="userName" type="text" placeholder="手机号" data-check="checkMobile">' +
		'</div>' +
		'<div class="item">' +
			'<input class="login_input" id="password" type="password" placeholder="密码" data-check="checkPassword">' +
			'<a href="javascript:void(0);" class="show_pass tap"  data-action="showPass"></a>' +
		'</div>' +
		'<a href="javascript:void(0);" class="ui_btn ui_btn_blue tap" id="loginBtn" data-action="login">登录</a>' +
		'<div class=actions><a class="reg" href="#register">免费注册</a><a class="forget_pass tap" href="javascript:void(0);" data-action="forgetPass">忘记密码</a></div>'
	'</div>';
module.exports = loginTpl;

