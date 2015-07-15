var wrapperTpl = Template(
    '<p class="to_info"><span class="title"><%- moduleData.data.title %></span><span class="text">本息保障</span></p>' +
    '<div class="detail_info">' +
        '<div class="rate">' +
            '<p class="number"><%- moduleData.data.rate %></p>' +
            '<p class="text">年化收益率</p>' +
        '</div>' +
        '<div class="amount">' +
            '<p class="number"><%- moduleData.data.balance %></p>' +
            '<p class="text">可投金额</p>' +
        '</div>' +
        '<div class="duretion">' +
            '<p class="time"><%- moduleData.data.fduration %><%- moduleData.data.fdurunit %></p>' +
            '<p class="text">期限</p>' +
        '</div>' +
    '</div>' +
    '<div class="available_amount">' +
        '可用余额:<%- moduleData.user.leftMoney %>' +
        '<a class="recharge" href="/#recharge">充值</a>' +
    '</div>' +
    '<div class="item">' +
        '<span class="label">投资金额(元)</span>' +
        '<input type="text" class="invest_input" data-leftMoney="<%- moduleData.user.leftMoney %>" data-balance="<%- moduleData.data.balance %>" data-min="<%- moduleData.data.min %>" data-step="<%- moduleData.data.stepBase %>" placeholder="请输入投资金额">' +
    '</div>' +
    '<p class="ui_error"></p>' +
    '<div class="item coupon_item">' +
        '<span class="label">使用优惠券</span>' +
        '<a class="choose_coupon" href="/#coupon">请选择优惠券</a>' +
    '</div>' +
    '<a class="ui_btn_blue confirm_invest tap" href="javascript:void(0);" data-action="invest">立即投资</a>'
);
module.exports = wrapperTpl;