var investItemTmpl = __inline('./investHome.tmpl');
var InvestHome = function(){
	var t = this;

	t.el = $('<div id="investHomeModule" class="invest_home_module">'+

		    '</div>');
    t.render();
	t.events();
};
InvestHome.prototype = {
	render: function(){
		var t = this;
		t.ajaxData = {
			pageSize:10,
			status:'ALL',
			currentPage:1
		};
		t.el.empty();
		t.clearTime();
		t.fetch();
	},
	fetch: function(){
		var t = this;
		J.Utils.sendAjax({
            url: J.Api.investData,
			data: t.ajaxData,
			callback: function(data) {
				if(data.results.length) {
                    $(".ui_loading").hide();
                    t.mergeTmpl(data.results);
                    t.totalSize = data.totalSize;
				}
			}
		});
	},
    mergeTmpl: function(list){
    	var t = this, item = {};
        $.each(list,function(i,node){
            item.id = node.id;
            item.title = node.title;
            item.yield = node.yield;
            item.money = node.money;
            item.deadline = node.deadline;
            item.status = node.status;
            item.downTime = J.Common.getCountDownTime(node.endTime,node.startTime,node.id,'one');
            t.el.append(investItemTmpl(item));
            t.setTime(node);
        });

    },
    setTime: function(item){
    	var t = this;
    	var timeout  = setInterval(function(){
			item.endTime=item.endTime-1000;
			J.Common.getCountDownTime(item.endTime,item.startTime,item.id);
			if ((item.endTime - item.startTime) < 0) {
            	clearInterval(timeout);
            	$("#item"+item.id).replaceWith('<a href="'+item.id+'" class="btn_gold tap" data-action="invest" >立即投资</a>');
                return;
            }
        },1000);

        J.Common.intervalArray.push(timeout);
    },
    clearTime: function(){
    	if(J.Common.intervalArray.length){
			J.Common.intervalArray.map(function(item){
				clearInterval(item);
			});
			J.Common.intervalArray = [];
		}
	},
	events: function(){
        var t = this;
        var params = {
            callback: function () {
                if(t.totalSize > t.ajaxData.pageSize * t.ajaxData.currentPage) {
                    t.ajaxData.currentPage++;
                    $(".ui_loading").show();
                    t.fetch();
                }
            }
        }
        J.Common.bindscroll(params);
	}

};

InvestHome.prototype.constructor = InvestHome;

module.exports = InvestHome;