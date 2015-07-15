var tableTpl = Template(
    '<% if(moduleData.results.length > 0){ %> ' + 
        '<% $.each(moduleData.results, function(i, item) { %>'+
            '<tr >' + 
                '<td><%- item.title %></td>' +
                '<td><%- item.time %></td>' +
                '<td class="under_repay"><%- item.amount %></td>' +
            '</tr>' +
        '<% }) %>' +
    '<%} else { %>' +
            '<tr><td colspan="3">暂无相关数据</td></tr>' +       
    '<% } %>'
);
module.exports = tableTpl;