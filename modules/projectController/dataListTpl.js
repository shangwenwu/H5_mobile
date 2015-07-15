var dataListTpl = Template(
    '<% if(moduleData.results.length > 0){ %> ' + 
        '<% $.each(moduleData.results, function(i, item) { %>'+
            '<li class="item">' + 
                '<a class="to_detail" href="/investDetail/id=<%- item.id %>"><span class="title"><%- item.title %></span><span class="time"><%- item.time %></span></a>' +
                '<div class="detail_info">' +
                    '<div class="rate">' +
                        '<p class="number"><%- item.rate %></p>' +
                        '<p class="text">年化收益率</p>' +
                    '</div>' +
                    '<div class="amount">' +
                        '<% if(item.status == 1){ %>' +
                            '<p class="number"><%- item.leftAmount %></p>' +
                            '<p class="text">可投金额</p>' +
                        '<% } else { %>' +
                            '<p class="number"><%- item.amount %></p>' +
                            '<p class="text">投资金额</p>' +
                        '<% } %>' + 
                    '</div>' +
                    '<div class="duretion">' +
                        '<p class="time"><%- item.duretion %></p>' +
                        '<p class="text">期限</p>' +
                    '</div>' +
                '</div>' +
                '<div class="bottom">' +
                '<% if(item.status == 1){ %>' +
                    '<div class="progress">' +
                        '<div class="current" style="width:<%- item.progress %>;"><span><%- item.progress %></span></div>' +
                    '</div>' +
                '<% } else { %>' +
                    '<a class="repay_record" href="/#repayRecord/id=<%- item.id %>">收款记录</a>' +
                    '<a class="agreement" href="#">查看协议</a>' +
                '<% } %>' + 
                '</div>' +
            '</li>' +
        '<% }) %>' +
    '<%} else { %>' +
            '<li class="no_data">暂无相关数据</li>' +
    '<% } %>'
);
module.exports = dataListTpl;