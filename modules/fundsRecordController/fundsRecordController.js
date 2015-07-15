var fundsRecordTmpl = __inline('./fundsRecordTpl.tmpl');
Router.addRules({
    'account/fundsRecord' : function () {
        J.Controllers['fundsRecord'] ? J.Controllers['fundsRecord'].render() : J.Controllers['fundsRecord'] = new FundsRecordController();
    },
});
var FundsRecordController = function(){
	var t = this;
	t.el = $('<div id="fundsRecordModule" class="funds_record_module">' +
                '<ul class="ul_tab">' +
                    '<li class="active tap" data-action="amount" ><a>资金记录</a></li>' +
                    '<li class="tap" data-action="recharge"><a>充值记录</a></li>' +
                    '<li class="tap" data-action="withdraw"><a>提现记录</a></li>' +
                '</ul>' +
                '<ul id="dataWrapper"></ul>' +
            '</div>');
    t.dataWrapper = t.el.find('#dataWrapper');
    t.render();
    t.events();
};
FundsRecordController.prototype = {
    render: function(){
        var t = this;
        J.Common.renderTitle({
            id: 'mainHeader',
            text: '资金记录'
        });
        $('#mainBody').html(t.el);
        J.Common.renderBottomLoading({
            id: '#fundsRecordModule'
        }); 
        t.record = 'amount';
        t.dataWrapper.empty();
        t.sendUrl = J.Api.fundsRecord;
        t.sendData = {
            pageSize:10,
            currentPage: 1,
            transType:'all',
            startTime:'',
            endTime:''
        };
        t.events();
        t.fetchlist();
    },

    fetchlist: function(){
        var t = this;
        var options = {
            url: t.sendUrl,
            data: t.sendData,
            type: 'post',
            scopt: t,
            callback: function(data) {
                $(".ui_loading").hide();
                t.filterTpl(data.results);
                t.totalSize = data.totalSize;
            }
        };
        J.Utils.sendAjax(options);       
    },
    filterTpl: function(list){
        var t = this, tpl = '', item = {} ;
        $.each(list,function(i,node){
            item.time = J.Utils.formatTime(node.time);
            item.name = (t.record == 'amount') ? node.type : (t.record == 'recharge' ? node.fundChannel : node.state);
            item.money = (t.record == 'amount') ? 
                         (node.income ? '+'+node.income : '-'+node.disbursement) : 
                         '￥'+(t.record == 'recharge' ? node.rechargeMoney : node.withdrawMoney);
            item.color = (t.record == 'amount') ? (node.income ? 'gree' : 'reb') : '';
            t.dataWrapper.append(fundsRecordTmpl(item));
        });

    },
    events: function(){
    	var t = this;
         GlobalTap.register('funds_record_module',{
            action: 'amount',
            fn: function (e,o) {
                t.el.find('.active').removeClass('active');
                o.target.addClass('active');
                t.record = 'amount';
                t.sendUrl = J.Api.fundsRecord;
                t.sendData.transType = 'all';
                t.sendData.currentPage = 1;
                t.dataWrapper.empty();
                t.fetchlist();
            }
        },{
            action: 'recharge',
            fn: function (e,o) {
                t.el.find('.active').removeClass('active');
                o.target.addClass('active');
                t.record = 'recharge';
                t.sendUrl = J.Api.fundsRecharge;
                t.sendData.transType = 0;
                t.sendData.currentPage = 1;
                t.dataWrapper.empty();
                t.fetchlist();
            }
        },{
            action: 'withdraw',
            fn: function (e,o) {
                t.el.find('.active').removeClass('active');
                o.target.addClass('active');
                t.record = 'withdraw';
                t.sendUrl = J.Api.fundsWithdraw;
                t.sendData.transType = 0;
                t.sendData.currentPage = 1;
                t.dataWrapper.empty();
                t.fetchlist();

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

FundsRecordController.prototype.constructor = FundsRecordController;

module.exports = FundsRecordController;