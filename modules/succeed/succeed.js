
var succeed = {

	init : function (option) {
		this.judge(option);
	},

	getTpl : function (option) {
		var tmplFn = __inline('./succeed.tmpl');
        var html = tmplFn({
            id:option.id,
			title:option.title,
			description:option.description,
			butOption:option.butOption
        });
		this.event(option.id,option.butOption);
	    $("#"+option.id).html($(html));
	    
	},
	event : function (id, buttons) {
		for( var i = 0, len = buttons.length; i<len; i++){
			$('#'+ id).on('click', '#'+id+'_'+i, buttons[i].event);
		}
	},
	judge : function (option) {
		
		var id = option.id || 'mainBody',
		    title = option.title || '大文本提示',
		    description = option.description || '',
		    butOption = (option.butOption instanceof Array && option.butOption.length) ? option.butOption : false;
		var paras = {
			id:id,
			title:title,
			description:description,
			butOption:butOption
		}
		this.getTpl(paras);
	}
}

module.exports = succeed;