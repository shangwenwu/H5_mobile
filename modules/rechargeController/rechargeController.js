/**
 * @file 充值
 * Created by jinguangguo on 2015/7/10.
 */

Router.addRules({
    'account/recharge' : function () {
        J.Controllers['recharge'] ? J.Controllers['recharge'].render() : J.Controllers['recharge'] = new RechargeController();
    }
});

var tplFn = __inline('./rechargeController.tmpl');

var RechargeController = function () {
    var t = this;
    t.el = $('<section id="moduleRecharge" class="module_recharge"></<section>');
    // Transceiver.listen('userInfo', 'rechargeModule', function(data) {
    //    t.userInfo = JSON.parse(data);
    //    // TODO
    // });
    t.RECHARGE_TYPE_PERSON = 'PERSON';
    t.RECHARGE_TYPE_ENTERPRISE = 'ENTERPRISE';
    t.currentBankCode = '';
    t.render();
    t.events();
};


RechargeController.prototype = {

    render: function () {
        var t = this;
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '充&nbsp;&nbsp;&nbsp;&nbsp;值'
        });
        $('#mainBody').html(t.el);
        this.fetchBankInfo();
    },
    fetchBankInfo: function() {
        var t = this;
        J.Utils.sendAjax({
            url: J.Api.bankCardInfo,
            type: 'GET',
            callback: function(result) {
                t.currentBankCode = result.bankCode;
                t.el.html(tplFn({
                    "last4BankCardNo": result.last4BankCardNo,
                    "bankCode": result.bankCode,
                    "bankName": J.Utils.bankName[result.bankCode]
                }));
            }
        });
    },
    events: function () {
        var t = this;
        GlobalTap.register('module_recharge',{
            action: 'toRecharge',
            fn: function (e,o) {
                var $rechargeValue = t.el.find('#rechargeValue');
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
                // 充值金额
                if ($.trim($rechargeValue.val()) === '') {
                    showTip('充值金额不能为空！');
                    $rechargeValue.focus();
                    return;
                }
                var value = $.trim($rechargeValue.val());

                var reg1 = /^\d+$/;
                var reg2 = /^\d+\.$/;
                var reg3 = /^\d+\.\d+$/;
                if (reg1.test(value) === true || reg2.test(value) === true || reg3.test(value) === true) {

                } else {
                    showTip('请输入正确的充值金额！');
                    $rechargeValue.focus();
                    return;
                }

                // 6位有效数字
                if (/^\d{1,6}(\.\d{1,})?$/.test(value) === true || /^\d{1,6}(\.)?$/.test(value) === true) {

                } else {
                    showTip('单笔充值最高100,000.00元！');
                    $rechargeValue.focus();
                    return;
                }
                // 先ajax请求-prepareRecharge
                t._ajaxPrepareRecharge(value);
            }
        },{
            action: 'rechargeValue',
            fn: function (e,o) {
                t.el.find('#tipError').empty().css({
                    visibility: 'hidden'
                });
            }
        });

    },
    /**
     * 进行充值
     * @param amount
     * @private
     */
    _ajaxPrepareRecharge: function(amount) {
        var t = this;
        J.Utils.sendAjax({
            url: J.Api.prepareRecharge,
            type: 'GET',
            data: {
                bankCode: t.currentBankCode,   // 当前用户默认的绑卡类型
                amount: amount,
                payType: t.RECHARGE_TYPE_PERSON    // 默认是个人类型
            },
            callback: function (data) {
                t._submitForm(data);
            }
        });
    },
    /**
     * 提交充值表单
     * @param data
     * @private
     */
    _submitForm: function(data) {
        var t = this;
        // 提交表单
        J.Utils.submitForm({
            url: data.url,
            method: 'post',
            param: data.param,
            onSubmit: function(){
                // 要订单ID
                t._showRechargeDialog(data.orderId);
            }
        });
    },
    /**
     * 展现充值之后的列表
     * @param orderId
     * @private
     */
    _showRechargeDialog: function(orderId) {
        var t = this;
        // 提交成功之后，当前页面显示对话框
        J.Common.confirm({
            content: '充值是否成功？',
            okValue: '充值成功',
            onSureCallback: function() {
                // 调用接口
                J.Utils.sendAjax({
                    url: J.Api.getRechargeResult,
                    type: 'GET',
                    data: {
                        orderId: orderId
                    },
                    callback: function(result) {
                        if (result.status === "SUCCESSFUL") {
                            // 跳转到支付成功的页面
                            // TODO 充值成功的页面
                            // Router.navigate('');
                        } else {
                            // 弹出充值失败的对话框提示
                            J.Common.tip({
                                type: 'fail',
                                content: '充值失败',
                                autoHide: true,
                                onShow: function() {

                                }
                            });
                        }
                    }
                });
            },
            cancelValue: '充值失败',
            onCancelCallback: function() {
                // 弹出充值失败的对话框提示
                J.Common.tip({
                    type: 'fail',
                    content: '充值失败',
                    autoHide: true,
                    onShow: function() {

                    }
                });
            }
        });
    }
};

RechargeController.prototype.constructor = RechargeController;

module.exports = RechargeController;