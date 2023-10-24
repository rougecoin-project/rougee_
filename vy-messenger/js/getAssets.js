var VYMS_ASSETS = VYMS_ASSETS || (function(){
   // private
    let _args = {},
	head = document.getElementsByTagName('head')[0],
	is_module = false,
	no_module = false; 

    return {
        init : function(Args) { 
            _args = Args;
        },
        read_cookie:function(name){
		    var nameEQ = name + "=";
		    var ca = document.cookie.split(';');
		    for(var i = 0; i < ca.length; i++) {
		        var c = ca[i];
		        while(c.charAt(0) == ' ') c = c.substring(1, c.length);
		        if(c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
		    }
		    return null

        },
		loadCSS: function(url, callback) {

         let cssnode = document.createElement('link');

         cssnode.type = 'text/css';
         cssnode.rel = 'stylesheet';
         cssnode.href = url;

         cssnode.onreadystatechange = callback;
         cssnode.onload = callback;

         head.appendChild(cssnode);
     },
		loadJS: function(url, callback, module, no_module) {
		return new Promise(async (resolve, reject) => {
         let jsnode = document.createElement('script');
	
		 if(!no_module)
         jsnode.type = module ? 'module' : 'text/javascript';
		
		 if(no_module) {
			jsnode.noModule = true;
			resolve(true);
		 }
	 
         jsnode.src = url;

         jsnode.onreadystatechange = callback;
		 if(!no_module) 
         jsnode.onload = function(){
			 
			 resolve(true);
		 };
		 
		
         head.appendChild(jsnode);
		 
		});
     },	

	 addModule: function(value){
		 
         let jsnode = document.createElement('script');
 
		 jsnode.innerHTML = 'var exports = {"__esModule": true};';
         head.appendChild(jsnode);
 
 
	 },
	 isForeign:function(a){
		return a.toString().includes('//'); 
	 },
        load:async function(callback) {
			const that = this;
 
			// generate css assets
			for(var i = 0; i < _args.css.length;i++) {
 
				if(Object.keys(_args.css[i]) == 'dark-theme' && (!that.read_cookie('mode') || that.read_cookie('mode') == 'day')){
				    delete _args.css[i];
					continue;
				} else {
 
				that.loadCSS( ( that.isForeign(Object.values(_args.css[i])) ? '' : _args.path) + Object.values(_args.css[i]) + '?v=' + _args.version);
				}

			}
			
			// generate js assets
			for(var i = 0; i < _args.js.length;i++) {
				
				if(typeof _args.js[i][Object.keys(_args.js[i])] == 'object'){ 
 
				const obj = _args.js[i][Object.keys(_args.js[i])];
				for(var x = 0; x < obj.length; x++)
					if(obj[x] == 'module'){
 
						 that.addModule(); 
						is_module = true; 
						
					} else if( obj[x] == 'nomodule') {
						no_module = 1;
					} else if(obj[x] == 'disabled') {
						break;
					} else if(obj[x] == 'check' && Object.keys(_args.js[i]) == 'socket.io'){
						
					 if (("io" in window)) break;

					} else  if(obj[x] == 'check' && Object.keys(_args.js[i]) == 'easytimer'){

						if (("easytimer" in window)) break;

					} else  if(obj[x] == 'check' && Object.keys(_args.js[i]) == 'createjs'){
						if (("createjs" in window)) break;
					} else  if(obj[x] == 'check' && Object.keys(_args.js[i]) == 'adapter'){
 
						if (("adapter" in window)) break;

					} else  if(obj[x] == 'check' && Object.keys(_args.js[i]) == 'kurento'){
						if (("kurentoUtils" in window)) break;

					} else {
				    await that.loadJS( (that.isForeign(obj[x]) ? '' : _args.path) + obj[x] + '?v=' + _args.version, false, is_module, no_module);
					is_module = false;
					no_module = false;
					}
				} else {

				await that.loadJS( (that.isForeign(Object.values(_args.js[i])) ? '' : _args.path) + Object.values(_args.js[i]) + '?v=' + _args.version);
				
				}
				
			}
 				if($('body').find('.tag_content').length)
					$('#messenger-wondertag-fix').removeAttr('disabled');
				 callback();
	
        
		}
    };
}());
