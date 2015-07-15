Router.addRules({
    'account/underRepay' : function () {
        J.Controllers['underRepay'] ? J.Controllers['underRepay'].init() : J.Controllers['underRepay'] = new UnderRepayController();
    }
});

var underRepayTpl = require('h5:underRepayController/dataListTpl');
require('h5:base/base64');

var UnderRepayController = function(){
    var t = this;
    t.htmlText = '<div id="UnderRepayPageModule" class="underRepay_page_module">' +
        '<table>' +
           ' <thead>' +
                '<tr>' +
                    '<th width="33.3%">项目名称</th>' +
                    '<th width="33.3%">收款时间</th>' +
                    '<th width="33.3%">收款金额</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody id="dataWrapper"></tbody>' +
        '</table>' +
    '</div>';
    t.init();
}

UnderRepayController.prototype = {
    init: function(){
        var t = this;
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '待收款',
            onReturn: function() {
                history.go(-1);
            }
        });
        t.el = $(t.htmlText);
        $('#mainBody').html(t.el);
        J.Common.renderBottomLoading({
            id: '#UnderRepayPageModule'
        });
        t.filter = {
            pageSize:15,
            currentPage:1,
            totalSize: 0
        };
        t.fetch();
        t.events();
    },

    render: function(data){
        var t = this;
        $(".ui_loading").hide();
        $("#dataWrapper").append($(underRepayTpl({ moduleData : data })));
    },

    fetch: function () {
        var t =this;
        var options = {
            url: J.Api.underRepay,
            data: t.filter,
            type: 'GET',
            scopt: t,
            callback: function(data) {
                t.render(data);
                t.filter.totalSize = data.totalSize;
            },
            notLoginCallback: function () {
                var href = 'login/url=' + new Base64().encode(location.href);
                Router.navigate(href);
            }
        };
        J.Utils.sendAjax(options);        
    },

    events : function(){
        var t = this;
        var params = {
            callback: function () {
                if(t.filter.totalSize > t.filter.pageSize * t.filter.currentPage) {
                    t.filter.currentPage++;
                    $(".ui_loading").show();
                    t.fetch();
                }
            }
        }
        J.Common.bindscroll(params);
    }
};

UnderRepayController.prototype.constructor = UnderRepayController;
module.exports = UnderRepayController;