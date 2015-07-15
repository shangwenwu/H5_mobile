var paySuccessTpl = Template(
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
    '<div class="invest_success_wrapper">' +
        // '<p>投资金额<span class="number"><%- moduleData.investNumber %>元</span></p>' +
        '<p>投资金额<span class="number"><%- moduleData.data.investNumber %>元</span></p>' +
        // '<p>投资时间<span class="time"><%- moduleData.investTime %></span></p>' +
        '<p>投资时间<span class="time">2015-08-11 12:22</span></p>' +
    '</div>'
);
module.exports = paySuccessTpl;