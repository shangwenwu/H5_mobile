var path = '/jxjr-web/'
var Api = {
	//获取资料类别列表
	login : path+'users/login',//登录
	logout: path+'logout', //退出
	getUserInfo: path+'users/getBasicUserInfo',//获取用户基本信息
	
	// about : './about.json',
	help : '/aaa/help',
	message: path+'message/allMsgs', //消息列表
	feedback : path+'feedback', //意见反馈


    //首页
	carousel : path+'cms/home/pic',//首页焦点图
	leftnews : path+'cms/bulletin', //首页公告
	rightnews : path+'cms/news',//首页媒体
	cmspage : path+'cms/getdetail',//新闻详情
	cmslist: path+'cms/news/list',//公告媒体列表
	investHomeData: path+'cms/loan/list', //首页投资列表


    //资金管理页面
    withdraw: path+'trade/prepareWithdraw', //提现
    getWithdraw: path+'trade/getWithdrawResult', //确认提现
    fundsRecord: path+'users/fundRecord', //资金记录
    fundsRecordType: path+'users/fundType', //资金记录类型下拉框
    fundsRecharge: path+'users/fundsRecharge', //充值记录
    fundsWithdraw: path+'users/fundsWithdraw', //提现记录
	prepareRecharge: path + 'trade/prepareRecharge',	// 准备充值
	getRechargeResult: path + 'trade/getRechargeResult',	// 获取充值结果

    //标的详情页
	investDetail : path+'loans/getLoanDetail', //标的详情
	refundPlan: path + 'loans/repaymentsPlan',//标的详情-还款计划
	investList: path+'loans/investList', //标的详情-投资者列表
	investData: path+'loans/getLoanWithPage',
	submitInvest: path + 'loans/buy',
	message: path+ '/message/allMsgs', //消息列表
	project: '/invest/status', //消息列表
	repayRecord: '/repayment/receiveList',

	listCoupon: path + 'coupon/listCoupon', //标的详情-优惠券
	submitInvest: path+'loans/buy', //标的详情-我要投资

	//标的列表页
	investData: path+'loans/getLoanWithPage',//标的列表

    //注册和找回密码页
	img_code: path+'users/imageCaptcha',//获取验证的图片
	img_verify: path+'users/check/imageCaptcha',//图片验证是否通过
	sms_voice_code: path+'users/smsCaptcha',//获取短信或语音验证码
	sms_voice_verify: path+'users/check/mobileCaptcha',//短信或语音验证是否通过
	register: path+'users/register',//注册
	checkIdNum: path+'users/checkIdNum',//校验身份证是否正确
	verify_user: path+'users/checkMobile',//是否注册及是否绑定身份证
	find_password: path+'users/updatePasswd',//找回密码
	investData: path+'loans/getLoanWithPage', //投资列表

	//账户总览
	getInvestEarnings : path+'users/fundInfo', //获取投资及收益信息
	getCurveInfo: path+'users/monthlystat', //获取曲线（待收收益、累计收益、待收本金、累计本金）信息

	//账户管理
	modifyPwd: path+'users/resetPasswd', //修改密码

	bindTrusteeship: path+'account/personRegister',//开通资金托管
	prepareBindBindAgreement: path+'account/prepareBindAgreement', //准备开通无密协议
    isBindAgreement:path+'users/isBindAgreement',//是否开通了无密协议888888888888888888888888888888888888
    removeAgreement:path+'account/prepareUnbindAgreement', //解除无密协议
	bankCardInfo: path+'account/getBankCard', //获取银行卡信息
    bindBankCard: path+'account/prepareBindCard', //绑定银行卡
   // getBindBankCard: path+'account/getBankCard', //确认绑定银行卡

    //投资管理
    project: path+'invest/status', //投资
	repayRecord: path+'repayment/receiveList',//收款记录
	underRepay: path + 'repayment/pending', //待收款列表

	// 红包列表
	getCouponList: path + 'coupon/getCouponByType'
};
module.exports = Api;