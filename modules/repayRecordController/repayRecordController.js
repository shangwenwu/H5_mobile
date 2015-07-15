Router.addRules({
    'repayRecord' : function () {
        J.Controllers['repayRecord'] ? J.Controllers['repayRecord'].init() : J.Controllers['repayRecord'] = new RepayRecordController();
    },
    'repayRecord/id=:id' : function (type, id) {
        var options = {id : id};
        J.Controllers['repayRecord'] ? J.Controllers['repayRecord'].init(options) : J.Controllers['repayRecord'] = new RepayRecordController(options);
    }    
});

var repayRecordTpl = require('h5:repayRecordController/dataListTpl');
require('h5:base/base64');

var RepayRecordController = function(options){
	var t = this;
	t.htmlText = '<div id="RepayRecordPageModule" class="repayRecord_page_module">' +
        '<table>' +
           ' <thead>' +
                '<tr>' +
                    '<th width="33.3%">日期</th>' +
                    '<th width="33.3%">金额</th>' +
                    '<th width="33.3%">状态</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody id="dataWrapper"></tbody>' +
        '</table>' +
    '</div>';
    t.init(options);
}

RepayRecordController.prototype = {
	init: function(options){
		var t = this;
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '收款记录',
            onReturn: function() {
                history.go(-1);
            }
        });
        t.el = $(t.htmlText);
		$('#mainBody').html(t.el);
        J.Common.renderBottomLoading({
            id: '#RepayRecordPageModule'
        });
        t.filter = {
            pageSize:5,
            currentPage:1,
            totalSize: 0,
            id:  options.id
        };
        t.fetch();
        t.events();
	},

	render: function(data){
        var t = this;
        $(".ui_loading").hide();
        $("#dataWrapper").append($(repayRecordTpl({ moduleData : data })));
	},

    fetch: function () {
        var t =this;
        var options = {
            url: J.Api.repayRecord,
            data: t.filter,
            type: 'GET',
            scopt: t,
            callback: function(data) {
                t.render(data);
                t.filter.totalSize = data.totalSize;
            },
            notLoginCallback: function () {
                var href = '/#login/url=' + new Base64().encode(location.href);
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

        t.el.delegate('.ul_tab a', 'click', function(e){//切换类别
            e.preventDefault();
            var node = $(this).parent();
            if(!node.hasClass('active')) {
                node.siblings('li').removeClass('active');
                node.addClass('active');
                t.filter.status = $(this).attr("data-status");
                t.filter.currentPage = 1;
                $("#dataWrapper").html('');
                t.fetch();
            }
        });
	}
};

RepayRecordController.prototype.constructor = RepayRecordController;
module.exports = RepayRecordController;