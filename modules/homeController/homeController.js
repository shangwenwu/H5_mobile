
var Carousel = require('h5:carousel');
var InvestHome = require('h5:investHome');

Router.addRules({
    'home' : function () {
        J.Controllers['home'] ? J.Controllers['home'].render() : J.Controllers['home'] = new HomeController();
    }
});



var HomeController = function(){
	var t = this;

	t.el = $('<div id="homePageModule" class="home_page_module">'+
		        '<div id="hd" class="hd">'+
		           '<span id="users" class="users tap" data-action="users"></span>'+
			    '</div>'+
			    '<div id="carouselWrapper">'+
			    '</div>'+
			    '<div id="investList">'+
			    '</div>'+
		    '</div>');
	t.carouselWrapper = t.el.find('#carouselWrapper');
	t.investList = t.el.find('#investList');
	t.users = t.el.find('#users');
	t.carousel = new Carousel();
	t.investHome = new InvestHome();
	t.init();
	t.listenFun();
	t.events();
};
HomeController.prototype = {
	init: function(){
		var t = this;
		$('#mainHeader').empty();
		$('#mainBody').html(t.el);
		J.Common.renderBottomLoading({
            id: '#homePageModule'
        }); 
		t.carouselWrapper.html(t.carousel.el);
		t.investList.html(t.investHome.el);
	},
	render: function(){
		var t = this;
		t.carousel.render();
		t.investHome.render();
		t.init();
	},
	listenFun: function(){
		var t = this;
		Transceiver.listen('userInfo','homePageModule.init',function(data){
			if(!location.hash ||!!location.hash.match(/^#home/i)){
				t.userInfo = JSON.parse(data);
				if(!t.userInfo.isLogin){
	               t.users.text('登录').removeClass('in');
				}else{
					t.users.text('').addClass('in');
				}
			}
		});
    },
	events: function(){
        var t = this;
        GlobalTap.register('home_page_module',{
		    action: 'users',
		    fn: function (e,o) {
		    	if(o.target.hasClass('in')){
		        	Router.navigate('account');
		    	}else{
		    		Router.navigate('login');
		    	}
		    }
		},{
		    action: 'invest',
		    fn: function (e,o) {
		    	if(!t.userInfo.isLogin){
		    		J.Common.alert({
				 		content: '您还没有登录！',
				 		onSureCallback: function(){
				 			Router.navigate('login');
				 		},
				  		okValue: '去登录'
				 	});
		    	}else{
		    		J.Common.isOpen({
		    			userInfo: t.userInfo,
		    			hash: 'pay/id='+o.target.data('id')
		    		});
		    	}
		    }
		});
	}
};

HomeController.prototype.constructor = HomeController;

module.exports = HomeController;