var beforeUnloadTimeout = 0;
var call_user_answered;
var global_messenger_count = 0;
var gl_scrollChatDelay = false;
var vy_ms__mob_last_window_focus = new Date().getTime();
var newCallWindow = {};
var hasTouchStartEvent = is_smartphone();
var VY_USER_FN = !$.trim(_U.first_name) ? _U.username : _U.first_name;
var call_confirm_popup = {'close':function(){}};
var messenger__sort_reaction = function(){};
var vy_xhr = {};
var ms_muted_contacts = vy_ms_mdcontacts || new Array();
var vy_msn_calls;

var _ms_Cache = {
    data: {},
    remove: function (url) {
        delete _ms_Cache.data[url];
    },
    exist: function (url) {
        return _ms_Cache.data.hasOwnProperty(url) && _ms_Cache.data[url] !== null;
    },
    get: function (url) {
        return _ms_Cache.data[url];
    },
    set: function (url, cachedData, callback) {
        _ms_Cache.remove(url);
        _ms_Cache.data[url] = cachedData;
        if ($.isFunction(callback)) callback(cachedData);
    }
};
if(typeof isInArray != 'function'){
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
}
function revert_scrollbar(){

let _stylesheet = document.styleSheets;
 
for(var y = 0; y < _stylesheet.length; y++){
    let rules = new Array();
    try{
        rules = _stylesheet[y].cssRules || _stylesheet[y].rules;
    }
    catch(e){
    }
    if(typeof _stylesheet[y] !== undefined && rules.length > 0)
    for(var i = 0; i < rules.length; i++)
    if('cssRules' in rules[i])
    for(var x in rules[i]['cssRules']){
         if(typeof rules[i]['cssRules'][x] != 'undefined' && rules[i]['cssRules'][x]['selectorText'] == '::-webkit-scrollbar')
             rules[i].deleteRule(rules[i]['cssRules']); 
          if(typeof rules[i]['cssRules'][x] != 'undefined' && rules[i]['cssRules'][x]['selectorText'] == '::-webkit-scrollbar-thumb') 
             rules[i].deleteRule(rules[i]['cssRules'][x]); 
    }
}
    
}
function __j(a){
    
    return $(a);
}
function arr_prepend(value, array) {
  var newArray = array.slice();
  newArray.unshift(value);
  return newArray;
}
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
function reverseObject(object) {
        var newObject = {};
        var keys = [];

        for (var key in object) {
            keys.push(key);
        }

        for (var i = keys.length - 1; i >= 0; i--) {
          var value = object[keys[i]];
          newObject[keys[i]]= value;
        }       

        return newObject;
}
function isEven(n) {
   return n % 2 == 0;
}
function generateRoomId(n1,n2,page_id,group_id){
    
    
   page_id = page_id || 0;
   group_id = group_id || 0;
   n1 = parseInt(n1), n2 = parseInt(n2); 

   return page_id ? (n1*n2)+n1+n2+'_'+page_id : ( group_id > 0 ? 'GG'+group_id : (n1*n2)+n1+n2);

} 
function nl2br (str, is_xhtml) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Philip Peterson
  // +   improved by: Onno Marsman
  // +   improved by: Atli Þór
  // +   bugfixed by: Onno Marsman
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Maximusya
  // *     example 1: nl2br('Kevin\nvan\nZonneveld');
  // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
  // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
  // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
  // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
  // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
 
}
function _jAjax(u, t, d, pForm, id) {
    
 
    if(!id)
        id =  Math.floor(Math.random() * 99);

 
    
    let req;
    if(!pForm) {
        req = $.ajax({
            url: u,
            type: t,
            data: d, 
 
            beforeSend: function(jqXHR, settings) {
               // xhrPool.push(jqXHR);
                vy_xhr[id] = jqXHR;
                
                
            }
            //  cache true
        });
    } else {
        req = $.ajax({
            url: u,
            type: t,
            data: d,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
    }
    req.fail(function(a, b) {
 
    });
 
    return req; 
} 
function jAjax(u, t, d, pForm, id, cache_name) {
    
 
    if (_ms_Cache.exist(cache_name)) {

        return {'localcache':true,'data':_ms_Cache.get(cache_name)};
         
    } else 
    return _jAjax(u, t, d, pForm, id); 
}

function createCookie(name, value, days) {
    if(!days) days = 100;
    if(days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString()
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/"
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while(c.charAt(0) == ' ') c = c.substring(1, c.length);
        if(c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

 
function evstop(e, p) {
    if(p) e.preventDefault();
    e.stopImmediatePropagation();
}

function Wo_OpenChatTab(recipient_id, group_id,product_id = 0,page_id = 0,page_user_id = 0) {
    
    let in_messenger = __j('html').hasClass('messenger-window');
    
    
    if(group_id && in_messenger){
        
        window.location = '/messenger/g/'+group_id;
        
    } else if(group_id && !in_messenger){
        
        // open chat shortcut
    }
    
    //messenger.closeBox();
   // messenger_shortcut.open(el, evt);
    
    
    
    
}

function vy_openChatTab(el, evt, recipient_id, page){
    
    el = __j(el);
    let group_id = typeof el.data('uch').group != 'undefined' ? parseInt(el.data('uch').group) : false;
    let page_id = typeof el.data('uch').page_id != 'undefined' ? parseInt(el.data('uch').page_id) : false;
    
    if(current_width < 720 || __j('html').hasClass('vy-shortcut-hidden') || is_smartphone()){
        
        if(group_id > 0)
            window.location='/messenger/g/'+group_id;
        else if(page_id > 0)
            window.location='/messenger/'+recipient_id+'/'+page_id;
        else
            window.location='/messenger/'+recipient_id;
 
        
    } else {
        messenger.closeBox();
        messenger_shortcut.open(el, evt);
    }
}


function messengerPage() {


    if(__j('.pmessenger').length) {

    if(hasTouchStartEvent)
    {

        __j(document.body).off('touchmove.vy_lv_plugin1');
        __j(document).off('touchmove.vy_lv_plugin2');
    }

    if(!__j('html').hasClass('messenger-window') && __j('.pmessenger-contact-a').length){
        __j('html').addClass('messenger-window');


        setTimeout(function() {

            if(__j('#profile_left_side_bar').css('display') != 'none') {

                __j('#profile_left_side_bar').hide();
            }
            __j(window).off('resize.restructureMessengerPage').on('resize.restructureMessengerPage', function() {
                resizeMessenger();
            });
 
            resizeMessenger();
            if(__j('.js_open_messenger_appended_contact').length){
                messenger.firstConvClick();
            } else 
            if(__j('.js_open_messenger-user').length){
                __j('#contact-'+parseInt(__j('.js_open_messenger-user').attr('id'))).trigger('click');
            } else {messenger.firstSession();}
            
            messenger.searchMessenger();
            messenger._init();

        __j('.pmessenger').show();
        
        if(__j('.pmessenger-contact-a').length <=0) {
            __j('.js_messenger_load_data').remove();
            
            if(hasTouchStartEvent){
                __j('.js__smarphones_search').show();messenger.show_contacts();
            }
        }

        },10);

    } else {
        
    messenger.searchMessenger();
    messenger._init();
    messenger.removeMessengerLoading();
    __j(".pmessenger").show();
    }

        __j('body').find('[data-ajax]').each(function() {

            __j(this).removeAttr('data-ajax');

        });
    } else {

        __j('html').removeClass('messenger-window');

    }


    if(!__j('.wo_kb_msg_page').length)
        __j('html').removeClass('hide-vy-chat-tabs');



    let ch_msgr = setInterval(function(){
        
        if(!__j('.pmessenger').length)
            __j('html').removeClass('messenger-window');
        
    },2000);
        

    ligh_dark_mode();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {

        const newColorScheme = event.matches ? "dark" : "light";

        ligh_dark_mode();
    });
}
function ligh_dark_mode() {
    // enable dark mode
    const css_dark = __j('#messenger-dark-mode-theme');
    if((readCookie('mode') && readCookie('mode') == 'night') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && readCookie('mode') == 'night')){
        
        css_dark.removeAttr('disabled');
    } else if((readCookie('mode') && readCookie('mode') == 'day') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches && readCookie('mode') == 'day')){
        
        css_dark.attr('disabled',true);
    } else {
        css_dark.attr('disabled',true);
    }
        setTimeout(function () {
            ligh_dark_mode();
        }, 4000);
 
}
function ajaxLoading() {  

    //var markup = ga('<div class="global_ajax_loader"></div>');
    var b = __j('body');
    var markup = '<div class="globalAjaxLoader">\
            <div>        \
            <div class="preloader-spin">\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            <div class="preloader-spin__petal"></div>\
            </div></div>';

    if(!b.find('.globalAjaxLoader').length)
        b.prepend(markup);
}
function removeAjaxLoad() {
   __j('body')
        .find('.globalAjaxLoader')
        .remove();
}
function is_smartphone(){
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) )
        return true;
    
    return false;
 
}
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "_windows";
    }

    if (/android/i.test(userAgent)) {
        return "_android";
    }

  
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "_ios";
    }

    return "_smartphone";
}

function resizeMessenger() {
    


    if(is_smartphone()){
        __j('html').addClass('_touch vy_msn_smartphone_touch '+getMobileOperatingSystem()).removeClass('_hover _ms_desktop');

        
         
    }else{ 
        __j('html').addClass('_hover _ms_desktop').removeClass('_touch '+getMobileOperatingSystem());
        __j('.pmessenger').removeClass('show_contacts');
    }
    
    
    __j('html').addClass(getMobileOperatingSystem());
    __j('.pmessenger').css('height', (__j(window).height() - __j('.toolbar').outerHeight()) + 'px');

    __j('#messenger-contacts-last,#messenger-contacts-search-res,#messenger-contacts-online-res').css('height', (__j(window).height() - (__j('.toolbar').outerHeight() + __j('.pmessenger-contacts-header').height() + __j('._1nq2').height())) + 'px');
    
    
    nanoScrollStart();

}
// moder popup
function modernPopup(func, no_cancel_btn, text) {

    __j('#sc_modern_popup').remove();


    __j('body').prepend('<div id="sc_modern_popup" class="sc_modern_popup"><div class="sc_moder_popup_ovr"></div><div id="sc_modern_popup_cnt">\
        <div class="modernPopup_scnt"></div>\
        <div class="modernPopup-Confirm-footer">' + (no_cancel_btn ? '' : '<div onclick="__j(\'#sc_modern_popup\').remove();" class="modernPopup-Confirm-button modernPopup-Confirm-button-cancel"> Cancel </div>') + '<div id="modernpopup-confirm-btn" class="modernPopup-Confirm-button">Ok</div></div>\
        </div></div>');

    func(__j('#modernpopup-confirm-btn'), __j('.modernPopup_scnt'), __j('.modernPopup-Confirm-button-cancel'));

        __j('#modernpopup-confirm-btn').on('click', function(e) {
            __j('#sc_modern_popup').remove();

        });

    if(text) {

        return __j('.modernPopup_scnt').html('<div class="modern_popup_str">' + text + '</div>');

    }

}

function updateSessionContacts(uid) {

    if(!isInArray(uid, my_contacts))
        my_contacts.push(uid);

}
function updateSessionGroups(group_id) {

    if(!isInArray(group_id, group_chats))
        group_chats.push(group_id);

}

function urlencode(str){
    return encodeURIComponent(str);
}
function nanoScrollStart() {

    const e = __j(".nano-content").parent();
    e.length && (e.nanoScroller({ preventPageScrolling: !0, iOSNativeScrolling: !0 }), e.nanoScroller());

 

} 
function connectIo() {
 
    if(window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1'){
 
        console.log("%cWe can not create server connection from localhost", "color: red; font-size:12px;");
    }
    if (location.protocol !== 'https:') {
 
        console.log("%cYou dont have SSL ENABLED, we can not connect to messenger server with http://. Please secure your domain with https://", "color: red; font-size:12px;");
    }
    
    return io.connect(CHAT_NODE_HOST, {
        query: {key: messenger_code,domain:window.location.hostname,v:vy_ms_v,username:encodeURIComponent(_U.fn),uid:_U.i},
        transports: ['websocket'],
        'reconnection': true, 
        'reconnectionDelay': 1000,
        'reconnectionAttempts': "Infinity",
        'forceNew':true
    });



}
function objHook(str) {
    if(typeof str == 'undefined') return;
    else
        return validateJson(str.replace(/<!--/g, '')
            .replace(/-->/g, ''));
}
function generate_socket_id(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

function socketId(user_id){
    //let id = user_id ? user_id : _U.i;
    //return md5( V_WS_ADDR +'_'+ id);
    return user_id;
}
 
function checkSafari() {
  let seemsChrome = navigator.userAgent.indexOf("Chrome") > -1;
  let seemsSafari = navigator.userAgent.indexOf("Safari") > -1;
  return seemsSafari && !seemsChrome;
}
 


 
// confirmation dialog
function confirm_act(text, callback, l, cancel, btns) {
 
    call_confirm_popup =   $.confirm({
                            title: '',
                            content: text,
                            animation: 'none',
                            closeAnimation: 'none',
                             
                            theme:'light',
                            opacity: 0.5,
                            buttons: {
                                'confirm': {
                                    text: btns ? btns.confirm_button : (l ? lang.logout : lang.okay),
                                    btnClass: 'btn-blue',
                                    action: function(){
                                        if(callback) callback();
                                    }
                                },
 
 
                                'cancel': {
                                    text: btns ? btns.cancel_button : lang.cancel,
                                    action: function(){
                                         if(cancel) cancel();
                                    }
                                }
                            }
                        });
    
 
}
 



function tonum(str) {

    return str.match(/\d/g).join('');
}
 
function removeValue(list, value, separator) {
    separator = separator || ",";
    var values = list.split(separator);
    for(var i = 0; i < values.length; i++) {
        if(values[i] == value) {
            values.splice(i, 1);
            return values.join(separator);
        }
    }
    return list;
}

function validateJson(str, no_err) {
    try {  
        var json = JSON.parse(str);

        if(typeof json.hasOwnProperty('status'))
            if(json.status === 'require_login')
                window.location.reload();


        return json;
    } catch (e) {
        if(!no_err) {
           

            //if(!dev_enabled) setTimeout(function(){window.location.reload()},500);
        } //' + lang.somethingWrong);
        return false;
    }
}
function controlWindowTab() {

 
        if(getMobileOperatingSystem() == '_ios'){
            
            
            setInterval(function() {
                let now = new Date().getTime();
                if(now - vy_ms__mob_last_window_focus > 1000) {//if it's been more than 5 seconds
                    vy_ms__window_tab_active = true;
                     
                }  
                vy_ms__mob_last_window_focus = now;
            }, 500);
            
        } else {
 
        

    __j(window).on("blur focus", function(e) {
        var prevType = __j(this).data("prevType");

        if(prevType != e.type) { //  reduce double fire issues
            switch (e.type) {
                case "blur":
                 //  if(NODEJS_ENABLED) messenger_shortcut.removeAllChatFocusClass();
                    vy_ms__window_tab_active = false;
                    break;
                case "focus":

                    vy_ms__window_tab_active = true;
                    break;
            }
        }
        
        
        

        __j(this).data("prevType", e.type);
    });
}



}


function jprintf(format, data) {
    var arg = arguments;
    var i = 1;
    return format.replace(/%((%)|s)/g, function(m) {
        return m[2] || arg[i++]
    })
}

function displayErr(text){
    
    var html = '<div class="messenger-error-show js_mess-err-show"><div class="messenger-error-text">'+text+'</div></div>';
    
    if(__j('.pmessenger').length){
        
        // show errors in messenger
        __j('#pmessenger-contact-header').after(html);
        
        
        
    } else if (__j('.messenger-shortcut-container').length){
        
        
        // show errors in chatbox
        __j('.messenger-shortcut-container._focus .messenger-shortcut-header').after(html);
        
    }
    
    messenger.playSound('error');
    __j('.js_mess-err-show').addClass('showon');
    setTimeout(function(){
        
        __j('.js_mess-err-show').removeClass('showon');
        setTimeout(function(){
            __j('.js_mess-err-show').remove();
            
        },2000);
        
    },6000)
    
}
function iso8601(date) {
  return date.getUTCFullYear()
    + "-" + (date.getUTCMonth()+1)
    + "-" + date.getUTCDate()
    + "T" + date.getUTCHours()
    + ":" + date.getUTCMinutes()
    + ":" + date.getUTCSeconds() + "Z";
}
function urldecode(str) {
    return decodeURIComponent((str + '')
        .replace(/\+/g, '%20'));
}
function base64_decode(data) {
    //  discuss at: http://phpjs.org/functions/base64_decode/
    // original by: Tyler Akins (http://rumkin.com)
    // improved by: Thunder.m
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Aman Gupta
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    // bugfixed by: Pellentesque Malesuada
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: base64_decode('YQ===');
    //   returns 2: 'a'
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = '',
        tmp_arr = [];
    if(!data) {
        return data;
    }
    data += '';
    do { // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        if(h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if(h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while(i < data.length);
    dec = tmp_arr.join('');
    return dec.replace(/\0+$/, '');
}


function unbindRemainOnSite(namespace) {


    if(namespace) __j(window)
        .off('beforeunload.' + namespace);
    else __j(window)
        .off('beforeunload');
    stop_cl = false;
    __j(window).bind('unload', function() { 
        clearTimeout(beforeUnloadTimeout);
    });
}

function remainOnSite(str, namespace, callback) {
    stop_cl = str;
    __j(window)
        .on("beforeunload." + namespace, function() {


            beforeUnloadTimeout = setTimeout(function() {
                if(callback) callback();
            }, 1000);

            return str;
        });
}


/* START MD5 */
function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17,  606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12,  1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7,  1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7,  1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22,  1236535329);

a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14,  643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9,  38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5,  568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20,  1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14,  1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);

a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16,  1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11,  1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4,  681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23,  76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16,  530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);

a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10,  1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6,  1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6,  1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21,  1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15,  718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
txt = '';
var n = s.length,
state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) {
md5cycle(state, md5blk(s.substring(i-64, i)));
}
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++)
tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) {
md5cycle(state, tail);
for (i=0; i<16; i++) tail[i] = 0;
}
tail[14] = n*8;
md5cycle(state, tail);
return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
var md5blks = [], i; /* Andy King said do it this way. */
for (i=0; i<64; i+=4) {
md5blks[i>>2] = s.charCodeAt(i)
+ (s.charCodeAt(i+1) << 8)
+ (s.charCodeAt(i+2) << 16)
+ (s.charCodeAt(i+3) << 24);
}
return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n)
{
var s='', j=0;
for(; j<4; j++)
s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
+ hex_chr[(n >> (j * 8)) & 0x0F];
return s;
}

function hex(x) {
for (var i=0; i<x.length; i++)
x[i] = rhex(x[i]);
return x.join('');
}

function md5(s) {
return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
function add32(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF),
msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}
}

/* END MD5 */



 
 
$.fn.focusEnd = function() {
    
 
    
    __j(this)
        .focus();
    var tmp = __j('<span />')
        .appendTo($(this)),
        node = tmp.get(0),
        range = null,
        sel = null;
    if(document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if(window.getSelection) {
        range = document.createRange();
        range.selectNode(node);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    tmp.remove();
    return this;
}
    __j(document).off('click.not_blank_msn').on('click.not_blank_msn','.show-message-link',function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location='/messenger';

    });