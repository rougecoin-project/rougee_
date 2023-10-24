/*

Kontackt Messenger.

email: movileanuion@gmail.com 
fb: fb.com/vaneayoung

Copyright 2019 by Vanea Young

--------------------------------
2020 - Modified for WoWonder

*/

var messenger_shortcut = new Messenger_shortcut();


function Messenger_shortcut() {

 if (typeof __j == 'undefined') {
  var __j = function(a) {
   return $(a);
  };
 }


 var self = this;
 self.hasTouchStartEvent = is_smartphone(); //'ontouchstart' in document.createElement( 'div' );
 self.ajax_url = V_HOST+'/vy-messenger-cmd.php';
 self.chatboxes_margin = 15;
 self.chatboxes_width = 328;
 self.chatboxes_height = 455;
 self.vaneayoung;
 self.text_val;
 self.contenteditable;
 self.room_id;
 self.page_id;
 self.group_id;
 self.curr_recipient;
 self.socket;
 self.last_message_object = {
  msgs_count: 0,
  global: 0
 };
 self.randId = Math.floor(Math.random() * 2);
 self.svgi = vy_ms_svgi;
 self.count_minus = false;
 self.minus_count_message = false;
 self.msg_cannot_send = false;
 self.msg_with_preview;
 self.prev_messages_btn = '<div class="messenger_older_msg_div"><a rel="li-gliph-color-border" class="messenger_older_msg_a ellip" href="javascript:void(0);" uid="mdialog_prev_btn_ld" id="id-prev-comm-link-w-msg-chat"><span class="txt-msg-old-load-g ellip" rel="gliph-mess-color">' + lang.pm_load_old + '</span><span class="txt-msg-old-load">' + lang.please_wait + '...</span></a></div>';
 self.flying_new_message_markup = '<div m-count="%count" data-chatid="%chatid" id="flying-notif-new-messages">+%count&nbsp;' + lang.new_messages + '</div>';
 self.timeout_typing = function(){};
 self.chatBoxes = new Array();
 self.chat_tab_closed = new Array();
 self.nonFitChatBoxes = new Array();
 self.beforeOpenContact_valid = new Array();
 self.nonfitcount_new_msg = {};
 self.saveUserData = {};
 self.user_privacy = {};
 self.user_not_found = {};
 self.conv_status = {};
 self.privacy_msg = {};

 // get language
 /*if(!__j('#mess_language').length){
    
    var send = jAjax(self.ajax_url, 'post','cmd=getlang');
    send.done(function(data){
        
        __j('body').prepend('<script id="mess_language">lang = '+data+';</script>');
        
    });
    
    
 }
 */


  this.getChatMarkup = function(u_id, u_fullname, u_photo, room_id, page_id, group_id, focused, blinking, minimized) {
   var mshortcut = page_id ? 'mshortcut-' + u_id + '_' + page_id : ( group_id ? 'mshortcut-GG' + group_id : 'mshortcut-' + u_id);
   var page_uid = page_id ? u_id + '_' + page_id : (group_id ? 'GG'+group_id : u_id);






   return '<section class="messenger-shortcut-container '+(group_id ? 'js__groupchat js_groupchat_id_'+group_id : '')+' ' + (page_id ? 'js_chat_with_page__' + u_id + ' js_chat_with_page_' + page_id : '') + ' mmmm_c_m ' + (minimized ? '_min' : '') + ' ' + (blinking ? '__blinking' : '') + ' ' + (focused ? '_focus' : '') + '" id="' + mshortcut + '">\
                        <section class="js_mess_hidden_data">\
                        <input type="hidden" id="last-message-datetime" />\
                        <input type="hidden" id="chat-curr-color" />\
            <input type="hidden" id="chat-curr-theme" />\
                        <input type="hidden" id="upload_room_id" />\
                        <input type="hidden" id="is_chat_with_page" value="none"/>\
                        <input type="hidden" id="vy_ms__is_group_chat" value="none"/>\
                        <input type="hidden" id="messenger_page_admin" value="no" />\
                        <input type="hidden" id="messenger_group_nickname" value="" />\
                        <input type="hidden" id="current_page" value="1" />\
                        <input type="hidden" class="ufullname' + room_id + '" value="' + u_fullname + '"/>\
                        <img class="js__group_avatar __none" />\
                        <img id="inphd_page_avatar" class="__none" />\
                        </section>\
                        <div class="messenger-shortcut" id="room_' + room_id + '">\
                        <div class="messenger-shortcut-header" onclick="messenger_shortcut.toggleChatBoxGrowth(\'' + mshortcut + '\',event);">\
                            <div onclick="return messenger_shortcut.option_dropdown(event,this,\'' + mshortcut + '\',\''+encodeURIComponent(u_fullname)+'\','+u_id+','+group_id+','+page_id+');" class="vy_ms__shortcutsettings_dropdown js__shortcuttg_dropdown"><div class="mshortcut-u-avatar messenger-shortcut-sortable"><img onerror="this.setAttribute(\'src\',\'' + V_HOST + '/' + u_photo + '\')" src="' + u_photo + '" /></div>\
                            <div class="mshortcut-u-name ellip"><span title="' + u_fullname + '" class="mshortcut-u-name-str ellip">' + u_fullname + '</span>'+ ( group_id ? '<div class="mshortcut-u-last-active js__group_chat_stats" id="groupchat_header_stats_'+room_id+'"><div class="__none js__group_chat_typing"><div class="vy__js__typingingroup"><span class="js__groupstyping_markup"></span> <span class="vy__js__typing_group_usernames"></span></div></div><div class="js__group_chat_stats-inner"><span id="groupchat_total_members_'+group_id+'" class="groupchat_total_members js__groupchat_total_members"></span>&nbsp;<span id="groupchat_online_members_'+group_id+'" class="groupchat_online_memebers js__groupchat_online_memebers"></span></div></div>' : '<span class="mshortcut-u-last-active js_vytimeago_uon_'+u_id+' global_user_online global_user_online_' + u_id + '"></span>')+'</div>\
                            <div class="vy_ms__dropdown_shortcut_ic"><div id="shortcut-group-chkadmin" class="__none"><div class="div-loader"></div></div><svg class="vy_ms__shortcutdropupsvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 255 255" style="enable-background:new 0 0 255 255;" xml:space="preserve"><polygon points="0,191.25 127.5,63.75 255,191.25   "/></svg><svg class="vy_ms__shortcutdropdownsvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="255px" height="255px" viewBox="0 0 255 255" style="enable-background:new 0 0 255 255;" xml:space="preserve"><g><g id="arrow-drop-down"><polygon points="0,63.75 127.5,191.25 255,63.75"></polygon></g></g></svg></div>\
                            </div>\
                            <div class="mshortcut-top-count"></div>\
                            <div class="mshortcut-header-ul" id="messenger_aria_options_chat">\
                                <ul class="_32ca">\
                                ' + (group_id || page_id? '' : '<li  class="_3a61 _461b"><div><a id="start-audio-chat" title="' + lang.Messenger_call_audio + '" rel="tipsy" onclick="vy_msn_calls.makeCall(event,\'audio\',\'' + u_id + '\');" class="_3olv enabled" href="javascript:void(0);"><svg class="svgIcon" height="16px" width="16px" version="1.1" viewBox="0 0 16 16" x="0px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" y="0px"><path d="M8.8,11.6c0.1,0,0.1,0.1,0.2,0.1c0.4,0.2,0.8,0.1,1-0.3c0.1-0.2,0.2-0.4,0.3-0.6c0.2-0.2,0.5-0.6,0.8-0.7 C11.5,10,11.8,10,12,10c0.4,0,0.9,0.4,1.6,0.8c0.7,0.4,1.2,0.8,1.5,1c0.2,0.2,0.3,0.4,0.3,0.6c0,0.4,0,1.2-0.7,1.9 c-1,1.1-2.5,1.6-4.3,1c-1.8-0.6-4.1-1.7-6-3.7s-3.1-4.2-3.7-6s-0.2-3.3,1-4.3c0.7-0.6,1.4-0.7,1.9-0.7c0.2,0,0.5,0.1,0.6,0.3 c0.2,0.3,0.6,0.8,1,1.5C5.7,3.1,6,3.6,6,4c0,0.3,0,0.6-0.1,0.8C5.8,5.1,5.5,5.4,5.2,5.6C5,5.8,4.8,5.9,4.7,6C4.3,6.1,4.1,6.6,4.3,7 c0,0.1,0.1,0.1,0.1,0.2C5.5,9,7,10.5,8.8,11.6z" style="fill: rgb(190, 194, 201); stroke: rgb(190, 194, 201);"></path></svg></a></div></li>\
                                <li  class="_3a61 _461a"><div><a id="start-video-chat" title="' + lang.Messenger_call_video + '" rel="tipsy" onclick="vy_msn_calls.makeCall(event,\'video\',\'' + u_id + '\');" class="_3olv enabled" href="javascript:void(0);"><svg class="svgIcon" height="16px" width="16px" version="1.1" viewBox="0 0 16 16" x="0px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" y="0px"><path d="M9.5,13.5h-7c-1.1,0-2-0.9-2-2v-7c0-1.1,0.9-2,2-2h7c1.1,0,2,0.9,2,2v7C11.5,12.6,10.6,13.5,9.5,13.5z" style="fill: rgb(190, 194, 201); stroke: rgb(190, 194, 201);"></path><line stroke="none" x1="13.5" x2="13.5" y1="5" y2="11"></line><path d="M15,3.6l-3.5,3V8v1.4l3.5,3c0.2,0.2,0.5,0,0.5-0.3V8V3.9C15.5,3.6,15.2,3.4,15,3.6z" style="fill: rgb(190, 194, 201); stroke: rgb(190, 194, 201);"></path></svg></a></div></li>') +
                                '<li onclick="messenger_shortcut.toggleChatBoxGrowth(\'' + mshortcut + '\',event);" class="_3a61 _461_"><div class=" _3olv"><svg width="25" height="25" viewBox="-4 -4 24 24"><line stroke="#bec2c9" stroke-linecap="round" stroke-width="2" x1="2" x2="14" y1="8" y2="8"></line></svg></div></li>\
                                </ul>\
                            <div class="mshortcut-close"><a  rel="tipsy" onclick="messenger_shortcut.close(this,event,\'' + mshortcut + '\');" href="javascript:void(0)" class=""><svg height="26px" width="26px" viewBox="-4 -4 24 24"><line stroke="#bec2c9" stroke-linecap="round" stroke-width="2" x1="2" x2="14" y1="2" y2="14"></line><line stroke="#bec2c9" stroke-linecap="round" stroke-width="2" x1="2" x2="14" y1="14" y2="2"></line></svg></a></div>\
                        </div></div>\
                        <div data-template="messenger-top" class="chat_cnt"><div id="mshortcut_theme_apply_'+tonum(mshortcut)+'" class="ywvji4ppi"></div><div id="mshortcut_cnt_'+tonum(mshortcut)+'" class="messenger-shortcut-cnt"><div class="messenger-shortcut-messages" id="messenger-shortcut-messages-tr"><div class="div-loader _msescenter"></div></div><div class="vymsn_smart_replies" id="vymsn_smart_replied_cnt"></div>    </div>\
                        <div class="messenger-shortcut-footer">\
                        <div id="messenger-link-preview"></div>\
                        <div class="js_media_gifs"></div>\
                        <div class="js_media_stickers"></div>\
                        <div class="messenger-shortcut-footer-mediafiles">\
                        <div id="tchat_' + page_uid + '" class="jb_attached_files _tchat"></div>\
                        </div>\
                        <div class="flex-shortcut-bottom-emojis"><textarea class="js-shortcut-contenteditable" id="messenger-shortcut-send-contenteditable-' + room_id + '"></textarea>\
                        <div class="mess-shortcut-bottom-media-btns"><div class="mess-nopointer"></div>' + messenger.get_bottom_mess_buttons(20, u_id, page_id, group_id) + '</div>\
                        </div></div>\
                        </div></div>\
                        </section>';

  },
  this.fitChatBoxes = function() {
 
   var k = self.chatBoxes.length;
   while (k--) {


    var element = __j('#' + self.chatBoxes[k]);


    var is_not_in_viewport = self.isOutOfViewport(element);



    if (is_not_in_viewport.left) {


     if (self.nonFitChatBoxes.indexOf(self.chatBoxes[k]) <= -1)
      self.nonFitChatBoxes.push(self.chatBoxes[k]);



    }



   }


   self.addToNonFit();
  },
  this.showNonFitBoxes = function() {

   $.each(self.chatBoxes, function(a) {



    var box = __j("#" + self.chatBoxes[a]);

    //setTimeout(function(){

    if (!box.hasClass('__none') && box.hasClass('__nofit')) {



     box.removeClass('_slideDown').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
      box.removeClass('__nofit');
     });



    }

    //},1000);



   });
   //self.fitChatBoxes();

  },
  this.hideNonFitBoxes = function() {


   $.each(self.chatBoxes, function(a) {



    var box = __j("#" + self.chatBoxes[a]);
    if (!box.hasClass('__none')) {


     setTimeout(function() {
      var is_not_in_viewport = self.isOutOfViewport(box);
      if (is_not_in_viewport.any) {

       if (typeof self.nonFitChatBoxes != 'undefined' && self.nonFitChatBoxes.indexOf(self.chatBoxes[a]) == -1)
        self.nonFitChatBoxes.push(self.chatBoxes[a]);

       self.addToNonFit();
      }
     }, 1000);

    }


   });



  },
  this.getCountOfCurrentVisibleChats = function() {
   var length = 0;
   $.each(self.chatBoxes, function(a) {

    if (!__j("#" + self.chatBoxes[a]).hasClass('__none') && !__j("#" + self.chatBoxes[a]).hasClass('__nofit'))
     length++;
   });

   return length;
  },
  this.bringBackThis = function(el, evt) {
   var ddw = __j('.uiContextualLayerPositionerFixed');

   ddw.addClass('__noneimportant');
   setTimeout(function() {
    ddw.removeClass('__noneimportant');
   }, 2000);
   self.open(el, evt);
   messenger.nonFitCount();
  },
  this.bringBackNonFitBoxes = function(el, evt) {

   if (self.nonFitChatBoxes.length) {

    var max_shortcut_id = self.nonFitChatBoxes[self.nonFitChatBoxes.length - 1];
 
    __j('#' + max_shortcut_id).removeClass('__nofit');


    self.removeFromNonFit(max_shortcut_id);

    // fit shortcuts again
    self.fitChatBoxes();
   }

  },
  this.close_nonfit_shortcut = function(e, shortcut_id) {
   evstop(e);
   if (self.nonFitChatBoxes.length) {

    self.removeFromNonFit(shortcut_id);
    //self.close(false,e,tonum(shortcut_id));
    __j('#' + shortcut_id).find('.mshortcut-close>a').click();
    // fit shortcuts again
    self.fitChatBoxes();


   }
   messenger.nonFitCount();

  },
  this.fit_contextual_menu = function() {

   var check_for_dropdown_layer = __j('#_1kws').find('.uiContextualLayerAboveRight');
   var is_not_in_viewport = self.isOutOfViewport(check_for_dropdown_layer);
   if (is_not_in_viewport.left) {
    check_for_dropdown_layer.addClass('isout');
   } else {
    check_for_dropdown_layer.removeClass('isout');

   }
  },
  this.addToNonFit = function() {


   var user = '';


   const menu = '<div class="foh-s uiContextualLayerPositioner uiLayer uiContextualLayerPositionerFixed">\
                                <div class="uiContextualLayer uiContextualLayerAboveRight">\
                                    <div class="_54nq _57di _558b _2n_z _54hy" id="js_1on">\
                                        <div class="_54ng">\
                                            <ul id="non-fitchatbox-users" class="_54nf">\
                                                \
                                          </ul>\
                                        </div>\
                                        <div class="_54hx"></div>\
                                    </div>\
                                </div>\
                            </div>';
   const html = '<div id="_1kws" class="_1kws soh-s"><span class="messenger-shortcuts-nonfit-count __none js_messenger-shortcuts-nonfit-count"><span>0</span></span><div class="fbNub _50-v _6cj2 uiPopover _6a _6e"><a href="javascript:void(0);" onmouseout="this.timeout = setTimeout(function(){this.active=false;},2000);" onmouseover="clearTimeout(this.timeout);if(!this.active){messenger_shortcut.fit_contextual_menu();this.active=1;}" role="button" alt="messages" class="_6cj3 _p" id="js_40" aria-controls="js_dh">' + menu + '<i class="_6d4c img sp_1ybu3EHM8wZ sx_5fa526" alt=""></i><i class="_6d4d img sp_1ybu3EHM8wZ sx_714738" alt=""></i></a></div></div>';


   __j('#_1kws').find('#non-fitchatbox-users').empty();

   if (self.nonFitChatBoxes.length) {


    $.each(self.nonFitChatBoxes, function(i) {

     var chat = self.nonFitChatBoxes[i];
     var box = __j('#' + chat);
     var user_fullname = self.saveUserData[chat].fullname;
     var user_id = self.saveUserData[chat].id;
     var user_avatar = self.saveUserData[chat].photo;
     var page_id = typeof self.saveUserData[chat].page_id != "undefined" && self.saveUserData[chat].page_id > 0 ? self.saveUserData[chat].page_id : false;
     var group_id = typeof self.saveUserData[chat].group != "undefined" && self.saveUserData[chat].group > 0 ? self.saveUserData[chat].group : 0;
     var nonfit_id = group_id > 0 ? 'GG'+group_id : (user_id + (page_id ? '_' + page_id : ''));
     var saved_count = self.nonfitcount_new_msg.hasOwnProperty(nonfit_id) ? self.nonfitcount_new_msg[nonfit_id] : '';

     self.unfocusRespectiveShortcut(nonfit_id);


     user += '<li class="_54ni __MenuItem js_messenger_nonfit_count_calc" id="nonfit-' + nonfit_id + '" role="presentation"><a class="_54nc" href="javascript:void(0);" onclick="messenger_shortcut.bringBackThis(this,event);" data-uch=\'{"id":"' + user_id + '","fullname":"' + user_fullname + '","photo":"' + user_avatar + '"' + (page_id ? ',"page_id":"' + page_id + '"' : '') + (group_id > 0 ? ',"group":"' + group_id + '"' : '') + '}\' onclick="messenger_shortcut.bringBackNonFitBoxes(chat);" role="menuitemcheckbox"><span><span class="_54nh"><span class="_6cix"><span class="ellip" title="' + user_fullname + '" style="width:72px;">' + user_fullname + '</span><span class="nonfit_new_msg_count js_new_msg_count">' + saved_count + '</span><button onclick="messenger_shortcut.close_nonfit_shortcut(event,\'' + chat + '\');" class="_6cj1 clearfix"><i alt="" class="img sp_uFu3c8C7EiB sx_9690ab"></i></button></span></span></span></a></li>';

     /* This will be added in next updates
     box.addClass('_slideDown').on(self.crossEvent(), function() {
                box.addClass('__nofit').removeClass('_slideDown');
                const right = self.getTabPos() + (self.getCountOfCurrentVisibleChats()*(self.chatboxes_width+self.chatboxes_margin));
                __j('#_1kws').css('right',right);

     });*/

     box.addClass('__nofit');

    });





    if (!__j('#_1kws').length)
     self.vaneayoung.prepend(html);


    __j('#_1kws').find('#non-fitchatbox-users').html(user);

 
  setTimeout(function(){
 
    const right = self.getTabPos() + (self.getCountOfCurrentVisibleChats() * (self.chatboxes_width + self.chatboxes_margin));
    __j('#_1kws').css('right', right);
  },200);
   } else {

    self.vaneayoung.find('#_1kws').remove();
   }

  },
  this.unfocusRespectiveShortcut = function(chat_id) {
   var chat = __j('#mshortcut-' + chat_id);

   chat.removeClass('_focus');
   chat.find('.js-shortcut-contenteditable')[0].emojioneArea.trigger("blur");
   chat.find('[contenteditable]').blur();




  },
  this.crossEvent = function() {

   var t;
   var el = document.createElement('fakeelement');
   var transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
   }
   for (t in transitions) {
    if (el.style[t] !== undefined) {
     return transitions[t];
    }
   }

  },
  this.isOutOfViewport = function(elem) {

   // Special bonus for those using jQuery
   if (typeof jQuery === "function" && elem instanceof jQuery) {
    elem = elem[0];
   }



   // Get element's bounding
   var bounding = elem.getBoundingClientRect();

   // Check if it's out of the viewport on each side
   var out = {};
   out.top = bounding.top < 0;
   out.left = bounding.left < 0;
   out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
   out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
   out.any = out.top || out.left || out.bottom || out.right;
   out.all = out.top && out.left && out.bottom && out.right;

   return out;

  },
  this.setCookie = function(cookie, value, days, page_id) {

   if (!self.page_id)
    createCookie(cookie, value, days);

  },
  this.removeFromNonFit = function(chat_id) {

   const i = self.nonFitChatBoxes.indexOf(chat_id);

   if (i > -1) {
    self.nonFitChatBoxes.splice(i, 1);
   }

   delete self.nonfitcount_new_msg[chat_id];
  },
  this.remove_option_dropdown = function(chat_id){
      __j(document).off('click.closeShortcutDropdown'+chat_id);
      __j('#'+chat_id).find('#ms_shortcut_dropdown_options-'+chat_id).remove();
      __j('#'+chat_id).find('.js__shortcuttg_dropdown').removeClass('__ac');
  },
  this.getDropDownSettingsMarkup = async function(shortcut_id,u_fullname,u_id,group_id,page_id){
      
    var dropdown = {};
    var dropdown2 = {};
    let g_admin = false,
    theme_bg = this.getThemeBg(__j('#'+shortcut_id).find('#chat-curr-theme').val());
    if(page_id)
        dropdown['user_link'] = '<li><a href="/vypage/' + u_id + '" >' + u_fullname + '</a></li>';
    else if(!group_id && !page_id)
        dropdown['user_link'] = '<li><a href="/vyuser/' + u_id + '" >' + u_fullname + '</a></li>';
    
    if(group_id)
        dropdown['switch_to_messenger'] = '<li><a href="/messenger/g/' + group_id + '">' + self.svgi.brand_icon.replace('%sh','mshortcut') + lang.Messenger_shortcut_view_in_messenger + '</a></li>';
    
    if(page_id)
        dropdown['switch_to_messenger'] = '<li><a href="/messenger/' + u_id + '/' + page_id  + '">'  + self.svgi.brand_icon.replace('%sh','mshortcut') + lang.Messenger_shortcut_view_in_messenger + '</a></li>';
    
    if(!group_id && !page_id)
        dropdown['switch_to_messenger'] = '<li><a href="/messenger/' + u_id + '">'  + self.svgi.brand_icon.replace('%sh','mshortcut') + lang.Messenger_shortcut_view_in_messenger + '</a></li>';
    
    if(group_id > 0)
        dropdown['set_nickname'] = '<li><a href="javascript:void(0);" onclick="evstop(event,1);mess_shortcut(\'' + shortcut_id + '\').setNicknames(' + u_id + ',\'' + encodeURIComponent(u_fullname) + '\','+group_id+');"><span class="ic-edit-nicknames"></span>' + lang.messenger_edit_nicknames + '</a></li>';
    
    if(page_id <= 0 && group_id <= 0)
        dropdown['set_nickname'] = '<li><a href="javascript:void(0);" onclick="evstop(event,1);mess_shortcut(\'' + shortcut_id + '\').setNicknames(' + u_id + ',\'' + encodeURIComponent(u_fullname) + '\');"><span class="ic-edit-nicknames"></span>' + lang.messenger_edit_nicknames + '</a></li>';

    if(!page_id){
        if(group_id > 0)
            dropdown['notifications'] = '<li><a href="javascript:void(0);" onclick="evstop(event,1);mess_shortcut(\'' + shortcut_id + '\').muteContact(' + u_id + ','+group_id+');"><span class="ms-shortcut-notifsvg '+(messenger.getMuteStatus(u_id,group_id) ? '_shortcut_muted' : '')+'">'+ messenger.default_md_ic(u_id,group_id) +'</span>'+ lang.Messenger_Notifications + '</a></li>';
        else
            dropdown['notifications'] = '<li><a href="javascript:void(0);" onclick="evstop(event,1);mess_shortcut(\'' + shortcut_id + '\').muteContact(' + u_id + ');"><span class="ms-shortcut-notifsvg '+(messenger.getMuteStatus(u_id,group_id) ? '_shortcut_muted' : '')+'">'+ messenger.default_md_ic(u_id) +'</span>'+ lang.Messenger_Notifications + '</a></li>';
    }
    
    if(group_id > 0) {
        __j('#'+shortcut_id).find('#shortcut-group-chkadmin').removeClass('__none');
        let send = jAjax(self.ajax_url,'post',{'cmd':'check-group-admin','group':escape(group_id)});
        await send.done(function(is_admin){
            let admin_panel = messenger.getGroupAdminMarkup(group_id);
            if(is_admin == "1"){
                for(var x in admin_panel)
                 dropdown2[x] = admin_panel[x];
            
            g_admin = true;
            }
            __j('#'+shortcut_id).find('#shortcut-group-chkadmin').addClass('__none');
        });
        
        
        
    } 
 
    if( (group_id <= 0 || (group_id > 0 && g_admin) ) && page_id <= 0)
        dropdown['change_color'] = '<li><a href="javascript:void(0);" onclick="evstop(event,1);mess_shortcut(\'' + shortcut_id + '\').change_theme(' + u_id + ','+ group_id +');"><span style="background-image:url('+theme_bg+');background-repeat: no-repeat;background-position: center;background-size: cover;" class="ic-edit-colors"></span>' + lang.Messenger_change_conv_theme + '</a></li>';
    
 
    return {'user_dropdown': dropdown,'admin_dropdown': dropdown2};
      
  },
  this.getThemeBg = function(theme){
    return `${vy_msn_path}/themes/${theme}/bg.jpg`;
  },
  this.option_dropdown = async function(ev,el,shortcut_id,u_fullname,u_id,group_id,page_id){
    ev.stopPropagation();
    el = __j(el);
    u_fullname = decodeURIComponent(u_fullname);
    let s = __j('#'+shortcut_id);
    
    if(s.hasClass('_min'))
        return self.toggleChatBoxGrowth(shortcut_id,ev);

    if(!s.find('#ms_shortcut_dropdown_options-'+shortcut_id).length){
        let dropdown = await self.getDropDownSettingsMarkup(shortcut_id,u_fullname,u_id,group_id,page_id);
        let u_dropdown = '';
        let a_dropdown = '';
        let h = '';
        
        for(i in dropdown['user_dropdown'])
            u_dropdown += dropdown['user_dropdown'][i];
        
        if(Object.keys(dropdown['admin_dropdown']).length){
            
        for(i in dropdown['admin_dropdown'])
            a_dropdown += dropdown['admin_dropdown'][i];
        }
            
        if(a_dropdown != '')
            a_dropdown = '<li><div class="vy_ms__dropdown_separator"></div></li>'+a_dropdown;
        
        h = u_dropdown+a_dropdown;
        
        s.find('.js__shortcuttg_dropdown').prepend('<div id="ms_shortcut_dropdown_options-'+shortcut_id+'" class="mess-shortcut-dropdown-settings"><ul>'+h+'</ul></div>');
        
        el.addClass('__ac');
        let color = s.find('#chat-curr-color').val();
        mess_shortcut(shortcut_id).colorateStrokes(color, shortcut_id);
        
        __j(document).on('click.closeShortcutDropdown'+shortcut_id, 'body,html,.chat_cnt', function(e){
            evstop(e,1);
            self.remove_option_dropdown(shortcut_id);
        });
        
    } else 
            self.remove_option_dropdown(shortcut_id);
  
  },
  this.beforeOpenContact = function(el, evt, is_session, blink, page_id, group_id, u_id) {

   // check user privacy
   if (page_id <= 0)
    self.checkUserPrivacy(u_id, function(d) {


     switch (d.status) {

      case 404:
       self.user_not_found[u_id] = 1;
       break;

      case 403:
       self.user_privacy[u_id] = d.privacy;

       break;



     }

     self.beforeOpenContact_valid[u_id] = 1;
     self.privacy_msg[u_id] = d.msg;
     self.conv_status[u_id] = d.status;
     self.open(el, evt, is_session, blink);


    });
   else
    self.open(el, evt, is_session, blink);
  },
  this.checkUserPrivacy = function(uid, callback) {

   var send = jAjax(self.ajax_url, 'post', {
    'cmd': 'check_privacy',
    'id': escape(uid)
   });
   send.done(function(data) {

    var d = validateJson(data);
    callback(d);


   });
  },
  this.open = async function(el, evt, is_session, blink, callback) {


   if (__j('.wo_kb_msg_page').length) return;

   if (__j(window).width() + 15 <= 766)
    return __j('html').addClass('vy-shortcut-hidden');
   else
    __j('html').removeClass('vy-shortcut-hidden');



   self.removeAllChatFocusClass();



   if (!is_session) {

    evt.preventDefault();
    el = __j(el);
    var uch = el.data('uch');

   } else
    var uch = is_session;


   var u_data = uch;
   var u_id = u_data.id;
   var u_fullname = u_data.fullname;
   var u_photo = u_data.photo;
   var page_id = typeof u_data.page_id != "undefined" && u_data.page_id > 0 ? u_data.page_id : false;
   var page_avatar = page_id ? u_data.page_avatar : _BLANK;
   var markup_focused = is_session ? false : true;
   var group_id = typeof u_data.group != "undefined" && u_data.group > 0 ? u_data.group : false;
   var chat_id = page_id ? 'mshortcut-' + u_id + '_' + page_id : ( group_id ? 'mshortcut-GG' + group_id : 'mshortcut-' + u_id);

 
   if (!self.beforeOpenContact_valid[u_id] && page_id <= 0 && group_id <= 0 )
    return self.beforeOpenContact(el, evt, is_session, blink, page_id, group_id, u_id);


    // get user online status 
    if( (page_id <=0 || !page_id) && (group_id <=0 || !group_id))
        mess_shortcut(chat_id).getUserActiveStatus(u_id);

   // get new room id'
   self.room_id = generateRoomId(u_id, _U.i, page_id, group_id);
   self.page_id = page_id;
   self.group_id = group_id;
   self.curr_recipient = u_id;

   self.socket = sio;
   
   let _room_id = self.room_id;


   messenger.room_id = self.room_id;
   messenger.curr_recipient = self.curr_recipient;
   messenger.shortcut_id = self.curr_recipient;
   messenger.shortcut_id_num = self.curr_recipient;
   messenger.recipient_user_id = u_id;

   if(page_id <= 0 && group_id <= 0)
        updateSessionContacts(u_id);
    
    if(group_id > 0)
        updateSessionGroups(group_id);

   // join to group 
 //  if(group_id > 0)
    //   self.socket.emit("vy_ms__joingroup", JSON.stringify({'Room_id': socketId(self.room_id), 'Userid': socketId(_U.i)}));


   // remove from minimized cookie
   if (!is_session)
    self.removeShortcutFromMiniCookie(chat_id);

   self.saveUserData[chat_id] = u_data;
   self.removeFromNonFit(chat_id);
   const index = self.chat_tab_closed.indexOf(chat_id);

   if (index !== -1) {
    self.chat_tab_closed.splice(index, 1);
   }


   if (__j("#" + chat_id).length > 0) {

    if (__j("#" + chat_id).hasClass('__none')) {
    
 
        self.chatBoxes.push(chat_id);
        self.setCookie('chat_session', self.chatBoxes, 1);
 

     //self.focusChatTab(chat_id);
     setTimeout(function() {
      self.restructureChatTabs();
     }, 500);

    } else if (__j('#' + chat_id).hasClass('_min')) {

     self.toggleChatBoxGrowth(chat_id,evt);

    }
    if (!is_session) {
     const b_index = self.chatBoxes.indexOf(chat_id);


     self.chatBoxes.splice(b_index, 1);
     self.chatBoxes.push(chat_id);
     self.focusChatTab(chat_id);
     self.restructureChatTabs();


    }

 
    return;
   }

 


   if (self.chatBoxes.indexOf(chat_id) == -1) {

    var chatTabslength = 0;
    var chat_position_calc = self.getTabPos(chat_id);
    var mnChatBoxes = new Array();
    var $markup;






    if (is_session && readCookie('chattab_minimized'))
     mnChatBoxes = readCookie('chattab_minimized').split(/\|/);



    $markup = self.getChatMarkup(u_id, u_fullname, u_photo, self.room_id, page_id, group_id, markup_focused, blink, (mnChatBoxes.indexOf(chat_id) > -1 ? 1 : 0));

    if (!__j('body').find('#vaneayoung-chat-boxes').length) {

     __j('body').append('<div id="vaneayoung-chat-boxes"></div>');
     self.vaneayoung = __j('#vaneayoung-chat-boxes');

    }


    self.vaneayoung.append($markup);
    
 
   // for pages
   if(page_id > 0){
       __j("#" + chat_id).find('#is_chat_with_page').val(page_id);
        __j("#" + chat_id).find('#inphd_page_avatar').attr('src',u_photo);
   }
   
    // for groups
   __j("#" + chat_id).find('#vy_ms__is_group_chat').val('GG' + group_id);
 
    __j("#" + chat_id).find('#upload_room_id').val('room_' + self.room_id);
    
    if(group_id > 0)
        __j("#" + chat_id).find('.js__group_avatar').attr('src', u_photo).attr('id', 'vy_shortcut_group_id_'+chat_id.split('GG')[1]);

    var a = self.chatBoxes.length;
    while (a--) {
     if (!__j("#" + self.chatBoxes[a]).hasClass('__none'))
      chatTabslength++;



     if (self.chatBoxes[a] != chat_id) {


      var posleft = chat_position_calc + (chatTabslength * (self.chatboxes_width + self.chatboxes_margin));
      __j('#' + self.chatBoxes[a]).css('right', posleft + 'px');

     }


    }

    __j('#' + chat_id).css('right', chat_position_calc + 'px');

    self.chatBoxes.push(chat_id);



    self.setCookie('chat_session', self.chatBoxes, 1);
    const no_update = is_session ? 'yes' : 'no';
   var send_data = {
    'cmd': 'getConversation',
    'no_update': no_update,
    'userid': escape(u_id)
   };

   if (page_id)
    send_data['page'] = page_id;

   if (group_id)
    send_data['group'] = group_id;

 
   
    var send = await jAjax(self.ajax_url, 'post', send_data, false, 'ms-conv-' + u_id, 'conversation:/messenger/'+chat_id);

    if (send.hasOwnProperty('localcache')) {
        var _d = send.data;
    } else {
        var _d = send;
    }
                
                
  const getMessages = function(_d) {
 
   var group_avatar = '';
   var nickname;
 

    var last_message_id;
 

    var messenger_msg_list = __j('#' + chat_id + ' #messenger-shortcut-messages-tr');

    var d = validateJson(_d);
    var text = '';

    __j("#"+ chat_id).find('#messenger_page_admin').val(d.page_admin);
    if ($.trim(d.nickname)) {

     
     nickname = d.nickname;
     
     __j('#'+chat_id).find('#messenger_group_nickname').val(nickname);
    }

    

    if (d.count <= 0) {

     messenger_msg_list.html('<div class="nano"><div class="nano-content"><div class="messenger-no-messages"><div class="messenger-exp">' + d.exp + '</div><div class="messenger-sub">' + d.sub + '</div></div></div></div>');

    } else if (d.count > 0) {


     var author_last_msg,last_avatar;
     var avatar = true;
     var last_date;
     var last_msg_author = 0;
     
     
    var seen_markup = '<div style="color:%color;" title="' + lang.mess_msg_seen + '" rel="tipsy" id="mess_sent_status" class="messenger_sent_Status mess-message-seen"><img src="'+d.recipient_avatar+'" /></div>';
                
    var sent_markup = '<div title="' + lang.mess_sent_status + '" rel="tipsy" id="mess_sent_status" class="messenger_sent_Status"><i class="glyphicon messenger-sent-ic glyphicon-ok-sign" style="color:%color;" ></i></div>';
 
      group_avatar = d.recipient_avatar;
     var have_unread_messages;
     for (var i = 0; i < d.messages.length; i++) {

      var msg = d.messages[i];

      if (author_last_msg != msg.from_id)
       avatar = true;
      else
       avatar = false;


      messenger.recipient_picture = msg.user_avatar;
      var l_dat = __j('#' + chat_id + ' .messenger_date_delim:first').text();
      var hj = l_dat == msg.dateMonth ? true : false;


      var $show_date = author_last_msg == msg.lastby && msg.date == last_date ? false : true;
      $show_date = msg.date != last_date && !hj && $show_date ? true : false;
                        let show_conv_date = $show_date ? '<div id="messenger_date_delim_' + msg.dateMonth + '" class="messenger_date_delim"><span>' + msg.dateMonth + '</span></div>' : '';
                        let show_username = (msg.from_id != author_last_msg && group_id > 0) ? msg.user_fullname : '';
                        let next_msg_from_id = typeof d.messages[i + 1] != 'undefined' ? d.messages[i + 1].from_id : 0;
                        let margin_for_groups = msg.from_id != author_last_msg && next_msg_from_id != _U.i && author_last_msg != _U.i ? 'vy_ms__group_msg_margin' : '';
                        let curr_avatar = (msg.from_id == _U.i ? '' : '<div class="sticky__txt_pmessenger-user-avatar"><img src="' + msg.user_avatar + '" /></div>');
                         
      text += show_conv_date + (msg.from_id != author_last_msg ? '<div data-group-id="' + msg.from_id + '" class="vy_ms__groupusermsgs ' + margin_for_groups + ' ' + (msg.from_id == _U.i ? 'me' : '') + '">' + curr_avatar : '') + mess_shortcut(chat_id).getMessagesMarkup(msg, (msg.from_id == _U.i ? 'me' : ''), avatar, $show_date, msg.timestamp, show_username)+ (next_msg_from_id != msg.from_id || next_msg_from_id == 0 ? '</div>' : '');;

      author_last_msg = msg.from_id;
      last_avatar = (msg.from_id == _U.i ? 'me' : '');
      last_date = msg.date;
      have_unread_messages = msg.read == 'yes' ? false : true;

      
     }




     if (have_unread_messages)
      messenger_msg_list.closest('section').addClass('_h_unread');

     messenger_msg_list.closest('section').find('#last-message-datetime').val(last_date);

     var show_load_prev_btn = d.count_messages >= messenger_limit ? self.prev_messages_btn : '';
     messenger_msg_list.html('<div class="nano"><div class="nano-content"><div id="messenger-nano-content-fullheight">' + show_load_prev_btn + text + '</div></div></div>');
     
     // show the user icon to the last readed message
     messenger_msg_list.find('.vyms__isread__yes:last').append(seen_markup.replace(/%color/g, __j('#mess-curr-color').val()));
     messenger_msg_list.find('.vyms__isread__no').append(sent_markup.replace(/%color/g, __j('#mess-curr-color').val()));
     

     messenger_msg_list.find('#id-prev-comm-link-w-msg-chat').on('click', function(e) {

      mess_shortcut(chat_id).mdialog_load_prev_messages(e, this);

     });
 

     mess_shortcut(chat_id).startvenobox();

   
    mess_shortcut(chat_id).lazyLoad();
    mess_shortcut(chat_id).enable_reactions();


     var check_for_last_msg = messenger_msg_list.find('.pmessenger-message-txt:not(._me):last');
     last_message_id = check_for_last_msg.length ? check_for_last_msg.attr('id').match(/\d/g).join('') : 0;
     setTimeout(function() {
      self.scrollChat(chat_id, 'init');
     }, 1000);
     
    __j('#online_'+u_id).find('.new-message-alert').addClass('hidden').empty();
     messenger_msg_list.closest('section').find('#last-message-datetime').val(last_date);
    mess_shortcut(chat_id).updateMessagesAsRead(tonum(chat_id));
    setTimeout(function(){  gwtlog.checkDinCindinCind();},1500);
    if(group_id > 0){
 
                    self.socket.emit("group_seen", JSON.stringify({
                        "Msg_id": last_message_id,
                        "Userid": socketId(u_id),
                        "Recipient_id": _U.i,
                        "Group_id": group_id,
                        "Group":socketId('GG'+group_id),
                        "Page_id": 0,
                        "Recipient_avatar": _U.p,
                        "Group_avatar": encodeURIComponent(group_avatar)
                    }));
    }

    }

    // set nickname 
    if (nickname) __j('#' + chat_id).find('.mshortcut-u-name-str>a').text(nickname);

    // get color 
    self.getChatColors(u_id, chat_id, page_id, group_id);




    if (d.blacklist === 1) {

     mess_shortcut(chat_id).isInBlackList();

    }

    if (self.user_not_found[u_id] || (self.user_privacy[u_id] > 0 && self.conv_status[u_id] != 200)) {

     self.msg_cannot_send = 1;
     return self.privacy_html(self.privacy_msg[u_id], chat_id);

    }

 





  };
    // get messages
    setTimeout(function() {
    _ms_Cache.set('conversation:/messenger/' + chat_id, _d, getMessages);
    }, 10);
 

    self.text_val = __j('#messenger-shortcut-send-contenteditable-' + _room_id).emojioneArea({
     autoHideFilters: true, //saveEmojisAs:"shortname"
     searchPosition: "bottom",
     searchPlaceholder: lang.search,

     autocomplete: false,
     search: true,
     hidePickerOnBlur: true,
 
     textcomplete: {
      maxCount: 15,
      placement: "absleft"
     },
     attributes: {
      dir: "ltr",
      spellcheck: false,
      autocomplete: "on",
      autocorrect: "on",
      autocapitalize: self.hasTouchStartEvent ? "on" : "off",
     },
     events: {
      ready: function(button, event) {
        
        if(typeof callback == 'function')
            callback(1);

       self.contenteditable = __j('#' + chat_id).find('[contenteditable]');
       self.contenteditable.attr('placeholder', lang.pm_emoji_placeholder + '...');

       __j('#' + chat_id).find('.ms_items_more_wrap').addClass('__none');
       __j('#' + chat_id).find('.comments_attach_trigger_ic').click();


       _act_emoji = 'messages';
       
       self.timeoutFunction = function() {
        let nickname = __j('#'+chat_id).find('#messenger_group_nickname').val();
        self.typing_now = 0;
        
        if(group_id > 0)
            self.socket.emit("vy_ms__groups_typing", JSON.stringify({'Typing':'no','Recipient_fn': $.trim(nickname) ? nickname : VY_USER_FN, 'Room': self.room_id, 'Recipient': _U.i, 'Group': socketId(self.room_id)}));
        else
            self.socket.emit("typing", JSON.stringify({'Typing':'no', 'Room':self.room_id, 'Page_id':page_id, 'Recipient': page_id > 0 ? _U.i+'_'+page_id : _U.i, 'Userid': socketId(self.curr_recipient)}));
 
       }



       var pageid_object = {};
       pageid_object.page_id = page_id;
       pageid_object.userid = u_id;

       // send message by pressing ENTER key
       self.contenteditable.off('keydown.tchatsend').on('keydown.tchatsend', function(e) {
        evstop(e);

        const contains_preview = self.msg_with_preview && typeof self.msg_with_preview == 'object' && typeof self.msg_with_preview.id != 'undefined' && typeof self.msg_with_preview.msg != 'undefined' && self.msg_with_preview.shortcut_id == chat_id ? {
         preview: self.msg_with_preview
        } : false;
        if (e.keyCode == 13 && e.shiftKey == 0) return page_id ? mess_shortcut(chat_id, false, contains_preview).send(false, e, false, u_id, page_id) : (group_id ? mess_shortcut(chat_id, false, contains_preview).send(false, e, false, u_id, page_id, group_id) : mess_shortcut(chat_id, false, contains_preview).send(false, e) );


       }).on('paste.pasteInChat', function(ev) {
        evstop(ev);
        mess_shortcut(chat_id).pasteMessages(this, ev, pageid_object, group_id);

       });
       
       // typing on keyboard
       self.contenteditable.off('keypress.mess_typing').on('keypress.mess_typing', function(e) {
            evstop(e);
            
            if(self.typing_now) return;
            let nickname = __j('#'+chat_id).find('#messenger_group_nickname').val();  
            clearTimeout(self.timeout_typing);
            if(group_id > 0)
                    self.socket.emit("vy_ms__groups_typing", JSON.stringify({'Typing':'yes', 'Room': self.room_id, 'Recipient_fn': $.trim(nickname) ? nickname : VY_USER_FN, 'Recipient': _U.i, 'Group': socketId(self.room_id)}));
                else
                    self.socket.emit("typing", JSON.stringify({'Typing':'yes', 'Page_id':page_id, 'Room':self.room_id, 'Recipient': page_id > 0 ? _U.i+'_'+page_id : _U.i, 'Userid': socketId(self.curr_recipient)}));
     
            self.typing_now = 1;

            
       });
        self.contenteditable.off('keyup.mess_typing').on('keyup.mess_typing', function(e) {
            clearTimeout(self.timeout_typing);
            self.timeout_typing = setTimeout(self.timeoutFunction, 1200);
        });





      },
      click: function(editor, event) {
       __j(event.target).closest('.messenger-shortcut').find('.js-shortcut-contenteditable')[0].emojioneArea.hidePicker();
      }
     }
    });
    /*
        self.vaneayoung.sortable({items: ".messenger-shortcut-container",handle: ".messenger-shortcut-sortable" });
    */



    // add class focus 
    if (!is_session)
     self.focusChatTab(chat_id);
    else
     self.bindGlobalEvents();


    self.fitChatBoxes();
    
    if(group_id)
        gwtlog.groupChatStats(group_id);

    
    
   } else {

    __j('#' + chat_id).focus();

   }
 



  },
 
  this.bindGlobalEvents = function() {

   self.unFocusTabs();
   setTimeout(function() {
    self.focusTabs();
   }, 1000);

  },
  this.unFocusTabs = function() {
   __j(document).off('click.chattab click.chatTabBlur');
  },
  this.focusTabs = function() {


   // focus chat tab
   __j(document).off('click.chattab').on('click.chattab', '.chat_cnt', function(e) {
    e.stopPropagation();
    self.focusChatTab(__j(this).closest('section').attr('id'), 1);

   });

   __j(document).off('click.chatTabBlur').on('click.chatTabBlur', 'body,html', function(e) {
    //  e.stopPropagation();
    __j('.chat_cnt').each(function() {
     __j(this).closest('section').removeClass('_focus');
    });
   });



  },

  this.privacy_html = function(msg, shortcut) {

   var container = __j('#' + shortcut);

   if (container.find('.blocked_u_no_pm').length == 0) {

    container.find('.messenger-shortcut-footer').prepend('<div class="blocked_u_no_pm">' + msg + '</div>');

   }
   setTimeout(function() {
    container.find('.blocked_u_no_pm').addClass('__up');
   }, 1000);
   container.find('#messenger_aria_options').empty();
   container.find('#messenger_aria_options_chat').empty();
   container.addClass('blacklist');

  },
  this.notificationNewMessage = function(c, chat_id, msg_id, trigger) {
 
   var h_chat_id = tonum(chat_id);
   var group_id = 0;
   var page_obj = {};
   var page_id;
   if (chat_id.includes('_')) {


    page_obj['userid'] = chat_id.split('_')[0];
    page_obj['page_id'] = chat_id.split('_')[1];
    
    h_chat_id = page_obj['userid']+'_'+page_obj['userid'];
   }
   if(chat_id.includes('GG')){
       
       h_chat_id = 'GG'+tonum(chat_id);
       group_id = tonum(chat_id);
       
   }
 
   if (!c) return;
   var nano = __j('#' + chat_id).find(".nano");
   var nano_msg_cnt = nano.find('.nano-content');


   if (!nano_msg_cnt.find('#flying-notif-new-messages').length) {

    nano_msg_cnt.append(self.flying_new_message_markup.replace(/%count/g, c).replace('%chatid',h_chat_id));


   } else {
    nano_msg_cnt.find('#flying-notif-new-messages').replaceWith(self.flying_new_message_markup.replace(/%count/g, c).replace('%chatid',h_chat_id));

   }
     
    if(c > 99) 
        c= "99+";
    
   __j('#' + chat_id).find('.mshortcut-top-count').text(c);
   __j('#' + chat_id).addClass('__blinking').find('#flying-notif-new-messages').off('click.new_msg_flying_chat').on('click.new_msg_flying_chat', function(e) {

    evstop(e,1);
    nanoScrollStart();
    if (!__j(this).hasClass('no-nano-scroll'))
     nano.nanoScroller({
      scroll: 'bottom'
     });


    __j(this).remove();
    __j('#' + chat_id).find('.mshortcut-top-count').empty();
    
    const groupid = __j(this).attr('data-chatid').includes('GG') ? tonum(__j(this).attr('data-chatid')) : 0;

    mess_shortcut(chat_id).updateMessagesAsRead(tonum(chat_id), msg_id, page_obj, groupid);
    self.focusChatTab(chat_id);

    if (self.minus_count_message) global_messenger_count -= 1;
    gwtlog.updateCountMessages(global_messenger_count);

    self.minus_count_message = false;


    __j(window).off('focus.messenger');
   });


   //var nano = __j("#messages-tick .nano");
   var nano_pane = nano_msg_cnt;
   var nano_scrolltop = nano_pane.scrollTop();

   if (nano_scrolltop <= 0 && !self.isMin(chat_id) && !__j('#' + chat_id).hasClass('__nofit')) __j('#' + chat_id).find('#flying-notif-new-messages').addClass('no-nano-scroll').trigger('click.new_msg_flying_chat');
   //   if(c <= 2 && c > 0 && !trigger && !self.isMin(chat_id) && self.isfocus(chat_id)) setTimeout(function(){__j('#'+chat_id).find('#flying-notif-new-messages').trigger('click.new_msg_flying_chat');},300);

   nano.off('scrollend.notifNewMessageBottom_CHAT').on('scrollend.notifNewMessageBottom_CHAT', function() {


    __j('#' + chat_id).find('#flying-notif-new-messages').addClass('no-nano-scroll').trigger('click.new_msg_flying_chat');
    nano.off('scrollend.notifNewMessageBottom_CHAT');


   });

  },
  this.isfocus = function(chatid) {

   return __j('#' + chatid).hasClass('_focus');

  },
  this.isMin = function(chatid) {
   return __j('#' + chatid).hasClass('_min');
  },
  this.pm_sound_enable = function() {
   return 1; //readCookie('dk_pm_sound') === 'on' || !readCookie('dk_pm_sound') ? 1 : 0;
  },
  // sound
  this.turnOnSound = function() {


   if (self.pm_sound_enable() && !__j('.pmessenger').length) {

    // play sound
    messenger.playSound('new_msg');
   }

  },
  this.scrollChat = function(chat_id, read_messages, msgs_count, msg_id) {

   if (__j('.pmessenger').length && __j('#messenger_with_user').val() == tonum(chat_id)) return;


   var page_obj = {};
   var page_id;
   if (chat_id.includes('_')) {


    page_obj['userid'] = chat_id.split('_')[0];
    page_obj['page_id'] = chat_id.split('_')[1];
   }

   var nano = __j('#' + chat_id).find(".nano");
   var nano_pane = nano.find('.nano-content');
   var last_msg = __j('#' + chat_id).find('.pmessenger-message-txt:last');
   var nano_fullheight = __j('#' + chat_id).find('#messenger-nano-content-fullheight');


   nanoScrollStart();

   if (read_messages == 'init') nano.nanoScroller({
    scroll: 'bottom'
   });

   var chat_notif = function(obj, sound, x) {

 
    if (Object.keys(obj).length) {

     self.notificationNewMessage(

      obj.msgs_count,
      obj.userid, 
      obj.msg_id,
      x

     );

     if (sound) setTimeout(function() {
      self.turnOnSound();
     }, 10);
    }



   }
   var shortcutMarkAsUnread = function(c) {

    __j('#' + c).addClass('_h_unread');

   }

   if (!vy_ms__window_tab_active || (!self.isfocus(chat_id) && read_messages != 'init') || self.isMin(chat_id)) {


    if (!msgs_count) return;
    self.minus_count_message = true;
    self.last_message_object = {
     'msg_id': msg_id,
     'msgs_count': msgs_count,
     'userid': chat_id,
     'global': 1
    };




    if (!vy_ms__window_tab_active && !self.isMin(chat_id)) {

     shortcutMarkAsUnread(chat_id);
     mess_shortcut(chat_id).messengerFocusWindow(self.last_message_object);

    } else
     // if chat is open, but is not focused, show notifications
     if (!self.isfocus(chat_id) && !self.isMin(chat_id)) {
      shortcutMarkAsUnread(chat_id);
      chat_notif(self.last_message_object, 1, 1);

     }

    else
     // if chat is minimized, show notifications
     if (self.isMin(chat_id)) {
      shortcutMarkAsUnread(chat_id);
      chat_notif(self.last_message_object, 1, 1);


     }

    return;
   } else {

    __j(window).off("focus.messenger");

   }









   if ((nano_fullheight.height() - nano_pane.scrollTop() - nano.height() >= 350) && (read_messages && read_messages != 'init')) {

    if (msg_id) nano_fullheight.find('#msg_' + msg_id).find('.messenger_text_col').addClass('is_new');
    if (msg_id) self.notificationNewMessage(msgs_count, chat_id, msg_id);

   } else {
    const groupid = chat_id.includes('GG') ? tonum(chat_id) : 0;
    if (msg_id) mess_shortcut(chat_id).updateMessagesAsRead(tonum(chat_id), msg_id, page_obj, groupid);

    setTimeout(function() {

     nanoScrollStart();

     var scroll_evt = 'scrollend.s' + self.randId;
     nano.nanoScroller({
      scroll: 'bottom'
     }).on(scroll_evt, function() {

      mess_shortcut(chat_id).removeNewBubble();
      gl_scrollChatDelay = false;
     });
     nano.trigger(scroll_evt);
 
    }, gl_scrollChatDelay ? gl_scrollChatDelay : 1);



   }
 
   gl_scrollChatDelay = false;

  },
  this.getChatColors = function(uid, chat_id, page_id, group_id) {

   if (page_id) {
    __j('#' + chat_id + '_' + page_id).find('#chat-curr-color').val(chat_default_color);
    return messenger.colorateStrokes(chat_default_color, chat_id);
   }


   // get color
   var send = jAjax(self.ajax_url, 'post', {
    'cmd': 'getChatCurColor',
    'userid': escape(uid),
      'group': escape(group_id)
   });

   send.done(function(data) {
    data = validateJson(data);
    messenger.colorateStrokes(data.color, chat_id);
    messenger.applyTheme(data.theme, chat_id);

    __j('#' + chat_id).find('#chat-curr-color').val(data.color);
    __j('#' + chat_id).find('#chat-curr-theme').val(data.theme);
   });





  },
  // restructure chat tabs
  this.restructureChatTabs = function() {
   var align = 0;
   var newcookie = new Array();

   var chat_position_calc = self.getTabPos();
   var x = self.chatBoxes.length;
   while (x--) {
    var chat_id = self.chatBoxes[x];

    if (!__j("#" + chat_id).hasClass('__none')) {

     if (align == 0) {

      __j("#" + chat_id).css('right', chat_position_calc + 'px');
     } else {
      var posleft = chat_position_calc + (align * (self.chatboxes_width + self.chatboxes_margin));
      __j("#" + chat_id).css('right', posleft + 'px');


     }

     align++;
    }

    newcookie.push(chat_id);



   }
   newcookie.reverse();
   self.setCookie('chat_session', newcookie.join(','), 1);
   self.fitChatBoxes();
  },
  this.close = function(el, evt, chatid) {
   evstop(evt);

   var pageid = 0, group_id = 0;
   if (chatid.includes('_'))
    pageid = chatid.split('_')[1];

    if(chatid.includes('GG'))
        group_id = chatid.split('GG')[1];

 
   //   var chatid = 'mshortcut-'+id;
   const index = self.chatBoxes.indexOf(chatid);
   const contact = my_contacts.indexOf(tonum(chatid));


   if (index !== -1) {
    self.chatBoxes.splice(index, 1);
   }
   if (contact !== -1) {
    my_contacts.splice(contact, 1);
   }
   
   if(group_id)
    var arr_group_chat_index = group_chats.indexOf(group_id);

   if (arr_group_chat_index !== -1) {
    group_chats.splice(arr_group_chat_index, 1);
   }
   
   
   delete self.beforeOpenContact_valid[tonum(chatid)]



   var c_chatTabs = readCookie('chat_session');
   var new_chat_session = pageid ? c_chatTabs : removeValue(c_chatTabs, chatid, ',');
   __j('#' + chatid).addClass('__none').removeClass('__nofit');
   self.restructureChatTabs();
   self.bringBackNonFitBoxes();
   self.chat_tab_closed.push(chatid);
   self.setCookie('chat_session', new_chat_session, 1);


  },
  this.getTabPos = function(chat_id) {

   return __j(".chat-container").outerWidth() + self.chatboxes_margin;
  },
  this.removeAllChatFocusClass = function() {
   __j('.messenger-shortcut-container._focus').removeClass('_focus');
   /*
    __j('.messenger-shortcut-container._focus').each(function(){
        __j(this).removeClass('_focus');
        
        if(__j(this).find('.js-shortcut-contenteditable').length) {
        __j(this).find('.js-shortcut-contenteditable')[0].emojioneArea.trigger("blur");
        __j(this).find('[contenteditable]').blur();
        
        }
        messenger.close_stickers( tonum( __j(this).attr('id') ));
        messenger.close_gifs( tonum( __j(this).attr('id') ));
    
    }); 
    */

  },
  this.just_show = function(chat_id) {


   $.each(self.chat_tab_closed, function(a) {

    if (self.chat_tab_closed[a] == chat_id) {
     self.chatBoxes.push(self.chat_tab_closed[a]);


     self.chat_tab_closed.splice(a, 1);

    }

   });
   __j("#" + chat_id).removeClass('__none _min');
   self.restructureChatTabs();
  },
    this.c_focusChatTab = function(chat_id, without_bind) {
   if (!without_bind) self.bindGlobalEvents();


   if (!vy_ms__window_tab_active || self.isfocus(chat_id)) return;

   self.removeAllChatFocusClass();


   __j("#" + chat_id).removeClass('__none _min __nofit __blinking');
   __j("#" + chat_id + " [contenteditable]").focus();
    setTimeout(function(){
                __j("#" + chat_id).addClass('_focus').removeClass('__blinking');
                
        },100);
   var page_obj = {};
   var page_id;

   if (chat_id.includes('_')) {

    page_id = chat_id.split('_')[1];
    page_obj['userid'] = chat_id.split('_')[0];
    page_obj['page_id'] = chat_id.split('_')[1];
   }


   var have_unread_message_btn = __j("#" + chat_id).find('#flying-notif-new-messages');
   var have_unread_msgs_count = have_unread_message_btn.attr('m-count');

   setTimeout(nanoScrollStart, 100);


   if (page_id > 0) {
 
    global_messenger_count -= 1;
    gwtlog.updateCountMessages(global_messenger_count);
    mess_shortcut(chat_id).updateMessagesAsRead(tonum(chat_id), 0, page_obj);
    mess_shortcut(chat_id).removeNewBubble(false, false, 1);

   }

   if (unread_messages_by_user && unread_messages_by_user.hasOwnProperty(tonum(chat_id)) && !have_unread_message_btn.length) {

    if (unread_messages_by_user[tonum(chat_id)] > 0) {
 
     global_messenger_count -= 1;
     gwtlog.updateCountMessages(global_messenger_count);
     mess_shortcut(chat_id).updateMessagesAsRead(tonum(chat_id), 0, page_obj);
     mess_shortcut(chat_id).removeNewBubble(false, false, 1);
    }

   }


   delete self.nonfitcount_new_msg[chat_id];

   //if(parseInt(have_unread_msgs_count) > 0 && parseInt(have_unread_msgs_count) <= 2)
   //   have_unread_message_btn.trigger('click.new_msg_flying_chat');

   //mess_shortcut(chat_id).updateMessagesAsRead(tonum(chat_id));
   //mess_shortcut(chat_id).removeNewBubble(false,false,1);
 if(chat_id)
   mess_shortcut(chat_id).updateMessagesAsRead(tonum(chat_id), 0, page_obj);
   setTimeout(function(){   gwtlog.checkDinCindinCind();},1500);
    },
  this.focusChatTab = function(chat_id, without_bind) { 
    //self.enableResize(chat_id);
    return setTimeout(function(){ self.c_focusChatTab(chat_id,without_bind);}, 100);  

  },
  this.instant_focusChatTab = function(chat_id, without_bind) {
    
    self.c_focusChatTab(chat_id,without_bind);

  },
  this.removeShortcutFromMiniCookie = function(chat_id) {

   var newCookie = '';
   if (readCookie('chattab_minimized')) {
    if (readCookie('chattab_minimized').indexOf('|')) {
     var minimized_ = readCookie('chattab_minimized');


     newCookie = removeValue(minimized_, chat_id, '|');



    }
   }


   self.setCookie('chattab_minimized', newCookie, 1);
  },
  // toggle chat box
  this.toggleChatBoxGrowth = function(chat_id,e) {
   evstop(e,1);
   if (__j('#' + chat_id).hasClass('_min')) {
 
    self.removeShortcutFromMiniCookie(chat_id);
    self.focusChatTab(chat_id);

   } else {

    __j('#' + chat_id).addClass('_min').removeClass('_focus');
 

    var newCookie = chat_id;

    if (readCookie('chattab_minimized')) {
     newCookie += '|' + readCookie('chattab_minimized');
    }


    self.setCookie('chattab_minimized', newCookie, 1);


   }

  },

  this.startShortcutsSession = function() {
 
   if (anonym_content) return;

   let send = jAjax(self.ajax_url, 'post', {
    cmd: 'getShortcutsSessionUserInfo',
    chat_list: readCookie('chat_session')
   });
   send.done(function(d) {  
    let r = validateJson(d),
        i = 1;
        
        
    $.each(r, function(x) {
     
            
        self.open(false, false, r[x], false, function(a){ });

    
     i++;
    });

    
   });

  },
    this.enableResize = function(shortcut){
         
        if(self.getCountOfCurrentVisibleChats() > 1) {
             
            for(var j = 0; j < self.chatBoxes.length; j++)
                self.disableResize(self.chatBoxes[j]);
            
            return;
            
        }
        
        shortcut = __j('#'+shortcut);
 
        if(!shortcut.is(':data(ui-resizable)'))
            shortcut.resizable({ handles: "n, e, s, w, se, nw", minHeight: self.chatboxes_height, minWidth:self.chatboxes_width });
        
    },
    this.disableResize = function(shortcut){
        shortcut = __j('#'+shortcut);
 
        
        if(shortcut.is(':data(ui-resizable)'))
            shortcut.css({'left':'auto','height':self.chatboxes_height+'px','width':self.chatboxes_width+'px','top':'auto'}).resizable( "destroy" );
    }


}


__j(document).ready(function() {

 messenger_shortcut.startShortcutsSession();
 if (!('ontouchstart' in document.createElement('div')))
  __j('html').addClass('_hover');
 else
  __j('html').addClass('_touch');
});

function chatTabSend(el, e, chat_id, str) {

 chat_id = 'mshortcut-' + tonum(chat_id);

 return mess_shortcut(chat_id).send(false, e, str, tonum(chat_id));

}