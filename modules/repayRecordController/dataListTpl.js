var tableTpl = Template(
    '<% if(moduleData.results.length > 0){ %> ' + 
        '<% $.each(moduleData.results, function(i, item) { %>'+
            '<tr >' + 
                '<td><%- item.time %></td>' +
                '<td><%- item.amount %></td>' +
                '<% if(item.status == 1){ %>' +
                    '<td class="under_repay">待收款</td>' +
                '<% } else if(item.status == 2) { %>' +
                    '<td class="paid">已收款</td>' +
                '<% } else { %>' +
                    '<td class="overtime">预期</td>' +
                '<% } %>' + 
            '</tr>' +
        '<% }) %>' +
    '<%} else { %>' +
            '<tr><td colspan="3">暂无相关数据</td></tr>' +       
    '<% } %>'
);
module.exports = tableTpl;