Router.addRules({
    'account/project': function() {
        J.Controllers['project'] ? J.Controllers['project'].init() : J.Controllers['project'] = new ProjectController();
    }
});

var projectTpl = require('h5:projectController/dataListTpl');
require('h5:base/base64');

var ProjectController = function() {
    var t = this;
    t.htmlText = require('h5:projectController/wrapperTpl');
    t.init();
}

ProjectController.prototype = {
    init: function() {
        var t = this;
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '我的投资'
        });
        t.el = $(t.htmlText);
        $('#mainBody').html(t.el);
        J.Common.renderBottomLoading({
            id: '#ProjectPageModule'
        });
        t.filter = {
            pageSize: 15,
            status: 0,
            currentPage: 1,
            totalSize: 0
        };
        t.fetch();
        t.events();
    },

    render: function(data) {
        var t = this;
        $(".ui_loading").hide();
        $("#dataWrapper").append($(projectTpl({
            moduleData: data
        })));
    },

    fetch: function() {
        var t = this;
        var options = {
            url: J.Api.project,
            data: t.filter,
            type: 'GET',
            scopt: t,
            callback: function(data) {
                t.render(data);
                t.filter.totalSize = data.totalSize;
            },
            notLoginCallback: function() {
                var href = 'login/url=' + new Base64().encode(location.href);
                Router.navigate(href);
            }
        };
        J.Utils.sendAjax(options);
    },

    events: function() {
        var t = this;
        var params = {
            callback: function() {
                if (t.filter.totalSize > t.filter.pageSize * t.filter.currentPage) {
                    t.filter.currentPage++;
                    $(".ui_loading").show();
                    t.fetch();
                }
            }
        }
        J.Common.bindscroll(params);

        GlobalTap.register('project_page_module', {
            action: 'updateType',
            fn: function(e, o) {
                var node = $(e.target).parent();
                if (!node.hasClass('active')) {
                    node.siblings('li').removeClass('active');
                    node.addClass('active');
                    t.filter.status = node.data("status");
                    t.filter.currentPage = 1;
                    $("#dataWrapper").html('');
                    t.fetch();
                }
            }
        });

    }
};

ProjectController.prototype.constructor = ProjectController;
module.exports = ProjectController;