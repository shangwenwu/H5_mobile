var _id, user = {}, couponList = [];
Router.addRules({
    'pay/id=:id': function(type, id) {
        _id = id;
        var options = {
            id: id
        };
        J.Controllers['pay'] ? J.Controllers['pay'].render(options) : J.Controllers['pay'] = new payController(options);
    }
});

var investModule = {},
    wrapperTpl = require('h5:payController/wrapperTpl'),
    successTpl = require('h5:payController/paySuccessTpl');

var payController = function(options) {
    var t = this;
    // this.url = options && options.url || '';
    t.el = $('<div id="pay_page_modulePageModule" class="pay_page_module"></div>');
    t.init(options);
    t.listenFun();
};
payController.prototype = {
    init: function(options) {
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '投资付款'
        });
        var t = this;
        delete investModule.data;
        $('#mainBody').html(t.el);
        t.fetch(options);
    },

    render: function(options) {
        var t = this;
        t.init(options);
    },

    //投资标的详情数据
    fetch: function() {
        var t = this;
        var options = {
            url: J.Api.investDetail,
            data: {
                id: _id
            },
            scopt: t,
            // type: 'GET',
            callback: function(data) {
                t.events();
                investModule.data = data;
                t.renderWrapper();
            }
        };
        J.Utils.sendAjax(options);
    },

    renderWrapper: function () {
        var t =this;
        window.setTimeout(function() {
            if(typeof investModule.data != 'undefined' && typeof investModule.user != 'undefined') {
                t.el.html($(wrapperTpl({
                    moduleData: investModule
                })));
            } else {
                window.setTimeout(arguments.callee, 100);
            }
        }, 50);
    },

    submitInvest: function() {
        var t = this;
        J.Common.confirm({
            content: '确定投资?',
            onSureCallback: function() {
                var number = $.trim($('.invest_input').val());
                var options = {
                    url: J.Api.submitInvest,
                    type: 'GET',
                    data: {
                        id: _id,
                        num: number
                        // placementId: $("#couponList:visible").size() ? ($("#couponList:visible").val() != 0 ? $("#couponList:visible").val() : '') : ''
                    },
                    scopt: t,
                    callback: function(data) {
                        if (data.result == true) {
                            J.Common.renderTitle({
                                id: 'mainHeader',
                                text: '投资成功'
                            });
                            investModule.data.investNumber = number;
                            t.el.html($(successTpl({
                                moduleData: investModule
                            })));
                        } else {
                            J.Common.alert({
                                content: '投资失败',
                                okValue: '确定'
                            });
                        }
                    }
                };
                J.Utils.sendAjax(options);
            },
            okValue: '确定',
            cancelValue: '取消'
        })
    },

    listenFun: function() {
        var t = this;
        Transceiver.listen('userInfo', 'pay.init', function(data) {
            if(!!location.hash.match(/^#pay/i)){
                investModule.user = {};
                investModule.user = JSON.parse(data);
                if(data) {
                    require('h5:base/base64');
                    Router.navigate('login/url=' + new Base64().encode(location.href));
                } else {
                    t.renderWrapper();
                }
            }
        });
    },

    events: function() {
        var t = this;
        GlobalTap.register('pay_page_module', {
            action: 'invest',
            fn: function(e, o) {
                var user = investModule.user,
                    input = $('.invest_input'),
                    val = $.trim(input.val()),
                    min = parseInt(input.data("min")),
                    step = parseInt(input.data("step")),
                    balance = parseInt(input.data("balance")),
                    leftMoney = parseInt(input.data("leftMoney")),
                    err = $('.ui_error');
                if (!val) { //输入不合法
                    err.text('请输入投资金额').css('visibility', 'visible');
                } else if (isNaN(val)) { //输入不合法
                    err.text('请输入正确的金额').css('visibility', 'visible');
                } else if (val > leftMoney) {
                    err.text('投标金额不可超过可用余额').css('visibility', 'visible');
                } else if (val > balance) {
                    err.text('投标金额不可超过可投金额').css('visibility', 'visible');
                } else if (val < min) {
                    err.text('单次投标金额不可少于' + min + ' ! ').css('visibility', 'visible');
                } else if (val % step !== 0) {
                    err.text('单次投标金额必须为' + step + ' 的倍数! ').css('visibility', 'visible');
                } else {
                    err.text('').css('visibility', 'hidden');
                    t.submitInvest(val);
                }
            }
        });
    }
};

payController.prototype.constructor = payController;

module.exports = payController;