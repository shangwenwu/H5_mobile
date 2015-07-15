var Api = require('h5:api');

var rewrites = {
	
    '/aaa/btn' : 'test/h5/btn.json',
    '/jxjr-web/users/login' : 'test/h5/login.json',
    './about.json' : 'pc:aboutController/about.json',
    '/aaa/help' : 'test/h5/help.json',
    '/jxjr-web/feedback' : 'test/h5/feedback.json',
    '/jxjr-web/loans/getLoanDetail' : 'test/h5/investDetail.json',
    '/jxjr-web/loans/repaymentsPlan': 'test/h5/investrefundPlan.json',
    '/jxjr-web/loans/investList': 'test/h5/investList.json',
    '/aaa/investDetail' : 'test/h5/investDetail.json',
    '/aaa/investrefundPlan': 'test/h5/investrefundPlan.json',
    '/jxjr-web/cms/loan/list': 'test/h5/investData.json',
    '/jxjr-web/loans/getLoanWithPage':'test/h5/investData.json',
    '/jxjr-web/cms/home/pic' : 'test/h5/carousel.json',
    '/jxjr-web/cms/bulletin' : 'test/h5/leftnews.json',
    '/jxjr-web/cms/news' : 'test/h5/rightnews.json',
    '/jxjr-web/cms/getdetail' : 'test/h5/cmspage.json',
    '/jxjr-web/cms/news/list' : 'test/h5/cmslist.json',
    '/jxjr-web/account/getBankCard' : 'test/h5/bankCardInfo.json',

    '/jxjr-web/account/prepareBindCard' : 'test/h5/bindBankCard.json',
    '/jxjr-web/account/getprepareBindCard' : 'test/h5/getBindBankCard.json',
    '/jxjr-web/trade/prepareWithdraw' : 'test/h5/bindBankCard.json',
    '/jxjr-web/trade/getWithdrawResult' : 'test/h5/getBindBankCard.json',

    '/jxjr-web/users/fundRecord' : 'test/h5/fundsRecord.json',
    '/jxjr-web/users/fundType' : 'test/h5/fundsRecordType.json',
    '/jxjr-web/users/fundsRecharge' : 'test/h5/fundsRecharge.json',
    '/jxjr-web/users/fundsWithdraw' : 'test/h5/fundsWithdraw.json',
    '/aaa/investData':'test/h5/investData.json',
    '/jxjr-web/repayment/pending': 'test/h5/underRepay.json',
    '/jxjr-web/users/imageCaptcha': 'test/h5/img_code.json',
    '/jxjr-web/users/check/imageCaptcha':'test/h5/img_verify.json',

    '/jxjr-web/users/smsCaptcha':'test/h5/sms_voice_code.json',
    '/jxjr-web/users/check/mobileCaptcha':'test/h5/sms_voice_verify.json',

    '/aaa/register':'test/h5/register.json',
    '/aaa/findpassword':'test/h5/find_password.json',
    '/aaa/verifyuser':'test/h5/verify_user.json',
    '/aaa/checkIdNum':'test/h5/checkIdNum.json',
    '/aaa/investData':'test/h5/investData.json',
    '/jxjr-web/users/getBasicUserInfo': 'test/h5/getUserInfo.json',
    '/jxjr-web/loans/buy': 'test/h5/submitInvest.json',
    '/aaa/logout': 'test/h5/logout.json',
    '/jxjr-web/users/register':'test/h5/register.json',
    '/jxjr-web/users/updatePasswd':'test/h5/find_password.json',
    '/jxjr-web/users/checkMobile':'test/h5/verify_user.json',
    '/jxjr-web/users/checkIdNum':'test/h5/checkIdNum.json',
    '/jxjr-web/loans/getLoanWithPage':'test/h5/investData.json',
    '/jxjr-web/message/allMsgs': 'test/h5/message.json',
    '/jxjr-web/invest/status': 'test/h5/project.json',
    '/jxjr-web/repayment/receiveList': 'test/h5/repayRecord.json',

    

    '/jxjr-web/users/fundInfo':'test/h5/getInvestEarnings.json',
    '/jxjr-web/users/monthlystat':'test/h5/getCurveInfo.json',

    '/jxjr-web/users/resetPasswd':'test/h5/modifyPwd.json', //修改密码

    '/jxjr-web/account/personRegister':'test/h5/bindTrusteeship.json',//开通资金托管
    '/jxjr-web/account/prepareBindAgreement':'test/h5/prepareBindAgreement.json', //准备开通无密协议

    '/jxjr-web/users/isBindAgreement':'test/h5/isBindAgreement.json',//是否开通了无密协议
    '/jxjr-web/users/removeAgreement':'test/h5/removeAgreement.json', //解除无密协议

    '/jxjr-web/trade/prepareRecharge': 'test/h5/prepareRecharge.json',	// 准备充值
    '/jxjr-web/trade/getRechargeResult': 'test/h5/getRechargeResult.json',	// 获取充值结果

    // 红包列表
    '/jxjr-web/coupon/getCouponByType': 'test/h5/getCouponList.json',


    '/jxjr-web/coupon/listCoupon': 'test/h5/coupon.json'
    
};
var Rewrite = function(){
    for(var i in Api){
      Api[i] = rewrites[Api[i]];

    }
    return Api;
};

module.exports = Rewrite;