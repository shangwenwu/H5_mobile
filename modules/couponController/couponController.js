
var agreement = require('h5:agreement/coupon');
var couponTmpl = __inline('./couponController.tmpl');

Router.addRules({
    'account/coupon': function () {
        J.Controllers['coupon'] ? J.Controllers['coupon'].render() : J.Controllers['coupon'] = new CouponController();
    }
});

var CouponController = function () {
    var t = this;
    t.el = $('<div id="couponPageModule" class="coupon_page_module">' +
                '<ul class="ul_tab">' +
                    '<li class="active tap" data-action="PLACED" ><a>可用</a></li>' +
                    '<li class="tap" data-action="USED"><a>历史</a></li>' +
                '</ul>' +
                '<p class="hint tap" data-action="hint"><i></i>使用规则</p>'+
                '<div id="list" class="list">'+
                '</div>'+
            '</div>');
    t.list = t.el.find('#list');
    t.sendData = {
        pageSize:10,
        currentPage: 1,
        type: 'ALL',
        status: 'PLACED'
    };
    t.render();
    t.events();
};

CouponController.prototype = {
    render: function () {
        var t = this;
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '我的红包'
        });
        $('#mainBody').html(t.el);
        J.Common.renderBottomLoading({
            id: '#fundsRecordModule'
        }); 
        t.list.empty();
        t.events();
        t.fetchlist();
    },
    _formatPrice: function(num) {
        if (typeof num === 'string') {
            return num;
        }
        if (num < 10000) {
            return num;
        } else {
            return (num / 10000).toFixed(1) + '万';
        }
    },
    fetchlist: function () {
        var t = this;
        J.Utils.sendAjax({
            url: J.Api.getCouponList,
            type: 'GET',
            data: t.sendData,
            callback: function(data) {
                t.totalSize = data.totalSize;
                t.list.append(couponTmpl({
                    list: data.results,
                    formatPrice: t._formatPrice,
                    formatTime: J.Utils.formatTime
                }));
            }
        });
    },
    events: function () {
        var t = this;
         GlobalTap.register('coupon_page_module',{
            action: 'PLACED',
            fn: function (e,o) {
                t.el.find('.active').removeClass('active');
                o.target.addClass('active');
                t.sendData.status = 'PLACED';
                t.sendData.currentPage = 1;
                t.list.empty();
                t.fetchlist();
            }
        },{
            action: 'USED',
            fn: function (e,o) {
                t.el.find('.active').removeClass('active');
                o.target.addClass('active');
                t.sendData.status = 'USED';
                t.sendData.currentPage = 1;
                t.list.empty();
                t.fetchlist();
            }
        },{
            action: 'hint',
            fn: function (e,o) {
                var w = document.body.clientWidth-70 + 'px';
                var dialog = J.Common.dialog({
                    content: agreement,
                    width: w,
                    title:'使用规则'
                });
                dialog.showModal();
            }
        });
        var params = {
            callback: function () {
                if(t.totalSize > t.sendData.pageSize * t.sendData.currentPage) {
                    t.sendData.currentPage++;
                    $(".ui_loading").show();
                    t.fetchlist();
                }
            }
        }
        J.Common.bindscroll(params);
    }
    
};

CouponController.prototype.constructor = CouponController;

module.exports = CouponController;