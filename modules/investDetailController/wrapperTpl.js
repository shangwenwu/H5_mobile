var wrapperTpl = Template(
    '<p class="to_info"><span class="title"><%- moduleData.title %></span><span class="text">本息保障</span></p>' +
    '<div class="detail_info">' +
        '<div class="rate">' +
            '<p class="number"><%- moduleData.rate %></p>' +
            '<p class="text">年化收益率</p>' +
        '</div>' +
        '<div class="amount">' +
            '<p class="number"><%- moduleData.balance %></p>' +
            '<p class="text">剩余金额</p>' +
        '</div>' +
        '<div class="duretion">' +
            '<p class="time"><%- moduleData.fduration %><%- moduleData.fdurunit %></p>' +
            '<p class="text">期限</p>' +
        '</div>' +
    '</div>' +
    '<div class="item">' +
        '<span class="label">起投金额</span>' +
        '<span class="value"><%- moduleData.min %></span>' +
    '</div>' +
    '<div class="item">' +
        '<span class="label">项目总额</span>' +
        '<span class="value"><%- moduleData.originalAmount %></span>' +
    '</div>' +
    '<div class="item">' +
        '<span class="label">还款方式</span>' +
        '<span class="value">到期还本付息</span>' +
    '</div>' +
    '<div class="basic_info">' +
        '<a class="agreement" href="#">协议范本</a><p class="title">基本信息</p>' +
        '<p class="text"><%- moduleData.basicInfo %></p>' +
    '</div>' +
    '<div class="safe_info">' +
        '<p class="title">安全信息</p>' +
        '<p class="text"><%- moduleData.basicInfo %></p>' +
    '</div>' +
    '<% if(moduleData.status == "OPENED") {%>' +
        '<a class="ui_btn_blue to_invest tap" href="javascript:void(0);" data-action="invest">立即投资</a>' +
    '<% } else if(moduleData.status == "SCHEDULED"){%>' +
        '<p class="waiting_time" data-leftTime="<%- moduleData.startTime - moduleData.serverTime %>">开抢倒计时</p>' +
    '<% } %>' +
    '<% if(moduleData.status == "FINISHED") {%>' +
        '<div class="full status_icon"></div>' +
    '<% } else if(moduleData.status == "CLEARED"){%>' +
        '<div class="finished status_icon"></div>' +
    '<% } else if(moduleData.status == "SETTLED"){%>' +
        '<div class="repaying status_icon"></div>' +
    '<% } %>'  
);
module.exports = wrapperTpl;