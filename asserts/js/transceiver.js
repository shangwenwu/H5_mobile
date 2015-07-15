/*!
 * transceiver
 * Date: 2014-12-1
 * user: jialaibin
 *
 * 用于事件监听，模块开发彻底分开，解决模块之间的事件依赖和加载顺序
 * For event monitoring, module development completely separated, solve the module between the event dependence and loading sequence
 */
 
;(function (win) {

	var eventDB = {};    //Event data binding
	var eventFun = {};   //Event execution method
	
	//Event execution
	var eventExecution = function(triggerEventName){ 
		var args = eventDB[triggerEventName],  execute = eventFun[triggerEventName];
		if(args && execute){
			for(var key in execute){
				execute[key].apply(this,args); 
			}	
		}
	};
	var Transceiver = {
	    trigger : function(triggerEventName,args){
			eventDB[triggerEventName] = args || [];
			eventExecution(triggerEventName);
		},
		listen : function(triggerEventName,listenEventName,callback,one){
			!eventFun[triggerEventName] && (eventFun[triggerEventName] = {});
			eventFun[triggerEventName][listenEventName] = callback || function(){};
			eventExecution(triggerEventName);
			if(one){
			    this.destroy(triggerEventName,listenEventName);
			}
		},
		destroy : function(triggerEventName,listenEventName){
			eventFun[triggerEventName][listenEventName] && delete eventFun[triggerEventName][listenEventName]
		}
	};
	
    win.Transceiver = Transceiver;

})(window);