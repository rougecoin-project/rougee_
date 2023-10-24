var gwtlog = new gwtlog();
var unread_messages_by_user = {};
var m_getData = function(){};
var ajax_url = V_HOST+'/vy-messenger-cmd.php';
if(typeof __j == 'undefined'){
   var __j = function(a){return $(a);};
}

if(typeof pushnotif == 'undefined'){
	var pushnotif = function(){};
}

 
function gwtlog() {
    var self = this;
    self.socket_io;
	self.global_hash = 0;
	self.global_last_msg_id = 0;
    self.url = ajax_url;
    self.time = (new Date()).getTime();
    self.mtime = 60000; // 60 sec
    self.last_c = self.last_c || {};
    self.functions = ['mod_messages', 'mod_messenger_aditional_f', 'mod_group_stats', 'update_online_status', /*'mod_online_users'*/];
	self.is_touch = 'ontouchstart' in document.createElement( 'div' );
	self.pushnotif_blocked = false;
	
			setInterval(function(){
				
				self.checkDinCindinCind();
				
			},50000);

    this.startBoot = function() {


            if (typeof _U == 'undefined' || anonym_content) return false;
			
            sio = connectIo();
            self.socket_io = sio;


			self.socket_io.on('error', function(err) {
	 
			console.log("%cMessenger is offline", "color: red; font-size:25px;");
			console.log("%c"+err, "color: red; font-size:18px;");

			});
            self.socket_io.on('connect', function() {

                self.socket_io.emit('connect_user', socketId(), V_WS_ADDR, _U.i, _U.fn);
 
				/*
				if(!self.pushnotif_blocked)
					initPushNotifications().then(function(subscription){     
						 
						if(typeof subscription == 'object') {
						 
							if(subscription.granted == 'yes' && subscription.update == 'yes'){
								self.socket_io.emit('register_push', JSON.stringify(subscription));
							} else if(subscription.granted == 'no')
								self.pushnotif_blocked = true;
							
							
							 else if(subscription.granted == 'no'){ 
								self.socket_io.emit('remove_push', socketId()); 
							}
						}
							
						 
						
					});

				*/

 
 
				// join groups 
				for(var i=0;i<vy_ms__mygroups.length;i++){
					const groupId = vy_ms__mygroups[i].id;
					self.socket_io.emit("vy_ms__joingroup", JSON.stringify({'Room_id': socketId(generateRoomId(0, _U.i, 0, groupId)), 'Group_id_clean': groupId, 'Userid_clean':_U.i, 'Userid': socketId(_U.i)}));
	 
				}
				
	 			// connect peer
				vy_msn_calls = new vy_webrtc_calls();
				vy_msn_calls.connect();
            }); 
/*            self.socket_io.on('disconnect', function() {

                self.socket_io.emit('offline_user', socketId());
 

            }); 
*/
            for (var i = 0; i < self.functions.length; i++)
                self[self.functions[i]](arguments);
 

        },
        this.g = function(data) {

            var send = jAjax(self.url, 'post', data + '&view_as=json&token=' + self.time);

            return send;

        },
		this.groupChatStats = function(group_id){
			
			
			  let data = {'cmd':'group_chat_stats','group':escape(group_id)};
			  let a = jAjax(ajax_url,'post',data);
			  a.done(function(response){
				  
				  let d = validateJson(response);
			 
				  __j('#groupchat_total_members_'+group_id).html(d.total_users+' '+lang.members+',');
				  __j('#groupchat_online_members_'+group_id).html(d.online_users+' '+( d.online_users > 0 ? '<i class="ic-online"></i>' : lang.online));
			  });
			
			
			
		},
		this.update_online_status = function(){
			  let t = self.stitime() / 1.5;
			  jAjax(ajax_url,'post',{'cmd':'update-user-online-status','id':escape(_U.i)});
			  setTimeout(self.update_online_status, t);
			
		},
		this.mod_group_stats = function(){
			
			let t = self.stitime() / 2;
			
			if (!group_chats.length) return setTimeout(self.mod_group_stats, t);
			
			for(var i = 0; i < group_chats.length; i++)
				self.groupChatStats(group_chats[i]);
			
			setTimeout(self.mod_group_stats, t);
			
 
			
		},
        this.mod_notifications = function() {



            var checkForDropDownNotify = function() {


                var user_notif_st = validateJson(_U.notif_settings);
                if (!__j('.notification_box_flying').length && user_notif_st.important_notif_dropdown == "on") {
                    var send = jAjax('/cmd.php', 'post', {
                        'cmd': 'dropdown-notify'
                    });
                    send.done(function(d) {

                        if ($.trim(d) != '' && !__j('#new_top_notify_dropdown').length) {

                            var markup = '<section id="new_top_notify_dropdown"><a href="javascript:void(0);" onclick="gwtlog.closeTopNotifDropDown(this,event);" class="al notif-dropdown-close"></a><ul onclick="gwtlog.openTopNotif();">' + d + '</ul></section>';

                            __j('#notif_flying_box').html(markup);
                        } else if ($.trim(d) != '' && __j('#new_top_notify_dropdown').length) {

                            __j('#new_top_notify_dropdown ul').html(d);

                        }


                    });
                }

            };

            var n_getData = function() {
                var send = self.g('cmd=notifications');

                send.done(function(r) {
                    var d = validateJson(r);

                    if (d['response'] == '1' && d['count'] > 0) {


                        if (d.count !== self.last_c.notif) {
                            __j('.notif_space').closest('li').addClass('__active');
                            __j('.notif_space').html(self.nn(d['count']));
                            self.enable_sound();
                            checkForDropDownNotify();
                        }
                        self.last_c.notif = d.count;

                    } else {
                        __j('.notif_space').closest('li').removeClass('__active');
                        __j('.notif_space').empty();
                        self.last_c.notif = 0;
                    }


                });


            }


            self.socket_io.on('notifications', function(data, userid) {


                n_getData();

            });

            n_getData();
        },
        this.mod_online_users = function() {

            var t = 600000;



            var u_getData = function() {


                if (!my_contacts.length) return setTimeout(u_getData, t);


                var send = self.g('cmd=online&contacts=' + JSON.stringify(my_contacts));

                send.done(function(r) {


                    var r = validateJson(r);

                    if (r['response'] == '1') {
                        var uData = validateJson(r['data']);




                        for (var i = 0; i < uData.length; i++) {


                            // for contacts
                            // assign online status for all contacts
                            var global_ic_class = __j('.global_user_online_' + uData[i].id);
                            if (uData[i].online) {

                                global_ic_class.each(function() {


                                    if (__j(this).hasClass('only_ic'))
                                        __j(this).html('<i class="ic-online"></i>');
                                    else
                                        __j(this).html('<span class="active_user_global"><i class="ic-online"></i><span class="active_user_global_txt">' + lang.active_now + '</span></span>');


                                });


                            } else {

                                global_ic_class.each(function() {


                                    if (__j(this).hasClass('only_ic'))
                                        __j(this).empty();
                                    else
                                        __j(this).html('<span>' + uData[i].online_ago + '</span>');


                                });



                            }
                        }




                    }


                    setTimeout(u_getData, t);


                });

            }


           u_getData();
		 

        },
        this.mod_guests = function() {


            var g_getData = function() {
                var send = self.g('cmd=guests');

                send.done(function(d) {

                    var r = validateJson(d);


                    if (r['response'] == 1 && r['count'] > 0) {

                        if (r.count !== self.last_c.guests)
                            __j('.g_notif_space').html(self.b(r['count']));
                        self.last_c.guests = r.count;
                    } else {
                        __j('.g_notif_space').empty();
                        self.last_c.guests = 0;
                    }


                });
            };

            self.socket_io.on('guests_notif', function(data, userid) {


                g_getData();

            });
            g_getData();
        },
        this.mod_grades = function() {

            var gr_getData = function() {
                var send = self.g('cmd=grades');

                send.done(function(r) {

                    var d = validateJson(r);


                    if (d['response'] == '1' && d['count'] > 0) {


                        if (d.count !== self.last_c.grades)
                            __j('.gr_notif_space').html(self.b(d['count']));

                        self.last_c.grades = d.count;

                    } else {
                        __j('.gr_notif_space').empty();
                        self.last_c.grades = 0;
                    }


                });
            }
            self.socket_io.on('grades_notif', function(data, userid) {


                gr_getData();

            });
            gr_getData();
        },
        this.mod_live_map = function() {


        },
		this.checkDinCindinCind = function(){
				const self = this;
			  let data = {'cmd':'check_count_unread_msg'};
			  let a = jAjax(ajax_url,'post',data);
			  a.done(function(count){
			 
				  self.updateCountMessages(count);
			  });
			
		},
       this.updateCountMessages = function(count, just_active) {


				if(count <= 0) return;

            /*
            	if(just_active) return __j('.messenger_space').closest('li').addClass('__active');
            	
            	var current_bubble_count = parseInt(__j('.messenger_space').find('.lnavMenuCount_redesign').text());
            	
            	if(current_bubble_count != count){
            		
            		if(count > 0)
            		__j('.messenger_space').closest('li').addClass('__active');
            	else
            		__j('.messenger_space').closest('li').removeClass('__active');
            	
            		__j('.messenger_space').html(self.nn( count ));
            
            		self.last_c.messages = count;
            	}
            
            if( parseInt(__j('.messenger_space').find('.lnavMenuCount_redesign').text()) <= 0)
            	__j('.messenger_space').empty();
            
            */
			if(just_active) return;
            var messages_notification_container = __j('.messages-notification-container');
			var mobile_count = __j('#messenger_mob_new_count');

            //messages_notification_container.find('.new-update-alert').removeClass('hidden');
            //messages_notification_container.find('.sixteen-font-size').addClass('unread-update');
            // messages_notification_container.find('.new-update-alert').text(count).show();




            var current_bubble_count = parseInt(messages_notification_container.find('.new-update-alert').text());

            if (current_bubble_count != count) {
				if(isNaN(count))
					count = 0;

				let t_c = current_bubble_count + parseInt(count);
                messages_notification_container.find('.new-update-alert').html(self.nn(t_c));
				mobile_count.show().html(self.nn(t_c));
				
				

                self.last_c.messages = t_c;
                current_messages_number = t_c;
            }

	 
            if (parseInt(messages_notification_container.find('.new-update-alert').text()) <= 0) {

				mobile_count.hide().html(0);
                messages_notification_container.find('.new-update-alert').hide();
                messages_notification_container.find('.sixteen-font-size').removeClass('unread-update');
            }


        },
		this._online_user = function(user_id){
				
               const global_ic_class = __j('.global_user_online_' + user_id);
				 
				global_ic_class.each(function() {

									 
                                    if (__j(this).hasClass('only_ic')) {
								 
										timeago.cancel(__j('.js_vytimeago_uon_'+user_id)[0]);
                                        __j(this).removeClass('js_vytimeago_uon_'+user_id).html('<i class="ic-online"></i>');
										
									} else {
										 
										timeago.cancel(__j('.js_vytimeago_uon_'+user_id)[0]);
                                        __j(this).removeClass('js_vytimeago_uon_'+user_id).html('<span class="active_user_global"><i class="ic-online"></i><span class="active_user_global_txt">' + lang.active_now + '</span></span>');
										
									}

                 });
               const global_ic_class2 = __j('.global_user_2online_' + user_id);
				 
				global_ic_class2.each(function() {

									 
                                    if (__j(this).hasClass('only_ic')) {
								 
										timeago.cancel(__j('.js_vytimeago_2uon_'+user_id)[0]);
                                        __j(this).removeClass('js_vytimeago_2uon_'+user_id).html('<i class="ic-online"></i>');
										
									} else {
										 
										timeago.cancel(__j('.js_vytimeago_2uon_'+user_id)[0]);
                                        __j(this).removeClass('js_vytimeago_2uon_'+user_id).html('<span class="active_user_global"><i class="ic-online"></i><span class="active_user_global_txt">' + lang.active_now + '</span></span>');
										
									}

                 });
		},
		this._offline_user = function(user_id,datetime){
			
			
				 
               const global_ic_class = __j('.global_user_online_' + user_id);
				
                                global_ic_class.each(function() {

									 
                                    if (__j(this).hasClass('only_ic'))
                                        __j(this).empty();
                                    else{
										__j(this).removeClass('js_vytimeago_uon_'+user_id);
                                        __j(this).html('<span class="js_vytimeago_uon_'+user_id+' global_user_online_'+user_id+'" datetime="'+datetime+'" timeago-id="'+user_id+'"></span>');
										const timeago_lang = script_lang || navigator.language.replace('-', '_');

										timeago.render(__j('.js_vytimeago_uon_'+user_id)[0],timeago_lang);
										
										
										
									}

                                });
               const global_ic_class2 = __j('.global_user_2online_' + user_id);
				
                                global_ic_class2.each(function() {

									 
                                    if (__j(this).hasClass('only_ic'))
                                        __j(this).empty();
                                    else{
										__j(this).removeClass('js_vytimeago_2uon_'+user_id);
                                        __j(this).html('<span class="js_vytimeago_2uon_'+user_id+' global_user_2online_'+user_id+'" datetime="'+datetime+'" timeago-id="'+user_id+'"></span>');
										const timeago_lang = script_lang || navigator.language.replace('-', '_');
 
										timeago.render(__j('.js_vytimeago_2uon_'+user_id)[0], timeago_lang);
										
										
										
									}

                                });
		},
		this.mod_messenger_aditional_f = function() {

            var typing_markup = '<div class="typing"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
            var fb_typing_markup = '<div class="vy_ms__ticontainer js__typinggroup">\
									  <div class="vy_ms__tiblock">\
										<div class="vy_ms__tidot"></div>\
										<div class="vy_ms__tidot"></div>\
										<div class="vy_ms__tidot"></div>\
									  </div>\
									</div>';


            // messenger notifications
            self.socket_io.on('messenger_notification', function(Obj) {
 
				var w = Obj.Notif, room_id = Obj.Room, uid = Obj.Userid, categ = Obj.Category, NativeApp = Obj.Nativeapp, Recipient = Obj.Recipient, group_id = Obj.Group_id, page_id = Obj.Page_id;
				

                if (__j('#room_' + room_id).length) {

                    var shortcut_id = __j('.messenger-shortcut-container #room_' + room_id).length ? __j('.messenger-shortcut-container #room_' + room_id).closest('section').attr('id') : false;
                    var is_messenger = __j('.pmessenger #room_' + room_id).closest('.pmessenger');
                    var u_fullname = __j('.ufullname' + room_id).val();


                    switch (categ) {

                        case 'nicknames':
                            var d_w = w.split('*');
                            var new_nickname = d_w[2];



                            if ($.trim(new_nickname)) {
                                is_messenger.find('.xweeWrt').text(new_nickname);
                                __j('#' + shortcut_id).find('.mshortcut-u-name-str>a').text(new_nickname);
                            } else {
                                is_messenger.find('.xweeWrt').text(u_fullname);
                                __j('#' + shortcut_id).find('.mshortcut-u-name-str>a').text(u_fullname);
                            }

                            if (is_messenger.length)
                                messenger.sWriteNotification(w, categ);


                            if (shortcut_id)
								mess_shortcut('mshortcut-' + Recipient).sWriteNotification(w, categ, Recipient);

							
                            messenger.turnOnSound();
                            break;

                        case 'colors': 
           
                            if (is_messenger.length) 
                                messenger.sWriteNotification(w, categ);
						 
							
                            if (shortcut_id) 
                                mess_shortcut(shortcut_id).sWriteNotification(w, categ, shortcut_id);
							 
							
							if(NativeApp == 'yes'){
								
								messenger.setColorFromNativeApp(w.split('*')[2],Recipient);
								
							}

                            messenger.turnOnSound();
                            break;



                    }


                }


            });
            // reaction
            self.socket_io.on('react', function(data) {
				 
				if(data.From != _U.i)
					messenger.SocketAddReaction(data);
				
			});
            // online status
            self.socket_io.on('online_user', function(user_id) {
				 
					self._online_user(user_id);
				
			});

            // offline status
            self.socket_io.on('offline_user', function(user_id) {
					
					self._offline_user(user_id);
				
			});
            // unmute from mongo
            self.socket_io.on('unmute_from_mongo', function(data) {
				messenger.helpphpcron(data);
				
			});
            // unmute from cron tab
            self.socket_io.on('unmute_from_crontab', function(socket_uid, userid, hash, from_id, aditional_data) {
		 
				messenger.ajax_crontab_unmute(aditional_data.recipient_id,aditional_data.group_id,aditional_data.page_id);
			
			});
            // seen
            self.socket_io.on('seen', function(Obj) {
				
				var msg_id = Obj.Msg_id, uid = Obj.Userid, recipient_id = Obj.Recipient_id, recipient_avatar = Obj.Recipient_avatar, page_id = Obj.Page_id, group_id = Obj.Group_id, group_avatar = Obj.Group_avatar;
 
				if(recipient_id == _U.i || msg_id == self.global_last_msg_id) return;
 
				recipient_avatar = group_id > 0 ? decodeURIComponent(group_avatar) : recipient_avatar;
				 
				var seen_markup = '<div title="' + lang.mess_msg_seen + '" rel="tipsy" id="mess_sent_status" class="messenger_sent_Status mess-message-seen"><img src="'+recipient_avatar+'" /></div>';
				let seen_markup_contact = '<div class="_3fx45cc" style="background-image:url('+recipient_avatar+');"></div>';
				var color = chat_default_color;

				var js_roomid = page_id > 0 ? recipient_id+'_'+page_id : (group_id > 0 ? 'GG'+group_id : recipient_id);
                var shortcut_cnt =  __j('#mshortcut-'+js_roomid);
                var shortcut_id = shortcut_cnt.attr('id');

				
 
 
                // for chat
                if (shortcut_cnt.length) {
			
                    let color = __j('#' + shortcut_id).find('#chat-curr-color').val();

					shortcut_cnt.find('.messenger_sent_Status').replaceWith(seen_markup.replace(/%color/g, color));
				  
					shortcut_cnt.find('.pmessenger-message-txt:not(:last-child)').each(function(){
						__j(this).find('.mess-message-seen').remove();
					});
                }

                if (__j('.pmessenger').length) {
                    let color = __j('#mess-curr-color').val();
					recipient_id = group_id > 0 ? 'GG'+group_id : (page_id > 0 ? recipient_id+'_'+page_id : recipient_id);

					__j('[rel="contactid-'+recipient_id+'"]').find('.messenger_sent_Status').replaceWith(seen_markup.replace(/%color/g, color));
				  
					__j('[rel="contactid-'+recipient_id+'"]').find('.pmessenger-message-txt:not(:last-child)').each(function(){
						__j(this).find('.mess-message-seen').remove();
					});
					__j('#contact-'+recipient_id).find('._3fx44cc').html(seen_markup_contact);
 
                }

				messenger.updateSeenInCacheMessages({'page_id':page_id,'group_id':group_id,'user_id':recipient_id});
				self.global_last_msg_id = msg_id;

            });

            // delete message for both
            self.socket_io.on('delete_message_for_everyone', function(Data) {
				let _body = __j('body');
                if (_body.find('#msg_' + Data.Msg_id).length)
                    _body.find('#msg_' + Data.Msg_id).find('.messenger_text_col').html('<div class="txt_pmessenger-text mess-msgs-cnt-rows require-bg"><i>' + lang.pm_deleted_succ + '</i></div>');
				if (_body.find('[data-unsettled-msg-id="'+Data.Msg_Unsettled_id+'"]').length)
					_body.find('[data-unsettled-msg-id="'+Data.Msg_Unsettled_id+'"]').find('.messenger_text_col').html('<div class="txt_pmessenger-text mess-msgs-cnt-rows require-bg"><i>' + lang.pm_deleted_succ + '</i></div>');
				
				messenger.deleteMessageFromCacheConversation(Data.Cache_delete_data);
				console.log(Data.Cache_delete_data);
				
            }); 
			
			// offline members in group
			self.socket_io.on('vy_ms__group_user_offline', function(userid){
				if(userid == _U.i) return;
				let u = __j('.js__group_user_online_'+userid);
				 
				u.closest('.js__groupchat_online_member').addClass('_offline');

				u.html('offline');
				
				if(u.closest('#messenger_aria_group_members').children().length)
                            tinysort(u.closest('#messenger_aria_group_members').children(), {
                                data: 'timestamp',
                                order: 'desc',
                                ignoreDashes: true
                            });
			});
			// online members in group
			self.socket_io.on('vy_ms__group_user_online', function(userid){
				if(userid == _U.i) return;
				let u = __j('.js__group_user_online_'+userid);
				u.html(lang.active_now);
				u.closest('.js__groupchat_online_member').removeClass('_offline');
				u.closest('a').removeAttr('data-timestamp').attr('data-timestamp',Math.floor(Date.now() / 1000));
				if(u.closest('#messenger_aria_group_members').children().length)
                            tinysort(u.closest('#messenger_aria_group_members').children(), {
                                data: 'timestamp',
                                order: 'desc',
                                ignoreDashes: true
                            });

			});
			
			// group update nicknames 
			self.socket_io.on('vy_ms__groupUpdateNickNames',function(obj){
				
				let o = validateJson(obj);
				let members_cnt = __j('.js__mess_aria_group_members_'+obj.Group_clean_id);
				if(members_cnt.length){
					
					members_cnt.find('#vy_ms__groupchat_member_online_'+obj.Userid+' .js__vy_ms__gchatmembernickname').text(decodeURIComponent(obj.Nickname));
					
				}

			});
			// clean gorup
			self.socket_io.on('vy_ms__group_clean',function(obj){
			 
				let cnt = __j('#mshortcut-'+obj.Group_clean_id).length && !__j('html').hasClass('messenger-window') ? __j('#mshortcut-'+obj.Group_clean_id) : __j('.pmessenger'); 
				
				cnt.find('#messenger-nano-content-fullheight').empty();//.html('<div class="vy_ms__group_cleared js__vy_ms__group_cleared">'+lang.Messenger_group_clear+'</div>');
			});
			// notifications in group
			self.socket_io.on('vy_ms__group_notifications',function(obj){
				
				 
				
				if(obj.die){

					if(!obj.shortcut_id){
						
						__j('.contact_groupid_'+obj.Group_clean_id.replace('GG','')).each(function(){__j(this).parent().remove();});
						setTimeout(function(){messenger.firstConvClick();},200);
					
					} else {

						// for shortcut 
						mess_shortcut(obj.shortcut_id).outFromGroup(lang[obj.notification].replace('%username',obj.arg.username));
					}
					
					return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">'+lang[obj.notification].replace('%username',obj.arg.username)+'</div>');
					
				}
				
				
				let group_notification_markup = '<div class="vy_ms__group_notification vy_ms__groupusermsgs"><span><img src="'+obj.arg.avatar+'" />'+lang[obj.notification].replace('%username','<A href="/vyuser/'+obj.arg.id+'">'+obj.arg.username+'</a>')+'</span></div>';
				//if(obj.shortcut_id > 0){
					
					// groups shortcut notification
					
				//} else {
					
					__j('#room_'+obj.Group_clean_id).find('#messenger-nano-content-fullheight').append(group_notification_markup);
					
					messenger.scrollChat(1);
				//}
				
			});
			// remove member from group
			self.socket_io.on('vy_ms__group_remove_member',function(obj){
				
				 
					
					let exit_by = obj.hasOwnProperty('own_exit') ? lang.Messenger_successfull_left_group : lang.Messenger_you_have_been_removed_from_group;
					
					if(!obj.shortcut_id && __j('.pmessenger').length){
						
						__j('.contact_groupid_'+obj.Group_clean_id.replace('GG','')).each(function(){__j(this).parent().remove();});
						if(obj.next_conversation == 'yes') setTimeout(function(){messenger.firstConvClick();},200);
					
					} else {
						
						// for shortcut 
						mess_shortcut(obj.shortcut_id).outFromGroup(exit_by);
					}
					
					return modernPopup(function() {}, 1, '<div class="vy_ms__moderpopup_err">'+exit_by+'</div>');
					
 
				
			});
            // typing in groups
            self.socket_io.on('vy_ms__groups_typing', function(obj) {
 
  
				if(obj.Recipient == _U.i) return;
 
				let room_messages = __j('.pmessenger #room_' + obj.Room);
                let shortcut_room = __j(".messenger-shortcut#room_" + obj.Room).closest('section');
				let left_contact  = __j("#contact-"+obj.Room);
				let group_header_stats = __j('#groupchat_header_stats_'+obj.Room);
				let gr_typing_users = obj.typing_users.join(', ');
				
                // for messenger

				// if contact is not opened
				if(left_contact.length){
				
					if(obj.typing_users.length){
 
						
						 
						left_contact.addClass('__typing');
						
						if(!left_contact.find('#vy_ms__livetyping_contact_'+obj.Room).length)
							left_contact.find('.pmessenger-contact-last-msg-time').prepend('<div class="pmessenger-a-contact-livetyping" id="vy_ms__livetyping_contact_'+obj.Room+'">'+fb_typing_markup+' <span class="vy__js__typing_group_usernames">'+obj.typing_users.join(', ')+'</span></div>');
						else
							left_contact.find('.vy__js__typing_group_usernames').html(obj.typing_users.join(', '));
						 
					} else {
					
						left_contact.removeClass('__typing').find('#vy_ms__livetyping_contact_'+obj.Room).remove();
					
					}
					
				}
				
                if (room_messages.length) {


                    /*if (obj.Typing == 'yes'){

                        var messages_col = room_messages.find('#messages-tick').find('.nano-content');
                        var typing_block = messages_col.find('.js__typinggroup');
                        if (!typing_block.length) {
							
                            messages_col.append('<div class="vy__js__typingingroup">'+fb_typing_markup+' <span class="vy__js__typing_group_usernames">'+obj.typing_users.join(', ')+'</span></div>');

                            messenger.scrollChat(1);
                        }

                    } else {
						
                        room_messages.find('.vy__js__typingingroup').remove();

                    }*/
 
					var messages_col = room_messages.find('#pmessenger-contact-header');
					var typing_block = messages_col.find('.js__typinggroup');
					
					
					if (obj.typing_users.length) {
						group_header_stats.find('.js__group_chat_typing').removeClass('__none');
						group_header_stats.find('.vy__js__typing_group_usernames').html(gr_typing_users);
						group_header_stats.find('.js__group_chat_stats-inner').hide();
						if(!group_header_stats.find('.js__typinggroup').length) group_header_stats.find('.js__groupstyping_markup').html(fb_typing_markup);
						
					
					} else {
						group_header_stats.find('.js__group_chat_typing').addClass('__none');
						group_header_stats.find('.vy__js__typing_group_usernames').empty();
						group_header_stats.find('.js__group_chat_stats-inner').show();
					 
					}
                }


                // for chat
                if (shortcut_room.length) { 

                    var shortcut_id = shortcut_room.attr('id');
					var messages_col = shortcut_room.find('.nano-content');
					var typing_block = messages_col.find('.js__typinggroup');
					
					
					if (obj.typing_users.length) {
						group_header_stats.find('.js__group_chat_typing').removeClass('__none');
						group_header_stats.find('.vy__js__typing_group_usernames').html(gr_typing_users);
						group_header_stats.find('.js__group_chat_stats-inner').hide();
						if(!group_header_stats.find('.js__typinggroup').length) group_header_stats.find('.js__groupstyping_markup').html(fb_typing_markup);
						
					
					} else {
						group_header_stats.find('.js__group_chat_typing').addClass('__none');
						group_header_stats.find('.vy__js__typing_group_usernames').empty();
						group_header_stats.find('.js__group_chat_stats-inner').show();
					 
					}
 
                }
            });
			
 
            // typing
            self.socket_io.on('typing', function(obj) {
 
 
				var room_messages = __j('.pmessenger #room_' + obj.Room);
                var shortcut_room = __j(".messenger-shortcut#room_" + obj.Room).closest('section');
				var left_contact  = __j("#contact-"+obj.Recipient);
                // for messenger
 
				// if contact is not opened
				if(left_contact.length){
				
					if(obj.Typing == 'yes'){
						
						if(!left_contact.find('#vy_ms__livetyping_contact_'+obj.Recipient).length){
						left_contact.addClass('__typing');
						
						left_contact.find('.pmessenger-contact-last-msg-time').prepend('<div class="pmessenger-a-contact-livetyping2" id="vy_ms__livetyping_contact_'+obj.Recipient+'">'+fb_typing_markup+'</div>');
						}
					} else {
					
						left_contact.removeClass('__typing').find('#vy_ms__livetyping_contact_'+obj.Recipient).remove();
					
					}
					
				}
				
                if (room_messages.length) {


                    if (obj.Typing == 'yes') {

                        var messages_col = room_messages.find('#messages-tick').find('.nano-content');
                        var typing_block = messages_col.find('.typing');
                        if (!typing_block.length) {
							
                            messages_col.append(typing_markup);

                            messenger.scrollChat(1);
                        }

                    } else {
						
                        room_messages.find('.typing').remove();

                    }

                }


                // for chat
                if (shortcut_room.length) {

                    var shortcut_id = shortcut_room.attr('id');



                    if (obj.Typing == 'yes') {

                        var messages_col = shortcut_room.find('.nano-content');
                        var typing_block = messages_col.find('.typing');
                        if (!typing_block.length) {
                            messages_col.append(typing_markup);

                            messenger_shortcut.scrollChat(shortcut_id, 1);
                        }

                    } else {
                        shortcut_room.find('.typing').remove();

                    }
                }
            });

        },
        this.mod_messages = function() {

            var _this = this;


			var dump = function(arr, level) {
				var dumped_text = "";
				if (!level)
					level = 0;

				// The padding given at the beginning of the line.
				var level_padding = "";

				for (var j = 0; j < level + 1; j++)
					level_padding += "  ";

				if (typeof(arr) == 'object') { // Array/Hashes/Objects

					for (var item in arr) {

						var value = arr[item];

						if (typeof(value) == 'object') { // If it is an array,
							dumped_text += level_padding + "'" + item + "' ...\n";
							dumped_text += dump(value, level + 1);
						} else {
							dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
						}
					}
				} else { // Stings/Chars/Numbers etc.
					dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
				}
				return dumped_text;
			}

            m_getData = function(hash,userid,page_id) {
 
                var messages_notification_container = __j('.messages-notification-container');
				var mobile_count = __j('#messenger_mob_new_count');
				
                var send = page_id ? self.g('cmd=live-messages&page='+escape(page_id)) : self.g('cmd=live-messages&recipient='+escape(userid));

                send.done(function(r) {
					

                    var d = validateJson(r);
                    msgs_count = 0;





                    if (d['response'] == '1' && d['count'] > 0) {
 

                        d.count = messenger.appendNewMessages(d.messages, d.user, d.count);
						 
						unread_messages_by_user[userid] = d.user_count;

                        if (d.count > 0 && d.count != self.last_c.messages)
                            self.updateCountMessages(d.count);
                        else if (d.count > 0 && d.count == self.last_c.messages)
                            self.updateCountMessages(d.count, 1);

						if(self.is_touch && __j('.pmessenger').length && tonum(__j('.pmessenger').attr('id')) ==  d.from_user)
							return;
						
						let total_c = parseInt(messages_notification_container.find('.new-update-alert').text());
						let t_c = isNaN(total_c) && total_c > 0 ? total_c + parseInt(d.count) : d.count;
                        messages_notification_container.find('.new-update-alert').removeClass('hidden');
                        messages_notification_container.find('.sixteen-font-size').addClass('unread-update');
                        messages_notification_container.find('.new-update-alert').text(t_c).show();
						mobile_count.text(t_c).show();
						
 
                        self.last_c.messages = d.count;
                        current_messages_number = d.count;
						global_messenger_count = d.count;
                    } else {


                        messages_notification_container.find('.new-update-alert').hide();
                        messages_notification_container.find('.sixteen-font-size').removeClass('unread-update');
						mobile_count.text(0).hide();
                        current_messages_number = 0;

                        //__j('.messenger_space').empty();
                        self.last_c.messages = 0;
						global_messenger_count = 0;
                    }


                });


				self.global_hash[userid] = hash;

            };
			
			this.updateTotalMessages = function(){
				
                var messages_notification_container = __j('.messages-notification-container');
				var mobile_count = __j('#messenger_mob_new_count');
				
				let count = 0;
				
				for(var key in g_messenger_count) {
					count += g_messenger_count[key];
				}
	 
				if(count > 0){
						let total_c = parseInt(messages_notification_container.find('.new-update-alert').text());
						let t_c = isNaN(total_c) && total_c > 0 ? total_c + parseInt(count) : count;
                        messages_notification_container.find('.new-update-alert').removeClass('hidden');
                        messages_notification_container.find('.sixteen-font-size').addClass('unread-update');
                        messages_notification_container.find('.new-update-alert').text(t_c).show();
						mobile_count.text(t_c).show();
					
					
				} else {
					
					
                        messages_notification_container.find('.new-update-alert').hide();
                        messages_notification_container.find('.sixteen-font-size').removeClass('unread-update');
						mobile_count.text(0).hide();
					
					
				}
				
			},
			this.countMessages = function (message,user,count){
				
				
				
                var messages_notification_container = __j('.messages-notification-container');
				var mobile_count = __j('#messenger_mob_new_count');
				
				 

                    msgs_count = 0;
  

                    if (count > 0) {

 


                        count = messenger.appendNewMessages2(message, user, count);
						 


                        if (count > 0 && count != self.last_c.messages)
                            self.updateCountMessages(count);
                        else if (count > 0 && count == self.last_c.messages)
                            self.updateCountMessages(count, 1);

						if(self.is_touch && __j('.pmessenger').length && tonum(__j('.pmessenger').attr('id')) ==  user.id)
							return;
					
						let total_c = parseInt(messages_notification_container.find('.new-update-alert').text());
						let t_c = isNaN(total_c) && total_c > 0 ? total_c + parseInt(count) : count;
						
					if(t_c > 0){
						
                        messages_notification_container.find('.new-update-alert').removeClass('hidden');
                        messages_notification_container.find('.sixteen-font-size').addClass('unread-update');
                        messages_notification_container.find('.new-update-alert').text(t_c).show();
						mobile_count.text(t_c).show();
					}
 
                        self.last_c.messages = t_c;
                        current_messages_number = t_c;
						global_messenger_count = t_c;
                    } else {


                        messages_notification_container.find('.new-update-alert').hide();
                        messages_notification_container.find('.sixteen-font-size').removeClass('unread-update');
						mobile_count.text(0).hide();
                        current_messages_number = 0;

                        //__j('.messenger_space').empty();
                        self.last_c.messages = 0;
						global_messenger_count = 0;
                    }

 

				
			}
			
 
			
            self.socket_io.on('vy_android_newmsg', function(Obj) {
 
           
				// stop double messages
				if(self.global_hash.hasOwnProperty(Obj.From) == Obj.Hash) return;
 
                    m_getData(Obj.Hash,Obj.From,false);
 

				
					self.global_hash[Obj.From] = Obj.Hash;
            });
			
			
			self.socket_io.on('vy_new_message', function(obj) {
				
 
				// if mute, refuse geting notification
				if( ms_muted_contacts.contacts.length > -1 )
				{
					for(var j=0;j<ms_muted_contacts.contacts.length;j++)
					if( ms_muted_contacts.contacts[j]['id'] == obj.Data.user.id)
						return;
					
				}
		 
				// stop double messages
				if(self.global_hash.hasOwnProperty(obj.From) == obj.Hash) return;
				
				let user = obj.Data.user;
				let message = obj.Data.msg;
				
				let total_count = 0;
				
				let key_id = message.page_id > 0 ? user.id+'_'+message.page_id : user.id;
 
				if(g_messenger_count.hasOwnProperty(key_id))
					g_messenger_count[key_id] += 1;
				else
					g_messenger_count[key_id] = 1;
				



				for(var key in g_messenger_count) {
					total_count += g_messenger_count[key];
				}
 
				unread_messages_by_user[key_id] = total_count;
				self.countMessages(message,user,total_count);	
 
				//pushnotif(message,user,g_messenger_count[key_id]);
				
				
				self.global_hash[obj.From] = obj.Hash;
			});
			// invitation received
			self.socket_io.on('vy_ms__groupinvitation_sent', function(data) { 


				 // from wowonder
				 Wo_AcceptFollowGroupRequest = function(group_id) { 
					  var main_container = $('.user-group-request-' + group_id);
					  var follow_main_container = main_container.find('#delete-' + group_id);
					  Wo_progressIconLoader(follow_main_container);
					  $.get(Wo_Ajax_Requests_File(), {
						f: 'chat',
						s: 'accept_group_request',
						group_id: group_id
					  }, function (data) {
						if(data.status == 200) {
						  main_container.remove();
						  self.socket_io.emit("vy_ms__joingroup", JSON.stringify({'Room_id': socketId(generateRoomId(0, _U.i, 0, group_id)), 'Group_id_clean': group_id, 'Userid_clean':_U.i, 'Userid': socketId(_U.i)}));
 
						}
					  });
				}

	
			});
			self.socket_io.on('vy_ms__group_message', function(obj) { 

				// if mute, refuse geting notification
				if( ms_muted_contacts.groups.length > -1 )
				{
					for(var j=0;j<ms_muted_contacts.groups.length;j++)
					if( ms_muted_contacts.groups[j]['id'] == obj.Data.msg.group_id)
						return;
					
				}
 
				let user_socketId = socketId(_U.i);
				let from_user_id = obj.From;
				
				// stop seeing own message
				if(user_socketId == from_user_id) return;
 
				// stop double messages
				if(self.global_hash.hasOwnProperty(obj.From) == obj.Hash) return;
			 
				let user = obj.Data.user;
				let message = obj.Data.msg;
				
				let total_count = 0;
				
				let key_id = 'GG'+message.group_id;
 
				if(g_messenger_count.hasOwnProperty(key_id))
					g_messenger_count[key_id] += 1;
				else
					g_messenger_count[key_id] = 1;
				
				

				for(var key in g_messenger_count) {
					total_count += g_messenger_count[key];
				}
 
		 
				self.countMessages(message,user,total_count);	
 
				
				
				
				self.global_hash[obj.From] = obj.Hash;
			});
			

            self.socket_io.on('wo_messages_notif', function(userid){

				

				if(__j('.wo_kb_msg_page').length){
					
					var f = Wo_getNewMessages;
					f();
				}
					
				
				 

			});


           // m_getData();
        },
        this.nn = function(c) {
            c = c > 99 ? '99+' : c;
            return c;
        },
        this.enable_sound = function() {
            var notif_sound = "/cmd/sounds/pop_cork";
            var user_notif_st = validateJson(_U.notif_settings);

            if (user_notif_st.notification_sound == "on") {
                __j('#sound_notif_new_ntf').remove();

                __j('<audio id="sound_notif_new_ntf" autoplay="true" style="display:none;">\
						<source src="' + notif_sound + '.ogg" type="audio/ogg">\
						<source src="' + notif_sound + '.mp3" type="audio/mpeg">\
						</audio>').appendTo('body');
                setTimeout(function() {
                    __j('#sound_notif_new_ntf').remove();

                }, 1500);

            }
        },

        self.closeTopNotifDropDown = function(el, ev) {
            ev.preventDefault();
            __j(el).closest('#new_top_notify_dropdown').remove();

        },



        self.openTopNotif = function() {

            __j('#new_top_notify_dropdown').remove();
            __j('.top_notifa').trigger('click');
        },
        /** bubble **/
        this.b = function(c) {

            var n_bubble = '<div class="lnavMenuCount zoomIn animated">+' + c + '</div>';


            return n_bubble;
        },
        /** generate timer **/
        this.stitime = function() {
            var min = 15000,
                max = self.mtime;
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        this.getCounts = function() {
            return self.last_c;

        }




}
global_emit = function(uid) {

  


	  var websocket_data = {};
	  websocket_data['event'] = "messages_notif";
	  websocket_data['userid'] = uid;
 
 
	   window.sio.emit("wo_messages_notif",uid);
 

		$.ajax({
				url: ajax_url,
				type: "post",
				data: {'cmd':'emit','wdata':websocket_data} 
			});


}

__j(document).ready(gwtlog.startBoot());