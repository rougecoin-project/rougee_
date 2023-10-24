/*

Kontackt Messenger.

email: movileanuion@gmail.com 
fb: fb.com/vaneayoung

Copyright 2019 by Vanea Young 

--------------------------------
2020 - Modified for WoWonder

*/

var messenger = new Messenger();
var mess_shortcut = function(arg, b, vars) {

    return new Messenger(arg, b, vars);
}


function Messenger(chat_id, b, vars) {
    vars = vars || {};
    if (typeof __j == 'undefined') {
        var __j = function(a) {
            return $(a);
        };
    }
    if (typeof createUrl != 'function' && typeof window == 'object') {
        window.createUrl = function(state, title, url) {

            if (!self.noNewUrl)
                history.pushState(state, title, url);
            //document.title = document.title + ' | '+ title;
        }
    }


    var self = this;

    self.hasTouchStartEvent = is_smartphone();
    self.is_mobile = ((window.innerWidth <= 800) && (window.innerHeight <= 600)) || (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);
    self.mob_agent = self.getMobileOperatingSystem;
    self.ajax_url = V_HOST + '/vy-messenger-cmd.php';
    self.body = __j('body');
    self.html = __j('html');
    self.hostname = '';
    self.messengerInitiated = false;
    self.noNewUrl = false;
    self.socket = sio;
    self.socket_messages = 'null';
    self.room_id;
    self.socket_rooms = [];
    self.recipient_picture = _BLANK;
    self.recipient_fullname;
    self.force_bg = false;
    self.emojiarea_created = false;
    self.sending_Message = false;
    self.show_sent_status = b ? b : false;
    self.window_curr_title = __SITENAME;
    self.recipient_last_message_timestamp;
    self.isOldTitle = true;
    self.count_minus = false;
    self.group_admin = 0;
    self.minus_count_message = false;
    self.blinkTitleInterval;
    self.scrollNow = false;
    self.last_msg_date = false;
    self.mdialog_hide_loader = false;
    self.uploadingMedia = 0;
    self.conversation_in_viewport = true;
    self.msg_with_preview = vars.hasOwnProperty('preview') ? vars.preview : !1;
    self.typing_now = 0;
    self.Typing_timeoutFunction = function() {};
    self.timeout_typing = function() {};
    self.scrollChatDelayTime = 2000;
    self.last_message_object = {
        msgs_count: 0,
        global: 0
    };
    self.recipient_nickname = '';
    self.mess_opened_contacts = [];
    self.mess_opened_contacts__shortcut = [];
    self._search_conv_messages = [];
    self.search_in_conv_curr_id = 0;
    self.text_val = self.text_val || '';
    self.msg_page = {};
    self.vymsn_videos_generated = new Array();
    self.attach_page = 1;
    self.randId = Math.floor(Math.random() * 2);
    self.default_color = chat_default_color;
    self.curr_theme = chat_default_theme;
    self.contenteditable;
    self.curr_recipient;
    self.mobile_btn_timeout;
    self.voice_clip_chunks;
    self.voice_clip_media_recorder;
    self.recording_timeout;
    self.mediatp;
    self.sidebar_media;
    self.shortcut = chat_id ? __j('#' + chat_id) : false;
    self.pmessenger = __j('.pmessenger');
    self.shortcut_id_num;
    self.shortcut_id;
    self.voice_clip_extension = 'wav';
    self.photoTypes = ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'TIFF', 'BMP', 'ICO', 'PJP', 'SVG', 'TIF'];
    self.videoTypes = ['MP4', 'WEBM', 'MPG', 'MPEG', 'WMV', 'MOV', 'MPE', 'MPV', 'OGG', 'MP4', 'M4P']; //['WEBM','MPG','MP2','MPEG','MPE','MPV','OGG','MP4','M4P','M4V','AVI','WMV','MOV','FLV'];
    self.BBCODES = validateJson(VY_MS_BBCODES);
    self.global_popup = '.js__vy_ms__globalpopup';
    self.event;
    self.timeout_opencontact;
    self.timeout_attach;
    self.unmute_wo_timeout;
    self.more_contacts_page = 1;
    self.loaded_all_contacts = false;
    self.mediaRecorderConstructed = false;
    self.messenger_local_stream = false;
    self.sended_location;
    self.existingCall;
    self.media_files;
    self.page_id = 0;
    self.recipient_user_id = 0;
    self.send_important = 0;
    self.holding_touch_timer;
    self.audiorecorder_shortcut;
    self.audiorecorder_btn;
    self.messenger_call_start_timeout;
    self.user_not_found = false;
    self.user_privacy = 0;
    self.mob_focus_timeout;
    self.forward_msg_timeout = {};
    self.msg_cannot_send = false;
    self.beforeOpenContact_valid = false;
    self.privacy_msg = '';
    self.enable_copytoclipboard_mob_btn;
    self.conv_status = 200;
    self.newgchat_sel_users = new Array();
    self.reply_enabled = 0;
    self.muted_contacts = {};
    self.replies = {};
    self.mob_hidden_btns = {};
    self.drafts = {};
    self.attach_draft = {};
    self.attach_draft_offset = {};
    self.attach_draft_polnii = {};
    self.svgi = vy_ms_svgi;
    self.gl_scrollChatDelay = 100;
    self.group_id;
    self.soundVolume = 0.99;
    self.last_msg_timestamp = 0;
    self.message_space_time = 60000; // 60 seconds
    self.timeouts = {};




    self.flying_new_message_markup = '<div id="flying-notif-new-messages">+%count&nbsp;' + lang.new_messages + '</div>';
    self.notif__markup = '<Div class="vy_ms__groupusermsgs vymsnotif vy_ms__group_msg_margin"><div id="msg_00" class="pmessenger-message-txt messenger_notif_nickname"><div class="mess_notif_nick_text">%text</div></div></div>';
    self.prev_messages_btn = '<div class="messenger_older_msg_div"><a rel="li-gliph-color-border" class="messenger_older_msg_a ellip" href="javascript:void(0);" onclick="messenger.mdialog_load_prev_messages(event,this);" uid="mdialog_prev_btn_ld" id="id-prev-comm-link-w-msg"><span class="txt-msg-old-load-g ellip" rel="gliph-mess-color">' + lang.pm_load_old + '</span><span class="txt-msg-old-load">' + lang.please_wait + '...</span></a></div>';
    self.mess_colors = vy_ms_colors;
    self.reactions = {
        "like": {
            "title": lang.Messenger_reaction_like,
            "css_class": "_like",
            "color": "rgb(244, 67, 54)"
        },
        "haha": {
            "title": lang.Messenger_reaction_haha,
            "css_class": "_haha",
            "color": "rgb(255, 202, 40)"
        },
        "wow": {
            "title": lang.Messenger_reaction_wow,
            "css_class": "_wow",
            "color": "rgb(255, 193, 7)"
        },
        "sad": {
            "title": lang.Messenger_reaction_sad,
            "css_class": "_sad",
            "color": "rgb(255, 202, 40)"
        },
        "angry": {
            "title": lang.Messenger_reaction_angry,
            "css_class": "_angry",
            "color": "rgb(244, 67, 54)"
        }
    };

    // make compatible to shortcuts
    if (chat_id) {
        recipientId = tonum(chat_id);
        self.curr_recipient = recipientId;
        //self.curr_color = self.shortcut.find('#chat-curr-color').val();
        self.shortcut_id = chat_id;
        self.shortcut_id_num = typeof chat_id != 'undefined' && chat_id.includes('GG') ? chat_id.split('-')[1] : recipientId;
    }
    this.constructRightSidebar = function(title,width,callback){

        let scheleton = '<div class="vymsn_rightsidebar" id="vymsn_rightsidebar"><div onclick="messenger.destroyRightSidebar(event);" class="vymsn_rightsidebar_opac"></div><div class="vymsn_rightsidebar_popup" style="width:'+width+'px;"><a href="javascript:void(0);" onclick="messenger.destroyRightSidebar(event);" class="vymsn_rightsidebar_close"><span class="material-symbols-outlined">close</span></a><div class="vymsn_rightsidebar_title">'+title+'</div><div id="%id" class="vymsn_rightsidebar_content %media nano"><div class="nano-content rgpos3x3pps"><div class="div-loader"></div></div></div></div></div>';
 
        if(self.sidebar_media)
        scheleton = scheleton.replace('%media','mess-attach-venobox').replace('%id','messenger-attachments-cnt');
    else
        scheleton = scheleton.replace('%media','').replace('%id',Math.random());
        

        if(!self.body.find('#vymsn_rightsidebar').length){

            self.body.append(scheleton);
            setTimeout(function(){

                self.body.find('#vymsn_rightsidebar').addClass('_open').on(self.crossEvent(),function(){


                   callback(self.body.find('#vymsn_rightsidebar .vymsn_rightsidebar_content > .nano-content')); 
                    

                });

            },200);



        }

    },
    this.destroyRightSidebar = function(e){

              evstop(e);
              self.body.find('#vymsn_rightsidebar').removeClass('_open').on(self.crossEvent(),function(){

                   self.body.find('#vymsn_rightsidebar').remove();

               });


    },
    this.openAttachmentsSidebar = function(user_id,group_id,page_id){

        
        this.sidebar_media = 1;
        this.constructRightSidebar(lang.Messenger_attachments,350,function(content){

           // content.html('content');
            self.getAttachments(user_id); 
            self.sidebar_media = 0;
        });


    },
    this.openGroupMemebersSidebar = function(user_id,group_id,page_id){

        

        this.constructRightSidebar(lang.Messenger_Group_Members,300,function(content){

 
                    let get_group_members = jAjax(self.ajax_url, 'post', {
                        'cmd': 'get-group-members',
                        'group': escape(group_id),
                        'action': 'all'
                    });
                    get_group_members.done(function(data) {

   
                        let d = validateJson(data);
                        let members = '';
                        if (d.msg == "done") {

                            for (var i = 0; i < d.users.length; i++) {

                                let member = d.users[i];

                                members += '<a id="vy_ms__groupchat_member_online_' + member.id + '" data-timestamp="' + member.timestamp + '" onclick="evstop(event,1);' + (member.id == _U.i ? 'return;' : 'return messenger.prependContact(this,event,\'' + member.avatar + '\',\'' + member.fullname + '\',\'' + member.id + '\');') + '" href="/messenger/' + member.id + '" class="' + (member.online == 'yes' ? '' : '_offline') + ' vy_ms__groupchat_member__rightside js__groupchat_online_member"><div class="vy_ms__gcm01"><img src="' + member.avatar + '" /><i class="ic-online"></i></div><div class="ms_f55ce4"><username class="vy_ms__gcm02"><span class="js__vy_ms__gchatmembernickname">' + decodeURIComponent(($.trim(member.nickname) ? member.nickname : member.fullname)) + '</span>' + (member.admin == 'yes' ? '<span><i title="Administrator" class="glyphicon glyphicon-ok-sign"></i></span>' : '') + '</username><div class="ms_groupmemeber_lastseen js__group_user_online_' + member.id + '">' + member.online_text + '</div></div></a>';


                            }

                            content.html(members);
                            nanoScrollStart();
                        } else {

                            content.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');

                        }

                    });

        });


    },
    this.generatedropdownmenu = function(y,user_id,group_id,page_id,user_name,shortcut_id){

        let html = '<div class="Menu421 no-selection compact %which" style="left:%leftpx;top:%toppx;" id="vymsn_moderndropdown">\
                       <div onclick="messenger.removeDropdownmenu(this);" class="backdrop"></div>\
                       <div class="bubble menu-container custom-scroll top right opacity-transition fast not-shown" style="%transform_origin">\
                          <div role="button" tabindex="0" class="MenuItem compact">%btns</div>\
                       </div>\
                    </div>',
                    pos_left,
                    pos_top,
                    to_attach,
                    btns = '';
                    //shortcut_id = typeof self.shortcut != 'undefined' ? __j(self.shortcut).attr('id') : false;
                    //shortcut_id = //parseInt(group_id) > 0 ? `mshortcut-GG${shortcut_id}` : `mshortcut-${shortcut_id}`;
                   
 
        switch(y){

        case'media':  
 
            to_attach = shortcut_id ? __j('#'+shortcut_id).find('.vy_ms_gattach') : __j('.vy_ms_gattach');
            pos_left = to_attach.offset().left,
            pos_top = to_attach.offset().top;
            html = html.replace('%which','vymsn_for_media').replace('%transform_origin','transform-origin: left bottom;').replace('%btns',(shortcut_id ? window.shortcut_media_btns[shortcut_id] : window.vymsn_media_btns)).replace('%left',pos_left).replace('%top',pos_top);
        break;

        case 'conv_opts':
            to_attach = __j('[data-testid="info_panel_button"]');
            pos_left = to_attach.offset().left,
            pos_top = to_attach.offset().top;
            let contact_muted_ic = (user_id > 0 && self.muted_contacts.hasOwnProperty(user_id)) || self.getMuteStatus(user_id,group_id) ? 'notifications_off' : ((group_id > 0 && self.muted_contacts.hasOwnProperty(group_id)) || self.getMuteStatus(user_id,group_id) ? 'notifications_off' : 'notifications');
            let vymsn_top_header_btns = {};

            vymsn_top_header_btns['search'] = '<div onclick="messenger.removeDropdownmenu();return messenger.search('+user_id+',0,0);" class="menuitemcompact"><span class="material-symbols-outlined">search</span>'+lang.Messenger_Search_in_conversation+'</div>';

            vymsn_top_header_btns['change_theme'] = '<div onclick="messenger.removeDropdownmenu();return messenger.change_theme('+user_id+','+group_id+');" class="menuitemcompact"><span class="material-symbols-outlined">wallpaper</span>'+lang.Messenger_change_conv_theme+'</div>';
            vymsn_top_header_btns['nicknames'] = '<div onclick="messenger.removeDropdownmenu();return messenger.setNicknames(' + user_id + ',\'' + encodeURIComponent(user_name) + '\',' + group_id + ');" class="menuitemcompact"><span class="material-symbols-outlined">border_color</span>'+lang.Messenger_Edit_nickname+'</div>';
            vymsn_top_header_btns['mute'] = '<div onclick="messenger.removeDropdownmenu();return messenger.muteContact('+user_id+',0);" class="menuitemcompact"><span id="vymsn_material_ic_notif" class="material-symbols-outlined">'+contact_muted_ic+'</span>'+lang.Messenger_Notifications+'</div>';
            vymsn_top_header_btns['attachments'] = '<div onclick="messenger.removeDropdownmenu();return messenger.openAttachmentsSidebar('+user_id+','+group_id+','+page_id+');" class="menuitemcompact"><span id="vymsn_material_ic_notif" class="material-symbols-outlined">auto_awesome_motion</span>'+lang.Messenger_attachments+'</div>';
            vymsn_top_header_btns['divider'] = '<div class="vymsn_dropdownmenu_divider"></div>';
            vymsn_top_header_btns['block'] = '<div onclick="messenger.removeDropdownmenu();return messenger.contactToBlacklist(event,this);" class="menuitemcompact"><span class="material-symbols-outlined">block</span>'+lang.messenger_block_user+'</div>';
            vymsn_top_header_btns['delete'] = '<div onclick="messenger.removeDropdownmenu();return messenger.deleteConversation(event,this,0);" class="menuitemcompact __warn"><span class="material-symbols-outlined">delete</span>'+lang.delete_conversation+'</div>';
 

            if(group_id){

                delete vymsn_top_header_btns['block'];
                delete vymsn_top_header_btns['delete'];
                vymsn_top_header_btns['members'] = '<div onclick="messenger.removeDropdownmenu();return messenger.openGroupMemebersSidebar('+user_id+','+group_id+','+page_id+');" class="menuitemcompact"><span class="material-symbols-outlined">supervised_user_circle</span>'+lang.Messenger_Group_Members+'</div>';
                vymsn_top_header_btns['leave'] = '<div onclick="messenger.removeDropdownmenu();return messenger.exitGroup(event,'+group_id+');" class="menuitemcompact __warn"><span class="material-symbols-outlined">exit_to_app</span>'+lang.Messenger_Leave_Group+'</div>';

            }

            for(var i in vymsn_top_header_btns)
                btns += vymsn_top_header_btns[i];

            

            html = html.replace('%which','vymsn_for_conv_opts').replace('%transform_origin','transform-origin: right top;').replace('%btns',btns).replace('%left',pos_left).replace('%top',pos_top);
        break;

 
        }

        if(!__j('body').find('#vymsn_moderndropdown').length){  

            const shortcut_id = typeof self.shortcut != 'undefined' ? __j(self.shortcut).attr('id') : false;

            __j(shortcut_id ? `#${shortcut_id}` : 'body').append(html);
            const dropdown = __j('#vymsn_moderndropdown');
            const dropdown_menucontainer = dropdown.find('.menu-container');

            const responsive_dropdown = function(y){
                  const dropdown_menu_container_size_h = dropdown_menucontainer.outerHeight() + 20;
                  const dropdown_menu_container_size_w = to_attach.closest('.js_chatwithgroup').length ? to_attach.width() : dropdown_menucontainer.width()/2;
 
                    
switch(y){

case'media':
 dropdown.css({'top': Math.ceil(pos_top - dropdown_menu_container_size_h)+'px', 'left': Math.ceil(pos_left + dropdown_menu_container_size_w)+'px'});
    break;

case 'conv_opts':
 dropdown.css({'top': Math.ceil(pos_top + __j('#pmessenger-contact-header').height() - 10)+'px', 'left': Math.ceil(pos_left + dropdown_menu_container_size_w)+'px'});
    break;

}
            }



            dropdown_menucontainer.addClass('shown open');
            responsive_dropdown(y);
            setTimeout(function(){
            dropdown_menucontainer.removeClass('shown open'); 
            setTimeout(function(){dropdown_menucontainer.removeClass('not-shown').addClass('shown open');},50)
            },200);
        } else {

            this.removeDropdownmenu();
        }

        return html;

    },
    this.removeDropdownmenu = function(el){

        el = el ? __j(el) : __j('#vymsn_moderndropdown > .backdrop');

        

        el.parent().find('.menu-container').on(self.crossEvent(),function(){
            el.parent().remove();

        }).removeClass('shown open').delay(100).addClass('no-shown');

    },
    this.generateVideoPlayer = function(is_new_upload){



         __j('.pmessenger').find('.js_vy_vpl_player').each(function(){

            let $this = __j(this);
            let data = {id:$this.data('video-id'),src:$this.data('video-src')};
                    


           
        const player_id = "vy_msn_litevideoplayer_"+data.id;
        const video_src = data.src;
       

        if(self.vymsn_videos_generated.indexOf(data.id) > -1 && is_new_upload) return;
 
        const vd_settings = {
                    instanceName:player_id,
                    volume:0.6,
                    autoPlay:true,
                    autoPlayInViewport:true,
                    mediaEndAction:"loop",
                    aspectRatio:1,
                    skipPoster:1,
                    playerRatio:1.777777,
                    useMobileNativePlayer:1,
                    preload:'metadata',
                    randomPlay:false,
                    loopingOn:true,
                    rightClickContextMenu:'disabled',
                    facebookAppId:"",
                    elementsVisibilityArr:[
                        {width:550, elements:['next', 'previous', 'seekbar', 'fullscreen', 'settings', 'info', 'volume', 'pip', 'time']},
                    ],
                    youtubePlayerType:'chromeless',
                    vimeoPlayerType:'chromeless',
                    displayPosterOnMobile:false,

                    media:[
                    
                        {
                            type:'video',
                            path:[
                                {   
                                    label: 'HD',
                                    mp4: video_src,
                                    
                                },
                            ],

                        }
         
                    ]
                            
                };

                __j("#"+player_id).vpl(vd_settings);
                self.vymsn_videos_generated.push(data.id);


         });

    },
    this.createSounds = function() {

        const self = this;

        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.on("fileload", function() {}, this);

        for (var i in vy_msn_sounds)
            createjs.Sound.registerSound(vy_msn_sounds[i], i);



    },
    this.playSound = function(id,loop) {
        let instance;
        if(loop)
            instance = createjs.Sound.play(id, {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
        else
            instance = createjs.Sound.play(id);

        instance.on("complete", function() {}, this);
        instance.volume = this.soundVolume;
    },
    this.stopSound = function(id) {
        if(id == 'all'){
            for (var i in vy_msn_sounds)
                createjs.Sound.stop(vy_msn_sounds[i]);
        } else {
            createjs.Sound.stop(id);
        }
    },
    this.open = function(evt, el) {
            evt.preventDefault();

            el = __j(el);


            addTopGlobalHelper();

            var send = jAjax(self.ajax_url, 'post', {
                'cmd': 'open'
            });

            send.done(function(data) {

                if (!__j('#messenger_window_body').length) {
                    __j('#messenger-box-app').html(data);
                    __j('.messenger-shortcut-container').addClass('zindex1');
                    el.parent().addClass('__active');
                    el.parent().addClass('__on');
                }


                __j(document).off('click.closeMessBox').on('click.closeMessBox', 'body', function(e) {

                    self.closeBox();
                });
                __j(document).off('keyup.closeMessBox').on('keyup.closeMessBox', 'body', function(e) {
                    if (e.keyCode == 27)
                        self.closeBox();
                });
                // close messenger box
                __j('#close-messenger-box').on('click', function(e) {

                    self.closeBox();

                });

            });

        },
        this.closeBox = function() {

            __j('#messenger-box-app').empty();
            __j(document).off('click.closeMessBox keyup.closeMessBox');
            __j('.messenger-shortcut-container').removeClass('zindex1');
            __j('.bas_ntf_top.msgs').removeClass('__active __on');
            //removeTopGlobalHelper();
        },
        this.separateMediaFromText = function(msg) {


            // separate media from text

            /* search for images */
            var message_text = '',
                message_html = '';

            if (!__j('body').find('#messenger_message_cookie').length)
                __j('body').prepend('<div id="messenger_message_cookie" style="position:absolute;display:none;"></div>');

            var body_msg = __j('#messenger_message_cookie');



            body_msg.html(msg);

            // images
            if (body_msg.find('.messenger-start-media').length) {

                var get_html_from_msg = body_msg.find('.messenger-start-media');

                message_html = get_html_from_msg.html();
                get_html_from_msg.remove();


                message_text = typeof body_msg.text() != 'undefined' ? $.trim(body_msg.text()) : '';


                self.gl_scrollChatDelay = self.scrollChatDelayTime;
gl_scrollChatDelay = self.scrollChatDelayTime;

            } else
                // url preview
                if (body_msg.find('.js_urlpreview').length) {

                    var get_html_from_msg = body_msg.find('.js_urlpreview');

                    message_html = get_html_from_msg.html();
                    get_html_from_msg.remove();


                    message_text = typeof body_msg.text() != 'undefined' ? $.trim(body_msg.text()) : '';


                    self.gl_scrollChatDelay = 500;
                    gl_scrollChatDelay = 500;

                } else
                    // location
                    if (body_msg.find('.js_mess_map_loc').length) {

                        var get_html_from_msg = body_msg.find('.js_mess_map_loc');

                        message_html = get_html_from_msg.html();
                        get_html_from_msg.remove();


                        message_text = typeof body_msg.text() != 'undefined' ? $.trim(body_msg.text()) : '';


                        self.gl_scrollChatDelay = self.scrollChatDelayTime;
                        gl_scrollChatDelay = self.scrollChatDelayTime;

                    } else
                        //voice clips
                        if (body_msg.find('.sp-voice-clip-comment').length) {

                            var get_html_from_msg = body_msg.find('.sp-voice-clip-comment');

                            message_html = get_html_from_msg.html();
                            get_html_from_msg.remove();


                            message_text = '';

                            self.gl_scrollChatDelay = 10;
gl_scrollChatDelay = 10;
                        } else




                            //tracks
                            if (body_msg.find('.commentsWidgetTracks').length) {

                                var get_html_from_msg = body_msg.find('.commentsWidgetTracks');

                                message_html = '<div class="messenger_msgs_tracks">' + get_html_from_msg.html() + '</div>';
                                get_html_from_msg.remove();


                                message_text = typeof body_msg.text() != 'undefined' ? $.trim(body_msg.text()) : '';

                                self.gl_scrollChatDelay = self.scrollChatDelayTime;
                                gl_scrollChatDelay= self.scrollChatDelayTime;
                            } else
                                // gifs
                                if (body_msg.find('.msg_gif').length) {

                                    var get_html_from_msg = body_msg.find('.msg_gif');

                                    message_html = get_html_from_msg.parent().html();
                                    get_html_from_msg.remove();


                                    message_text = '';

                                    self.gl_scrollChatDelay = self.scrollChatDelayTime;
                                    gl_scrollChatDelay = self.scrollChatDelayTime;
                                } else
                                    // shared content
                                    if (body_msg.find('.msg_shared_cnt').length) {

                                        var get_html_from_msg = body_msg.find('.msg_shared_cnt');

                                        message_html = get_html_from_msg.parent().html();
                                        get_html_from_msg.remove();


                                        message_text = '';

self.gl_scrollChatDelay = self.scrollChatDelayTime;
                                    gl_scrollChatDelay = self.scrollChatDelayTime;
                                    } else
                                        // calls
                                        if (body_msg.find('.messenger_call_msg').length) {

                                            var get_html_from_msg = body_msg.find('.messenger_call_msg');

                                            message_html = get_html_from_msg.parent().html();
                                            get_html_from_msg.remove();


                                            message_text = '';
self.gl_scrollChatDelay = self.scrollChatDelayTime;
                                    gl_scrollChatDelay = self.scrollChatDelayTime;
                                        } else
                                            // embera

                                            if (body_msg.find('.embera_embd').length) {

                                                var get_html_from_msg = body_msg.find('.embera_embd');

                                                message_html = '<div class="mess-embera">' + get_html_from_msg.html() + '</div>';
                                                get_html_from_msg.remove();


                                                message_text = typeof body_msg.text() != 'undefined' ? $.trim(body_msg.text()) : '';

self.gl_scrollChatDelay = self.scrollChatDelayTime;
                                    gl_scrollChatDelay = self.scrollChatDelayTime;

                                            } else

                                                // emojis
                                                if (body_msg.find('.emotics').length) {

                                                        self.gl_scrollChatDelay = 200;
                                                        gl_scrollChatDelay = 200;
                                                    message_text = $.trim(body_msg.text());

                                                    if (!message_text) {
                                                        message_text = message_text;
                                                        message_html = body_msg.html();
                                                    } else
                                                        message_text = $.trim(body_msg.html());

                                                } else
                                                    // img
                                                    if (body_msg.find('img').length) {

                                                        self.gl_scrollChatDelay = self.scrollChatDelayTime;
                                                        gl_scrollChatDelay = self.scrollChatDelayTime;
                                                        message_text = $.trim(body_msg.text());

                                                        if (!message_text) {
                                                            message_text = message_text;
                                                            message_html = body_msg.html();
                                                        } else
                                                            message_text = $.trim(body_msg.html());

                                                    } else

                                                        // stickers
                                                        if (body_msg.find('.sticker').length) {

                                                            message_text = '';
                                                            message_html = body_msg.html();



                                                        } else {

                                                            message_text = body_msg.html();
                                                            //message_html = body_msg.html();
                                                        }


            body_msg.empty();


            return [message_text, message_html];

        },
this.getReactedPeople = function(el,evt){
    
    evstop(evt,1);
    
    
    el = __j(el);
    
    var item_data = el.data('reactedpeople');
    
    var reactions_categ = '';
    var this_showdata = function(){};
 
    
    modernPopup(function(confirm_btn, cnt, cancel_btn){
    
         messenger__sort_reaction = function(el,reaction_type){
            
            __j('.js__people-reacted-top-header').removeClass('active');
            __j(el).addClass('active');
            
            __j('#js__reactions_popup_users_content').html('<div class="div-loader"></div>');
            var send = jAjax(self.ajax_url, 'post', {'cmd':'getReactedPeople','reaction':reaction_type,'item_id':escape(item_data.itemid),'item_type':item_data.item_type});
            
            send.done(function(new_data){
                
                this_showdata(new_data,1);
                
            });
            
            
            
        };
        
        this_showdata = function (new_data,filter){
            
            
 
            
                var rows = validateJson(new_data);
                var user_rows = rows.data;
            
                
                if(!filter) {
                let duplicated_categs = new Array();
                
                for(var x = 0; x < rows.each_reaction_count.length; x++) {
                    
                    if( !($.inArray(rows.each_reaction_count[x].type, duplicated_categs) !== -1))
                    reactions_categ += '<li><a class="js__people-reacted-top-header people-reacted-top-header" href="javascript:;" onclick="messenger__sort_reaction(this,\''+self.reactions[rows.each_reaction_count[x].type].title+'\');"><span class="peoplewhoreacted-categs notif-type-icon _'+self.reactions[rows.each_reaction_count[x].type].css_class+'"></span><span style="color:'+self.reactions[rows.each_reaction_count[x].type].color+';">'+self.reactions[rows.each_reaction_count[x].type].title+' ('+rows.each_reaction_count[x].count+')</span></a></li>';
                    
                    duplicated_categs.push(rows.each_reaction_count[x].type);
                }
                var top_header_markup = '<div class="users-reactions-popup-allcnt"><ul class="top-header-users-reacted-categ">\
                                <li><a class="js__people-reacted-top-header people-reacted-top-header active" href="javascript:;" onclick="messenger__sort_reaction(this,\'all\');">'+lang.Messenger_All+' ('+rows.all_count+')</a></li>\
                                '+reactions_categ+'\
                                </ul><div class="nano reaction-users-content"><div id="js__reactions_popup_users_content" class="overthrow nano-content"></div></div></div>';
                
            
                cnt.html(top_header_markup);
                }
         
                var user_markup = '';
             
                for(var i = 0; i < rows.data.length;i++)
                    user_markup += '<div class="people-reacted-user"><div class="people-reacted-user-avatar peoplewhoreacted-reaction-near-avatar notif-type-icon __'+user_rows[i].reaction+'"><img src="'+user_rows[i].user.profile_photo+'" /></div><div class="people-reacted-user-str"><div class="people-reacted-user-str-fullname"><a href="/vyuser/'+user_rows[i].user.id+'" hrefattr="true">'+user_rows[i].user.fullname+'</a></div><div class="people-reacted-user-str-username"><i>@'+user_rows[i].user.username+'</i></div></div></div>';
                
                
                if(rows.success == "yes"){
                    
                    cnt.find('#js__reactions_popup_users_content').html(user_markup);
                    
                } else {
                    
                    cnt.html(lang.Messenger_poeple_reacted_empty);
                }
                
                nanoScrollStart();
            
            
            
            
            
        };
        
        var send = jAjax(self.ajax_url, 'post', {'cmd':'getReactedPeople','reaction':'all','item_id':escape(item_data.itemid),'item_type':item_data.item_type});
        
        send.done(function(new_data){
            
            this_showdata(new_data);
            
        });
        
        

        
    }, true);
    
    
    
    
},
        this.getReactionMarkup = function(arr) {
            
            let r = self.getReactionsMarkup(arr.id, arr['unsettled-msg-id'], arr.reactions, arr);
            return {
                'reaction-type': r['reaction-type'],
                'reacted': (r.reacted ? 'reacted' : ''),
                'markup': '<div class="message-reactions-std"><a href="javascrip:void(0);" data-reactedpeople=\'{"itemid":"' + arr.id + '","item_type":"message"}\' onclick="messenger.getReactedPeople(this,event);"><div class="js__message-reactions-std-ics">' + r.html + '</div><div data-msgid="' + arr.id + '" class="message_reactions __c'+r.count+'">' + (r.count > 0 ? r.count : '') + '</div></a></div>',
                'count': r.count
            };
        },
        this.getMessagesMarkup = function(arr, from, avatar, show_conv_date, timestamp, show_username, forwarded) {  
            let is_avatar = avatar ? true : false;

            let  last_msg_timestamp = __j('#vy_ms__lastmsg_timestamp').val(),
                 little_margin = (timestamp - self.last_msg_timestamp) >= self.message_space_time && self.last_msg_timestamp > 0 ? '' : '',
                 reaction = self.getReactionMarkup(arr),
                 text = messenger.emoji_convert(arr.msg),
                 get_message_text_media = self.separateMediaFromText(text),
                 message_text = get_message_text_media[0],
                 message_html = get_message_text_media[1],
                 reaction_visible = reaction.count > 0 ? 'vy_ms__msg_reacted' : '',
                 contains_reply = self.replied_msg(arr.reply);
 
            show_conv_date = show_conv_date ? true : false;
            //self.last_msg_date = arr.dateMonth;//arr.date;
            self.last_msg_timestamp = timestamp;
 
            if (from == 'me') {

                avatar = avatar || show_conv_date ? '<img src="' + _U.p + '" />' : '<img src="' + _BLANK + '" />';
                return little_margin + (!is_avatar ? '<div class="me53xwyg2d"></div>' : '') + '<div data-unsettled-msg-id="' + arr.unsettled_msg_id + '" ' + (arr.group_id > 0 ? 'title="' + lang.mess_msg_seen + ' (' + arr.count_group_seen + ' ' + lang.people + ')"' : '') + ' id="msg_' + arr.id + '" data-msg-timestamp="' + arr.timestamp + '" class="pmessenger-message-txt _me soh-s '+(contains_reply ? '_contains_reply' : '')+' '+(forwarded == 'yes' ? '__vforwarded' : '')+' ' + reaction_visible + '   vyms__isread__' + arr.read + ' ' + (!is_avatar ? 'messenger-message-margin-m2' : '') + ' ' + (arr.bg == 'no' ? '_nobg' : '') + '">\
                '+ self.meta_stretch() +'<div class="txt_pmessenger-user-avatar">' + avatar + '</div>\
                '+self.forwarded_markup(forwarded,1)+'<div class="vycntreply243">'+contains_reply+'<div class="messenger_text_col '+($.trim(message_html) ? 'noappeindx' : '')+'">' +($.trim(message_text) ? '<div rel="li-gliph-color-background" class="txt_pmessenger-text mess-msgs-cnt-rows">' + message_text + self.getMeta(arr.time) + reaction.markup+ '</div>' : '') + ($.trim(message_html) ? '<div class="mess-msgs-cnt-rows messenger_media_in_msg">' + message_html + self.getMeta(arr.time) + reaction.markup + '</div>' : '')  + '</div></div>' + self.message_actions(arr.id, arr.time, arr.group_id, arr.page_id, arr.recipient, reaction, arr.from_id) + self.message_metah() + '\
                </div>';


            } else {
                avatar = avatar || show_conv_date ? '<img src="' + self.recipient_picture + '" />' : '<img src="' + _BLANK + '" />';

                show_username = '<a href="/vyuser/' + arr.from_id + '" class="vy_ms__groupuser_fullname">' + show_username + '</a>';
                return little_margin + (!is_avatar ? '<div class="me53xwyg2d"></div>' : '') + '<div data-unsettled-msg-id="' + arr.unsettled_msg_id + '" ' + (arr.group_id > 0 ? 'title="' + lang.mess_msg_seen + ' (' + arr.count_group_seen + ' ' + lang.people + ')"' : '') + ' id="msg_' + arr.id + '" data-msg-timestamp="' + arr.timestamp + '"  class="pmessenger-message-txt soh-s '+(contains_reply ? '_contains_reply' : '')+' '+(forwarded == 'yes' ? '__vforwarded' : '')+' ' + reaction_visible + ' ' + (!is_avatar ? 'messenger-message-margin-m2' : '') + ' ' + (arr.bg == 'no' ? '_nobg' : '') + '">\
                '+ self.meta_stretch() +'<div class="txt_pmessenger-user-avatar">' + avatar + '</div>\
                '+self.forwarded_markup(forwarded)+'<div class="vycntreply243">'+contains_reply+'<div class="messenger_text_col '+($.trim(message_html) ? 'noappeindx' : '')+' ' + (arr.read == 'no' ? 'is_new' : '') + '">' + ($.trim(message_text) ? '<div class="txt_pmessenger-text mess-msgs-cnt-rows">' + show_username + message_text + self.getMeta(arr.time) + reaction.markup + '</div>' : '') + ($.trim(message_html) ? '<div class="mess-msgs-cnt-rows messenger_media_in_msg">' + message_html + self.getMeta(arr.time) + reaction.markup + '</div>' : '') +'</div></div>' + self.message_actions(arr.id, arr.time, arr.group_id, arr.page_id, arr.recipient, reaction, arr.from_id) + self.message_metah() + '\
                </div>';

            }


        },
        this.ReplyscrollToOriginalMessage = async function(el,ev){
            evstop(ev,1);
            
            if(self.timeouts['load_old_messages_for_replies'])
                clearTimeout(self.timeouts['load_old_messages_for_replies']);
            
            if(self.timeouts['load_old_messages_for_replies_anim'])
                clearTimeout(self.timeouts['load_old_messages_for_replies_anim']);
            
                let message = __j(el).data('msgd'),
                    msg_id = message.id > 0 ? message.id : message.unsettled_msg_id, 
                    conv__nanoscroll = self.shortcut_id ? __j('#'+self.shortcut_id).find('#messenger-shortcut-messages-tr .nano') : __j("#messages-tick .nano"), 
                                conv__height = self.shortcut_id ? __j('#'+self.shortcut_id).find('#messenger-shortcut-messages-tr') :  self.pmessenger.find('#pmessenger-messages-cnt'),
                                message_element = __j('#msg_'+msg_id).length ? __j('#msg_'+msg_id) : __j('[data-unsettled-msg-id="'+msg_id+'"]');
                                
                if(msg_id == null){
                    return $.alert(lang.Messenger_message_removed);
                }                   
                                
                if(!message_element.length){
                    ajaxLoading();
                    await self.pmessenger.find('[uid="mdialog_prev_btn_ld"]').trigger('click');
                    self.timeouts['load_old_messages_for_replies'] = setTimeout(function(){
                        removeAjaxLoad();
                        self.ReplyscrollToOriginalMessage(el,ev);
                        
                    },1000);
                    return;
                }                   
                                
                conv__nanoscroll.addClass('__animated').nanoScroller({ scrollTop: ( message_element.get(0).offsetTop - conv__height.height() ) + message_element.outerHeight()  });
                self.timeouts['load_old_messages_for_replies_anim'] = setTimeout(function(){
                     
                    message_element.addClass('message_flipInX_animation');
                    setTimeout(function(){
                        message_element.removeClass('message_flipInX_animation');
                        
                    },1000);
 
                    
                },500);
        },
        this.replied_msg = function(message){ 
 
            if(message != null){
                var str = self.decodeHTML(message.str);
                delete message.str;
            }
            const _onclick = self.shortcut_id ? 'mess_shortcut(\''+self.shortcut_id+'\').ReplyscrollToOriginalMessage(this,event);' : 'messenger.ReplyscrollToOriginalMessage(this,event);';
            return message == null ? '' : '<div data-msgd=\''+JSON.stringify(message)+'\' class="vy_ms__replied_message" ontouchend="messenger.ReplyscrollToOriginalMessage(this,event);" onclick="'+_onclick+'"><div class="vy_ms_4ffazv1"><div class="vy_ms_svgi31qr">'+self.svgi.js.reply+'</div></div><div class="vy_ms_f45vwq1">'+str+'</div></div>';
        },
        this.switchToNextConv = function() {

            var cur_u = __j('.pmessenger-contact-a.active');
            cur_u.slideUp(400, function() {
                cur_u.remove();
                setTimeout(function() {
                    self.firstConvClick();
                }, 100);
            });

        },
        this.firstSession = function(){

            this.removeMessengerLoading();

            this.touch_slide_to_delete();
        },

        this.firstConvClick = function() {
            const first_contact = __j('.pmessenger-contact-a:first');
 
            self.pmessenger = __j('.pmessenger');

            if (first_contact.length)
                first_contact.trigger('click');
            else if (!first_contact.length && !__j('.pmessenger-messages-list').hasClass('empty'))
                window.location.reload();
            else if (self.hasTouchStartEvent)
                self.show_contacts();
 

            __j('script[rel="vy_ms__remove_on_dom_ready"]').each(function() {

                __j(this).remove();

            });

        },
        this.contactToBlacklist = function(evt, el) {
            evstop(evt, 1);
            self.confirm_act(lang.Messenger_block_user_info.replace(/%username/g, self.recipient_fullname),
                function(event) {

                    var send = jAjax(self.ajax_url, 'post', 'cmd=uToBlackList&userid=' + escape(self.curr_recipient));
                    send.done(function(res) {

                        if (res === '1') {

                            self.switchToNextConv();
                        } else if (res === '0') {
                            displayErr(lang.pm_us_exist_blacklist);
                        } else if (res !== '1' && res !== '0') displayErr(lang.processing_error);

                    }); // ajax

                }, false, lang.Messenger_btn_confirm_blacklist); // confirmation

        },
        this.hideConversation = function(e, el) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var send = jAjax(self.ajax_url, 'post', 'cmd=hideConversation&userid=' + escape(self.curr_recipient));
            send.done(function(res) {

                if (res == '1') {

                    self.switchToNextConv();
                } else {
                    displayErr(lang.somethingWrong);
                }


            });
        },
        this.deleteConversation = function(e, el, page_id) {

            e.preventDefault();
            e.stopImmediatePropagation();

            self.confirm_act(jprintf(lang.pm_confirm_delete_conversation, self.recipient_fullname),
                function(event) {
                    var cmd = {
                        'cmd': 'delConversation',
                        'userid': escape(self.curr_recipient)
                    };
                    if (page_id > 0)
                        cmd['page'] = page_id;
                    var send = jAjax(self.ajax_url, 'post', cmd);
                    send.done(function(res) {

                        if (res == '1') {

                            self.switchToNextConv();
                        } else {
                            displayErr(lang.somethingWrong);
                        }
                    }); //ajax


                }, false, lang.delete_conversation); //confirm

        },
        this.swipeDeleteConv = function(e, el, callback) {

            evstop(e, 1);
            let page_id = 0;
            let conv_data = __j(el).parent();
            let conv_data_id = conv_data.attr('id');
            let user_id = conv_data_id.split('-')[1];
            let user_fullname = conv_data.attr('userfullname');
            let $el = __j(el).parent().find('.js__mob_del_conv_ids');

            if (conv_data_id.includes('_'))
                page_id = conv_data_id.split('_')[1];

            if ($el.hasClass('js__isgroup')) {

                // leave group
                messenger.exitGroup(e, escape($el.attr('id')), false, function(s) {

                    callback(s);

                });

            } else {

                // delete conversation
                self.confirm_act(jprintf(lang.pm_confirm_delete_conversation, user_fullname),
                    function(event) {
                        var cmd = {
                            'cmd': 'delConversation',
                            'userid': escape(user_id)
                        };
                        if (page_id > 0)
                            cmd['page'] = page_id;
                        var send = jAjax(self.ajax_url, 'post', cmd);
                        send.done(function(res) {

                            if (res == '1') {

                                //self.switchToNextConv();
                                callback('success');
                            } else {
                                callback('cancel');
                                displayErr(lang.somethingWrong);
                            }
                        }); //ajax


                    }, false, lang.delete_conversation,
                    function() {
                        callback('cancel');
                    }); //confirm
            }

        },
        this.toggleConvDetails = function(el, evt) {

            evt.preventDefault();
            el = __j(el);



            if (!el.hasClass('aria-hidden')) {
                el.addClass('aria-hidden');
                __j('#mess-user-details').addClass('__hidden').on(self.crossEvent(), function() {

                    __j(this).hide();

                });

            } else {
                el.removeClass('aria-hidden');
                __j('#mess-user-details').show().removeClass('__hidden').on(self.crossEvent(), function() {

                    __j(this).show();

                });

            }

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
        this.closeOpenContact = function() {

         /*   var send = jAjax(self.ajax_url, 'post', {
                'cmd': 'clear-messages-tick'
            });
            send.done(function(html) {
 
                __j('.js_messenger_sdata').replaceWith(html);
            });*/

            self.room_id;
            self.recipient_fullname;
            self.recipient_nickname = '';
            self._search_conv_messages = [];
            self.search_in_conv_curr_id = 0;
            self.attach_page = 1;
            self.page_id = 0;
            self.group_id = 0;
            self.default_color = chat_default_color;
            self.curr_theme = chat_default_theme;
            self.curr_recipient;
            self.shortcut_id_num;
            self.shortcut_id;
            self.more_contacts_page = 1;
            self.loaded_all_contacts = false;
            self.messenger_local_stream = false;
            self.beforeOpenContact_valid = false;
            self.user_not_found = false;
            self.user_privacy = 0;
            self.privacy_msg = '';
            self.recipient_user_id = 0;
            self.send_important = 0;
            self.conv_status = 200;
            self.msg_cannot_send = false;
            self.replies = {};  

            self.pmessenger.removeAttr('id');
            __j('.pmessenger-messages-list').addClass('empty');

            __j('.xweeWrt').text('');
            __j('.pmessenger-messages-list').removeAttr('rel').removeAttr('id');
            __j('#mess-right-col-userdetails').empty();
            __j('#pmessenger-contact-header').empty();
            __j('#mess-right-col-userdetails').empty();
            __j('#messenger_aria_options').empty();
            __j('.pmessenger-contact-a').removeClass('active');
            
            // update url 
                createUrl({
                    state: 'new'
                }, self.recipient_fullname, '/messenger');
        },
        this.show_contacts = function() {

            self.pmessenger.addClass('show_contacts').removeClass('vy_ms__mob_fscreen');
            self.pmessenger.find('#messages-tick').empty();
            messenger.disable_touchHolding();

            __j('html').removeClass('vy_msn_contactopened');

            self.closeOpenContact();

        },
        this.hide_contacts = function(no_animation) {
            const event = window.event || $.Event();
            evstop(event);

            var mess = self.pmessenger,
                contacts = __j('.pmessenger-contacts-list');

            self.pmessenger.addClass('vy_ms__mob_fscreen');
            self.pmessenger.find('#messenger_mob_new_count').html(0).hide();
            
            if (mess.hasClass('show_contacts'))
                mess.removeClass('show_contacts');
            /*
             // REMOVED THIS SLIDE ANIMATION
             
            if (mess.hasClass('show_contacts'))
                contacts.addClass('slideLeft').on(self.crossEvent() + '.contact_slider', function() {
                    mess.removeClass('show_contacts');
                    contacts.removeClass('slideLeft');
                    contacts.off(self.crossEvent() + '.contact_slider');

                });*/

        },
        this.checkUserPrivacy = function(uid, group_id, callback, cmd) {


            localStorage.setItem('ms-last-checked-contact', group_id > 0 ? 'GG' + group_id : uid);
            var send = jAjax(self.ajax_url, 'post', cmd, false, 'ms-last-open-check-' + uid);
            send.done(function(data) {

                var d = validateJson(data);
                callback(d);


            });

        },
        this.beforeOpenContact = function(el, evt, user_id, user_avatar, user_name, user_active, page_id, group_id, show_last_seen, online_privacy) {
        

            let cmd = {
                'cmd': 'check_privacy',
                'id': escape(user_id)
            };
            if (group_id > 0)
                cmd['group'] = escape(group_id);

            let url = self.ajax_url + '?' + $.param(cmd);

            if (_ms_Cache.exist(url)) {
                self.beforeOpenContact_valid = 1;
                return self.openContact(el, evt, user_id, user_avatar, user_name, user_active, page_id, group_id, show_last_seen, online_privacy);
            }

            const last_open_checked_contact = localStorage.getItem('ms-last-checked-contact');
            const last_open_contact = localStorage.getItem('ms-last-contact');
            self.stop_xhr('ms-last-open-check-' + last_open_checked_contact);
            self.stop_xhr('ms-color-' + last_open_contact);
            self.stop_xhr('ms-conv-' + last_open_contact);
            self.stop_xhr('ms-attach-' + last_open_contact);



            if (self.timeout_attach)
                clearTimeout(self.timeout_attach);

            if (self.timeout_opencontact)
                clearTimeout(self.timeout_opencontact);


            self.timeout_opencontact = setTimeout(function() {
                // check user privacy
                if (page_id <= 0)
                    self.checkUserPrivacy(user_id, group_id, function(d) {


                        switch (d.status) {

                            case 404:
                                self.user_not_found = 1;
                                break;

                            case 403:
                                self.user_privacy = d.privacy;

                                break;



                        }
                        self.privacy_msg = d.msg;
                        self.beforeOpenContact_valid = 1;
                        self.conv_status = d.status;
                        self.group_admin = d.group_admin;
                        self.openContact(el, evt, user_id, user_avatar, user_name, user_active, page_id, group_id, show_last_seen, online_privacy);
                        _ms_Cache.set(url, d);

                    }, cmd);
                else
                    self.openContact(el, evt, user_id, user_avatar, user_name, user_active, page_id, group_id, show_last_seen, online_privacy);


            }, 300);
         
        },
        this.stop_xhr = function(id) {

            if (vy_xhr.hasOwnProperty(id)) {
                vy_xhr[id].abort();
            }
        },
        this.removeMessengerLoading = function() {
            // remove loading
            self.pmessenger.find('.js_messenger_load_data').remove();
        },
        this.getUserActiveStatus = function(userid){
            
                                                let cnt = self.shortcut_id ? __j('#'+self.shortcut_id) : self.pmessenger;

 
                                                $.ajax({
                                                    url: 'https://'+CHAT_NODE_HOST+'/getrespectiveuserstatus',
                                                    contentType: 'application/json',
                                                    data: JSON.stringify({"domain": V_WS_ADDR,"user_clean_id":userid,"userid":socketId(userid)}),
                                                    type: 'POST',
                                                    success: function (data) {
                                                        
                                                        if(data.length){
                                                            cnt.find('.js_vytimeago_uon_'+userid).attr('datetime',iso8601(new Date()));
                                                            cnt.find('.js_vytimeago_2uon_'+userid).attr('datetime',iso8601(new Date()));
                                                            gwtlog._online_user(userid);
                                                             
                                                        } else {
                                                            
                                                            let send = jAjax(self.ajax_url,'post',{'cmd':'getuserLastActivity','id':escape(userid)});
                                                            send.done(function(datetime){ 
                                                                gwtlog._offline_user(userid,datetime);
                                                                cnt.find('.js_vytimeago_uon_'+userid).attr('datetime',datetime);
                                                                cnt.find('.js_vytimeago_2uon_'+userid).attr('datetime',datetime);
                                                                cnt.find('#contact-'+userid).removeData('lastseen').attr('data-lastseen',datetime);
                                                                const timeago_lang = script_lang || navigator.language.replace('-', '_');
                                                                if(cnt.find('.js_vytimeago_uon_'+userid).length)
                                                                timeago.render(cnt.find('.js_vytimeago_uon_'+userid)[0], timeago_lang);
                                                                if(cnt.find('.js_vytimeago_2uon_'+userid).length)
                                                                timeago.render(cnt.find('.js_vytimeago_2uon_'+userid)[0], timeago_lang);
                                                                
                                                            });
                                                        }
                                            
                                                         
                                                    },
                                                    error: function (xhr, status, error) {
                                                        console.log('Error Getting active status: ' + error.message);
                                                         
                                                    },
                                                });
            
        },
        this.openContact = async function(el, evt, user_id, user_avatar, user_name, user_active, page_id, group_id, show_last_seen, online_privacy) {
                evstop(evt, 1);
                el = __j(el);
                user_active = el.data('lastseen');
                // if the conversation is already opened, return false
                if (window.location.pathname === __j(el).attr('href') && self.messengerInitiated && !self.noNewUrl) return;

                if (!self.beforeOpenContact_valid && page_id <= 0 && user_id > 0)
                    return self.beforeOpenContact(el, evt, user_id, user_avatar, user_name, user_active, page_id, group_id, show_last_seen, online_privacy);

 
                self.messengerInitiated = true;
                self.curr_color = chat_default_color;
                self.msg_cannot_send = false;
                self.beforeOpenContact_valid = !1;
                self.attach_page = 1;
                self.event = evt;
                // generate room id
                self.last_msg_date = false;
                self.recipient_picture = user_avatar;
                self.recipient_fullname = user_name;
                self.group_id = group_id;
                self.recipient_nickname = '';
                self.replies = {}; 

                page_id = page_id > 0 ? page_id : 0;

                self.page_id = page_id;
                // get new room id
                self.room_id = generateRoomId(user_id, _U.i, page_id, group_id);


                var messenger_msg_list = __j('#pmessenger-messages-cnt > #messages-tick');

                if (group_id > 0)
                    __j('#pmessenger-messages-cnt').addClass('vy_ms__talkwithgroup');
                else
                    __j('#pmessenger-messages-cnt').removeClass('vy_ms__talkwithgroup');

                var c_header = __j('#pmessenger-contact-header');
                var user_details_col = __j('#mess-user-details');
                var mess_right_col_udetails = __j('#mess-right-col-userdetails');
                var mess_aria_options = __j('#messenger_aria_options');
                var mess_aria_privacy = __j('#messenger_aria_privacy');
                var mess_aria_group_members = __j('#mess-right-col-group-members');
                var mess_aria_group_members_cnt = __j('#messenger_aria_group_members');
                var mess_aria_attachments = __j('#mess-right-col-attachments');
                mess_right_col_udetails.empty();
                recipientId = user_id;
                self.recipient_user_id = user_id;
                var $contact_id = page_id ? __j('#contact-' + user_id + '_' + page_id) : (group_id > 0 ? __j('#contact-GG' + group_id) : __j('#contact-' + user_id));



                self.updateGlobalCount(user_id, page_id, group_id);
                setTimeout(function() {
                    gwtlog.updateTotalMessages();
                }, 50);
                

                __j('#mess-roomid,#upload_room_id').val(self.room_id);

                // for groups
                if (group_id > 0)
                    __j('#vy_ms__is_group_chat').val('GG' + group_id);

                // join to group 
                if (group_id > 0)
                    self.join_group(JSON.stringify({
                        'Room_id': socketId(self.room_id),
                        'Userid': socketId(_U.i),
                        'Userid_clean': _U.i,
                        'Group_id_clean': tonum(self.room_id)
                    }));


                // remove link preview
                __j('#messenger-link-preview').empty();

                if (self.hasTouchStartEvent){
                    __j('.js__smarphones_search').css('display', 'block');
                    __j('html').addClass('vy_msn_contactopened');
                }

                self.socket = sio;


                self.setUpVoiceVideoCallButtons();

                // update url 
                createUrl({
                    state: 'new'
                }, self.recipient_fullname, __j(el).attr('href'));
                self.noNewUrl = false;

                // update last opened contact
                localStorage.setItem('ms-last-contact', user_id);


                //window.addEventListener("touchstart", self.touchHandler, false)
                if (online_privacy == '0')
                    updateSessionContacts(user_id);

                if (group_id > 0)
                    updateSessionGroups(group_id);
 
                // close search
                messenger.close_search();


                if (!self.mdialog_hide_loader)
                    messenger_msg_list.html('<div class="pmessenger-loading-conv"></div>');
                self.mdialog_hide_loader = false;

                if (group_id > 0)
                    self.pmessenger.attr('id', 'messenger_GG' + group_id);
                else
                    self.pmessenger.attr('id', 'messenger_' + user_id + (page_id ? '_' + page_id : ''));

                self.pmessenger.find('.pmessenger-messages-list').removeClass('empty');

                self.pmessenger.find('.pmessenger-no-contacts').remove();

                self.pmessenger.find('.xweeWrt').text(user_name);

                if (group_id > 0)
                    self.pmessenger.find('.pmessenger-messages-list').attr({
                        'rel': 'contactid-GG' + group_id,
                        'id': 'room_' + self.room_id
                    });
                else
                    self.pmessenger.find('.pmessenger-messages-list').attr({
                        'rel': 'contactid-' + user_id + (page_id ? '_' + page_id : ''),
                        'id': 'room_' + self.room_id
                    });

                if (page_id)
                    self.pmessenger.find('.pmessenger-messages-list').removeAttr('class').addClass('pmessenger-messages-list js_chatwithpage js_chat_with_page_' + page_id);
                else if (group_id > 0)
                    self.pmessenger.find('.pmessenger-messages-list').removeAttr('class').addClass('pmessenger-messages-list js_chatwithgroup js_chat_with_group_' + group_id + ' js_groupchat_id_' + group_id);
                else
                    self.pmessenger.find('.pmessenger-messages-list').removeAttr('class').addClass('pmessenger-messages-list');




                self.pmessenger.find('#messenger_with_user').val(group_id > 0 ? '0' : user_id);
                self.pmessenger.find('#messenger_recipient_name').val(encodeURIComponent(self.recipient_fullname));
                self.pmessenger.find('#messenger_recipient_avatar').val(self.recipient_picture);
                self.pmessenger.find('#messenger_with_page').val(page_id ? page_id : 'none');
                self.pmessenger.find('#messenger_with_group').val(group_id > 0 ? group_id : 'none');

                if (group_id > 0)
                    self.pmessenger.find('.js__group_avatar').attr('src', user_avatar).attr('id', 'vy_messenger_group_id_' + group_id);

                self.pmessenger.find('#WD_tracks_PM>ul').empty();
                self.pmessenger.find('#WD_attach_files_PM').empty();

                if (group_id > 0) {
                    mess_aria_attachments.removeClass('expanded');
                    mess_aria_privacy.parent().removeClass('expanded');
                    // get group members
                    mess_aria_group_members_cnt.addClass('js__mess_aria_group_members_' + group_id);
                   /* let get_group_members = jAjax(self.ajax_url, 'post', {
                        'cmd': 'get-group-members',
                        'group': escape(group_id),
                        'action': 'all'
                    });
                    get_group_members.done(function(data) {

                        mess_aria_group_members.removeClass('__none');

                        let d = validateJson(data);
                        let members = '';
                        if (d.msg == "done") {

                            for (var i = 0; i < d.users.length; i++) {

                                let member = d.users[i];

                                members += '<a id="vy_ms__groupchat_member_online_' + member.id + '" data-timestamp="' + member.timestamp + '" onclick="evstop(event,1);' + (member.id == _U.i ? 'return;' : 'return messenger.prependContact(this,event,\'' + member.avatar + '\',\'' + member.fullname + '\',\'' + member.id + '\');') + '" href="/messenger/' + member.id + '" class="' + (member.online == 'yes' ? '' : '_offline') + ' vy_ms__groupchat_member__rightside js__groupchat_online_member"><div class="vy_ms__gcm01"><img src="' + member.avatar + '" /><i class="ic-online"></i></div><div class="ms_f55ce4"><username class="vy_ms__gcm02"><span class="js__vy_ms__gchatmembernickname">' + decodeURIComponent(($.trim(member.nickname) ? member.nickname : member.fullname)) + '</span>' + (member.admin == 'yes' ? '<span><i title="Administrator" class="glyphicon glyphicon-ok-sign"></i></span>' : '') + '</username><div class="ms_groupmemeber_lastseen js__group_user_online_' + member.id + '">' + member.online_text + '</div></div></a>';


                            }

                            mess_aria_group_members_cnt.html(members);

                        } else {

                            mess_aria_group_members_cnt.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');

                        }

                    });*/
                    let get_group_members_count = jAjax(self.ajax_url, 'post', {
                        'cmd': 'get-group-members-count',
                        'group': escape(group_id)
                    });
                    get_group_members_count.done(function(count) {
                        __j('.js__groupchat_total_members').removeClass('__none').text('(' + count + ')');
                    });

                    mess_right_col_udetails.html('<div class="xgrWfs">\
                <input type="hidden" class="ufullname' + self.room_id + '" value="' + user_name + '"/>\
                <div class="xgr54a"><img src="' + user_avatar + '" /></div>\
            <div class="gsgXAfwe2 __groupchat"><div class="xvgg2a">' + user_name + '</div>\
\
            </div>\
        </div>');

                } else {
                    //mess_aria_attachments.addClass('expanded');
                    mess_aria_privacy.parent().addClass('expanded');
                    mess_aria_group_members.addClass('__none');
                    mess_aria_group_members_cnt.empty();
                    mess_right_col_udetails.html('<div class="xgrWfs">\
                <input type="hidden" class="ufullname' + self.room_id + '" value="' + user_name + '"/>\
                <div class="xgr54a"><a href="' + (page_id ? '/vypage/' + page_id : '/vyuser/' + user_id) + '" ><img src="' + user_avatar + '" /></a></div>\
            <div class="gsgXAfwe2"><a href="' + (page_id ? '/vypage/' + page_id : '/vyuser/' + user_id) + '" ><div class="xvgg2a">' + user_name + '</div>\
            ' + (online_privacy == '0' ? '<div class="xvgg3a js_vytimeago_2uon_'+user_id+' global_user_online global_user_2online_' + user_id + '">' + user_active + '</div>' : '') + '</a>\
            </div><div class="_3-ne"><div class="_3d85"><div class="_5blh _4-0h soh-s" role="button" tabindex="0">\
            <ul class="user_more_act foh-s">' +
                        (page_id || group_id > 0 ? '' : '<li><A href="javascript:void(0);" onclick="messenger.contactToBlacklist(event,this);">' + lang.messenger_block_user + '</a></li>') +
                        '<li style="display:none;"><A href="javascript:void(0);" onclick="messenger.hideConversation(event,this);">' + lang.pm_hide_convers + '</a></li>\
            <li><A href="javascript:void(0);" onclick="messenger.deleteConversation(event,this,' + page_id + ');">' + lang.pm_delete_convers + '</a></li>\
            </ul>\
            </div></div></div>\
            \
            \
        </div>');
        //timeago.render(__j('.js_vytimeago_uon_'+user_id)[0], navigator.language.replace('-', '_'));
                }


                mess_aria_options.html('<div class="_3szo" onclick="return messenger.search(' + user_id + ',' + page_id + ',' + group_id + ');" tabindex="0"><div class="_3szp"><div class="_6b45">' + self.svgi.js.search + '</div></div>\
<div class="_3szq">' + lang.Messenger_Search_in_conversation + '</div></div>\
\
\
' + (page_id || (group_id > 0 && self.group_admin <= 0) ? '' : '<div onclick="messenger.changeColor(' + user_id + ',' + group_id + ');" class="_3szo" tabindex="0"><div class="_3szp"><div class="_17vc">' + self.svgi.js.change_color + '</div></div>\
<div class="_3szq">' + lang.Messenger_Change_color + '</div></div>') +
                    (page_id ? '' : '<div onclick="messenger.setNicknames(' + user_id + ',\'' + encodeURIComponent(user_name) + '\',' + group_id + ');" class="_3szo"><div class="_3szp"><div class="_5odt">' + self.svgi.js.change_nickname + '</div></div>\
    <div class="_3szq">' + lang.Messenger_Edit_nickname + '</div></div>'));


                mess_aria_privacy.html((page_id ? '' : '<div onclick="messenger.muteContact(' + user_id + ',' + group_id + ');" class="_3szo _6y4w" role="button" tabindex="0">\
    <div class="_3szp">\
        <div class="_6ybz">' + self.default_md_ic(user_id, group_id) + '</div>\
    </div>\
    <div class="_3szq _6b46">' + lang.Messenger_Notifications + '</div>\
</div>') +
                    (page_id || group_id > 0 ? '' : '<div class="_3szo _6y4w" role="button" tabindex="0" onclick="messenger.contactToBlacklist(event,this);">\
    <div class="_3szp">\
        <div class="_7hu1">' + self.svgi.js.blacklist + '</div>\
    </div>\
    <div class="_3szq">' + lang.messenger_block_user + '</div>\
</div>') +
                    '<div class="_3szo _6y4w" role="button" tabindex="0" ' + (group_id > 0 ? 'onclick="messenger.exitGroup(event,' + group_id + ');"' : 'onclick="messenger.deleteConversation(event,this,' + page_id + ');"') + '>\
    <div class="_3szp">\
        <div class="_7hu0">' + self.svgi.js.clear_group + '</div>\
    </div>\
    <div class="_3szq">' + (group_id > 0 ? lang.Messenger_Leave_Group : lang.pm_delete_convers) + '</div>\
</div>');

                let _top_svg_size = 35;
                var messenger_toggle_right_info = '<ul class="_fl2">\
' + (page_id || group_id > 0 ? '' : '<li><a id="start-audio-chat" onclick="javascript:void(0);" class="_30yy" role="button" aria-expanded="true" data-testid="info_panel_button" href="javascript:void(0);">\
<div aria-label="' + lang.messenger_start_voice_call + '" title="' + lang.messenger_start_voice_call + '" data-testid="startVoiceCall" style="height: ' + _top_svg_size + 'px; width: ' + _top_svg_size + 'px;">' + self.svgi.js.audio_call.replace('%title', lang.messenger_start_voice_call) + '</div></a></li>\
<li><a id="start-video-chat" class="_30yy" role="button" aria-expanded="true" data-testid="info_panel_button" href="javascript:void(0);">\
<div aria-label="' + lang.messenger_start_video_call + '" title="' + lang.messenger_start_video_call + '" data-testid="startVideoCall" style="height: ' + _top_svg_size + 'px; width: ' + _top_svg_size + 'px;">' + self.svgi.js.video_call.replace('%title', lang.messenger_start_video_call) + '</div></a><div class=""></div></li>') +

                    '<li id="mobile_mess_settings"><a onclick="messenger.open_mobile_settings(event,this,' + group_id + ',' + page_id + ');" class="_30yy" href="javascript:void(0);">\
<div class="vymsn_mob_morest"> <span class="material-symbols-outlined">more_vert</span></div>\
</a></li>\
' + (self.hasTouchStartEvent && page_id > 0 ? '<li class="vy_ms__mob_fullscreen"><a onclick="messenger.toFullScreen(event);" class="_30yy" role="button" aria-expanded="true" data-testid="info_panel_button" href="javascript:void(0);">\
                                                      <div style="height: ' + _top_svg_size + 'px; width: ' + _top_svg_size + 'px;">' + self.svgi['js']['mobile']['fullscreen'] + '</div></a>\
                                                          <div aria-owns="js_8"></div></li>' : '') + '\
<li><a onclick="messenger.generatedropdownmenu(\'conv_opts\','+user_id+','+group_id+','+page_id+',\'' + encodeURIComponent(user_name) + '\');" class="_30yy" role="button" aria-expanded="true" data-testid="info_panel_button" href="javascript:void(0);">\
                                                      <div style="height: ' + _top_svg_size + 'px; width: ' + _top_svg_size + 'px;"><span class="material-symbols-outlined vymsn54x">more_vert</div></a>\
                                                          <div aria-owns="js_8"></div></li>\
                                          </ul>';




                var getChatColors = function(page_id, group_id) {

                    if (page_id) return self.colorateStrokes(chat_default_color);
                    let cmd = {
                        'cmd': 'getChatCurColor',
                        'userid': escape(user_id)
                    };

                    if (group_id > 0) cmd['group'] = escape(group_id);

                    // get color
                    var send = jAjax(self.ajax_url, 'post', cmd, false, 'ms-color-' + user_id);

                    send.done(function(data) {  
                        data = validateJson(data);
                        self.curr_color = data.color;
                        self.curr_theme = data.theme;
                        __j('#mess-curr-color').val(data.color);
                        __j('#mess-curr-theme').val(data.theme);
                        self.applyTheme(data.theme);
                        self.colorateStrokes(data.color);
                        
                    });
                }
                const get_conversation = {
                    'cmd': 'getConversation',
                    'userid': escape(user_id)
                };
                if (page_id > 0)
                    get_conversation['page'] = escape(page_id);

                if (group_id > 0)
                    get_conversation['group'] = escape(group_id);


                var send = await jAjax(self.ajax_url, 'post', get_conversation, false, 'ms-conv-' + user_id, 'conversation:' + window.location.pathname);

                if (send.hasOwnProperty('localcache')) {
                    var d = send.data;
                } else {
                    var d = send;
                }
             

                __j('.pmessenger-contact-a').removeClass('active');
                __j(el).addClass('active');

                self.curr_recipient = user_id;

                setTimeout(function() {
                    self.hide_contacts();
                }, 50);

                //  send.done(function(data) { 
 


                let conv_loaded = function(d) {
         
 
                    d = validateJson(d);
                    var last_message_id;

                    var t = '';
                    self.pmessenger.find('.js__vymsn_no_opencontact').remove();
                    self.pmessenger.find('#messenger_page_admin').val(d.page_admin);
                    if ($.trim(d.nickname)) {

                        self.recipient_nickname = d.nickname;
                    }
                    revert_scrollbar();
                    if (d.count > 0) {
  

                        var author_last_msg, last_avatar;
                        var avatar = true;
                        var last_date;

                        if (page_id > 0) {
                            self.pmessenger.find('#is_chat_with_page').val(page_id);
                            self.pmessenger.find('#inphd_page_avatar').attr('src', d.page_avatar);
                        }
                        if (group_id > 0)
                            self.pmessenger.find('#messenger_group_nickname').val(d.nickname);


                        for (var i = 0; i < d.messages.length; i++) {

                            var msg = d.messages[i];

                            var seen_markup = '<div title="' + lang.mess_msg_seen + (group_id > 0 ? ' (' + msg.count_group_seen + ' ' + lang.people + ')' : '') + '" rel="tipsy" id="mess_sent_status" class="messenger_sent_Status mess-message-seen"><img src="' + d.recipient_avatar + '" border="0" /></div>';

                            var sent_markup = '<div title="' + lang.mess_sent_status + '" rel="tipsy" id="mess_sent_status" class="messenger_sent_Status"><i class="glyphicon messenger-sent-ic glyphicon-ok-sign"></i></div>';

                            if (author_last_msg != msg.from_id)
                                avatar = true;
                            else
                                avatar = false;


                            var l_dat = __j('.messenger_date_delim:first').text();
                            var hj = l_dat == msg.dateMonth ? true : false;

                            var $show_date = author_last_msg === msg.lastby && msg.date == last_date ? false : true;
                            $show_date = msg.date !== last_date && !hj && $show_date ? true : false;
                            var show_conv_date = $show_date ? '<div id="messenger_date_delim_' + msg.dateMonth + '" class="messenger_date_delim"><span>' + msg.dateMonth + '</span></div>' : '';

                            let show_username = (msg.from_id != author_last_msg && group_id > 0) ? msg.user_fullname : '';
                            let next_msg_from_id = typeof d.messages[i + 1] != 'undefined' ? d.messages[i + 1].from_id : 0;
                            let margin_for_groups = msg.from_id != author_last_msg && next_msg_from_id != _U.i && author_last_msg != _U.i ? 'vy_ms__group_msg_margin' : '';
                            let curr_avatar = (msg.from_id == _U.i ? '' : '<div class="sticky__txt_pmessenger-user-avatar"><img src="' + msg.user_avatar + '" /></div>');
                            t += show_conv_date + (msg.from_id != author_last_msg ? '<div data-group-id="' + msg.from_id + '" class="vy_ms__groupusermsgs ' + margin_for_groups + ' ' + (msg.from_id == _U.i ? 'me' : '') + '">' + curr_avatar : '') + self.getMessagesMarkup(msg, (msg.from_id == _U.i ? 'me' : ''), avatar, $show_date, msg.timestamp, show_username, msg.forwarded) + (next_msg_from_id != msg.from_id || next_msg_from_id == 0 ? '</div>' : '');



                            author_last_msg = msg.from_id;
                            last_avatar = (msg.from_id == _U.i ? 'me' : '');
                            last_date = msg.date;
                            __j('#vy_ms__lastmsg_timestamp').val(msg.timestamp);

                            if (msg.read == 'no' || msg.seen <= 0)
                                self.updateMessagesAsRead(msg.recipient, msg.id, {
                                    'userid': msg.recipient,
                                    'page_id': page_id
                                }, group_id);

                        }


                        self.pmessenger.find('#last-message-datetime').val(last_date);

                        var show_load_prev_btn = d.count_messages >= messenger_limit ? self.prev_messages_btn : '';
                        //messenger_msg_list.html('<div id="messenger-nano-content-fullheight">' + show_load_prev_btn + t + '</div>');
                        messenger_msg_list.html('<div class="nano"><div class="overthrow nano-content"><div id="messenger-nano-content-fullheight">' + show_load_prev_btn + t + '</div></div></div>');


                        // show the user icon to the last readed message
                        messenger_msg_list.find('.vyms__isread__yes:last').append(seen_markup.replace(/%color/g, __j('#mess-curr-color').val()));
                        messenger_msg_list.find('.vyms__isread__no').append(sent_markup.replace(/%color/g, __j('#mess-curr-color').val()));


                        self.startvenobox();
                        
                        

                        //self.swipeMsgToReply();

                        var check_for_last_msg = self.pmessenger.find('.pmessenger-message-txt:not(._me):last');
                        last_message_id = check_for_last_msg.length ? check_for_last_msg.attr('id').match(/\d/g).join('') : 0;
                        self.scrollChat();
                        setTimeout(function() {
                            self.scrollChat();
                        }, 100);




                    } else messenger_msg_list.html('<div class="messenger-no-messages"><div class="messenger-exp">' + d.exp + '</div><div class="messenger-sub">' + d.sub + '</div></div>');


                    var back_icon = '<a class="mm_button_back" href="javascript:void(0);"><div class="messenger_mob_new_count" id="messenger_mob_new_count">0</div><div class="messenger-search-arr" onclick="messenger.show_contacts();"><span class="material-symbols-outlined">arrow_back</div></a>';


                    if (group_id > 0) {
                        if (d.group_admin > 0 && !self.hasTouchStartEvent) {
                            let group_admin_dropdown = self.svgi.js.group_admin_dropdown;

                            c_header.html(back_icon + '<div class="fj4232xY"><div class="fj424xY"><a href="javascript:void(0);" onclick="messenger.openGroupAdmin(event,this,' + group_id + ');" class="vy_ms__group_admin_clickable">\
                                <div class="xveRafa"><img src="' + user_avatar + '" /></div>\
                                <div class="tr4565Saew">\
                                <div class="xweeWrt ellip">' + user_name + '<div class="vy_ms__group_admin_dropdown">' + group_admin_dropdown + '</div></div>\
                                <div class="mshortcut-u-last-active js__group_chat_stats" id="groupchat_header_stats_GG' + group_id + '"><div class="__none js__group_chat_typing"><div class="vy__js__typingingroup"><span class="js__groupstyping_markup"></span> <span class="vy__js__typing_group_usernames"></span></div></div><div class="js__group_chat_stats-inner"><span id="groupchat_total_members_' + group_id + '" class="groupchat_total_members js__groupchat_total_members"><div class="div-loader"></div></span>&nbsp;<span id="groupchat_online_members_' + group_id + '" class="groupchat_online_memebers js__groupchat_online_memebers"></span></div></div>\
                                </div></a></div>' + messenger_toggle_right_info + '</div>');


                        } else {

                            c_header.html(back_icon + '<div class="fj4232xY"><div class="fj424xY"><a href="javascript:void(0);" class="vy_ms__group_admin_clickable _notadmin">\
                                <div class="xveRafa"><img src="' + user_avatar + '" /></div>\
                                <div class="tr4565Saew">\
                                <div class="xweeWrt ellip">' + user_name + '</div>\
                                <div class="mshortcut-u-last-active js__group_chat_stats" id="groupchat_header_stats_GG' + group_id + '"><div class="__none js__group_chat_typing"><div class="vy__js__typingingroup"><span class="js__groupstyping_markup"></span> <span class="vy__js__typing_group_usernames"></span></div></div><div class="js__group_chat_stats-inner"><span id="groupchat_total_members_' + group_id + '" class="groupchat_total_members js__groupchat_total_members"><div class="div-loader"></div></span>&nbsp;<span id="groupchat_online_members_' + group_id + '" class="groupchat_online_memebers js__groupchat_online_memebers"></span></div></div>\
                                </div></a></div>' + messenger_toggle_right_info + '</div>');

                        }
                    } else {

                        c_header.html(back_icon + '<div class="fj4232xY"><div class="flex3224">\
                                <a href="' + (page_id ? '/vypage/' + page_id : '/vyuser/' + user_id) + '" ><div class="xveRafa"><img src="' + user_avatar + '" /></div>\
                                <div class="tr4565Saew">\
                                <div class="xweeWrt ellip">' + (self.recipient_nickname ? self.recipient_nickname : user_name.split(' ')[0]) + '</div>\
                                ' + (online_privacy == '0' ? '<div datetime="'+user_active+'" timeago-id="'+user_id+'" class="gre45af js_vytimeago_uon_'+user_id+' global_user_online global_user_online_' + user_id + '">' + user_active + '</div>' : '') + '\
                                </a></div></div>' + messenger_toggle_right_info + '</div>');
 
                                //timeago.render(__j('.js_vytimeago_uon_'+user_id)[0], navigator.language.replace('-', '_')); 

                    }



                    var bottom_message_write = self.pmessenger.find('.pmessenger-msg-list-contenteditable');
                    if (!self.emojiarea_created) { 
                        let size = 40;
                        let mobile_send_button = '<button title="' + lang.send + '" class="_mob_send_messages">' + self.svgi.js.mob_btn_send.replace(/%size/g, size) + '</button>';

                        self.pmessenger.find('.pmessenger-msg-list-contenteditable').html('<textarea id="messenger-send-contenteditable" style="display:none;" class="js_messenger-send-contenteditable"></textarea>');
                      if(!self.pmessenger.find('.pmessenger-msg-list-contenteditable').parent().find('._mob_send_messages').length) self.pmessenger.find('.pmessenger-msg-list-contenteditable').before(mobile_send_button);
                    if (is_smartphone()) {
                      self.text_val = self.pmessenger.find('.js_messenger-send-contenteditable').emojioneArea({

                            hideSource: false
                        });
                        
                        

                        setTimeout(function() {

 
                            getChatColors(page_id, self.group_id);

                            self.contenteditable = bottom_message_write.find('[contenteditable]');

                            self.removeMessengerLoading();


                            self.Typing_timeoutFunction = function() {
                                let nickname = self.pmessenger.find('#messenger_group_nickname').val();
                                $.trim(nickname) ? nickname : VY_USER_FN
                                self.typing_now = 0;
                                if (self.group_id > 0)
                                    self.socket.emit("vy_ms__groups_typing", JSON.stringify({
                                        'Typing': 'no',
                                        'Room': self.room_id,
                                        'Recipient_fn': $.trim(nickname) ? nickname : VY_USER_FN,
                                        'Recipient': _U.i,
                                        'Group': socketId(self.room_id)
                                    }));
                                else
                                    self.socket.emit("typing", JSON.stringify({
                                        'Typing': 'no',
                                        'Room': self.room_id,
                                        'Page_id': self.page_id,
                                        'Recipient': self.page_id > 0 ? _U.i + '_' + self.page_id : _U.i,
                                        'Userid': socketId(self.curr_recipient)
                                    }));

                            }



                            // touch 
                            if (self.hasTouchStartEvent)
                                self.initTouchEvents();


                            // send messages by button in mobile
                            __j(document).off('touchend.sendmessage click.sendmessage').on('touchend.sendmessage  click.sendmessage', '._mob_send_messages', function(e) {
                                evstop(e, 1);
 
                                messenger.send(self.contenteditable, e);
 
                                setTimeout(function() {
                                    self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))] = self.pmessenger.find('.js_messenger-send-contenteditable').data("emojioneArea").getText();//self.contenteditable.data("emojioneArea").getText();
                        
                               }, 500);
                            });

                            // send message by pressing ENTER key

                            self.contenteditable.off('keydown.mess_send').on('keydown.mess_send', function(e) {
                                evstop(e);
                                let that = this;
                                if (is_smartphone()) {

                                    if (e.keyCode == 13) {

                                        if (window.getSelection) {
                                            var selection = window.getSelection(),
                                                range = selection.getRangeAt(0),
                                                br = document.createElement("br");
                                            range.deleteContents();
                                            range.insertNode(br);
                                            range.collapse(false);


                                            selection.removeAllRanges();
                                            selection.addRange(range);

                                            return false;
                                        }
                                        return false;
                                    }

                                } else {

                                    setTimeout(function() {
                                        self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))] = typeof __j(that).data("emojioneArea") != 'undefined' ? __j(that).data("emojioneArea").getText() : '';
                                    }, 500);

                                    if (e.keyCode == 13 && e.shiftKey == 0 && !is_smartphone()) {

                                        return messenger.send(this, e);
                                    }

                                }

                            }).off('paste').on('paste', function(editor) {
                                setTimeout(function() {
                                    self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))] = self.text_val.data("emojioneArea").getText();
                                }, 200);
                                self.pasteMessages(this, editor, page_id, self.group_id);
                            });

                            // typing
                            self.contenteditable.off('keypress.mess_typing').on('keypress.mess_typing', function(e) {

                                evstop(e);
                                let nickname = self.pmessenger.find('#messenger_group_nickname').val();
                                if (!self.typing_now) {

                                    clearTimeout(self.timeout_typing);
                                    if (self.group_id > 0)
                                        self.socket.emit("vy_ms__groups_typing", JSON.stringify({
                                            'Typing': 'yes',
                                            'Room': self.room_id,
                                            'Recipient_fn': $.trim(nickname) ? nickname : VY_USER_FN,
                                            'Recipient': _U.i,
                                            'Group': socketId(self.room_id)
                                        }));
                                    else
                                        self.socket.emit("typing", JSON.stringify({
                                            'Typing': 'yes',
                                            'Room': self.room_id,
                                            'Recipient': self.page_id > 0 ? _U.i + '_' + self.page_id : _U.i,
                                            'Page_id': self.page_id,
                                            'Userid': socketId(self.curr_recipient)
                                        }));

                                    self.typing_now = 1;

                                }

                            });
                            self.contenteditable.off('keyup.mess_typing').on('keyup.mess_typing', function(e) {
                                clearTimeout(self.timeout_typing);
                                self.timeout_typing = setTimeout(self.Typing_timeoutFunction, 1200);
                            });


                            self.contenteditable.attr('placeholder', lang.pm_emoji_placeholder + '...');
                            __j('.ms_items_more_wrap').addClass('__none');
                            __j('.comments_attach_trigger_ic').click();
 
                            bottom_message_write.append(self.get_bottom_mess_buttons(false, false, page_id, group_id));
                            setTimeout(function() {
                                bottom_message_write.find('#messenger-recording-button').trigger('click');
                            }, 1000);

                            self.contenteditable.off('focus active').on('focus active', function(e) { 

 
                                clearTimeout(self.mobile_btn_timeout);
                                if (self.hasTouchStartEvent) {

                                    var send_btn_size = {
                                        width: 65,
                                        height: 65
                                    };
 
                                    self.pmessenger.find('.js__4rv4').hide();
                                    self.pmessenger.find('._mob_send_messages').show();
                                    self.pmessenger.find('.emojionearea').addClass('show_h-12x');
                                    self.pmessenger.find('#messages-tick').addClass('__disabled_layer');
                                    self.pmessenger.find('#messenger-recording-button').hide();
                                    setTimeout(function() {
                                        var nano = self.pmessenger.find("#messages-tick .nano");
                                        
                                        if(!self.reply_enabled)
                                            nano.nanoScroller({
                                                scroll: 'bottom'
                                            });
                                    }, getMobileOperatingSystem() == '_ios' ? 500 : 1000);

                                    if (!self.html.hasClass('vy_ms__focused'))
                                        self.mob_focus_timeout = setTimeout(function() {
                                            self.contenteditable.focusEnd();
                                            self.html.addClass('vy_ms__focused');
                                        }, 10);
                                }

                            }).off('blur').on('blur', function() { 

                                if (self.hasTouchStartEvent) {
                                    clearTimeout(self.mob_focus_timeout);
                                    self.mobile_btn_timeout = setTimeout(function() {  
                                        self.html.removeClass('vy_ms__focused');
                                        self.pmessenger.find('._mob_send_messages').hide();
                                        self.pmessenger.find('#messenger-recording-button').show();
                                        self.pmessenger.find('.emojionearea').removeClass('show_h-12x');
                                        self.pmessenger.find('.js__4rv4').show();
                                        self.pmessenger.find('#messages-tick').removeClass('__disabled_layer');
                                        self.contenteditable.removeAttr('style');

                                    }, 10);
                                }


                            });


                        },1500);
                        self.emojiarea_created = true;
                        
  
                        
 } else {
                      self.text_val = self.pmessenger.find('.js_messenger-send-contenteditable').emojioneArea({

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
                            }
                        });


 
                        self.text_val[0].emojioneArea.on("ready", function(button, event) {

 
                            getChatColors(page_id, self.group_id);

                            self.contenteditable = bottom_message_write.find('[contenteditable]');

                            self.removeMessengerLoading();

                            self.Typing_timeoutFunction = function() {
                                let nickname = self.pmessenger.find('#messenger_group_nickname').val();
                                $.trim(nickname) ? nickname : VY_USER_FN
                                self.typing_now = 0;
                                if (self.group_id > 0)
                                    self.socket.emit("vy_ms__groups_typing", JSON.stringify({
                                        'Typing': 'no',
                                        'Room': self.room_id,
                                        'Recipient_fn': $.trim(nickname) ? nickname : VY_USER_FN,
                                        'Recipient': _U.i,
                                        'Group': socketId(self.room_id)
                                    }));
                                else
                                    self.socket.emit("typing", JSON.stringify({
                                        'Typing': 'no',
                                        'Room': self.room_id,
                                        'Page_id': self.page_id,
                                        'Recipient': self.page_id > 0 ? _U.i + '_' + self.page_id : _U.i,
                                        'Userid': socketId(self.curr_recipient)
                                    }));

                            }



                            // touch 
                            if (self.hasTouchStartEvent)
                                self.initTouchEvents();


                            // send messages by button in mobile
                            __j(document).off('touchend.sendmessage click.sendmessage').on('touchend.sendmessage  click.sendmessage', '._mob_send_messages', function(e) {
                                evstop(e, 1);
 
                                messenger.send(self.contenteditable, e);
 
                                setTimeout(function() {
                                    self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))] = self.contenteditable.data("emojioneArea").getText();
                        
                               }, 500);
                            });

                            // send message by pressing ENTER key
              
                            self.contenteditable.off('keydown.mess_send').on('keydown.mess_send', function(e) {
                                evstop(e);
                                let that = this;
                                if (is_smartphone()) {

                                    if (e.keyCode == 13) {

                                    if (window.getSelection) {
                                            var selection = window.getSelection(),
                                                range = selection.getRangeAt(0),
                                                br = document.createElement("br");
                                            range.deleteContents();
                                            range.insertNode(br);
                                            range.collapse(false);


                                            selection.removeAllRanges();
                                            selection.addRange(range);

                                            return false;
                                        }
                                        return false;
                                    }

                                } else {
 
                                    setTimeout(function() {
                                        self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))] = typeof __j(that).data("emojioneArea") != 'undefined' ? __j(that).data("emojioneArea").getText() : '';
                                    }, 500);

                                    if (e.keyCode == 13 && e.shiftKey == 0 && !is_smartphone()) {

                                        return messenger.send(this, e);
                                    }  

                                }

                            }).off('paste').on('paste', function(editor) {
                                setTimeout(function() {
                                    self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))] = self.text_val.data("emojioneArea").getText();
                                }, 200);
                                self.pasteMessages(this, editor, page_id, self.group_id);
                            });

                            // typing
                            self.contenteditable.off('keypress.mess_typing').on('keypress.mess_typing', function(e) {

                                evstop(e);
                                let nickname = self.pmessenger.find('#messenger_group_nickname').val();
                                if (!self.typing_now) {

                                    clearTimeout(self.timeout_typing);
                                    if (self.group_id > 0)
                                        self.socket.emit("vy_ms__groups_typing", JSON.stringify({
                                            'Typing': 'yes',
                                            'Room': self.room_id,
                                            'Recipient_fn': $.trim(nickname) ? nickname : VY_USER_FN,
                                            'Recipient': _U.i,
                                            'Group': socketId(self.room_id)
                                        }));
                                    else
                                        self.socket.emit("typing", JSON.stringify({
                                            'Typing': 'yes',
                                            'Room': self.room_id,
                                            'Recipient': self.page_id > 0 ? _U.i + '_' + self.page_id : _U.i,
                                            'Page_id': self.page_id,
                                            'Userid': socketId(self.curr_recipient)
                                        }));

                                    self.typing_now = 1;

                                }


                            });
                            self.contenteditable.off('keyup.mess_typing').on('keyup.mess_typing', function(e) {
                                clearTimeout(self.timeout_typing);
                                self.timeout_typing = setTimeout(self.Typing_timeoutFunction, 1200);
                            });


                            self.contenteditable.attr('placeholder', lang.pm_emoji_placeholder + '...');
                            __j('.ms_items_more_wrap').addClass('__none');
                            __j('.comments_attach_trigger_ic').click();

                            bottom_message_write.append(self.get_bottom_mess_buttons(false, false, page_id, group_id));
                            setTimeout(function() {
                                bottom_message_write.find('#messenger-recording-button').trigger('click');
                            }, 1000);
                            self.contenteditable.get(0).addEventListener("focus", function(e){

                          clearTimeout(self.mobile_btn_timeout);
                                if (self.hasTouchStartEvent) {

                                    var send_btn_size = {
                                        width: 65,
                                        height: 65
                                    };

                                    self.pmessenger.find('.js__4rv4').hide();
                                    self.pmessenger.find('._mob_send_messages').show();
                                    self.pmessenger.find('.emojionearea').addClass('show_h-12x');
                                    self.pmessenger.find('#messages-tick').addClass('__disabled_layer');

                                    setTimeout(function() {
                                        var nano = self.pmessenger.find("#messages-tick .nano");
                                        
                                        if(!self.reply_enabled)
                                            nano.nanoScroller({
                                                scroll: 'bottom'
                                            });
                                    }, getMobileOperatingSystem() == '_ios' ? 500 : 1000);

                                    if (!self.html.hasClass('vy_ms__focused'))
                                        self.mob_focus_timeout = setTimeout(function() {
                                            self.contenteditable.focusEnd();
                                            self.html.addClass('vy_ms__focused');
                                        }, 10);
                                }


                            });
                            self.contenteditable.get(0).addEventListener("blur", function(e){
                                if (self.hasTouchStartEvent) {
                                    clearTimeout(self.mob_focus_timeout);
                                    self.mobile_btn_timeout = setTimeout(function() {
                                        self.html.removeClass('vy_ms__focused');
                                        self.pmessenger.find('._mob_send_messages').hide();
                                        self.pmessenger.find('.emojionearea').removeClass('show_h-12x');
                                        self.pmessenger.find('.js__4rv4').show();
                                        self.pmessenger.find('#messages-tick').removeClass('__disabled_layer');
                                        self.contenteditable.removeAttr('style');

                                    }, 10);
                                }
                            });
                           /* self.contenteditable.off('focus').on('focus', function(e) {



      
                            }).off('blur').on('blur', function() {



                            });*/


                        }).off('click').on('click', function(editor, event) { 
                            if(!is_smartphone())
                            __j(event.target).closest('.pmessenger-msg-list-contenteditable').find('.js_messenger-send-contenteditable')[0].emojioneArea.hidePicker();
                        }).off('emojibtn.click').on('emojibtn.click', function(button, event) {

                            evstop(event,1);

                            setTimeout(function() {
                                self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))] = self.text_val.data("emojioneArea") != 'undefined' ? self.text_val.data("emojioneArea").getText() : '';
                            }, 200);
                        });
                        self.emojiarea_created = true;
 
                         }
                        
                    }


                    if (self.drafts.hasOwnProperty((self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))))
                        self.text_val.data("emojioneArea").setText(self.drafts[(self.group_id > 0 ? 'GG' + self.group_id : (self.page_id > 0 ? self.page_id + '_' + self.curr_recipient : self.curr_recipient))]);
                    else
                        self.text_val.data("emojioneArea").setText('');

                    if (typeof self.contenteditable != 'undefined') self.contenteditable.focusEnd();

                    // add all media buttons for non-page chat  
                    if (page_id <= 0) {

                        bottom_message_write.find('.js__4rv4').replaceWith(self.get_bottom_mess_buttons());

                    } else {

                        bottom_message_write.find('.js__4rv4').replaceWith(self.get_bottom_mess_buttons(false, false, page_id));
                    }

                    if (!self.hasTouchStartEvent)
                        self.timeout_attach = setTimeout(function() {
                            self.getAttachments(user_id);
                        }, self.attach_draft.hasOwnProperty(user_id) ? 500 : 3000);

                    setTimeout(function() {
                        bottom_message_write.find('#messenger-recording-button').trigger('click');
                    }, 1000);
                    getChatColors(page_id, group_id);
                    nanoScrollStart();


                    // auto load old messages on scrolling up
                    let nano = self.pmessenger.find("#messages-tick .nano");
                    nano.off('scrolltop.a' + self.randId).on('scrolltop.a' + self.randId, function(e) {
                        evstop(e, 1);
                        self.pmessenger.find('[uid="mdialog_prev_btn_ld"]').trigger('click');

                    });
                    // auto load more attachaments on scrolling down
                    let _load_more_attachments = self.pmessenger.find("#mess-user-details.nano");
                    _load_more_attachments.off('scrollend.b' + self.randId).on('scrollend.b' + self.randId, function(e) {
                        evstop(e, 1);
                        self.load_more_attachments(e, user_id);

                    });
                    // auto load more contacts on scrolling down
                    let _load_more_contacts = self.pmessenger.find("#messenger-contacts-last.nano");
                    _load_more_contacts.off('scrollend.c' + self.randId).on('scrollend.c' + self.randId, function(e) {
                        evstop(e, 1);
                        self.pmessenger.find('.messenger-load-more-contacts-loader>a').trigger('click');

                    });

                    // remove meesage count from left side for respective contact
                    $contact_id.removeClass('_newmessages').find('.convo__unread.in_messenger').remove();

                    if (d.blacklist == 1) self.isInBlackList();
                    else self.removeBlacklist();


                    if (self.user_not_found || (self.user_privacy > 0 && self.conv_status != 200)) {

                        self.msg_cannot_send = 1;
                        return self.privacy_html(self.privacy_msg);

                    }
                    self.lazyLoad();
                    self.join_rooms();

                    /*if(group_id > 0){
                        let group_avatar = __j('.pmessenger #vy_messenger_group_id_' + group_id).length ? __j('#vy_messenger_group_id_' + group_id).attr('src') : __j('#vy_shortcut_group_id_' + group_id).attr('src');
                        self.socket.emit("group_seen", JSON.stringify({
                            "Msg_id": last_message_id,
                            "Userid": socketId(user_id),
                            "Recipient_id": _U.i,
                            "Group_id": group_id,
                            "Group":socketId('GG'+group_id),
                            "Page_id": page_id,
                            "Recipient_avatar": _U.p,
                            "Group_avatar": encodeURIComponent(group_avatar)
                        }));
                    } */


                    //  });
                }

                _ms_Cache.set('conversation:' + window.location.pathname, d, conv_loaded);
                self.updateSeenInCacheMessages({
                    'page_id': page_id,
                    'group_id': group_id,
                    'user_id': user_id
                });

                // enable reations
                if(!self.hasTouchStartEvent)
                    self.enable_reactions();
                
                // get user online status 
                if( (page_id <=0 || !page_id) && (group_id <=0 || !group_id))
                    self.getUserActiveStatus(user_id);

               self.makeLeftSideResizable();
               self.loadVoiceClips();
               startTippy();
               //self.generateVideoPlayer();

               
            },

            this.makeLeftSideResizable = function(){

                __j('#vymsn_sidebarresizable').resizable({
                    minWidth : 292,
                    maxWidth: 550
                });
            },
            this.loadVoiceClips = function(){

                __j('.vymns_voice_clips').each(function(){
                    const audioDuration = __j(this).parent().find('.vymsn_duration');
                    const audio = __j(this).get(0);

                     
                audio.onloadedmetadata = () => { 
                    let h = 0; 
                    let m = Math.floor(audio.duration / 60)
                    let s = Math.floor(audio.duration - m * 60)
                    audioDuration.html([h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(x => x).join(':'));
                }
                audio.load();
                audio.onended = function() {
                    __j(this).parent().find('.vymsn_play-button').removeClass('vymsn_playing');
                };

                });

            },
            this.toggleAudio = function(event,el){
                evstop(event);
                _el = __j(el);

                const audio = _el.find('.vymns_voice_clips').get(0);
                const audioDuration = _el.find('.vymsn_duration');
                const playButton = _el.find('.vymsn_play-button');

                    if (!playButton.hasClass('vymsn_playing'))
                        self.stopOtherVoicesclips();

                    if (playButton.hasClass('vymsn_playing')) {
                        audio.pause();
                        playButton.removeClass('vymsn_playing');
                    } else {
                        audio.play();
                        playButton.addClass('vymsn_playing');
                    }

            },
            this.stopOtherVoicesclips = function (){
            __j('.vymns_voice_clips').each(function(){

                __j(this).parent().find('.vymsn_play-button').removeClass('vymsn_playing');
                __j(this).get(0).pause();
            });

            },
            this.mob_message_options_markup = function(msg_id){
                
                let menu = {}, full_menu = '', text_to_copy = localStorage.getItem('vy_ms__mob_clipboardtxt'), ccr = 'ccp_' + self.random_id();
                
                menu['reply'] = '<li data-reply="'+msg_id+'" onclick="messenger.reply(this,event);messenger.closeMessageOptions_MOB();" class="vy_ms_mob_msg_option"><div class="vy_ms_mob_msg_optionic">'+self.svgi.js.reply+'</div><div class="vy_ms_mob_msg_optiontxt">'+lang.Messenger_reply+'</div></li>';
                menu['forward'] = '<li data-forward="'+msg_id+'" onclick="messenger.forward(this,event);" class="vy_ms_mob_msg_option"><div class="vy_ms_mob_msg_optionic">'+self.svgi.js.forward+'</div><div class="vy_ms_mob_msg_optiontxt">'+lang.Messenger_forward+'</div></li>';
                menu['copy'] = '<li data-clipboard-text="'+text_to_copy+'" onclick="messenger.mob_copy_message(event,\''+ccr+'\');" touchend="messenger.mob_copy_message(event,\''+ccr+'\');" class="vy_ms_mob_msg_option '+ccr+'"><div class="vy_ms_mob_msg_optionic">'+self.svgi.js.copy+'</div><div class="vy_ms_mob_msg_optiontxt">'+lang.Messenger_mob_copy_msg+'</div></li>';
                menu['remove'] = '<li uid="mob-delete-message" class="vy_ms_mob_msg_option"><div class="vy_ms_mob_msg_optionic">'+self.svgi.js.remove_message+'</div><div class="vy_ms_mob_msg_optiontxt">'+lang.Messenger_remove_message+'</div></li>';
                
                for(var x in menu)
                    full_menu += menu[x];
                
                return `<ul id="vy_ms_mob_message_options_menu">${full_menu}</ul>`;
                
            },
            this.closeMessageOptions_MOB = function(){
         
                __j('#vy_ms_mob_message_options_menu').remove();
                
            },
            this.mob_copy_message = function(ev,ccr){
                
                    let clipboard = new ClipboardJS('.' + ccr);
                    clipboard.on('success', function(e) {
                        localStorage.removeItem('vy_ms__mob_clipboardtxt');
                        e.clearSelection();
                        ev.preventDefault();
                    });

                    clipboard.on('error', function(e) {});
 
 
            },
            this.touch_open_message_options = function(e,el){
                
                evstop(e,1);
                
                el = __j(el);
                
                let s_msg = __j(el).closest('.pmessenger-message-txt'), c = "#vy_ms_mob_message_options_menu", footer = '.js__pmessenger_footer', msg_id = tonum(s_msg.attr('id'));
                
                
                __j(footer).parent().find(c).remove();
                
                if(!__j(c).length){
                     
                    __j(footer).before(self.mob_message_options_markup(msg_id));
                    
                    __j(footer).parent().find('[uid="mob-delete-message"]').off('click.delete_message_mob touchend.delete_message_mob').on('click.delete_message_mob touchend.delete_message_mob',function(e){
                        
                        self.delete_message(s_msg.find('[uid="delMsg"]'), e);
                        
                    });
                    
                    // enable reactions
                    self.mob_enable_reactions(s_msg.find('[data-react="1"]'));
                    
                    // scroll to bottom if its called last child.
                    if(__j(el).parent().is(':last-child')){  
                        __j("#messages-tick .nano").nanoScroller({scroll: 'bottom'});
                    }
                }
         
                __j(document).off('click.removeMessageOptions').on('click.removeMessageOptions', function(e){
                    evstop(e,1);
                    self.closeMessageOptions_MOB();
                });
     
                
            },
            this.delete_messages_by_touch_holding = function() {


                var holding_touch_timer_color;
                var touchDuration = 600;

                var delete_touch_msg = function(el, e) {

                    localStorage.setItem('noLightGallery', 1);
                    localStorage.setItem('vy_ms__mob_clipboardtxt', __j(el).parent().find('.txt_pmessenger-text').text());
                    self.enable_copytoclipboard_mob_btn = !0;
                    //self.delete_message(__j(el).parent().find('[uid="delMsg"]'), e);
                    self.touch_open_message_options(e,el);

                };
                
                //show message time
                __j(document).off('touchend.showMessageTime').on('touchend.showMessageTime', '.messenger_text_col', function(e) {


                    if (!__j(this).hasClass('touch-hover-time')) {

                        __j('.pmessenger .d_comment_r').each(function() {
                            __j('.touch-hover-time').removeClass('touch-hover-time');

                            __j(this).find('.d_comment_time').slideUp("fast", "linear", function() {

                                __j(this).parent().removeAttr('style');


                            });
                        });


                        __j(this).parent().find('.d_comment_r').css({
                            'opacity': '1',
                            'visibility': 'visible',
                            'display': 'inline'
                        });

                        __j(this).parent().find('.d_comment_time').slideDown("fast", "linear");
                        __j(this).addClass('touch-hover-time');
                    } else {
                        __j(this).parent().find('.d_comment_time').slideUp("fast", "linear", function() {

                            __j(this).parent().removeAttr('style');


                        });

                        __j(this).removeClass('touch-hover-time');
                    }
                });

                // delete message by holding on it
                __j(document).off('touchstart.deleteMessage').on('touchstart.deleteMessage', '.messenger_text_col', function(e) {
                    var ___this = this;



                    self.holding_touch_timer = setTimeout(function() {

                        self.clear_selection();
                        delete_touch_msg(___this, e);

                    }, touchDuration);
                });


                __j(document).off('touchend.deleteMessage').on('touchend.deleteMessage', '.messenger_text_col', function(e) {


                    if (self.holding_touch_timer)
                        clearTimeout(self.holding_touch_timer);


                    setTimeout(function() {
                        self.enable_selection();
                    }, 900);
                    localStorage.removeItem('noLightGallery', 1);

                });


            },
            this.initTouchEvents = function() {

                let EventHandler = new EventHandlerClass();

                __j(document).off('touchend.removeDisabled').on('touchend.removeDisabled', '#messages-tick', function(e) {
                    setTimeout(function() {
                        __j(this).removeClass('__disabled_layer');
                    }, 100);
                });



                let mTouchMove = function() {
                    self.disable_touchHolding();
                    //self.disable_selection();
                    localStorage.setItem('noLightGallery', 1);
                    if (self.holding_touch_timer)
                        clearTimeout(self.holding_touch_timer);
                };
                let mTouchStop = function() {

                    setTimeout(function() {
                        self.enable_touchHolding();
                        //self.enable_selection();
                        localStorage.removeItem('noLightGallery', 1);
                    }, 400);
                };

                this.touch_slide_to_delete();
                EventHandler.addEventListener("touchmove.messenger", mTouchMove, {
                    passive: false
                });
                EventHandler.addEventListener("touchend.messenger", mTouchStop, {
                    passive: false
                });



                self.delete_messages_by_touch_holding();

            },
            this.touch_slide_to_delete = function(){

                Swiped.init({
                    query: '.js_conv_swipe:not(._touchevent_binded)',
                    right: 1000,
                    tolerance: 1000,
                    onPrompt: function(evt, swipe_el, contact_element) {

                        self.swipeDeleteConv(event, contact_element, function(a) {

                            if (a == 'cancel')
                                swipe_el.close();
                            else {
                                swipe_el.open();

                                __j(contact_element).parent().slideUp(function() {
                                    __j(contact_element).remove();
                                });

                            }

                        });


                    },

                    onOpen: function() { 
                        this.destroy(true);

                    },
                    onClose: function() {

                    }
                });
            },
            this.swipeMsgToReply = function(){
                
                let trigger_reply = function(e,msg_elem,c){
                    
                    c('cancel');
                    
                    __j(msg_elem).closest('.pmessenger-message-txt').find('[uid="reply"]').trigger('click');
                    
                };
                
                let a2 = Swiped.init({
                    query: '.txt_pmessenger-text:not(._touchevent_binded)',
                    right: 5000,
                    tolerance: -20000,
                    onPrompt: function(evt, swipe_el, msg_elem) {

                        trigger_reply(event, msg_elem, function(a) {

                            if (a == 'cancel')
                                swipe_el.close();
                            else {
                               // swipe_el.open();

                              //  __j(msg_elem).parent().slideUp(function() {
                               //     __j(msg_elem).remove();
                              //  });

                            }

                        });


                    },

                    onOpen: function() {
                        this.destroy(true);

                    },
                    onClose: function() {

                    }
                });
                
                
            },
            this.enable_touchHolding = function() {

                self.delete_messages_by_touch_holding();
            },
            this.disable_touchHolding = function() {
                const EventHandler = new EventHandlerClass();

                __j(document).off('touchend.deleteMessage touchend.deleteMessage touchend.showMessageTime');

                EventHandler.removeEventListener("touchmove.messenger");
                EventHandler.removeEventListener("touchend.messenger");

            },
            this.enable_selection = function(a) {
                __j('html').removeClass('disable_select');

            },
            this.disable_selection = function(a) {
                __j('html').addClass('disable_select');

            },
            this.clear_selection = function() {

                if (window.getSelection) {
                    if (window.getSelection().empty) { // Chrome
                        window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) { // Firefox
                        window.getSelection().removeAllRanges();
                    }
                } else if (document.selection) { // IE?
                    document.selection.empty();
                }

            },
            this.load_more_attachments = function(e, id) {
                evstop(e, 1);

                ++self.attach_page;

                return self.getAttachments(id, self.attach_page);

            },
            this.mdialog_load_prev_messages = function(ev, ob) {
                ev.preventDefault();
                self.shortcut ? mess_shortcut(self.shortcut_id).mdialog_load_older_msgs(self.shortcut_id) : self.mdialog_load_older_msgs();
            },
            this.mdialog_load_older_msgs = function(shortcut_id) {



                // make compatible with pages & groups chat
                var page_id, n_group_id, new_user_id, for_page = '',
                    for_groups = '';
                if (shortcut_id && shortcut_id.includes('_')) {
                    new_user_id = tonum(shortcut_id.split('_')[0]);
                    page_id = shortcut_id.split('_')[1];
                    for_page = '&page=' + page_id;
                } else if (!shortcut_id && __j('.pmessenger .js_chatwithpage').length) {

                    new_user_id = __j('#messenger_with_user').val();
                    page_id = __j('#messenger_with_page').val();
                    for_page = '&page=' + page_id;
                } else if (!shortcut_id && __j('.pmessenger .js_chatwithgroup').length) {

                    n_group_id = __j('#messenger_with_group').val();
                    for_groups = '&group=' + n_group_id;
                } else if (shortcut_id && shortcut_id.includes('GG')) {

                    n_group_id = tonum(shortcut_id.split('GG')[1]);
                    for_groups = '&group=' + n_group_id;
                }

                var mdil_loader = self.shortcut_id ? self.shortcut.find('#id-prev-comm-link-w-msg-chat') : __j('#id-prev-comm-link-w-msg'),
                    last_msg_id_vport = self.shortcut_id ? self.shortcut.find('.pmessenger-message-txt:first').attr('id') : self.pmessenger.find('.pmessenger-message-txt:first').attr('id');
                var j_last_msg = self.shortcut_id ? self.shortcut.find('#' + last_msg_id_vport) : self.pmessenger.find('#' + last_msg_id_vport);
 
                if (mdil_loader.hasClass('in-progress') || !mdil_loader.length) return;

                mdil_loader.addClass('in-progress');

                var page,params = {};
                
                params['cmd'] = 'previous-messages';
                params['userid'] = (page_id ? escape(new_user_id) : (n_group_id ? escape(n_group_id) : escape(recipientId)));
                params['view_as'] = 'json';
                
                if(for_page)
                params['page'] = page_id;
                
                if(for_groups)
                params['group'] = n_group_id;
                
                
                if (shortcut_id) {
                    page = self.shortcut.find('#current_page').val();

                    self.shortcut.find('#current_page').val(parseInt(page) + 1);
                    page++;
                } else {


                    if(!self.msg_page.hasOwnProperty($.param(params)))
                        self.msg_page[$.param(params)] = 1;
                        
                         
                    ++self.msg_page[$.param(params)];
 
                    page = self.msg_page[$.param(params)];

                }

                params['pagecount'] = escape(page);
     
                var send = jAjax(self.ajax_url, 'post', params);
                send.done(function(res) {  
                    var data = validateJson(res);
                    mdil_loader.removeClass('in-progress');
                    if (data.exp == '1') {
                        mdil_loader.parent().remove();
                    } else {
                        var message_markup = '';
                        var author_last_msg;
                        var avatar = true;
                        var last_date;
                        let msgs_for_cache = new Array();
                        for (var i = 0; i < data.length; i++) {

                            if (author_last_msg != data[i].lastby)
                                avatar = true;
                            else
                                avatar = false;

 
                            var l_dat = self.shortcut_id ? self.shortcut.find('.messenger_date_delim:first').text() : __j('.pmessenger .messenger_date_delim:first').text();
                            var hj = l_dat == data[i].dateMonth ? true : false;

                            var $show_date = author_last_msg === data[i].lastby && data[i].date == last_date ? false : true;
                            $show_date = data[i].date !== last_date && !hj && $show_date ? true : false;
                            let show_conv_date = $show_date ? '<div id="messenger_date_delim_' + data[i].dateMonth + '" class="messenger_date_delim"><span>' + data[i].dateMonth + '</span></div>' : '';
                            let show_username = (data[i].from_id != author_last_msg && n_group_id > 0) ? data[i].user_fullname : '';
                            let next_msg_from_id = typeof data[i + 1] != 'undefined' ? data[i + 1].from_id : 0;
                            let curr_avatar = (data[i].from_id == _U.i ? '' : '<div class="sticky__txt_pmessenger-user-avatar"><img src="' + data[i].user_avatar + '" /></div>');
                            let margin_for_groups = data[i].from_id != author_last_msg && next_msg_from_id != _U.i && author_last_msg != _U.i ? 'vy_ms__group_msg_margin' : '';
                            message_markup += show_conv_date + (data[i].from_id != author_last_msg ? '<div data-group-id="' + data[i].from_id + '" class="vy_ms__groupusermsgs ' + margin_for_groups + ' ' + (data[i].from_id == _U.i ? 'me' : '') + '">' + curr_avatar : '') + self.getMessagesMarkup(data[i], (data[i].from_id == _U.i ? 'me' : ''), avatar, $show_date, data[i].timestamp, show_username,data[i].forwarded) + (next_msg_from_id != data[i].from_id || next_msg_from_id == 0 ? '</div>' : '');
                          

                            author_last_msg = data[i].lastby;
                            last_date = data[i].date;
                            msgs_for_cache.push(data[i]);

                        }
                        self.shortcut_id ? self.shortcut.find('.messenger_older_msg_div').after(message_markup) : __j('.pmessenger .messenger_older_msg_div').after(message_markup);
                        self.colorateStrokes(self.current_color(), self.shortcut_id);
                        self.startvenobox();
                        nanoScrollStart();
                        
                        let cache_name = 'conversation:/messenger/' + (page_id > 0 ? recipientId + '/' + page_id : (n_group_id > 0 ? 'g/' + n_group_id : recipientId));
                        let xx = msgs_for_cache.length;
                        while(xx--){
                            
                            self.updateConversationCache(msgs_for_cache[xx], cache_name, true);
                        }
                         
                        
                        
                        
                        self.shortcut_id ? self.shortcut.find(".messenger-shortcut-messages .nano").nanoScroller({
                            scrollTop: (j_last_msg.offset().top - 550)
                        }) : __j("#pmessenger-messages-cnt .nano").nanoScroller({
                            scrollTop: j_last_msg.offset().top - 150
                        });
                    }

                });



            },
            this.encodeHTML = function(s) {
                return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
            },
            this.decodeHTML = function(s){
                return $("<span />", { html: s }).text();
            },
            this.send = async function(el, ev, stk, toId, page_id, group_id, to_user, no_bg, bg_important, forward_obj) {

 
                    ev = ev || $.Event();

                    evstop(ev, 1);

                    let forward = false, forward_to_group = false, forward_to_user = false;
                    if(forward_obj && forward_obj.hasOwnProperty('forward') && forward_obj.forward == 'yes'){// && forward_obj.forward_own_msg == 'no'){
                        
                        if(forward_obj.group == 'no')
                            forward_to_user = forward_obj.userid;
                        else 
                            forward_to_group = forward_obj.group;
                         
                         forward = true;
                         
                        
                    }

                    if ((self.uploadingMedia || self.msg_cannot_send == 1) && !self.send_important) return;


                    if (self.pmessenger.length && self.pmessenger.find('.js_chatwithpage').length && !to_user) {
                        page_id = __j('#messenger_with_page').val();
                        toId = toId || escape(self.curr_recipient);
                    }

                    if (self.pmessenger.length && self.group_id > 0 && !to_user) {
                        group_id = self.pmessenger.find('#messenger_with_group').val();
                        self.curr_recipient = group_id;
                    }
                    var without_bg = false;
                    var count = 0;
                    var atch_files = self.shortcut ? self.shortcut.find('.jb_attached_files._tchat#tchat_' + self.shortcut_id_num).children() : __j('.jb_attached_files.__messages').children();
                    var atch_tracks = self.shortcut ? self.shortcut.find('#WD_tracks_tchat_' + self.shortcut_id_num + ' > ul') : __j('#WD_tracks_PM>ul');
                    var $el = __j(el),
                    text = stk ? stk : (self.shortcut ? self.shortcut.find('.js-shortcut-contenteditable').data("emojioneArea").getText() : __j('#messenger-send-contenteditable').data("emojioneArea").getText());
                         
                    recipientId = toId ? toId : recipientId;

                    // abort fetching url ajax
                    self.stop_xhr('fetch-url');

                    // clear smart replies
                    if(self.shortcut)
                     self.shortcut.find('#vymsn_smart_replied_cnt').empty(); else this.smrc().empty();


                    if (!stk)
                        self.shortcut ? self.shortcut.find('[contenteditable]').empty() : self.contenteditable.empty();

                    if(to_user){
                        group_id = 0;
                        page_id = 0;
                    }


                    if (!$.trim(text)) {
                        self.shortcut ? self.shortcut.find('[contenteditable]') : self.contenteditable.addClass('_emoji-empty-focus');
                        return;
                    } else
                    if (!recipientId) {
                        setTimeout(function() {
                            displayErr(lang.somethingWrong);
                            window.location.reload(1)
                        }, 3000);
                        return displayErr(lang.pm_no_recipient);

                    } else {
                        self.sending_Message = true;
                        self.send_msg_sound();
                        // send the preview 
                        if (self.msg_with_preview && typeof self.msg_with_preview == 'object' && typeof self.msg_with_preview.id != 'undefined' && typeof self.msg_with_preview.msg != 'undefined') {
                            text += self.msg_with_preview.msg;
                            this.remove_attach(false, false, self.msg_with_preview.id);
                            self.msg_with_preview = !1;
                            if(typeof messenger_shortcut != 'undefined')
                                messenger_shortcut.msg_with_preview = !1;
                        }


                        var s_recipient = page_id || to_user ? escape(toId) : escape(self.curr_recipient);
                        var hash = s_recipient + '__' + self.random_id();
                        var send_data = {
                            msg: {},
                            user: {}
                        };
                        var msg_rand_id = self.random_id();
                        var d = new Date();

                        let time_minutes = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();

                        send_data['msg']['id'] = msg_rand_id; // unsettled msg id
                        send_data['msg']['msgid'] = msg_rand_id; // unsettled msg id
                        send_data['msg']['text'] = self.encodeHTML(text);
                        send_data['msg']['min_text'] = self.encodeHTML(text);
                        send_data['msg']['push_text'] = text;
                        send_data['msg']['page_id'] = page_id ? page_id : 0;
                        send_data['msg']['group_id'] = group_id ? group_id : 0;
                        send_data['msg']['rd'] = 'no';
                        send_data['msg']['read'] = 'no';
                        send_data['msg']['seen'] = '0';
                        send_data['msg']['bg'] = bg_important ? 'yes' : ( (stk && !self.force_bg) || no_bg ? 'no' : 'yes');
                        send_data['msg']['time'] = d.getHours() + ':' + time_minutes;
                        send_data['msg']['timestamp'] = (new Date().getTime());
                        send_data['msg']['curr_date'] = (new Date().getDate());
                        send_data['msg']['count'] = 1;
                        send_data['msg']['recipient'] = s_recipient;
                        send_data['msg']['forwarded'] = forward ? 'yes' : 'no';
                        send_data['msg']['reply'] = null;

                        // user
                        send_data['user']['group'] = group_id ? group_id : 0;
                        send_data['user']['socketid'] = socketId();
                        send_data['user']['id'] = _U.i;
                        send_data['user']['fullname'] = _U.fn;
                        send_data['user']['avatar'] = _U.p;
                        send_data['user']['online_ago'] = 1;
                        send_data['user']['online'] = 1;
                        
                        
                        if (page_id) {
                            send_data['user']['page'] = page_id;
                            send_data['user']['page_admin'] = 'no';

                            if (self.shortcut && self.shortcut.find('#messenger_page_admin').val() == "yes") {
                                send_data['user']['avatar'] = self.shortcut.find('#inphd_page_avatar').attr('src');
                                send_data['user']['page_admin'] = 'yes';
                            } else if (self.pmessenger.find('#messenger_page_admin').val() == "yes") {
                                send_data['user']['avatar'] = self.pmessenger.find('#inphd_page_avatar').attr('src');
                                send_data['user']['page_admin'] = 'yes';
                            }

                            if (self.shortcut) {
                                send_data['user']['page_name'] = self.shortcut.find('.ufullname' + s_recipient + '_' + page_id).val();
                            } else if (self.pmessenger.length && !self.shortcut) {
                                send_data['user']['page_name'] = self.pmessenger.find('#messenger_recipient_name').val();
                            }

                        }
                        if (group_id) {
 
                            if (self.shortcut) {
                                send_data['user']['group_avatar'] = self.shortcut.find('.js__group_avatar').attr('src');
                                send_data['user']['group_name'] = self.shortcut.find('.ufullnameGG' + group_id).val();
                            } else if (self.pmessenger.length && !self.shortcut) {
                                
                                if(forward){
                                send_data['user']['group_avatar'] = forward_obj.group_data.avatar;
                                send_data['user']['group_name'] = forward_obj.group_data.group_name;                    
                                } else {
                                send_data['user']['group_avatar'] = self.pmessenger.find('.js__group_avatar').attr('src');
                                send_data['user']['group_name'] = self.pmessenger.find('#messenger_recipient_name').val();
                                }
                            }

                        }
                        let msg_send_to = page_id || to_user ? escape(toId) : escape(self.curr_recipient),
                            reply = 0;
 
                        if(self.replies.hasOwnProperty(msg_send_to) || localStorage.getItem('vy_ms_reply_shortcut_'+self.shortcut_id)){
                            
                            reply = self.shortcut_id ? localStorage.getItem('vy_ms_reply_shortcut_'+self.shortcut_id) : self.replies[msg_send_to];
                            
                            if(self.shortcut_id){
                                localStorage.removeItem('vy_ms_reply_shortcut_'+self.shortcut_id);
                            } else {
                                delete self.replies[msg_send_to];
                            }
                            
                            self.close_reply();
                            self.reply_enabled = 0;
                            
                            await jAjax(self.ajax_url,'post',{'cmd':'get-reply-details','id':escape(reply)}).done(function(data){
                                send_data['msg']['reply'] = data;
                            });
                            
                            
                        } 

                        // remove typing 
                        clearTimeout(self.timeout_typing);
                        self.Typing_timeoutFunction();

                        // remove clean message in groups
                        if (self.pmessenger.length && !self.shortcut) self.pmessenger.find('.js__vy_ms__group_cleared').remove();
                        else if(self.shortcut_id) __j('#'+self.shortcut_id).find('.js__vy_ms__group_cleared').remove();
 
                        setTimeout(function() {
                            if (group_id > 0)
                                self.socket.emit("vy_ms__group_message", JSON.stringify({
                                    'Group_id': socketId('GG' + group_id),
                                    'From': socketId(_U.i),
                                    'Data': send_data,
                                    'Hash': hash
                                }));
                            else
                                self.socket.emit("vy_new_message", JSON.stringify({
                                    'Userid': socketId(s_recipient),
                                    'From': _U.i,
                                    'Data': send_data,
                                    'Hash': hash
                                }));
                        }, 10);
                        
                        if(!forward || (forward && (!forward_to_group && self.curr_recipient == forward_to_user) || (forward_to_group > 0 && __j('#messenger_with_group').val() == forward_to_group)) )
                            await self.appendSendedMessages(send_data, stk, page_id, group_id);

 
                        let msg_data = {};

                        msg_data['id'] = msg_rand_id;
                        msg_data['cmd'] = "sendMessage";
                        msg_data['bg'] = bg_important ? 'yes' : (stk && !self.force_bg ? 'no' : 'yes');
                        msg_data['text'] = text; //encodeURIComponent(text);
                        msg_data['view_as'] = "json";
                        msg_data['userid'] = msg_send_to;
                        msg_data['forwarded'] = forward ? 'yes' : 'no';
                        msg_data['reply'] = reply;
                        
                        
                        if (page_id)
                            msg_data['page'] = escape(page_id);

                        if (group_id > 0)
                            msg_data['group'] = escape(group_id);
                            

                        var send = jAjax(self.ajax_url, 'post', msg_data);

                        self.force_bg = !1;
 
                        send.done(function(data) {  
 
                            self.uploading_media_disable_func('disable', self.shortcut_id_num, page_id, group_id);
                            self.send_important = 0;
                            self.sending_Message = false;
                            var res = validateJson(data);


                            if (res.response === 'blacklist') {

                                self.isInBlackList();

                            } else if (res.response === 'success') {

                                self.updateSendedMessage(res);
                                
                                // update cache 
                                let cache_name = self.shortcut_id ? 'conversation:/messenger/mshortcut-'+ (page_id > 0 ? s_recipient + '_' + page_id : (group_id > 0 ? 'GG' + group_id : s_recipient)) : 'conversation:/messenger/' + (page_id > 0 ? s_recipient + '/' + page_id : (group_id > 0 ? 'g/' + group_id : s_recipient));
                                
                                
                                
                                self.updateConversationCache(res.cache_message, cache_name);

                            } else if (res.response !== 'success') {
                                return displayErr(res.response);
                            } else {
                                return displayErr(lang.pm_error_deliv);
                            }

                        });

                    }




                },
                this.updateSendedMessage = function(res) {

                    var msg_rand_id = res.msg_random_id;

                    var $msg = __j('#msg_' + msg_rand_id),
                        $react = $msg.find('[data-react="1"]');

                    $msg.removeAttr('id').attr({
                        'id': 'msg_' + res.id,
                        'data-unsettled-msg-id': msg_rand_id,
                        'data-msg-timestamp': res.timestamp
                    }).addClass('vy_ms__needsorted');
                    $msg.find('.d_comment_act_del').removeAttr('id').attr({
                        'id': 'm-id-msg-' + res.id,
                        'data-unsettled-id': msg_rand_id
                    });
                    $react.attr({
                        'id': 'react_to_' + res.id
                    });
                    
                    const $react_data = $react.data('reaction');
 
                    if(typeof $react_data == 'undefined') return;
                    
                    $react_data['id'] = res.id;
                    $react_data['unsettled-msg-id'] = msg_rand_id;
                    
                    $react.removeData('reaction').removeAttr('data-reaction').attr({
                        'data-reaction': JSON.stringify($react_data)
                    });

                    $msg.find('#mess_sent_status>i').removeClass('glyphicon-ok-circle').addClass('glyphicon-ok-sign');

                    setTimeout(function() {



                        // sort messages live 
                        var msgs_to_sort = self.shortcut ? self.shortcut.find('.pmessenger-message-txt.vy_ms__needsorted') : __j('.pmessenger-message-txt.vy_ms__needsorted');
                        if (msgs_to_sort.length)
                            tinysort(msgs_to_sort, {
                                data: 'msg-id',
                                order: 'asc',
                                ignoreDashes: true
                            });

                        setTimeout(function() {

                            msgs_to_sort.removeClass('vy_ms__needsorted');

                        }, 1000);

                    }, 500);

                },
                this.removeEmojiareaBackdrop = function(el,picker){
                    el = __j(el);
                   // picker = __j(picker);

                    el.remove();
                    picker.hidePicker();
                },
                this.appendSendedMessages = async function(res, stk, page_id, group_id) {


                        var new_m = __j('.mdialog_newdialogmsg');
                        var j_last_msg = self.shortcut ? self.shortcut.find('.pmessenger-message-txt:last') : __j('.pmessenger-message-txt:last');
                        var text = res.msg.text.replace(/\\/g, ""),
                            time = res.msg.time,
                            min_text = res.msg.min_text.replace(/\\/g, ""),
                            mid = res.msg.msgid,
                            read = res.msg.rd,
                            m_bg = res.msg.bg,
                            timestamp = res.msg.timestamp,
                            recid = res.msg.recipient,
                            curr_date = res.msg.curr_date,
                            forwarded = res.msg.forwarded,
                            reply = res.msg.reply;
                            
                     



                        text = nl2br(text);


                        if (page_id) {

                            __j('.js_chat_with_page_' + page_id).find('.jb_attached_files._tchat').empty();

                        }

                        if (self.shortcut)
                            self.shortcut.find('.jb_attached_files._tchat#tchat_' + self.shortcut_id_num).empty();
                        else
                            __j('.jb_attached_files.__messages').empty();



                        //  atch_tracks.empty();

                        if (self.mess_opened_contacts.indexOf(recipientId) == -1 && !self.shortcut) {
                            self.mdialog_hide_loader = true;


                            self.appendNewDateTime(curr_date);


                            self.mess_opened_contacts.push(recipientId);

                        } else if (self.mess_opened_contacts__shortcut.indexOf(recipientId) == -1 && self.shortcut) {

                            self.mdialog_hide_loader = true;


                            self.shortcut__appendNewDateTime(curr_date);


                            self.mess_opened_contacts__shortcut.push(recipientId);


                        }




                        self.scrollNow = true;
                        if (j_last_msg.hasClass('_me'))
                            this.avatar = false;
                        else
                            this.avatar = true;




                        self.show_sent_status = true;
                        self.gl_scrollChatDelay = stk ? 200 : false;


                        if (self.shortcut || __j('#mshortcut-' + self.curr_recipient).length) {
                            var uid = !self.shortcut_id ? 'mshortcut-' + self.curr_recipient : self.shortcut_id;


                            if (group_id > 0)
                                await mess_shortcut(uid, 1).apMessage(mid, '_me', _U.i, _U.p, _U.fn, time, text, 1, m_bg, this.avatar, false, false, timestamp, false, false, group_id, forwarded,reply).then(function() {

                                    mess_shortcut(uid, 1).colorateStrokes(self.current_color(), uid);

                                });
                            else if (page_id)
                                await mess_shortcut(uid, 1).apMessage(mid, '_me', _U.i, _U.p, _U.fn, time, text, 1, m_bg, this.avatar, false, false, timestamp, false, page_id,0,forwarded,reply).then(function() {

                                    mess_shortcut(uid, 1).colorateStrokes(self.current_color(), uid);
                                });
                            else
                                await mess_shortcut(uid, 1).apMessage(mid, '_me', _U.i, _U.p, _U.fn, time, text, 1, m_bg, this.avatar, false, false, timestamp,false,0,0,forwarded,reply).then(function() {

                                    mess_shortcut(uid, 1).colorateStrokes(self.current_color(), uid);
                                });



                        }

                        if (__j('#messenger_' + self.curr_recipient).length && __j('#messenger_with_page').val() == 'none' && __j('#messenger_with_group').val() == 'none') {

                            self.appendMessageInContacts(min_text, recid, timestamp, time, 'me');
                            await messenger.apMessage(mid, '_me', _U.i, _U.p, _U.fn, time, text, 1, m_bg, this.avatar, false, false, timestamp,false,0,0,forwarded,reply).then(function() {

                                self.colorateStrokes(self.current_color());
                            });

                        } else if (page_id && __j('#messenger_' + self.curr_recipient + '_' + page_id).length) {
                            // append messages in messenger in chat with page
                            self.appendMessageInContacts(min_text, recid, timestamp, time, 'me', false, false, page_id);
                            await messenger.apMessage(mid, '_me', _U.i, _U.p, _U.fn, time, text, 1, m_bg, this.avatar, false, false, timestamp, false, page_id,0,forwarded,reply).then(function() {

                                self.colorateStrokes(self.current_color());
                            });


                        } else if (group_id > 0 && __j('#messenger_GG' + group_id).length) {
                            // append messages in messenger in chat with page
                            self.appendMessageInContacts(min_text, recid, timestamp, time, 'me', false, false, false, group_id);
                            await messenger.apMessage(mid, '_me', _U.i, _U.p, _U.fn, time, text, 1, m_bg, this.avatar, false, false, timestamp, false, false, group_id,forwarded,reply).then(function() {

                                self.colorateStrokes(self.current_color());
                            });


                        }


                        if (new_m.length != 0) new_m.remove();




                    },
                    this.appendNewDateTime = function(_date) {

                        var j_last_msg = __j('.pmessenger .pmessenger-message-txt:last');
                        var curr_datetime = __j('.pmessenger #last-message-datetime');
                        var datetime_l_val = curr_datetime.val();
                        let t_day = '<div id="messenger_date_delim_' + lang.today + '" class="messenger_date_delim"><span>' + lang.today + '</span></div>';

                        if (_date != datetime_l_val && curr_datetime.length && j_last_msg.length) {

                            j_last_msg.after(t_day);
                            curr_datetime.remove();
                        } else if (!j_last_msg.length) {

                            self.pmessenger.find('#messenger-nano-content-fullheight').append(t_day);
                        }


                    },
                    this.shortcut__appendNewDateTime = function(_date) {

                        var j_last_msg = self.shortcut.find('.pmessenger-message-txt:last');
                        var curr_datetime = self.shortcut.find('#last-message-datetime');
                        var datetime_l_val = curr_datetime.val();


                        if (_date !== datetime_l_val && curr_datetime.length) {

                            j_last_msg.after('<div id="messenger_date_delim_' + lang.today + '" class="messenger_date_delim"><span>' + lang.today + '</span></div>');
                            curr_datetime.remove();
                        }


                    },

                    this.appendMessageInContacts = async function(msg, contact_id, timestamp, msg_time, from, stop_sort, show_count, page_id, group_id) {

                            let orig_from = from;
                            var isbbcode = !1;
                            msg = msg.replace(/&amp;/g, '&');
                            show_count = show_count ? '<div class="convo__unread oval in_messenger">+' + show_count + '</div>' : '';
                            from = from == 'me' ? '<span class="convo__msgAuthor">' + lang.You + ':</span>&nbsp;' : '';
                            var find_contact = page_id > 0 ? __j('#contact-' + contact_id + '_' + page_id) : (group_id > 0 ? __j('#contact-GG' + group_id) : __j('#contact-' + contact_id));

                            if (self.containsBBCODE(msg))
                                await self.liveMedia(msg, 1).then(async function(mtext) {

                                    msg = mtext;
                                    isbbcode = !0;
                                });

                            if (show_count) {
                                find_contact.addClass('_newmessages');


                            }

                            // make contact at last messaged
                            find_contact.removeData('last-message-timestamp').removeAttr('last-message-timestamp');
                            find_contact.attr('data-last-message-timestamp', timestamp);

                            // append message to the left side bar in contacts
                            find_contact.find('.pmessenger-contact-last-msg')
                                .replaceWith('<div class="pmessenger-contact-last-msg ellip _1htf _6zke"><div class="_42dz5 ellip">' + from + (isbbcode ? msg : msg.substring(0, 22) + (msg.length > 22 ? '...' : '')) + '</div><div class="pmessenger-contact-last-msg-time"><div class="_6zkf">&#8729;</div><span class="_1ht7 _6zkh timestamp">' + msg_time + '</span></div></div>');
                            find_contact.find('.pmessenger-contact-last-msg-time .timestamp').text(msg_time);

                            if (find_contact.find('.convo__unread.in_messenger').length)
                                find_contact.find('.convo__unread.in_messenger').replaceWith(show_count);
                            else
                                find_contact.find('.pmessenger-contact-info').append(show_count);



                            // add sent icon 
                            if (!find_contact.find('._3fx44cc').length && orig_from == 'me') find_contact.find('.pmessenger-contact-last-msg').after('<div class="_3fx44cc"><div class="contact-messenger_sent_Status"><i class="glyphicon contact-messenger-sent-ic glyphicon-ok-sign"></i></div></div>');
                            else if (find_contact.find('._3fx44cc').length && orig_from == 'me')
                                find_contact.find('._3fx44cc').replaceWith('<div class="_3fx44cc"><div class="contact-messenger_sent_Status"><i class="glyphicon contact-messenger-sent-ic glyphicon-ok-sign"></i></div></div>');
                            else find_contact.find('._3fx44cc').remove();


                            if (!stop_sort && find_contact.parent().index() > 0)
                                self.sortContacts();


                            if (!vy_ms__window_tab_active && !find_contact.hasClass('active')) self.messengerFocusWindow(false, page_id, group_id);
                        },
                        // report message
                        this.message_report = function(e, o) {

                            e.preventDefault();
                            var $o = __j(o),
                                m_e = $o.attr('id').split('-'),
                                m_id = m_e[m_e.length - 1],
                                msg = $o.closest('#msg_' + m_id).find('.mdialog_atch_items_container').length != 0 ? '' : $o.closest('#msg_' + m_id).find('.txt_pmessenger-text').html();

                            confirm_act(lang.pm_report_confirm + '<br/><div class="c_mdialog_sm_mg ellip">' + msg + '</div>',
                                function(event) {

                                    var s_d = jAjax(self.ajax_url, 'post', 'cmd=spam&id=' + escape(m_id) + '&view_as=json');
                                    s_d.done(function(r) {

                                        if (r === '1') {
                                            $o.closest('#msg_' + m_id).find('.txt_pmessenger-text').html('<i>' + lang.pm_reported_msg + '</i>');
                                            $o.closest('#msg_' + m_id).addClass('deleted_pm');
                                        } else
                                            return displayErr(r);

                                    });

                                });

                        },
                        // sort contact
                        this.sortContacts = function() {


                            let lis = __j('#messenger-contacts-last').find('.pmessenger-contact-a'),
                                liHeight = lis[0].offsetHeight;
                            lis[0].style.height = lis[0].offsetHeight + 'px';


                            for (var i = 0, l = lis.length; i < l; i++) {
                                let li = lis[i];
                                li.style.position = 'absolute';
                                li.style.width = '100%';
                                li.style.top = i * liHeight + 'px';
                            }

                            let removeContactAbs = function() {

                                for (var i = 0, l = lis.length; i < l; i++) {
                                    let li = lis[i];
                                    __j(li).removeAttr('style');
                                }
                            }

                            // sort contacts live
                            tinysort(__j('#messenger-contacts-last').find('.pmessenger-contact-a'), {
                                data: 'last-message-timestamp',
                                order: 'desc',
                                ignoreDashes: true
                            }).forEach(function(elm, i) {
                                setTimeout((function(elm, i) {
                                    elm.style.top = i * liHeight + 'px';
                                }).bind(null, elm, i), 140);
                                setTimeout(function() {

                                    removeContactAbs();
                                }, 1500);

                            });




                        },
                        this.checkGroupAdmin = function(group_id) {

                            let admin = 0;
                            for (var i = 0; i < vy_ms__mygroups.length; i++) {
                                if (group_id == vy_ms__mygroups[i].id && vy_ms__mygroups[i].a > 0) {
                                    admin = 1;
                                }
                            }
                            return admin;
                        },

                        this.deleteMessageFromCacheConversation = function(data) {
                            let cache_name = 'conversation:'+ window.location.pathname;//'conversation:/messenger/' + (data.page_id > 0 ? data.user_id + '/' + data.page_id : (data.group_id > 0 ? 'g/' + data.group_id : data.user_id));

                            if (_ms_Cache.exist(cache_name)) {

                                const arr = validateJson(_ms_Cache.get(cache_name));

                                for (var i = 0; i < arr.messages.length; i++) {

                                    if (arr.messages[i].id == data.msg_id) {
                                        arr.messages.splice(i, 1);

                                    }


                                }

                                _ms_Cache.set(cache_name, JSON.stringify(arr));



                            }

                        },
                        this.updateSeenInCacheMessages = function(data) {
                            let cache_name = 'conversation:/messenger/' + (data.page_id > 0 ? data.user_id + '/' + data.page_id : (data.group_id > 0 ? 'g/' + data.group_id : data.user_id));

                            if (_ms_Cache.exist(cache_name)) {

                                const arr = validateJson(_ms_Cache.get(cache_name));

                                for (var i = 0; i < arr.messages.length; i++) {

                                    if (arr.messages[i].seen <= 0 && arr.messages[i].read == 'no') {
                                        arr.messages[i].seen = new Date().getTime();
                                        arr.messages[i].read = 'yes';

                                    }


                                }

                                _ms_Cache.set(cache_name, JSON.stringify(arr));



                            }

                        },
                        // delete message
                        this.delete_message = function(o, e, group_id, page_id, user_id) {  
                            evstop(e, 1);
                            var $o = __j(o),
                                m_e = $o.attr('id').split('-'),
                                m_id = m_e[m_e.length - 1],
                                msg_unsettled_id = $o.closest('[data-unsettled-msg-id]').data('unsettled-msg-id'),
                                msg = $o.closest('#msg_' + m_id).find('.mdialog_atch_items_container').length != 0 ? '' : $o.closest('#msg_' + m_id).find('.txt_pmessenger-text').html();
                            var allow_3btn = $o.closest('#msg_' + m_id).hasClass('_me') ? true : false;


                            if (group_id > 0 && self.checkGroupAdmin(group_id))
                                allow_3btn = true;

                            self.confirm_act(lang.Messenger_delete_message_select_option,
                                function(everyone) {

                                    let post_data = {};

                                    post_data['cmd'] = 'delete';
                                    post_data['id'] = escape(m_id);
                                    post_data['msg_unsettled_id'] = escape(msg_unsettled_id);
                                    post_data['action'] = everyone;
                                    post_data['foreign_msg'] = $o.closest('.pmessenger-message-txt').hasClass('_me') ? 'from_me' : 'from_they';
                                    if (group_id > 0)
                                        post_data['group'] = escape(group_id);



                                    var s_d = jAjax(self.ajax_url, 'post', post_data);
                                    s_d.done(function(r) { 

                                        if (r === '1') {
                                            let cache_delete_obj = {
                                                'msg_id': m_id,
                                                'group_id': group_id,
                                                'page_id': page_id,
                                                'user_id': user_id
                                            };
                                            $o.closest('#msg_' + m_id).slideUp(350, function() {
                                                $o.closest('#msg_' + m_id).remove();
                                                self.deleteMessageFromCacheConversation(cache_delete_obj);
                                            });
                                            if (everyone == 'everyone') {

                                                if (group_id <= 0)
                                                    self.socket.emit("delete_message_for_everyone", JSON.stringify({
                                                        'Msg_Unsettled_id': msg_unsettled_id,
                                                        'Msg_id': escape(m_id),
                                                        'Userid': socketId(self.recipient_user_id),
                                                        'Cache_delete_data': cache_delete_obj
                                                    }));
                                                else
                                                    self.socket.emit("delete_message_for_everyone_in_group", JSON.stringify({
                                                        'Msg_Unsettled_id': msg_unsettled_id,
                                                        'Msg_id': escape(m_id),
                                                        'Userid': group_id,
                                                        'Group_id': socketId('GG' + group_id),
                                                        'Cache_delete_data': cache_delete_obj
                                                    }));
                                            }
                                        } else
                                            return displayErr(r);

                                    });

                                }, allow_3btn);

                        },
                        this.toggleDayNightMode = function(el,ev){
                            evstop(ev,1);
                            
                            el = __j(el);
                            
                            if(readCookie('mode') == 'night'){
                                
                                createCookie('mode','day');
                                el.removeClass('h4active');
                            } else {
                                
                                createCookie('mode','night');
                                el.addClass('h4active');
                            }
                            
                            __j('#night_mode_toggle').trigger('click');
                            
                        },
                        this.mob_enable_reactions = function(el){
                            
                           
                                if (_U.i <= 0) return;
                                var _self = el;
                                var s_msg = __j(el).closest('.pmessenger-message-txt');
                                var obj = s_msg.find('.messenger_text_col');
                                var data = __j(el).data('reaction');

 
                                var reaction_item = '';
                                const reactions = self.reactions;

                                for (var i in reactions)
                                    reaction_item += '<a id="reaction_'+data.id+'" data-reaction=\'{"mob":true,"author":"' + data.author + '","page":"'+data.page+'","group":"'+data.group+'","item":"' + data.item + '","id":"' + data.id + '","unsettled-msg-id":"'+data['unsettled-msg-id']+'","reaction":"' + i + '","color":"' + reactions[i].color + '"}\' onclick="messenger.react(this,event);" class="a-reaction-icon reactions ' + reactions[i].css_class + '"><label>' + reactions[i].title + '</label></a>';

                                var tooltip_markup = '<div class="vy_ms__r"><div class="sc-menu sc-menu-vy-mob __light __lktooltip sc-menu-reactions sc-menu__top __reactions_menu">' +
                                    '<div class="reaction-type">' +
                                    reaction_item +
                                    '</div>' +
                                    '<div class="sc-menu_arw_w">' +
                                    '<div class="sc-menu_arw"></div>' +
                                    '</div>' +
                                    '</div></div>';
                                var reposition_reactions_box = function() {
                                    var sc_react_box = obj.find('.sc-menu-reactions');

                                    if (!self.isElementInViewport(obj.find('.sc-menu-reactions')))
                                        sc_react_box.removeClass('sc-menu__top');
                                    else
                                        sc_react_box.addClass('sc-menu__top');
                                }
                                if (!obj.find('.sc-menu').length)
                                    self.timeouts.open_react = setTimeout(function() {
 
                                        obj.append(tooltip_markup);
                                       // reposition_reactions_box();

                                        __j(".a-reaction-icon").each(function(index, element) {
                                            setTimeout(function() {
                                                __j(element).addClass("show");
                                            }, index * 80);
                                            setTimeout(function() {
                                                __j(element).addClass("anim");
                                            }, index * 200);
                                        });

                                    }, 300);
                                else return clearTimeout(self.timeouts.close_react);
                                
                                
                                __j(document).off('click.MobCloseReactions').on('click.MobCloseReactions', function(e){
                                    //evstop(e,1);
                                    clearTimeout(self.timeouts.open_react);
                                    self.timeouts.close_react = setTimeout(function() {
                                        obj.find('.vy_ms__r').remove();
                                    }, 200);
                                
                                
                                });
                            
                        },
                        this.close_reactions = function(){
                            __j('body').find('.vy_ms__r').remove();
                        },
                        this.enable_reactions = function() {
                            
 
                     
 

                            __j(document).off('mouseover.vy_ms__react').on('mouseover.vy_ms__react', '[data-react]', function(e) {

                                evstop(e, 1);
                                if (_U.i <= 0) return;
                                var _self = this,
                                 obj = __j(this),
                                 shortcut_id = obj.attr('shortcut-id'),
                                 data = obj.data('reaction')
                                 ,reaction_item = ''
                                 ,reactions = self.reactions
                                 ,_onclick = self.shortcut_id ? 'mess_shortcut(\''+shortcut_id+'\').react(this,event)' : 'messenger.react(this,event)';

                                for (var i in reactions)
                                    reaction_item += '<a id="reaction_'+data.id+'" data-reaction=\'{"author":"' + data.author + '","page":"'+data.page+'","group":"'+data.group+'","item":"' + data.item + '","unsettled-msg-id":"'+data['unsettled-msg-id']+'","id":"' + data.id + '","reaction":"' + i + '","color":"' + reactions[i].color + '"}\' onclick="'+_onclick+'" class="a-reaction-icon reactions ' + reactions[i].css_class + '"><label>' + reactions[i].title + '</label></a>';

                                let tooltip_markup = '<div class="vy_ms__r"><div class="sc-menu __light __lktooltip js__vy-ms_reaction-menu sc-menu-reactions sc-menu__top __reactions_menu">' +
                                    '<div class="reaction-type">' +
                                    reaction_item +
                                    '</div>' +
                                    '<div class="sc-menu_arw_w">' +
                                    '<div class="sc-menu_arw"></div>' +
                                    '</div>' +
                                    '</div></div>';
                                    
                                let reposition_reactions_box = function() {
                                     var sc_react_box = __j('body').find('.js__vy-ms_reaction-menu'),
                                     pos = $.extend({}, obj.offset(), {
                                                            width: obj[0].offsetWidth,
                                                            height: obj[0].offsetHeight
                                    }),
                                    actualWidth = sc_react_box[0].offsetWidth,
                                    actualHeight = sc_react_box[0].offsetHeight,
                                    reaction_position = {top: pos.top - (pos.height*2.5), left: pos.left + pos.width / 2 - actualWidth / 2};
                                        
                                    sc_react_box.css(reaction_position);
                                    
                                };
                                
                                if (!__j('.vy_ms__r').length)
                                    self.timeouts.open_react = setTimeout(function() {


                                        __j('body').append(tooltip_markup);
                                        reposition_reactions_box();

                                        __j(".a-reaction-icon").each(function(index, element) {
                                            setTimeout(function() {
                                                __j(element).addClass("show");
                                            }, index * 80);
                                            setTimeout(function() {
                                                __j(element).addClass("anim");
                                            }, index * 200);
                                        });

                                    }, 400);
                                else return clearTimeout(self.timeouts.close_react);

                            }).off('mouseout.vy_ms__react').on('mouseout.vy_ms__react', '[data-react]', function(e) {
                                var obj = __j(this);
                                clearTimeout(self.timeouts.open_react);
                                self.timeouts.close_react = setTimeout(function() {
                                    self.close_reactions();
                                }, 300);
                            });
                    
                            __j(document).off('mouseover.keep_reactions').on('mouseover.keep_reactions', '.sc-menu-reactions', function(){
                                clearTimeout(self.timeouts.close_react);
                                __j(this).off('mouseout.close_reactions').on('mouseout.close_reactions',function(){
                                     self.timeouts.close_react = setTimeout(function() {
                                                                        self.close_reactions();
                                    }, 300);
                                });
                            });

                        },
                        this.getReactionsMarkup = function(msg_id, unsettled_msg_id, data, arr) {  
                            let markup = '',
                                limit = 2;
                                count = 0,
                                reacted = false,
                                reaction_type = 'like'; 
                                 
                            if (msg_id > 0 && data.length) {
                             
                                 
                                for (var i = 0; i < data.length; i++) {
                                    
                                    if(i <= limit)
                                    markup += (data[i].itemid == msg_id || data[i].itemid == unsettled_msg_id) && data[i].animation == 'yes' ? self.reaction_html(data[i].type,1) : self.reaction_html(data[i].type,0);

                                    if (data[i].userid == _U.i){
                                        reacted = true;
                                        reaction_type = data[i].type;
                                    }
                                }
                                
                                
                                count = data.length;
                            } 
                            return {
                                'html': markup,
                                'count': count,
                                'reacted': reacted,
                                'reaction-type': reaction_type
                            };
                        },
                        this.reaction_html = function(reaction,animation) {
                            animation = !animation ? '' : 'reaction__animated reaction__bounce';
                            return '<span class="reaction-message-ic '+animation+' js__message_reacted_now notif-type-icon __' + reaction + '"></span>';
                        },
                        this.react = async function(el, evt) {

                            
                            if (_U.i <= 0) return;
                            el = __j(el);
                            
  

                            let _id = tonum(el.attr('id')),
                                parent_btn = __j('#react_to_'+_id),
                                parent_cnt = parent_btn.parent(),
                                users_reactions = parent_cnt.find('.js-users-reactions'),
                                curr_reaction = parent_btn.attr('reaction-type'),
                                count_el = parent_btn.find('.js-count'),
                                is_empty = parent_cnt.hasClass('_empty'),
                                count_int = parseInt(count_el.text()),
                                _data = el.data('reaction'),
                                _mob = _data.hasOwnProperty('mob') ? true : false,
                                item = _data.item,
                                _reaction = _data['reaction'],
                                group = _data.group > 0 ? 'yes' : 'no',
                                group_id = _data.group,
                                page = _data.page > 0 ? 'yes' : 'no',
                                page_id = _data.page,
                                id = escape(_data.id),
                                unsettled_msg_id = escape(_data['unsettled-msg-id']),
                                author = escape(_data.author),
                                send_data = {
                                    'cmd': 'reaction',
                                    'item': item,
                                    'id': id,
                                    'reaction': _reaction,
                                    'author': author
                                },
                                add_react = 0,
                                update_react = 0,
                                message = parent_btn.closest('.pmessenger-message-txt'),
                                message_reactions_count_js = message.find('.message_reactions'),
                                message_reactions_std_ics = message.find('.js__message-reactions-std-ics'),
                                message_reactions_count = parseInt(message_reactions_count_js.text()) || 0,
                                message_reactions_ics_markup = self.reaction_html(_reaction);
 
                            if(!_mob)
                                evstop(evt, 1);

                            if (parent_btn.hasClass('reacted') && curr_reaction == _reaction || parent_btn.hasClass('reacted') && el.hasClass('reaction-parent')) {
                                send_data['action'] = 'remove';
                                
                            } else if (parent_btn.hasClass('reacted') && curr_reaction != _reaction) {
                                add_react = 1;
                                send_data['action'] = 'update';
                                parent_btn.removeAttr('reaction-type').attr('reaction-type',_reaction);
                            } else {
                                add_react = 1;
                                send_data['action'] = 'add';
                                message.addClass('vy_ms__msg_reacted');
                                parent_btn.removeAttr('reaction-type').attr('reaction-type',_reaction);
                                 

                            }

                            // remove reacted class
                            parent_btn.removeClass('reacted');

                            // add react class if need
                            if (add_react)
                                setTimeout(function() {
                                    parent_btn.addClass('reacted');
                                }, 10);

                            // update counts
                            count_el.text(count_int);

                            // close reactions menu
                            parent_btn.find('.sc-menu-reactions').remove();
                            
                            let group_details = {};
                            
                            if(group == 'yes') {
                                await jAjax(self.ajax_url, 'post', {
                                    'cmd': 'get-group-details',
                                    'group': escape(group_id)
                                }).done(function(d) {group_details = d;});
                            }

                            self.socket.emit("react", JSON.stringify({'Remove': !add_react, 'To':socketId(self.curr_recipient), 
                                                        'Data': {
                                                        'user': _U,
                                                        'msg': {
                                                            'text': ''
                                                        }, 
                                                        'notif': {
                                                            'categ': 'react',
                                                            'reaction': _reaction
                                                        }
                                                    }, 'Group_data': validateJson(group_details), 'Userid': socketId(_data.author),'User_clean_id':_data.author, 'From':_U.i, 'Group_id': socketId('GG'+group_id), 'Group_clean_id': group_id, 'Group': group, 'Page_clean_id' : page_id, 'Page_id': socketId(self.curr_recipient+'_'+page_id), 'Page': page, 'Reaction':_reaction,'Msg_id':id, 'Msg_Unsettled_id':unsettled_msg_id}));
 
                            
                         
                            const cache_name = self.shortcut_id ? 'conversation:/messenger/'+self.shortcut_id : 'conversation:' + window.location.pathname;
 
                            let reactions_data = self.updateReactionsInCache(cache_name, id, unsettled_msg_id, {
                                    'itemid': id,
                                    'userid': _U.i,
                                    'type': _reaction,
                                    'added': new Date().getTime()
                                },_U.i,!add_react);
                     
                            const generated_reactions = self.getReactionMarkup({'id':id,'reactions':reactions_data.reaction_data}); 
                            message.find('.message-reactions-std').replaceWith(generated_reactions.markup).find('.reaction__animated').on(self.crossEvent(), function() {
                                                __j(this).removeClass('reaction__animated reaction__bounce')
                             });
                            
                             
                            
                            if(!reactions_data.reaction_data.length && !add_react){
                                
                                message.removeClass('vy_ms__msg_reacted');
                                parent_btn.removeAttr('reaction-type').attr('reaction-type','like');
                                
                                
                            }

                            var send = jAjax(self.ajax_url, 'post', send_data);
                            send.done(function(d) {


                            });
                            
                            // close reactions instantly after react
                            self.close_reactions();
                        },
                        this.SocketAddReaction = function(data){ 
  
                            let cache_name = 'conversation:/messenger/'+data.From;
                            
                            
                             
                            const _$msg = __j('#msg_'+data.Msg_id).length ? __j('#msg_'+data.Msg_id) : (__j('[data-unsettled-msg-id="'+data.Msg_id+'"]').length ? __j('[data-unsettled-msg-id="'+data.Msg_id+'"]'): __j('#msg_'+data.Msg_Unsettled_id));
                            const reactions_count = parseInt(_$msg.find('.message_reactions').text());
                            const reactions_js = _$msg.find('.message-reactions-std');
                            
                            
                         
                            if(self.shortcut_id) cache_name = 'conversation:/messenger/mshortcut-'+self.shortcut_id;
                            
                            
                                if(data.Group == 'yes'){
                                     cache_name = self.shortcut_id ? 'conversation:/messenger/mshortcut-GG'+data.Group_clean_id : 'conversation:/messenger/g/'+data.Group_clean_id;
                                } else if(data.Page == 'yes'){
                                     cache_name = self.shortcut_id ? 'conversation:/messenger/mshortcut-'+data.From+'_'+data.Page_clean_id : 'conversation:/messenger/'+data.From+'/'+data.Page_clean_id;
                                     
                                    
                                }  
                                
                                     
                                
                                     


                                 
                                    const reactions_data = self.updateReactionsInCache(cache_name,data.Msg_id,data.Msg_unsettled_id,  {
                                                                                                                'itemid': data.Msg_id,
                                                                                                                'userid': data.From,
                                                                                                                'type': data.Reaction,'animation':'yes',
                                                                                                                'added': new Date().getTime()
                                                                                                            },data.From, data.Remove);
                                                                                                            
                                    
                                    const generated_reactions = self.getReactionMarkup({'id':data.Msg_id,'unsettled-msg-id':data.Msg_Unsettled_id,'reactions':reactions_data.reaction_data}); 
                                         
                                    reactions_js.replaceWith(generated_reactions.markup).find('.reaction__animated').on(self.crossEvent(), function() {
                                                __j(this).removeClass('reaction__animated reaction__bounce')
                             });
                                    
                                    if(reactions_data.reaction_data.length)
                                        _$msg.addClass('vy_ms__msg_reacted');
                                    else
                                        _$msg.removeClass('vy_ms__msg_reacted');
                                        
                                        
                                    
                            
                            
                            
                        },
                        this.checkIfMessageExistsInCache = function(_cacheName,msg_id){
                            
                            
                            if (_ms_Cache.exist(_cacheName)) {
                                
                                let data = validateJson(_ms_Cache.get(_cacheName)),
                                    msgs = data['messages'];
                                for (var i = 0; i < msgs.length; i++) {
                                    
                                }
                            }
                            
                        },
                        this.updateReactionsInCache = function(_cacheName, msg_id, unsettled_msg_id, reactions_data, user_id, remove) {
                            let r_data = new Array(), _reaction_updated = false;
 
                            // update cache
                            if (_ms_Cache.exist(_cacheName)) {

                                let data = validateJson(_ms_Cache.get(_cacheName)),
                                    msgs = data['messages'];
                                    
                                    
                                for (var i = 0; i < msgs.length; i++) {

                                    if (msgs[i].id == msg_id || msgs[i].unsettled_msg_id == msg_id || msgs[i].unsettled_msg_id == unsettled_msg_id) {

                                        if (msgs[i].reactions.length) {

    
                                            for (var x = 0; x < msgs[i].reactions.length; x++) {
                                                msgs[i].reactions[x].animation = 'no';
                                                if(remove && msgs[i].reactions[x]['userid'] == user_id){
                                                    
                                                    msgs[i].reactions.splice(x,1);
                                                    _reaction_updated = 1;
                                                 
                                                } else if (msgs[i].reactions[x]['userid'] == user_id){
                                                    msgs[i].reactions[x]['type'] = reactions_data.type;
                                                 
                                                    _reaction_updated = 1;
                                                     
                                                }  
                                                

                                            }
                                            if(!_reaction_updated){
                             
                                                msgs[i].reactions.push(reactions_data);
  
                                            }
                                            
                                        
                                            r_data = msgs[i].reactions;
                                            
                                        } else {
 
                                            msgs[i].reactions.push(reactions_data);
 
                                            r_data = msgs[i].reactions;
                                            

                                        }

                                    }

                                } 
                                data['messages'] = msgs;

                                _ms_Cache.set(_cacheName, JSON.stringify(data));
                                 
                                return {'conversation_messages':msgs, 'reaction_data': r_data};

                            }

                        },
                        this.isElementInViewport = function(e, t, a) {
                            if ("function" == typeof jQuery && e instanceof jQuery && (e = e[0]), void 0 !== e) {
                                var o = e.getBoundingClientRect();
                                return a ? o.top - a >= 0 && o.left - a >= 0 && o.bottom - a <= (window.innerHeight || document.documentElement.clientHeight) && o.right - a <= (window.innerWidth || document.documentElement.clientWidth) : t ? o.top + t >= 0 && o.left + t >= 0 && o.bottom + t <= (window.innerHeight || document.documentElement.clientHeight) && o.right + t <= (window.innerWidth || document.documentElement.clientWidth) : o.top >= 0 && o.left >= 0 && o.bottom <= (window.innerHeight || document.documentElement.clientHeight) && o.right <= (window.innerWidth || document.documentElement.clientWidth)
                            }
                        },
                        this.msgMoreMenu = function(el,ev,id){
                            
                            evstop(ev,1);
                            el = __j(el),
                            p = el.parent();
                            
                            let h = {}, ht = '';
                            
                            h['forward'] =  '<div class="mess_shortcut_mopts_btn" data-forward="'+id+'" onclick="mess_shortcut(\''+self.shortcut_id+'\').forward(this,event);messenger.close_msgMoreMenu();">' + self.svgi.js.forward + ''+lang.Messenger_forward+'</div>';
                            h['reply'] =    '<div class="mess_shortcut_mopts_btn" data-reply="'+id+'" onclick="mess_shortcut(\''+self.shortcut_id+'\').reply(this,event);messenger.close_msgMoreMenu();">' + self.svgi.js.reply + ' '+lang.Messenger_reply+'</div>';
                            
                            for(var x in h)
                                ht += h[x];
                            
                            if(!p.hasClass('moreoptsmenu_open')){
                                p.addClass('moreoptsmenu_open');
                                
                                p.prepend('<div class="mess_shortcut_mopts_cnt js__mess_shortcut_mopts_cnt">'+ht+'</div>');
                            }
                            else{
                                self.close_msgMoreMenu();
                            }
                            
                            __j('body').off('click.close_msgMoreMenu').on('click.msgMoreMenu', function(e){
                                self.close_msgMoreMenu();
                            });
                            
                        },
                        this.close_msgMoreMenu = function(){
                            
                            __j('.moreoptsmenu_open').removeClass('moreoptsmenu_open');
                            __j('.js__mess_shortcut_mopts_cnt').remove();
                        },
                        this.getMeta = function(t){

                            return '<span class="MessageMeta" dir="ltr"><span class="message-time">'+t+'</span></span>';

                        },
                        this.meta_stretch = function(){
                            return '<div role="none" class="ns4p8fja mo4p2 j83agx80 cbu4d94t a6sixzi8 bkfpd7mw d2edcug0 kb5gq1qc nred35xi jy3qco62 dflh9lhu" style=""></div>';
                        },
                        this.message_metah = function(){

                            return '<div class="nv41x4f"><div role="none" class="buofh1pr rj1gh0hx"></div></div>';
                        },
                        this.message_actions = function(id, time, group_id, page_id, user_id, reaction, msg_author) {
                             
                            let reacted = reaction.reacted || '', reaction_type = reaction['reaction-type'], html = {}, btns = '', _shortcut = self.shortcut_id ? 'shortcut-id="'+self.shortcut_id+'"' : '', _onclick = self.shortcut_id ? 'mess_shortcut(\''+self.shortcut_id+'\').react(this,event);' : 'messenger.react(this,event);';
                            group_id = group_id || 0;
                            page_id = page_id || 0;
                            user_id = user_id || 0;
                            msg_author = msg_author == '_me' || msg_author == 'me' ? _U.i : msg_author;
                            
 
                            html[0] = '<a title="' + lang.del_pm + '" onclick="messenger.delete_message(this,event,' + group_id + ',' + page_id + ',' + user_id + ')" id="m-id-msg-' + id + '" class="d_comment_act d_comment_act_del d_comment_act_spam ic10 ic10_close-g " uid="delMsg"></a>';
                            html[1] = '<a title="'+lang.Messenger_reply+'" data-reply="'+id+'" onclick="messenger.reply(this,event);" class="d_comment_act vy_ms__reply_btn" uid="reply">' + self.svgi.js.reply + '</a>';
                            html[2] = '<a title="'+lang.Messenger_forward+'" data-forward="'+id+'" onclick="messenger.forward(this,event);" class="d_comment_act vy_ms__forward_btn" uid="forward">' + self.svgi.js.forward + '</a>';
                            html[3] = '<a title="'+lang.Messenger_reaction+'" id="react_to_'+id+'" data-react="1" '+_shortcut+' reaction-type="'+reaction_type+'" data-reaction=\'{"id":"' + id + '","page":"'+page_id+'","group":"'+group_id+'","item":"message","author":"' + msg_author + '","reaction":"like"}\' onclick="'+_onclick+'" class="d_comment_act d_comment_act_spam ic10 vy_ms__reaction_btn ' + reacted + '" uid="reaction">' + self.svgi.js.reaction + '</a>';
                            html[4] = '<a title="More" onclick="mess_shortcut(\''+self.shortcut_id+'\').msgMoreMenu(this,event,'+id+');" class="d_comment_act d_comment_act_more" uid="more">' + self.svgi.js.more + '</a>';
                            
                            if( self.shortcut ){

                                delete html[1];
                                delete html[2];
                                                            
                            } else {
                                delete html[4];
                            }   
                             
                            if(msg_author == _U.i || msg_author == '_me' || msg_author == 'me'){
                                html = Object.assign([], html).reverse();
                            }
                            
                            for (var x in html)
                                btns += html[x];

                            return  '<div class="d_comment_r foh-s">\
                                     <div class="d_comment_act_w">'+btns+'</div>\
                                     <div style="display:none;" class="d_comment_time">' + time + '</div>\
                                     </div>';

                        },
                        this.close_reply = function(){
                            
                            if(self.shortcut_id){
                                localStorage.removeItem('vy_ms_reply_shortcut_'+self.shortcut_id);
                                __j('#'+self.shortcut_id).find('.__vyms_replying').removeClass('__vyms_replying');
                            } else {
                                
                                __j('.__vyms_replying').removeClass('__vyms_replying');
                                
                            }

                            self.replies = {};
                        },
                        this.reply = function(el,ev){
                            evstop(ev,1);
                            el = __j(el);
                            
                            let msg_id = el.data('reply'), 
                                close_reply_now = 0,
                                conv__nanoscroll = self.shortcut_id ? __j('#'+self.shortcut_id).find('#messenger-shortcut-messages-tr .nano') : __j("#messages-tick .nano"), 
                                conv__height = self.shortcut_id ? __j('#'+self.shortcut_id).find('#messenger-shortcut-messages-tr') : self.pmessenger.find('#pmessenger-messages-cnt'),
                                message_element = __j('#msg_'+msg_id).length ? __j('#msg_'+msg_id) : __j('[data-unsettled-msg-id="'+msg_id+'"]');
                                
                            if(message_element.hasClass('__vyms_replying')) close_reply_now = 1;
                            
                            self.close_reply();
                        
                            if(close_reply_now) return;
                        
                            message_element.addClass('__vyms_replying');
 
                            //conv__nanoscroll.addClass('__animated').nanoScroller({ scrollTop: ( message_element.get(0).offsetTop - conv__height.outerHeight() ) + message_element.height() + 200 });
                             //conv__nanoscroll.addClass('__animated').nanoScroller({ scrollTo: message_element });
                             
                            __j(document).off('click.closeReply').on('click.CloseReply','.__vyms_replying',function(){self.close_reply();});
                            
                            if(self.shortcut_id) {
 
                                localStorage.setItem('vy_ms_reply_shortcut_'+self.shortcut_id,msg_id);
                                
                                // remove from localstorage on window close
                                __j(window).off("unload.vy-ms__removeShortcutReply beforeunload.vy-ms__removeShortcutReply").on("unload.vy-ms__removeShortcutReply beforeunload.vy-ms__removeShortcutReply", function(){
                                    localStorage.removeItem('vy_ms_reply_shortcut_'+self.shortcut_id);
                                }); 
                            } else
                                self.replies[self.curr_recipient] = msg_id;
                            
                            self.reply_enabled = 1;
                            
                            if(self.shortcut_id){
                                __j('#'+self.shortcut_id).find('.emojionearea-editor').focusEnd();
                            } else {
                                if (typeof self.contenteditable != 'undefined') self.contenteditable.focusEnd();
                            }
 
                        },
                        this.forwardMessageCancel = function(el,ev){
                            evstop(ev,1);
                            el = __j(el);

                            let msg_data = objHook(el.parent().find('.js__vy_ms__content_hidden').html()),
                                msg_id = msg_data.id,
                                msg_text = msg_data.msg,
                                msg_to_userid = msg_data.to,
                                msg_to_group = msg_data.group,
                                btn_cancel_forward = el.parent().find('.js__vy-ms__forward_button_cancel'), 
                                btn_send_forward = el.parent().find('.js__vy-ms__forward_button_send'),
                                timeout_id = msg_to_group > 0 ? msg_to_group : msg_to_userid;
            
                                
                                clearTimeout(self.forward_msg_timeout[timeout_id]);
                                btn_cancel_forward.hide();
                                btn_send_forward.show();
                                
                        },
                        this.forwardMessageSend = function(el,ev){
                            evstop(ev,1);
                            
                            el = __j(el);
                            if(el.hasClass('_forward_sent')) return;
                            let msg_data = objHook(el.parent().find('.js__vy_ms__content_hidden').html()),
                                msg_id = msg_data.id,
                                msg_text = msg_data.msg,
                                msg_to_userid = msg_data.to,
                                msg_to_group = msg_data.group,
                                msg_from_id = msg_data.msg_full.from_id,
                                btn_cancel_forward = el.parent().find('.js__vy-ms__forward_button_cancel'), 
                                btn_send_forward = el.parent().find('.js__vy-ms__forward_button_send'),
                                timeout_id = msg_to_group > 0 ? msg_to_group : msg_to_userid;
                        
                                if(msg_id > 0 && $.trim(msg_text)){
                                    let contains_bbcodes = self.containsBBCODE(msg_text), no_bg = false;
                                    
                                    if(!contains_bbcodes) {
                                        no_bg = true;
                                    }  
                                    
 
                                    if(msg_to_userid > 0 && (msg_to_group <= 0 || msg_to_group == 'undefined')){
                                     
                                        btn_send_forward.hide();
                                        btn_cancel_forward.show();
                                         
                                        self.forward_msg_timeout[timeout_id] = setTimeout(function(){
                                            
                                            if(self.shortcut_id){ 
                                                mess_shortcut('mshortcut-'+self.shortcut_id).send(false, ev, msg_text, msg_to_userid, 0, 0, 1, 0, no_bg,{'forward':'yes', 'forward_own_msg':(msg_from_id == _U.i ? 'yes' : 'no'),'group':'no','userid':msg_to_userid});
                                            } else {
                                                self.send(false, ev, msg_text, msg_to_userid, 0, 0, 1,0,no_bg,{'forward':'yes', 'forward_own_msg':(msg_from_id == _U.i ? 'yes' : 'no'),'group':'no','userid':msg_to_userid});
                                            }
                                            btn_cancel_forward.hide();
                                            btn_send_forward.show();
                                            btn_send_forward.addClass('_nopointerevent _forward_sent').attr('disabled','disabled').text(lang.Messenger_Sent);

                                             
                                        },3500);
                                        
                                    }else if(msg_to_group > 0){
                                        
                                        btn_send_forward.hide();
                                        btn_cancel_forward.show();
                                        
                                        self.forward_msg_timeout[timeout_id] = setTimeout(function(){
                                            
                                            if(self.shortcut_id){
                                                mess_shortcut('mshortcut-'+self.shortcut_id).send(false, ev, msg_text, 0, 0, msg_to_group,0,0,no_bg,{'forward':'yes','forward_own_msg':(msg_from_id == _U.i ? 'yes' : 'no'),'group':msg_to_group,'group_data':msg_data.group_details,'userid':0});
                                                
                                            } else {
                                            
                                            self.send(false, ev, msg_text, 0, 0, msg_to_group, 0,0,no_bg,{'forward':'yes','forward_own_msg':(msg_from_id == _U.i ? 'yes' : 'no'),'group':msg_to_group,'group_data':msg_data.group_details,'userid':0});
                                            }
                                            
                                            btn_cancel_forward.hide();
                                            btn_send_forward.show();
                                            btn_send_forward.addClass('_nopointerevent _forward_sent').attr({'disabled':'disabled','forward-sent':1}).text(lang.Messenger_Sent);

                                        },3500);
                                        
                                    }
                                    
                                }
                        },
        
                        this.forward = async function(el,ev){
                            
                            await self.globalPopup('forward-message').then(function(cnt) {

                                                let shortcut_id = self.shortcut_id ? tonum(self.shortcut_id) : 0;
                                                let msg_id = __j(el).data('forward');
                                                let page = 1;
                                                let forward_msg = '', forward_msg_full_data = new Array(), forward_search_timeout;
                                                let last_append = 'contacts';
                                                cnt.html('<div class="div-loader"></div>');
                                                cnt.parent().parent().find('.vy_mess-pcontact_info').hide();
                                                let _stop_loadMoreonScroll = function(){
                                                    __j(window).off('scroll.globalpopup_loadmore');
                                                }; 
                                                let _loadMoreonScroll = function(){
                                                    
                                                    __j(window).off('scroll.globalpopup_loadmore').on('scroll.globalpopup_loadmore',function(e){
                                                        
                                                           if( __j(this).scrollTop() + __j(this).height() >= __j(document).height()) {
                                                             
                                                            page++; 
                                                            let send = jAjax(self.ajax_url,'post',{'cmd':'get-allmy-contacts-grouped','loadmore':1,'pagecount':page});
                                                                 send.done(function(data){ 
                                                                     data = validateJson(data); 

                                                                    if(data.msg == 'end') return;
                                                                     
                                                                    _appendData(data,1);    
                                                                                                                 
                                                                                                                
                                                            });
                                                                
                                                                
                                                            }
                                                    });
                                                     
                                                };
                                                let _getmarkup = function(u,is_group){
                                                     
                                                    let progress = '<div class="fwr_progress fwr_progress_blue">\
                                                                      <span class="fwr_progress-left">\
                                                                                        <span class="fwr_progress-bar"></span>\
                                                                      </span>\
                                                                      <span class="fwr_progress-right">\
                                                                                        <span class="fwr_progress-bar"></span>\
                                                                      </span>\
                                                                    </div>';
                                                    let btn = '<div id="vy_ms__forward_button_parent"><div class="vy_ms__content_hidden js__vy_ms__content_hidden"><!--{"is_group":"'+(is_group ? is_group : 'no')+'","group_details":'+JSON.stringify(u)+',"msg_full":'+JSON.stringify(forward_msg_full_data)+',"msg":"'+forward_msg+'","id":"'+msg_id+'","to":"'+(u.group_id > 0 ? 0 : u.user_id)+'","group":"'+u.group_id+'"}--></div><button onclick="messenger.forwardMessageCancel(this,event);" style="display:none;" class="js__vy-ms__forward_button_cancel">'+lang.messenger_cancel_button+'&nbsp;'+progress+'</button> <button onclick="messenger.forwardMessageSend(this,event);" class="js__vy-ms__forward_button_send">'+lang.Messenger_button_send+'</button></div>';
                                                    return '<div class="vy_ms__forward_umarkup">\
                                                                                    <div class="vy_ms__forward_left"><img src="'+u.avatar+'" /></div>\
                                                                                    <div class="vy_ms__forward_center"><div class="vy_ms__forward_u_name">'+u.fullname+'</div></div>\
                                                                                    <div class="vy_ms__forward_right"><div class="vy_ms__forward_button">'+btn+'</div></div>\
                                                                                    </div>';
                                                }
                                                let _appendData = function(d,append){
                                                     
                                                                let members = '', m_recent = '', m_groups = '', m_contacts = '', recent = '', groups = '', contacts = '';
                                                                if (d.msg == "done") {

                                                                    for (var i = 0; i < d.contacts.length; i++) {

                                                                        let u = d.contacts[i];
                                                                        
                                                                        contacts += _getmarkup(u);

                                                                    }
                                                                    
                                                                    
                                                                
                                                                
                                                                    for (var i = 0; i < d.groups.length; i++) {

                                                                        let u = d.groups[i];
                                                                        
                                                                        groups += _getmarkup(u,'yes');
                                                                        

                                                                    }
                                                                    if(!append){
                                                                    for (var i = 0; i < d.recent.length; i++) {

                                                                        let u = d.recent[i];
                                                                        
                                                                        recent += _getmarkup(u);

                                                                    }
                                                                    
                                                                    if(recent){
                                                                        
                                                                        m_recent = `<div class="vy_ms__forward_delim_c __recent">Recent</div><div id="vy_ms__forward_users_list">${recent}</div>`;
                                                                    }
                                                                    }
                                                                    
                                                                    if(groups && !append){
                                                                        
                                                                        m_groups = `<div class="vy_ms__forward_delim_c __groups">Groups</div><div id="vy_ms__forward_users_list">${groups}</div>`;
                                                                    }
                                                                    
                                                                    
                                                                
                                                                    if(contacts && !append){
                                                                        
                                                                        m_contacts = `<div class="vy_ms__forward_delim_c __contacts">Contacts</div><div id="vy_ms__forward_users_list">${contacts}</div>`;
                                                                    }
                                                                    
                                                                    if(append) {
                                                                        let app_contacts = '', app_groups = '';
                                                                        
                                                                        if(contacts) {
                                                                            app_contacts = contacts;
                                                                            cnt.find('#vy-ms__forward_appn_morecontacts').append(last_append == 'contacts' ? contacts : `<div class="vy_ms__forward_delim_c __contacts">Contacts</div><div id="vy_ms__forward_users_list">${contacts}</div>`);
                                                                            last_append = 'contacts';
                                                                        }
                                                                            
                                                                        if(groups) {
                                                                            app_groups = last_append == 'groups' ? groups : `<div class="vy_ms__forward_delim_c __groups">Groups</div><div id="vy_ms__forward_users_list">${groups}</div>`;
                                                                            cnt.find('#vy-ms__forward_appn_moregroups').append(app_groups);
                                                                            last_append = 'groups';
                                                                        }
                                                                        
                                                                     
                                                                     
                                                                    } else {
                                                                    
                                                                    cnt.html('<div id="vy_ms__forward_users_list">' + m_recent + m_groups + m_contacts +'<span id="vy-ms__forward_appn_morecontacts"></span><span id="vy-ms__forward_appn_moregroups"></span></div>');
                                                                    
                                                                    }
                                                                    _loadMoreonScroll();

                                                                } else {
                                                                    
                                                                    if(!append)
                                                                    cnt.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');
                                                                    
                                                                    if(append && d.end == 'yes')
                                                                        cnt.append('<div class="vy_ms__loadmore_reachend"></div>');
                                                                        _stop_loadMoreonScroll();
                                                                }
                                                                
                                                                
                                                    
                                                };
                                                
                                                // search
                                                cnt.parent().parent().find('#vy__ms_forward_cnt_searchcontactinput').off('keydown.forward_search').on('keydown.forward_search',function(e){
                                                    
                                                    clearTimeout(forward_search_timeout);
                                                });
                                                cnt.parent().parent().find('#vy__ms_forward_cnt_searchcontactinput').off('keypress.forward_search').on('keypress.forward_search',function(e){
                                                    
                                                    clearTimeout(forward_search_timeout);
                                                });
                                             
                                                cnt.parent().parent().find('#vy__ms_forward_cnt_searchcontactinput').off('keyup.forward_search').on('keyup.forward_search',function(e){
                                                    
                                                    let el = __j(this), x_close_ic = __j('.js__vy_ms__globalpopup_close_search');
                                                    clearTimeout(forward_search_timeout);
                                                    
                                                    forward_search_timeout = setTimeout(function(){
 

                                                                            let s_cnt = "#vy_ms__allmycontacts_searchres";
                                                                            let all_contacts = __j('#vy_ms__forward_users_list');
                                                                            let key = $.trim(el.val());

                                                                            if (key && key.length >= 2) {
                                                                                x_close_ic.show();
                                                                                all_contacts.hide();
                                                                                let cnt = __j(s_cnt);

                                                                                if (!cnt.length) {

                                                                                    all_contacts.before('<div id="vy_ms__allmycontacts_searchres"><div class="div-loader"></div></div>');
                                                                                    cnt = all_contacts.parent().find(s_cnt);

                                                                                }

                                                                                let send = jAjax(self.ajax_url, 'post', {
                                                                                    'cmd': 'search-in-all-contacts',
                                                                                    'key': escape(key)
                                                                                });
                                                                                send.done(function(data) {

                                                                                    let d = validateJson(data);
                                                                                    let contacts = '', header_title = `<div class="vy_ms__forward_delim_c __recent">Contacts</div>`;


                                                                                    if (d.msg == "done") {

                                                                                        for (var i = 0; i < d.users.length; i++) {

                                                                                            let m = d.users[i], is_group = m.group_id > 0 ? 'yes' : 'no';
                                                                                            
                                                                                            contacts += _getmarkup(m,is_group);
                                                                                            
                                                                                            if(is_group == 'yes')
                                                                                                header_title = `<div class="vy_ms__forward_delim_c __groups">Groups</div>`;
                                                                                        }
                                                                                        
                                                                                        cnt.html(header_title+contacts);

                                                                                    } else {

                                                                                        cnt.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');

                                                                                    }



                                                                                });

                                                                            } else {
                                                                                __j(s_cnt).remove();
                                                                                all_contacts.show();
                                                                                x_close_ic.hide();
                                                                            }
                                                        
                                                        
                                                        
                                                    },500);
                                                });
                                                let send = jAjax(self.ajax_url,'post',{'cmd':'get-allmy-contacts-grouped','pagecount':page});
                                                send.done(function(data){ 
                                                             
                                                    
                                                     var send = jAjax(self.ajax_url,'post',{'cmd':'get-msg-details','id':escape(msg_id)});
                                                     send.done(function(d){  
                                                         d = validateJson(d);
                                                         
                                                         if(d.status == 200){
                                                         forward_msg_full_data = d.data;
                                                         forward_msg = d.data.original_msg;
                                                         msg_id = d.data.id;
                                                     
                                                        _appendData(validateJson(data));
                                                        
                                                         } else {
                                                             
                                                            self.close_global_popup();
                                                            $.alert('[Error] '+d.msg);

                                                         }                                                           
                                                         
                                                     });
                                                    
                                                });
                                                    
                                                
                            });
                            
                        },
                        this.redialUser = function(el, evt, type) {
                            evt.preventDefault();

                            if (self.hasTouchStartEvent)
                                self.setUpVoiceVideoCallButtons(el, evt, type);
                            else {

                                el = __j(el);
                                if (type == 'audio')
                                    el.closest('.mmmm_c_m').find('#start-audio-chat').trigger('click.call_audio touchend.call_audio');
                                else
                                    el.closest('.mmmm_c_m').find('#start-video-chat').trigger('click.call_video touchend.call_video');

                            }
                        },
                        this.leftSideOptsMenuToggle = function(el,ev){
                            evstop(ev,1);


                            let $html = __j('html'), menu_coll = __j('#vymsn_leftmenucollapse'), menu_cnt = __j('.pmessenger_left_optsbar');

                            if(!$html.hasClass('vymsn_leftmenu_hideit') || !sessionStorage.getItem('vymsn_leftmenuhidden')){
                                sessionStorage.setItem('vymsn_leftmenuhidden',1);
                               
                                menu_cnt.addClass('_w0').on(self.crossEvent(),function(){
 
                                $html.addClass('vymsn_leftmenu_hideit');
                                menu_coll.show();

                                menu_cnt.off(self.crossEvent());
                                });

                            } else {
                                sessionStorage.removeItem('vymsn_leftmenuhidden');
                                $html.removeClass('vymsn_leftmenu_hideit');
                                menu_coll.hide();
                                setTimeout(function(){

                                    menu_cnt.removeClass('_w0').on(self.crossEvent(),function(){ 
                                    
                                    menu_cnt.off(self.crossEvent());
                                    });
                                },100);

                            }

                            menu_coll.off('click.vymsn_openleftoptsmenu').on('click.vymsn_openleftoptsmenu',function(e){
                                evstop(e);
                                self.leftSideOptsMenuToggle(this,e);

                            });

                        },
                        this.forwarded_markup = function(forwarded, you){
                            
                            return forwarded == 'yes' ? '<div class="vy_ms_few452x">'+self.svgi.js.forwarded_ic+' '+ (you ? lang.Messenger_you_forwarded_message : lang.Messenger_Forwarded_message) +'</div>' : '';
                            
                        },
                        this.appMessageV2 = async function(mid, whois, userId, userPhoto, user_fullname, mtime, mtext, online, m_bg, avatar, check_for_read_messaging, msgs_count, timestamp, php_curr_date, page_id, group_id, forwarded, reply) {
                                
                                if(reply)
                                    reply = validateJson(reply);
                               
                                mtext = self.emoji_convert(mtext);
                                let lastmsg_timestamp_obj = self.pmessenger.find('#vy_ms__lastmsg_timestamp');
                                let last_msg_timestamp = lastmsg_timestamp_obj.val();
                                var get_message_text_media = self.separateMediaFromText(mtext);
                                var message_text = get_message_text_media[0];
                                var message_html = get_message_text_media[1];

                                var is_new = self.shortcut ? (!self.shortcut.hasClass('_focus') || !vy_ms__window_tab_active) && !whois : !vy_ms__window_tab_active;


                                var append_container = page_id ? __j('.js_chat_with_page_' + page_id) : (group_id > 0 ? __j('.js_groupchat_id_' + group_id) : (self.shortcut ? self.shortcut : self.pmessenger));



                                if (php_curr_date) {
                                    var d = new Date(php_curr_date * 1000);
                                    var last_msg_date = d.getDate();



                                    if (userId != _U.i && self.shortcut && php_curr_date) {

                                        self.shortcut__appendNewDateTime(php_curr_date);

                                    } else if (userId != _U.i && !self.shortcut && php_curr_date) {

                                        self.appendNewDateTime(php_curr_date);
                                    }


                                }

                                let uphoto_group = userId != _U.i ? '<div class="sticky__txt_pmessenger-user-avatar"><img src="' + userPhoto + '" /></div>' : '';
                                let last_message_by_userid = append_container.find('.vy_ms__groupusermsgs:last').data('group-id');
                                let little_margin = (timestamp - last_msg_timestamp) >= self.message_space_time ? '' : '';
                                let margin_for_groups = userId != last_message_by_userid && userId != _U.i && last_message_by_userid != _U.i ? 'vy_ms__group_msg_margin' : '';
                                let show_username = (userId != last_message_by_userid && group_id > 0 && userId != _U.i) ? '<a href="/vyuser/' + userId + '" class="vy_ms__groupuser_fullname">' + user_fullname + '</a>' : '';
                                let reaction = self.getReactionMarkup({'id':mid,'reactions':new Array()});
                                let whois2 = whois == '_me' ? 'me' : '';
                                check_for_read_messaging = check_for_read_messaging || false;
                                avatar = avatar ? '<img src="' + userPhoto + '">' : '<img src="' + _BLANK + '">';
                        

                                var sent_status = '<div id="mess_sent_status" class="messenger_sent_Status" rel="tipsy" title="' + lang.mess_sent_status + '"><i class="glyphicon glyphicon-ok-circle messenger-sent-ic"></i></div>';
                                
                                var msg_markup =  little_margin +(userId != last_message_by_userid ? '<div data-group-id="' + userId + '" class="vy_ms__groupusermsgs '+whois+' '+ whois2 +'  ' + margin_for_groups + '">' + uphoto_group : '') + '<div id="msg_' + mid + '" data-unsettled-msg-id="' + mid + '"  class="pmessenger-message-txt '+(reply ? '_contains_reply' : '')+' '+(forwarded == 'yes' ? '__vforwarded' : '')+' soh-s ' + (m_bg == 'no' ? '_nobg' : '') + ' ' + whois + '">'+ self.meta_stretch() +'<div class="txt_pmessenger-user-avatar">' + avatar + '</div>' +

                                    self.forwarded_markup(forwarded,(whois == '_me' ? 1 : 0))+'<div class="vycntreply243">'+self.replied_msg(reply)+'<div class="messenger_text_col '+($.trim(message_html) ? 'noappeindx' : '')+' ' + (is_new && whois != '_me' ? 'is_new' : '') + '">' + ($.trim(message_text) ? '<div ' + (userId == _U.i ? 'rel="li-gliph-color-background"' : '') + ' class="txt_pmessenger-text mess-msgs-cnt-rows">' + show_username + message_text + self.getMeta(mtime) + reaction.markup +'</div>' : '') + ($.trim(message_html) ? '<div class="mess-msgs-cnt-rows messenger_media_in_msg">' + show_username + message_html + self.getMeta(mtime) + reaction.markup+'</div>' : '') +'</div></div>' + self.message_actions(mid, mtime, group_id, page_id, userId, reaction, whois) + '' + (self.show_sent_status ? sent_status : '') + '</div>' + (userId != last_message_by_userid ? '</div>' : '') + self.message_metah();



                                if (append_container.find('.messenger-no-messages').length && !self.shortcut)
                                   append_container.find('#messages-tick').replaceWith('<div id="messages-tick"><div class="nano"><div class="overthrow nano-content"><div id="messenger-nano-content-fullheight">' + msg_markup + '</div></div></div></div>');// append_container.find('#messages-tick').replaceWith('<div id="messages-tick"><div id="messenger-nano-content-fullheight">' + msg_markup + '</div></div>');
                                else if (append_container.find('.messenger-no-messages').length && self.shortcut)
                                    append_container.find('.messenger-no-messages').replaceWith('<div id="messenger-nano-content-fullheight">' + msg_markup + '</div>');
                                else if (userId == last_message_by_userid) {
                                    append_container.find('#messenger-nano-content-fullheight .vy_ms__groupusermsgs[data-group-id="' + userId + '"]:last').append(msg_markup);
                                } else {
                                    append_container.find('#messenger-nano-content-fullheight').append(msg_markup);
                                }



                                if (self.shortcut && !(self.pmessenger.length && __j('#messenger_with_user').val() == tonum(chat_id)) && !page_id && !group_id) {


                                    messenger_shortcut.scrollChat(self.shortcut_id, check_for_read_messaging, msgs_count, mid, 0, 0);
                                    self.show_sent_status = false;
                                }

                                if (page_id && self.shortcut_id) {

                                    messenger_shortcut.scrollChat(self.shortcut_id, check_for_read_messaging, msgs_count, mid, page_id);
                                    self.show_sent_status = false;

                                } else if (group_id > 0 && self.shortcut_id) {
                                    messenger_shortcut.scrollChat(self.shortcut_id, check_for_read_messaging, msgs_count, mid, 0, group_id);
                                    self.show_sent_status = false;
                                }


                                nanoScrollStart();

                                self.loadVoiceClips();
                                // scroll down to the last message
                                if (self.pmessenger.length && !self.shortcut) {
                                    if (self.scrollNow) {
                                        if (self.hasTouchStartEvent)
                                            setTimeout(function() {
                                                self.scrollChat(check_for_read_messaging, msgs_count, mid, userId, page_id, group_id);
                                            }, 10);
                                        else
                                            self.scrollChat(check_for_read_messaging, msgs_count, mid, userId, page_id, group_id);
                                    } else
                                        setTimeout(function() {
                                            self.scrollChat(check_for_read_messaging, msgs_count, mid, userId, page_id, group_id);

                                        }, 100);

                                    self.scrollNow = false;
                                    self.show_sent_status = false;
                                }

                                self.startvenobox();
                                
                                if(!self.hasTouchStartEvent)
                                    self.enable_reactions();
                                
                                lastmsg_timestamp_obj.val(timestamp);

                                //self.generateVideoPlayer(1);
                            },
                            this.updateConversationCache = function(msg_obj, _cacheName, prepend) {

                                // update cache
                                if (_ms_Cache.exist(_cacheName)) {

                                    let all_cache_msgs = validateJson(_ms_Cache.get(_cacheName));
                                    if(prepend){  
                                        
                                        all_cache_msgs['messages'].unshift(msg_obj);
                                    } else {
                                        all_cache_msgs['messages'].push(msg_obj);
                                    }

                                    _ms_Cache.set(_cacheName, JSON.stringify(all_cache_msgs));

                                }


                            },

                            this.liveMedia = async function(str, min, ot) {


                                    let post_data = {};

                                    post_data['cmd'] = 'bbcode';
                                    post_data['string'] = str;
                                    if (min)
                                        post_data['min'] = 'yes';

                                    if (ot)
                                        post_data['ot'] = 'yes';

                                    return jAjax(self.ajax_url, 'post', post_data);


                                },
                                this.getLoader = function(page_id) {

                                    return self.shortcut ? (page_id ? __j('.js_chat_with_page_' + page_id).find('.mdialog_send_message_loader') : self.shortcut.find('.mdialog_send_message_loader')) : __j('.mdialog_send_message_loader');

                                },
                                this.containsBBCODE = function(str) {

                                    let is_bbcode = !1;

                                    for (var i = 0; i < self.BBCODES.length; i++) {

                                        if (str.includes(self.BBCODES[i]))
                                            is_bbcode = !0;

                                    }

                                    return is_bbcode;

                                },
                                this.apMessage = async function(mid, whois, userId, userPhoto, user_fullname, mtime, mtext, online, m_bg, avatar, check_for_read_messaging, msgs_count, timestamp, php_curr_date, page_id, group_id, forwarded, reply) {

                                        // loader icon
                                        let l_status_message = self.getLoader(page_id);



                                        // make URLS clickable
                                        if (!self.containsBBCODE(mtext))
                                            mtext = self.tourl(mtext);

                                        if (m_bg == 'no' || self.containsBBCODE(mtext)) {

                                            // show loader 
                                            l_status_message.addClass('__visible showimportant');
                                            await self.liveMedia(mtext).then(async function(mtext) {

                                                // hide loader
                                                l_status_message.removeClass('__visible showimportant');
                                                return await self.appMessageV2(mid, whois, userId, userPhoto, user_fullname, mtime, mtext, online, m_bg, avatar, check_for_read_messaging, msgs_count, timestamp, php_curr_date, page_id, group_id, forwarded, reply);

                                            });

                                        } else
                                            return await self.appMessageV2(mid, whois, userId, userPhoto, user_fullname, mtime, mtext, online, m_bg, avatar, check_for_read_messaging, msgs_count, timestamp, php_curr_date, page_id, group_id, forwarded, reply);




                                    },
                                    this.tourl = function(text) {

                                        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

                                        return text.replace(urlRegex, function(url, b, c) {
                                            var url2 = (c == 'www.') ? 'http://' + url : url;
                                            return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
                                        });

                                    },
                                    this.startvenobox = function() {
                                        // attachments viewer
                                        //venobox(__j('[data-vbgall]'));
                                        /*__j('.js_lightgallery').lightGallery({
                                            thumbnail: true
                                        });*/


                                    },
                                    this.prependContactGroup = async function(el, evt, avatar, name, id, last_seen, last_msg, new_msg, click, is_return, page_id, group_id) {

                                            // get group details
                                            await jAjax(self.ajax_url, 'post', {
                                                'cmd': 'get-group-details',
                                                'group': escape(group_id)
                                            }).done(function(data) {
                                                data = validateJson(data);

                                                avatar = data.group_avatar;
                                                name = data.group_name;

                                            });

                                            return self.prependContact(el, evt, avatar, name, id, last_seen, last_msg, new_msg, click, is_return, page_id, group_id, 1);
                                        },
                                        this.prependContact = function(el, evt, avatar, name, id, last_seen, last_msg, new_msg, click, is_return, page_id, group_id, group_loaded) {

                                            el = __j(el);

                                            if (evt) evt.preventDefault();

                                            page_id = page_id || 0;
                                            group_id = group_id || 0;
                                            var old_contacts = __j('#messenger-contacts-last .nano-content');
                                            var contact_id = page_id > 0 ? 'contact-' + id + '_' + page_id : 'contact-' + id;

                                            if (group_id > 0 && !group_loaded) return self.prependContactGroup(el, evt, avatar, name, id, last_seen, last_msg, new_msg, click, is_return, page_id, group_id);



                                            if (group_id > 0) contact_id = 'contact-GG' + group_id;


                                            let sortContacts = function() {

                                                tinysort(old_contacts.find('.pmessenger-contact-a'), {
                                                    data: 'last-message-timestamp',
                                                    order: 'desc',
                                                    ignoreDashes: true
                                                });

                                            }
                                            let swipe_del = group_id > 0 ? '<div title="' + lang.Messenger_confirm_btn_leaving_group + '" id="' + group_id + '" class="mob_del_swipe_txt js__isgroup">' + lang.Messenger_confirm_btn_leaving_group + '</div>' : '<div title="' + lang.pm_delete_convers + '" class="mob_del_swipe_txt">' + lang.del_pm + '</div>';
                                            var html = '<div class="vy_ms_contactbord">\
                                    <a href="/messenger/' + (page_id > 0 ? id + '/' + page_id : (group_id > 0 ? 'g/' + group_id : id)) + '" id="' + contact_id + '" class="pmessenger-contact-a ' + (group_id > 0 ? 'vy_ms_contactisgroup contact_groupid_' + group_id : '') + ' ' + (new_msg ? '_newmessages' : '') + ' ' + (!click ? 'active' : '') + '" onclick="__j(\'.pmessenger-contact-a\').removeClass(\'active\');__j(this).addClass(\'active\');messenger.openContact(this,event,\'' + id + '\',\'' + avatar + '\',\'' + name + '\',\'' + last_seen + '\',\'' + page_id + '\',\'' + group_id + '\')">\
                                        <div class="js_conv_swipe pmessenger-mleft12">\
                                            <div class="pmessenger-contact-avatar">\
                                                <img src="' + avatar + '" />\
                                                <div class="only_ic global_user_online global_user_online_' + id + '"><i class="ic-online"></i></div>\
                                                </div>\
                                            <div class="pmessenger-contact-info">\
                                                <div class="pmessenger-contact-name ellip" title="' + name + '">' + name + '</div>\
                                                <div class="pmessenger-contact-last-msg ellip _1htf _6zke">\
                                                    <div class="_42dz5 ellip">' + (last_msg ? (last_msg.substring(0, 20) + (last_msg.length > 20 ? '...' : '')) : '&nbsp;') + '</div>\
                                                    <div class="pmessenger-contact-last-msg-time">\
                                                        <div class="pmessenger-contact-last-msg-time"><div class="_6zkf">&#8729;</div><span class="_1ht7 _6zkh timestamp">&nbsp;</span></div>\
                                                    </div>\
                                                </div>\
                                                ' + (new_msg ? '<div class="convo__unread oval in_messenger">+' + new_msg + '</div>' : '') + '\
                                            </div>\
                                        </div>\
                                        <div class="mob_delete_on_swipe js_mob_delete_conv_btn">' + swipe_del + '</div>\
                                    </a>\
                                </div>';

                                            if (is_return) {
                                                return html;

                                            } else {


                                                if (__j('#' + contact_id).length) {

                                                    __j('#' + contact_id).removeAttr('data-last-message-timestamp').attr('data-last-message-timestamp', Math.ceil((new Date().getTime()) * 1000)).trigger('click');
                                                    setTimeout(function() {

                                                        sortContacts();
                                                    }, 500);

                                                } else {
                                                    old_contacts.prepend(html);
                                                    if (!click)
                                                        messenger.openContact(__j('#' + contact_id), evt, id, avatar, name, last_seen);
                                                }
                                                self.closeSearch(__j('.messenger-cancel-search'), evt);
                                            }
                                        },
                                        this.closeSearch = function(el, evt) {

                                            evt.preventDefault();
                                            var contact_res = __j('#messenger-contacts-search-res').find('.nano-content');
                                            var last_contacts = __j('#messenger-contacts-last');
                                            el = __j(el);

                                            __j('#input-search-messenger').val('');
                                            el.addClass('hidden_elem');
                                            contact_res.empty();
                                            contact_res.parent().addClass('__none');
                                            last_contacts.show();
                                        },
                                        this.searchMessenger = function() {

                                            var contact_res = __j('#messenger-contacts-search-res').find('.nano-content');
                                            var last_contacts = __j('#messenger-contacts-last');
                                            var ms_srch_time;
                                            var u_markup = '<div onclick="messenger.prependContact(this,event,\'%avatar\',\'%name\',\'%id\',\'\');" id="%id" class="mess-search-contact-res">\
            <div class="mess-search-res_contact_avatar"><img src="%avatar" /></div>\
            <div class="mess-search-res_contact_details">\
            <div class="mess-search-res_contact_name">%name&nbsp;<div id="f_onl_gtm" class="only_ic global_user_online global_user_online_%id">%online</div></div>\
            </div>\
            </div>';


                                            // search friends
                                            var ms_s_inp = __j('#input-search-messenger');
                                            ms_s_inp.on('keydown keypress', function() {
                                                clearTimeout(ms_srch_time)
                                            });

                                            ms_s_inp.on('keyup', function(e) {
                                                evstop(e, 1);

                                                var $this = __j(this);
                                                var ms_u_key = $this.val();
                                                var cancel_search = __j('.messenger-cancel-search');
                                                var l_s_msg_us = __j('#pm_dlg_lft_users');
                                                var mdialog_srch_res = __j('#msg_d_search_res');
                                                var lupa_ic = __j('#msrch-act-1');
                                                var fbc_loader = "_55yn _55yo _55ym";
                                                if (mdialog_srch_res.length == 0) l_s_msg_us.before('<section id="msg_d_search_res"></section');



                                                if ($.trim(ms_u_key)) {
                                                    clearTimeout(ms_srch_time);
                                                    lupa_ic.removeClass('__remover').addClass(fbc_loader); //addClass('__loader');
                                                    cancel_search.removeClass('hidden_elem');
                                                    //self.stop_xhr('search');
                                                    ms_srch_time = setTimeout(function() {
                                                        var send = jAjax(self.ajax_url, 'post', 'cmd=searchFriends&key=' + escape(ms_u_key));
                                                        send.done(function(data) {

                                                            var vd = validateJson(data);
                                                            lupa_ic.removeClass(fbc_loader).addClass('__remover').on('click', function() {
                                                                $this.val('');
                                                                ms_s_inp.trigger('keyup')
                                                            });
                                                            last_contacts.hide();
                                                            contact_res.parent().removeClass('__none');
                                                            if (vd.length <= 0) {
                                                                // empty result
                                                                contact_res.html('<div class="mdialog_search_empty">' + lang.pm_no_friends_found + '</div>');
                                                            } else {
                                                                // result
                                                                var r_html = '';



                                                                for (var i = 0; i < vd.length; i++) {
                                                                    var rsd = vd[i];
                                                                    var mg_us_mkup = jprintf(u_markup, '1', 'onUcLeft', rsd.id, rsd.id, rsd.name, rsd.photo, rsd.id, rsd.photo, rsd.name, (rsd.online == 'true' ? '<div class="ic-online"></div>' : ''), rsd.id, rsd.id, rsd.name, rsd.id, '', 'notifications__hide', '');
                                                                    r_html += u_markup.replace(/%id/g, rsd.id).replace(/%avatar/g, rsd.photo).replace(/%online/g, (rsd.online == 'true' ? '<div class="ic-online"></div>' : '')).replace(/%name/g, rsd.name);

                                                                }
                                                                contact_res.html(r_html);

                                                                nanoScrollStart();
                                                            }

                                                        });
                                                    }, 500);

                                                } else {
                                                    last_contacts.show();
                                                    contact_res.empty();
                                                    contact_res.parent().addClass('__none');
                                                    lupa_ic.removeClass('__remover ' + fbc_loader);
                                                }

                                            });



                                        },
                                        this.getMyGroups = function(cnt) {


                                            cnt.removeClass('__none');
                                            cnt = cnt.find('.js__groups_tab_cnt');
                                            cnt.html('<div class="div-loader"></div>');


                                            self.stop_xhr('ms-groups-contacts');
                                            var send = jAjax(self.ajax_url, 'post', 'cmd=getMyGroups&view_as=json', false, 'ms-groups-contacts');


                                            send.done(function(result) {

                                                cnt.html(result);

                                                __j('#contact-GG' + self.group_id + ':first').addClass('active');
                                                __j('#contact-GG' + self.group_id + ':last').addClass('active');

                                                nanoScrollStart();
                                                if (self.hasTouchStartEvent) self.initTouchEvents();

                                            });

                                        },
                                        this.getOnlineContacts = function(cnt) {

                                            var no_online_contacts = '<div class="messenger_no_online_users">' + lang.mess_no_online_users + '</div>';
                                            cnt.removeClass('__none').html('<div class="div-loader"></div>');


                                                $.ajax({
                                                    url: 'https://'+CHAT_NODE_HOST+'/getonlinecontacts',
                                                    contentType: 'application/json',
                                                    data: JSON.stringify({"domain": V_WS_ADDR,"userid":socketId()}),
                                                    type: 'POST',
                                                    success: function (data) {
                                                 
                                                        var send = jAjax(self.ajax_url,'post',{'cmd':'online-users-details','users':JSON.stringify(data)});
                                                        send.done(function(result){
                                                            
                                                         
                                                            var u_mkup = '';
                                                            if (result !== 'null') {

                                                                for (var rs = validateJson(result), i = 0; i < rs.length; i++) {
                                                                    var d = rs[i];

                                                                    u_mkup += self.prependContact('', window.event, d.photo, d.name, d.id, d.last_seen, '', false, true, true);
                                                                }



                                                                cnt.html('<div class="nano-content">'+u_mkup+'</div>');
                                                                nanoScrollStart();
                                                            } else {

                                                                // no online friends
                                                                cnt.html(no_online_contacts);
                                                            }
                                                            
                                                            
                                                        });
                                                    },
                                                    error: function (xhr, status, error) {
                                                        console.log('Error: ' + error.message);
                                                         
                                                    },
                                                });

                                        },
                                        this.updateTopHaderActiveTab = function(a,count){

                                            switch(a){

                                                case 'contacts':
                                                    count = window.contacts_count;
                                                    __j('#vymsn_header_txttitle').text(lang.Contacts);
                                                    __j('#vymsn_header_count').text(`(${count})`).fadeIn();
                                                break;

                                                case 'groups':
                                                    count = groups_count;
                                                    __j('#vymsn_header_txttitle').text(lang.Messenger_top_Groups);
                                                    __j('#vymsn_header_count').text(`(${count})`).fadeIn();
                                                break;
                                                case 'online':
                                                    count = groups_count;
                                                    __j('#vymsn_header_txttitle').text(lang.Messenger_top_online);
                                                    __j('#vymsn_header_count').hide();
                                                break;
                                            }

                                        },
                                        this.removeh4activeforall = function(){

                                            __j('.h4active').each(function(){
                                                __j(this).removeClass('h4active');
                                            });

                                        },
                                        this.addh4active = function(elem){
                                            elem = __j(elem) || elem;
                                            elem.addClass('h4active');

                                        },
                                        this.switchTabs = function(tab, evt, c) {

                                            evt.preventDefault();
                                            tab = __j(tab);

                                            __j('.mstabactive').removeClass('active');


                                            self.removeh4activeforall();

                                            self.addh4active(tab);


                                            var online_cnt = __j('#messenger-contacts-online-res');
                                            var contacts_cnt = __j('#messenger-contacts-last');
                                            var groups_cnt = __j('#messenger-contacts-groups-res');
                                            var search_result = __j('#messenger-contacts-search-res');



                                            switch (c) {

                                                case 'conversations':
                                                    online_cnt.addClass('__none').empty();
                                                    groups_cnt.addClass('__none').find('.js__groups_tab_cnt').empty();
                                                    contacts_cnt.show();
                                                    self.updateTopHaderActiveTab('contacts');
                                                    __j('._1nq2').show();
                                                    nanoScrollStart();
                                                    break;

                                                case 'groups':
                                                    // hide contacts
                                                    contacts_cnt.hide();
                                                    self.updateTopHaderActiveTab('groups');
                                                    online_cnt.addClass('__none').empty();
                                                    // hide search
                                                    __j('._1nq2').hide();
                                                    search_result.addClass('__none');

                                                    self.getMyGroups(groups_cnt);

                                                    break;


                                                case 'online':
                                                    // hide contacts
                                                    contacts_cnt.hide();
                                                    self.updateTopHaderActiveTab('online');
                                                    // hide groups
                                                    groups_cnt.addClass('__none').find('.js__groups_tab_cnt').empty();
                                                    // hide search
                                                    __j('._1nq2').hide();
                                                    search_result.addClass('__none');

                                                    self.getOnlineContacts(online_cnt);

                                                    break;




                                            }
                                             
                                        },
                                        this.removeNewBubble = function(mid, timeout, without_id) {

                                            // unmark new messages
                                            var t = setTimeout(function() {

                                                if (self.shortcut) {

                                                    if (mid)
                                                        self.shortcut.find('.is_new').each(function() {


                                                            if (tonum(__j(this).closest('.pmessenger-message-txt').attr('id')) <= mid)
                                                                __j(this).removeClass('is_new');

                                                        });
                                                    else if (without_id) self.shortcut.find('.is_new').removeClass('is_new');




                                                } else {

                                                    if (mid)
                                                        self.pmessenger.find('.is_new').each(function() {


                                                            if (tonum(__j(this).closest('.pmessenger-message-txt').attr('id')) <= mid)
                                                                __j(this).removeClass('is_new');

                                                        });
                                                    else if (without_id) self.pmessenger.find('.is_new').removeClass('is_new');



                                                }




                                            }, timeout ? timeout : 5000);



                                        },
                                        this.updateMessagesAsRead = function(userid, msg_id, page_obj, group_id) {
                                            var page_id = 0;



                                            if (typeof page_obj == 'object' && Object.keys(page_obj).length && group_id <= 0) {

                                                if (typeof page_obj.userid != 'undefined') {
                                                    userid = !isNaN(page_obj.userid) ? page_obj.userid : tonum(page_obj.userid);
                                                    page_id = page_obj.page_id;

                                                    if (userid != _U.i) {

                                                        let avt = _U.p;


                                                        if (self.shortcut && self.shortcut.find('#messenger_page_admin').val() == "yes")
                                                            avt = self.shortcut.find('#inphd_page_avatar').attr('src');
                                                        else if (self.pmessenger.find('#messenger_page_admin').val() == "yes")
                                                            avt = self.pmessenger.find('#inphd_page_avatar').attr('src');

 

                                                        self.socket.emit("seen", JSON.stringify({
                                                            'Msg_id': msg_id,
                                                            'Userid': socketId(userid),
                                                            'Page_id': page_id,
                                                            'Group_id': 0,
                                                            'Recipient_id': _U.i,
                                                            'Recipient_avatar': avt,
                                                            'Group_avatar': false
                                                        }));

                                                        var send = jAjax(self.ajax_url, 'post', {
                                                            'cmd': 'node-update-all-msgs-as-read',
                                                            'userid': userid,
                                                            'page': page_id
                                                        });
                                                        send.done(function(d) {

                                                            if (self.shortcut) __j('#mshortcut-' + userid + '_' + page_id).removeClass('_h_unread');
                                                            __j('#contact-' + userid + '_' + page_id).removeClass('_newmessages').find('.convo__unread.in_messenger').remove();

                                                            self.removeNewBubble(msg_id);
                                                            self.updateGlobalCount(userid, page_id, group_id);
                                                            setTimeout(function() {
                                                                gwtlog.updateTotalMessages();
                                                            }, 50);

                                                            // remove from online hook
                                                            __j('.nav_tool_friends_online #friend_' + userid).find('#online-friend-new-msg-count').remove();
                                                        });


                                                    }
                                                }

                                            } else if (group_id > 0) {

                                                if (userid != _U.i) {

                                                    let group_avatar = __j('.pmessenger #vy_messenger_group_id_' + group_id).length ? __j('#vy_messenger_group_id_' + group_id).attr('src') : __j('#vy_shortcut_group_id_' + group_id).attr('src');
                                                    self.socket.emit("group_seen", JSON.stringify({
                                                        'Msg_id': msg_id,
                                                        'Userid': socketId(userid),
                                                        'Page_id': 0,
                                                        'Recipient_id': _U.i,
                                                        'Recipient_avatar': _U.p,
                                                        'Room': self.room_id,
                                                        'Group': socketId('GG' + group_id),
                                                        'Group_id': group_id,
                                                        'Group_avatar': encodeURIComponent(group_avatar)
                                                    }));
 
                                                    var send = jAjax(self.ajax_url, 'post', {
                                                        'cmd': 'node-update-all-msgs-as-read',
                                                        'userid': 0,
                                                        'page': 0,
                                                        'group': escape(group_id)
                                                    });
                                                    send.done(function(d) {

                                                        if (self.shortcut) __j('#mshortcut-GG' + group_id).removeClass('_h_unread');
                                                        __j('#contact-GG' + group_id).removeClass('_newmessages').find('.convo__unread.in_messenger').remove();

                                                        self.removeNewBubble(msg_id);
                                                        self.updateGlobalCount(userid, page_id, group_id);
                                                        setTimeout(function() {
                                                            gwtlog.updateTotalMessages();
                                                        }, 50);
                                                    });

                                                }

                                            } else if (!page_id && !group_id) {

                                                if (userid != _U.i) {

                                                    self.socket.emit("seen", JSON.stringify({
                                                        "Msg_id": msg_id,
                                                        "Userid": socketId(userid),
                                                        "Page_id": 0,
                                                        "Group_id": 0,
                                                        "Recipient_id": _U.i,
                                                        "Recipient_avatar": _U.p,
                                                        'Group_avatar': false
                                                    }));
                                                     
                                                    __j('#online_'+userid).find('.new-message-alert').addClass('hidden').empty();
                                                    var send = jAjax(self.ajax_url, 'post', {
                                                        'cmd': 'node-update-all-msgs-as-read',
                                                        'userid': userid
                                                    });
                                                    send.done(function() {

                                                        if (self.shortcut) self.shortcut.removeClass('_h_unread');
                                                        __j('#contact-' + userid).removeClass('_newmessages').find('.convo__unread.in_messenger').remove();

                                                        self.removeNewBubble(msg_id);
                                                        
                                                        

                                                        self.updateGlobalCount(userid, page_id);
                                                        setTimeout(function() {
                                                            gwtlog.updateTotalMessages();
                                                        }, 50);
                                                        // remove from online hook
                                                        __j('.nav_tool_friends_online #friend_' + userid).find('#online-friend-new-msg-count').remove();
                                                    });


                                                }

                                            }



                                        },
                                        this.updateGlobalCount = function(userid, page_id, group_id) {

                                            if (page_id > 0)
                                                g_messenger_count[userid + '_' + page_id] = 0;
                                            else if (group_id > 0)
                                                g_messenger_count['GG' + group_id] = 0;
                                            else
                                                g_messenger_count[userid] = 0;

                                        },
                                        this.notificationNewMessage = function(c, userid, msg_id, page_id, group_id, is_shortcut) {

                                            let contact = '';
                                            if (page_id > 0)
                                                contact = userid + '_' + page_id;
                                            else if (group_id > 0)
                                                contact = 'GG' + group_id;
                                            else
                                                contact = userid;


                                            if (self.pmessenger.length)
                                                contact = __j('[rel="contactid-' + contact + '"]');
                                            else
                                                contact = __j('#mshortcut-' + contact);


                                            if (!c || !contact.length) return;
                                            var nano = __j("#messages-tick > .nano");
                                            var nano_msg_cnt = nano.find('#messenger-nano-content-fullheight');


                                            if (!nano_msg_cnt.find('#flying-notif-new-messages').length) {

                                                nano_msg_cnt.append(self.flying_new_message_markup.replace('%count', c));


                                            } else {
                                                nano_msg_cnt.find('#flying-notif-new-messages').replaceWith(self.flying_new_message_markup.replace('%count', c));

                                            }

                                            //  var is_scrollbar = nano.length ? 

                                            __j('.pmessenger #flying-notif-new-messages').off('click.new_msg_flying').on('click.new_msg_flying', function(e) {

                                                evstop(e, 1);
                                                // stop double fire
                                                if (__j(this).hasClass('triggered'))
                                                    return;

 
                                                __j(this).addClass('triggered');
                                                setTimeout(function() {
                                                    __j(this).removeClass('triggered');

                                                }, 1000);

                                                if (!__j(this).hasClass('no-nano-scroll'))
                                                    nano.nanoScroller({
                                                        scroll: 'bottom'
                                                    });


                                                __j(this).fadeOut(function() {
                                                    __j(this).remove();
                                                });

                                                var page_obj = {};
                                                var chatwithpage_id = __j('#messenger_with_page').val();
                                                if (chatwithpage_id != 'none') {


                                                    page_obj['userid'] = userid;
                                                    page_obj['page_id'] = chatwithpage_id;
                                                }

                                                let l_group_id = __j(this).closest('.js_mess_hidden_data').find('#messenger_with_group').val();
                                                if (l_group_id == 'none' || l_group_id == '0')
                                                    l_group_id = 0;


                                                self.updateMessagesAsRead(userid, msg_id, page_obj, l_group_id);


                                                if (self.minus_count_message) global_messenger_count -= 1;
                                                gwtlog.updateCountMessages(global_messenger_count);




                                                self.minus_count_message = false;

                                                //  __j(window).off('focus.messenger'); 

                                            });


                                            var nano = __j("#messages-tick > .nano");
                                            var nano_pane = nano.find('.nano-content');
                                            var nano_scrolltop = nano_pane.scrollTop();

                                            if (nano_scrolltop <= 0) __j('.pmessenger #flying-notif-new-messages').addClass('no-nano-scroll').trigger('click.new_msg_flying');

                                            nano.off('scrollend.notifNewMessageBottom').on('scrollend.notifNewMessageBottom', function() {


                                                __j('.pmessenger #flying-notif-new-messages').addClass('no-nano-scroll').trigger('click.new_msg_flying');
                                                nano.off('scrollend.notifNewMessageBottom');


                                            });
                                            if (vy_ms__window_tab_active)
                                                setTimeout(function() {
                                                    self.turnOnSound();
                                                }, 10);

                                        },
                                        this.blinkWindowTitle = function() {
                                            /*
                                            if (self.getTotalMessUnreadCount() <= 0) {

                                                document.title = self.window_curr_title;
                                                return clearInterval(self.blinkTitleInterval);

                                            }

                                            if (!self.window_curr_title)
                                                self.window_curr_title = document.title;

                                            var create_window_title = '(' + self.getTotalMessUnreadCount() + ') ' + (self.getTotalMessUnreadCount() > 1 ? lang.new_messages : lang.new_message);

                                            document.title = self.isOldTitle ? self.window_curr_title : create_window_title;
                                            self.isOldTitle = !self.isOldTitle;
                                            */


                                        },
                                        this.getTotalMessUnreadCount = function() {

                                            return parseInt(global_messenger_count); //+parseInt(self.last_message_object.global);

                                        },
                                        this.messengerFocusWindow = function(obj, page_id, group_id) {

                                            clearInterval(self.blinkTitleInterval);

                                            //self.last_message_object = obj || self.last_message_object;//self.shortcut ? obj : self.last_message_object;
                                            if (self.getTotalMessUnreadCount() <= 0) {
                                                clearInterval(self.blinkTitleInterval);
                                                return;
                                            }


                                            // change document title
                                            self.blinkTitleInterval = setInterval(self.blinkWindowTitle, 700);




                                            setTimeout(function() {




                                                if (Object.keys(self.last_message_object).length) {
                                                    self.notificationNewMessage(

                                                        self.last_message_object.msgs_count,
                                                        self.last_message_object.userid,
                                                        self.last_message_object.msg_id,
                                                        page_id,
                                                        group_id

                                                    );
                                                    if (!vy_ms__window_tab_active)
                                                        setTimeout(function() {
                                                            self.turnOnSound();
                                                        }, 10);




                                                }

                                                if (self.shortcut && obj) {

                                                    if (Object.keys(obj).length)
                                                        messenger_shortcut.notificationNewMessage(

                                                            obj.msgs_count,
                                                            obj.userid,
                                                            obj.msg_id,
                                                            obj.page_id,
                                                            obj.group_id,
                                                            true

                                                        );

                                                }



                                            }, 100);




                                            __j(window).off("focus.messenger").on("focus.messenger", function(e) {
                                                //evstop(e,1);

                                                setTimeout(function() {
                                                    nanoScrollStart();
                                                    clearInterval(self.blinkTitleInterval);
                                                    document.title = self.window_curr_title;
                                                    self.window_curr_title = document.title;
                                                    self.last_message_object = {};
                                                }, 100);

                                                //if(self.hasTouchStartEvent)
                                                //  m_getData();
                                            });




                                        },

                                        this.scrollChat = function(read_messages, msgs_count, msg_id, userid, page_id, group_id) {

                                            var nano = __j("#messages-tick > .nano");
                                            var nano_pane = nano.find('#messenger-nano-content-fullheight');
                                            var last_msg = __j('.pmessenger .pmessenger-message-txt:last');
                                            var nano_fullheight = __j('.pmessenger #messenger-nano-content-fullheight');

                                            if (!vy_ms__window_tab_active) {

                                                if (!msgs_count) return;
                                                self.minus_count_message = true;

                                                self.last_message_object = {
                                                    'msg_id': msg_id,
                                                    'msgs_count': msgs_count,
                                                    'userid': group_id ? group_id : userid,
                                                    'global': 1
                                                };
                                                if (page_id)
                                                    self.last_message_object['page_id'] = page_id;
                                                else if (group_id) self.last_message_object['group_id'] = group_id;
                                                else
                                                    return self.messengerFocusWindow();

                                            } else {

                                                //__j(window).off("focus.messenger");
                                            }




                                            nanoScrollStart();




                                            if ((nano_fullheight.height() - nano_pane.scrollTop() - nano.height() >= 100) && read_messages) {


                                                if (msg_id) __j('#msg_' + msg_id + ':not(._me)').find('.messenger_text_col').addClass('is_new');

                                                self.notificationNewMessage(msgs_count, userid, msg_id, page_id, group_id);
                                            } else {


                                                var page_obj = {};
                                                var chatwithpage_id = __j('#messenger_with_page').val();
                                                if (chatwithpage_id != 'none') {


                                                    page_obj['userid'] = userid;
                                                    page_obj['page_id'] = chatwithpage_id;
                                                }
                                                let group_id = __j('#messenger_with_group').val();
                                                if (group_id == 'none' || group_id == '0')
                                                    group_id = 0;


                                                if (page_id > 0) {
                                                    page_obj['userid'] = userid;
                                                    page_obj['page_id'] = chatwithpage_id;
                                                }


                                                if (msg_id) self.updateMessagesAsRead(userid, msg_id, page_obj, group_id);

                                                setTimeout(function() {

                                                    var scroll_evt = 'scrollend.c' + self.randId;
                                                    nano.nanoScroller({
                                                        scroll: 'bottom'
                                                    }).on(scroll_evt, function() {

                                                        self.removeNewBubble(msg_id);
                                                        self.gl_scrollChatDelay = false;
                                                    });
                                                    nano.trigger(scroll_evt);

                                                }, self.gl_scrollChatDelay ? self.gl_scrollChatDelay : 10);

                                                nano.nanoScroller({
                                                    scroll: 'bottom'
                                                });

                                            }
                                        },
                                        this.getAttachments = function(uid, offset) {
                                            self.pmessenger.find('#vy_ms__btn_loadmoreattchments').remove();
                                            var attachments_cnt = __j('.rgpos3x3pps');

                                            var group_id, page_id;
                                            var cmd = {
                                                'cmd': offset ? 'get-more-attachments' : 'get-attachments',
                                                'userid': escape(uid)
                                            };
                                            if (__j('#messenger_with_page').val() != 'none') {
                                                page_id = __j('#messenger_with_page').val();
                                                cmd['page'] = page_id;
                                            }

                                            if (__j('#messenger_with_group').val() != 'none') {
                                                group_id = __j('#messenger_with_group').val();
                                                cmd['group'] = group_id;
                                            }

                                            let draft_id = (page_id ? page_id + '_' + uid : (group_id ? 'GG' + group_id : uid));

                                            if (offset)
                                                cmd['offset'] = self.attach_draft_offset.hasOwnProperty(draft_id) && self.attach_draft.hasOwnProperty(draft_id) ? self.attach_draft_offset[draft_id] : escape(offset);

                                            if (self.attach_draft_polnii.hasOwnProperty(draft_id) && offset)
                                                return;

                                            if ((self.attach_draft.hasOwnProperty(draft_id) && !offset) || (offset && self.attach_draft_polnii.hasOwnProperty(draft_id))) {

                                                attachments_cnt.html(self.attach_draft[draft_id]);
                                                setTimeout(function() {
                                                    nanoScrollStart();
                                                    self.startvenobox();
                                                }, 500);

                                                return;
                                            }
                                            if (offset) attachments_cnt.append('<div class="div-loader"></div>');
                                            else attachments_cnt.html('<div class="div-loader"></div>');
                                            var send = jAjax(self.ajax_url, 'post', cmd, false, 'ms-attach-' + uid);
                                            send.done(function(data) {
                                            
                                                attachments_cnt.find('.div-loader').remove();

                                                var d = validateJson(data);

                                                if (d.success == 1) {
                                                    if (offset) self.attach_draft_offset[draft_id] = offset;
                                                    if (d.info == 'no') {
                                                        if (offset)
                                                            return self.attach_draft_polnii[draft_id] = 1;
                                                        else
                                                            attachments_cnt.html('<div class="mess-textcenter">' + lang.messenger_no_attach + '</div>');
                                                    } else {

                                                        var files = '',
                                                            videos_simul = '';

                                                        for (var i = 0; i < d.files.length; i++) {
                                                            var file = d.files[i];
                                                            var file_type = file.type == 'video' ? 'video-cover' : 'image';

                                                            if (file.type == 'image')
                                                            files += '<a class="mess image-hover" data-fancybox="gallery" href="/vy-messenger-cmd.php?cmd=atch&id=' + file.id + '"><img src="/vy-messenger-cmd.php?cmd=atch&id=' + file.id + '&type=' + file_type + '"></a>';
                                                            else {
                                                            files += '<a class="mess image-hover" data-type="video" data-fancybox="gallery" href="/vy-messenger-cmd.php?cmd=atch&id=' + file.id + '&type=video"><img src="/vy-messenger-cmd.php?cmd=atch&id=' + file.id + '&type=' + file_type + '"></a>';
 
                                                            }
                                                        }

                                                        let load_more = self.attach_draft_polnii.hasOwnProperty(draft_id) ? '' : '<div id="vy_ms__btn_loadmoreattchments" class="messenger-load-more-contacts-loader pmessenger-contact-a"><a class="link-show-more loader-controls private" onclick="messenger.load_more_attachments(event,' + uid + ');" uid="prevDialogs">' + lang.Load_more + '</a></div>';
                                                        let new_html = videos_simul + '<div class="js_lightgallery">' + files + '</div>' + load_more;

                                                        if (offset) attachments_cnt.append(new_html);
                                                        else attachments_cnt.html(new_html);
                                                        if (offset)
                                                            self.attach_draft[draft_id] += new_html;
                                                        else
                                                            self.attach_draft[draft_id] = new_html;

                                                        nanoScrollStart();
                                                        self.startvenobox();

                                                    }

                                                } else {

                                                    attachments_cnt.text(lang.messenger_err_loading_attach);

                                                }




                                            });


                                        },
                                        this.expandTab = function(evt, el) {

                                            el = __j(el);

                                            if (el.parent().hasClass('expanded')) {

                                                el.parent().removeClass('expanded');


                                            } else {

                                                el.parent().addClass('expanded');
                                            }

                                            nanoScrollStart();

                                        },
                                        this.setColorFromNativeApp = function(color, uid) {



                                            var send = jAjax(self.ajax_url, 'post', {
                                                'cmd': 'setColor',
                                                'color': color,
                                                'userid': escape(uid)
                                            });

                                            send.done(function(data) {});
                                        },
                                        this.setTheme = function(el, uid, group_id) {

                                            el = __j(el);


                                            var theme = el.data('theme');
                                            var s_shortcut_id = self.shortcut_id ? tonum(self.shortcut_id) : 0;

                                            if (window.vymsn_themes.indexOf(theme) <= -1) {

                                                return displayErr(lang.messenger_invalid_color);
                                            }

                                            ajaxLoading();

                                            var send = jAjax(self.ajax_url, 'post', {
                                                'cmd': 'setTheme',
                                                'theme': theme,
                                                'userid': escape(uid),
                                                'group': escape(group_id)
                                            });

                                            send.done(function(data) {
                                                data = validateJson(data);
 
                                                removeAjaxLoad();
                                                if (data.hasOwnProperty('color') && data.hasOwnProperty('theme')) {
                                                    __j('.mess_color.active').removeClass('active');

                                                    el.addClass('active');
                                                    
                                                    let page_id = 0;
                                                    self.closeModernPopup();
                                                    let local_room_id = generateRoomId(uid, _U.i, page_id, group_id);

                                                    setTimeout(function() {
                                                        self.writeNotification('color_changed*' + _U.fn + '*' + data.color +'|'+ data.theme + '*' + group_id, 'colors', (group_id > 0 && self.shortcut_id ? self.shortcut_id.replace('mshortcut-', '') : s_shortcut_id), local_room_id, uid, page_id, group_id);
                                                    }, 100);
                                                    self.curr_color = data.color;

                                                } else {

                                                    return displayErr(lang.somethingWrong);
                                                }
                                            });


                                        },
                                        this.current_color = function() {
                                            let c = self.default_color;
                                            if (self.shortcut)
                                                c = self.shortcut.find('#chat-curr-color').val();
                                            else
                                                c = self.pmessenger.length ? __j('#mess-curr-color').val() : self.curr_color;

                                            return c;
                                        },
                                        this.applyTheme = async function(theme, _shortcut_id, page_id, group_id){
                                            _shortcut_id = _shortcut_id ? tonum(_shortcut_id) : 0;
                                            theme = `${vy_msn_path}/themes/${theme}/bg.jpg`;
                                            let color = await (await fetch(theme.replace('bg.jpg','color.json?v='+Math.random()))).json();
                                            color = color.color;
  
                                            if(_shortcut_id)
                                                this.applyThemeForShortcut(theme, _shortcut_id, page_id, group_id,color);
                                            else this.applyThemeForMessenger(theme, page_id, group_id,color);



                                        },
                                        this.applyThemeForShortcut = function(theme, _shortcut_id, page_id, group_id, color){

                                            // add theme in dom
                                            if(!__j('body').find('#vy_msn_currpseudo_themes_'+_shortcut_id).length){


                                                __j('body').prepend('<style id="vy_msn_currpseudo_themes_'+_shortcut_id+'">#mshortcut_theme_apply_'+_shortcut_id+'.ywvji4ppi:before{background-image:url('+theme+')!important;}</style>');

                                            } else {

                                                __j('body').find('#vy_msn_currpseudo_themes_'+_shortcut_id).html('#mshortcut_theme_apply_'+_shortcut_id+'.ywvji4ppi:before{background-image:url('+theme+')!important;}');

                                            }

                                            // appeindix color in dom
                                            let svg_appendix = `<svg xmlns="http://www.w3.org/2000/svg" width="9" height="20"><defs><filter x="-50%" y="-14.7%" width="200%" height="141.2%" filterUnits="objectBoundingBox" id="a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0" in="shadowBlurOuter1"/></filter></defs><g fill="none" fill-rule="evenodd"><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#000" filter="url(#a)"/><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="${color}" class="corner"/></g></svg>`;     
                                            let encoded_svg = window.btoa(svg_appendix);
                                            let ready_appendix = "url(data:image/svg+xml;base64,"+encoded_svg+")";
                                            
                                            if(!__j('body').find('#vy_msn_appendixpseudo_color_'+_shortcut_id).length){




                                                __j('body').prepend('<style id="vy_msn_appendixpseudo_color_'+_shortcut_id+'">#mshortcut_cnt_'+_shortcut_id+' .vy_ms__groupusermsgs.me .pmessenger-message-txt:last-child .messenger_text_col:after{background-image:'+ready_appendix+';!important}</style>');
                                                    
                                            } else {

                                                __j('body').find('#vy_msn_appendixpseudo_color_'+_shortcut_id).html('#mshortcut_cnt_'+_shortcut_id+' .vy_ms__groupusermsgs.me .pmessenger-message-txt:last-child .messenger_text_col:after{background-image:'+ready_appendix+';!important}');

                                            }

                                        },
                                        this.applyThemeForMessenger = function(theme, page_id, group_id, color){
 
                                            // add theme in dom
                                            if(!__j('body').find('#vy_msn_currpseudo_themes').length){


                                                __j('body').prepend('<style id="vy_msn_currpseudo_themes">.ywvji4ppi:before{background-image:url('+theme+')!important;}</style>');

                                            } else {

                                                __j('body').find('#vy_msn_currpseudo_themes').html('.ywvji4ppi:before{background-image:url('+theme+')!important;}');

                                            }

                                            // appeindix color in dom
                                            let svg_appendix = `<svg xmlns="http://www.w3.org/2000/svg" width="9" height="20"><defs><filter x="-50%" y="-14.7%" width="200%" height="141.2%" filterUnits="objectBoundingBox" id="a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0" in="shadowBlurOuter1"/></filter></defs><g fill="none" fill-rule="evenodd"><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#000" filter="url(#a)"/><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="${color}" class="corner"/></g></svg>`;     
                                            let encoded_svg = window.btoa(svg_appendix);
                                            let ready_appendix = "url(data:image/svg+xml;base64,"+encoded_svg+")";
                                            
                                            if(!__j('body').find('#vy_msn_appendixpseudo_color').length){




                                                __j('body').prepend('<style id="vy_msn_appendixpseudo_color">.vy_ms__groupusermsgs.me .pmessenger-message-txt:last-child .messenger_text_col:after{background-image:'+ready_appendix+';}</style>');
                                                    
                                            } else {

                                                __j('body').find('#vy_msn_appendixpseudo_color').html('.vy_ms__groupusermsgs.me .pmessenger-message-txt:last-child .messenger_text_col:after{background-image:'+ready_appendix+';}');

                                            }

                                        },
                                        this.colorateStrokes = function(color, chat, page_id, group_id) {
                                            var chat_id = chat;
                                            chat = chat ? '#' + chat + ' ' : false;

                                            var elements_type = {
                                                "stroke": "mess-colorate-this-stroke",
                                                "fill": "mess-colorate-this-fill",
                                                "color": "gliph-mess-color",
                                                "background-color": "li-gliph-color-background",
                                                "border-color": "li-gliph-color-border"

                                            };
                                            /*let css = self.mess_colors.hasOwnProperty(color) && self.mess_colors[color]['img'] ? {
                                                'background-color': color,
                                                'background-image': self.mess_colors[color]['img'],
                                                 'background-attachment': 'unset'
                                            } : {
                                                'background-color': color
                                            };*/
                                            css = {
                                                'background-color': color
                                            };


                                           // __j('#messenger-nano-content-fullheight').css(css);
 
                                            var mess = chat ? '#messenger_' + tonum(__j(chat).attr('id')) + ' ' : '.pmessenger ';


                                            if (chat)
                                                __j(chat).find('#chat-curr-color').val(color);

                                            if (mess)
                                                __j(mess.replace(' ', '')).find('#mess-curr-color').val(color);


                                            $.each(elements_type, function(key, value) {


                                                __j(mess + '[rel="' + value + '"]').each(function() {
                                                    if (key == 'fill' || key == 'stroke')
                                                        __j(this).attr(key, color);
                                                    else {

                                                        if (key == 'background-color')
                                                            __j(this).removeAttr('style').css(css);
                                                        else
                                                            __j(this).removeAttr('style').css(key, color);


                                                    }
                                                });


                                                __j(chat + '[rel="' + value + '"]').each(function() {

                                                    if (key == 'fill' || key == 'stroke')
                                                        __j(this).attr(key, color);
                                                    else {

                                                        if (key == 'background-color')
                                                            __j(this).removeAttr('style').css(css);
                                                        else
                                                            __j(this).removeAttr('style').css(key, color);
                                                    }

                                                });



                                            });


                                            // colorate messages
                                            var message = __j(chat + '.pmessenger-message-txt._me').find('.txt_pmessenger-text');

                                            __j(chat + '.pmessenger-message-txt._me').find('.txt_pmessenger-text').css(css);

                                            var check_for_page = function() {
                                                var page_id_value = __j('#messenger_with_page').val();
                                                return __j('.js_chatwithpage').length ? 'messenger-pseudo-element-color-mshortcut-' + self.recipient_id + '_' + page_id_value : 'messenger-pseudo-element-color-mshortcut-' + self.recipient_id;
                                            }

                                            var style_id = chat_id ? 'messenger-pseudo-element-color-' + chat_id : check_for_page();
                                            var color_ps_before = '<style id="' + style_id + '">#' + chat_id + ' .messenger-shortcut-cnt ._me .txt_pmessenger-text:before{ border-right-color: %color;}</style>';

                                            if (!__j('body').find('#' + style_id).length) {

                                                __j('body').prepend(color_ps_before.replace(/%color/g, color));
                                            } else {
                                                __j('body').find('#' + style_id).replaceWith(color_ps_before.replace(/%color/g, color));
                                            }

                                        },
                                        this.touchHandler = function(event) {
                                            if (event.touches.length > 1) {
                                                //the event is multi-touch
                                                //you can then prevent the behavior
                                                event.preventDefault();
                                            }
                                        },
                                        this.setNicknameInGroup = function(nickname, group_id, old_nickname, shortcut_id) {


                                            var send = jAjax(self.ajax_url, 'post', {
                                                'cmd': 'setnickname',
                                                'group': escape(group_id),
                                                'userid': escape(_U.i),
                                                'my_nickname': escape(nickname)
                                            });

                                            send.done(function(data) {

                                                data = validateJson(data);

                                                if (data.status != 200) {
                                                    return __j('#vy_ms__nickname_err').text(lang.Messenger_error + ' ' + data.msg);

                                                } else {

                                                    let nick_removed = $.trim(nickname) ? false : true;
                                                    let s_nickname = $.trim(nickname) ? encodeURIComponent(nickname) : encodeURIComponent(_U.fn);
                                                    self.closeModernPopup();
                                                    if (old_nickname == nickname) return;
                                                    if (self.shortcut) self.shortcut.find('#messenger_group_nickname').val(nickname);
                                                    else self.pmessenger.find('#messenger_group_nickname').val(nickname);
                                                    self.groupNotification(_U.i, group_id, (nick_removed ? 'user-nickname-removed' : 'user-nickname-update'));
                                                    self.socket.emit("vy_ms__groupUpdateNickNames", JSON.stringify({
                                                        'Userid': _U.i,
                                                        'User': _U,
                                                        'Group_id': socketId('GG' + group_id),
                                                        'Group_clean_id': group_id,
                                                        'Group_data': validateJson(data.group_data),
                                                        'Nickname': s_nickname,
                                                        'shortcut_id': shortcut_id,
                                                        'nickname_removed': nick_removed

                                                    }));

                                                }

                                            });

                                        },
                                        this.getMuteStatus = function(uid, gid) {

                                            let a = gid > 0 ? ms_muted_contacts.groups : ms_muted_contacts.contacts;
                                            let b = gid > 0 ? gid : uid;

                                            if (a.length > -1) {
                                                for (var j = 0; j < a.length; j++)
                                                    if (a[j]['id'] == b)
                                                        return true;

                                            }
                                            return false;
                                        },
                                        this.default_md_ic = function(uid, gid) {

                                            let a = gid > 0 ? ms_muted_contacts.groups : ms_muted_contacts.contacts;
                                            let b = gid > 0 ? gid : uid;

                                            if (a.length > -1) {
                                                for (var j = 0; j < a.length; j++)
                                                    if (a[j]['id'] == b)
                                                        return self.svgi.js.muted;

                                            }
                                            return self.svgi.js.unmuted;
                                        },
                                        this.mob__default_md_ic = function(uid, gid) {

                                            let a = gid > 0 ? ms_muted_contacts.groups : ms_muted_contacts.contacts;
                                            let b = gid > 0 ? gid : uid;

                                            if (a.length > -1) {
                                                for (var j = 0; j < a.length; j++)
                                                    if (a[j]['id'] == b)
                                                        return self.svgi.js.mobile.muted;

                                            }
                                            return self.svgi.js.mobile.unmuted;
                                        },
                                        this.sendMuteDataToMongo = function(data) {

                                            self.socket.emit('insert_mute', JSON.stringify(data));

                                        },
                                        this.muteContact = function(userid, groupid) {

                                            return modernPopup(function(confirm_btn, cnt) {

                                                var shortcut_id = self.shortcut_id ? tonum(self.shortcut_id) : 0;

                                                cnt.html('<div class="div-loader"></div>');

                                                let cmd = {
                                                    'cmd': 'mute-byuser',
                                                    'id': escape(userid)
                                                };

                                                if (groupid > 0)
                                                    cmd['group'] = escape(groupid);

                                                var send = jAjax(self.ajax_url, 'post', cmd);
                                                send.done(function(data) {

                                                    data = validateJson(data);

                                                    if (data.status = 200) {

                                                        let n_mute_btn = "";
                                                        let n_markup = {};

                                                        n_markup['half_hour'] = '<a href="javascript:void(0);" class="vy_ms__notifli"><label for="vy_ms__mutefor30"><input id="vy_ms__mutefor30" name="messengerMuteOptions" value="30" type="radio" ' + (data.interval == '30' || data.interval == '0' ? 'checked' : '') + ' /><span>' + lang.Messenger_mute_for_30 + '</span></label></a>';
                                                        n_markup['1_hour'] = '<a href="javascript:void(0);" class="vy_ms__notifli"><label for="vy_ms__mutefor1hour"><input id="vy_ms__mutefor1hour" name="messengerMuteOptions" value="1" type="radio" ' + (data.interval == '1' ? 'checked' : '') + ' /><span>' + lang.Messenger_mute_for_1hour + '</span></label></a>';
                                                        n_markup['12_hours'] = '<a href="javascript:void(0);" class="vy_ms__notifli"><label for="vy_ms__mutefor12hours"><input id="vy_ms__mutefor12hours" name="messengerMuteOptions" value="12" type="radio" ' + (data.interval == '12' ? 'checked' : '') + ' /><span>' + lang.Messenger_mute_for_12hours + '</span></label></a>';
                                                        n_markup['24_hours'] = '<a href="javascript:void(0);" class="vy_ms__notifli"><label for="vy_ms__mutefor24hours"><input id="vy_ms__mutefor24hours" name="messengerMuteOptions" value="24" type="radio" ' + (data.interval == '24' ? 'checked' : '') + ' /><span>' + lang.Messenger_mute_for_24hours + '</span></label></a>';
                                                        n_markup['forever'] = '<a href="javascript:void(0);" class="vy_ms__notifli"><label for="vy_ms__mutefor_forever"><input id="vy_ms__mutefor_forever" name="messengerMuteOptions" value="99" type="radio" ' + (data.interval == '99' ? 'checked' : '') + ' /><span>' + lang.Messenger_mute_for_forever + '</span></label></a>';

                                                        if (data.interval > 0)
                                                            n_markup['unmute'] = '<a href="javascript:void(0);" class="vy_ms__notifli"><label for="vy_ms__unmute"><input id="vy_ms__unmute" name="messengerMuteOptions" value="0" type="radio" ' + (data.interval == '0' ? 'checked' : '') + ' /><span>' + lang.Messenger_unmute + '</span></label></a>';

                                                        for (var x in n_markup)
                                                            n_mute_btn += n_markup[x];

                                                        cnt.html('<div class="_fc554222i"><input type="hidden" value="' + userid + '" id="vy_ms__mcontactid" /><div class="vy_ms__muteContact_header">' + lang.Messenger_mute + '</div><div id="vy_ms__mnotification_err" style="color:red;" class="__none"></div><div class="vy_ms__muteContact_cnt">' + n_mute_btn + '</div></div>');
                                                    } else {

                                                        cnt.html(data.msg);
                                                        confirm_btn.remove();
                                                    }


                                                });




                                                confirm_btn.on('click', function(e) {

                                                    evstop(e, 1);
                                                    let container = __j(this).closest('#sc_modern_popup_cnt');
                                                    let err = container.find('#vy_ms__mnotification_err');
                                                    let value = container.find('input[type="radio"]:checked').val();
                                                    let recipient_id = container.find('#vy_ms__mcontactid').val();
                                                    let avv_values = ['30', '1', '12', '24', '99', '0'];


                                                    err.addClass('__none').empty();
                                                    if (!avv_values.includes(value))
                                                        return err.removeClass('__none').text('Incorrect value. Please select only from below options.');


                                                    let cmd = {
                                                        'cmd': 'mute-contact',
                                                        'recipient': escape(recipient_id),
                                                        'interval': escape(value)
                                                    };
                                                    if (groupid > 0){
                                                        cmd['group'] = escape(groupid);
                                                        self.muted_contacts[groupid] = 1;
                                                    } else {
                                                        self.muted_contacts[recipient_id] = 1;
                                                    }

                                                    ajaxLoading();

                                                    let send = jAjax(self.ajax_url, 'post', cmd);
                                                    send.done(function(data) {
                                                        removeAjaxLoad();
                                                        data = validateJson(data);

                                                        let cont = groupid > 0 ? '#messenger_GG' + groupid : '#messenger_' + recipient_id;
                                                        let svg_ic = __j(cont).find('#vy_ms__mute_icon');
                                                        let left_contact = groupid ? '#contact-GG' + groupid : '#contact-' + recipient_id;
                                                        let muteButton = __j('#vymsn_material_ic_notif');
                                                        if (data.status == 200) {

                                                            if (value > 0) {


                                                               // svg_ic.replaceWith(self.svgi.js['muted']);
                                                                muteButton.html('notification_important');
                                                                __j(left_contact).addClass('__muted');


                                                            } else {
                                                                delete self.muted_contacts[recipient_id];
                                                                delete self.muted_contacts[groupid];
                                                               // svg_ic.replaceWith(self.svgi.js['unmuted']);
                                                                muteButton.html('notification');
                                                                __j(left_contact).removeClass('__muted');
                                                            }
                                                            ms_muted_contacts = data.new_arr;
                                                            self.closeModernPopup();
 
                                                            self.sendMuteDataToMongo({
                                                                'user_id': socketId(),
                                                                'user_clean_id': _U.i,
                                                                'recipient_clean_id': recipient_id,
                                                                'recipient_id': socketId(recipient_id),
                                                                'group_id': groupid ? socketId('GG' + groupid) : 0,
                                                                'group_clean_id': groupid,
                                                                'value': value,
                                                                'cron': data.cron || null,
                                                                'timezone': self.getTimezone()
                                                            });
                                                        } else {

                                                            __j('#vy_ms__mnotification_err').removeClass('__none').text(data.msg);
                                                        }

                                                    });

                                                });


                                            });

                                        },
                                        this.getLocalTimezone = function() {
                                            return Intl.DateTimeFormat().resolvedOptions().timeZone;
                                        },
                                        this.getTimezone = function() {
                                            return vy_ms_timezone;
                                        },
                                        this.helpphpcron = function(data) {
                                            let cmd = {
                                                'cmd': 'cron',
                                                'action': 'unmute',
                                                'recipient': data.recipient_clean_id,
                                                'id': data.user_clean_id,
                                                'group': data.group_clean_id,
                                                'page': 0
                                            };
                                            let send = jAjax(self.ajax_url, 'post', cmd);
                                            send.done(function(d) {
                                                self.ajax_crontab_unmute(data.recipient_clean_id, data.group_clean_id, 0);
                                            });
                                        },
                                        this.ajax_crontab_unmute = function(recipient_id, groupid, page_id) {

                                            let cmd = {
                                                'cmd': 'ajax_getMyMutedContacts'
                                            };
                                            let send = jAjax(self.ajax_url, 'post', cmd);
                                            send.done(function(new_arr) {
                                                let left_contact = groupid > 0 ? '#contact-GG' + groupid : '#contact-' + recipient_id;
                                                let cont = groupid > 0 ? '#messenger_GG' + groupid : '#messenger_' + recipient_id;
                                                let svg_ic = __j(cont).find('#vy_ms__mute_icon');


                                                svg_ic.replaceWith(self.svgi.js['unmuted']);
                                                __j(left_contact).removeClass('__muted');
                                                ms_muted_contacts = validateJson(new_arr);




                                            });


                                        },
                                        this.closeModernPopup = function() {
                                            __j('#sc_modern_popup').remove();
                                        },
                                        this.setNicknames = function(uid, uname, group_id) {

                                            return modernPopup(function(confirm_btn, cnt) {

                                                var shortcut_id = self.shortcut_id ? tonum(self.shortcut_id) : 0;
                                                var old_nickname = "";
                                                var nicknames_markup = (group_id > 0 ? '' : '<li><div class="mess_nickname_input"><div class="mess_nickname_td ellip">' + decodeURIComponent(uname) + '&nbsp;<a href="javascript:void(0);" onclick="__j(this).parent().parent().find(\'input\').val(\'\');">' + lang.remove + '</a></div><div class="mess_nickname_inp"><input class="dark" type="text" id="messenger_recipient_nickname" placeholder="' + lang.messenger_nickname_placeholder + '" value="%nickname_recipient" /></div></div></li>') +
                                                    '<li><div class="mess_nickname_input"><div class="mess_nickname_td ellip">' + _U.fn + '&nbsp;<a href="javascript:void(0);" onclick="__j(this).parent().parent().find(\'input\').val(\'\');">' + lang.remove + '</a></div><div class="mess_nickname_inp"><input class="dark" type="text" id="messenger_my_nickname" placeholder="' + lang.messenger_nickname_placeholder + '" value="%my_nickname" /></div></div></li>';

                                                cnt.html('<div class="div-loader"></div>');

                                                let cmd = {
                                                    'cmd': 'get-nicknames',
                                                    'userid': escape(uid)
                                                };

                                                if (group_id > 0)
                                                    cmd['group'] = escape(group_id);

                                                var send = jAjax(self.ajax_url, 'post', cmd);
                                                send.done(function(data) {


                                                    var d = validateJson(data);

                                                    if (d.count > 0) {


                                                        var my_nickname = d.my;
                                                        old_nickname = d.my;
                                                        if (group_id <= 0 || !group_id)
                                                            var recipient_nickname = d.recipient;



                                                        nicknames_markup = group_id > 0 ? nicknames_markup.replace(/%my_nickname/g, decodeURIComponent(my_nickname)) : nicknames_markup.replace(/%nickname_recipient/g, decodeURIComponent(recipient_nickname)).replace(/%my_nickname/g, decodeURIComponent(my_nickname));


                                                    } else {

                                                        nicknames_markup = group_id > 0 ? nicknames_markup.replace(/%my_nickname/g, '') : nicknames_markup.replace(/%nickname_recipient/g, '').replace(/%my_nickname/g, '');

                                                    }

                                                    var m_nicknames_markup = '<div class="pmessenger_nicknames"><header class="colors-popup-h">' + lang.messenger_edit_nicknames + '</header>\
                                                \
                                                <div class="messenger_nicknames_cnt"><div id="vy_ms__nickname_err" class="error"></div><ul>' + nicknames_markup + '</ul>\
                                                \
                                                </div>\
                                                \
                                                </div>';



                                                    cnt.html(m_nicknames_markup);
                                                });




                                                confirm_btn.on('click', function(e) {

                                                    evstop(e, 1);
                                                    let recipient_nickname = $.trim(__j('#messenger_recipient_nickname').val());
                                                    let my_nickname = $.trim(__j('#messenger_my_nickname').val());
                                                    __j('#vy_ms__nickname_err').html('<div class="div-loader"></div>');
                                                    if (group_id > 0) return self.setNicknameInGroup(my_nickname, group_id, old_nickname);

                                                    var send = jAjax(self.ajax_url, 'post', {
                                                        'cmd': 'setnickname',
                                                        'userid': escape(uid),
                                                        'nickname_recipient': recipient_nickname,
                                                        'my_nickname': my_nickname
                                                    });

                                                    send.done(function(data) {


                                                        var local_room_id = generateRoomId(uid, _U.i);

                                                        if (data == 1) {

                                                            if ($.trim(__j('#messenger_recipient_nickname').val()) || $.trim(__j('#messenger_my_nickname').val())) {
                                                                var send_new_nickname = $.trim(__j('#messenger_my_nickname').val()) ? __j('#messenger_my_nickname').val() : '';

                                                                self.writeNotification('nickname_added*' + _U.fn + '*' + send_new_nickname + '*' + recipient_nickname + '*' + my_nickname, 'nicknames', shortcut_id, local_room_id);
                                                            } else {


                                                                self.writeNotification('nickname_cleared*' + _U.fn + '*', 'nicknames', shortcut_id, local_room_id);

                                                            }


                                                            if ($.trim(__j('#messenger_recipient_nickname').val()) != '') {

                                                                // messenger
                                                                __j('#messenger_' + uid).find('.xweeWrt').text(__j('#messenger_recipient_nickname').val());
                                                                // shortcut
                                                                __j('#mshortcut-' + uid).find('.mshortcut-u-name-str>a').text(__j('#messenger_recipient_nickname').val());
                                                            } else {

                                                                //__j('.xweeWrt').text(decodeURIComponent(uname));
                                                                // messenger
                                                                __j('#messenger_' + uid).find('.xweeWrt').text(decodeURIComponent(uname));
                                                                // shortcut
                                                                __j('#mshortcut-' + uid).find('.mshortcut-u-name-str>a').text(decodeURIComponent(uname));
                                                            }


                                                            //kn_liveNotif(lang.messenger_nickname_updated,'done',2000,'');
                                                            self.closeModernPopup();

                                                        } else {

                                                            return __j('#vy_ms__nickname_err').text(lang.Messenger_error + ' ' + data);



                                                        }

                                                    });



                                                });


                                            });


                                        },
                                        this.sWriteNotification = function(w, categ, shortcut_id) {

                                            shortcut_id = shortcut_id ? (shortcut_id.includes('mshortcut-') ? shortcut_id : 'mshortcut-' + shortcut_id) : false;

                                            var append_to = self.shortcut ? self.shortcut : self.pmessenger;
                                            append_to = append_to.find('.vy_ms__groupusermsgs:last');

                                            switch (categ) {



                                                case 'nicknames':
                                                    w = w.split('*');

                                                    var w_1 = w[0];
                                                    var w_2 = w[1];
                                                    var nickname_new = w[2];


                                                    switch (w_1) {

                                                        case 'nickname_added':

                                                            append_to.after(self.notif__markup.replace('%text', w_2 + '&nbsp;' + lang.messenger_notif_changed_nickname));

                                                            break;

                                                        case 'nickname_cleared':

                                                            append_to.after(self.notif__markup.replace('%text', w_2 + '&nbsp;' + lang.messenger_notif_removed_nickname));

                                                            break;


                                                    }
                                                    break;

                                                case 'colors':

                                                    w = w.split('*');
                                                    var w_1 = w[0];
                                                    var w_2 = w[1];
                                                    var n_theme = w[2].split('|');
                                                    var group_id = w[3];
                                                    let theme_bg = vy_msn_path + '/' + window.vymsn_themes_path + '/' + n_theme[1] + '/bg.jpg';
                                                    let css_theme = window.vymsn_themes.indexOf(n_theme[1]) >= 0 ? 'background-image:url('+theme_bg+');background-repeat: no-repeat;background-position: center;background-size: cover;' : '';//self.mess_colors.hasOwnProperty(n_color) && self.mess_colors[n_color]['img'] ? 'background-color:' + n_color + ';background-image:' + self.mess_colors[n_color]['img'] + ';background-attachment:fixed;' : 'background-color:' + n_color + ';';
                                                        
                                                    append_to.after(self.notif__markup.replace('%text', '<span class="vy_ms__notificaton_colorupdated" style="' + css_theme + '"></span> ' + w_2 + '&nbsp;' + lang.messenger_notif_changed_theme));
 

                                                    if (__j('#' + shortcut_id).length) {

                                                        self.applyTheme(n_theme[1], shortcut_id);
                                                        self.colorateStrokes(n_theme[0], shortcut_id);
                                                    } else {
                                                        self.applyTheme(n_theme[1], shortcut_id);
                                                        self.colorateStrokes(n_theme[0], shortcut_id);
                                                    }

                                                    self.curr_theme = n_theme[1];
                                                    self.curr_color = n_theme[0];
                                                    break;

                                            }




                                            if (shortcut_id) {
                                                messenger_shortcut.instant_focusChatTab(shortcut_id);
                                                setTimeout(function() {
                                                    messenger_shortcut.scrollChat(shortcut_id);
                                                }, 100);

                                            } else self.scrollChat();

                                        },
                                        this.writeNotification = function(w, categ, shortcut_id, room_id, uid, page_id, group_id) {

                                            if (group_id > 0) {

                                                jAjax(self.ajax_url, 'post', {
                                                    'cmd': 'get-group-details',
                                                    'group': escape(group_id)
                                                }).done(function(group_details) {

                                                    // send in group
                                                    self.socket.emit('groups_color_notif', JSON.stringify({
                                                        'Notif': w,
                                                        'Room': room_id,
                                                        'Recipient': _U.i,
                                                        'Userid': group_id,
                                                        'Group_id': socketId('GG' + group_id),
                                                        'Group_data': validateJson(group_details),
                                                        'Group_clean_id': group_id,
                                                        'Page_id': page_id,
                                                        'User': _U,
                                                        'Category': categ
                                                    }));

                                                });
                                            } else
                                                // send to recipient
                                                self.socket.emit('messenger_notification', JSON.stringify({
                                                    'Notif': w,
                                                    'Room': room_id,
                                                    'Recipient': _U.i,
                                                    'Userid': socketId(self.curr_recipient),
                                                    'Group_id': group_id,
                                                    'Page_id': page_id,
                                                    'Data': {
                                                        'user': _U,
                                                        'msg': {
                                                            'text': ''
                                                        },
                                                        'notif': {
                                                            'categ': w.split('*')[0],
                                                            'nickname1': w.split('*')[w.split('*').length - 2],
                                                            'nickname2': w.split('*')[w.split('*').length - 1]
                                                        }
                                                    },
                                                    'Category': categ
                                                }));

                                            // write for me
                                            if (group_id <= 0) self.sWriteNotification(w, categ, shortcut_id);

                                        },
                                        this.change_theme = function(uid, group_id) {

                                            return modernPopup(function(confirm_btn, cnt) {


                                                var theme = '<li><div class="mess_color %active" onclick="messenger.setTheme(this,' + uid + ',' + group_id + ');" data-theme="%m_theme" style="background-image:url(%theme_image);background-repeat: no-repeat;background-position: center;background-size: cover;"><i class="sp_color-sel" alt=""></i></div></li>';
 
                                                if (self.shortcut)
                                                    theme = '<li><div class="mess_color %active" onclick="mess_shortcut(\'' + self.shortcut_id + '\').setTheme(this,' + uid + ',' + group_id + ');" data-theme="%m_theme" style="background-image:url(%theme_image);background-repeat: no-repeat;background-position: center;background-size: cover;"><i class="sp_color-sel" alt=""></i></div></li>';


                                                var themes = '';
                                                cnt.html('<div class="div-loader"></div>');
                                                let cmd = {
                                                    'cmd': 'getChatCurColor',
                                                    'userid': escape(uid)
                                                };

                                                if (group_id > 0)
                                                    cmd['group'] = escape(group_id);

                                                var send = jAjax(self.ajax_url, 'post', cmd);
                                                send.done(function(data) { 



                                                    data = validateJson(data);
                         
                                                    for(var i =0; i< window.vymsn_themes.length; i++)
                                                        themes += theme.replace(/%m_theme/g, window.vymsn_themes[i]).replace(/%theme_image/g, `${vy_msn_path}/${window.vymsn_themes_path}/${window.vymsn_themes[i]}/bg.jpg`).replace('%active', (data.theme == window.vymsn_themes[i] ? 'active' : ''));

                                                    var m_colors_markup = '<div class="pmessenger_colors"><header class="colors-popup-h">' + lang.Messenger_pick_a_theme_for_the_conv + '</header>\
                        \
                        <div class="messenger_colors_cnt"><ul>' + themes + '</ul>\
                        \
                        </div>\
                        \
                        </div>';

                                                    cnt.html(m_colors_markup);
                                                    if (self.hasTouchStartEvent)
                                                        cnt.find('ul').animate({
                                                            scrollLeft: parseInt(cnt.find(".mess_color.active").offset().left) - 20
                                                        }, 900);

                                                    self.pmessenger.find('#mess-curr-color').val(data.color);
                                                    self.pmessenger.find('#mess-curr-theme').val(data.theme);
                                                });




                                                confirm_btn.on('click touchend', function(e) {
                                                    self.closeModernPopup();

                                                });


                                            }, 1);


                                        },

                                        this.smrc = function(){
 
 
                                            let gg = '';

                                            if(self.shortcut_id && self.shortcut_id.includes('GG'))
                                                gg == "GG";

                                            return self.shortcut || self.shortcut_id ? __j(`#mshortcut-${gg}${tonum(self.shortcut_id)}`).find('#vymsn_smart_replied_cnt') : this.pmessenger.find('#vymsn_smart_replied_cnt');
                                        },
                                        this.send_smart_reply = function(event,message){
                                            
                                            
                                            if(self.shortcut || self.shortcut_id){
                                            let gg = self.shortcut_id.includes('GG') ? "GG" : '',
                                                shortcut_cnteditable = __j(`#mshortcut-${gg}${tonum(self.shortcut_id)}`).find('[contenteditable="true"]').closest('.messenger-shortcut-footer').find('textarea').data("emojioneArea");
                                            shortcut_cnteditable.setText(message);
                                            mess_shortcut(`mshortcut-${gg}${tonum(self.shortcut_id)}`).send(shortcut_cnteditable,event);
                                            shortcut_cnteditable.setText('');
                                            }  else {
                                                self.text_val.data("emojioneArea").setText(message);
                                                messenger.send(self.contenteditable,event);
                                            }
                                        },
                                        this.appendNewMessages2 = function(message, user, bubble_count) {

                                            var no_messenger = !self.pmessenger.length;
                                            var count_messages_total = 0;


                                            var text = message.text.replace(/\\/g, ""),
                                                time = message.time,
                                                min_text = message.min_text.replace(/\\/g, ""),
                                                page_id = message.page_id,
                                                group_id = message.group_id,
                                                mid = message.msgid,
                                                read = message.rd,
                                                m_bg = message.bg,
                                                userId = user.id,
                                                online = user.online,
                                                avatar = user.avatar,
                                                timestamp = message.timestamp,
                                                php_curr_date = message.curr_date,
                                                user_fullname = user.fullname,
                                                count = page_id > 0 ? g_messenger_count[user.id + '_' + page_id] : (group_id > 0 ? g_messenger_count['GG' + group_id] : g_messenger_count[user.id]), //message.count,
                                                user_online = user.online_ago,
                                                forwarded = message.forwarded,
                                                reply = message.reply;
                                                
                                                 

                                            var found_entry = [];
                                            var smart_rpls = validateJson(smart_replies);
 

                                            found_entry = smart_rpls.find(i => {
                                                return i.input.indexOf(text) > -1;
                                            });
                                            found_entry = typeof found_entry == 'undefined' ? [] : found_entry.output.sort(function () {
                                                return .5 - Math.random();
                                            });



                                            var smart_replies_output = found_entry, smart_replies_html = '';

 

                                            if(smart_replies_output.length){
 
                                                for(var i=0; i < smart_replies_output.length; i++){
                                                    smart_replies_html += `<a onclick="messenger.send_smart_reply(event, '${smart_replies_output[i]}');" class="vymsn_smart_reply_btn" href="javascript:void(0);">${smart_replies_output[i]}</a>`;

                                                 }

                                                if(smart_replies_html != '')
                                                    this.smrc().html(smart_replies_html);

                                            }

                                            self.recipient_last_message_timestamp = timestamp;

 
                                            let cache_name = self.shortcut_id ? 'conversation:/messenger/mshortcut-'+ (page_id > 0 ? user.id + '_' + page_id : (group_id > 0 ? 'GG' + group_id : user.id)) : 'conversation:/messenger/' + (page_id > 0 ? user.id + '/' + page_id : (group_id > 0 ? 'g/' + group_id : user.id));
                                            // update cache
                                            if (_ms_Cache.exist(cache_name)) {
                                                var send = jAjax(self.ajax_url, 'post', {
                                                    'cmd': 'get-cache-message',
                                                    'id': escape(user.id),
                                                    'group': escape(group_id),
                                                    'page': escape(page_id)
                                                }).done(function(data) {
                                                    data = validateJson(data);
                                                    self.updateConversationCache(data, cache_name);

                                                });
                                            }


                                            // check if messenger is open
                                            if (self.pmessenger.length) {



                                                // group chat 

                                                if (__j('#messenger_with_user').val() == '0' && group_id == __j('#messenger_with_group').val()) {

                                                    self.pmessenger.find('.typing').remove();
                                                    self.scrollNow = true;

                                                    var j_last_msg = __j('.pmessenger-message-txt:last');


                                                    if (j_last_msg.hasClass('_me'))
                                                        this.avatar = true;
                                                    else
                                                        this.avatar = false;
                                                    global_messenger_count = bubble_count;

                                                    self.apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, this.avatar, 1, count, timestamp, php_curr_date, 0, group_id, forwarded, reply);
                                                    self.appendMessageInContacts(min_text, userId, timestamp, time, '', 1, false, 0, group_id);

                                                    count_messages_total = count_messages_total + count;

                                                    if (vy_ms__window_tab_active) {
                                                        self.count_minus = 1;
                                                        bubble_count -= 1;
                                                    }

                                                } else

                                                    // current open room
                                                    if (__j('#messenger_with_user').val() == userId && page_id <= 0 && __j('#messenger_with_page').val() == 'none' && group_id <= 0) {

                                                        self.pmessenger.find('.typing').remove();
                                                        self.scrollNow = true;

                                                        var j_last_msg = __j('.pmessenger-message-txt:last');


                                                        if (j_last_msg.hasClass('_me'))
                                                            this.avatar = true;
                                                        else
                                                            this.avatar = false;
                                                        global_messenger_count = bubble_count;
                                                        self.apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, this.avatar, 1, count, timestamp, php_curr_date,0 ,0, forwarded, reply);
                                                        self.appendMessageInContacts(min_text, userId, timestamp, time, '', 1, false);


                                                        count_messages_total = count_messages_total + count;

                                                        if (vy_ms__window_tab_active) {
                                                            self.count_minus = 1;
                                                            bubble_count -= 1;
                                                        }

                                                    } else
                                                        // page contact is open
                                                        if (__j('#messenger_with_user').val() == userId && page_id == __j('#messenger_with_page').val() && group_id <= 0) {

                                                            self.pmessenger.find('.typing').remove();
                                                            self.scrollNow = true;

                                                            var j_last_msg = __j('.pmessenger-message-txt:last');


                                                            if (j_last_msg.hasClass('_me'))
                                                                this.avatar = true;
                                                            else
                                                                this.avatar = false;
                                                            global_messenger_count = bubble_count;
                                                            self.apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, this.avatar, 1, count, timestamp, php_curr_date, page_id, 0, forwarded, reply);
                                                            self.appendMessageInContacts(min_text, userId, timestamp, time, '', 1, false, page_id);


                                                            count_messages_total = count_messages_total + count;

                                                            if (vy_ms__window_tab_active) {
                                                                self.count_minus = 1;
                                                                bubble_count -= 1;
                                                            }

                                                            // if contact exist in left side
                                                        } else if (__j('#contact-' + userId).length && page_id <= 0 && group_id <= 0) {

                                                    self.appendMessageInContacts(min_text, userId, timestamp, time, '', false, count);

                                                    count_messages_total = count_messages_total + count;
                                                } else if (page_id > 0 && __j('#contact-' + userId + '_' + page_id).length && (group_id <= 0 || !group_id)) {

                                                    self.appendMessageInContacts(min_text, userId, timestamp, time, '', false, count, page_id);
                                                    count_messages_total = count_messages_total + count;

                                                } else if (group_id > 0 && __j('#contact-GG' + group_id).length && (!page_id || page_id <= 0)) {

                                                    self.appendMessageInContacts(min_text, userId, timestamp, time, '', false, count, 0, group_id);
                                                    count_messages_total = count_messages_total + count;

                                                } else {

                                                    if (page_id > 0 && group_id <= 0)
                                                        messenger.prependContact('', window.event, avatar, user_fullname, userId, user_online, min_text, count, true, false, page_id);
                                                    else if (group_id > 0 && (!page_id || page_id <= 0))
                                                        messenger.prependContact('', window.event, avatar, user_fullname, userId, user_online, min_text, count, true, false, false, group_id);
                                                    else
                                                        messenger.prependContact('', window.event, avatar, user_fullname, userId, user_online, min_text, count, true);

                                                    count_messages_total = count_messages_total + count;

                                                }



                                            }


                                            // check if user is in friend list on right sidebar, app count 
                                            /*  
                                                
                                                DISABLED FOR WOWONDER, ITS A FEATURE FOR KONTACKT
                                                ==================================================

                                                if (__j('.nav_tool_friends_online #friend_' + userId).length && !messenger_shortcut.isfocus('mshortcut-' + userId)) {

                                                 var u = __j('.nav_tool_friends_online #friend_' + userId);

                                                 if (!u.find('#online-friend-new-msg-count').length)
                                                  u.find('.online_u_cnt').prepend('<div class="online-friend-new-msg-count" id="online-friend-new-msg-count"><span>+' + count + '</span></div>');
                                                 else
                                                  u.find('#online-friend-new-msg-count>span').text('+' + count);

                                                 if (count <= 0)
                                                  u.find('#online-friend-new-msg-count').remove();
                                                }
                                            */

                                            // check if shortcut is created
                                            if (__j('#mshortcut-' + userId).length && page_id <= 0 && group_id <= 0) {
                                                var shortcut_id = 'mshortcut-' + userId;
                                                var shortcut = __j('#' + shortcut_id);


                                                __j('#mshortcut-' + userId).find('.typing').remove();
                                                //self.scrollNow=true;

                                                var j_last_msg = shortcut.find('.pmessenger-message-txt:last');
                                                var last_msg_id = j_last_msg.length ? tonum(j_last_msg.attr('id')) : 0;


                                                global_messenger_count = bubble_count;

                                                // check if shortcut is focused
                                                if (shortcut.hasClass('_focus') && vy_ms__window_tab_active) {

                                                    bubble_count -= 1;


                                                }


                                                // check if shortcut is closed, just open it
                                                if (shortcut.hasClass('__none') && no_messenger && !shortcut.hasClass('__nofit')) {

                                                    messenger_shortcut.just_show('mshortcut-' + userId);

                                                }




                                                if (last_msg_id == mid) return bubble_count;

                                                if (j_last_msg.hasClass('_me'))
                                                    this.avatar = true;
                                                else
                                                    this.avatar = false;


                                                var _this = this;
                                                 
                                                mess_shortcut(shortcut_id).apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, _this.avatar, 1, count, timestamp, php_curr_date,0,0,forwarded,reply);
                                             
                                     

                                                if (__j('#mshortcut-' + userId).hasClass('__nofit')) {

                                                    var nonfit_id = __j('#nonfit-' + userId);

                                                    nonfit_id.find('.js_new_msg_count').html(count);
                                                    messenger_shortcut.nonfitcount_new_msg[userId] = count;
                                                    self.nonFitCount();
                                                }

                                            } else if (__j('#mshortcut-' + userId + '_' + page_id).length && page_id > 0) {

                                                var shortcut_id = 'mshortcut-' + userId + '_' + page_id;
                                                var shortcut = __j('#' + shortcut_id);


                                                shortcut.find('.typing').remove();
                                                //self.scrollNow=true;

                                                var j_last_msg = shortcut.find('.pmessenger-message-txt:last');
                                                var last_msg_id = j_last_msg.length ? tonum(j_last_msg.attr('id')) : 0;


                                                global_messenger_count = bubble_count;

                                                // check if shortcut is focused
                                                if (shortcut.hasClass('_focus') && vy_ms__window_tab_active) {

                                                    bubble_count -= 1;


                                                }


                                                // check if shortcut is closed, just open it
                                                if (shortcut.hasClass('__none') && no_messenger && !shortcut.hasClass('__nofit')) {

                                                    messenger_shortcut.just_show(shortcut_id);

                                                }




                                                if (last_msg_id == mid) return bubble_count;

                                                if (j_last_msg.hasClass('_me'))
                                                    this.avatar = true;
                                                else
                                                    this.avatar = false;


                                                var _this = this;
                                                //setTimeout(function(){
                                                mess_shortcut(shortcut_id).apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, _this.avatar, 1, count, timestamp, php_curr_date, page_id,0, forwarded,reply);
                                                //},1);

                                                if (__j('#mshortcut-' + userId + '_' + page_id).hasClass('__nofit')) {

                                                    var nonfit_id = __j('#nonfit-' + userId + '_' + page_id);

                                                    nonfit_id.find('.js_new_msg_count').html(count);
                                                    messenger_shortcut.nonfitcount_new_msg[userId + '_' + page_id] = count;

                                                    self.nonFitCount();
                                                }


                                            } else if (__j('#mshortcut-GG' + group_id).length && group_id > 0) {

                                                var shortcut_id = 'mshortcut-GG' + group_id;
                                                var shortcut = __j('#' + shortcut_id);


                                                shortcut.find('.typing').remove();
                                                //self.scrollNow=true;

                                                var j_last_msg = shortcut.find('.pmessenger-message-txt:last');
                                                var last_msg_id = j_last_msg.length ? tonum(j_last_msg.attr('id')) : 0;


                                                global_messenger_count = bubble_count;

                                                // check if shortcut is focused
                                                if (shortcut.hasClass('_focus') && vy_ms__window_tab_active) {

                                                    bubble_count -= 1;


                                                }


                                                // check if shortcut is closed, just open it
                                                if (shortcut.hasClass('__none') && no_messenger && !shortcut.hasClass('__nofit')) {

                                                    messenger_shortcut.just_show(shortcut_id);

                                                }




                                                if (last_msg_id == mid) return bubble_count;

                                                if (j_last_msg.hasClass('_me'))
                                                    this.avatar = true;
                                                else
                                                    this.avatar = false;


                                                var _this = this;
                                                //setTimeout(function(){
                                                mess_shortcut(shortcut_id).apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, _this.avatar, 1, count, timestamp, php_curr_date, 0, group_id, forwarded, reply);
                                                //},1);

                                                if (__j('#mshortcut-GG' + group_id).hasClass('__nofit')) {

                                                    var nonfit_id = __j('#nonfit-GG' + group_id);

                                                    nonfit_id.find('.js_new_msg_count').html(count);
                                                    messenger_shortcut.nonfitcount_new_msg['GG' + group_id] = count;

                                                    self.nonFitCount();
                                                }


                                            } else
                                                // shortcut is not created yet, create it
                                                if (no_messenger) {

                                                    var d = {};
                                                    d['id'] = userId;
                                                    d['fullname'] = user_fullname;
                                                    d['photo'] = avatar;

                                                    if (page_id)
                                                        d['page_id'] = page_id;

                                                    if (group_id) {
                                                        d['group'] = group_id;

                                                        let send = jAjax(self.ajax_url, 'post', {
                                                            'cmd': 'get-group-details',
                                                            'group': escape(group_id)
                                                        });
                                                        send.done(function(data) {
                                                            data = validateJson(data);
                                                            d['fullname'] = data.group_name;
                                                            d['id'] = group_id;
                                                            d['photo'] = data.group_avatar;
                                                            messenger_shortcut.open(false, false, d, 1);
                                                        });

                                                    } else if (page_id > 0) {

                                                        let send = jAjax(self.ajax_url, 'post', {
                                                            'cmd': 'get-page-details',
                                                            'page': escape(page_id)
                                                        });
                                                        send.done(function(data) {
                                                            data = validateJson(data);

                                                            d['fullname'] = data[1] == _U.i ? user_fullname + ' (' + data[0] + ')' : data[0];
                                                            d['photo'] = data[1] == _U.i ? avatar : data[2];
                                                            d['page_avatar'] = data[2];
                                                            messenger_shortcut.open(false, false, d, 1);
                                                        });


                                                    } else {
                                                        messenger_shortcut.open(false, false, d, 1);
                                                    }



                                                }


                                            self.unmute_wo_timeout = setTimeout(function() {
                                                self.unmute_wo();
                                            }, 100000);



                                            global_messenger_count = bubble_count;

                                            return bubble_count;



                                        },




                                        this.appendNewMessages = function(messages, user, bubble_count) {
                                            clearTimeout(self.unmute_wo_timeout);
                                            self.mute_wo();
                                            var no_messenger = !self.pmessenger.length;
                                            var count_messages_total = 0;
                                            for (var i = 0; i < messages.length; i++) {


                                                var message = messages[i].message;
                                                var user = messages[i].user;


                                                var text = message.text.replace(/\\/g, ""),
                                                    time = message.time,
                                                    min_text = message.min_text.replace(/\\/g, ""),
                                                    page_id = message.page_id,
                                                    mid = message.msgid,
                                                    read = message.rd,
                                                    m_bg = message.bg,
                                                    userId = user.id,
                                                    online = user.online,
                                                    avatar = user.avatar,
                                                    timestamp = message.timestamp,
                                                    php_curr_date = message.curr_date,
                                                    user_fullname = user.fullname,
                                                    count = message.count,
                                                    user_online = user.online_ago;



                                                self.recipient_last_message_timestamp = timestamp;
                                                // check if messenger is open
                                                if (self.pmessenger.length) {

                                                    // current open room
                                                    if (__j('#messenger_with_user').val() == userId && page_id <= 0 && __j('#messenger_with_page').val() == 'none') {

                                                        self.pmessenger.find('.typing').remove();
                                                        self.scrollNow = true;

                                                        var j_last_msg = __j('.pmessenger-message-txt:last');


                                                        if (j_last_msg.hasClass('_me'))
                                                            this.avatar = true;
                                                        else
                                                            this.avatar = false;
                                                        global_messenger_count = bubble_count;
                                                        self.apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, this.avatar, 1, count, timestamp, php_curr_date);
                                                        self.appendMessageInContacts(min_text, userId, timestamp, time, '', 1, false);


                                                        count_messages_total = count_messages_total + count;

                                                        if (vy_ms__window_tab_active) {
                                                            self.count_minus = 1;
                                                            bubble_count -= 1;
                                                        }

                                                    } else
                                                        // page contact is open
                                                        if (__j('#messenger_with_user').val() == userId && page_id == __j('#messenger_with_page').val()) {

                                                            self.pmessenger.find('.typing').remove();
                                                            self.scrollNow = true;

                                                            var j_last_msg = __j('.pmessenger-message-txt:last');


                                                            if (j_last_msg.hasClass('_me'))
                                                                this.avatar = true;
                                                            else
                                                                this.avatar = false;
                                                            global_messenger_count = bubble_count;
                                                            self.apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, this.avatar, 1, count, timestamp, php_curr_date, page_id);
                                                            self.appendMessageInContacts(min_text, userId, timestamp, time, '', 1, false, page_id);


                                                            count_messages_total = count_messages_total + count;

                                                            if (vy_ms__window_tab_active) {
                                                                self.count_minus = 1;
                                                                bubble_count -= 1;
                                                            }

                                                            // if contact exist in left side
                                                        } else if (__j('#contact-' + userId).length && page_id <= 0) {

                                                        self.appendMessageInContacts(min_text, userId, timestamp, time, '', false, count);
                                                        //return last_msgs_count;
                                                        count_messages_total = count_messages_total + count;
                                                    } else if (page_id > 0 && __j('#contact-' + userId + '_' + page_id).length) {

                                                        self.appendMessageInContacts(min_text, userId, timestamp, time, '', false, count, page_id);
                                                        count_messages_total = count_messages_total + count;
                                                    } else {

                                                        if (page_id > 0)
                                                            messenger.prependContact('', window.event, avatar, user_fullname, userId, user_online, min_text, count, true, false, page_id);
                                                        else if (group_id > 0)
                                                            messenger.prependContact('', window.event, avatar, user_fullname, userId, user_online, min_text, count, true, false, 0, group_id);
                                                        else
                                                            messenger.prependContact('', window.event, avatar, user_fullname, userId, user_online, min_text, count, true);

                                                        count_messages_total = count_messages_total + count;

                                                    }


                                                    //count_messages_total = count_messages_total + count;

                                                    //__j('#messenger_mob_new_count').show().html(count_messages_total);

                                                }


                                                // check if user is in friend list on right sidebar, app count 
                                                if (__j('.nav_tool_friends_online #friend_' + userId).length && !messenger_shortcut.isfocus('mshortcut-' + userId)) {

                                                    var u = __j('.nav_tool_friends_online #friend_' + userId);

                                                    if (!u.find('#online-friend-new-msg-count').length)
                                                        u.find('.online_u_cnt').prepend('<div class="online-friend-new-msg-count" id="online-friend-new-msg-count"><span>+' + count + '</span></div>');
                                                    else
                                                        u.find('#online-friend-new-msg-count>span').text('+' + count);

                                                    if (count <= 0)
                                                        u.find('#online-friend-new-msg-count').remove();
                                                }


                                                // check if shortcut is created
                                                if (__j('#mshortcut-' + userId).length && page_id <= 0) {
                                                    var shortcut_id = 'mshortcut-' + userId;
                                                    var shortcut = __j('#' + shortcut_id);


                                                    __j('#mshortcut-' + userId).find('.typing').remove();
                                                    //self.scrollNow=true;

                                                    var j_last_msg = shortcut.find('.pmessenger-message-txt:last');
                                                    var last_msg_id = j_last_msg.length ? tonum(j_last_msg.attr('id')) : 0;


                                                    global_messenger_count = bubble_count;

                                                    // check if shortcut is focused
                                                    if (shortcut.hasClass('_focus') && vy_ms__window_tab_active) {

                                                        bubble_count -= 1;


                                                    }


                                                    // check if shortcut is closed, just open it
                                                    if (shortcut.hasClass('__none') && no_messenger && !shortcut.hasClass('__nofit')) {

                                                        messenger_shortcut.just_show('mshortcut-' + userId);

                                                    }




                                                    if (last_msg_id == mid) return bubble_count;

                                                    if (j_last_msg.hasClass('_me'))
                                                        this.avatar = true;
                                                    else
                                                        this.avatar = false;


                                                    var _this = this;
                                                    //setTimeout(function(){
                                                    mess_shortcut(shortcut_id).apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, _this.avatar, 1, count, timestamp, php_curr_date);
                                                    //},1);


                                                    /*
                                    if(unread_messages_by_user && unread_messages_by_user.hasOwnProperty(userId) ){
            
                                        if(unread_messages_by_user[userId] > 0) {
                                            bubble_count -= 1;
                                        }
                                        
                                    }
                                    */

                                                    if (__j('#mshortcut-' + userId).hasClass('__nofit')) {

                                                        var nonfit_id = __j('#nonfit-' + userId);

                                                        nonfit_id.find('.js_new_msg_count').html(count);
                                                        messenger_shortcut.nonfitcount_new_msg[userId] = count;
                                                        self.nonFitCount();
                                                    }

                                                } else if (__j('#mshortcut-' + userId + '_' + page_id).length && page_id > 0) {

                                                    var shortcut_id = 'mshortcut-' + userId + '_' + page_id;
                                                    var shortcut = __j('#' + shortcut_id);


                                                    shortcut.find('.typing').remove();
                                                    //self.scrollNow=true;

                                                    var j_last_msg = shortcut.find('.pmessenger-message-txt:last');
                                                    var last_msg_id = j_last_msg.length ? tonum(j_last_msg.attr('id')) : 0;


                                                    global_messenger_count = bubble_count;

                                                    // check if shortcut is focused
                                                    if (shortcut.hasClass('_focus') && vy_ms__window_tab_active) {

                                                        bubble_count -= 1;


                                                    }


                                                    // check if shortcut is closed, just open it
                                                    if (shortcut.hasClass('__none') && no_messenger && !shortcut.hasClass('__nofit')) {

                                                        messenger_shortcut.just_show(shortcut_id);

                                                    }




                                                    if (last_msg_id == mid) return bubble_count;

                                                    if (j_last_msg.hasClass('_me'))
                                                        this.avatar = true;
                                                    else
                                                        this.avatar = false;


                                                    var _this = this;
                                                    //setTimeout(function(){
                                                    mess_shortcut(shortcut_id).apMessage(mid, userId, userId, avatar, user.fullname, time, text, online, m_bg, _this.avatar, 1, count, timestamp, php_curr_date, page_id);
                                                    //},1);

                                                    if (__j('#mshortcut-' + userId + '_' + page_id).hasClass('__nofit')) {

                                                        var nonfit_id = __j('#nonfit-' + userId + '_' + page_id);

                                                        nonfit_id.find('.js_new_msg_count').html(count);
                                                        messenger_shortcut.nonfitcount_new_msg[userId + '_' + page_id] = count;

                                                        self.nonFitCount();
                                                    }


                                                } else
                                                    // shortcut is not created yet, create it
                                                    if (no_messenger) {

                                                        var d = {};
                                                        d['id'] = userId;
                                                        d['fullname'] = user_fullname;
                                                        d['photo'] = avatar;

                                                        if (page_id)
                                                            d['page_id'] = page_id;

                                                        messenger_shortcut.open(false, false, d, 1);




                                                    }

                                            }
                                            self.unmute_wo_timeout = setTimeout(function() {
                                                self.unmute_wo();
                                            }, 100000);



                                            global_messenger_count = bubble_count;

                                            return bubble_count;



                                        },
                                        this.nonFitCount = function() {
                                            var count = 0,
                                                count_str = 0;
                                            __j('.js_messenger_nonfit_count_calc').each(function() {

                                                var t = __j(this);
                                                var t_id = t.attr('id');
                                                var t_count = t.find('.js_new_msg_count').text() ? parseInt(t.find('.js_new_msg_count').text()) : 0;

                                                if (t_count > 0)
                                                    count++;

                                                messenger_shortcut.nonfitcount_new_msg[t_id] = t_count;

                                            });

                                            if (count > 99)
                                                count_str = '99+';
                                            else
                                                count_str = count;

                                            var total_count_parent = __j('.js_messenger-shortcuts-nonfit-count'),
                                                total_count_child = total_count_parent.find('span');
                                            if (count > 0) {
                                                total_count_parent.removeClass('__none');
                                                total_count_child.html(count_str);

                                            } else {
                                                total_count_parent.addClass('__none');
                                                total_count_child.html('0');

                                            }
                                        },
                                        this.join_rooms = function() {


                                            self.socket_rooms.push(self.room_id);

                                            if (self.socket_messages == 'null') {


                                                self.socket_messages = 1;
                                            }




                                        },
                                        this.updateTopBubble = function(user_count) {

                                            var c = gwtlog.getCounts();
                                            var $count = Object.keys(user_count).length;


                                        },
                                        this.close_search = function() {


                                            __j('#messenger-search-result').hide().find('.nano-content').empty();
                                            __j('#messages-tick').show();
                                            nanoScrollStart();
                                            self.scrollChat();

                                            return __j('#messenger_search_enabled').remove();
                                        },
                                        this.search = function(uid, page_id, group_id) {


                                            if (!__j('#messenger_search_enabled').length) {

                                                __j('#pmessenger-contact-header').append(
                                                    '<div id="messenger_search_enabled" class="mess_search_header">\
            <div class="messenger-search-arr" onclick="messenger.close_search();"><i class="mess-header-ic close"></i></div>\
            <div class="mess_search_header_input _5iwm">\
            <label class="_58ak"><input onkeypress="clearTimeout(this.messenger_search_timeout);" onkeydown="clearTimeout(this.messenger_search_timeout);" onkeyup="var _this = this;clearTimeout(_this.messenger_search_timeout);if(event.keyCode == 27) {return messenger.close_search();} _this.messenger_search_timeout = setTimeout(function(){ clearTimeout(_this.messenger_search_timeout);messenger.searchInConversation(_this,event,' + page_id + ',' + group_id + ');  },500);" placeholder="' + lang.messenger_search_in_conversation + '" type="text" id="messenger-search-input" /></label>\
            </div>\
            <div class="messenger-search-status"></div>\
            <div class="messenger-search-arrows">\
            <div class="messenger-search-arr" onclick="messenger.searchInConv(this,\'up\')"><i class="mess-header-ic up"></i></div>\
            <div class="messenger-search-arr" onclick="messenger.searchInConv(this,\'down\')"><i class="mess-header-ic down"></i></div>\
            </div>\
            </div>'
                                                );

                                                __j(document).off('keyup.closeMessengerSearch').on('keyup.closeMessengerSearch', 'body', function(e) {

                                                    if (e.keyCode == 27) self.close_search();

                                                });



                                            } else {

                                                self.close_search();
                                            }



                                        },
                                        this.searchInConv = function(el, direction) {




                                            var un_highlight = function() {

                                                __j('.messenger_conv_marks').each(function() {

                                                    var txt = __j(this).html();

                                                    __j(this).replaceWith(txt);

                                                });

                                            }



                                            function highlight_words(word, element) {
                                                if (word) {
                                                    var textNodes;
                                                    word = word.replace(/\W/g, '');
                                                    var str = word.split(" ");
                                                    $(str).each(function() {
                                                        var term = this;
                                                        var textNodes = $(element).contents().filter(function() {
                                                            return this.nodeType === 3
                                                        });
                                                        textNodes.each(function() {
                                                            var content = $(this).text();
                                                            var regex = new RegExp(term, "gi");
                                                            content = content.replace(regex, '<span class="highlight">' + term + '</span>');
                                                            $(this).replaceWith(content);
                                                        });
                                                    });
                                                }
                                            }




                                            var highlight = function(msg_id) {


                                                un_highlight();

                                                //highlight_words(__j('#messenger-search-input').val(),__j('#msg_'+msg_id));
                                                var key = __j('#messenger-search-input').val();
                                                var opar = __j('#msg_' + msg_id).find('.txt_pmessenger-text'),
                                                    opar_val = opar.text();


                                                opar = opar[0];

                                                var paragraph = opar;
                                                var search = key;
                                                search = search.replace('[.*+?^${}()|[\]\\]', '\\$&');


                                                var m;

                                                if (search.length > 0)
                                                    paragraph.innerHTML = opar_val.replace(search, '<mark class="messenger_conv_marks">$&</mark>');
                                                else paragraph.innerHTML = opar_val;


                                            }

                                            var scrollNanoToMsg = function() {
                                                __j('#mess-header-zero-res').text(Math.ceil(self.search_in_conv_curr_id + 1));
                                                __j("#messenger-search-result .nano").nanoScroller({
                                                    scrollTop: __j('#msg_' + self._search_conv_messages[self.search_in_conv_curr_id]).position().top - 50
                                                });
                                            }
                                            switch (direction) {



                                                case 'up':

                                                    if (!$.trim(__j('#messenger-search-input').val())) return false;

                                                    self.search_in_conv_curr_id = typeof self._search_conv_messages[self.search_in_conv_curr_id] == "undefined" ? self._search_conv_messages.length - 1 : self.search_in_conv_curr_id;

                                                    highlight(self._search_conv_messages[self.search_in_conv_curr_id]);

                                                    scrollNanoToMsg();

                                                    self.search_in_conv_curr_id--;



                                                    break;

                                                case 'down':

                                                    if (!$.trim(__j('#messenger-search-input').val())) return false;
                                                    self.search_in_conv_curr_id = typeof self._search_conv_messages[self.search_in_conv_curr_id] == "undefined" ? 0 : self.search_in_conv_curr_id;
                                                    highlight(self._search_conv_messages[self.search_in_conv_curr_id]);
                                                    scrollNanoToMsg();
                                                    self.search_in_conv_curr_id++;

                                                    break;




                                            }




                                        },
                                        this.searchInConversation = function(input, evt, page_id, group_id) {

                                            evt.preventDefault();

                                            var $input = __j(input);
                                            var key = $input.val();


                                            if ($.trim(key)) {
                                                __j('#messages-tick').hide();
                                                __j('#messenger-search-result').show().find('.vy_msn_search_cnt').html('<div class="div-loader"></div>');
                                                self.search_in_conv_curr_id = 0;
                                                var cmd = {
                                                    'cmd': 'search-in-conversation',
                                                    'userid': escape(self.curr_recipient),
                                                    'key': urlencode(key)
                                                };
                                                if (page_id > 0)
                                                    cmd['page'] = escape(page_id);
                                                if (group_id > 0)
                                                    cmd['group'] = escape(group_id);
                                                self.stop_xhr('searchinconv');
                                                var send = jAjax(self.ajax_url, 'post', cmd, false, 'searchinconv');
                                                __j('#pmessenger-contact-header').css('pointer-events', 'none');
                                                send.done(function(res) {


                                                    __j('#pmessenger-contact-header').css('pointer-events', 'auto');
                                                    var data = validateJson(res);

                                                    if (data.count == 0) {

                                                        __j('.messenger-search-status').html('0&nbsp;' + lang.messenger_search_conv_count_results);
                                                        __j('#messenger-search-result').show().find('.vy_msn_search_cnt').html('<div class="mess-search-conv-empty">' + lang.messenger_search_conv_empty.replace('%key', '<strong>' + key + '</strong>') + '</div>');
                                                    } else {
                                                        __j('.messenger-search-status').html('<span id="mess-header-zero-res">0</span>&nbsp;/&nbsp;' + data.count + '&nbsp;' + lang.messenger_search_conv_count_results);
                                                        var message_markup = '';
                                                        var author_last_msg = 0;
                                                        var avatar = true;
                                                        var last_date = 0;
                                                        self._search_conv_messages = new Array();
                                                        for (var i = 0; i < data.messages.length; i++) {
                                                            var _arr = data.messages[i];
                                                            if (author_last_msg != _arr.lastby)
                                                                avatar = true;
                                                            else
                                                                avatar = false;



                                                            var l_dat = __j('#messenger-search-result .messenger_date_delim:first').length ? __j('#messenger-search-result .messenger_date_delim:first').text() : '';
                                                            var hj = l_dat == _arr.dateMonth ? true : false;

                                                            var $show_date = (author_last_msg == _arr.lastby && author_last_msg > 0) && (_arr.date == last_date && last_date > 0) ? false : true;

                                                            $show_date = _arr.date !== last_date && !hj && $show_date ? true : false;
                                                            let show_conv_date = $show_date ? '<div id="messenger_date_delim_' + _arr.dateMonth + '" class="messenger_date_delim"><span>' + _arr.dateMonth + '</span></div>' : '';
                                                            let show_username = (_arr.from_id != author_last_msg && group_id > 0) ? _arr.user_fullname : '';
                                                            let next_msg_from_id = typeof data.messages[i + 1] != 'undefined' ? data.messages[i + 1].from_id : 0;
                                                            let curr_avatar = (_arr.from_id == _U.i ? '' : '<div class="sticky__txt_pmessenger-user-avatar"><img src="' + _arr.user_avatar + '" /></div>');
                                                            let margin_for_groups = _arr.from_id != author_last_msg && next_msg_from_id != _U.i && author_last_msg != _U.i ? 'vy_ms__group_msg_margin' : '';

                                                            message_markup += show_conv_date + (_arr.from_id != author_last_msg ? '<div data-group-id="' + _arr.from_id + '" class="vy_ms__groupusermsgs ' + margin_for_groups + ' ' + (_arr.from_id == _U.i ? 'me' : '') + '">' + curr_avatar : '') + self.getMessagesMarkup(_arr, (_arr.from_id == _U.i ? 'me' : ''), avatar, $show_date, _arr.timestamp, show_username, _arr.forwarded) + (next_msg_from_id != _arr.from_id || next_msg_from_id == 0 ? '</div>' : '');
                                                            self._search_conv_messages.push(_arr.id);

                                                            author_last_msg = _arr.lastby;
                                                            last_date = _arr.date;

                                                        }

                                                        __j('#messenger-search-result').show().find('.vy_msn_search_cnt').html('<div id="messenger-nano-content-fullheight">' + message_markup + '</div>');
                                                        self.colorateStrokes(self.current_color());
                                                        nanoScrollStart();


                                                    }

                                                });


                                            }

                                        },
                                        this.removeBlacklist = function() {
                                            var container = self.pmessenger;

                                            if (self.shortcut)
                                                container = self.shortcut;



                                            container.find('.blocked_u_no_pm').remove();

                                            container.removeClass('blacklist');
                                        },
                                        this.outFromGroup = function(str) {

                                            var container = self.pmessenger;

                                            if (self.shortcut)
                                                container = self.shortcut;

                                            if (container.find('.blocked_u_no_pm').length == 0) {

                                                if (self.shortcut)
                                                    container.find('.messenger-shortcut-footer').prepend('<div class="blocked_u_no_pm">' + str + '</div>');
                                                else
                                                    container.find('.pmessenger-msg-list-contenteditable').prepend('<div class="blocked_u_no_pm">' + str + '</div>');

                                            }
                                            setTimeout(function() {
                                                container.find('.blocked_u_no_pm').addClass('__up');
                                            }, 1000);
                                            container.find('#messenger_aria_options').empty();
                                            container.find('#messenger_aria_options_chat').empty();
                                            container.addClass('blacklist');
                                        },
                                        this.isInBlackList = function() {

                                            var container = self.pmessenger;

                                            if (self.shortcut)
                                                container = self.shortcut;

                                            if (container.find('.blocked_u_no_pm').length == 0) {

                                                if (self.shortcut)
                                                    container.find('.messenger-shortcut-footer').prepend('<div class="blocked_u_no_pm">' + jprintf(lang.pm_user_to_blacklist, '') + '</div>');
                                                else
                                                    container.find('.pmessenger-msg-list-contenteditable').prepend('<div class="blocked_u_no_pm">' + jprintf(lang.pm_user_to_blacklist, self.recipient_fullname) + '</div>');

                                            }
                                            setTimeout(function() {
                                                container.find('.blocked_u_no_pm').addClass('__up');
                                            }, 1000);
                                            container.find('#messenger_aria_options').empty();
                                            container.find('#messenger_aria_options_chat').empty();
                                            container.addClass('blacklist');
                                        },
                                        this.privacy_html = function(msg) {

                                            var container = self.pmessenger;

                                            if (self.shortcut)
                                                container = self.shortcut;

                                            if (container.find('.blocked_u_no_pm').length == 0) {

                                                if (self.shortcut)
                                                    container.find('.messenger-shortcut-footer').prepend('<div class="blocked_u_no_pm">' + msg + '</div>');
                                                else
                                                    container.find('.pmessenger-msg-list-contenteditable').prepend('<div class="blocked_u_no_pm">' + jprintf(msg, self.recipient_fullname) + '</div>');

                                            }
                                            setTimeout(function() {
                                                container.find('.blocked_u_no_pm').addClass('__up');
                                            }, 1000);
                                            container.find('#messenger_aria_options').empty();
                                            container.find('#messenger_aria_options_chat').empty();
                                            container.addClass('blacklist');

                                        },
                                        this.deleteScreenshot = function(evt) {

                                            evt.preventDefault();

                                            var el = __j(evt.target);


                                            el.closest('.screenshot').remove();


                                        },
                                        this.uploadScreenshot = function(screen_data, page_obj, group_id) {



                                            if (localStorage.getItem('uploading_screenshot') == 1)
                                                return;

                                            localStorage.setItem('uploading_screenshot', 1);

                                            setTimeout(function() {

                                                localStorage.removeItem('uploading_screenshot');

                                            }, 10000);

                                            var rand_id = Math.floor(Math.random() * 2);
                                            // append screenshot before uploading
                                            var $screen = __j('<div class="screenshot_uploading soh-s chat_media_img"><a href="javascript:void(0);" id="delete_attach_' + rand_id + '" onclick="messenger.deleteMedia(this,event);" class="foh-s messenger_delete_screen js_messenger_delete_screen"><span>Remove</span></a><div class="messenger_screenshot js_messenger_screenshot"></div></div>'); //__j('<obattch class="screenshot_uploading"><div class="attach-photo_del id-needle" data-attached="1" onclick="jb_delete_attach(event);" title="'+lang.Delete+'"><div class="ic10 ic10_i_close"></div></div><img class="attach-photo_img" border="0"></obattch>');
                                            var room_id = 0,
                                                page_id = 0;
                                            if (self.shortcut_id) {

                                                room_id = __j('#' + self.shortcut_id).find('#upload_room_id').val();

                                                if (Object.keys(page_obj).length) {
                                                    recipientId = page_obj.userid;
                                                    page_id = page_obj.page_id;
                                                }

                                            } else {
                                                __j('#WD_attach_files_PM').prepend($screen);
                                                room_id = 'room_' + self.room_id;

                                            }

                                            self.uploadingMedia = 1;
                                            self.send_important = 1;



                                            self.uploading_media_disable_func('enable', self.shortcut_id_num);
                                            var send = jAjax(self.ajax_url, 'post', {
                                                'cmd': 'uploadscreen',
                                                'room_id': room_id,
                                                'to': escape(recipientId),
                                                'data': urlencode(screen_data)
                                            });
                                            send.done(function(data) {


                                                var r = validateJson(data);

                                                self.uploadingMedia = 0;
                                                localStorage.removeItem('uploading_screenshot');


                                                if (r.success == 1) {
                                                    $screen.removeClass('screenshot_uploading');
                                                    $screen.find('.js_messenger_delete_screen').attr('id', r.id);
                                                    $screen.find('.js_messenger_screenshot').attr({
                                                        'd-src': r.id,
                                                        'style': 'background-image:url(/vy-messenger-cmd.php?cmd=atch&id=' + r.id + ')'
                                                    });

                                                    var media_msg = '[divstart][img]' + r.id + '[/img][divend]';

                                                    if (!self.shortcut_id) {
                                                        self.send(0, self.event, media_msg, self.shortcut_id);
                                                    } else {

                                                        if (page_id) {

                                                            const new_id = recipientId;
                                                            mess_shortcut(self.shortcut_id).send(0, self.event, media_msg, new_id, page_id);
                                                        } else if (group_id > 0) {
                                                            mess_shortcut(self.shortcut_id).send(0, self.event, media_msg, 0, 0, group_id);
                                                        } else {
                                                            mess_shortcut(self.shortcut_id).send(0, self.event, media_msg);
                                                        }
                                                    }
                                                } else {
                                                    $screen.find('.js_messenger_delete_screen').click();
                                                    return displayErr('Error at uploading your screenshot.');
                                                }



                                            });




                                        },
                                        this.deleteMedia = function(el, evt) {
                                            evstop(evt);
                                            el = __j(el);
                                            var id = el.attr('id');
                                            el.parent().remove();
                                            var send = jAjax(self.ajax_url, 'post', 'cmd=deletemedia&id=' + id);


                                        },
                                        this.load_more_contacts = function(btn) {
                                            btn = __j(btn);
                                            ++self.more_contacts_page;
                                            var l = __j('#messenger-contacts-last').find('.nano-content');
                                            var s_at = l.children().length;



                                            var send = jAjax(self.ajax_url, 'post', 'cmd=moreConversations&pagecount=' + escape(self.more_contacts_page) + '&s_at=' + (s_at) + '&token=' + (new Date()).getTime());

                                            send.done(function(html) {


                                                if (html != 0) {
                                                    l.find('.messenger-load-more-contacts-loader').before(html);
                                                    setTimeout(function() {
                                                        nanoScrollStart();
                                                        self.initTouchEvents();
                                                    }, 100);
                                                } else {
                                                    self.loaded_all_contacts = 1;
                                                    btn.parent().remove();
                                                }
                                            });

                                        },
                                        this.check_for_pages = function(id, is_shortcut) {
                                            var page_id = 0;
                                            var user_id = tonum(id);

                                            if (id.includes('_') && is_shortcut) {
                                                page_id = id.split('_')[1];
                                                user_id = tonum(id.split('_')[0]);

                                            } else if (!is_shortcut && typeof id.split('_')[2] != 'undefined') {

                                                page_id = id.split('_')[2];
                                                user_id = tonum(id.split('_')[1]);
                                            }

                                            return [user_id, page_id];
                                        },
                                        this.fetch_url = function(url, elem) {

                                            elem = __j(elem);

                                            var basic_container = self.shortcut_id ? __j('#' + self.shortcut_id) : self.pmessenger;
                                            var data_container = basic_container.find('#messenger-link-preview');
                                            var room_id = basic_container.find('#upload_room_id').val();
                                            var page_id = self.shortcut_id ? self.check_for_pages(self.shortcut_id, 1) : self.check_for_pages(self.pmessenger.attr('id'));
                                            var userid = page_id[0];

                                            page_id = page_id[1];



                                            var send = jAjax(self.ajax_url, 'post', {
                                                'cmd': 'fetchurl',
                                                'url': encodeURIComponent(url),
                                                'room_id': escape(room_id)
                                            }, false, 'fetch-url');
                                            send.done(function(data) {


                                                if (data != 0) {

                                                    const r = validateJson(data);


                                                    if (r.send_now == 'yes') {

                                                        self.force_bg = 1;
                                                        var media_msg = ':)';

                                                        if (r.embera == 'yes')
                                                            media_msg = '[embera]' + r.preview + ' [/embera]';

                                                        if (r.type == 'image' && r.embera == 'no')
                                                            media_msg = '[divstart][img]' + r.id + '[/img][divend] ' + url;

                                                        if (r.type == 'video' && r.embera == 'no')
                                                            media_msg = '[vdivstart][video]' + r.id + '[/video][vdivend] ' + url;

                                                        if (!self.shortcut_id) {
                                                            self.send(0, self.event, media_msg, self.shortcut_id);
                                                        } else {

                                                            if (page_id > 0)
                                                                mess_shortcut(self.shortcut_id).send(0, self.event, media_msg, userid, page_id);
                                                            else
                                                                mess_shortcut(self.shortcut_id).send(0, self.event, media_msg, userid);


                                                        }

                                                        elem.html('');
                                                    } else {

                                                        let html = {};
                                                        let html_content = '';
                                                        let html_image = '';
                                                        let random_id = self.random_id();
                                                        let delete_btn = '<svg onclick="messenger.remove_attach(this,event,' + random_id + ')" class="svgIcon curpointer" height="16px" width="16px" version="1.1" viewBox="0 0 16 16" x="0px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" y="0px"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g transform="translate(-712.000000, -1096.000000)"><g stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(709.000000, 320.000000)"><path d="M5.833,778.833 L16.167,789.167"></path><path d="M16.167,778.833 L5.833,789.167"></path></g></g></g></svg>';
                                                        if (r.hasOwnProperty('image')) {
                                                            html.image = '<img src="' + r.image + '" />';
                                                            html_image = html.image;
                                                        }


                                                        if (r.hasOwnProperty('title'))
                                                            html.title = '<div class="mess_fetch_title">' + r.title + '</div>';

                                                        if (r.hasOwnProperty('description'))
                                                            html.description = '<div class="mess_fetch_descr">' + r.description + '</div>';

                                                        if (r.hasOwnProperty('site_name'))
                                                            html.site_name = '<div class="mess_fetch_sitename"><a href="' + r.url + '" target="_blank">' + r.site_name + '</a></div>';




                                                        for (var i in html) html_content += i == 'image' ? '' : html[i];

                                                        data_container.html('<div id="mess_attach_' + random_id + '" class="messenger-live-preview-link-container">' + html_image + '<div class="mess_fetch_infotxt">' + html_content + '</div>' + delete_btn + '</div>');

                                                        data_container.children().addClass('slideup');

                                                        self.msg_with_preview = {
                                                            "id": random_id,
                                                            "msg": "[url-preview]" + url + "[/url-preview]"
                                                        };

                                                        if (self.shortcut_id) {
                                                            messenger_shortcut.msg_with_preview = self.msg_with_preview;
                                                            messenger_shortcut.msg_with_preview['shortcut_id'] = self.shortcut_id;


                                                        }

                                                    }


                                                }

                                            });

                                        },
                                        this.remove_attach = function(el, e, id) {

                                            self.msg_with_preview = !1;
                                           if (self.shortcut_id) messenger_shortcut.msg_with_preview = !1;
                                            __j('#mess_attach_' + id).removeClass('slideup').on(self.crossEvent(), function() {
                                                __j(this).remove()
                                            });
                                        },
                                        this.random_id = function() {
                                            return Date.now() + Math.floor(Math.random() * 99);
                                        },
                                        this.pasteMessages = function(el, ev, page_obj, group_id) {


                                            // use event.originalEvent.clipboard for newer chrome versions
                                            var items = (ev.clipboardData || ev.originalEvent.clipboardData).items;

                                            // find pasted image among pasted items
                                            var blob = null;
                                            for (var i = 0; i < items.length; i++) {
                                                if (items[i].type.indexOf("image") === 0) {
                                                    blob = items[i].getAsFile();
                                                }
                                            }
                                            // load image if there is a pasted image
                                            if (blob !== null) {
                                                evstop(ev, 1);
                                                var reader = new FileReader();
                                                reader.onload = function(e) {

                                                    var screen_data = e.target.result;

                                                    if (self.shortcut_id)
                                                        mess_shortcut(self.shortcut_id).uploadScreenshot(screen_data, page_obj, group_id);
                                                    else
                                                        self.uploadScreenshot(screen_data, page_obj, group_id);

                                                };
                                                reader.readAsDataURL(blob);
                                            }

                                            var isUrl = function(s) {
                                                return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(s);
                                            }
                                            var text = (ev.originalEvent || ev).clipboardData.getData('text/plain');

                                            if (isUrl(text))
                                                self.fetch_url(text, el);




                                        },
                                        this.toggle_sound = function() {

                                            if (self.pm_sound_enable()) {
                                                createCookie('dk_pm_sound', 'off');
                                                sound_o_f();
                                            } else {
                                                createCookie('dk_pm_sound', 'on');
                                                sound_o_f(1);
                                                setTimeout('turnOnSound();', 100);
                                            }
                                        },
                                        this.pm_sound_enable = function() {
                                            return 1; //readCookie('dk_pm_sound') === 'on' || !readCookie('dk_pm_sound') ? 1 : 0;
                                        },

                                        // sound
                                        this.turnOnSound = function() {
                                            var mess = true;

                                            if (self.pm_sound_enable()) {

                                                // play sound
                                               
                                                self.playSound('new_msg');
                                            }

                                        },
                                        this.send_msg_sound = function() {
                                            if (self.hasTouchStartEvent && (!readCookie('messenger_tsmsg_disb') || !(readCookie('messenger_tsmsg_disb') == 1))) {

                                               this.playSound('mob_send_msg');
                                            }

                                        },
                                        this.confirm_sound = function() {
                                            this.playSound('tap');


                                        },
                                        this.enableSendMessageSound = function() {
                                            createCookie('messenger_tsmsg_disb', '');

                                        },
                                        this.disableSendMessageSound = function() {
                                            createCookie('messenger_tsmsg_disb', 1, 100);
                                        },

                                        this.add_media = function(el, o, shortcut, page_id, group_id) {

                      
                                            var f = shortcut ? __j('#mshortcut-'+shortcut) : __j('.pmessenger');
                                            switch (o) {

                                                case 'video':
                                                    f.find('.js_messenger_add_video').click();
                                                    break;

                                                case 'device_files':
                                                    f.find('._type_photo_from_computer').click();
                                                    break;

                                                case 'images':
                                                    f.find('._type_photo').click();
                                                    break;

                                                case 'gif':
                                                    self.get_gifs(el, shortcut, group_id);
                                                    break;
                                            }

                                        }

    this.get_bottom_mess_buttons = function(size, i_shortcut, page_id, group_id) {
            page_id = page_id || false;
            group_id = group_id || 0;
            size = size || 20;
            size = self.hasTouchStartEvent ? 40 : size;
            var e_images_types = '.' + self.photoTypes.join(',.'),
                e_video_types = '.' + self.videoTypes.join(',.');

            let media_btns = '';
            let btns = {};
            let shortcut_record_audio = '';

            if (self.hasTouchStartEvent && !page_id)
                btns['more'] = (page_id ? '' : '<li id="vy_ms__btn_mob_mmedia" ontouchend="messenger.openMobileMoreMediaBtns(event,this);" class="_39bk">\
                        <span>' + self.svgi['js']['mobile']['media_more'].replace(/%s/g, size) + '</span>\
                        </li>');

            btns['location'] = '<li title="' + lang.messenger_share_location + '" onclick="evstop(event,1);messenger.removeDropdownmenu();messenger.sendLocation(this,event,' + i_shortcut + ',' + page_id + ', ' + group_id + ');" class="_39bk"><a href="javascript:void(0);">\
                    <svg fill="#666" rel="mess-colorate-this-fill" width="' + size + 'px" height="' + size + 'px" x="0px" y="0px" viewBox="-119 -21 682 682.66669">\
                    <g>\
                        <path d="m216.210938 0c-122.664063 0-222.460938 99.796875-222.460938 222.460938 0 154.175781 222.679688 417.539062 222.679688 417.539062s222.242187-270.945312 222.242187-417.539062c0-122.664063-99.792969-222.460938-222.460937-222.460938zm67.121093 287.597656c-18.507812 18.503906-42.8125 27.757813-67.121093 27.757813-24.304688 0-48.617188-9.253907-67.117188-27.757813-37.011719-37.007812-37.011719-97.226562 0-134.238281 17.921875-17.929687 41.761719-27.804687 67.117188-27.804687 25.355468 0 49.191406 9.878906 67.121093 27.804687 37.011719 37.011719 37.011719 97.230469 0 134.238281zm0 0"/>\
                    </g>\
                    </svg>\
                    <span class="_3dxr3_tit"><span class="material-symbols-outlined">my_location</span>' + lang.Messenger_mob_more_medi_btn_location + '</span></a></li>';

            btns['images'] = '<li title="' + lang.messenger_send_photos + '"    onclick="evstop(event,1);messenger.removeDropdownmenu();messenger.add_media(this,\'device_files\',' + i_shortcut + ',' + page_id + ', ' + group_id + ');" class="_39bk"><a href="javascript:void(0);">\
                    <svg width="' + size + 'px" height="' + size + 'px" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;">\
                    <g>\
                            <path fill="#666" rel="mess-colorate-this-fill" d="M50,40c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15    C65,46.718,58.283,40,50,40z M90,25H78c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,11.28,68.65,10,67,10H33    c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309C25.426,23.72,23.65,25,22,25H10C4.5,25,0,29.5,0,35v45c0,5.5,4.5,10,10,10h80    c5.5,0,10-4.5,10-10V35C100,29.5,95.5,25,90,25z M50,80c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25    c13.805,0,25,11.194,25,25C75,68.807,63.805,80,50,80z M86.5,41.993c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5    c1.934,0,3.5,1.568,3.5,3.5C90,40.427,88.433,41.993,86.5,41.993z"/>\
                        </g>\
                    </svg>\
                    <span class="_3dxr3_tit"><span class="material-symbols-outlined">photo</span>' + lang.Messenger_mob_more_medi_btn_img + '</span></a></li>';

            btns['videos'] = '<li title="' + lang.messenger_send_videos + '"    onclick="evstop(event,1);messenger.removeDropdownmenu();messenger.add_media(this,\'video\',' + i_shortcut + ',' + page_id + ',' + group_id + ');" class="_39bk"><a href="javascript:void(0);">\
                    <svg width="' + size + 'px" height="' + size + 'px" x="0px" y="0px" viewBox="0 -87 432 432" style="enable-background:new 0 0 100 100;">\
                    <g>\
                            <path fill="#666" rel="mess-colorate-this-fill" d="m278.90625 0h-248.90625c-16.5625.0195312-29.9804688 13.4375-30 30v197.421875c.0195312 16.5625 13.4375 29.980469 30 30h248.90625c16.558594-.019531 29.980469-13.4375 30-30v-197.421875c-.019531-16.5625-13.441406-29.9804688-30-30zm0 0"/>\
                            <path fill="#666" rel="mess-colorate-this-fill" d="m328.90625 169.800781 103.09375 56.285157v-194.105469l-103.09375 56.285156zm0 0"/>\
                        </g>\
                    </svg>\
                    <span class="_3dxr3_tit"><span class="material-symbols-outlined">play_circle</span>' + lang.Messenger_mob_more_medi_btn_videos + '</span></a></li>';

            if (!page_id)
                btns['gifs'] = (page_id ? '' : '<li title="' + lang.messenger_open_gifs + '" onclick="evstop(event,1);messenger.removeDropdownmenu();messenger.add_media(this,\'gif\',' + i_shortcut + ',' + page_id + ', ' + group_id + ');" class="_39bk"><a href="javascript:void(0);">\
                    <svg fill="#666" rel="mess-colorate-this-fill" width="' + size + 'px" height="' + size + 'px" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;">\
                    <g>\
                        <g>\
                            <g>\
                                <path d="M146.286,146.286H36.571C14.629,146.286,0,164.571,0,182.857v146.286c0,18.286,14.629,36.571,36.571,36.571h109.714     c21.943,0,36.571-18.286,36.571-36.571V256H128v54.857H54.857V201.143h128v-18.286     C182.857,164.571,168.229,146.286,146.286,146.286z"/>\
                                <polygon points="512,201.143 512,146.286 347.429,146.286 347.429,365.714 402.286,365.714 402.286,292.571 475.429,292.571      475.429,237.714 402.286,237.714 402.286,201.143    "/>\
                                <rect x="237.714" y="146.286" width="54.857" height="219.429"/>\
                            </g>\
                        </g>\
                    </g>\
                    </svg>\
                    <span class="_3dxr3_tit"><span class="material-symbols-outlined">gif_box</span>'+lang.messenger_open_gifs+'</span>\
                    </a></li>');

            if (!page_id)
                btns['stickers'] = (page_id ? '' : '<li title="' + lang.messenger_open_stickers + '" onclick="evstop(event,1);messenger.removeDropdownmenu();messenger.openStickers(this,event,false,' + i_shortcut + ',' + page_id + ', ' + group_id + ');" class="_39bk"><a href="javascript:void(0);">\
                    <svg width="' + size + 'px" height="' + size + 'px" x="0px" y="0px" viewBox="0 0 294.996 294.996" style="enable-background:new 0 0 294.996 294.996;">\
                    <g>\
                        <path fill="#666" rel="mess-colorate-this-fill" d="M280.977,118.478c-13.619-10.807-20.563-27.57-18.574-44.845c1.3-11.3-2.566-22.393-10.607-30.432  c-8.044-8.043-19.136-11.909-30.434-10.607c-17.281,1.986-34.037-4.954-44.844-18.573C169.449,5.11,158.872,0,147.499,0  c-11.374,0-21.951,5.11-29.021,14.02c-10.807,13.618-27.564,20.56-44.841,18.575c-11.3-1.305-22.393,2.563-30.435,10.605  c-8.043,8.04-11.909,19.133-10.609,30.435c1.989,17.272-4.954,34.035-18.576,44.844C5.11,125.549,0,136.126,0,147.498  s5.109,21.949,14.019,29.021c13.62,10.808,20.563,27.57,18.574,44.845c-1.3,11.3,2.566,22.393,10.607,30.432  c8.044,8.043,19.145,11.911,30.434,10.607c17.274-1.988,34.037,4.954,44.844,18.573c7.069,8.91,17.646,14.021,29.021,14.021  c11.373,0,21.95-5.11,29.02-14.02c10.808-13.618,27.565-20.559,44.841-18.575c11.301,1.299,22.393-2.563,30.435-10.605  c8.043-8.04,11.909-19.133,10.609-30.434c-1.989-17.273,4.955-34.037,18.576-44.845c8.907-7.07,14.017-17.647,14.017-29.02  S289.886,125.549,280.977,118.478z"/>\
                    </g>\
                    </svg>\
                    <span class="_3dxr3_tit"><span class="material-symbols-outlined">filter</span>Stickers</span>\
                    </a></li>');


            if (!page_id)
                btns['microphone'] = (page_id ? '' : '<li style="display:none;" title="' + lang.messenger_hold_to_record + '" rel-shortcut="' + (i_shortcut ? i_shortcut : "zero") + '" onclick="messenger.startRecordingEvents(event,this,' + (i_shortcut ? 1 : 0) + ', ' + group_id + ');" id="messenger-recording-button" class="_39bk">\
                    <span><svg fill="#666" rel="mess-colorate-this-fill" x="0px" y="0px" width="' + size + 'px" height="' + size + 'px" viewBox="0 0 96.667 96.666" style="enable-background:new 0 0 96.667 96.666;">\
                    <g>\
                            <path d="M48.333,73.296c9.519,0,17.263-7.744,17.263-17.262V17.262C65.596,7.743,57.852,0,48.333,0c-9.519,0-17.262,7.743-17.262,17.262v38.773C31.071,65.553,38.814,73.296,48.333,73.296z"/>\
                            <path d="M76.078,45.715h-3.437c-1.104,0-2,0.896-2,2v7.029c0,12.3-10.008,22.308-22.309,22.308S26.025,67.044,26.025,54.744v-7.029c0-1.104-0.896-2-2-2h-3.437c-1.104,0-2,0.896-2,2v7.029c0,14.707,11.433,27.667,26.026,29.506v4.98h-15.35c-1.104,0-2,0.896-2,2v3.436c0,1.104,0.896,2,2,2h38.138c1.104,0,2-0.896,2-2V91.23c0-1.104-0.896-2-2-2H52.051v-4.98c14.594-1.838,26.026-14.799,26.026-29.506v-7.029C78.078,46.61,77.182,45.715,76.078,45.715z"/>\
                        </g>\
                    </svg>\
                    <svg class="microphone-disabled-iconsvg __none">\
                        <line x1="0" y1="100%" x2="100%" y2="0"\
                            style="stroke:rgb(255,0,0);stroke-width:2"/>\
                    </svg></span>\
                    <span class="material-symbols-outlined">keyboard_voice</span>\
                    </li>');
 
            if (page_id) {
                self.mob_hidden_btns['location'] = btns['location'];
                self.mob_hidden_btns['images'] = btns['images'];
                self.mob_hidden_btns['videos'] = btns['videos'];
            }

            if(i_shortcut) {
                shortcut_record_audio = '<button type="button" class="button_voice_recorder secondary round" rel-shortcut="' + (i_shortcut ? i_shortcut : "zero") + '" onclick="messenger.startRecordingEvents(event,this,' + (i_shortcut ? 1 : 0) + ', ' + group_id + ');" id="messenger-recording-button" aria-label="Record voice message" title="Record voice message" style="">'+self.svgi.microphone_voice_recorder+'</button>';
                delete btns['microphone'];
            }


            if (page_id)
                for (var x in self.mob_hidden_btns)
                    delete btns[x];
 
                if(self.hasTouchStartEvent)
                    delete btns['more'];


            for (var x in btns)
                media_btns += btns[x];

            if(i_shortcut){

            i_shortcut = `mshortcut-${i_shortcut}`;

            if(group_id > 0)
                i_shortcut = `mshortcut-GG${group_id}`;
            }

            if(typeof user_id == 'undefined') var user_id = 0;


            if(i_shortcut)
                window.shortcut_media_btns[i_shortcut] = media_btns;
            else
                window.vymsn_media_btns = media_btns;

            let button_attachments = '<button onclick="'+( i_shortcut ? `mess_shortcut('${i_shortcut}').generatedropdownmenu('media','${user_id}','${group_id}','${page_id}','','${i_shortcut}')` : `messenger.generatedropdownmenu('media','${user_id}','${group_id}','${page_id}')` )+'" class="vy_ms_gattach">'+self.svgi.attachments+'</button>',
                appendix = '<div class="svg-appendix">'+self.svgi.appendix+'</div>';


            if(self.pmessenger.find('.vy_ms_gattach').length && !i_shortcut)
                button_attachments = '';


            if(self.pmessenger.find('.svg-appendix').length && !i_shortcut)
                appendix = '<div class="svg-appendix">'+self.svgi.appendix+'</div>';

            return shortcut_record_audio + button_attachments+'<div class="_4rv4 js__4rv4 vy_ms_attachments_btns"><div class="mdialog_send_message_loader _55yn _55yo _55ym"></div>\
                                        <input type="file" name="files" accept="' + e_images_types + '" onchange="messenger.start_upload(event,\'image\',' + (i_shortcut ? tonum(i_shortcut) : false) + ',' + page_id + ',' + group_id + ');" multiple="multiple" class="_type_photo_from_computer __none" />\
                                        <input class="js_messenger_add_video __none" type="file" multiple="multiple" name="file" accept="' + e_video_types + '" onchange="messenger.start_upload(event,\'video\',' + (i_shortcut ? tonum(i_shortcut) : false) + ',' + page_id + ', ' + group_id + ');"/>\
                                        <ul class="_39bj">' + media_btns + '</ul>\
                                        </div>'+appendix+'\
                                        </div>\
                                        ';

        },
        this.getMoreMobMediaBtns = function() {

            let mm_media_btns = '';
            let c = '';


            for (var x in self.mob_hidden_btns)
                mm_media_btns += self.mob_hidden_btns[x];

            c = '<section ontouchend="evstop(event);" onclick="evstop(event);" id="vy_ms__mobmm_btns" class="vy_ms__mobmm_btns"><ul>' + mm_media_btns + '</ul></section>';

            return c;

        },
        this.openMobileMoreMediaBtns = function(e, el) {
            evstop(e, 1);

            let $el = __j(el);
            let pm_footer = self.pmessenger.find('.js__pmessenger_footer');
            if (!$el.hasClass('_open')) {

                $el.addClass('_open');
                pm_footer.prepend(self.getMoreMobMediaBtns());
                self.colorateStrokes(self.current_color());
                setTimeout(function() {
                    pm_footer.find('#vy_ms__mobmm_btns').addClass('_up').on(self.crossEvent(), function() {
                        __j(this).css({
                            'zIndex': '5'
                        });
                    });
                }, 100);

                __j(document).off('touchend.closeMobMediaBtn').on('touchend.closeMobMediaBtn', function(e) {

                    self.closeMobileMoreMediaBtns();

                });

            } else {

                self.closeMobileMoreMediaBtns();
            }

        },
        this.closeMobileMoreMediaBtns = function() {

            let pm_footer = self.pmessenger.find('.js__pmessenger_footer');
            __j(document).off('touchend.closeMobMediaBtn');
            self.pmessenger.find('#vy_ms__btn_mob_mmedia').removeClass('_open');
            pm_footer.find('#vy_ms__mobmm_btns').removeAttr('style');
            setTimeout(function() {
                pm_footer.find('#vy_ms__mobmm_btns').removeClass('_up').on(self.crossEvent(), function() {
                    __j(this).remove();
                });
            }, 100);
        },
        this.open_mobile_settings = function(evt, el, group_id, page_id) {

            evstop(evt);

            el = __j(el);
            const userid = __j('#messenger_with_user').val();
            const user_name = __j('#messenger_recipient_name').val();
            var opts = '';

            if ((group_id > 0 && self.group_admin > 0) || !group_id)
                opts += '<li><a data-action="color" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['change_color'] + '</div>' + lang.Messenger_change_conv_theme + '</a></li>';

            opts += '<li><a data-action="nickname" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['change_nickname'] + '</div>' + lang.Messenger_Edit_nickname + '</a></li>';
            opts += '<li><a data-action="notification" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.mob__default_md_ic(userid, group_id) + '</div>' + lang.Messenger_Notifications + '</a></li>';
            opts += !readCookie('messenger_tsmsg_disb') || !(readCookie('messenger_tsmsg_disb') == 1) ? '<li><a data-action="send_msg_sound_disable" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['tap_sound_enabled'] + '</div>' + lang.Messenger_Disable_sending_sound + '</a></li>' : '<li><a data-action="send_msg_sound_enable" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['tap_sound_disabled'] + '</div>' + lang.Messenger_Enable_sending_sound + '</a></li>';

            if (!group_id && !page_id) {

                opts += '<li><div class="messenger_mob_option__delim"></div></li>';
                opts += '<li><a data-action="to_blacklist" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['block'] + '</div>' + lang.messenger_block_user + '</a></li>';
            }


            if (group_id > 0 && self.group_admin > 0) {

                opts += '<li><div class="messenger_mob_option__delim"></div></li>';
                opts += '<li><a data-action="group_manage_members" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['group_members'] + '</div>' + lang.Messenger_Group_Edit_Members + '</a></li>';
                opts += '<li><a data-action="group_clear" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['group_clear'] + '</div>' + lang.Messenger_Clear_Group_Conversation + '</a></li>';
                opts += '<li><a data-action="group_delete" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['group_delete'] + '</div>' + lang.Messenger_Group_Delete + '</a></li>';
                opts += '<li><a data-action="group_exit" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['exit_group'] + '</div>' + lang.Messenger_Leave_Group + '</a></li>';

            } else if (group_id > 0 && self.group_admin <= 0) {
                opts += '<li><a data-action="group_exit" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['exit_group'] + '</div>' + lang.Messenger_Leave_Group + '</a></li>';
            }
            if (!group_id)
                opts += '<li><a data-action="delete_conversation" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['delete_conversation'] + '</div>' + lang.delete_conversation + '</a></li>';

            if (!page_id)
                opts += '<li><a data-action="fullscreen" class="js_messenger_mob_opt messenger_mob_option"><div class="messenger_mob_svg">' + self.svgi['js']['mobile']['fullscreen'] + '</div>' + lang.Messenger_toggle_fullscreen + '</a></li>';



            const markup = '<div class="js_messenger_mobile_opts messenger_mobile_opts"><div class="js_messenger_ovr messenger_layer_ovr"></div><ul>' + opts + '</ul></div>';

            if (!__j('body').find('.js_messenger_mobile_opts').length) {
                __j('body').append(markup);

                const all_opts = __j('.js_messenger_mobile_opts');

                // opts click
                __j(document).off(self.hasTouchStartEvent ? 'touchend.mmob_settings_opt' : 'click.mmob_settings_opt').on(self.hasTouchStartEvent ? 'touchend.mmob_settings_opt' : 'click.mmob_settings_opt', '.js_messenger_mob_opt', function(e) {
                    const action = __j(this).data('action');
                    const _that = this;
                    messenger.close_mobile_settings(function() {

                        switch (action) {

                            case 'color':
                               // messenger.changeColor(self.curr_recipient, group_id);
                                messenger.change_theme(self.curr_recipient, group_id)
                                break;
                            case 'nickname':
                                messenger.setNicknames(userid, user_name, group_id);
                                break;
                            case 'to_blacklist':
                                messenger.contactToBlacklist(e, _that);
                                break;
                            case 'send_msg_sound_disable':
                                messenger.disableSendMessageSound();
                                break;
                            case 'send_msg_sound_enable':
                                messenger.enableSendMessageSound();
                                break;
                            case 'group_clear':
                                messenger.clearGroupMsgs(e, group_id);
                                break;
                            case 'group_delete':
                                messenger.DeleteGroup(e, group_id);
                                break;
                            case 'group_manage_members':
                                messenger.ManageGroupMembers(e, group_id);
                                break;
                            case 'group_exit':
                                messenger.exitGroup(e, group_id);
                                break;
                            case 'notification':
                                messenger.muteContact(userid, group_id);
                                break;
                            case 'delete_conversation':
                                messenger.deleteConversation(e, page_id);
                                break;
                            case 'fullscreen':
                                messenger.toFullScreen(e);
                                break;
                        }


                    });
                });

                // close menu
                __j(document).off(self.hasTouchStartEvent ? 'touchend.closeiosMenu' : 'click.closeiosMenu').on(self.hasTouchStartEvent ? 'touchend.closeiosMenu' : 'click.closeiosMenu', '.js_messenger_ovr', function(e) {
                    evstop(e);
                    self.close_mobile_settings();
                });

                setTimeout(function() {

                    all_opts.addClass('shownow');


                }, 250);

            }

        },
        this.close_mobile_settings = function(callback) {



            __j('.js_messenger_mobile_opts > ul').css('transform', 'translate3d(0px, 100%, 0) translateZ(0)').on(self.crossEvent(), function() {

                __j(this).parent().remove();

                setTimeout(callback, 500);

                __j('body').find('.js_messenger_ovr').fadeOut(function() {

                    __j(this).remove();

                });
            });


        },
        this.startRecordingEvents = function(evt, btn, shortcut, group_id) {
            //const event = window.event || $.Event();
            evstop(evt, 1);

            btn = __j(btn);



            var is_holding = false;

            //  self.startRecordingEvents(btn,shortcut);

            btn.removeAttr('onclick');


            // start recording
            btn.off(self.hasTouchStartEvent ? 'touchstart.recording' : 'mousedown.recording').on(self.hasTouchStartEvent ? 'touchstart.recording' : 'mousedown.recording', function() {
                var shortcut_id = __j(this).attr('rel-shortcut') != "zero" ? __j(this).attr('rel-shortcut') : false;
                self.audiorecorder_shortcut = group_id > 0 ? 'GG' + group_id : shortcut_id;
                self.audiorecorder_btn = __j(this);
                is_holding = true;
                if (self.recording_timeout) clearTimeout(self.recording_timeout);


                if (is_holding)
                    self.recording_timeout = setTimeout(function() {

                        self.startRecordingVoiceClip(btn, shortcut_id);
                        btn.addClass('recording');
                        if (self.pmessenger.length && self.hasTouchStartEvent)
                            __j('.recording_microphone_gif').removeClass('__none');

                    }, 100); // the above code is executed after 100 ms

            });

            // stop recording
            btn.off(self.hasTouchStartEvent ? 'touchend.recording' : 'mouseup.recording').on(self.hasTouchStartEvent ? 'touchend.recording' : 'mouseup.recording', function() {
                var shortcut_id = __j(this).attr('rel-shortcut') != "zero" ? __j(this).attr('rel-shortcut') : false;
                self.audiorecorder_shortcut = group_id > 0 ? 'GG' + group_id : shortcut_id;
                self.audiorecorder_btn = __j(this);
                if (self.recording_timeout) clearTimeout(self.recording_timeout);

                btn.removeClass('recording');
                if (self.pmessenger.length && self.hasTouchStartEvent)
                    __j('.recording_microphone_gif').addClass('__none');
                self.stopRecordingVoiceClip(btn, shortcut_id, group_id);
                is_holding = false;

            });


        },



        this.startRecordingVoiceClip = function(btn) {
            //self.voice_clip_chunks=[];
            //self.voice_clip_media_recorder.start();
            //start the recording process

            if (self.mediaRecorderConstructed) return;
            const constraints = {
                audio: true,
                video: false
            };


            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

                btn.removeClass('microphonenotallowed');
                btn.find('.microphone-disabled-iconsvg').addClass('__none');
                /*  assign to gumStream for later use  */

                self.messenger_local_stream = stream;
                self.mediaRecorderConstructed = true;



                const audioContext = new AudioContext();


                /* use the stream */
                const input = audioContext.createMediaStreamSource(self.messenger_local_stream);

                /* 
                    Create the Recorder object and configure to record mono sound (1 channel)
                    Recording 2 channels  will double the file size
                */
                self.voice_clip_media_recorder = new Recorder(input, {
                    numChannels: 1
                })
                self.voice_clip_media_recorder.record();
            }).catch(function(err) {

                self.messenger_local_stream = false;
                btn.addClass('microphonenotallowed').removeClass('recording');
                btn.find('.microphone-disabled-iconsvg').removeClass('__none');
                return modernPopup(function() {}, 1, '<div style="color:red;text-align: center; padding: 16px;font-weight: bold;">Error: ' + err.toString() + '</div><br/><div style="font-weight:bold;text-align:center;">' + lang.please_enable_your_microphone + '</div>');

            });
        },

        this.stopRecordingVoiceClip = function() {
            //self.voice_clip_media_recorder.stop();


            //tell the recorder to stop the recording
            if (self.voice_clip_media_recorder) self.voice_clip_media_recorder.stop();

            //stop microphone access
            if (self.messenger_local_stream) self.messenger_local_stream.getAudioTracks()[0].stop();


            //create the wav blob 
            if (typeof self.voice_clip_media_recorder != 'undefined') self.voice_clip_media_recorder.exportWAV(self.sendVoiceClip);

        },
        this.sendVoiceClip = function(blob) {

            if (!self.mediaRecorderConstructed) return;


            var shortcut_id = self.hasTouchStartEvent ? false : (self.audiorecorder_shortcut ? 'mshortcut-' + self.audiorecorder_shortcut : '');
            var room_id = self.audiorecorder_shortcut ? __j('#mshortcut-' + self.audiorecorder_shortcut).find('#upload_room_id').val() : 'room_' + __j('#mess-roomid').val();

            var f = new FormData();

            f.append('cmd', 'send-voice-clip');
            f.append('clip', blob);
            f.append('extension', self.voice_clip_extension);
            f.append('room_id', room_id);
            f.append('recipient_id', self.audiorecorder_shortcut);
            // ajaxLoading();
            $.ajax({
                type: 'POST',
                url: self.ajax_url,
                data: f,
                processData: false,
                contentType: false
            }).done(function(d) {

                //removeAjaxLoad();
                d = validateJson(d);
                let group_id = shortcut_id ? (shortcut_id.includes('GG') ? shortcut_id.split('GG')[1] : 0) : self.pmessenger.find('#messenger_with_group').val();


                if (d.success == 1) {

                    if (shortcut_id && group_id <= 0) mess_shortcut(shortcut_id).send(false, false, d.text);
                    else if (shortcut_id && group_id > 0) mess_shortcut(shortcut_id).send(false, false, d.text, false, false, group_id);
                    else self.send(false, self.event, d.text);




                } else {


                    return displayErr(lang.somethingWrong);

                }
            });

            //stop microphone access
            if (self.messenger_local_stream) self.messenger_local_stream.getAudioTracks()[0].stop();
            self.audiorecorder_shortcut = false;
            self.audiorecorder_btn = false;
            self.mediaRecorderConstructed = false;

        },
        this.getMobileOperatingSystem = function() {
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

        },
        this.SimulateWindowPopupForMobileDevices = function(url, uid, coll, s, url_string) {

            const container = __j('.pmessenger #audio-video-mob-conference');


            if (!container.find('#audiovideoconf-htmldom').length) {
                container.show().html('<div id="audiovideoconf-htmldom"><iframe id="iframe-audio-video-conference" style="width:100%;height:100%;" src="' + url_string + '&iframe=yes&v=' + (new Date().getTime()) + '"></iframe></div>');

                self.pmessenger.addClass('zindex1031');
                var frames = window.frames;
                for (var i = 0; i < frames.length; i++) {

                    frames[i].call = coll;
                }
            }
        },
        this.removeVideoAudioConferenceIframe = function() {
            self.pmessenger.removeClass('zindex1031');
            __j('#audio-video-mob-conference').hide().html('');
        },
        this.createCallingPopup = function(c, uid, call, s) {

            var url;
            var disconnect_peer = false;
            var url_obj = {
                'cmd': 'call',
                'userid': uid,
                'view_as': 'json',
                'v': (new Date().getTime())
            };
            switch (c) {


                case 'answer-video':
                    url = '/messenger?ismobile=no&view_as=json&cmd=call&action=answer&type=video&userid=' + uid + '&v=' + (new Date().getTime());
                    url_obj['action'] = 'answer';
                    url_obj['type'] = 'video';
                    break;

                case 'answer-audio':
                    url = '/messenger?ismobile=no&view_as=json&cmd=call&action=answer&type=audio&userid=' + uid + '&v=' + (new Date().getTime());
                    url_obj['action'] = 'answer';
                    url_obj['type'] = 'audio';
                    break;

                case 'initiate-video-call':
                    url = '/messenger?ismobile=no&view_as=json&cmd=call&action=call&type=video&userid=' + uid + '&v=' + (new Date().getTime());
                    url_obj['action'] = 'call';
                    url_obj['type'] = 'video';
                    break;


                case 'initiate-audio-call':
                    url = '/messenger?ismobile=no&view_as=json&cmd=call&action=call&type=audio&userid=' + uid + '&v=' + (new Date().getTime());
                    url_obj['action'] = 'call';
                    url_obj['type'] = 'audio';
                    break;



            }




            // initiate call
            //  var call = peer.call(self.curr_recipient, self.messenger_local_stream);
            //self.calling_video(call);




            var w_wd = 780;
            var w_wh = 590;
            // Fixes dual-screen position                         Most browsers      Firefox
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var w_width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var w_height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var w_left = ((w_width / 2) - (w_wd / 2)) + dualScreenLeft;
            var w_top = ((w_height / 2) - (w_wh / 2)) + dualScreenTop;

            // Puts focus on the self.newCallWindow
            if (window.focus && _U.i in newCallWindow) {

                newCallWindow[_U.i].focus();


            } else {


                if (self.hasTouchStartEvent) {

                    self.SimulateWindowPopupForMobileDevices(url_obj, uid, call, s, url);


                } else {

                    newCallWindow[_U.i] = window.open(
                        url,
                        'popUpWindow',
                        'height=' + w_wh + ',width=' + w_wd + ',left=' + w_left + ',top=' + w_top + ',resizable=yes,scrollbars=no,toolbar=no,menubar=yes,location=yes,directories=no, status=no'
                    );


                    //  if(disconnect_peer) _peer.disconnect();


                    if (call)
                        newCallWindow[_U.i].call = call;
                    newCallWindow[_U.i].call_user_answered = call_user_answered;
                    newCallWindow[_U.i].sio = sio;
                    newCallWindow[_U.i].existingCall = existingCall;
                    //newCallWindow[_U.i].abc = 'PRIMA';
                    //self.newCallWindow[_U.i].socket = sio;
                    //self.newCallWindow[_U.i].call_timeout = call_timeout;
                    //self.newCallWindow[_U.i].existingCall = existingCall;


                    remainOnSite('You have a calling window', 'CallWindow' + _U.i, function() {
                        for (x in newCallWindow) newCallWindow[x].close();
                    });
                }
            }

            if (!self.hasTouchStartEvent) {
                var call_w_interval = window.setInterval(function() {
                    try {
                        if (newCallWindow[_U.i] == null || newCallWindow[_U.i].closed) {
                            window.clearInterval(call_w_interval);
                            delete newCallWindow[_U.i];
                            unbindRemainOnSite('CallWindow' + _U.i);
                            if (existingCall) {
                                existingCall.close();
                            }

                            if (call_user_answered)
                                s.emit("call_finished", uid);
                            else
                                s.emit("call_stopped", uid);


                            existingCall = false;
                            //if(disconnect_peer) _peer.reconnect();
                            //if(call_timeout)clearTimeout(call_timeout);
                        }
                    } catch (err) {

                        return modernPopup(function() {}, 1, err.toString());
                    }
                }, 1000);

            }




        },
        this.setUpVoiceVideoCallButtons = function(el, evt, type) {

            // setupt handlers

            // CALLING VIDEO
            __j(document).off(self.hasTouchStartEvent ? 'touchend.call_video' : 'click.call_video').on(self.hasTouchStartEvent ? 'touchend.call_video' : 'click.call_video', '#start-video-chat', function(e) {

                e.preventDefault();
                e.stopImmediatePropagation();
 
                vy_msn_calls.makeCall(false, 'video', self.curr_recipient);

            });
            // CALLING AUDIO
            __j(document).off(self.hasTouchStartEvent ? 'touchend.call_audio' : 'click.call_audio').on(self.hasTouchStartEvent ? 'touchend.call_audio' : 'click.call_audio', '#start-audio-chat', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                vy_msn_calls.makeCall(false, 'audio', self.curr_recipient);

            });



            if (type == 'audio' && self.hasTouchStartEvent)
                vy_calls.start_call(false, 'audio', self.curr_recipient);
            else if (type == 'video' && self.hasTouchStartEvent)
                vy_calls.start_call(false, 'video', self.curr_recipient);


        },

        this.hangUpCall = function(el, ev) {
            evstop(ev);
            self.existingCall.close();
        },
        this.calling_video = function(v_call) {



            // Hang up on an existing call if present
            if (self.existingCall) {
                self.existingCall.close();
            }
            // Wait for stream on the call, then set peer video display
            v_call.on('stream', function(stream) {
                $('#their-video').prop('src', URL.createObjectURL(stream));
            });
            // UI stuff
            self.existingCall = v_call;

            v_call.on('close', step2);
            $('#step1, #step2').hide();
            $('#step3').show();




        },
        this.emoji_convert = function(val) {

            var test = joypixels.toImage(val);



            __j('body').find('#emojione-test').remove();
            __j('body').append('<div style="display:none;" id="emojione-test">' + test + '</div>');

            var t = __j('#emojione-test').text();
            __j('#emojione-test').remove();


            self.scrollNow = false;

            if ($.trim(t) && typeof t != 'undefined')
                return val;
            else
                return test;



        },
        this.uploading_media_disable_func = function(a, shortcut_id, page_id, group_id) {

            shortcut_id = group_id > 0 && page_id <= 0 ? 'GG' + group_id : shortcut_id;
            var m_container = !shortcut_id ? __j('.pmessenger-msg-list-contenteditable') : __j('#mshortcut-' + shortcut_id).find('.messenger-shortcut-footer');

            if (page_id && shortcut_id && !group_id)
                m_container = __j('.js_chat_with_page_' + page_id).find('.messenger-shortcut-footer');

            if (a == 'enable') {
                self.uploadingMedia = 1;
                if (!m_container.hasClass('__uploading')) {


                    m_container.addClass('__uploading');
                    m_container.prepend('<div class="messenger-uploading-text"><div class="div-loader"></div></div>');

                }

            } else {

                self.uploadingMedia = 0;
                m_container.removeClass('__uploading');
                m_container.find('.messenger-uploading-text').remove();

            }

        },
        this.uploadMedia = function(files, input, ev, content, type, shortcut_id, page_id, group_id) {



            var allowed = JSON.stringify(new Array());
            var count = 0;
            var totalFiles = files.length;
            var media_msg = '';


            var trigger_upload = function() {

                var container = content.find('#mess_uploading_' + count);

                if (typeof files[count] === 'undefined' || count > totalFiles - 1) {


                    for (var i = 0; i < self.media_files.length; i++) {


                        var start = i == 0 ? (self.media_files[i][1] == 'video' ? '[vdivstart]' : '[divstart]') : '';
                        var end = i + 1 == self.media_files.length ? (self.media_files[i][1] == 'video' ? '[vdivend]' : '[divend]') : '';


                        media_msg += self.media_files[i][1] == 'video' ? start + '[video]' + escape(self.media_files[i][0]) + '[/video]' + end : start + '[img]' + escape(self.media_files[i][0]) + '[/img]' + end;

                    }



                    self.send_important = 1;
                    if (!shortcut_id) {
                        self.send(0, ev, media_msg, self.shortcut_id, page_id);

                    } else {
                        //  if(page_id)
                        //   mess_shortcut('mshortcut-'+shortcut_id).send(0, ev,media_msg,shortcut_id, page_id);
                        // else
                        if (page_id)
                            mess_shortcut('mshortcut-' + shortcut_id + '_' + page_id).send(0, ev, media_msg, shortcut_id, page_id);
                        else if (group_id > 0)
                            mess_shortcut('mshortcut-' + shortcut_id).send(0, ev, media_msg, shortcut_id, false, group_id);
                        else
                            mess_shortcut('mshortcut-' + shortcut_id).send(0, ev, media_msg);

                        messenger_shortcut.instant_focusChatTab('mshortcut-' + shortcut_id + (page_id ? '_' + page_id : ''));
                    }

                    


                    return false;


                }

                switch (type) {


                    case 'image':
                        allowed = self.photoTypes;
                        break;
                    case 'video':
                        allowed = self.videoTypes;
                        break;
                }

                if (page_id)
                    var room_id = shortcut_id ? __j('#mshortcut-' + shortcut_id + '_' + page_id).find('#upload_room_id').val() : 'room_' + __j('#mess-roomid').val();
                else
                    var room_id = shortcut_id ? __j('#mshortcut-' + shortcut_id).find('#upload_room_id').val() : 'room_' + __j('#mess-roomid').val();



                var formData = new FormData();
                formData.append('files', files[count]);
                formData.append('cmd', 'upload-media');
                formData.append('type', type);
                formData.append('allowed', JSON.stringify(allowed));
                formData.append('room_id', room_id);

                $.ajax({
                    url: self.ajax_url,
                    type: 'POST',
                    xhr: function() { // Custom XMLHttpRequest
                        var Xhr = $.ajaxSettings.xhr();
                        if (Xhr.upload) { // Check if upload property exists
                            Xhr.upload.addEventListener('progress', function(e) {
                                var p_cont = container.find('.m_uploading_bar');
                                if (e.lengthComputable) {
                                    var p_percentage = Math.round((e.loaded / e.total) * 100);
                                    p_cont.css('height', p_percentage + '%');
                                }
                            }, false); // For handling the progress of the upload
                        }
                        return Xhr;
                    },
                    //Ajax events
                    beforeSend: function() {




                        self.uploading_media_disable_func('enable', shortcut_id, page_id, group_id);




                    },
                    success: function(data) {
                        var response = validateJson(data);
                        if (response['msg'] === 'OK') {

                            var u_image = container.find('.js_messenger_screenshot');
                            u_image.html('').attr({
                                'd-src': response.id,
                                'style': 'background-image:url(/vy-messenger-cmd.php?cmd=atch&id=' + response.id + '&type=' + (type == 'video' ? 'video-cover' : '') + ')'
                            });
                            container.find('.m_uploading_bar').remove();
                            container.find('.js_messenger_delete_screen').attr('id', response.id);
                            container.find('.m_uploading_bar').remove();
                            self.media_files[count] = [response.id, type];

                            count++;
                            setTimeout(function() {
                                trigger_upload();
                            }, 3500);
                        } else return displayErr(response['msg']);
                    },
                    error: function() {
                        return displayErr('Something was wrong while processing your upload. Please try again.')
                    },
                    // Form data
                    data: formData,
                    // Options to tell jQuery not to process data or worry about content-type.
                    cache: false,
                    contentType: false,
                    processData: false
                });

            }

            trigger_upload();
        },
        this.upload_images = function(ev, shortcut_id, page_id, group_id) {

            shortcut_id = group_id > 0 && page_id <= 0 ? 'GG' + group_id : shortcut_id;
            var input = __j(ev.target);
            var files = input[0].files;
            var content = shortcut_id ? __j('#tchat_' + shortcut_id) : __j('#WD_attach_files_PM');
            var image = '<div class="soh-s chat_media_img" id="mess_uploading_%id%"><a href="javascript:void(0);" id="delete_attach_%id%" onclick="messenger.deleteMedia(this,event);" class="foh-s messenger_delete_screen js_messenger_delete_screen __none"><span>Remove</span></a><div class="messenger_screenshot js_messenger_screenshot">%name%</div><div class="m_uploading_bar"></div></div>';

            if (page_id && shortcut_id) {


                content = __j('#tchat_' + shortcut_id + '_' + page_id);
            }

            if (content.children().length > 9 || files.length > 9) {
                return displayErr(lang.messenger_max_upload);
            }


            for (var i = 0; i < files.length; i++) {
                var file_ext = files[i].name.split('.').pop().toUpperCase();

                if ($.inArray(file_ext, self.photoTypes) == -1 && $.trim(file_ext)) {
                    evstop(ev);

                    return displayErr(lang.up_invalid_file_ext.replace('%s', self.photoTypes));
                }

                content.prepend(image.replace(/%id%/, i).replace('%name%', files[i].name));

            }


            self.uploadMedia(files, input, ev, content, 'image', shortcut_id, page_id, group_id);


        },
        this.upload_videos = function(ev, shortcut_id, page_id, group_id) {

            shortcut_id = group_id > 0 && page_id <= 0 ? 'GG' + group_id : shortcut_id;
            var input = __j(ev.target);
            var files = input[0].files;
            var content = shortcut_id ? __j('#tchat_' + shortcut_id) : __j('#WD_attach_files_PM');
            var video = '<div class="soh-s chat_media_img __video" id="mess_uploading_%id%"><a href="javascript:void(0);" id="delete_attach_%id%" onclick="messenger.deleteMedia(this,event);" class="foh-s messenger_delete_screen js_messenger_delete_screen"><span>Remove</span></a><div class="messenger_screenshot js_messenger_screenshot">%name%</div><div class="m_uploading_bar"></div></div>';

            if (page_id && shortcut_id) {


                content = __j('#tchat_' + shortcut_id + '_' + page_id);
            }


            if (content.children().length > 9 || files.length > 9) {
                return displayErr(lang.messenger_max_upload);
            }


            for (var i = 0; i < files.length; i++) {
                var file_ext = files[i].name.split('.').pop().toUpperCase();

                if ($.inArray(file_ext, self.videoTypes) == -1 && $.trim(file_ext)) {
                    evstop(ev);

                    return displayErr(lang.up_invalid_file_ext.replace('%s', self.videoTypes));
                }

                content.prepend(video.replace(/%id%/, i).replace('%name%', files[i].name));

            }


            self.uploadMedia(files, input, ev, content, 'video', shortcut_id, page_id, group_id);


        },
        this.start_upload = function(ev, type, shortcut_id, page_id, group_id) {

            self.media_files = new Array();

            switch (type) {


                case 'video':

                    self.upload_videos(ev, shortcut_id, page_id, group_id);

                    break;

                case 'image':

                    self.upload_images(ev, shortcut_id, page_id, group_id);
                    break;


            }




        },
        this.close_gifs = function(shortcut_id) {

            var s = shortcut_id ? __j('#mshortcut-' + shortcut_id).find('.messenger_js_gifs') : self.pmessenger.find('.messenger_js_gifs');
            s.css('transform', 'translateY(0px)').on(self.crossEvent(), function() {
                s.remove();
                s.parent().addClass('__none');
            });
            self.pmessenger.removeClass('zindex1031');

        },
        this.get_gifs = function(el, shortcut_id, group_id) {

            shortcut_id = shortcut_id && group_id > 0 ? 'GG' + group_id : shortcut_id;

            if (shortcut_id) {
 
                var container = __j('#mshortcut-' + shortcut_id).find('.js_media_gifs');
            } else {
                var container = self.pmessenger.find('.js_media_gifs');
            }



            if (container.html() != '') {
                self.close_gifs(shortcut_id);

                return;
            }



            el = __j(el);
            container.removeClass('__none').empty().html('<div onclick="event.stopImmediatePropagation();" ontouchend="event.stopImmediatePropagation();" ontouchstart="event.stopImmediatePropagation();"  class="messenger_js_gifs messenger_gifs_container"><div class="messenger-gifs-header"><input type="text" id="gifs-search-val" placeholder="Search for gifs" /><div class="messenger-gif-search-loading js-messenger-gif-search-loading"></div></div><div class="messenger_gifs_content nano"><div class="nano-content overthrow js_messenger_gifs_cnt"></div></div></div>');
            var random_key = function(length, current) {
                current = current ? current : '';
                return length ? random_key(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;

            }
            var that = this;

            self.pmessenger.addClass('zindex1031');
            // close gifs on ESC
            __j(document).on('keydown.closeGifs' + self.random_id(), function(e) {

                if (e.keyCode == 27)
                    self.close_gifs(shortcut_id);

            });

            __j(document).on(self.hasTouchStartEvent ? 'touchend.closeGifs' + self.random_id() : 'click.closeGifs' + self.random_id(), 'html,body', function(e) {
                self.close_gifs(shortcut_id);

            });
            __j(document).on(self.hasTouchStartEvent ? 'touchend.closeGifs' + self.random_id() : 'click.closeGifs' + self.random_id(), '.messenger-shortcut-cnt', function(e) {
                self.close_gifs(shortcut_id);
            });


            self.stop_xhr('get-gifs');
            var send = jAjax(self.ajax_url, 'post', 'cmd=get-gifs&key=' + random_key(2), false, 'get-gifs');
            send.done(function(data) {  

                var translateY_px = 'translateY(-550px)';

                if(shortcut_id)
                    translateY_px = 'translateY(-250px)';

                container.find('.messenger_js_gifs').css('transform', translateY_px);


                var d = validateJson(data);


                var search_GIF_input = container.find('#gifs-search-val'),
                    gifs_loading_input = container.find('.js-messenger-gif-search-loading'),
                    gifs_empty_input = container.find('#gif-empty-input'),
                    gifs_nano_c = container.find('.messenger_js_gifs').find('.nano'),
                    gifs_appto = container.find('.js_messenger_gifs_cnt');

                search_GIF_input.focus();

                var send_to_id = 1;
                var send_in = 'a';

                for (var i = 0; i < d.data.length; ++i) {
                    var ud = d.data[i];

                    gifs_appto.append('<A id="' + ud.id + '" data-gif="' + ud['images']['fixed_height']['url'] + '" onclick="messenger.sendGif(this,event,\'' + shortcut_id + '\',' + (group_id > 0 ? group_id : 0) + ');" href="javascript:void(0);">\
                        <div  style="background-image:url(' + ud['images']['fixed_height_small']['url'] + ')" ></div></a>');

                }
                setTimeout(function() {
                    gifs_nano_c.nanoScroller();
                }, 1000);


                search_GIF_input.off('keyup.searchGif').on('keyup.searchGIf', function(evt) {

                    var _that = this;
                    clearTimeout(that.srchGif_timeout);
                    if (evt.keyCode != 27) {
                        gifs_empty_input.hide();
                        gifs_loading_input.show();
                        that.srchGif_timeout = setTimeout(function() {

                            messenger.searchGifs(_that.value, send_in, send_to_id, shortcut_id);

                        }, 1000);
                    }
                });
                search_GIF_input.off('keydown.searchGif keypress.searchGif').on('keydown.searchGIf keypress.searchGif', function(evt) {
                    clearTimeout(that.srchGif_timeout);
                    gifs_empty_input.show();
                });
                gifs_empty_input.off('click.seaerchGifInputEmpty').on('click.seaerchGifInputEmpty', function() {
                    search_GIF_input.val('');
                    search_GIF_input.trigger('keyup.searchGif');
                    __j(this).hide();
                });


            });

        },
        // search gifs
        this.searchGifs = function(k, send_in, send_to_id, shortcut_id) {
            var that = this;
            shortcut_id = shortcut_id || false;
            if (shortcut_id) {

                var container = __j('#mshortcut-' + shortcut_id).find('.js_media_gifs');
            } else {
                var container = self.pmessenger.find('.js_media_gifs');
            }
            self.stop_xhr('ms-search-gifs');
            var send = jAjax(self.ajax_url, 'post', {
                cmd: 'get-gifs',
                key: k ? escape(k) : 'smile'
            }, false, 'ms-search-gifs');
            send.done(function(a) {

                var d = validateJson(a);

                var gifs_nano_c = container.find('.gif_index_cnt.nano'),
                    gifs_empty_input = container.find('#gif-empty-input'),
                    gifs_loading_input = container.find('.js-messenger-gif-search-loading'),
                    gifs_appto = container.find('.js_messenger_gifs_cnt');

                gifs_loading_input.hide();
                gifs_empty_input.show();

                gifs_appto.empty();

                for (var i = 0; i < d.data.length; ++i) {

                    var ud = d.data[i];
                    that.gifUrl = ud['images']['fixed_height']['url'];

                    gifs_appto.append('<A id="' + ud.id + '" data-gif="' + ud['images']['fixed_height']['url'] + '" onclick="messenger.sendGif(this,event,\'' + shortcut_id + '\');" href="javascript:void(0);">\
                        <div  style="background-image:url(' + ud['images']['fixed_height']['url'] + ')" ></div></a>');

                }
            });
        },
        this.sendGif = function(el, evt, shortcut_id, group_id) {
            shortcut_id = shortcut_id == 'false' || shortcut_id == 'undefined' ? false : shortcut_id;
            if (shortcut_id) {

                var container = __j('#mshortcut-' + shortcut_id).find('.js_media_gifs');
            } else {
                var container = self.pmessenger.find('.js_media_gifs');
            }

            evstop(evt);

            el = __j(el);
            var send_in = el.data('send-in'),
                send_to_id = el.data('send-to'),
                gif_url = el.data('gif');


            var msg = '[gif]' + gif_url + '[/gif]';


            if (!shortcut_id) {
                self.send(0, evt, msg, self.shortcut_id);
            } else {
                let group_id = shortcut_id.includes('GG') ? shortcut_id.split('GG')[1] : 0;
                mess_shortcut('mshortcut-' + shortcut_id).send(0, evt, msg, false, false, group_id);
            }

            self.close_gifs(shortcut_id);
        },
        this.close_stickers = function(shortcut_id) {

            var s = shortcut_id ? __j('#mshortcut-' + shortcut_id).find('.messenger_js_stickers') : self.pmessenger.find('.messenger_js_stickers');
            s.css('transform', 'translateY(0px)').on(self.crossEvent(), function() {
                s.remove();
                s.parent().addClass('__none');
            });


            self.pmessenger.removeClass('zindex1031');
        },
        this.openStickers = function(el, evt, custom, shortcut_id, page_id, group_id, find_stickers) {

            evstop(evt);

            el = __j(el);

            if (find_stickers) {
                let is_messenger = el.closest('.pmessenger').length;
                let st_find_in = is_messenger ? self.pmessenger : el.closest('.messenger-shortcut-container');
                let get_shortcut_id = is_messenger ? 0 : st_find_in.attr('id');
                let i_group_id = get_shortcut_id && get_shortcut_id.includes('GG') ? get_shortcut_id.split('GG')[1] : 0;
                var container = st_find_in.find('.js_media_stickers');
                shortcut_id = is_messenger ? 0 : (i_group_id > 0 ? 'GG' + i_group_id : tonum(get_shortcut_id));

            } else {

                shortcut_id = shortcut_id && group_id > 0 ? 'GG' + group_id : shortcut_id;
                if (shortcut_id) {

                    var container = __j('#mshortcut-' + shortcut_id).find('.js_media_stickers');
                } else {
                    var container = self.pmessenger.find('.js_media_stickers');

                }
            }
            container.removeClass('__none');
            if (!container.length) {
                container = self.pmessenger.length ? self.pmessenger.find('.js_media_stickers') : __j('.messenger-shortcut-container._focus').find('.js_media_stickers');

                shortcut_id = tonum(__j('.messenger-shortcut-container._focus').attr('id'));
            }

            if (container.html() != '') {
                self.close_stickers(shortcut_id);

                return;
            }



            let stk_slider_left = '<div id="stickers-slider-arrow-left" onclick="return messenger.slideStickers(this,\'back\');" class="stickers__slider-arrow _left stickers__slider-arrow_disabled"></div>';
            let stk_slider_right = '<div id="stickers-slider-arrow-right" onclick="return messenger.slideStickers(this,\'forward\');" class="stickers__slider-arrow _right"></div>';
            el = __j(el);
            container.empty().html('<div onclick="event.stopImmediatePropagation();" ontouchend="event.stopImmediatePropagation();" ontouchstart="event.stopImmediatePropagation();" class="messenger_js_stickers messenger_stickers_container"><div class="messenger-stickers-header"><input type="text" id="stickers-search-val" placeholder="Search for stickers" /><div class="messenger-gif-search-loading js-messenger-stickers-search-loading"></div><a href="javascript:void(0);" style="display:none;" class="messenger_stickers_close_search js_stickers_close_search"></a></div><div style="display:none;" class="stickers_header js_search_stickers_header"></div><div class="stickers_header js_stickers_header"></div><div class="messenger_stickers_content nano"><div class="nano-content overthrow js_messenger_stickers_cnt"><div class="div-loader"></div></div></div></div>');

            var that = this;
            var stickers_header = '';
            var js_stickers_header = container.find('.js_stickers_header');

            self.pmessenger.addClass('zindex1031');

            // close stickers on ESC
            __j(document).on('keydown.closeStickers' + self.random_id(), function(e) {

                if (e.keyCode == 27)
                    self.close_stickers(shortcut_id);

            });



            __j(document).on(self.hasTouchStartEvent ? 'touchend.closeStickers' + self.random_id() : 'click.closeStickers' + self.random_id(), function(e) {
                self.close_stickers(shortcut_id);

            });

            __j(document).on(self.hasTouchStartEvent ? 'touchend.closeStickers' + self.random_id() : 'click.closeStickers' + self.random_id(), '.messenger-shortcut-cnt', function(e) {
                self.close_stickers(shortcut_id);
            });


            self.stop_xhr('ms-getsticker');
            var from = shortcut_id ? 'shortcut' : 'messenger';
            var send = jAjax(self.ajax_url, 'post', 'cmd=get-stickers&from=' + from, false, 'ms-getsticker');
            send.done(function(data) {



                var d = validateJson(data);


                if (d.length > 0) {

                    for (var i = 0; i < d.length; i++) {


                        var sticker = d[i];
                        var sticker_id = sticker[0];
                        var sticker_title = sticker[1];
                        var sticker_cover = sticker[2];

                        stickers_header += '<a class="sticker-pk" onclick="messenger.openStickersPack(this,event,' + sticker_id + ',\'' + shortcut_id + '\',' + (group_id > 0 ? group_id : 0) + ');" title="' + sticker_title + '"><div class="sticker-cover" style="background-image:url(' + sticker_cover + ');"></div></a>';


                    }

                    js_stickers_header.html(stk_slider_left + '<div class="vy_ms__stickers-header-slider" id="vy_ms__stickers-header-slider">' + stickers_header + '</div>' + stk_slider_right);


                    var translateY_px = 'translateY(-550px)';

                    if(shortcut_id)
                        translateY_px = 'translateY(-250px)';

                    container.find('.messenger_js_stickers').css('transform', translateY_px);

                    var search_STICKERS_input = container.find('#stickers-search-val'),
                        stickers_loading_input = container.find('.js-messenger-stickers-search-loading');


                    search_STICKERS_input.off('keyup.searchStickers').on('keyup.searchStickers', function(evt) {
                        var _that = this;
                        clearTimeout(that.srchSTICKERS_timeout);
                        if (evt.keyCode != 27) {
                            js_stickers_header.hide();
                            stickers_loading_input.show();
                            that.srchSTICKERS_timeout = setTimeout(function() {

                                messenger.searchStickers(_that.value, shortcut_id);

                            }, 1000);
                        }
                    });

                    search_STICKERS_input.off('keydown.searchStickers keypress.searchStickers').on('keydown.searchStickers keypress.searchStickers', function(evt) {
                        clearTimeout(that.srchSTICKERS_timeout);

                    });



                    if (custom) {
                        search_STICKERS_input.val(custom).trigger('keyup.searchStickers');

                    } else {
                        container.find('.sticker-pk:first').click();
                    }




                }

            });


        },
        this.slideStickers = function(el, mode) {
            el = __j(el);
            switch (mode) {

                case 'forward':
                    el.parent().find('#vy_ms__stickers-header-slider').animate({
                        scrollLeft: '+=250px'
                    });
                    break;

                case 'back':
                    el.parent().find('#vy_ms__stickers-header-slider').animate({
                        scrollLeft: '-=250px'
                    });
                    break;

                default:
                    return;

            }

            self.slideStickersArrows();

        },

        this.slideStickersArrows = function() {

            var disabled_class = "stickers__slider-arrow_disabled";
            var slider_cont = __j('#vy_ms__stickers-header-slider');
            if (!slider_cont.hasScrollBar()) slider_cont.parent().find('.stickers__slider-arrow._right').addClass(disabled_class);

            slider_cont.off('scroll.horizontal').on('scroll.horizontal', function(e) {
                var _a = __j(this),
                    s_newScrollLeft = _a.scrollLeft(),
                    s_width = _a.outerWidth(),
                    h_scrollWidth = _a.get(0).scrollWidth;



                if (_a.scrollLeft() >= 10) {
                    _a.parent().find('.stickers__slider-arrow._left').removeClass(disabled_class);

                } else {

                    _a.parent().find('.stickers__slider-arrow._left').addClass(disabled_class);
                }



                if (h_scrollWidth - s_newScrollLeft === s_width) {
                    _a.parent().find('.stickers__slider-arrow._right').addClass(disabled_class);

                } else {

                    _a.parent().find('.stickers__slider-arrow._right').removeClass(disabled_class);
                }

            });

        },
        this.searchStickers = function(key, shortcut_id) {
            shortcut_id = shortcut_id || false;
            if (shortcut_id) {

                var container = __j('#mshortcut-' + shortcut_id).find('.js_media_stickers');
            } else {
                var container = self.pmessenger.find('.js_media_stickers');
            }


            var search_header = container.find('.js_search_stickers_header');
            var close_search = container.find('.js_stickers_close_search');
            var result = '';

            var stop_sticker_search = function() {

                container.find('#stickers-search-val').val('');
                container.find('.js_stickers_header').show();
                search_header.empty().hide();
                close_search.hide();
            };
            self.stop_xhr('ms-searchsticker');
            var send = jAjax(self.ajax_url, 'post', 'cmd=search-stickers&key=' + escape(key), false, 'ms-searchsticker');
            send.done(function(data) {
                container.find('.js-messenger-stickers-search-loading').hide();
                close_search.show().on('click', function(e) {
                    evstop(e);

                    stop_sticker_search();
                });
                var d = validateJson(data);
                for (var i = 0; i < d.length; i++) {

                    result += '<a class="sticker-pk" onclick="messenger.openStickersPack(this,event,' + d[i][0] + ', \'' + shortcut_id + '\');" title="' + d[i][1] + '"><div class="sticker-cover" style="background-image:url(' + d[i][2] + ');"></div></a>';

                }
                search_header.show().html(result).find('.sticker-pk:first').click();
            });

        },
        this.openStickersPack = function(el, evt, id, shortcut_id) {

            evstop(evt);

            el = __j(el);


            shortcut_id = shortcut_id == 'false' || shortcut_id == 'undefined' ? false : shortcut_id;
            var container = (shortcut_id ? __j('#mshortcut-' + shortcut_id).find('.js_media_stickers') : self.pmessenger.find('.js_media_stickers')) || false;

            if (!container)
                container = self.pmessenger.length ? self.pmessenger.find('.js_media_stickers') : __j('.messenger-shortcut-container._focus').find('.js_media_stickers');

            container.find('.sticker-pk').removeClass('active');
            el.addClass('active');

            self.stop_xhr('ms-open-sticker-pack');
            var cnt = container.find('.js_messenger_stickers_cnt');
            var send = jAjax(self.ajax_url, 'post', 'cmd=open-sticker-pack&id=' + escape(id), false, 'ms-open-sticker-pack');
            ajaxLoading();
            send.done(function(data) {
                removeAjaxLoad();
                var d = validateJson(data);

                var html = '';

                for (var i = 0; i < d.length; i++) {

                    html += '<a href="javascript:void(0);" data-src="' + d[i][1] + '" onclick="messenger.sendSticker(this,event,' + d[i][0] + ',\'' + shortcut_id + '\', ' + escape(id) + ');" class="stiycker" style="background-image:url(' + d[i][1] + ');"></a>';
                }

                cnt.html(html);
                nanoScrollStart();


            });

        },
        this.sendSticker = function(el, evt, id, shortcut_id, pack_id) {
            evstop(evt);

            shortcut_id = shortcut_id == 'false' || shortcut_id == 'undefined' ? false : shortcut_id;
            let msg = '[stickerid]' + id + '[/stickerid]';

            let recentStickers = new Array();
            let cookie_stickers = readCookie('vy_ms__recentstickers');

            let remove_duplicates_safe = function(arr) {
                let seen = {};
                let ret_arr = [];

                let i = arr.length;
                while (i--) {
                    if (!(arr[i] in seen)) {
                        ret_arr.push(arr[i]);
                        seen[arr[i]] = true;
                    }
                }
                ret_arr.reverse();
                return ret_arr;

            }


            if (!shortcut_id) {
                self.send(0, evt, msg, self.shortcut_id);
            } else {
                let group_id = shortcut_id.includes('GG') ? shortcut_id.split('GG')[1] : 0;
                mess_shortcut('mshortcut-' + shortcut_id).send(0, evt, msg, false, false, group_id);
            }

            self.close_stickers(shortcut_id);

            if (cookie_stickers && cookie_stickers.includes(',')) {
                let cookie_arr_stickers = cookie_stickers.split(',');
                let cookie_i_stickers = cookie_arr_stickers.length;

                while (cookie_i_stickers--)
                    recentStickers.push(cookie_arr_stickers[cookie_i_stickers]);


            } else if (cookie_stickers && !cookie_stickers.includes(',')) {
                recentStickers.push(cookie_stickers);

            }


            if (recentStickers.length >= 15) {

                recentStickers.splice(recentStickers[recentStickers.length.length - 1], 1);

            }

            if (recentStickers.indexOf(pack_id) == -1)
                recentStickers.push(pack_id);

            recentStickers = remove_duplicates_safe(recentStickers);
            createCookie('vy_ms__recentstickers', recentStickers.join(','), 99);


        },
        this.sendLocation = function(el, evt, shortcut_id, page_id, group_id) {

            evstop(evt, 1);
            self.confirm_act(lang.messenger_confirm_send_location,
                function(event) {


                    shortcut_id = shortcut_id && group_id > 0 ? 'GG' + group_id : shortcut_id;
                    var nav_id;
                    var showPosition = function(position) {

                        if (self.sended_location) return;


                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;

                        var msg = '[sharelocation]' + lat + '=' + lng + '[/sharelocation]';



                        if (!shortcut_id) {
                            self.send(0, evt, msg, self.shortcut_id, page_id, group_id);
                        } else {
                            mess_shortcut('mshortcut-' + shortcut_id).send(0, evt, msg, shortcut_id, page_id, group_id);
                            messenger_shortcut.instant_focusChatTab('mshortcut-' + shortcut_id);
                        }

                        self.sended_location = true;
                        setTimeout(function() {
                            self.sended_location = false;
                        }, 5000);
                        navigator.geolocation.clearWatch(nav_id);
                    }

                    nav_id = navigator.geolocation.watchPosition(function(position) {
                            navigator.geolocation.getCurrentPosition(showPosition);
                        },
                        function(error) {
                            self.merror('Location disabled. Error: '+error);

                           /* self.confirm_act(lang.Messenger_send_api_location,
                                function(event) {

                                    $.get('//freegeoip.app/json/', function(r) {
                                        navigator.geolocation.clearWatch(nav_id);

                                        showPosition({
                                            coords: {
                                                'latitude': r.latitude,
                                                'longitude': r.longitude
                                            }
                                        });

                                    });


                                }, false, lang.Messenger_confirm_sending_api_location,
                                function() {
                                    //cancel ()
                                }); //confirm
*/

                        });

                }, false, lang.Messenger_agree_send_location,
                function() {}); // confirmation
        },
        this.theme = function() {
            return readCookie('mode') && readCookie('mode') == 'night' ? 'dark' : 'light';
        }
    this.confirm_act = function(question, func, btn3, confirm_btn_text, cancel_callback) {


            let buttons = {};
            let ccr = 'ccp_' + self.random_id();
            let confirm_btn = {
                text: confirm_btn_text ? confirm_btn_text : lang.messenger_delete_for_me,
                btnClass: 'btn-blue',
                action: function() {
                    func('me');
                }



            };

            let cancel_btn = {
                text: lang.messenger_cancel_button,
                action: function() {

                    if (typeof cancel_callback == 'function') cancel_callback();
                }
            };

            let delete_everyone_btn = {
                'text': lang.messenger_delete_for_everyone,
                'btnClass': 'btn-red',
                'action': function() {
                    func('everyone');
                }
            };

            let copy_message = {
                'text': lang.Messenger_mob_copy_msg,
                'btnClass': ccr + ' js__mob_btn_copytext btn-green',
                'action': function(b) {

                    let clipboard = new ClipboardJS('.' + ccr);
                    clipboard.on('success', function(e) {
                        localStorage.removeItem('vy_ms__mob_clipboardtxt');
                        e.clearSelection();

                    });

                    clipboard.on('error', function(e) {});

                }
            };

            if (btn3) {

               // if (self.hasTouchStartEvent && self.enable_copytoclipboard_mob_btn)
                   // buttons['copy_message'] = copy_message;

                buttons['delete_everyone'] = delete_everyone_btn;
                buttons['confirm'] = confirm_btn;
                buttons['cancel'] = cancel_btn;

                $.confirm({
                    title: lang.messenger_confirmation_title,
                    content: question,
                    icon: 'fa fa-question-circle',
                    animation: 'none',
                    closeAnimation: 'none',
                    onOpenBefore: function() {
                        // before the modal is displayed.
                        if (self.hasTouchStartEvent)
                            self.confirm_sound();
                    },
                    theme: self.theme(),
                    opacity: 0.5,
                    buttons: buttons,
                    onContentReady: function() {
/*
                        setTimeout(function() {

                            __j('.js__mob_btn_copytext').attr('data-clipboard-text', localStorage.getItem('vy_ms__mob_clipboardtxt'));
                        }, 100);*/
                    },
                    onClose: function() {
                        self.enable_copytoclipboard_mob_btn = !1;
                    }

                });
            } else {
              //  if (self.hasTouchStartEvent && self.enable_copytoclipboard_mob_btn)
                  //  buttons['copy_message'] = copy_message;

                buttons['confirm'] = confirm_btn;
                buttons['cancel'] = cancel_btn;
                $.confirm({
                    title: lang.messenger_confirmation_title,
                    content: question,
                    icon: 'fa fa-question-circle',
                    animation: 'none',
                    closeAnimation: 'none',
                    onOpenBefore: function() {
                        if (self.hasTouchStartEvent)
                            self.confirm_sound();
                    },
                    theme: self.theme(),
                    opacity: 0.5,
                    buttons: buttons,
                    onContentReady: function() {
                       /* setTimeout(function() {
                            __j('.js__mob_btn_copytext').attr('data-clipboard-text', localStorage.getItem('vy_ms__mob_clipboardtxt'));
                        }, 100);
                        */
                    },
                    onClose: function() {
                        self.enable_copytoclipboard_mob_btn = !1;
                    }
                });

            }

        },
        this.mute_wo = function() {
            if (__j('#message-sound').length) __j('#message-sound')[0].volume = 0;
        },
        this.unmute_wo = function() {
            if (__j('#message-sound').length) __j('#message-sound')[0].volume = 1;
        },
        this.getGroupAdminMarkup = function(group_id) {

            return '\
                              <li><a onclick="messenger.editGroupChat(this,event,' + group_id + ');" href="javascript:void(0);" class="vy_ms__group_admin_settings_button">' + self.svgi.js['group_edit'] + '&nbsp;' + lang.Messenger_Edit_Group + '</a></li>\
                              <li><a onclick="messenger.ManageGroupMembers(event,' + group_id + ');" href="javascript:void(0);" class="vy_ms__group_admin_settings_button">' + self.svgi.js['group_members'] + '&nbsp;' + lang.Messenger_Group_Edit_Members + '</a></li>\
                              <li><a onclick="messenger.clearGroupMsgs(event,' + group_id + ');" href="javascript:void(0);" class="vy_ms__group_admin_settings_button">' + self.svgi.js['group_clear'] + '&nbsp;' + lang.Messenger_Clear_Group_Conversation + '</a></li>\
                              <li><a onclick="messenger.DeleteGroup(event,' + group_id + ')" href="javascript:void(0);" class="vy_ms__group_admin_settings_button">' + self.svgi.js['group_delete'] + '&nbsp;' + lang.Messenger_Group_Delete + '</a></li>\
                              ';



        },
        this.join_group = function(json) {
            self.socket.emit("vy_ms__joingroup", json);
        },
        this.openGroupAdmin = function(ev, el, group_id) {
            evstop(ev, 1);
            var el = __j(el);

            let openCloseGroupAdminMenu = function(a, html, _el) {

                if (a == 'open') {
                    _el.parent().prepend(html);
                    _el.addClass('group_admin_dropdown_active');
                } else {
                    self.pmessenger.find('.js__group_admin_settings_cnt').remove();
                    __j('.group_admin_dropdown_active').removeClass('group_admin_dropdown_active');
                }

            }

            let admin_html = '<div class="vy_ms__group_admin_settings_cnt js__group_admin_settings_cnt"><ul>' + self.getGroupAdminMarkup(group_id) + '</ul></div>';


            if (!el.parent().find('.js__group_admin_settings_cnt').length)
                openCloseGroupAdminMenu('open', admin_html, el);
            else
                openCloseGroupAdminMenu('close');

            __j(document).off('click.closeGroupAdminPanel').on('click.closeGroupAdminPanel', function(e) {

                evstop(e);
                openCloseGroupAdminMenu('close');

            });
            __j(document).off('keyup.closeGroupAdminPanel').on('keyup.closeGroupAdminPanel', function(e) {

                evstop(e);
                if (e.keyCode == 27) openCloseGroupAdminMenu('close');

            });

        },
        this.merror = function(t) {

            return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + t + '</div>');
        },
        this.DeleteGroup = function(e, gid, shortcut_id) {

            evstop(e, 1);

            self.confirm_act(lang.Messenger_group_delete_confirm,
                function(event) {
                    var cmd = {
                        'cmd': 'delete-group',
                        'group': escape(gid)
                    };
                    let check_admin = jAjax(self.ajax_url, 'post', {
                        'cmd': 'check-group-admin',
                        'group': gid
                    });
                    check_admin.done(function(admin) {


                        if (!admin || admin <= 0)
                            return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_group_no_admin + '</div>');

                        var send = jAjax(self.ajax_url, 'post', cmd);
                        send.done(function(res) {
                            res = validateJson(res);

                            if (res.s == 'success') {
                                if (self.pmessenger.length)
                                    self.pmessenger.find('#room_GG' + gid + ' #messenger-nano-content-fullheight').empty().html('<div class="vy_ms__group_cleared js__vy_ms__group_cleared">' + lang.Messenger_group_delete_confirm + '</div>');

                                self.groupNotification(_U.i, gid, 'group-deleted', _U.i, shortcut_id, 1);

                            } else {
                                modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + res.msg + '</div>');
                            }

                        }); //ajax
                    }); //check for admin

                }, false, lang.Messenger_confirm_deleting_button,
                function() {
                    //cancel ()
                }); //confirm

        },
        this.exitGroup = function(e, group_id, shortcut_id, callback) {

            evstop(e, 1);

            shortcut_id = __j('#mshortcut-GG' + group_id).length && !self.html.hasClass('messenger-window') ? 'mshortcut-GG' + group_id : 0;
            let $el = __j(e.target);

            self.confirm_act(lang.Messenger_confirm_exit_group,
                function(event) {

                    let check_admin = jAjax(self.ajax_url, 'post', {
                        'cmd': 'group-exit-check-owner',
                        'group': group_id
                    });
                    check_admin.done(function(admin) {


                        if (admin && admin > 0) {
                            if (callback) callback('cancel');

                            return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_exit_glavnii_admin_from_group + '</div>');
                        }

                        ajaxLoading();

                        if (!group_id) {
                            return false;
                        }

                        let remove_user = jAjax(self.ajax_url, 'post', {
                            'cmd': 'leave_group',
                            'group': escape(group_id),
                            'id': escape(_U.i)
                        });
                        remove_user.done(function(data) {
                                removeAjaxLoad();
                                data = validateJson(data);

                                if (data.status == 200 && data.success == 0) {
                                    if (callback) callback('cancel');
                                    return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_try_again + '</div>');
                                } else if (data.status == 200 && data.success == 1) {
                                    if (callback) callback('success');
                                    self.groupNotification(_U.i, group_id, 'user-exit-from-group', _U.i);
                                    // throw out the member
                                    self.socket.emit("vy_ms__group_remove_member", JSON.stringify({
                                        'Group_id': socketId('GG' + group_id),
                                        'Room_id': socketId(generateRoomId(0, _U.i, 0, group_id)),
                                        'Group_clean_id': 'GG' + group_id,
                                        'Userid': socketId(_U.i),
                                        'Userid_clean': _U.i,
                                        'shortcut_id': shortcut_id,
                                        'own_exit': 1,
                                        'next_conversation': self.hasTouchStartEvent ? 'no' : 'yes'
                                    }));
                                } else {
                                    if (callback) callback('cancel');
                                    return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_try_again + '</div>');
                                }
                            })
                            .fail(function() {
                                if (callback) callback('cancel');
                                return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_try_again + '</div>');
                            });

                    });
                }, false, lang.Messenger_confirm_btn_leaving_group,
                function() {
                    if (callback) callback('cancel');
                    //cancel ()
                }); //confirm
        },
        this.clearGroupMsgs = function(e, gid, shortcut_id) {

            evstop(e, 1);

            self.confirm_act(lang.Messenger_confirm_clear_group_messages,
                function(event) {
                    var cmd = {
                        'cmd': 'group-clear',
                        'group': escape(gid)
                    };
                    let check_admin = jAjax(self.ajax_url, 'post', {
                        'cmd': 'check-group-admin',
                        'group': gid
                    });
                    check_admin.done(function(admin) {


                        if (!admin || admin <= 0)
                            return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_group_no_admin + '</div>');


                        var send = jAjax(self.ajax_url, 'post', cmd);
                        send.done(function(res) {
                            res = validateJson(res);

                            if (res.s == 'success') {
                                //if(self.pmessenger.length)
                                //  self.pmessenger.find('#room_GG'+gid+' #messenger-nano-content-fullheight').empty().html('<div class="vy_ms__group_cleared js__vy_ms__group_cleared">'+lang.Messenger_group_clear+'</div>');


                                jAjax(self.ajax_url, 'post', {
                                    'cmd': 'get-group-details',
                                    'group': escape(gid)
                                }).done(function(group_details) {


                                    // clean group to all users
                                    self.socket.emit("vy_ms__group_clean", JSON.stringify({
                                        'Group_id': socketId('GG' + gid),
                                        'Group_clean_id': 'GG' + gid,
                                        'shortcut_id': shortcut_id,
                                        'User': _U,
                                        'Group_data': validateJson(group_details)
                                    }));

                                    self.groupNotification(_U.i, gid, 'admin-clean-group', _U.i, shortcut_id);




                                    nanoScrollStart();

                                });



                            } else {
                                modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + res.msg + '</div>');
                            }

                        }); //ajax

                    }); //check for admin
                }, false, lang.Messenger_confirm_deleting_button,
                function() {
                    //cancel ()
                }); //confirm

        },
        this.groupNotification = function(user_id, group_id, notification, admin_id, shortcut_id, die) {

            if (!user_id || !group_id || !notification) return;

            shortcut_id = __j('#mshortcut-GG' + group_id).length && !self.html.hasClass('messenger-window') ? 'mshortcut-GG' + group_id : 0;
            let send = jAjax(self.ajax_url, 'post', {
                'cmd': 'get-user-details',
                'id': escape(user_id)
            });
            send.done(function(data) {

                let d = validateJson(data);
                let notif_text = '';
                switch (notification) {


                    case 'admin-removed-user':
                        notif_text = 'Messenger_user_removed_by_admin';
                        break;

                    case 'admin-clean-group':
                        notif_text = 'Messenger_group_cleaned_by_admin';
                        break;

                    case 'group-deleted':
                        notif_text = 'Messenger_group_deleted_by_admin';
                        break;

                    case 'user-nickname-update':
                        notif_text = 'Messenger_group_nickname_updated';
                        break;

                    case 'user-nickname-removed':
                        notif_text = 'Messenger_group_nickname_removed';
                        break;

                    case 'user-exit-from-group':
                        notif_text = 'Messenger_user_exit_from_group';
                        break;


                }

                self.socket.emit("vy_ms__group_notifications", JSON.stringify({
                    'Group_id': socketId('GG' + group_id),
                    'Group_clean_id': 'GG' + group_id,
                    'Userid': user_id,
                    'notification': notif_text,
                    'shortcut_id': shortcut_id,
                    'die': die,
                    'categ': notification,
                    'arg': {
                        'username': d.fullname,
                        'id': user_id,
                        'avatar': d.profile_photo
                    }
                }));
            });



        },
        this.group_member_markup = function(member, group_id, k) {
            let on_click = k ? 'invite' : 'remove';
            let on_click2 = k ? 'messenger.group_invite_member(event,this,' + member.id + ',' + group_id + ');' : 'messenger.group_remove_member(event,this,' + member.id + ',' + group_id + ');';
            return '<li id="vy_ms__group_member_' + (!k ? 'rm_' : '') + member.id + '_' + group_id + '" onclick="messenger.group_members_e(this,event,' + member.id + ',' + group_id + ',\'' + on_click + '\');" class="vy_ms__groupchat_member ' + (member.admin == 'yes' ? '__admin' : '') + ' ' + (k ? '__invitation' : '') + '"><div class="vy_ms__gcm01"><img src="' + member.avatar + '" /></div><div style="position:relative;"><username class="vy_ms__gcm02">' + member.fullname + '</username><span class="vy_ms_f54ccgf"><i title="Administrator" class="glyphicon glyphicon-ok-sign"></i></span></div><a href="javascript:void(0);" onclick="' + on_click2 + '"><span class="__none">' + (k == 'add' ? lang.Messenger_add_new_members_to_group : lang.Messenger_remove_member_from_group) + '</span></a></li>';

        },
        this.GroupRemoveAdmin = function(el, uid, gid) {

            if (!el.hasClass('__admin'))
                return self.GroupAddNewAdmin(el, uid, gid);

            el.removeClass('__admin');
            let send = jAjax(self.ajax_url, 'post', {
                'cmd': 'group-remove-admin',
                'group': escape(gid),
                'id': escape(uid)
            });
            send.done(function(data) {

                data = validateJson(data);

                if (data.s != 'success') {

                    modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + data.msg + '</div>');
                    el.addClass('__admin');

                }

            });

        },
        this.GroupAddNewAdmin = function(el, uid, gid) {

            if (el.hasClass('__admin'))
                return self.GroupRemoveAdmin(el, uid, gid);

            el.addClass('__admin');
            let send = jAjax(self.ajax_url, 'post', {
                'cmd': 'group-add-new-admin',
                'group': escape(gid),
                'id': escape(uid)
            });
            send.done(function(data) {

                data = validateJson(data);
                if (data.s != 'success') {
                    modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + data.msg + '</div>');
                    el.removeClass('__admin');

                }

            });


        }
    this.group_remove_member = function(e, el, user_id, group_id, shortcut_id) {

            evstop(e, 1);
            shortcut_id = __j('#mshortcut-GG' + group_id).length && !self.html.hasClass('messenger-window') ? 'mshortcut-GG' + group_id : 0;
            let $el = __j(el);
            let check_admin = jAjax(self.ajax_url, 'post', {
                'cmd': 'check-group-admin',
                'group': group_id
            });
            check_admin.done(function(admin) {


                if (!admin || admin <= 0)
                    return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_group_no_admin + '</div>');


                // function from WoWonder
                if (!user_id || !group_id) {
                    return false;
                }

                let remove_user = jAjax(self.ajax_url, 'post', {
                    'cmd': 'leave_group',
                    'group': escape(group_id),
                    'id': escape(user_id)
                });
                remove_user.done(function(data) {
                        removeAjaxLoad();
                        data = validateJson(data);

                        if (data.status == 200 && data.success == 0) {
                            $el.text(lang.Messenger_try_again);
                        } else if (data.status == 200 && data.success == 1) {

                            $el.closest('li').addClass('ms_user_request_sent');
                            $el.replaceWith('<a href="javascript:void(0);"><span>' + lang.Messenger_member_removed_from_group + '</span></a>');

                            setTimeout(function() {

                                __j('#vy_ms__group_member_rm_' + user_id + '_' + group_id).slideUp(function() {
                                    __j(this).remove()
                                });
                                self.groupNotification(user_id, group_id, 'admin-removed-user', _U.i);
                            }, 2500);


                            jAjax(self.ajax_url, 'post', {
                                'cmd': 'get-group-details',
                                'group': escape(group_id)
                            }).done(function(group_details) {



                                // throw out the member
                                self.socket.emit("vy_ms__group_remove_member", JSON.stringify({
                                    'Group_id': socketId('GG' + group_id),
                                    'Room_id': socketId(generateRoomId(0, user_id, 0, group_id)),
                                    'Group_clean_id': 'GG' + group_id,
                                    'Userid': socketId(user_id),
                                    'Userid_clean': user_id,
                                    'shortcut_id': shortcut_id,
                                    'User': _U,
                                    'Group_data': validateJson(group_details),
                                    'own_exit': 0,
                                    'next_conversation': 'yes'
                                }));

                            });


                        } else {
                            return false;
                        }
                    })
                    .fail(function() {
                        $el.text(lang.Messenger_try_again);
                    });

            });
        },
        this.group_invite_member = function(e, el, user_id, group_id) {

            evstop(e, 1);
            let $el = __j(el);

            let check_admin = jAjax(self.ajax_url, 'post', {
                'cmd': 'check-group-admin',
                'group': group_id
            });
            check_admin.done(function(admin) {


                if (!admin || admin <= 0)
                    return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_group_no_admin + '</div>');


                if (!user_id || !group_id) {
                    return false;
                }

                let invite_user = jAjax(self.ajax_url, 'post', {
                    'cmd': 'invite_to_group',
                    'group': escape(group_id),
                    'id': escape(user_id)
                });
                invite_user.done(function(data) {
                    removeAjaxLoad();
                    data = validateJson(data);

                    if (data.status == 200 && data.success == 0) {
                        $el.text(lang.Messenger_try_again);
                    } else if (data.status == 200 && data.success == 1) {

                        $el.closest('li').addClass('ms_user_request_sent');
                        $el.replaceWith('<a href="javascript:void(0);"><span>' + lang.Messenger_request_sent + '</span></a>');

                        setTimeout(function() {

                            __j('#vy_ms__group_member_' + user_id + '_' + group_id).slideUp(function() {
                                __j(this).remove()
                            });


                        }, 2500);

                        jAjax(self.ajax_url, 'post', {
                            'cmd': 'get-group-details',
                            'group': escape(group_id)
                        }).done(function(group_details) {
                            self.socket.emit("vy_ms__groupinvitation_sent", JSON.stringify({
                                "User": _U,
                                "Group_data": validateJson(group_details),
                                "Group_id": socketId('GG' + group_id),
                                "User_id": socketId(user_id),
                                "Group_clean_id": group_id,
                                "User_clean_id": user_id
                            }));
                             
                            self.send(false,e,'[group-invitation]'+_U.i+'|'+group_id+'[/group-invitation]',user_id,0,0,1,1);
                        });


                    } else {
                        return false;
                    }
                }).fail(function() {
                    $el.text(lang.Messenger_try_again);
                });
            });
        },
        this.filterGroupMembers = function(evt, el) {

            var input, filter, ul, li, a, i, txtValue;
            input = el;
            filter = input.value.toUpperCase();
            ul = __j("#vy_ms__groupchat_all_members__id");
            if (!ul.length) return;
            li = ul[0].getElementsByTagName("li");
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("username")[0];
                txtValue = a.textContent || a.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        },
        this.filterNewResultMembs = function(evt, el) {

            var input, filter, ul, li, a, i, txtValue;
            input = el;
            filter = input.value.toUpperCase();
            ul = __j("#vy_ms__groupchat_new_members__id");
            if (!ul.length) return;
            li = ul[0].getElementsByTagName("li");
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("username")[0];
                txtValue = a.textContent || a.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        },

        this.group_members_e = function(el, ev, user_id, group_id, action) {

            evstop(ev, 1);
            el = __j(el);
            let r_class = '__remove';


            let admin_checked = __j('#vy_ms_newadmin').is(":checked");

            if (admin_checked) return self.GroupAddNewAdmin(el, user_id, group_id);


            el.parent().find('.' + r_class).each(function() {
                __j(this).removeClass(r_class);
            });
            if (!el.hasClass(r_class)) {

                el.addClass(r_class);
                el.find('a').on(self.crossEvent(), function() {
                    let $this = __j(this);
                    setTimeout(function() {
                        $this.find('span').removeClass('__none');
                    }, 200);
                });

            } else {

                el.removeClass(r_class);
                el.find('a').on(self.crossEvent(), function() {
                    let $this = __j(this);
                    setTimeout(function() {
                        $this.find('span').addClass('__none');
                    }, 200);
                });
            }



        },
        this.manageGroupMembersTabs = function(a, $el) {

            let subscr_tab = __j('.js__vy_ms__group_subscribed_members');
            let new_tab = __j('.js__vy_ms__group_invitenew_members');
            let s = 'vy_ms__group_members_active_tab';

            __j('.' + s).removeClass(s);
            $el.addClass(s);

            if (a == '1') {

                // hide new members content
                new_tab.hide();
                // show subscribed members content
                subscr_tab.show();

            } else {

                // hide subscribed members content
                subscr_tab.hide();
                // show new members content
                new_tab.show();

            }


        },
        this.group_admin_show_subscribed_membs = function(e, group_id) {
            evstop(e, 1);
            let $el = __j(e.target);
            self.manageGroupMembersTabs('1', $el);
        },
        this.group_admin_invite_new_membs = function(e, group_id) {

            evstop(e, 1);
            var $el = __j(e.target);

            self.manageGroupMembersTabs('2', $el);
            let cnt = __j('.js__vy_ms__globalpopup_content_invitenew');
            let send = jAjax(self.ajax_url, 'post', {
                'cmd': 'get-my-contacts',
                'group': escape(group_id),
                'filter': 'filter-groups'
            });
            send.done(function(data) {

                let d = validateJson(data);
                let members = '';
                if (d.msg == "done") {

                    for (var i = 0; i < d.users.length; i++) {

                        let member = d.users[i];

                        members += self.group_member_markup(member, group_id, 'add');

                    }

                    cnt.html('<ul id="vy_ms__groupchat_new_members__id">' + members + '</ul>');

                } else {

                    cnt.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');

                }


            });

        },
        this.ManageGroupMembers = async function(evt, group_id) {

                evstop(evt, 1);

                await self.globalPopup('manage-group-members', {
                    'group': group_id,
                    'action': 'manage-group-members'
                }).then(function(cnt) {

                    let send = jAjax(self.ajax_url, 'post', {
                        'cmd': 'get-group-members',
                        'group': escape(group_id)
                    });
                    send.done(function(data) {

                        let d = validateJson(data);
                        let members = '';
                        if (d.msg == "done") {

                            for (var i = 0; i < d.users.length; i++) {

                                let member = d.users[i];

                                members += self.group_member_markup(member, group_id);

                            }

                            cnt.html('<ul id="vy_ms__groupchat_all_members__id">' + members + '</ul>');

                        } else {

                            cnt.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');

                        }


                    });


                });



            },
            this.close_global_popup = function() {
                self.body.find(self.global_popup).find('.js__vy_ms__gloalpopup_f54').removeClass('show').on(self.crossEvent(), function() {
                    self.body.find(self.global_popup).remove();
                });
                __j(window).off('scroll.globalpopup_loadmore');
            },
            this.globalPopup = async function(type, arg) {

                    self.body = __j('body');
                    self.close_global_popup();
                    let global_popup = self.global_popup;
                    let post_data = {};
                    post_data['cmd'] = 'global-popup';
                    post_data['type'] = type;

                    if (typeof arg == 'object' && Object.keys(arg).length)
                        for (var b in arg)
                            post_data[b] = arg[b];


                    let send = await jAjax(self.ajax_url, 'post', post_data).done(function(markup) {

                        if (!self.body.find(global_popup).length) {
                            self.body.prepend(markup);


                            setTimeout(function() {
                                self.body.find('.js__vy_ms__gloalpopup_f54').addClass('show');
                            }, 100);

                            self.body.find('.js__vy_ms__globalpopup_close').off('click.closeGlobalPopup').on('click.closeGlobalPopup', function(e) {
                                evstop(e, 1);
                                self.close_global_popup();
                            });


                        }

                    });

                    return self.body.find('.js__vy_ms__globalpopup_content');

                },
                this.shareContentUserMarkup = function() {

                    return '<a userfullname="%name" href="/messenger/%url" onclick="evstop(event,1);messenger.close_global_popup();messenger.prependContact(this,event,\'%avatar\',\'%name\',\'%id\',\'\',0,\'\',0,0,\'%page_id\',\'%group_id\');" id="gbpopup_contact-%element_id" class="vy_mess-pcontact %isgroup">\
            <div class="vy_mess-pcontact_avatar"><img src="%avatar" /><div id="f_onl_gtm" class="only_ic global_user_online global_user_online_%id">%online</div></div>\
            <div class="vy_mess-pcontact_details">\
            <div class="vy_mess-pcontact_name">%name</div>\
            </div>\
            </a>';

                },
                this.composeNewMessage = async function(e) {

                        evstop(e, 1);


                        let u_markup = self.shareContentUserMarkup();
                        await self.globalPopup('compose-new-message').then(function(cnt) {


                            let send = jAjax(self.ajax_url, 'post', {
                                'cmd': 'get-allmy-contacts',
                                'limit': 40
                            });
                            send.done(function(data) {

                                let d = validateJson(data);
                                let members = '';


                                if (d.msg == "done") {

                                    for (var i = 0; i < d.users.length; i++) {

                                        let m = d.users[i];

                                        members += u_markup.replace(/%group_id/g, m.group_id).replace(/%page_id/g, m.page_id).replace(/%isgroup/g, m.group_id > 0 ? 'vy_ms_contactisgroup contact_groupid_' + m.group_id : '').replace(/%element_id/g, m.group_id > 0 ? 'GG' + m.group_id : (m.page_id > 0 ? m.user_id + '_' + m.page_id : m.user_id)).replace(/%url/g, m.page_id > 0 ? m.user_id + '/' + m.page_id : (m.group_id > 0 ? 'g/' + m.group_id : m.user_id)).replace(/%avatar/g, m.avatar).replace(/%name/g, m.fullname).replace(/%id/g, m.user_id).replace(/%online/g, m.online_status ? '<i class="ic-online"></i>' : '');

                                    }

                                    cnt.html('<div id="vy_ms__allmycontacts">' + members + '</div>');

                                } else {

                                    cnt.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');

                                }


                            });


                        });


                    },
   
                    this.shareContentSearchContact = function(e, el) {

                        evstop(e, 1);
                        el = __j(el);

                        let u_markup = self.shareContentUserMarkup();
                        let s_cnt = "#vy_ms__allmycontacts_searchres";
                        let all_contacts = __j('#vy_ms__allmycontacts');
                        let key = $.trim(el.val());

                        if (key && key.length >= 2) {

                            all_contacts.hide();
                            let cnt = __j(s_cnt);

                            if (!cnt.length) {

                                all_contacts.before('<div id="vy_ms__allmycontacts_searchres"><div class="div-loader"></div></div>');
                                cnt = all_contacts.parent().find(s_cnt);

                            }

                            let send = jAjax(self.ajax_url, 'post', {
                                'cmd': 'search-in-all-contacts',
                                'key': escape(key)
                            });
                            send.done(function(data) {

                                let d = validateJson(data);
                                let contacts = '';


                                if (d.msg == "done") {

                                    for (var i = 0; i < d.users.length; i++) {

                                        let m = d.users[i];

                                        contacts += u_markup.replace(/%group_id/g, m.group_id).replace(/%page_id/g, m.page_id).replace(/%isgroup/g, m.group_id > 0 ? 'vy_ms_contactisgroup contact_groupid_' + m.group_id : '').replace(/%element_id/g, m.group_id > 0 ? 'GG' + m.group_id : (m.page_id > 0 ? m.user_id + '_' + m.page_id : m.user_id)).replace(/%url/g, m.page_id > 0 ? m.user_id + '/' + m.page_id : (m.group_id > 0 ? 'g/' + m.group_id : m.user_id)).replace(/%avatar/g, m.avatar).replace(/%name/g, m.fullname).replace(/%id/g, m.user_id).replace(/%online/g, m.online_status ? '<i class="ic-online"></i>' : '');

                                    }

                                    cnt.html(contacts);

                                } else {

                                    cnt.html('<div class="vy_ms__nogroupmembers">' + d.msg + '</div>');

                                }



                            });

                        } else {
                            __j(s_cnt).remove();
                            all_contacts.show();
                        }

                    },
                    this.accept_group_invitation = function(el,e,group_id){
                        evstop(e,1);
                        el = __j(el);
                        var send = jAjax(self.ajax_url,'post',{'cmd':'accept-group-invitation','id':escape(_U.i),'group':escape(group_id)});
                        send.done(function(d){ 
                            d = validateJson(d);
                            
                            let $msg_id = tonum(el.closest('.pmessenger-message-txt').attr('id'));
                            let $msg_unsettled_id = tonum(el.closest('.pmessenger-message-txt').attr('data-unsettled-msg-id'));
                            if(d.success == '1') {
                                
                                self._join_group(group_id);
                                
                                el.parent().html('<div class="vy-ms-group_success_joined">'+lang.Messenger_you_have_successed_joined+'</div>');

                                self.deleteMessageById($msg_unsettled_id,$msg_id);
                                
                                
                            } else if(d.success == '0' && d.msg == 'you_already_declined_this_invitation'){

                                self.deleteMessageById($msg_unsettled_id,$msg_id);

                            } else return displayErr(lang.Messenger_error_accepting_group_invitation);
                            
                            
                        });
                    },
                    this.decline_group_invitation = function(el,e,group_id){
                        evstop(e,1);
                        el = __j(el);
                        var send = jAjax(self.ajax_url,'post',{'cmd':'ignore-group-invitation','id':escape(_U.i),'group':escape(group_id)});
                        send.done(function(d){
                             
                            d = validateJson(d);
                            if(d.success == '1') {
                                let $msg_id = tonum(el.closest('.pmessenger-message-txt').attr('id'));
                                let $msg_unsettled_id = tonum(el.closest('.pmessenger-message-txt').attr('data-unsettled-msg-id'));
                                self._exit_group(group_id,1);
                                
                                el.parent().html('<div class="vy-ms-group_success_joined">'+lang.Messenger_you_have_successed_ignored_this_group+'</div>');
 
                            setTimeout(function(){self.deleteMessageById($msg_unsettled_id,$msg_id);},2500);
                                
                            } else return displayErr(lang.Messenger_error_deleting_group_invitation);
                            
                            
                        });
                    },
                    this.deleteMessageById = function(un_id,id,group_id,page_id){
                            group_id = group_id || 0;
                            page_id = page_id || 0;
                            var send = jAjax(self.ajax_url,'post',{'cmd':'delete','action':'everyone','msg_unsettled_id':escape(un_id),'direct':1,'id':escape(id)});
                            send.done(function(data){
                             
                                if(data == '1') {
                                    __j('#msg_'+id).slideUp(function(){__j(this).remove()});
                                    
                                            let cache_delete_obj = {
                                                'msg_id': id,
                                                'group_id': group_id,
                                                'page_id': page_id
                                            };
                                             
                                            self.deleteMessageFromCacheConversation(cache_delete_obj);
                                    
                                    
                                }else return displayErr(lang.somethingWrong);
                                
                            });
        
                        
                    },
                    this._exit_group = function(group_id,own_exit) {
                        own_exit = own_exit || false;
                        self.socket.emit("vy_ms__group_remove_member", JSON.stringify({
                                        'Group_id': socketId('GG' + group_id),
                                        'Room_id': socketId(generateRoomId(0, _U.i, 0, group_id)),
                                        'Group_clean_id': 'GG' + group_id,
                                        'Userid': socketId(_U.i),
                                        'Userid_clean': _U.i,
                                        'shortcut_id': false,
                                        'own_exit': own_exit,
                                        'next_conversation': self.hasTouchStartEvent ? 'no' : 'yes'
                        }));
                    },
                    this._join_group = function(groupid) {
                        self.socket.emit("vy_ms__joingroup", JSON.stringify({
                            'Room_id': socketId(generateRoomId(0, _U.i, 0, groupid)),
                            'Group_id_clean': groupid,
                            'Userid_clean': _U.i,
                            'Userid': socketId(_U.i)
                        }));
                    },
                    this.groupChatCreate_FindParticipants = function(e,el){
                        
                        evstop(e,1);
                        el = __j(el);
                        let form_participants = __j('#vy-ms__newgchat_participatns_ids');
                        
                        let key = el.val(), append_users = __j('#vy-ms__sel_participants_tags'), u_markup = '<div id="vy_ms__ff5a93io3" class="vy_ms__groupchat_participatns_container_dropdown"></div>',users = '', cntediable = __j('#vy_ms__chat_group_users');
                         
                        if(!$.trim(key)) return cntediable.parent().find('#vy_ms__ff5a93io3').remove();;
                        
                        var send = jAjax(self.ajax_url,'post',{'cmd':'group-chat-search-participants','filter':JSON.stringify(self.newgchat_sel_users),'key':escape(key)});
                        send.done(function(data){  
                            data = validateJson(data);

                            if(data.length){
                            for(var i = 0; i < data.length;i++){
                                let u = data[i];
                                users += '<div data-ud=\'{"id":"'+u.id+'","fullname":"'+u.fullname+'"}\' class="vy_ms_participants_groupchat"><div class="vy_ms_particip_groupchat_left"><img src="'+u.avatar+'" /></div>\
                                            <div class="vy_ms_particip_groupchat_right">\
                                            <div class="vy_ms_particip_groupchat_uname">'+u.fullname+'</div>\
                                            <div class="vy_ms_particip_groupchat_ulastseen">'+u.last_seen+'</div>\
                                            </div></div>';


                            }                               
                            
                            if(!cntediable.parent().find('#vy_ms__ff5a93io3').length){
                                
                                cntediable.after(u_markup).parent().find('#vy_ms__ff5a93io3').html(users);
                                
                            } else cntediable.parent().find('#vy_ms__ff5a93io3').html(users);
                            
                            
                            cntediable.parent().find('#vy_ms__ff5a93io3 .vy_ms_participants_groupchat').each(function(){
                                
                                __j(this).on('click',function(e){
                                    const u_data = __j(this).data('ud');
                                    const index1 = self.newgchat_sel_users.indexOf(u_data.id);
                                    
                                    if(index1 > -1) return;
                                    
                                    
                                    append_users.append('<span class="vy_ms__newgchat_sel_users" vy-ms-userid="'+u_data.id+'" id="vy_ms__newgchat_uid_'+u_data.id+'">'+u_data.fullname+'&nbsp;<i class="d_comment_act d_comment_act_del d_comment_act_spam ic10 ic10_close-g"></i></span>').find('#vy_ms__newgchat_uid_'+u_data.id).on('click',function(e){
                                        const index2 = self.newgchat_sel_users.indexOf(__j(this).attr('vy-ms-userid'));
                                        self.newgchat_sel_users.splice(index2,1);
                                        
                                        __j(this).remove();
                                        
                                        
                                    });
                                    
                                    __j(this).remove();
                                
                                    self.newgchat_sel_users.push(u_data.id);
                                    
                                    form_participants.val(self.newgchat_sel_users.join(','));
                                });
                                
                            });
                            
                            
                            } else cntediable.parent().find('#vy_ms__ff5a93io3').remove();
                            
                        });
                        
                    },
                    this.editGroupChat = function(el,ev,group_id){
                        
                        var send = jAjax(self.ajax_url,'post',{'cmd':'get-group-details','group':escape(group_id)});
                        send.done(function(data){
                            data = validateJson(data);
                            if(data.admin == '1')
                                self.editGroupData(data,group_id);
                            else 
                            $.alert('Not authorized.');
                        });
                        
                    },
                    this._init = function(){
 
                            __j(window).off('popstate.vy_messenger').on('popstate.vy_messenger', function(e) {
                                                        self.noNewUrl = true;
                                                        const _history_contact = __j('[href="' + window.location.pathname + '"]');
                                                        
                                                        if(self.hasTouchStartEvent){
                                                             
                                                            return messenger.show_contacts();
                                                        }
                                                        if (_history_contact.length) {
                                                            _history_contact.trigger('click');
                                                        } else window.location = _url;


                            }); 
                            
                            if(!__j('body').find('.seen_stories_users_ids').length){
                                
                                __j('html').addClass('vy_ms__isstandalone');
                                __j('._fwowondxv2').hide();
                                __j('.js__vy_ms_topavatar_standalone_logout').show();
                            }
                             
                            if(self.hasTouchStartEvent) {
                            setInterval(function(){ 
                                window.oncontextmenu = function(e) {
                                var unicode = e.charCode ? e.charCode : e.keyCode;
                                if (document.activeElement.nodeName !== 'TEXTAREA' && document.activeElement.nodeName !== 'INPUT' && document.activeElement.isContentEditable === false) {
                                    evstop(e,1);
                                 return false;
                                } else if (document.activeElement.nodeName !== 'TEXTAREA' && document.activeElement.nodeName !== 'INPUT' && document.activeElement.isContentEditable === false) {
                                    evstop(e,1);
                                   return false;
                                } 
                                     
                                     
                                }; 
                                
                            },5000);
                               
                            } 
                             
 
                            self.lazyLoad();
                    },
                    this.lazyLoad = function(){
                        
                        let elementInViewport = function(el) {
                                var rect = el.getBoundingClientRect()

                                return (
                                   rect.top    >= 0
                                && rect.left   >= 0
                                && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
                                )
                        }
 
 
                            let nano = self.shortcut_id ? __j('#'+self.shortcut_id).find('#messenger-shortcut-messages-tr .nano-content') : self.pmessenger.find("#messages-tick .nano-content");
                            nano.off('scroll.X'+self.rand_id).on('scroll.X'+self.rand_id,function(e){
                                
 
                                  
                                __j('img.vy_ms_img_lzyload').each(function(){
                                    let t = __j(this),
                                    img = new Image()
                                  , src = t.data('src');
                                    
                                    if(elementInViewport(t[0]) && !t.hasClass('vy_ms_img_lzyload2')){
                                         
                                            
                                         
                                        img.onload = function() {
                                         
                                        t.attr('src',t.data('src')).addClass('vy_ms_img_lzyload2');
                                         
                                    }
                                    img.src = src;
                                    
                                };
                                
                                
                            });
                            });
 
                            
                            self.timeouts['lazyload_interval'] = setTimeout(self.lazyLoad,4000);
                             
                    },
                    this.standAloneSwitchAccountDropDown = function(el,e){
                         
                        el = __j(el);
                        let elm = __j('.js__vy_ms_standalone_logout');
                        
                        if(elm.hasClass('__none')){
                            
                            elm.removeClass('__none');
                        } else {
                            elm.addClass('__none');
                        }
                        
                    },
                    this.editGroupData = function(group_data,group_id){
                        
                                    $.confirm({
                                        title: lang.Messenger_create_group_chat_popup_title,
                                        content: '' +
                                        '<form action="" enctype="multipart/form-data" id="vy-ms-create-new-groupchat" class="vy-ms-create-new-groupchat">' +
                                        '<input type="hidden" name="type" value="edit" />'+
                                        '<input type="hidden" name="group" value="'+group_id+'" />'+
                                        '<input type="hidden" name="cmd" value="edit-group-chat" />'+
                                        '<div class="vy_ms__groupchat_create___form-group">' +
                                        '<label>'+lang.Messenger_group_chat_name+'</label>' +
                                        '<input type="text" value="'+group_data.group_name+'" name="group_name" placeholder="e.g. My colleagues" class="vy-ms-gname vy_ms__groupchat_create___form-control" required />' +
                                        '</div>' +
                                        
                                        '<div class="vy_ms__groupchat_create___form-group">' +
                                        '<label>'+lang.Messenger_group_chat_avatar+'</label>' +
                                        '<div ontouchend="__j(\'#vy-ms-create-group-chat-trigger-avatar-upload\').trigger(\'click\');" onclick="__j(\'#vy-ms-create-group-chat-trigger-avatar-upload\').trigger(\'click\');" class="vy_ms_fcov_img_holder_groupchat"><img id="vy_ms_fcov_img_holder_groupchat" src="'+group_data.group_avatar+'"></div>'+
                                        '<input type="file" id="vy-ms-create-group-chat-trigger-avatar-upload" style="display:none;" onchange="__j(\'#vy_ms_fcov_img_holder_groupchat\').attr(\'src\',window.URL.createObjectURL(this.files[0]));" class="name form-control" name="avatar" accept="image/jpeg,image/png,image/gif" />' +
                                        '</div>' +
                                        
                                        
                                        '</form>',
                                        buttons: {
                                            formSubmit: {
                                                text: 'Update',
                                                btnClass: 'btn-blue',
                                                action: function () {
                                                    var g_name = this.$content.find('.vy-ms-gname').val();

                                                    if(!$.trim(g_name)){
                                                        $.alert(lang.Messenger_missin_group_name_edit);
                                                        return false;
                                                    }
                                                    
                                                    if(g_name.length < 4 || g_name.length > 15){
                                                        $.alert('Group name must be at least 4 chars and not exceed 15 chars.');
                                                        return false;
                                                    }

                                                    ajaxLoading(); 
                                                    
                                                    $.ajax({
                                                            url: self.ajax_url,
                                                            type: 'post',
                                                            data: new FormData( __j('#vy-ms-create-new-groupchat')[0] ),
                                                            processData: false,
                                                            contentType: false,
                                                            success: function(data) { 
                                                                removeAjaxLoad();
                                                                data = validateJson(data);
                                                                if(data.success == '1'){

                                                                    $.alert('Success! Group updated, please wait...');
                                                                    ajaxLoading();
                                                                    setTimeout(function(){window.location = '/messenger/g/'+data.group_id;},500);
                                                                } else {
                                                                    $.alert(data.msg);
                                                                    return false;
                                                                }                                                                   
                                                                      
                                                             }
                                                    });
 
                                                    
                                                    
                                                    
                                                }
                                            },
                                            cancel: function () {
                                                 
                                                self.newgchat_sel_users = new Array();
                                            },
                                        },
                                        onContentReady: function () {
                                            // bind to events
                                            var jc = this;
                                            this.$content.find('form').on('submit', function (e) {
                                                // if the user submits the form by pressing enter in the field.
                                                e.preventDefault();
                                                jc.$$formSubmit.trigger('click'); // reference the button and click it
                                            });
                                        }
                                    });
                        
                    },
                    this.createGroupChat = function(){
                        
                                    $.confirm({
                                        title: lang.Messenger_create_group_chat_popup_title,
                                        content: '' +
                                        '<form action="" enctype="multipart/form-data" id="vy-ms-create-new-groupchat" class="vy-ms-create-new-groupchat">' +
                                        '<input type="hidden" name="type" value="create" />'+
                                        '<input type="hidden" name="cmd" value="create-group-chat" />'+
                                        '<div class="vy_ms__groupchat_create___form-group">' +
                                        '<label>'+lang.Messenger_group_chat_name+'</label>' +
                                        '<input type="text" name="group_name" placeholder="e.g. My colleagues" class="vy-ms-gname vy_ms__groupchat_create___form-control" required />' +
                                        '</div>' +
                                        
                                        '<div class="vy_ms__groupchat_create___form-group">' +
                                        '<label>'+lang.Messenger_group_chat_members+'</label>' +
                                        '<div id="vy-ms__sel_participants_tags"></div><input type="hidden" class="vy-ms-gparts" id="vy-ms__newgchat_participatns_ids" name="parts" /><input type="text" onkeydown="clearTimeout(this.timeout_findparticipants);" onkeypress="clearTimeout(this.timeout_findparticipants);" onkeyup="var that = this;clearTimeout(that.timeout_findparticipants); this.timeout_findparticipants = setTimeout(function(){ messenger.groupChatCreate_FindParticipants(event,that); },200);" id="vy_ms__chat_group_users" placeholder="'+lang.Messenger_group_chat_members_placeholder+'" class="vy_ms__groupchat_create___form-control" />' +
                                        '</div>' +
                                        
                                        '<div class="vy_ms__groupchat_create___form-group">' +
                                        '<label>'+lang.Messenger_group_chat_avatar+'</label>' +
                                        '<div ontouchend="__j(\'#vy-ms-create-group-chat-trigger-avatar-upload\').trigger(\'click\');" onclick="__j(\'#vy-ms-create-group-chat-trigger-avatar-upload\').trigger(\'click\');" class="vy_ms_fcov_img_holder_groupchat"><img id="vy_ms_fcov_img_holder_groupchat" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAADBCAMAAAAAXiTgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURQAAAAAAAKVnuc8AAAACdFJOUwAKlkYkJgAAHnhJREFUeNrtnYtyLCmuRbX//6fv3BnbxUNviSzsUzkR09FtO2vXEhIgQBAB9N/n+5/Tv339/3/+DfPPf36N/++J5//fs77qRxqj7fv/Qbw2dGpb8dDvwMb815e049ggY4OK7QmLwmlR/T9jbKGMOL9kx2/tptb9Y/jpI9JgG3ow8Q3YFItehQ3t2BzSwEvb/Yag0MT4wl10BKf9m6upv74COG2YtD0jDXMAegAbStiYRvMOi2L+G8mijLaT0tY+BAI2UczXwGL7PaRGCv8LV9avz6b+359I/jFK5myd0OY39bcsvhFOX4L5Cs3YIGAjHhv1YAtYdMUm+McBi1rYXBbl3vTjS9tAa/WQ2EjZUj2aGkIA/UaHbRS2aIuNlF3SMEkQsU2jGTawvAHb9Hs3Y6MObB4fGTxEk8a95ZvkPjiUpp32iO/VkSpvWEwoSt5H2qz/u8fSXmmYxnjc5LgXG7mwgcEmqF8nAVlpjdh+3sRbtIINJrYl4QN2oiX6xzil20wWljwYR1b945rs/JyJNLNGJLWNbVl6x9LGnsNGHdhIxJaSNn0lWxrEtMaIjWj13rPYvj1EtSg/LdnCxNyFlxxEVz01c8mlZ8NO/WRO2qZNkSYZmsBFVznj2YkNCzaKYUMaG5WxzdIasKEZm0pzyzmkaO6tUFE9NHNYll7zEHlLExzJIzXa7NKq2LiP8mFT8p692PacDdR5SMyiVLOoE1vYP4ZcBziPkRg4UubwJDGxdbV8M6AtNyhJQxCnqE2TtjbCDRufr0cTNmzjOn5qB79FYUZpAVujRQvY0IKNQA6/wRBnpReRPlGTBnnSrE1uhMpKp6zNlObTBhg0IbXwB7FRGBsJ3u7B5lmE0CwqY8ObsYmzqunL7LsAvJHO1QpZouxq0v5lmA0KYlivSENIGriJooZNnt1q2iBio1+JjfFLfkhgY9NS1pw0A5vVH07LN/oA15ZMYjoB+5CRZLvtbq/T9GiTpphOaRAjUh2bJs3WBg2bIe2fwRbzjzkcjl+Cb7ZfA1bL5fRwCbDRU1wXYHK8rDRtkOWRRkFpm63FkcIl2BSLUps0imKT/eN7w4rV7+rayMCmzNC3fwD6fG5ZplVd0efUjszJbGtZGvzSXLFQz8hK2MRZsJzf8mKjG7HBqY0ZNRnYSMfWbFF7hmN2xz/7HckjmYRNmp58HuQ5n53vcFha0OZZflSw4c3YmAGWlfgb9kXBjNL89MppUegWVbNrFYsGsIm5SmZXgsQrIpmkHWgRyWCmxEhoU6VRizQl1hUsncXmShMNcQXvw0YnsRU7ED4jA+Wv4OmU2DEzrBmANogZtEkfriYslb3J0JNIDdhgNEJo0v4CNnnu4cKWkYaURV05BW0jh9prbWFi2sNH/ka4eqOZ7xh/285WzjsgQ9oMbHoqKIgNt2GjGVtEGsTkmraGHrQoaha1khNWmuj1Da2MIKDuLXZL5leDoWbsYTbsRRqlpS3N0MZGbmx89jSNzZT2BmyOaGxYFIK0nO9qvgn/ljboSdI9cvFLLJ7uWOqcVfc0pXHaopZmpam7iTRpKrawNEj/pkkjv0V/tIWidM6iZFuUWi3KvX0fHOqSVX9X0kBxB2Gz0MbGA+Osgi0NEWlT+1E3GFthUtse68MmDGJsi2rYTlkUywxEk/YINvAVB5icud0I9Z+pwSBkaWkKrC7y6dq8SWU7+8zs5bgdW0Ya6YeQwtJ2bKhhq1sUwpx/zwT6NubbOK2ssosmxM4kKU0/TROxtIaN2rGhhK3LovAkBfSwwo8LjMMBz2JTEoKYR4qALx6EVEuS9/w1Sc3QPCblkQY/Tr0khzcz/hA2Zuyn7jvtw8bUJOnBhqexkZSCWROCaUMrsuW9+3zU8K+4uvM88rkUF81BWhQb3Ngoj01IP9vY6Cls+5DrzRblUuJspJ62wjaUtGMPWPCSCcL6LNhk5RlprDYwx3UEbGjBhio2ErAdtagDG57ARi3YLNE9jZCVzS+WQdAWTAgWifKMIJzE4ZPR/y62LXqLrW3tS7qkMdgojE3qwRDojkuqIQ1Y+UNC62/3NcI9WPP7A6TTT+w6wBuwkQtbp7RFm1Epx2XRQ9iEuKJZlBw8WxvhqpovgKlsVCbvQnWDNiHcuLE9K83GRvdje480z6ZltVeWDlY2yEaAJnlL1rRJYzIc0GePsLF1GLuGjQ5ji0nbsJ2TFtMG48SVlkdNFvUSZTtpzlv3+Ebo3dHsGWxFLD2PW5UDox9sz2NDEpudSxNoWi+opWisRLfWO7q3NCezR/BJO4gNSWz0Rmxei0LeA9WFLWRRWzT7BozZu7qPBCWro5jXMALt2hw0oR1m9S4zJ7F5pWmNED1J87hFr8VmfE++EZ6aUHldGhAPJo/78eg92sjARm/GRhdiUzZ3ohrrq9hU0fKSJPRN0WclA1DW5oEj0pzhRpJ2BzbNojgkDWVs3lO8Zyzq6ER4a5xwajg7eUUa4ViYdl8MxSY27sa2lIjv9RAvNojYjvRugYF4pDWlLF1orkFpYQepSItjw0PYkMVGfwFbt7TQRSrT/Q3uD0XFzb3aEB5Ml7SF7iTB3BivwnavReNTtwZtYtfrvVwyIlmtseT/wrEbTp2MYJVp9vz9KWk1bDiHrZx3vR0bu9HxtY/DXcMNIZpZzRgOsfsLCT4i7aXNZW1EGmF1IAO6HBuFsSGCrZSZ2h3hZ8+vz9rw0WyZJmMcHNv+y1yaelbb62D8ddgQxfaUtO96tSGLPo1tvXj3O8Hhyqi5SnI27Vp+Va1ySkOoHk4pd7Tun7wSm2urxjuleZr+G7Rxw/yv8kbwrohFJCO7pj9p8yQ0Exd3FWdH3zlK52JdCFtxLH0xtp/W1iEN7dK4SkGji9RhdWgeZoQ/F2DnhmmHcA69VhKbdTz1bdKewtZj0W5sWK7Vm26+ppzk5e9aBoXDNcGoNMKl8F9Pf/xK2gK5gzOHsb2G+Tlsy3fqtqi4PPgubDRjG93l+ycApX3a6HuQwjnMP0BUsPQBadt88zZs315cCXkHLYqkNI+2tEUJa8+O/Sr6Hsn1Xm+IfvAO4h+SNrpGWhpx10z1YFsseg+2FovuIU+/lsE9RecS8d/pK7CjkdDL5V4vOV597dr1Zg+clkZVGg1zX3DFMQLf7x/C9rNhMrK+4epA2rC9PmGSPHh15v52w7XSjXBpejlpavMFCtIWkJl58BFsy+A+aVFNAmqNEFMf3IEN/diGt43LMTlDKzPB2kbF8bAAMrlIKNPUwm5AGreIV6RJI5fy7py6Nsl3OyxKSI6wjlkUsyOsk3TyrgjLFhFKnJWnTXNziluEhMpw5XPOIzbqklY/M9JkUQlbq0Vvxrb/CLl2A2EtuWf5f9y40yatKWU5bsVCySDnsNHV2HAVNsiVR4ctHSmfzraSQLROOcj058ek5Rph3u//CLastOPYSKw/lJacTdl53b+orVLI67A0OigtuxTXgA2/GJsmDYWMR2HrEBD6nIS2grQz2i7G1iPtn8PmGbslUaL/DHldGp2WRkgXbMPJAdDl2OrSzmGrOybnHUeKLBS1jXs68W9iQw0bLsVGp7W14h/2rV0nbdjAeSM2XI+NPtjKKIclo+ukXYfzd2Cjy7BhqRrcIA3PyJ1JBopWHLcy5gbo/FC8owGGah88gS3aCoF3hJSecvHbc4ikv0TKWCahVRotfkvT8MpdG5DOYqO9Ad6BjW+ANWkHsIV6N/Uq36kpf+/2q6nGeplJePM0Vm2vzYw1bYy04CItHsHGpQwQxPa1YfUQNipi65ZWx8a8ec9ejBsPUIoz2v4sz8oS7ceFUav/vaVd1GuhI9KoKs2JzfESki1KJWm/FptzGdP80avIe5ommz9g73T09cgzR8i3c8e0KTjdC0vz+vMJbNSOLbdUt2NDHtsirQsb6dgKEzfQfEmNHiZ8AWzthsGO3x2a57uMRxQ5Q++1/5PS5uo/7diYFpPCNh4KKkjbWfVgm2ZXWYuu3wxC/1IYwNHYal53XiQO9hhLbcHB5ryTE+OJ8ET+xmgiQZTzJtPpsPoF2GaLwpqr2tioBxvC2GBhQxc2PRszhFVrYzJylgZiFTemb/dziY5RVyyJM+G4q6UPYwOlsZGJDTlsaMBmrsM/h43/AKxHgWxkCZxxV16lwXW1HuI4kddGEWz6R7DYstKIw4YLsKEdG3Vi45MKXB7BABbCmctz/9wxvO3ENgxtS0O+U3tho2uxiRZFlzQqWhRtFt3jSgrbvtfydTyaG/6ZmmycBZJTwVRGmhFQTJxlaY9hS42VEcdm7XftsSj49Areim226G5L5sCh+BEQr5/mcSZnSMtyD9ai2xVtY+xC/mwCDmBDHVvYopM2egDbFkfQjY1K2Ji+CZhHrFZv59jaPGxbyeYNBi2YVl/1PtKHs6JtkHY1NrixBaWhz6JubGY4rmPjXoC5WrnnQ6Y1HnXhsSXxvO4QC0iDI2dXlAa/tIew4RQ2/HVsQje7bVN0RgILaFe5iVC836YX90jzYcM/hg1hacewmYLce5XXoS0df/yVYh6X5q8TKGw9Oi3tj2Gjtz2BckWolLdM0gzeefukof3bKx6Wdju2O6VpHUzE/Z80dGiZ9lGYGWlPaqMPtrDr1k+lFDdN95jU8F3CGwPIs9jwxy36NDaUXRHmZsF0IqFHWn+1xz5tH2wZ/3gaW1HzmZqjHbVZfCsh2ShWtvQBad3Y/hGLGtcno6HEeStOAKheAPB6T2sFs/GE6b3Y6tKux/aktIY1lZbx5aQYdW04q+1qbHQTNvwSbGccpHEGxvTEbdr6Rwl/VVpLte8/ha3NGb1dWWCE3xYnWlI/E8cHsdGvxrZIw1UWxek5SKhzjG4neFAaRaXRY+t7H2xvlvbU/hBft/24pX07SffA/MGWkUaPhZU+bA/SJMB1IOxRS/sHgfMupQ+234Gt6iCPSR7PBDoPQz+gbdwPTvY51McbIX4DNvwNbG8cYdGyLmbu53+0c/uqxemUhmcb4VJlwYENH2w7NsphO3p7EusgnjxDX2Vlr6XnxVnPcZwPthUbXNjoVmxKGaOnh1jkOSKDZ6Vhr6NsaHvI0tNG9euwRSxK77LoRdg806b9H+99ljVJ5ZrsS7DhDmz3W3ReesHVd0oJGC9qhetl5zeZ+mps9MEmzXIiHwiuoGnHLFyShqg0rEOHnqtlOrHReWx1i16ADTy2Mw4iT/z8o7b1FUMeDke0xaVBmbO3Y0vZeaz/husseg822aLtGYLlkh5kp1xbphxDQcweaUhaelv7GC8uKGKjJmyrtEuw7Q5yWloNW6+DjLe7STuM3VdTbNnoV7Gw/AUpQ7gq4GSKwlZC4YYNrdgqPUgvNsGiKFv0Nmyy1nWFUcAZrwGVnoNw2jBcEtIijVJzEAUbZVuhgq0u7Qw2atAGHhtiO64naQVsnNJ1OUfv9aL3WGFJUMcorjb9yTwlce6FjkPbsrVbWavYUMMGG1uLg9Qtun3RUlxhLYqsNG5ksLbqYezRYWkppgVmbXshLs5BKHMHXewKYs4tdmy7pSls6RZs23SXsyi9w6IObEhiQ0qb47LerW4ys00gfRFiYEcEm89YnRO8zXIvRyqO/kJsyIbpR7C9w6KhEyHbjAvsVaHJz4xXChM79QrOwH/1W2ORRl2WbsC2zB+oEVu80uARi/ZjG4fy+q7HHM7qJnvPcSZhKeS4NCc2ymCjkvPi12NDI7ayNGg3SivxhgqWjmnWEyRJnD2Wti6cpMyiV/lwG1a7/i5sybiClrjCOMJ4fTkEU+ZwqpLd91Wwx0N0aZ5WqH2iWxqPzYorKDRC98Ut4NOINWx4Chv1YvPdd0M8tilRJ3QbSZxmOo0CDgIeF1I4UddGPDZchi1o0So21+29rEWvwAbdQSA6TganRAuOo446zmlpFJTYsAgtBeAaN4jY6CZs+7lr9aCdjQ1VbJKDtGCjKjbo2PYVB7WanX1rFlvmNXBMGfxgeqkDlcIp3WYacZAnsYWlCdjEhZAaNu+Yf2yF/GyziK3doq+Nouz6DeRxjH3TMfisQMxB9nWidct/HOd411zWd13YEG+FfdhIxUZt2PBrsPlm6dtCJff5y8msjIP8FIxb45g73BC/LRZk4/Q47xanw5ZmrvleYaexUQEbC8aDDW/CtiUiKOW8+wJepKqKuJCvTnmk/TFOzUXJnPfPZ0tyOPmBTGCoYGJT4sqT2LiQV2uFDDYqWpRWi5I5m3gMG3H7m/bvkWuFxIwLk5JlV0leeFqVxnusuZ83NJzmE1B2ar+ADW/Bts1Fmiwa6ndJunGTS6+BWlrhPmBFJNwQt+Vqi/I5nMWx9DQIhZhpezO24c/2lBHegc20KNS44tHWYFGQNN2Q873pe6nX0wjJRsivDSs4vdqS4Ybm80L735Ra4Vls362QUq2wiI2exEZZbNwWcvDJDy2N5TwuPHVNoVqUm7TAqqB/23qmES5rSvzmCbG1BbEh77sSNhTiShs2xLChgg1RbIKlBV9QcDpPQzIn2dybR6EZtYZzkpbAaaxuVeKKgA0ZbPQQNopiC61iRbFRIeSJkoPjP3gvaNyTDP4tzOoN2Zo0hKRRQZqAjVRp5D3HE8O2WxQnLEoNFqUzFuWwkTOuMD2a4wWG5sQtTT7JHluZOONsEpb+bdhsaW/Fpv0gg60gzXm1sVDQK4JTCHC2pS0SfPD+XjyisDRyG8CxeUnDRqFaAr3YJGlnsaGALSctgE34EnpZFMjFub+NHK147r822zqnIm/T/KkkFbttOXCjd0FaCpt7VGafU5HLrf9FbFTFpmSH9L3CGAtzxeqqlCVjL/bEjBMoXBPJX/bHg416sXVKg5wRRKYuUyTk4Vdh47a1TTVj1HKV2O5jcIr2lymDAJKsUprIFDRzfxcVG7mwRWutebGhB9vjFsURbO4/AORx566W7LopI82o5litvFUbzHIz4yw42grj2i7DRs9LewZbrtRuThoz+2PCnz4h+sGZ4Bn5NQmkCQWpmpiB2r57OV6vtpPYdIv6sNFRbAmLTtgesCgJjkwez1g1uxMF0Ufoft0LqghMH/PaKHYHGh7ERhQtD3UYG34Ntm10FwK5enVVs1V+I3EF36ytgk0z2O/AFrxg4zS2aCB+CNtkUd51wkR+JJcuiFiuY5EjDqUcJDzlZKBJubLcFXfN0kiWRiVs+GexsZnX5MfpB+icaV/xzu38FYtjvf+sqV++n6349yuxQT2Z4XWydmkTNlSwSfWl+68zrF8VP3drjQJR1nZM2rQWVJB2CNuYHrkQG/Vho+PPuKszKVkfY9VNjewtxMsFW83SvgxUxHYg8LVgw0FsSGPDQWxmbiFvaaibxus4UZKGU9Iq2HAO2yuTeqdFQaiYFI+6B0WvYVAGQvlXGNLy19hjvo/+FDVcJa1s0X8Um1LyrqB4DTVAn7QubZdL+2DLY2ufjRuaK51HdZ5vOG/WQFpS8Pdjo/PYcAobvQub9H4i6HtEi+5M6cS7JC2tjWOZvfxWMEQLNjqCrdFzs+sVj2B7yEHSU6Z98lvBqWpLp6/WC97/IDacwEa3YeMsiub9KqLm7OBjK8WFdpzpcdF623Y+TMutsAEbLseWl3YWWyWuKFX30ivSyoRrOumI7AF0xdQZbfyN7LkD6M3SlgmmsxVq2PLzly5s9DS2WlwRz2xlNSsHEofNIC6cojSkpclHT4OtUEqLlLDJM+u56hXwtEVJOm0/HXN1YZMDS3IqbmMrTULEU7wZzdAPBWdaIXWZWt+ymmmFJFbHykkLYMtbNK5NG+nMrfANFoVxH1ugd7NmvWXNrwpevlboGiyQVHkCiZPxytwCwVYon2k+io2K2BA9fW5ssVxbIT2JTel5U9hkr0ZHF+LJ3/6o9OIUaz+GcHoSkYOp3YMFsWxMFpsmDe7e7WlssS5ELEwTchChUqvsvJVJiFR7IoiThgrsPa0Q8gWDQecdL3Ejp/Oalm6JhZ7Uche2oPNO94O6nBdPYoMH2xKOc4tbiCcGSZyzGa9EBGeXNJqktbRC5dNjzvuCdTk2a8zkGhSoXVFKmtGAZ30pB7FueY/HQrWcJGfueCOMOy+ZuzpfslwO0iRtfBMCrbCALdCFwG/Rx7HZ2aldFhyN1y8524Voa5+RVqiZMh8Loc8f4W2FBrZIK7T32AexdVvUxuZqhbrv9mMLhGNkJCe6ELNIc6QV6lWIYqYmGHZexy96KwR1tkIvtrUbyWILtkL41l1c2Pos2otN8RzHdC+A03FzVsCpQU3O6zoQxOC8Bxs1YQtKy2GjPDbEsFEEGyW6EENySLNrW5m/FYJSedaKNm8rND446ryPYwukELzSPK0Q1BlXItiQ7kLg2BoQygsGW6HyZ0hm+wvSvK3QlhaLhRlsWYs+go0K2KhR27SInrOot/9se7Z0IOw7qx+VhumutYux3SXNg82zyxLt2uDAVqhN1I1zCX+Fs8LdZWbWb1uRdq4V+scXGja6FhsuxWan+g7gLAruPwUz4LxMWiu2I9IuxUZUq/vVM1EL4+wxFE5quxgb3Yat78UXYytO1aKv6xHcXsvlWm24HluP3+FibA89/jtf36DtzED1j2O72qL4Ze5BBNwr+GJtt2P7WLR/XPiR9sH2T2v7PJ/n83yez/N5Ps/n+Tyf5/N8ns/zeT7P5/k8n6f+fLJzfw/bx6KdJC9dmL3Y1Lhc2gdbV0h5C05ELP2sNuDaVnixNK9FcbtFxf8O9GGwFYPaPQT0qLY3OK9b2luw/RGLyg7i+iQ0KY7hpMe0RaX9AWz0t7H5t2ApJ+hdkgHHGWa0SvZaGnAcsAFOSGvBBuAdjdCHjd6FrcWicWySceD6HLMQgMcs7s4zJI0chQAarLIYx3e9jl0/oVEaPW9RRC16MbZMmB6aoKM4kMM/4AyfDk7O20tdPrTShFGV14nNIc2HjVqxecLGfxshfi02xLCpP4DDn62CqzBDDhj/UItGOjsPM1LADnSbNkNaCBv9YWzLB5awjXfm2kXHotigF+cLl1uk/d5hu0aV2vVtvbpRWNXbeTiKkcEot8Q0Qn0Q646CBjYM6gKNUBv7P4qNTmEjHzaEwoqBTbxy0jG8h+mwXzSV6LHThD6bsqXhJQ0mTTkcQmiECWl5bHBjM+agjdj0SN1o0Qkb4CkQfwJbpEAipkP49sgWPx0IvN3rV+1BRJMhszR7igG8nMTvu9g+KJA26cWGBRsmbJTE5pJGpkUhWJRyFnVhw88tTRSxqIHNT3RmCWcuCLpkYhvhOGn0SttnRa5LjaTRDthGOJeCj2KjERvS2KBgQxQbbcHZh026lJZpxQs2hHLY/dgohs1J9OXGEwJHSUjI41qNZsDYM0vyZhBIv8aOb4RYf+6WhsmzHAk0caB/ClvQom5p+207OWxwYqNubKZqKE2QHMszcPfGa4yAS5vsJY68uDtIr+50HlusEVawLeEvj43URvhGbEWLaqrnPNvqz756rlr/AT2ma+MZlSV8FXrd/sH0gx5sy1jhYWx4Fhu3sLAPi2IWXbDBtfDsjcZ+i0IguqzRbNZOVxWWaLIXKEvSME1a13/kpYGTBllaHBu9HxuuwwYXtrQ0h+/KjiCoHlN0ezB0zekMQ9uSpX4EWJKP3HC1sRGCTGkQpGEdUKOKLS1tvhmU7d5y2BDw3bRFH8cm/GiYjQpjwXFtKYFTKIyq3ioMRqMQBcdfaDK0fusvJGlsE6xjowI2ZvJ7DpsuDYZFt16pgo2xqI1NUT3nvcVuNIUTccn7PI2VNmvL4Iw3wj27t9wkhTZsFPXdPWHhwgZ0NUIELLrsuuCwUS82u43KY8nhC26evk7X0OQf8N2CxOBkkxyZVijT9OyDC2Frk4bQ5VHYli6Z5eW0Nor4LjFLV+vXPGdR185GMUWB1ZDsWDGnOW/pKQk/3r/Op1celUbTXWPMLGuPK3jGd4PYcDu2TDTmfDd9mgnT9SLMKBtCTK/R9NxvydwqtwylhZgeksbQjFn6ADY0NUICt3jcgg2pRoglcbB+VTRhy1l02H7zs8FmXirF3AT5a+fQ2Qi/92S+FuFfe3+wZNZo3Qy9XRwUwQnLd0dptGwgnZuVhg0FbGjBhmZsAYsy2CBm1qa4AniPRgZ8F8P/fuBB35Q297BrGgRkDbqSND0DosV3wUyRNyBoaoQIROnbsJGKbYiTQEZaI7Z1mspaFC0WLY2wtn5mJrdtYkfc0OAn4PZ5nf1PloE9hO3WpUZonRRfiK/fBsRgQyM2SmMTLIpyI3RhY4eejEXRbFEfNofkLQyAm0QFNliLGYIlsHl8d3EGcJ1HVBqxG0esxAZB2dvIGSSkDUojdEgLYqM2bD6Lwh8CY+FYYeOzqEvymi8GnwAv05xiGly+S1CjXnA4rSGDCRTSxv0rsDGnR0xsj0iDsAOdx4YUNuSx/R/aolFQ2Os2YgAAAABJRU5ErkJggg=="></div>'+
                                        '<input type="file" id="vy-ms-create-group-chat-trigger-avatar-upload" style="display:none;" onchange="__j(\'#vy_ms_fcov_img_holder_groupchat\').attr(\'src\',window.URL.createObjectURL(this.files[0]));" class="name form-control" name="avatar" accept="image/jpeg,image/png,image/gif" />' +
                                        '</div>' +
                                        
                                        
                                        '</form>',
                                        theme: self.theme(),
                                        buttons: {
                                            formSubmit: {
                                                text: 'Create',
                                                btnClass: 'btn-blue',
                                                action: function () {
                                                    var g_name = this.$content.find('.vy-ms-gname').val();
                                                    var g_parts = this.$content.find('.vy-ms-gparts').val();
                                                    
                                                    if(!$.trim(g_name)){
                                                        $.alert(lang.Messenger_missin_group_name_edit);
                                                        return false;
                                                    }
                                                    
                                                    if(g_name.length < 4 || g_name.length > 15){
                                                        $.alert('Group name must be at least 4 chars and not exceed 15 chars.');
                                                        return false;
                                                    }
                                                     
                                                    if(!$.trim(g_parts)){
                                                        $.alert('Please add some participants to this group.');
                                                        return false;
                                                    }
            
                                                    ajaxLoading();
                                                    $.ajax({
                                                            url: self.ajax_url,
                                                            type: 'post',
                                                            data: new FormData( __j('#vy-ms-create-new-groupchat')[0] ),
                                                            processData: false,
                                                            contentType: false,
                                                            success: function(data) {   
                                                                removeAjaxLoad();
                                                                data = validateJson(data);
                                                                if(data.success == '1'){

                                                                    let e = window.event || $.Event();
                                                                    
                                                                    
                                                                    jAjax(self.ajax_url, 'post', {
                                                                            'cmd': 'get-group-details',
                                                                            'group': escape(data.group_id)
                                                                        }).done(function(group_details) {
                                                                            
                                                                        
                                                                
                                                                    for(var i = 0;i< self.newgchat_sel_users.length;i++){
                                                                        if(socket) socket.emit("user_notification", { to_id: self.newgchat_sel_users[i], user_id: _getCookie("user_id"), type: "new_notification" });
                                                                        setTimeout(function(){
                                                                        self.socket.emit("vy_ms__groupinvitation_sent", JSON.stringify({
                                                                                "User": _U,
                                                                                "Group_data": validateJson(group_details),
                                                                                "Group_id": socketId('GG' + data.group_id),
                                                                                "User_id": socketId(self.newgchat_sel_users[i]),
                                                                                "Group_clean_id": data.group_id,
                                                                                "User_clean_id": self.newgchat_sel_users[i]
                                                                            }));
                                                                        },2000);
                                                                        self.send(false,e,'[group-invitation]'+_U.i+'|'+data.group_id+'[/group-invitation]',self.newgchat_sel_users[i],0,0,1,1);
                                                                        
                                                                    }
                                                                
                                                                    setTimeout(function(){window.location = '/messenger/g/'+data.group_id;},500);
                                                                    
                                                                    $.alert('Success! Group created, please wait...');
                                                                    self.newgchat_sel_users = new Array();
                                                                    });
                                                                    ajaxLoading();
                                                                    
                                                                    
                                                                } else {
                                                                    
                                                                    $.alert(data.msg);
                                                                return false;
                                                                }                                                                   
                                                                      
                                                             }
                                                    });
 
                                                    
                                                    
                                                    
                                                }
                                            },
                                            cancel: function () {
                                                 
                                                self.newgchat_sel_users = new Array();
                                            },
                                        },
                                        onContentReady: function () {
                                            // bind to events
                                            var jc = this;
                                            this.$content.find('form').on('submit', function (e) {
                                                // if the user submits the form by pressing enter in the field.
                                                e.preventDefault();
                                                jc.$$formSubmit.trigger('click'); // reference the button and click it
                                            });
                                        }
                                    });
                        
                    },
                    this.toFullScreen = function(el,evt, new_elem) {

                        el = __j(el);

                        const canFullscreen = (function() {
                            for (const key of [
                                    'exitFullscreen',
                                    'webkitExitFullscreen',
                                    'webkitCancelFullScreen',
                                    'mozCancelFullScreen',
                                    'msExitFullscreen',
                                ]) {
                                if (key in document) {
                                    return true;
                                }
                            }
                            return false;
                        }());
                        let is_fullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

                        __j(document).off('fullscreenchange.exitFromMessenger').on('fullscreenchange.exitFromMessenger', function(e) {

                            if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement){
                                __j('html').removeClass('messenger-fullscreen'); el.removeClass('h4active');
                            }
                            nanoScrollStart();
                        });

                        if (is_fullscreen) {


                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if (document.webkitExitFullscreen) {
                                document.webkitExitFullscreen();
                            } else if (document.msExitFullscreen) {
                                document.msExitFullscreen();
                            }
                            el.removeClass('h4active');
 
                        } else {

                            let _element = __j('body').get(0);

                            if (_element.requestFullscreen) {
                                _element.requestFullscreen();
                            } else if (_element.mozRequestFullScreen) {
                                _element.mozRequestFullScreen();
                            } else if (_element.webkitRequestFullscreen) {
                                _element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                            } else if (_element.msRequestFullscreen) {
                                _element.msRequestFullscreen();
                            } 

                            if (canFullscreen) {  
                                el.addClass('h4active');
                                __j('html').addClass('messenger-fullscreen');
                                nanoScrollStart();

                            } else {
                                self.pmessenger.addClass('vy_ms__fullscreen_notsupported');
                                modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">' + lang.Messenger_fullscreen_not_supporting + '</div>');
                            }

                        }

                    }
};

$.fn.hasScrollBar = function() {
    return this.get(0)
        .scrollHeight > this.height();
}
class EventHandlerClass {
    constructor() {
        this.functionMap = {};
    }

    addEventListener(event, func) {
        this.functionMap[event] = func;
        document.addEventListener(event.split('.')[0], this.functionMap[event]);
    }

    removeEventListener(event) {
        document.removeEventListener(event.split('.')[0], this.functionMap[event]);
        delete this.functionMap[event];
    }
}

(function() {
    var msPointer = window.navigator.msPointerEnabled;

    var touch = {
        start: msPointer ? 'MSPointerDown' : 'touchstart',
        move: msPointer ? 'MSPointerMove' : 'touchmove',
        end: msPointer ? 'MSPointerUp' : 'touchend'
    };

    var prefix = (function() {
        var styles = window.getComputedStyle(document.documentElement, '');
        var pre = (Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1];

        return '-' + pre + '-';
    })();

    var transitionEvent = (function() {
        var t,
            el = document.createElement("fakeelement");

        var transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    })();

    var cssProps = {
        'transition': prefix + 'transition',
        'transform': prefix + 'transform'
    };

    function delegate(event, cbName) {
        document.addEventListener(event, function(e) {
            Swiped._elems.forEach(function(Swiped) {
                var target = e.target;

                while (target) {
                    if (target === Swiped.elem) {
                        Swiped[cbName](e);

                        return false;
                    }
                    target = target.parentNode;
                }

                return false;
            });

        }, {
            passive: false
        });
    }

    function extend() {
        var current = [].shift.call(arguments);
        var options = arguments[0];

        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                current[i] = options[i];
            }
        }

        return current;
    }

    var fn = function() {};

    var Swiped = function(o) {
        var defaultOptions = {
            duration: 200,
            tolerance: 50,
            time: 200,
            dir: 1,
            right: 0,
            left: 0
        };

        o = extend(defaultOptions, o || {});

        this.duration = o.duration;
        this.tolerance = o.tolerance;
        this.time = o.time;
        this.width = o.left || o.right;
        this.elem = o.elem;
        this.list = o.list;
        this.dir = o.dir;
        this.group = o.group;
        this.id = Swiped.elemId++;

        this.onPrompt = typeof o.onOpen === 'function' ? o.onPrompt : fn;
        this.onOpen = typeof o.onOpen === 'function' ? o.onOpen : fn;
        this.onClose = typeof o.onClose === 'function' ? o.onClose : fn;
        this.onCreated = typeof o.onCreated === 'function' ? o.onCreated : fn;

        this.right = o.right;
        this.left = o.left;

        if (
            (o.right > 0 && o.tolerance > o.right) ||
            (o.left > 0 && o.tolerance > o.left)
        ) {
            console.warn('tolerance must be less then left and right');
        }
    };

    Swiped._elems = [];
    Swiped.groupCounter = 0;
    Swiped.elemId = 0;

    Swiped.init = function(o) {
        Swiped.groupCounter++;

        var elems = document.querySelectorAll(o.query);
        var group = [];

        delete o.query;

        [].forEach.call(elems, function(elem) {

            if (__j(elem).hasClass('_touchevent_binded')) return;

            var option = extend({
                elem: elem,
                group: Swiped.groupCounter
            }, o); 

            group.push(new Swiped(option));
            __j(elem).addClass('_touchevent_binded')
        });

        Swiped._bindEvents();
        Swiped._elems = Swiped._elems.concat(group);

        if (group.length === 1) {
            return group[0];
        }

        if (typeof this.onCreated == 'function')
            this.onCreated();

        return group;
    };

    Swiped._closeAll = function(groupNumber) {
        Swiped._elems.forEach(function(Swiped) {
            if (Swiped.group === groupNumber) {
                Swiped.close(true);
            }
        });
    };

    Swiped.prototype.transitionEnd = function(node, cb) {
        var that = this;

        function trEnd() {
            cb.call(that);
            node.removeEventListener(transitionEvent, trEnd);
        }

        node.addEventListener(transitionEvent, trEnd);
    };

    /**
     * swipe.x - initial coordinate Х
     * swipe.y - initial coordinate Y
     * swipe.delta - distance
     * swipe.startSwipe - swipe is starting
     * swipe.startScroll - scroll is starting
     * swipe.startTime - necessary for the short swipe
     * swipe.touchId - ID of the first touch
     */

    Swiped.prototype.touchStart = function(e) {
        var touch = e.changedTouches[0];

        if (e.touches.length !== 1) {
            return;
        }

        this.touchId = touch.identifier;
        this.x = touch.pageX;
        this.y = touch.pageY;
        this.startTime = new Date();

        this.resetValue();


        if (this.list) {
            Swiped._closeAll(this.group);
        } else {
            this.close(true);
        }
    };

    Swiped.prototype.touchMove = function(e) {
        var touch = e.changedTouches[0];

        // touch of the other finger
        if (!this.isValidTouch(e)) {
            return;
        }

        this.delta = touch.pageX - this.x;

        this.dir = this.delta < 0 ? -1 : 1;
        this.width = this.delta < 0 ? this.right : this.left;

        this.defineUserAction(touch);

        if (this.startSwipe) {



            //prevent scroll
            e.preventDefault();
            e.stopPropagation();
            this.move(e);
        }
    };

    Swiped.prototype.touchEnd = function(e) {
        if (!this.isValidTouch(e, true) || !this.startSwipe) {
            return;
        }



        if (Math.abs(this.delta) - 10 > __j('.js_mob_delete_conv_btn').outerWidth())
            return this.onPrompt(e, this, this.elem);
        else
            return this.close();


        // if swipe is more then 150px or time is less then 150ms
        if (this.dir * this.delta > this.tolerance || new Date() - this.startTime < this.time) {
            //this.open();
            this.close();
        } else {
            this.close();

        }



        e.stopPropagation();
        e.preventDefault();
    };

    /**
     * Animation of the opening
     */
    Swiped.prototype.open = function(isForce) {
        this.animation(this.dir * this.width);
        this.swiped = true;

        if (!isForce) {
            this.transitionEnd(this.elem, this.onOpen);
        }

        this.resetValue();
    };

    /**
     * Animation of the closing
     */
    Swiped.prototype.close = function(isForce) {
        this.animation(0);
        this.swiped = false;

        if (!isForce) {
            this.transitionEnd(this.elem, this.onClose);
        }

        this.resetValue();
    };

    Swiped.prototype.toggle = function() {
        if (this.swiped) {
            this.close();
        } else {
            this.open();
        }
    };

    /**
     * reset to initial values
     */
    Swiped.prototype.resetValue = function() {
        this.startSwipe = false;
        this.startScroll = false;
        this.delta = 0;
    };

    Swiped._bindEvents = function() {
        if (Swiped.eventBinded) {
            return false;
        }
        const EventHandler = new EventHandlerClass();

        delegate(touch.move, 'touchMove');
        delegate(touch.end, 'touchEnd');
        delegate(touch.start, 'touchStart');

        Swiped.eventBinded = true;
    };

    /**
     * detect of the user action: swipe or scroll
     */
    Swiped.prototype.defineUserAction = function(touch) {
        var DELTA_X = 10;
        var DELTA_Y = 10;

        if (Math.abs(this.y - touch.pageY) > DELTA_Y && !this.startSwipe) {
            this.startScroll = true;
        } else if (Math.abs(this.delta) > DELTA_X && !this.startScroll) {
            this.startSwipe = true;
        }
    };

    /**
     * Which of the touch was a first, if it's a multitouch
     * touchId saved on touchstart
     * @param {object} e - event
     * @returns {boolean}
     */
    Swiped.prototype.isValidTouch = function(e, isTouchEnd) {
        // take a targetTouches because need events on this node
        // targetTouches is empty in touchEnd, therefore take a changedTouches
        var touches = isTouchEnd ? 'changedTouches' : 'targetTouches';

        return e[touches][0].identifier === this.touchId;
    };

    Swiped.prototype.move = function(e) {
        if ((this.dir > 0 && (this.delta < 0 || this.left === 0)) || (this.dir < 0 && (this.delta > 0 || this.right === 0))) {
            return false;
        }

        var deltaAbs = Math.abs(this.delta);

        if (deltaAbs > this.width) {
            // linear deceleration
            this.delta = this.dir * (this.width + (deltaAbs - this.width) / 8);
        }

        this.animation(this.delta, 0);


    };

    Swiped.prototype.animation = function(x, duration) {
        duration = duration === undefined ? this.duration : duration;
/*
        this.elem.style.cssText = cssProps.transition + ':' + cssProps.transform + ' ' + duration + 'ms; ' +
            cssProps.transform + ':' + 'translate3d(' + x + 'px, 0px, 0px)';*/
            
        __j(this.elem).css({'transition': cssProps.transform + ' ' + duration + 'ms','transform':'translate3d(' + x + 'px, 0px, 0px)'});
    };

    Swiped.prototype.destroy = function(isRemoveNode) {
        var id = this.id;

        Swiped._elems.forEach(function(elem, i) {
            if (elem.id === id) {
                Swiped._elems.splice(i, 1);
            }
        });

        if (isRemoveNode) {
            this.elem.parentNode.removeChild(this.elem);
        }
    };

    // expose Swiped
    window.Swiped = Swiped;
})();
(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.Recorder = f()
    }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function(require, module, exports) {
            "use strict";

            module.exports = require("./recorder").Recorder;

        }, {
            "./recorder": 2
        }],
        2: [function(require, module, exports) {
            'use strict';

            var _createClass = (function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            })();

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.Recorder = undefined;

            var _inlineWorker = require('inline-worker');

            var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var Recorder = exports.Recorder = (function() {
                function Recorder(source, cfg) {
                    var _this = this;

                    _classCallCheck(this, Recorder);

                    this.config = {
                        bufferLen: 4096,
                        numChannels: 2,
                        mimeType: 'audio/wav'
                    };
                    this.recording = false;
                    this.callbacks = {
                        getBuffer: [],
                        exportWAV: []
                    };

                    Object.assign(this.config, cfg);
                    this.context = source.context;
                    this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);

                    this.node.onaudioprocess = function(e) {
                        if (!_this.recording) return;

                        var buffer = [];
                        for (var channel = 0; channel < _this.config.numChannels; channel++) {
                            buffer.push(e.inputBuffer.getChannelData(channel));
                        }
                        _this.worker.postMessage({
                            command: 'record',
                            buffer: buffer
                        });
                    };

                    source.connect(this.node);
                    this.node.connect(this.context.destination); //this should not be necessary

                    var self = {};
                    this.worker = new _inlineWorker2.default(function() {
                        var recLength = 0,
                            recBuffers = [],
                            sampleRate = undefined,
                            numChannels = undefined;

                        self.onmessage = function(e) {
                            switch (e.data.command) {
                                case 'init':
                                    init(e.data.config);
                                    break;
                                case 'record':
                                    record(e.data.buffer);
                                    break;
                                case 'exportWAV':
                                    exportWAV(e.data.type);
                                    break;
                                case 'getBuffer':
                                    getBuffer();
                                    break;
                                case 'clear':
                                    clear();
                                    break;
                            }
                        };

                        function init(config) {
                            sampleRate = config.sampleRate;
                            numChannels = config.numChannels;
                            initBuffers();
                        }

                        function record(inputBuffer) {
                            for (var channel = 0; channel < numChannels; channel++) {
                                recBuffers[channel].push(inputBuffer[channel]);
                            }
                            recLength += inputBuffer[0].length;
                        }

                        function exportWAV(type) {
                            var buffers = [];
                            for (var channel = 0; channel < numChannels; channel++) {
                                buffers.push(mergeBuffers(recBuffers[channel], recLength));
                            }
                            var interleaved = undefined;
                            if (numChannels === 2) {
                                interleaved = interleave(buffers[0], buffers[1]);
                            } else {
                                interleaved = buffers[0];
                            }
                            var dataview = encodeWAV(interleaved);
                            var audioBlob = new Blob([dataview], {
                                type: type
                            });

                            self.postMessage({
                                command: 'exportWAV',
                                data: audioBlob
                            });
                        }

                        function getBuffer() {
                            var buffers = [];
                            for (var channel = 0; channel < numChannels; channel++) {
                                buffers.push(mergeBuffers(recBuffers[channel], recLength));
                            }
                            self.postMessage({
                                command: 'getBuffer',
                                data: buffers
                            });
                        }

                        function clear() {
                            recLength = 0;
                            recBuffers = [];
                            initBuffers();
                        }

                        function initBuffers() {
                            for (var channel = 0; channel < numChannels; channel++) {
                                recBuffers[channel] = [];
                            }
                        }

                        function mergeBuffers(recBuffers, recLength) {
                            var result = new Float32Array(recLength);
                            var offset = 0;
                            for (var i = 0; i < recBuffers.length; i++) {
                                result.set(recBuffers[i], offset);
                                offset += recBuffers[i].length;
                            }
                            return result;
                        }

                        function interleave(inputL, inputR) {
                            var length = inputL.length + inputR.length;
                            var result = new Float32Array(length);

                            var index = 0,
                                inputIndex = 0;

                            while (index < length) {
                                result[index++] = inputL[inputIndex];
                                result[index++] = inputR[inputIndex];
                                inputIndex++;
                            }
                            return result;
                        }

                        function floatTo16BitPCM(output, offset, input) {
                            for (var i = 0; i < input.length; i++, offset += 2) {
                                var s = Math.max(-1, Math.min(1, input[i]));
                                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                            }
                        }

                        function writeString(view, offset, string) {
                            for (var i = 0; i < string.length; i++) {
                                view.setUint8(offset + i, string.charCodeAt(i));
                            }
                        }

                        function encodeWAV(samples) {
                            var buffer = new ArrayBuffer(44 + samples.length * 2);
                            var view = new DataView(buffer);

                            /* RIFF identifier */
                            writeString(view, 0, 'RIFF');
                            /* RIFF chunk length */
                            view.setUint32(4, 36 + samples.length * 2, true);
                            /* RIFF type */
                            writeString(view, 8, 'WAVE');
                            /* format chunk identifier */
                            writeString(view, 12, 'fmt ');
                            /* format chunk length */
                            view.setUint32(16, 16, true);
                            /* sample format (raw) */
                            view.setUint16(20, 1, true);
                            /* channel count */
                            view.setUint16(22, numChannels, true);
                            /* sample rate */
                            view.setUint32(24, sampleRate, true);
                            /* byte rate (sample rate * block align) */
                            view.setUint32(28, sampleRate * 4, true);
                            /* block align (channel count * bytes per sample) */
                            view.setUint16(32, numChannels * 2, true);
                            /* bits per sample */
                            view.setUint16(34, 16, true);
                            /* data chunk identifier */
                            writeString(view, 36, 'data');
                            /* data chunk length */
                            view.setUint32(40, samples.length * 2, true);

                            floatTo16BitPCM(view, 44, samples);

                            return view;
                        }
                    }, self);

                    this.worker.postMessage({
                        command: 'init',
                        config: {
                            sampleRate: this.context.sampleRate,
                            numChannels: this.config.numChannels
                        }
                    });

                    this.worker.onmessage = function(e) {
                        var cb = _this.callbacks[e.data.command].pop();
                        if (typeof cb == 'function') {
                            cb(e.data.data);
                        }
                    };
                }

                _createClass(Recorder, [{
                    key: 'record',
                    value: function record() {
                        this.recording = true;
                    }
                }, {
                    key: 'stop',
                    value: function stop() {
                        this.recording = false;
                    }
                }, {
                    key: 'clear',
                    value: function clear() {
                        this.worker.postMessage({
                            command: 'clear'
                        });
                    }
                }, {
                    key: 'getBuffer',
                    value: function getBuffer(cb) {
                        cb = cb || this.config.callback;
                        if (!cb) throw new Error('Callback not set');

                        this.callbacks.getBuffer.push(cb);

                        this.worker.postMessage({
                            command: 'getBuffer'
                        });
                    }
                }, {
                    key: 'exportWAV',
                    value: function exportWAV(cb, mimeType) {
                        mimeType = mimeType || this.config.mimeType;
                        cb = cb || this.config.callback;
                        if (!cb) throw new Error('Callback not set');

                        this.callbacks.exportWAV.push(cb);

                        this.worker.postMessage({
                            command: 'exportWAV',
                            type: mimeType
                        });
                    }
                }], [{
                    key: 'forceDownload',
                    value: function forceDownload(blob, filename) {
                        var url = (window.URL || window.webkitURL).createObjectURL(blob);
                        var link = window.document.createElement('a');
                        link.href = url;
                        link.download = filename || 'output.wav';
                        var click = document.createEvent("Event");
                        click.initEvent("click", true, true);
                        link.dispatchEvent(click);
                    }
                }]);

                return Recorder;
            })();

            exports.default = Recorder;

        }, {
            "inline-worker": 3
        }],
        3: [function(require, module, exports) {
            "use strict";

            module.exports = require("./inline-worker");
        }, {
            "./inline-worker": 4
        }],
        4: [function(require, module, exports) {
            (function(global) {
                "use strict";

                var _createClass = (function() {
                    function defineProperties(target, props) {
                        for (var key in props) {
                            var prop = props[key];
                            prop.configurable = true;
                            if (prop.value) prop.writable = true;
                        }
                        Object.defineProperties(target, props);
                    }
                    return function(Constructor, protoProps, staticProps) {
                        if (protoProps) defineProperties(Constructor.prototype, protoProps);
                        if (staticProps) defineProperties(Constructor, staticProps);
                        return Constructor;
                    };
                })();

                var _classCallCheck = function(instance, Constructor) {
                    if (!(instance instanceof Constructor)) {
                        throw new TypeError("Cannot call a class as a function");
                    }
                };

                var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);

                var InlineWorker = (function() {
                    function InlineWorker(func, self) {
                        var _this = this;

                        _classCallCheck(this, InlineWorker);

                        if (WORKER_ENABLED) {
                            var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
                            var url = global.URL.createObjectURL(new global.Blob([functionBody], {
                                type: "text/javascript"
                            }));

                            return new global.Worker(url);
                        }

                        this.self = self;
                        this.self.postMessage = function(data) {
                            setTimeout(function() {
                                _this.onmessage({
                                    data: data
                                });
                            }, 0);
                        };

                        setTimeout(function() {
                            func.call(self);
                        }, 0);
                    }

                    _createClass(InlineWorker, {
                        postMessage: {
                            value: function postMessage(data) {
                                var _this = this;

                                setTimeout(function() {
                                    _this.self.onmessage({
                                        data: data
                                    });
                                }, 0);
                            }
                        }
                    });

                    return InlineWorker;
                })();

                module.exports = InlineWorker;
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {}]
    }, {}, [1])(1)
});
(function(a){function b(a,b){var c=this,d,e;return function(){return e=Array.prototype.slice.call(arguments,0),d=clearTimeout(d,e),d=setTimeout(function(){a.apply(c,e),d=0},b),this}}a.extend(a.fn,{debounce:function(a,c,d){this.bind(a,b.apply(this,[c,d]))}})})(jQuery);
